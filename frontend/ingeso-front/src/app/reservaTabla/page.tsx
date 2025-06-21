"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { useCanchas } from "@/hooks/useCancha"
import { useEquipamiento } from "@/hooks/useEquipamiento"
import {
  useCrearReserva,
  useMaximoJugadoresPorCancha,
  useVerificarDisponibilidad,
  useFechasDisponibles,
} from "@/hooks/useReserva"
import { useObtenerSaldo, useActualizarSaldo } from "@/hooks/useSaldo"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowRight,
  CalendarRange,
  Users,
  Clock4,
  DollarSign,
  CircleCheckBig,
  User,
  Wallet,
  CreditCard,
  AlertTriangle,
  Filter,
  Plus,
  Minus,
  Trash2,
} from "lucide-react"

interface Jugador {
  nombre: string
  apellido: string
  rut: string
  edad: number
}

interface EquipamientoSeleccionado {
  id: number
  nombre: string
  cantidad: number
  costo: number
}

function formatDateInSpanish(dateStr: string): string {
  const date = new Date(dateStr)
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} de ${month} de ${year}`
}

function calcularDiasDeAntelacion(fecha: string): number {
  const fechaReserva = new Date(fecha)
  const hoy = new Date()

  fechaReserva.setHours(0, 0, 0, 0)
  hoy.setHours(0, 0, 0, 0)

  const diferenciaMilisegundos = fechaReserva.getTime() - hoy.getTime()
  const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24))

  return diferenciaDias
}

function esFechaValida(fecha: string): boolean {
  const diasAntelacion = calcularDiasDeAntelacion(fecha)
  return diasAntelacion >= 7
}

export default function ReservaTabla() {
  const router = useRouter()

  // Hooks de datos
  const { data: canchas, isLoading: loadingCanchas } = useCanchas()
  const { data: equipamiento, isLoading: loadingEquipamiento } = useEquipamiento()
  const { data: userProfile, isLoading: loadingProfile } = useUserProfile()
  const { data: saldo, isLoading: loadingSaldo } = useObtenerSaldo()
  const { data: fechasDisponibles } = useFechasDisponibles()
  const actualizarSaldo = useActualizarSaldo()

  // Estados principales
  const [pantalla, setPantalla] = useState(0) // 0: filtros, 1: detalles, 2: confirmación
  const [mostrarFiltros, setMostrarFiltros] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Estados de filtros
  const [filtroFecha, setFiltroFecha] = useState("")
  const [filtroHora, setFiltroHora] = useState("")
  const [filtroNumeroPersonas, setFiltroNumeroPersonas] = useState<number>(2)

  // Estados de reserva
  const [canchaSeleccionada, setCanchaSeleccionada] = useState<any | null>(null)
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState<EquipamientoSeleccionado[]>([])
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [nuevoJugador, setNuevoJugador] = useState<Jugador>({
    nombre: "",
    apellido: "",
    rut: "",
    edad: 0,
  })

  // Estados de proceso
  const [reservaEnProceso, setReservaEnProceso] = useState<any | null>(null)
  const [confirmandoPago, setConfirmandoPago] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Fechas y horarios disponibles
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [canchasDisponibles, setCanchasDisponibles] = useState<any[]>([])

  // Hooks condicionales - CORREGIDO: usar numeroPersonas en lugar de numero_cancha
  const maxJugadores = useMaximoJugadoresPorCancha(canchaSeleccionada?.numero || 0)
  const verificarDisponibilidad = useVerificarDisponibilidad(filtroFecha, filtroHora, filtroNumeroPersonas)

  const crearReserva = useCrearReserva(
    () => {
      console.log("Reserva creada con éxito.")
      setPantalla(2)
    },
    (error) => {
      console.error("Error al crear reserva:", error)
      setError("Error al crear la reserva. Intenta nuevamente.")
      setConfirmandoPago(false)
    },
  )

  // Efectos
  useEffect(() => {
    if (!loadingProfile && !loadingCanchas && !loadingEquipamiento && !loadingSaldo) {
      setIsLoading(false)
    }
  }, [loadingProfile, loadingCanchas, loadingEquipamiento, loadingSaldo])

  // CORREGIDO: Usar fechas del backend
  useEffect(() => {
    if (fechasDisponibles && Array.isArray(fechasDisponibles)) {
      setAvailableDates(fechasDisponibles)
    } else {
      // Fallback: generar fechas localmente si el backend no las proporciona
      const today = new Date()
      const dates: string[] = []
      for (let i = 7; i <= 30; i++) {
        const d = new Date()
        d.setDate(today.getDate() + i)
        dates.push(d.toISOString().split("T")[0])
      }
      setAvailableDates(dates)
    }
  }, [fechasDisponibles])

  useEffect(() => {
    if (!filtroFecha) return setAvailableTimes([])

    if (!esFechaValida(filtroFecha)) {
      setAvailableTimes([])
      return
    }

    const baseTimes = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
    ]
    setAvailableTimes(baseTimes)
  }, [filtroFecha])

  // CORREGIDO: Usar la respuesta del backend para canchas disponibles
  useEffect(() => {
    if (!filtroFecha || !filtroHora || filtroNumeroPersonas < 1) {
      setCanchasDisponibles([])
      return
    }

    if (!esFechaValida(filtroFecha)) {
      setCanchasDisponibles([])
      return
    }

    // Si tenemos respuesta del backend sobre disponibilidad
    if (verificarDisponibilidad.data && verificarDisponibilidad.data.canchasDisponibles) {
      setCanchasDisponibles(verificarDisponibilidad.data.canchasDisponibles)
    } else if (canchas) {
      // Fallback: filtrar por capacidad
      const canchasFiltradas = canchas.filter((cancha: any) => {
        return cancha.cantidad_max_jugador >= filtroNumeroPersonas
      })
      setCanchasDisponibles(canchasFiltradas)
    }
  }, [filtroFecha, filtroHora, filtroNumeroPersonas, canchas, verificarDisponibilidad.data])

  // Agregar usuario actual como primer jugador cuando se selecciona cancha
  useEffect(() => {
    if (userProfile && canchaSeleccionada && jugadores.length === 0) {
      setJugadores([
        {
          nombre: userProfile.nombre?.split(" ")[0] || "",
          apellido: userProfile.nombre?.split(" ").slice(1).join(" ") || "",
          rut: userProfile.rut,
          edad: 0,
        },
      ])
    }
  }, [userProfile, canchaSeleccionada, jugadores.length])

  // Funciones auxiliares
  const calcularHoraFin = (horaInicio: string): string => {
    const [h, m] = horaInicio.split(":").map(Number)
    const horaFin = h + 1
    return `${horaFin.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
  }

  const calcularCostoTotal = (): number => {
    const costoCancha = canchaSeleccionada?.valor || 0
    const costoEquipamiento = equipamientoSeleccionado.reduce((total, eq) => total + eq.costo * eq.cantidad, 0)
    return costoCancha + costoEquipamiento
  }

  const handleEquipmentQuantityChange = (equipmentId: number, change: number) => {
    const equipment = equipamiento?.find((e: any) => e.id_equipamiento === equipmentId)
    if (!equipment) return

    setEquipamientoSeleccionado((prev) => {
      const existing = prev.find((e) => e.id === equipmentId)

      if (existing) {
        const newQuantity = existing.cantidad + change

        if (newQuantity <= 0) {
          return prev.filter((e) => e.id !== equipmentId)
        } else if (newQuantity <= equipment.stock) {
          return prev.map((e) => (e.id === equipmentId ? { ...e, cantidad: newQuantity } : e))
        }
        return prev
      } else if (change > 0 && change <= equipment.stock) {
        return [
          ...prev,
          {
            id: equipment.id_equipamiento,
            nombre: equipment.nombre,
            cantidad: change,
            costo: equipment.costo,
          },
        ]
      }
      return prev
    })
  }

  const getEquipmentQuantity = (equipmentId: number): number => {
    const selected = equipamientoSeleccionado.find((e) => e.id === equipmentId)
    return selected ? selected.cantidad : 0
  }

  const aplicarFiltros = () => {
    if (!filtroFecha || !filtroHora || filtroNumeroPersonas < 1) {
      setError("Por favor completa todos los filtros")
      return
    }

    if (!esFechaValida(filtroFecha)) {
      const diasAntelacion = calcularDiasDeAntelacion(filtroFecha)
      setError(`No se puede reservar con ${diasAntelacion} días de antelación. Mínimo requerido: 7 días.`)
      return
    }

    setMostrarFiltros(false)
    setError(null)
  }

  const limpiarFiltros = () => {
    setFiltroFecha("")
    setFiltroHora("")
    setFiltroNumeroPersonas(2)
    setCanchaSeleccionada(null)
    setEquipamientoSeleccionado([])
    setJugadores([])
    setCanchasDisponibles([])
    setMostrarFiltros(true)
    setError(null)
    setPantalla(0)
  }

  // CORREGIDO: Simplificar la validación ya que el backend maneja la disponibilidad
  const manejarConfirmarFiltros = () => {
    if (!filtroFecha || !filtroHora || !canchaSeleccionada) {
      setError("Completa todos los campos requeridos")
      return
    }

    const costoTotal = calcularCostoTotal()

    setReservaEnProceso({
      fecha: filtroFecha,
      hora_inicio: filtroHora,
      hora_termino: calcularHoraFin(filtroHora),
      numero_cancha: canchaSeleccionada.numero,
      cancha: canchaSeleccionada,
      equipamiento: equipamientoSeleccionado,
      jugadores,
      costo_total: costoTotal,
    })

    setPantalla(1)
  }

  const manejarConfirmarPago = async () => {
    if (!reservaEnProceso || !userProfile?.rut || saldo?.saldo === undefined) return

    if (saldo.saldo < reservaEnProceso.costo_total) {
      setError("Saldo insuficiente para realizar la reserva.")
      return
    }

    setConfirmandoPago(true)

    try {
      await crearReserva.mutateAsync({
        fecha: reservaEnProceso.fecha,
        hora_inicio: reservaEnProceso.hora_inicio,
        hora_termino: reservaEnProceso.hora_termino,
        rut_usuario: userProfile.rut,
        numero_cancha: reservaEnProceso.numero_cancha,
        jugadores: reservaEnProceso.jugadores,
        equipamiento: reservaEnProceso.equipamiento.map((eq: any) => ({
          id: eq.id,
          cantidad: eq.cantidad,
          costo: eq.costo,
        })),
      })

      await actualizarSaldo.mutateAsync({
        nuevoSaldo: saldo.saldo - reservaEnProceso.costo_total,
        transaccion: "Reserva de cancha",
      })
    } catch (error) {
      console.error("Error al confirmar la reserva:", error)
      setError("Error al confirmar la reserva. Intenta nuevamente.")
      setConfirmandoPago(false)
    }
  }

  const handleAgregarJugador = () => {
    const maxJugadoresCancha = canchaSeleccionada?.cantidad_max_jugador || 0

    if (jugadores.length >= maxJugadoresCancha) {
      setError(`No se pueden agregar más jugadores. El máximo para esta cancha es ${maxJugadoresCancha}.`)
      return
    }

    if (jugadores.length >= filtroNumeroPersonas) {
      setError(`No se pueden agregar más jugadores. El filtro está configurado para ${filtroNumeroPersonas} personas.`)
      return
    }

    if (!nuevoJugador.nombre || !nuevoJugador.apellido || !nuevoJugador.rut || nuevoJugador.edad <= 0) {
      setError("Completa todos los campos del jugador")
      return
    }

    if (jugadores.some((j) => j.rut === nuevoJugador.rut)) {
      setError("Ya existe un jugador con ese RUT")
      return
    }

    setJugadores([...jugadores, nuevoJugador])
    setNuevoJugador({
      nombre: "",
      apellido: "",
      rut: "",
      edad: 0,
    })
    setError(null)
  }

  const handleRemoveJugador = (rut: string) => {
    if (rut === userProfile?.rut) {
      setError("No puedes eliminar al usuario que realiza la reserva")
      return
    }

    setJugadores(jugadores.filter((j) => j.rut !== rut))
  }

  const manejarVolverAInicio = () => {
    router.push("/home")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return <div className="text-center mt-10 text-red-600">Error: No se pudo cargar el perfil del usuario</div>
  }

  // Pantalla de confirmación (pantalla 2)
  if (pantalla === 2 && reservaEnProceso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CircleCheckBig className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva Confirmada!</h2>
          <p className="text-gray-600 mb-6">Tu reserva ha sido procesada correctamente.</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Cancha:</span>
              <span className="font-medium">{reservaEnProceso.cancha.nombre}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Fecha:</span>
              <span className="font-medium">{formatDateInSpanish(reservaEnProceso.fecha)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Hora:</span>
              <span className="font-medium">
                {reservaEnProceso.hora_inicio} - {reservaEnProceso.hora_termino}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Jugadores:</span>
              <span className="font-medium">{reservaEnProceso.jugadores.length}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
              <span className="text-gray-700 font-medium">Total pagado:</span>
              <span className="font-bold text-green-600">${reservaEnProceso.costo_total.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800 font-medium">Tu nuevo saldo</p>
            <p className="text-2xl font-bold text-blue-700">${saldo?.saldo?.toLocaleString()}</p>
          </div>

          <div className="flex space-x-4">
            <Button onClick={() => router.push("/reservas")} className="flex-1" variant="outline">
              Ver mis reservas
            </Button>
            <Button onClick={manejarVolverAInicio} className="flex-1">
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Pantalla de detalles y pago (pantalla 1)
  if (pantalla === 1 && reservaEnProceso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-center mb-4">Confirmar Pago</h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Detalles de la reserva</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cancha:</span>
                <span>{reservaEnProceso.cancha.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span>{formatDateInSpanish(reservaEnProceso.fecha)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hora:</span>
                <span>
                  {reservaEnProceso.hora_inicio} - {reservaEnProceso.hora_termino}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jugadores:</span>
                <span>{reservaEnProceso.jugadores.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Resumen de costos</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cancha:</span>
                <span>${reservaEnProceso.cancha.valor.toLocaleString()}</span>
              </div>

              {reservaEnProceso.equipamiento.length > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Equipamiento:</span>
                    <span>
                      $
                      {reservaEnProceso.equipamiento
                        .reduce((total: number, eq: any) => total + eq.costo * eq.cantidad, 0)
                        .toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 pl-4">
                    {reservaEnProceso.equipamiento.map((eq: any) => (
                      <div key={eq.id} className="flex justify-between">
                        <span>
                          {eq.nombre} x{eq.cantidad}
                        </span>
                        <span>${(eq.costo * eq.cantidad).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
                <span>Total a pagar:</span>
                <span className="text-green-600">${reservaEnProceso.costo_total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">Tu saldo actual</p>
                <p className="text-lg font-bold text-blue-700">${saldo?.saldo?.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-500" />
            </div>

            {(saldo?.saldo || 0) < reservaEnProceso.costo_total ? (
              <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
                <p className="font-medium">Saldo insuficiente</p>
                <p className="text-xs">
                  Necesitas ${(reservaEnProceso.costo_total - (saldo?.saldo || 0)).toLocaleString()} más para completar
                  esta reserva.
                </p>
                <Button
                  onClick={() => router.push("/cargar-dinero")}
                  className="mt-1 w-full"
                  size="sm"
                  variant="destructive"
                >
                  <CreditCard className="h-3 w-3 mr-1" /> Cargar dinero
                </Button>
              </div>
            ) : (
              <div className="mt-2 p-2 bg-green-100 text-green-700 text-sm rounded">
                <p>Saldo suficiente para completar esta reserva</p>
              </div>
            )}
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="flex space-x-4">
            <Button onClick={() => setPantalla(0)} variant="outline" className="flex-1">
              Volver
            </Button>
            <Button
              onClick={manejarConfirmarPago}
              disabled={confirmandoPago || (saldo?.saldo || 0) < reservaEnProceso.costo_total}
              className="flex-1"
            >
              {confirmandoPago ? "Procesando..." : "Confirmar pago"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Pantalla principal (pantalla 0)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="bg-green-500 text-white p-4 rounded w-full max-w-md mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Reserva tu Cancha</h1>
        <div className="flex items-center bg-green-600 px-3 py-1 rounded">
          <Wallet className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">${saldo?.saldo?.toLocaleString()}</span>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md">
        {/* Aviso de antelación mínima */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Política de Reservas</p>
              <p className="text-xs text-blue-700 mt-1">
                Las reservas deben realizarse con un <strong>mínimo de 7 días de antelación</strong>. Solo se muestran
                fechas disponibles que cumplen esta condición.
              </p>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm whitespace-pre-line">{success}</p>}

        {/* Sección de Filtros */}
        {mostrarFiltros && (
          <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center mb-3">
              <Filter size={20} className="text-blue-600 mr-2" />
              <h3 className="font-medium text-blue-800">Filtros de Búsqueda</h3>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <CalendarRange size={16} className="mr-1" />
                  Fecha * (mínimo 7 días de antelación)
                </Label>
                <select
                  value={filtroFecha}
                  onChange={(e) => {
                    setFiltroFecha(e.target.value)
                    setError(null)
                  }}
                  required
                  className="w-full px-3 py-2 border rounded text-sm"
                >
                  <option value="">Selecciona una fecha</option>
                  {availableDates.map((date) => {
                    const diasAntelacion = calcularDiasDeAntelacion(date)
                    return (
                      <option key={date} value={date}>
                        {formatDateInSpanish(date)} ({diasAntelacion} días de antelación)
                      </option>
                    )
                  })}
                </select>
                {filtroFecha && (
                  <p className="text-xs text-gray-500 mt-1">
                    Antelación: {calcularDiasDeAntelacion(filtroFecha)} días
                    {calcularDiasDeAntelacion(filtroFecha) < 7 && (
                      <span className="text-red-600 ml-1">(Insuficiente - mínimo 7 días)</span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Clock4 size={16} className="mr-1" />
                  Hora *
                </Label>
                <select
                  value={filtroHora}
                  onChange={(e) => setFiltroHora(e.target.value)}
                  required
                  disabled={!filtroFecha || !esFechaValida(filtroFecha)}
                  className="w-full px-3 py-2 border rounded text-sm disabled:bg-gray-100"
                >
                  <option value="">
                    {!filtroFecha
                      ? "Selecciona una fecha primero"
                      : !esFechaValida(filtroFecha)
                        ? "Fecha no válida (mínimo 7 días)"
                        : "Selecciona una hora"}
                  </option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Users size={16} className="mr-1" />
                  Número de personas *
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    onClick={() => setFiltroNumeroPersonas(Math.max(1, filtroNumeroPersonas - 1))}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="w-12 text-center font-medium">{filtroNumeroPersonas}</span>
                  <Button
                    type="button"
                    onClick={() => setFiltroNumeroPersonas(Math.min(22, filtroNumeroPersonas + 1))}
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full bg-green-500 text-white hover:bg-green-600"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Mínimo: 1, Máximo: 22 personas</p>
              </div>

              <Button
                onClick={aplicarFiltros}
                disabled={!filtroFecha || !filtroHora || filtroNumeroPersonas < 1 || !esFechaValida(filtroFecha)}
                className="w-full"
              >
                Buscar Canchas Disponibles
              </Button>
            </div>
          </div>
        )}

        {/* Resumen de filtros aplicados */}
        {!mostrarFiltros && (
          <div className="bg-gray-50 p-3 rounded border">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-800 text-sm">Filtros aplicados:</h4>
                <p className="text-xs text-gray-600">
                  📅 {formatDateInSpanish(filtroFecha)} ({calcularDiasDeAntelacion(filtroFecha)} días de antelación) •
                  🕐 {filtroHora} • 👥 {filtroNumeroPersonas} personas
                </p>
              </div>
              <Button
                onClick={limpiarFiltros}
                variant="link"
                size="sm"
                className="text-blue-600 hover:text-blue-800 text-xs underline p-0"
              >
                Cambiar filtros
              </Button>
            </div>
          </div>
        )}

        {/* Canchas disponibles */}
        {!mostrarFiltros && (
          <>
            {canchasDisponibles.length === 0 ? (
              <div className="text-center py-6 bg-yellow-50 rounded border">
                <p className="text-yellow-800 font-medium">No hay canchas disponibles</p>
                <p className="text-yellow-600 text-sm mt-1">Para la fecha, hora y número de personas seleccionados</p>
                <Button onClick={limpiarFiltros} className="mt-3" variant="outline">
                  Cambiar filtros
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Canchas Disponibles ({canchasDisponibles.length})
                  </Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {canchasDisponibles.map((cancha: any) => (
                      <Card
                        key={cancha.numero}
                        className={`cursor-pointer transition ${
                          canchaSeleccionada?.numero === cancha.numero
                            ? "border-2 border-green-500 bg-green-50"
                            : "hover:border-green-300"
                        }`}
                        onClick={() => setCanchaSeleccionada(cancha)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-sm">
                                Cancha {cancha.numero} - {cancha.nombre}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Capacidad: {cancha.cantidad_max_jugador} personas • ${cancha.valor.toLocaleString()}
                                /hora
                              </div>
                            </div>
                            {canchaSeleccionada?.numero === cancha.numero && (
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Equipamiento */}
                {canchaSeleccionada && equipamiento && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipamiento
                      {equipamientoSeleccionado.length > 0 && (
                        <span className="ml-2 text-xs text-green-600">
                          ({equipamientoSeleccionado.length} tipo{equipamientoSeleccionado.length !== 1 ? "s" : ""}{" "}
                          seleccionado
                          {equipamientoSeleccionado.length !== 1 ? "s" : ""})
                        </span>
                      )}
                    </Label>

                    <div className="space-y-3 max-h-48 overflow-y-auto border rounded p-3">
                      {equipamiento.map((equipment: any) => {
                        const selectedQuantity = getEquipmentQuantity(equipment.id_equipamiento)
                        return (
                          <div
                            key={equipment.id_equipamiento}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-sm">{equipment.nombre}</div>
                              <div className="text-xs text-gray-500">
                                ${equipment.costo.toLocaleString()} c/u • Stock: {equipment.stock}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                onClick={() => handleEquipmentQuantityChange(equipment.id_equipamiento, -1)}
                                disabled={selectedQuantity === 0}
                                variant="outline"
                                size="sm"
                                className="w-6 h-6 p-0 rounded-full bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300"
                              >
                                <Minus size={12} />
                              </Button>

                              <span className="w-8 text-center text-sm font-medium">{selectedQuantity}</span>

                              <Button
                                type="button"
                                onClick={() => handleEquipmentQuantityChange(equipment.id_equipamiento, 1)}
                                disabled={selectedQuantity >= equipment.stock}
                                variant="outline"
                                size="sm"
                                className="w-6 h-6 p-0 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300"
                              >
                                <Plus size={12} />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {equipamientoSeleccionado.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Equipamiento seleccionado:</h4>
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
                          <span>Subtotal equipamiento:</span>
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
                )}

                {/* Sección de jugadores */}
                {canchaSeleccionada && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600" />
                      Jugadores ({jugadores.length}/{filtroNumeroPersonas})
                    </h3>

                    {jugadores.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {jugadores.map((jugador, index) => (
                          <div key={jugador.rut} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div>
                              <span className="font-medium">
                                {jugador.nombre} {jugador.apellido}
                              </span>
                              <span className="text-sm text-gray-500 ml-2">({jugador.rut})</span>
                              {index === 0 && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                  Reservante
                                </span>
                              )}
                            </div>
                            {index > 0 && (
                              <Button
                                type="button"
                                onClick={() => handleRemoveJugador(jugador.rut)}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 size={16} />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {jugadores.length < filtroNumeroPersonas && (
                      <div className="bg-gray-50 p-3 rounded">
                        <h4 className="text-sm font-medium mb-2">Agregar jugador</h4>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <Input
                            type="text"
                            placeholder="Nombre"
                            value={nuevoJugador.nombre}
                            onChange={(e) => setNuevoJugador({ ...nuevoJugador, nombre: e.target.value })}
                            className="text-sm"
                          />
                          <Input
                            type="text"
                            placeholder="Apellido"
                            value={nuevoJugador.apellido}
                            onChange={(e) => setNuevoJugador({ ...nuevoJugador, apellido: e.target.value })}
                            className="text-sm"
                          />
                          <Input
                            type="text"
                            placeholder="RUT"
                            value={nuevoJugador.rut}
                            onChange={(e) => setNuevoJugador({ ...nuevoJugador, rut: e.target.value })}
                            className="text-sm"
                          />
                          <Input
                            type="number"
                            placeholder="Edad"
                            value={nuevoJugador.edad || ""}
                            onChange={(e) =>
                              setNuevoJugador({ ...nuevoJugador, edad: Number.parseInt(e.target.value) || 0 })
                            }
                            className="text-sm"
                          />
                        </div>
                        <Button type="button" onClick={handleAgregarJugador} className="w-full" size="sm">
                          Agregar Jugador
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Resumen de costos */}
                {canchaSeleccionada && (
                  <div className="bg-green-50 p-4 rounded border-t">
                    <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Resumen de costos:
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cancha (1 hora):</span>
                        <span>${canchaSeleccionada.valor.toLocaleString()}</span>
                      </div>
                      {equipamientoSeleccionado.length > 0 && (
                        <div className="flex justify-between">
                          <span>Equipamiento:</span>
                          <span>
                            $
                            {equipamientoSeleccionado
                              .reduce((total, eq) => total + eq.costo * eq.cantidad, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="border-t border-green-200 pt-1 flex justify-between font-medium text-green-800">
                        <span>Total:</span>
                        <span>${calcularCostoTotal().toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Verificación de saldo */}
                    <div className="mt-3 p-2 rounded bg-blue-50">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-700">Tu saldo:</span>
                        <span className="font-medium text-blue-800">${saldo?.saldo?.toLocaleString()}</span>
                      </div>
                      {(saldo?.saldo || 0) < calcularCostoTotal() && (
                        <div className="mt-1 text-xs text-red-600">
                          Saldo insuficiente. Necesitas ${(calcularCostoTotal() - (saldo?.saldo || 0)).toLocaleString()}{" "}
                          más.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button onClick={manejarConfirmarFiltros} disabled={!canchaSeleccionada} className="w-full">
                    Proceder al pago <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="pt-4 border-t border-gray-200 mt-6">
          <p className="text-center text-sm text-black">
            <Button
              type="button"
              onClick={() => router.push("/home")}
              variant="link"
              className="text-green-600 hover:underline p-0"
            >
              Volver a Home
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
