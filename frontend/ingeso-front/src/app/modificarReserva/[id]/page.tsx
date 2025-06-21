"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AlertCircle, Send, CheckCircle, Loader2, Eye } from "lucide-react"

// Hooks del backend
import { useAuth } from "@/context/AuthContext"
import { useReservaPorId, useModificarReserva } from "@/hooks/useReserva"
import { useCanchas } from "@/hooks/useCancha"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useEquipamiento } from "@/hooks/useEquipamiento"

export default function SimpleModificarReserva() {
  const router = useRouter()
  const params = useParams()
  const { token, loading: authLoading } = useAuth()
  const id = typeof params?.id === "string" ? Number.parseInt(params.id) : 1 // Default para testing

  // Hooks básicos
  const { data: reservaActual, isLoading: loadingReserva } = useReservaPorId(id)
  const { data: canchas, isLoading: loadingCanchas } = useCanchas()
  const { data: userProfile } = useUserProfile()
  const modificarReserva = useModificarReserva(userProfile?.rut || "")
  const { data: equipamientos, isLoading: loadingEquipamiento } = useEquipamiento()

  // Estados simples
  const [formData, setFormData] = useState({
    fecha: "",
    hora_inicio: "",
    hora_termino: "",
    numero_cancha: 1,
  })

  const [jugadores, setJugadores] = useState([
    {
      nombre: "",
      apellido: "",
      rut: "",
      edad: 25,
    },
  ])

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
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showData, setShowData] = useState(false)

  // Cargar datos iniciales
  useEffect(() => {
    if (reservaActual) {
      console.log("📋 Reserva cargada:", reservaActual)
      setFormData({
        fecha: reservaActual.fecha || "",
        hora_inicio: reservaActual.hora_inicio || "",
        hora_termino: reservaActual.hora_termino || "",
        numero_cancha: reservaActual.numero_cancha || 1,
      })

      // Cargar jugadores existentes o usar datos del usuario
      if (reservaActual.jugadores && reservaActual.jugadores.length > 0) {
        setJugadores(reservaActual.jugadores)
      } else if (userProfile) {
        setJugadores([
          {
            nombre: userProfile.nombre_usuario?.split(" ")[0] || "Test",
            apellido: userProfile.nombre_usuario?.split(" ")[1] || "User",
            rut: userProfile.rut || "12345678-9",
            edad: 25,
          },
        ])
      }

      // Cargar equipamiento existente
      if (reservaActual.equipamiento) {
        setEquipamientoSeleccionado(reservaActual.equipamiento)
      }
    }
  }, [reservaActual, userProfile])

  // Verificar autenticación
  useEffect(() => {
    if (!authLoading && !token) {
      console.warn("⚠️ Sin token, redirigiendo...")
      router.replace("/login")
    }
  }, [token, authLoading, router])

  // Función de envío simplificada
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setResponse(null)

    try {
      console.log("🚀 Iniciando envío...")
      console.log("📤 ID de reserva:", id)
      console.log("📤 Datos del formulario:", formData)
      console.log("👤 Usuario:", userProfile?.rut)
      console.log("🔑 Token presente:", !!token)

      // Validaciones mínimas
      if (!formData.fecha || !formData.hora_inicio || !formData.numero_cancha) {
        throw new Error("Faltan campos requeridos")
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

      console.log("📡 Datos preparados para backend:", datosParaBackend)

      // Envío real al backend
      const resultado = await modificarReserva.mutateAsync({
        id,
        data: datosParaBackend,
      })

      console.log("✅ Respuesta exitosa:", resultado)
      setResponse(resultado)
    } catch (err: any) {
      console.error("❌ Error completo:", err)

      let mensajeError = "Error desconocido"
      let detallesError = {}

      if (err?.response) {
        mensajeError = err.response.data?.message || `Error HTTP ${err.response.status}`
        detallesError = {
          status: err.response.status,
          data: err.response.data,
        }
      } else if (err?.message) {
        mensajeError = err.message
      }

      setError(mensajeError)
      setResponse({ error: true, message: mensajeError, details: detallesError })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Obtener capacidad máxima de la cancha seleccionada
  const capacidadMaxima = canchas?.find((c) => c.numero_cancha === formData.numero_cancha)?.maxJugadores || 1

  const agregarJugador = () => {
    if (jugadores.length >= capacidadMaxima) {
      alert(`Máximo ${capacidadMaxima} jugadores para esta cancha`)
      return
    }

    if (!nuevoJugador.nombre || !nuevoJugador.apellido || !nuevoJugador.rut) {
      alert("Completa todos los campos del jugador")
      return
    }

    if (jugadores.some((j) => j.rut === nuevoJugador.rut)) {
      alert("Ya existe un jugador con ese RUT")
      return
    }

    setJugadores([...jugadores, { ...nuevoJugador }])
    setNuevoJugador({ nombre: "", apellido: "", rut: "", edad: 25 })
  }

  const eliminarJugador = (index: number) => {
    if (index === 0) {
      alert("No puedes eliminar al jugador principal")
      return
    }
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

  const isLoading = authLoading || loadingReserva || loadingCanchas || loadingEquipamiento

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Test Simple: Modificar Reserva #{id}
            </CardTitle>
            {userProfile && (
              <p className="text-sm text-gray-600">
                Usuario: {userProfile.nombre_usuario} ({userProfile.rut}) | Saldo: $
                {userProfile.saldo?.toLocaleString()}
              </p>
            )}
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario simple */}
          <Card>
            <CardHeader>
              <CardTitle>Formulario Simple</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
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
                        Cancha {cancha.numero_cancha} - {cancha.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sección de Jugadores */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">
                    Jugadores ({jugadores.length}/{capacidadMaxima})
                  </h4>

                  {/* Lista de jugadores */}
                  <div className="space-y-2 mb-4">
                    {jugadores.map((jugador, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div>
                          <span className="font-medium">
                            {jugador.nombre} {jugador.apellido}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">({jugador.rut})</span>
                          {index === 0 && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Principal
                            </span>
                          )}
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => eliminarJugador(index)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Agregar nuevo jugador */}
                  {jugadores.length < capacidadMaxima && (
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="text-sm font-medium mb-2">Agregar Jugador</h5>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Nombre"
                          value={nuevoJugador.nombre}
                          onChange={(e) => setNuevoJugador({ ...nuevoJugador, nombre: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Apellido"
                          value={nuevoJugador.apellido}
                          onChange={(e) => setNuevoJugador({ ...nuevoJugador, apellido: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="RUT (12345678-9)"
                          value={nuevoJugador.rut}
                          onChange={(e) => setNuevoJugador({ ...nuevoJugador, rut: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Edad"
                          min="10"
                          value={nuevoJugador.edad}
                          onChange={(e) => setNuevoJugador({ ...nuevoJugador, edad: Number(e.target.value) })}
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={agregarJugador}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 rounded"
                      >
                        + Agregar Jugador
                      </button>
                    </div>
                  )}
                </div>

                {/* Sección de Equipamiento */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">
                    Equipamiento ({equipamientoSeleccionado.length} tipos seleccionados)
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {equipamientos?.map((equipo) => {
                      const cantidad = obtenerCantidadEquipamiento(equipo.id)
                      return (
                        <div key={equipo.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{equipo.nombre}</div>
                            <div className="text-xs text-gray-500">
                              ${equipo.costo.toLocaleString()} c/u • Stock: {equipo.stock}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => cambiarCantidadEquipamiento(equipo.id, -1)}
                              disabled={cantidad === 0}
                              className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center disabled:bg-gray-300 text-xs"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{cantidad}</span>
                            <button
                              type="button"
                              onClick={() => cambiarCantidadEquipamiento(equipo.id, 1)}
                              disabled={cantidad >= equipo.stock}
                              className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center disabled:bg-gray-300 text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {equipamientoSeleccionado.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded">
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

                <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Probar Modificación
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Panel de datos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Datos de Envío
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowData(!showData)}
                  className="flex items-center gap-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  {showData ? "Ocultar" : "Ver"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showData && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Datos que se enviarán:</h4>
                    <div className="bg-gray-100 p-3 rounded text-sm">
                      <pre>
                        {JSON.stringify(
                          {
                            id,
                            data: {
                              fecha: formData.fecha,
                              hora_inicio: formData.hora_inicio,
                              hora_termino: formData.hora_termino,
                              numero_cancha: formData.numero_cancha,
                              equipamiento: equipamientoSeleccionado,
                              jugadores: jugadores,
                            },
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Estado de datos:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Token:</span>
                        <span className={token ? "text-green-600" : "text-red-600"}>
                          {token ? "✅ OK" : "❌ Falta"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Usuario:</span>
                        <span className={userProfile ? "text-green-600" : "text-red-600"}>
                          {userProfile ? "✅ OK" : "❌ Falta"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reserva:</span>
                        <span className={reservaActual ? "text-green-600" : "text-red-600"}>
                          {reservaActual ? "✅ OK" : "❌ Falta"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Canchas:</span>
                        <span className={canchas?.length ? "text-green-600" : "text-red-600"}>
                          {canchas?.length || 0} disponibles
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resultado */}
        {(response || error) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {error ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Error en el Envío
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Respuesta del Backend
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-red-800 font-medium">Error:</p>
                    <p className="text-red-700">{error}</p>
                  </div>
                  {response?.details && (
                    <details className="bg-gray-50 p-3 rounded">
                      <summary className="cursor-pointer font-medium">Detalles técnicos</summary>
                      <pre className="text-xs mt-2 overflow-auto max-h-40">
                        {JSON.stringify(response.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-green-800 font-medium mb-2">✅ Envío Exitoso</p>
                  <div className="bg-white p-3 rounded border">
                    <pre className="text-xs overflow-auto max-h-64">{JSON.stringify(response, null, 2)}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instrucciones */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>• Modifica los campos básicos del formulario</p>
            <p>• Haz clic en "Ver" para mostrar los datos que se enviarán</p>
            <p>• Presiona "Probar Modificación" para enviar al backend</p>
            <p>• Revisa la consola del navegador para logs detallados</p>
            <p>• Observa la respuesta completa del backend abajo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
