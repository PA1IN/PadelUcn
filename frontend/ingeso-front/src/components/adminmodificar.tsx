"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Save, ArrowLeft, Loader2, User, Plus, Minus, Trash2, CheckCircle } from "lucide-react"

// Hooks del backend
import { useReservaPorId, useModificarReserva } from "@/hooks/useReserva"
import { useCanchas } from "@/hooks/useCancha"
import { useEquipamiento } from "@/hooks/useEquipamiento"
import { useEnviarRecordatorio } from "@/hooks/useRecordatorios"

interface AdminModificarReservaProps {
  reservaId: number
  onClose?: () => void
}

export default function AdminModificarReserva({ reservaId, onClose }: AdminModificarReservaProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Hooks básicos
  const { data: reservaActual, isLoading: loadingReserva } = useReservaPorId(reservaId)
  const { data: canchas, isLoading: loadingCanchas } = useCanchas()
  const modificarReserva = useModificarReserva("admin") // Admin no tiene restricciones
  const { data: equipamientos, isLoading: loadingEquipamiento } = useEquipamiento()
  const { mutateAsync: enviarRecordatorio } = useEnviarRecordatorio()

  // Estados del formulario
  const [formData, setFormData] = useState({
    fecha: "",
    hora_inicio: "",
    hora_termino: "",
    numero_cancha: 1,
  })

  // Función para calcular duración en minutos
  const calcularDuracionMinutos = (horaInicio: string, horaTermino: string): number => {
    if (!horaInicio || !horaTermino) return 0

    const [horasInicio, minutosInicio] = horaInicio.split(":").map(Number)
    const [horasTermino, minutosTermino] = horaTermino.split(":").map(Number)

    const inicioEnMinutos = horasInicio * 60 + minutosInicio
    const terminoEnMinutos = horasTermino * 60 + minutosTermino

    return terminoEnMinutos - inicioEnMinutos
  }

  const [jugadores, setJugadores] = useState<
    Array<{
      nombre: string
      apellido: string
      rut: string
      edad: number
    }>
  >([])

  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState<
    Array<{
      id: number
      nombre: string
      cantidad: number
      costo: number
    }>
  >([])

  const [nuevoJugador, setNuevoJugador] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    edad: 25,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos iniciales
  useEffect(() => {
    if (reservaActual) {
      setFormData({
        fecha: reservaActual.fecha || "",
        hora_inicio: reservaActual.hora_inicio || "",
        hora_termino: reservaActual.hora_termino || "",
        numero_cancha: reservaActual.numero_cancha || 1,
      })

      if (reservaActual.jugadores && reservaActual.jugadores.length > 0) {
        setJugadores(reservaActual.jugadores)
      }

      if (reservaActual.equipamiento) {
        setEquipamientoSeleccionado(reservaActual.equipamiento)
      }
    }
  }, [reservaActual])

  // Función de envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validaciones mínimas
      if (!formData.fecha || !formData.hora_inicio || !formData.numero_cancha) {
        throw new Error("Faltan campos requeridos")
      }

      // Validar duración de la reserva (90-180 minutos)
      const duracionMinutos = calcularDuracionMinutos(formData.hora_inicio, formData.hora_termino)
      if (duracionMinutos < 90) {
        throw new Error("La reserva debe tener una duración mínima de 90 minutos (1.5 horas)")
      }
      if (duracionMinutos > 180) {
        throw new Error("La reserva debe tener una duración máxima de 180 minutos (3 horas)")
      }
      if (duracionMinutos <= 0) {
        throw new Error("La hora de término debe ser posterior a la hora de inicio")
      }

      // Preparar datos para backend
      const datosParaBackend = {
        fecha: formData.fecha,
        hora_inicio: formData.hora_inicio,
        hora_termino: formData.hora_termino,
        numero_cancha: Number(formData.numero_cancha),
        equipamiento: equipamientoSeleccionado.map((eq) => ({
          id: eq.id,
          cantidad: eq.cantidad,
          costo: eq.costo,
        })),
        jugadores: jugadores.map((jugador) => ({
          nombre: jugador.nombre.trim(),
          apellido: jugador.apellido.trim(),
          rut: jugador.rut.trim(),
          edad: Number(jugador.edad),
        })),
      }

      // Envío al backend
      await modificarReserva.mutateAsync({
        id: reservaId,
        data: datosParaBackend,
      })

      // Enviar notificación al usuario
      if (reservaActual?.usuario?.correo) {
        await enviarRecordatorio({
          tipo: "reserva",
          destinatarios: [reservaActual.usuario.rut],
          mensaje: `Tu reserva #${reservaId} ha sido modificada por el administrador. Nueva fecha: ${formData.fecha}, horario: ${formData.hora_inicio} - ${formData.hora_termino}.`,
          id_reserva: reservaId,
        })
      }

      toast({
        title: "Reserva modificada",
        description: `La reserva #${reservaId} ha sido actualizada exitosamente y se ha notificado al usuario.`,
        variant: "default",
      })

      // Cerrar modal o regresar
      if (onClose) {
        onClose()
      } else {
        router.back()
      }
    } catch (err: any) {
      const mensajeError = err?.response?.data?.message || err?.message || "Error desconocido"
      setError(mensajeError)
      toast({
        title: "Error",
        description: `No se pudo modificar la reserva: ${mensajeError}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Funciones auxiliares
  const capacidadMaxima = canchas?.find((c) => c.numero_cancha === formData.numero_cancha)?.maxJugadores || 10

  const agregarJugador = () => {
    if (jugadores.length >= capacidadMaxima) {
      toast({
        title: "Límite alcanzado",
        description: `Máximo ${capacidadMaxima} jugadores para esta cancha`,
        variant: "destructive",
      })
      return
    }

    if (!nuevoJugador.nombre || !nuevoJugador.apellido || !nuevoJugador.rut) {
      toast({
        title: "Datos incompletos",
        description: "Completa todos los campos del jugador",
        variant: "destructive",
      })
      return
    }

    if (jugadores.some((j) => j.rut === nuevoJugador.rut)) {
      toast({
        title: "RUT duplicado",
        description: "Ya existe un jugador con ese RUT",
        variant: "destructive",
      })
      return
    }

    setJugadores([...jugadores, { ...nuevoJugador }])
    setNuevoJugador({ nombre: "", apellido: "", rut: "", edad: 25 })
  }

  const eliminarJugador = (index: number) => {
    setJugadores(jugadores.filter((_, i) => i !== index))
  }

  const cambiarCantidadEquipamiento = (equipoId: number, cambio: number) => {
    const equipo = equipamientos?.find((e) => e.id === equipoId)
    if (!equipo) return

    setEquipamientoSeleccionado((prev) => {
      const existente = prev.find((e) => e.id === equipoId)

      if (existente) {
        const nuevaCantidad = existente.cantidad + cambio
        if (nuevaCantidad <= 0) {
          return prev.filter((e) => e.id !== equipoId)
        } else if (nuevaCantidad <= equipo.stock) {
          return prev.map((e) => (e.id === equipoId ? { ...e, cantidad: nuevaCantidad } : e))
        }
        return prev
      } else if (cambio > 0 && cambio <= equipo.stock) {
        return [
          ...prev,
          {
            id: equipo.id,
            nombre: equipo.nombre,
            cantidad: cambio,
            costo: equipo.costo,
          },
        ]
      }
      return prev
    })
  }

  const obtenerCantidadEquipamiento = (equipoId: number): number => {
    return equipamientoSeleccionado.find((e) => e.id === equipoId)?.cantidad || 0
  }

  const isLoading = loadingReserva || loadingCanchas || loadingEquipamiento

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando datos de la reserva...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Modificar Reserva #{reservaId}
              </CardTitle>
              {reservaActual && (
                <p className="text-sm text-muted-foreground mt-1">
                  Usuario: {reservaActual.usuario?.nombre} ({reservaActual.usuario?.rut})
                </p>
              )}
            </div>
            <Button variant="outline" onClick={onClose || (() => router.back())}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario */}
      <Card>
        <CardHeader>
          <CardTitle>Datos de la Reserva</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fecha y horarios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="hora_inicio">Hora Inicio</Label>
                <input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="hora_termino">Hora Término</Label>
                <input
                  id="hora_termino"
                  type="time"
                  value={formData.hora_termino}
                  onChange={(e) => setFormData({ ...formData, hora_termino: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Mostrar duración y validación */}
            {formData.hora_inicio && formData.hora_termino && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Duración de la reserva: {calcularDuracionMinutos(formData.hora_inicio, formData.hora_termino)}{" "}
                      minutos
                    </p>
                    <p className="text-xs text-gray-500">Duración permitida: 90 - 180 minutos (1.5 - 3 horas)</p>
                  </div>
                  <div>
                    {(() => {
                      const duracion = calcularDuracionMinutos(formData.hora_inicio, formData.hora_termino)
                      if (duracion < 90) {
                        return (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Muy corta</span>
                          </div>
                        )
                      } else if (duracion > 180) {
                        return (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Muy larga</span>
                          </div>
                        )
                      } else if (duracion > 0) {
                        return (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-xs">Válida</span>
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Cancha */}
            <div>
              <Label htmlFor="cancha">Cancha</Label>
              <select
                id="cancha"
                value={formData.numero_cancha.toString()}
                onChange={(e) => setFormData({ ...formData, numero_cancha: Number.parseInt(e.target.value) })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Selecciona una cancha</option>
                {canchas?.map((cancha) => (
                  <option key={cancha.numero_cancha} value={cancha.numero_cancha.toString()}>
                    Cancha {cancha.numero_cancha} - {cancha.nombre} (Capacidad: {cancha.maxJugadores})
                  </option>
                ))}
              </select>
            </div>

            {/* Jugadores */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Jugadores ({jugadores.length}/{capacidadMaxima})
              </h4>

              {/* Lista de jugadores */}
              <div className="space-y-2 mb-4">
                {jugadores.map((jugador, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <div>
                      <span className="font-medium">
                        {jugador.nombre} {jugador.apellido}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">({jugador.rut})</span>
                      <span className="text-sm text-gray-500 ml-2">- {jugador.edad} años</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarJugador(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Agregar nuevo jugador */}
              {jugadores.length < capacidadMaxima && (
                <div className="bg-gray-50 p-4 rounded">
                  <h5 className="text-sm font-medium mb-3">Agregar Jugador</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={nuevoJugador.nombre}
                      onChange={(e) => setNuevoJugador({ ...nuevoJugador, nombre: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={nuevoJugador.apellido}
                      onChange={(e) => setNuevoJugador({ ...nuevoJugador, apellido: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="RUT"
                      value={nuevoJugador.rut}
                      onChange={(e) => setNuevoJugador({ ...nuevoJugador, rut: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Edad"
                      min="10"
                      value={nuevoJugador.edad}
                      onChange={(e) => setNuevoJugador({ ...nuevoJugador, edad: Number(e.target.value) })}
                      className="px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <Button type="button" onClick={agregarJugador} size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Jugador
                  </Button>
                </div>
              )}
            </div>

            {/* Equipamiento */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Equipamiento ({equipamientoSeleccionado.length} tipos seleccionados)</h4>

              <div className="space-y-3 max-h-64 overflow-y-auto border rounded p-4">
                {equipamientos?.map((equipo) => {
                  const cantidad = obtenerCantidadEquipamiento(equipo.id)
                  return (
                    <div key={equipo.id} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{equipo.nombre}</div>
                        <div className="text-xs text-gray-500">
                          ${equipo.costo.toLocaleString()} c/u • Stock: {equipo.stock}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => cambiarCantidadEquipamiento(equipo.id, -1)}
                          disabled={cantidad === 0}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{cantidad}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => cambiarCantidadEquipamiento(equipo.id, 1)}
                          disabled={cantidad >= equipo.stock}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {equipamientoSeleccionado.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Equipamiento seleccionado:</h5>
                  <div className="space-y-1">
                    {equipamientoSeleccionado.map((eq) => (
                      <div key={eq.id} className="flex justify-between text-xs text-blue-700">
                        <span>
                          {eq.nombre} x{eq.cantidad}
                        </span>
                        <span>${(eq.costo * eq.cantidad).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-blue-200 mt-2 pt-2 flex justify-between text-sm font-medium text-blue-800">
                    <span>Total equipamiento:</span>
                    <span>
                      $
                      {equipamientoSeleccionado
                        .reduce((total, eq) => total + eq.costo * eq.cantidad, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose || (() => router.back())}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
