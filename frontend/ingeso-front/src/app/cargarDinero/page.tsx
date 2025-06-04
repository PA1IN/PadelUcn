
"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useActualizarSaldo } from "@/hooks/useActualizarSaldo"
import { useUserProfile } from "@/hooks/useUserProfile"
import { CreditCard, ArrowRight, Check, Wallet } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function CargarDinero() {
  const router = useRouter()
  const { data: usuario } = useUserProfile()
  const actualizarSaldo = useActualizarSaldo()
  const [monto, setMonto] = useState<number>(0)
  const [numeroTarjeta, setNumeroTarjeta] = useState("")
  const [nombreTitular, setNombreTitular] = useState("")
  const [fechaExpiracion, setFechaExpiracion] = useState("")
  const [cvv, setCvv] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const montosPredefinidos = [5000, 10000, 20000, 50000]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (monto <= 0) throw new Error("El monto debe ser mayor a cero")
      if (numeroTarjeta.length < 16) throw new Error("Número de tarjeta inválido")
      if (nombreTitular.trim() === "") throw new Error("Ingrese el nombre del titular")
      if (fechaExpiracion.length < 5) throw new Error("Fecha de expiración inválida")
      if (cvv.length < 3) throw new Error("CVV inválido")

      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (usuario?.rut) {
        await actualizarSaldo.mutateAsync({ rut: usuario.rut, monto })
        toast({
          title: "Recarga exitosa",
          description: `Has cargado $${monto.toLocaleString()}.`,
          action: {
            label: <Check className="h-4 w-4 text-green-500" />,
            onClick: () => {},
          }
        })
        router.push("/home")
      } else {
        throw new Error("No se pudo actualizar el saldo")
      }
    } catch (err) {
      toast({
        title: "Error al cargar",
        description:
          err instanceof Error ? err.message : "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMontoClick = (valor: number) => setMonto(valor)

  const formatTarjeta = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0; i < match.length; i += 4) parts.push(match.substring(i, i + 4))
    return parts.length ? parts.join(" ") : value
  }

  const formatFechaExpiracion = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    return v.length >= 2 ? `${v.substring(0, 2)}/${v.substring(2, 4)}` : v
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-purple-600 p-4 text-white">
          <div className="flex items-center">
            <button onClick={() => router.push("/home")} className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Cargar Dinero</h1>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">Saldo actual:</span>
            </div>
            <span className="text-lg font-bold text-green-600">${usuario?.saldo.toLocaleString()}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto a cargar</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input
                  type="number"
                  value={monto || ""}
                  onChange={(e) => setMonto(Number(e.target.value))}
                  className="pl-8 w-full border rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ingrese el monto"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montos sugeridos</label>
              <div className="grid grid-cols-2 gap-2">
                {montosPredefinidos.map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => handleMontoClick(valor)}
                    className={`py-2 rounded-md text-sm font-medium ${
                      monto === valor ? "bg-purple-100 text-purple-700 border border-purple-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    ${valor.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-purple-500" /> Datos de la tarjeta
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de tarjeta</label>
                  <input
                    type="text"
                    value={numeroTarjeta}
                    onChange={(e) => setNumeroTarjeta(formatTarjeta(e.target.value))}
                    className="w-full border rounded-md p-2"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del titular</label>
                  <input
                    type="text"
                    value={nombreTitular}
                    onChange={(e) => setNombreTitular(e.target.value)}
                    className="w-full border rounded-md p-2"
                    placeholder="Como aparece en la tarjeta"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de expiración</label>
                    <input
                      type="text"
                      value={fechaExpiracion}
                      onChange={(e) => setFechaExpiracion(formatFechaExpiracion(e.target.value))}
                      className="w-full border rounded-md p-2"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                      className="w-full border rounded-md p-2"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || monto <= 0}
              className={`w-full py-3 rounded-md text-white font-medium ${
                isLoading || monto <= 0 ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isLoading ? "Procesando..." : (
                <span className="flex justify-center items-center gap-2">
                  Cargar ${monto.toLocaleString()} <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-500 text-center">
            Los pagos son procesados de forma segura. No almacenamos los datos de tu tarjeta.
          </p>
        </div>
      </div>
    </div>
  )
}
