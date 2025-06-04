"use client"

import { useRouter } from "next/navigation"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Wallet, Calendar, FileText, LogOut } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const { data: usuario, isLoading } = useUserProfile()

  if (isLoading) {
    return <div className="p-6">Cargando datos...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-purple-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Bienvenido, {usuario?.nombre}</h1>
          <p className="text-sm">Tu RUT: {usuario?.rut}</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-6 w-6 text-gray-500 mr-2" />
              <span className="text-gray-700">Saldo:</span>
            </div>
            <span className="text-lg font-bold text-green-600">${usuario?.saldo?.toLocaleString()}</span>
          </div>

          <button
            onClick={() => router.push("/cargar-dinero")}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg flex items-center justify-center hover:bg-purple-700"
          >
            <Wallet className="h-5 w-5 mr-2" /> Cargar Dinero
          </button>

          <button
            onClick={() => router.push("/reservaTabla")}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700"
          >
            <Calendar className="h-5 w-5 mr-2" /> Reservar Cancha
          </button>

          <button
            onClick={() => router.push("/verReservas")}
            className="w-full py-3 px-4 bg-teal-600 text-white rounded-lg flex items-center justify-center hover:bg-teal-700"
          >
            <FileText className="h-5 w-5 mr-2" /> Ver Reservas
          </button>

          <button
            onClick={() => router.push("/login")}
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700"
          >
            <LogOut className="h-5 w-5 mr-2" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
