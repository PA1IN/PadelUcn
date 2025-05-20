"use client"

import { useRouter } from "next/navigation"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useObtenerReservas, useEliminarReserva } from "@/hooks/useReserva"

export default function VerReservas() {
  const router = useRouter()
  const { data: user, isLoading: cargandoUsuario } = useUserProfile()
  const rutUsuario = user?.rut || ""

  const {
    data: reservas = [],
    isLoading: cargandoReservas,
    isError,
    error,
  } = useObtenerReservas(rutUsuario)

  const eliminarReserva = useEliminarReserva(rutUsuario)

  const cancelarReserva = (id: number) => {
    if (!confirm("¿Seguro que deseas cancelar esta reserva?")) return
    eliminarReserva.mutate(id)
  }

  const modificarReserva = (id: number) => {
    router.push(`/modificarReserva/${id}`)
  }

  if (cargandoUsuario || cargandoReservas) return <div className="p-6">Cargando reservas...</div>
  if (isError) return <div className="p-6 text-red-500">{(error as any)?.message || "Error al obtener reservas"}</div>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Mis Reservas</h1>

      {reservas.length === 0 ? (
        <p className="text-center text-gray-600">No tienes reservas registradas.</p>
      ) : (
        <div className="grid gap-4 max-w-3xl mx-auto">
          {reservas.map((reserva) => (
            <div key={reserva.id} className="bg-white p-6 rounded shadow">
              <p><strong>Cancha:</strong> N°{reserva.cancha.numero} - {reserva.cancha.nombre}</p>
              <p><strong>Fecha:</strong> {reserva.fecha}</p>
              <p><strong>Hora:</strong> {reserva.hora_inicio} - {reserva.hora_termino}</p>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => modificarReserva(reserva.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Modificar
                </button>
                <button
                  onClick={() => cancelarReserva(reserva.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

       <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/home")}
          className="text-green-600 hover:underline text-sm"
        >
          Volver a la página principal
        </button>
      </div> 
    </div>
  )
}
