"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format, differenceInCalendarDays } from "date-fns"
import { es } from "date-fns/locale"
import { Clock, DollarSign, Trash2, Edit, AlertTriangle, X } from "lucide-react"

import { useUserProfile } from "@/hooks/useUserProfile"
import { useObtenerReservas, useEliminarReserva } from "@/hooks/useReserva"

export default function VerReservasPage() {
  const router = useRouter()

  const { data: user, isLoading: cargandoUsuario } = useUserProfile()
  const rutUsuario = user?.rut || ""

  const { data: reservas = [], isLoading: cargandoReservas, isError, error, refetch } = useObtenerReservas(rutUsuario)

  // Filtrar reservas para excluir las canceladas
  const reservasActivas = reservas.filter(
    (reserva: any) => reserva.estado !== "cancelada" && reserva.estado !== "CANCELADA",
  )

  // Agregar después de la declaración de reservas
  console.log("Datos de reservas:", reservasActivas)
  reservasActivas.forEach((reserva: any, index: number) => {
    console.log(`Reserva ${index}:`, {
      id: reserva.id,
      costo_total: reserva.costo_total,
      cancha: reserva.cancha,
      equipamiento: reserva.equipamiento,
    })
  })

  const eliminarReserva = useEliminarReserva(rutUsuario)

  const [errorLocal, setErrorLocal] = useState<string | null>(null)
  const [mostrarModalCancelacion, setMostrarModalCancelacion] = useState(false)
  const [reservaACancelar, setReservaACancelar] = useState<number | null>(null)
  const [motivoCancelacion, setMotivoCancelacion] = useState("")

  const calcularDiasDeAntelacion = (fechaReserva: string): number => {
    const fechaHoy = new Date()
    const fecha = new Date(fechaReserva)
    return differenceInCalendarDays(fecha, fechaHoy)
  }

  const formatearFecha = (fecha: string): string => {
    try {
      return format(new Date(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })
    } catch {
      return fecha
    }
  }

  const iniciarCancelacion = (id: number) => {
    setReservaACancelar(id)
    setMostrarModalCancelacion(true)
    setMotivoCancelacion("")
  }

  const confirmarCancelacion = () => {
    if (!reservaACancelar || !motivoCancelacion.trim()) {
      setErrorLocal("Por favor ingresa un motivo para la cancelación")
      return
    }

    eliminarReserva.mutate(
      { id: reservaACancelar, motivo: motivoCancelacion.trim() },
      {
        onSuccess: () => {
          setMostrarModalCancelacion(false)
          setReservaACancelar(null)
          setMotivoCancelacion("")
          setErrorLocal(null)
          refetch()
        },
        onError: () => {
          setErrorLocal("Error al cancelar la reserva")
        },
      },
    )
  }

  const cerrarModal = () => {
    setMostrarModalCancelacion(false)
    setReservaACancelar(null)
    setMotivoCancelacion("")
  }

  const modificarReserva = (id: number) => {
    router.push(`/modificarReserva/${id}`)
  }

  const calcularCostoTotal = (reserva: any): number => {
    // Si ya tiene costo_total, usarlo
    if (reserva.costo_total && reserva.costo_total > 0) {
      return reserva.costo_total
    }

    // Si no, calcular desde los componentes
    let total = 0

    // Costo de la cancha (si está disponible)
    if (reserva.cancha?.valor) {
      // Calcular duración en horas
      const horaInicio = new Date(`2000-01-01 ${reserva.hora_inicio}`)
      const horaFin = new Date(`2000-01-01 ${reserva.hora_termino}`)
      const duracionHoras = (horaFin.getTime() - horaInicio.getTime()) / (1000 * 60 * 60)
      total += reserva.cancha.valor * duracionHoras
    }

    // Costo del equipamiento
    if (reserva.equipamiento && Array.isArray(reserva.equipamiento)) {
      const costoEquipamiento = reserva.equipamiento.reduce((sum: number, eq: any) => {
        return sum + eq.costo * eq.cantidad
      }, 0)
      total += costoEquipamiento
    }

    return total
  }

  if (cargandoUsuario || cargandoReservas) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reservas...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error al cargar reservas</h2>
          <p className="text-red-600 mb-4">{(error as Error)?.message}</p>
          <button onClick={() => refetch()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Intentar nuevamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
              <p className="text-gray-600">Gestiona tus reservas de canchas y equipamiento</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total de reservas</p>
              <p className="text-3xl font-bold text-green-600">{reservasActivas.length}</p>
            </div>
          </div>
        </div>

        {/* Error local */}
        {errorLocal && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{errorLocal}</p>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {reservasActivas.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No tienes reservas</h2>
            <p className="text-gray-600 mb-6">Aún no has realizado ninguna reserva. ¡Reserva tu cancha favorita!</p>
            <button
              onClick={() => router.push("/reservaTabla")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Hacer una reserva
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservasActivas.map((reserva: any) => {
              const diasAntelacion = calcularDiasDeAntelacion(reserva.fecha)
              const puedeModificar = diasAntelacion >= 2

              return (
                <div key={reserva.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  {/* Título */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancha</h3>

                  {/* Información de la reserva */}
                  <div className="space-y-3 mb-6">
                    {/* Fecha */}
                    <div className="flex items-center text-blue-600">
                      <Clock className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium">{formatearFecha(reserva.fecha)}</p>
                        <p className="text-sm text-gray-600">
                          {reserva.hora_inicio} - {reserva.hora_termino}
                        </p>
                      </div>
                    </div>

                    {/* Costo */}
                    <div className="flex items-center text-green-600">
                      <DollarSign className="w-5 h-5 mr-3" />
                      <div>
                        <p className="font-medium">${calcularCostoTotal(reserva).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Total pagado</p>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="space-y-3">
                    {puedeModificar && (
                      <button
                        onClick={() => modificarReserva(reserva.id)}
                        className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 flex items-center justify-center font-medium"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Modificar
                      </button>
                    )}

                    <button
                      onClick={() => iniciarCancelacion(reserva.id)}
                      className="w-full bg-white text-red-600 py-3 px-4 rounded-lg border border-gray-200 hover:bg-red-50 flex items-center justify-center font-medium"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancelar
                    </button>
                  </div>

                  {/* Información de tiempo */}
                  <div className="mt-4 text-center">
                    <p className="text-sm text-blue-600">
                      {diasAntelacion > 0
                        ? `En ${diasAntelacion} día${diasAntelacion !== 1 ? "s" : ""}`
                        : diasAntelacion === 0
                          ? "Hoy"
                          : `Hace ${Math.abs(diasAntelacion)} día${Math.abs(diasAntelacion) !== 1 ? "s" : ""}`}
                    </p>
                  </div>

                  {!puedeModificar && (
                    <div className="mt-3 text-center">
                      <p className="text-xs text-gray-500">No se puede modificar (menos de 2 días de anticipación)</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Modal de cancelación */}
        {mostrarModalCancelacion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Cancelar Reserva</h3>
                <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 mb-4">Por favor, indica el motivo de la cancelación:</p>

              <textarea
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                placeholder="Escribe el motivo de la cancelación..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                maxLength={200}
              />

              <div className="text-right text-sm text-gray-500 mb-4">{motivoCancelacion.length}/200</div>

              <div className="flex space-x-3">
                <button
                  onClick={cerrarModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarCancelacion}
                  disabled={!motivoCancelacion.trim() || eliminarReserva.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {eliminarReserva.isPending ? "Cancelando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push("/home")}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium"
          >
            Volver al inicio
          </button>
          <button
            onClick={() => router.push("/reservaTabla")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Nueva reserva
          </button>
        </div>
      </div>
    </div>
  )
}
