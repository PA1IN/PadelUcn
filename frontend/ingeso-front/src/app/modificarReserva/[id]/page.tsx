"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useReservaPorId, useModificarReserva } from "@/hooks/useReserva"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useObtenerSaldo } from "@/hooks/useSaldo"
import { useEquipamiento } from "@/hooks/useEquipamiento"

export default function ModificarReserva() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const idReserva = Number(searchParams.get("id"))

  const { data: reservaData, isLoading } = useReservaPorId(idReserva)
  const { data: user } = useUserProfile()
  const { data: saldo, refetch: refetchSaldo } = useObtenerSaldo()
  const { data: equipamiento } = useEquipamiento()

  const modificarReserva = useModificarReserva(user?.rut || "")

  const [fecha, setFecha] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [horaTermino, setHoraTermino] = useState("")
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState<
    { id: number; cantidad: number }[]
  >([])

  useEffect(() => {
    if (reservaData) {
      setFecha(reservaData.fecha)
      setHoraInicio(reservaData.hora_inicio)
      setHoraTermino(reservaData.hora_termino)
      setEquipamientoSeleccionado(
        reservaData.equipamiento?.map((eq: any) => ({
          id: eq.id,
          cantidad: eq.cantidad,
        })) || []
      )
    }
  }, [reservaData])

  const calcularCostoTotal = () => {
    return equipamientoSeleccionado.reduce((total, item) => {
      const eq = equipamiento?.find(e => e.id_equipamiento === item.id)
      return total + (eq?.costo || 0) * item.cantidad
    }, 0)
  }

  const handleModificar = () => {
    if (!user || !reservaData) return

    const nuevoCosto = calcularCostoTotal()
    if (saldo !== undefined && saldo < nuevoCosto) {
      alert("Saldo insuficiente para modificar la reserva con el nuevo equipamiento.")
      return
    }

    modificarReserva.mutate(
      {
        id: idReserva,
        data: {
          rut_usuario: user.rut,
          fecha,
          hora_inicio: horaInicio,
          hora_termino: horaTermino,
          numero_cancha: reservaData.numero_cancha,
          equipamiento: equipamientoSeleccionado.map(eq => {
            const encontrado = equipamiento?.find(e => e.id_equipamiento === eq.id)
            return {
              ...eq,
              costo: encontrado?.costo || 0,
            }
          })
        }
      },
      {
        onSuccess: () => {
          alert("Reserva modificada con éxito.")
          refetchSaldo()
          router.push("/reservas")
        },
        onError: () => {
          alert("Error al modificar la reserva.")
        }
      }
    )
  }

  const actualizarCantidad = (id: number, cantidad: number) => {
    setEquipamientoSeleccionado((prev) => {
      const actualizado = prev.map((item) =>
        item.id === id ? { ...item, cantidad } : item
      )
      const existe = prev.some((item) => item.id === id)
      return existe
        ? actualizado
        : [...prev, { id, cantidad }]
    })
  }

  if (isLoading) return <p className="p-4">Cargando datos de reserva...</p>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleModificar()
        }}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center text-purple-600">
          Modificar Reserva
        </h1>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha</label>
          <Input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hora Inicio
            </label>
            <Input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hora Término
            </label>
            <Input
              type="time"
              value={horaTermino}
              onChange={(e) => setHoraTermino(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Equipamiento
          </label>
          {equipamiento?.map((eq) => {
            const seleccionado = equipamientoSeleccionado.find((e) => e.id === eq.id_equipamiento)
            const cantidad = seleccionado?.cantidad || 0
            return (
              <div key={eq.id_equipamiento} className="flex items-center justify-between">
                <span>{eq.nombre}</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => actualizarCantidad(eq.id_equipamiento, Math.max(cantidad - 1, 0))}
                  >
                    -
                  </Button>
                  <span>{cantidad}</span>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => actualizarCantidad(eq.id_equipamiento, cantidad + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-right font-semibold">
          Total a pagar: ${calcularCostoTotal()}
        </div>

        <Button type="submit" className="w-full bg-purple-600 text-white">
          Guardar Cambios
        </Button>
      </form>
    </div>
  )
}
