"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Trash2, Plus, AlertTriangle, Minus, Wallet, CreditCard, Check, Clock, X } from "lucide-react"

// Hooks del backend
import { useReservaPorId, useModificarReserva, useFechasDisponibles } from "@/hooks/useReserva"
import { useCanchas } from "@/hooks/useCancha"
import { useEquipamiento } from "@/hooks/useEquipamiento"
import { useObtenerSaldo, useActualizarSaldo } from "@/hooks/useSaldo"
import { useUserProfile } from "@/hooks/useUserProfile"

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

// Función para calcular días de antelación
function calcularDiasDeAntelacion(fecha: string): number {
  if (!fecha) return -1

  const fechaReserva = new Date(fecha)
  const hoy = new Date()

  if (isNaN(fechaReserva.getTime())) return -1

  fechaReserva.setHours(0, 0, 0, 0)
  hoy.setHours(0, 0, 0, 0)

  const diferenciaMilisegundos = fechaReserva.getTime() - hoy.getTime()
  const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24))

  return diferenciaDias
}

function esFechaValida(fecha: string): boolean {
  if (!fecha) return false
  const diasAntelacion = calcularDiasDeAntelacion(fecha)
  return diasAntelacion >= 7
}

// Función para generar fechas disponibles (7 días a 30 días en adelante)
function generarFechasDisponibles(): string[] {
  const fechas: string[] = []
  const hoy = new Date()

  // Generar fechas desde 7 días hasta 30 días en adelante
  for (let i = 7; i <= 30; i++) {
    const fecha = new Date()
    fecha.setDate(hoy.getDate() + i)
    fechas.push(fecha.toISOString().split("T")[0])
  }

  return fechas
}

// ✅ FUNCIÓN MEJORADA para formatear hora a HH:MM
const formatearHora = (hora: string): string => {
  if (!hora) return ""

  // Si ya está en formato HH:MM, devolverlo tal como está
  if (/^\d{2}:\d{2}$/.test(hora)) {
    return hora
  }

  // Si está en formato H:MM, agregar cero inicial
  if (/^\d{1}:\d{2}$/.test(hora)) {
    return `0${hora}`
  }

  // Si tiene segundos (HH:MM:SS), quitar los segundos
  if (/^\d{2}:\d{2}:\d{2}$/.test(hora)) {
    return hora.substring(0, 5)
  }

  return hora
}

// Función para calcular hora de término basada en hora inicio y duración
const calcularHoraFin = (horaInicio: string, duracionMinutos: number): string => {
  if (!horaInicio) return ""

  const [h, m] = horaInicio.split(":").map(Number)
  const totalMinutos = h * 60 + m + duracionMinutos
  const horaFin = Math.floor(totalMinutos / 60)
  const minutosFin = totalMinutos % 60
  return `${horaFin.toString().padStart(2, "0")}:${minutosFin.toString().padStart(2, "0")}`
}

export default function ModificarReserva() {
  const router = useRouter()
  const params = useParams()
  const { token, loading } = useAuth()
  const id = typeof params?.id === "string" ? Number.parseInt(params.id) : undefined

  // Hooks del backend
  const { data: reservaActual, isLoading: loadingReserva, error: errorReserva } = useReservaPorId(id || 0)
  const { data: canchas, isLoading: loadingCanchas } = useCanchas()
  const { data: equipamientos, isLoading: loadingEquipamiento } = useEquipamiento()
  const { data: saldoData } = useObtenerSaldo()
  const { data: userProfile } = useUserProfile()
  const { data: fechasDisponiblesBackend } = useFechasDisponibles()
  const modificarReserva = useModificarReserva(userProfile?.rut || "")
  const actualizarSaldo = useActualizarSaldo()

  // Generar fechas disponibles (fallback si el backend no responde)
  const fechasGeneradas = generarFechasDisponibles()

  // Usar fechas del backend si están disponibles, sino usar las generadas
  const fechasValidas =
    Array.isArray(fechasDisponiblesBackend) && fechasDisponiblesBackend.length > 0
      ? fechasDisponiblesBackend
      : fechasGeneradas

  // Estados del formulario
  const [fecha, setFecha] = useState("")
  const [hora_inicio, setHoraInicio] = useState("")
  const [hora_termino, setHoraTermino] = useState("")
  const [filtroDuracion, setFiltroDuracion] = useState<number>(90)
  const [numero_cancha, setNumeroCancha] = useState("")
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [nuevoJugador, setNuevoJugador] = useState<Jugador>({
    nombre: "",
    apellido: "",
    rut: "",
    edad: 0,
  })
  const [error, setError] = useState<string | null>(null)

  // ✅ ESTADOS PARA DATOS DEL RESERVANTE ORIGINAL
  const [editandoReservante, setEditandoReservante] = useState(false)
  const [datosReservante, setDatosReservante] = useState({
    apellido: "",
    edad: 18,
  })
  const [datosReservanteOriginales, setDatosReservanteOriginales] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    edad: 0,
  })

  // Estados de equipamiento
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState<EquipamientoSeleccionado[]>([])

  // Estados para el proceso de pago
  const [costoOriginal, setCostoOriginal] = useState(0)
  const [mostrarPago, setMostrarPago] = useState(false)
  const [pagoCompletado, setPagoCompletado] = useState(false)
  const [diferenciaCosto, setDiferenciaCosto] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ NUEVO ESTADO PARA MANEJAR ERRORES DETALLADOS
  const [errorDetallado, setErrorDetallado] = useState<{
    mensaje: string
    detalles?: any
    statusCode?: number
  } | null>(null)

  const isLoading = loadingReserva || loadingCanchas || loadingEquipamiento

  // Obtener el máximo de jugadores permitidos para la cancha seleccionada
  const maximoJugadores =
    numero_cancha && canchas ? canchas.find((c) => c.numero_cancha === Number(numero_cancha))?.maxJugadores || 0 : 0

  // ✅ CARGAR DATOS DE LA RESERVA Y PRESERVAR DATOS DEL RESERVANTE ORIGINAL
  useEffect(() => {
    if (reservaActual) {
      // Verificar si la reserva puede ser modificada (7 días de antelación)
      const diasAntelacion = calcularDiasDeAntelacion(reservaActual.fecha)
      if (diasAntelacion < 7) {
        setError(
          `Esta reserva no puede ser modificada. Solo tiene ${diasAntelacion} días de antelación (mínimo requerido: 7 días).`,
        )
        return
      }

      // Validar y asignar valores con fallbacks seguros
      setFecha(reservaActual.fecha || "")

      // ✅ FORMATEAR HORAS CORRECTAMENTE
      const horaInicioFormateada = formatearHora(reservaActual.hora_inicio || "")
      setHoraInicio(horaInicioFormateada)

      // Calcular duración basada en horas de inicio y término
      if (reservaActual.hora_inicio && reservaActual.hora_termino) {
        const [horasInicio, minutosInicio] = reservaActual.hora_inicio.split(":").map(Number)
        const [horasTermino, minutosTermino] = reservaActual.hora_termino.split(":").map(Number)
        const inicioEnMinutos = horasInicio * 60 + minutosInicio
        const terminoEnMinutos = horasTermino * 60 + minutosTermino
        const duracionCalculada = terminoEnMinutos - inicioEnMinutos

        if (duracionCalculada > 0 && duracionCalculada >= 90 && duracionCalculada <= 180) {
          setFiltroDuracion(duracionCalculada)
        } else {
          setFiltroDuracion(90)
        }
      }

      setNumeroCancha(reservaActual.numero_cancha ? reservaActual.numero_cancha.toString() : "")

      // ✅ PRESERVAR DATOS DEL RESERVANTE ORIGINAL
      if (Array.isArray(reservaActual.jugadores) && reservaActual.jugadores.length > 0) {
        const reservanteOriginal = reservaActual.jugadores[0]
        setDatosReservanteOriginales({
          nombre: reservanteOriginal.nombre || "",
          apellido: reservanteOriginal.apellido || "",
          rut: reservanteOriginal.rut || "",
          edad: reservanteOriginal.edad || 18,
        })

        setDatosReservante({
          apellido: reservanteOriginal.apellido || "",
          edad: reservanteOriginal.edad || 18,
        })

        setJugadores(reservaActual.jugadores)
      }

      setEquipamientoSeleccionado(Array.isArray(reservaActual.equipamiento) ? reservaActual.equipamiento : [])
      setCostoOriginal(typeof reservaActual.costo_total === "number" ? reservaActual.costo_total : 0)
    }
  }, [reservaActual])

  // ✅ EFECTO MODIFICADO PARA NO SOBRESCRIBIR DATOS DEL RESERVANTE ORIGINAL
  useEffect(() => {
    if (userProfile && numero_cancha && canchas && !datosReservanteOriginales.rut) {
      const canchaSeleccionada = canchas.find((c) => c.numero_cancha === Number(numero_cancha))

      if (canchaSeleccionada) {
        const usuarioYaEstaEnLista = jugadores.some((j) => j.rut === userProfile.rut)

        if (!usuarioYaEstaEnLista) {
          const nombreCompleto = userProfile.nombre_usuario || ""
          const partesNombre = nombreCompleto.split(" ")
          const nombre = partesNombre[0] || ""
          const apellido = partesNombre.slice(1).join(" ") || ""

          setDatosReservante({
            apellido: apellido,
            edad: 18,
          })

          const nuevoUsuario: Jugador = {
            nombre: nombre,
            apellido: apellido,
            rut: userProfile.rut,
            edad: apellido ? 18 : 0,
          }

          setJugadores((prevJugadores) => {
            if (prevJugadores.length > 0) {
              return [nuevoUsuario, ...prevJugadores.slice(1)]
            } else {
              return [nuevoUsuario]
            }
          })

          if (!apellido) {
            setEditandoReservante(true)
          }
        }
      }
    }
  }, [userProfile, numero_cancha, canchas, datosReservanteOriginales.rut])

  // Verificar autenticación
  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login")
      return
    }
  }, [token, loading, router])

  // Manejar errores de carga
  useEffect(() => {
    if (errorReserva) {
      setError("Error al cargar la reserva")
    }
  }, [errorReserva])

  // Debug: Mostrar información de fechas y canchas en consola
  useEffect(() => {
    if (fechasDisponiblesBackend) {
      console.log("Fechas del backend:", fechasDisponiblesBackend)
      console.log("Número de fechas del backend:", fechasDisponiblesBackend.length)
    }
    if (canchas) {
      console.log("Canchas disponibles:", canchas)
      console.log("Número de canchas:", canchas.length)
    }
  }, [fechasDisponiblesBackend, canchas])

  // ✅ FUNCIÓN PARA ACTUALIZAR DATOS DEL RESERVANTE
  const actualizarDatosReservante = () => {
    const errores = []

    if (!datosReservante.apellido || datosReservante.apellido.trim().length < 2) {
      errores.push("El apellido debe tener al menos 2 caracteres")
    }

    if (datosReservante.edad < 10 || datosReservante.edad > 80) {
      errores.push("La edad debe estar entre 10 y 80 años")
    }

    if (errores.length > 0) {
      setError(`Errores en los datos del reservante:\n${errores.join("\n")}`)
      return
    }

    setJugadores((prev) =>
      prev.map((jugador, index) => {
        if (index === 0) {
          return {
            ...jugador,
            apellido: datosReservante.apellido.trim(),
            edad: datosReservante.edad,
          }
        }
        return jugador
      }),
    )

    setEditandoReservante(false)
    setError(null)
  }

  const handleAgregarJugador = () => {
    if (jugadores.length >= maximoJugadores) {
      setError(`No se pueden agregar más jugadores. El máximo es ${maximoJugadores}.`)
      return
    }

    // ✅ VALIDACIONES ESPECÍFICAS DEL DTO
    const errores = []

    if (!nuevoJugador.nombre || nuevoJugador.nombre.trim().length < 2) {
      errores.push("El nombre debe tener al menos 2 caracteres")
    }

    if (!nuevoJugador.apellido || nuevoJugador.apellido.trim().length < 2) {
      errores.push("El apellido debe tener al menos 2 caracteres")
    }

    if (!nuevoJugador.rut || !/^[0-9]+-[0-9kK]{1}$/.test(nuevoJugador.rut.trim())) {
      errores.push("El RUT debe tener formato válido (ej: 12345678-9)")
    }

    if (!nuevoJugador.edad || nuevoJugador.edad < 10 || nuevoJugador.edad > 80) {
      errores.push("La edad debe estar entre 10 y 80 años")
    }

    if (errores.length > 0) {
      setError(`Errores en los datos del jugador:\n${errores.join("\n")}`)
      return
    }

    if (jugadores.some((j) => j.rut === nuevoJugador.rut.trim())) {
      setError("Ya existe un jugador con ese RUT")
      return
    }

    // ✅ LIMPIAR DATOS ANTES DE AGREGAR
    const jugadorLimpio = {
      nombre: nuevoJugador.nombre.trim(),
      apellido: nuevoJugador.apellido.trim(),
      rut: nuevoJugador.rut.trim(),
      edad: nuevoJugador.edad,
    }

    setJugadores([...jugadores, jugadorLimpio])
    setNuevoJugador({
      nombre: "",
      apellido: "",
      rut: "",
      edad: 0,
    })
    setError(null)
  }

  const handleRemoveJugador = (rut: string) => {
    if (rut === userProfile?.rut || rut === datosReservanteOriginales.rut) {
      setError("No puedes eliminar al usuario que realiza la reserva")
      return
    }

    setJugadores(jugadores.filter((j) => j.rut !== rut))
  }

  const handleEquipmentQuantityChange = (equipmentId: number, change: number) => {
    const equipment = equipamientos?.find((e) => e.id === equipmentId)
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
            id: equipment.id,
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

  const calcularCostoTotal = (): number => {
    const costoCancha =
      numero_cancha && canchas ? canchas.find((c) => c.numero_cancha === Number.parseInt(numero_cancha))?.valor || 0 : 0

    const costoEquipamiento = equipamientoSeleccionado.reduce((total, eq) => total + eq.costo * eq.cantidad, 0)

    return costoCancha + costoEquipamiento
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null) // ✅ Limpiar errores previos
    setErrorDetallado(null) // ✅ Limpiar errores detallados

    try {
      if (!fecha || !hora_inicio || !numero_cancha || !id) {
        throw new Error("Completa todos los campos requeridos")
      }

      if (!esFechaValida(fecha)) {
        const diasAntelacion = calcularDiasDeAntelacion(fecha)
        throw new Error(
          `No se puede modificar a una fecha con ${diasAntelacion} días de antelación. Mínimo requerido: 7 días.`,
        )
      }

      if (filtroDuracion < 90 || filtroDuracion > 180) {
        throw new Error(
          `La duración de la reserva debe ser entre 90 y 180 minutos. Duración seleccionada: ${filtroDuracion} minutos.`,
        )
      }

      if (jugadores.length === 0) {
        throw new Error("Debe haber al menos un jugador (el usuario que reserva)")
      }

      const reservante = jugadores[0]
      if (!reservante || !reservante.apellido || reservante.edad < 10) {
        setError("Completa los datos del reservante (apellido y edad mínima 10 años)")
        setEditandoReservante(true)
        return
      }

      const nuevoCosto = calcularCostoTotal()
      const diferencia = nuevoCosto - costoOriginal
      setDiferenciaCosto(diferencia)

      if (diferencia !== 0) {
        const saldoActual = userProfile?.saldo || 0
        if (diferencia > 0 && saldoActual < diferencia) {
          throw new Error(
            `Saldo insuficiente. Necesitas $${diferencia.toLocaleString()} adicionales para esta modificación.`,
          )
        }

        setMostrarPago(true)
        setIsSubmitting(false)
        return
      }

      await actualizarReservaBackend()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al modificar reserva")
      setIsSubmitting(false)
    }
  }

  // ✅ FUNCIÓN MEJORADA CON MANEJO DE ERRORES DETALLADO
  const actualizarReservaBackend = async () => {
    setIsSubmitting(true)
    setError(null)
    setErrorDetallado(null)

    try {
      if (!id || !userProfile?.rut) {
        throw new Error("Datos de reserva incompletos")
      }

      // ✅ PREPARAR DATOS CON VALIDACIÓN ESTRICTA PARA EL BACKEND
      const datosActualizacion = {
        fecha,
        // ✅ ASEGURAR FORMATO HH:MM EXACTO (sin segundos)
        hora_inicio: formatearHora(hora_inicio),
        hora_termino: formatearHora(calcularHoraFin(hora_inicio, filtroDuracion)),
        numero_cancha: Number.parseInt(numero_cancha),
        equipamiento: equipamientoSeleccionado.map((eq) => ({
          id: eq.id,
          cantidad: eq.cantidad,
          costo: eq.costo,
        })),
        // ✅ VALIDAR Y LIMPIAR DATOS DE JUGADORES CON VALIDACIONES ESPECÍFICAS DEL DTO
        /*jugadores: jugadores
          .map((jugador) => ({
            nombre: jugador.nombre?.trim() || "",
            apellido: jugador.apellido?.trim() || "",
            rut: jugador.rut?.trim() || "",
            edad: Number(jugador.edad) || 18,
          }))
          .filter((jugador) => {
            // Filtrar jugadores que cumplan con todas las validaciones del DTO
            return (
              jugador.nombre.length >= 2 && // MinLength(2)
              jugador.apellido.length >= 2 && // MinLength(2)
              /^[0-9]+-[0-9kK]{1}$/.test(jugador.rut) && // Regex exacto del DTO
              jugador.edad >= 10 && // Min(10)
              jugador.edad <= 80 // Max(80)
            )
          }),*/
      }

      // ✅ VALIDACIONES ADICIONALES MÁS ESPECÍFICAS ANTES DE ENVIAR
      const erroresValidacion = []

      // Validar fecha
      if (!datosActualizacion.fecha || !/^\d{4}-\d{2}-\d{2}$/.test(datosActualizacion.fecha)) {
        erroresValidacion.push("Fecha debe estar en formato YYYY-MM-DD")
      }

      // Validar horas (regex exacto del DTO)
      if (!datosActualizacion.hora_inicio || !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(datosActualizacion.hora_inicio)) {
        erroresValidacion.push("Hora de inicio debe estar en formato HH:MM")
      }

      if (
        !datosActualizacion.hora_termino ||
        !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(datosActualizacion.hora_termino)
      ) {
        erroresValidacion.push("Hora de término debe estar en formato HH:MM")
      }

      // Validar número de cancha
      if (!datosActualizacion.numero_cancha || datosActualizacion.numero_cancha < 1) {
        erroresValidacion.push("Número de cancha debe ser mayor a 0")
      }

      /*// Validar jugadores con validaciones específicas del DTO
      if (!datosActualizacion.jugadores || datosActualizacion.jugadores.length === 0) {
        erroresValidacion.push("Debe haber al menos un jugador")
      }

      datosActualizacion.jugadores.forEach((jugador, index) => {
        // Validaciones exactas del CreateJugadorDto
        if (!jugador.nombre || jugador.nombre.length < 2) {
          erroresValidacion.push(`Jugador ${index + 1}: Nombre debe tener al menos 2 caracteres`)
        }
        if (!jugador.apellido || jugador.apellido.length < 2) {
          erroresValidacion.push(`Jugador ${index + 1}: Apellido debe tener al menos 2 caracteres`)
        }
        if (!jugador.rut || !/^[0-9]+-[0-9kK]{1}$/.test(jugador.rut)) {
          erroresValidacion.push(`Jugador ${index + 1}: RUT debe tener formato válido (ej: 12345678-9)`)
        }
        if (!jugador.edad || jugador.edad < 10 || jugador.edad > 80) {
          erroresValidacion.push(`Jugador ${index + 1}: Edad debe estar entre 10 y 80 años`)
        }
      })*/

      // Validar equipamiento
      datosActualizacion.equipamiento.forEach((eq, index) => {
        if (!eq.id || eq.id < 1) erroresValidacion.push(`Equipamiento ${index + 1}: ID inválido`)
        if (!eq.cantidad || eq.cantidad < 1 || eq.cantidad > 10) {
          erroresValidacion.push(`Equipamiento ${index + 1}: Cantidad debe estar entre 1 y 10`)
        }
      })

      if (erroresValidacion.length > 0) {
        throw new Error(`Errores de validación:\n${erroresValidacion.join("\n")}`)
      }

      // ✅ LOGGING MÁS DETALLADO PARA DEBUG
      console.log("🔄 Datos completos enviados:", {
        id,
        datosActualizacion,
        tiposDatos: {
          fecha: typeof datosActualizacion.fecha,
          hora_inicio: typeof datosActualizacion.hora_inicio,
          hora_termino: typeof datosActualizacion.hora_termino,
          numero_cancha: typeof datosActualizacion.numero_cancha,
          equipamiento: Array.isArray(datosActualizacion.equipamiento),
          //jugadores: Array.isArray(datosActualizacion.jugadores),
        },
        validaciones: {
          fechaValida: /^\d{4}-\d{2}-\d{2}$/.test(datosActualizacion.fecha),
          horaInicioValida: /^\d{2}:\d{2}$/.test(datosActualizacion.hora_inicio),
          horaTerminoValida: /^\d{2}:\d{2}$/.test(datosActualizacion.hora_termino),
          numeroCanchaValido: !isNaN(datosActualizacion.numero_cancha),
          //jugadoresConDatos: datosActualizacion.jugadores.every((j) => j.nombre && j.apellido && j.rut),
        },
      })

      console.log("🔄 Enviando datos al backend:", JSON.stringify(datosActualizacion, null, 2))
      console.log("🔄 ID de reserva:", id)
      console.log("🔄 Token presente:", !!token)

      // ✅ USAR EL HOOK CON MANEJO DE ERRORES MEJORADO
      const resultado = await modificarReserva.mutateAsync({
        id,
        data: datosActualizacion,
      })

      console.log("✅ Respuesta del backend:", resultado)

      // ✅ VERIFICAR SI LA RESPUESTA INDICA ÉXITO
      if (resultado && resultado.success === false) {
        throw new Error(resultado.message || "Error al actualizar la reserva")
      }

      // ✅ SOLO CONTINUAR SI LA MODIFICACIÓN FUE EXITOSA
      if (diferenciaCosto !== 0) {
        const saldoActual = userProfile?.saldo || 0
        const nuevoSaldo = saldoActual - diferenciaCosto

        await actualizarSaldo.mutateAsync({
          nuevoSaldo,
          transaccion: `Modificación de reserva #${id}: ${diferenciaCosto > 0 ? "Cargo" : "Reembolso"} de $${Math.abs(diferenciaCosto).toLocaleString()}`,
        })
      }

      if (mostrarPago) {
        setPagoCompletado(true)
      } else {
        alert("Reserva modificada exitosamente")
        router.push("/reservas")
      }
    } catch (err: any) {
      console.error("❌ Error completo:", err)

      // ✅ MANEJO DETALLADO DE ERRORES
      let mensajeError = "Error al modificar reserva"
      let detallesError = null
      let statusCode = null

      if (err?.response) {
        // Error de respuesta HTTP
        statusCode = err.response.status
        const responseData = err.response.data

        if (responseData?.message) {
          mensajeError = responseData.message
        } else if (responseData?.error) {
          mensajeError = responseData.error
        }

        detallesError = {
          status: err.response.status,
          data: responseData,
          headers: err.response.headers,
        }

        console.error("❌ Error de respuesta HTTP:", {
          status: err.response.status,
          data: responseData,
          headers: err.response.headers,
        })
      } else if (err?.request) {
        // Error de red
        mensajeError = "Error de conexión con el servidor"
        detallesError = { request: err.request }
        console.error("❌ Error de red:", err.request)
      } else if (err?.message) {
        // Error de JavaScript
        mensajeError = err.message
        console.error("❌ Error de JavaScript:", err.message)
      }

      setErrorDetallado({
        mensaje: mensajeError,
        detalles: detallesError,
        statusCode,
      })

      setError(mensajeError)

      // ✅ NO MOSTRAR PANTALLA DE ÉXITO EN CASO DE ERROR
      setMostrarPago(false)
      setPagoCompletado(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmarPago = () => {
    actualizarReservaBackend()
  }

  const cancelarPago = () => {
    setMostrarPago(false)
  }

  const volverAReservas = () => {
    router.push("/reservas")
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando datos de la reserva...</p>
        </div>
      </div>
    )
  }

  if (!reservaActual) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">No se pudo cargar la reserva</p>
          <button
            onClick={() => router.push("/reservas")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Volver a mis reservas
          </button>
        </div>
      </div>
    )
  }

  // ✅ PANTALLA DE ERROR DETALLADO
  if (errorDetallado && !mostrarPago && !pagoCompletado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Error al Modificar Reserva</h2>
          <p className="text-gray-600 mb-6 text-center">{errorDetallado.mensaje}</p>

          {errorDetallado.statusCode && (
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-red-800 mb-2">Código de Error: {errorDetallado.statusCode}</h3>
            </div>
          )}

          {errorDetallado.detalles && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Detalles Técnicos:</h3>
              <pre className="text-xs text-gray-600 overflow-auto max-h-40 bg-white p-2 rounded border">
                {JSON.stringify(errorDetallado.detalles, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => {
                setErrorDetallado(null)
                setError(null)
              }}
              className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
            >
              Intentar de nuevo
            </button>
            <button
              onClick={() => router.push("/reservas")}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
            >
              Volver a mis reservas
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Pantalla de pago completado
  if (pagoCompletado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Reserva Modificada!</h2>
          <p className="text-gray-600 mb-6">Tu reserva ha sido actualizada correctamente.</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Cancha:</span>
              <span className="font-medium">
                {canchas?.find((c) => c.numero_cancha === Number.parseInt(numero_cancha))?.nombre}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Fecha:</span>
              <span className="font-medium">{fecha}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Hora:</span>
              <span className="font-medium">
                {hora_inicio} - {hora_termino}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Duración:</span>
              <span className="font-medium">{filtroDuracion} minutos</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Jugadores:</span>
              <span className="font-medium">{jugadores.length}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
              <span className="text-gray-700 font-medium">Costo original:</span>
              <span className="font-medium">${costoOriginal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Nuevo costo:</span>
              <span className="font-medium">${calcularCostoTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-700 font-medium">
                {diferenciaCosto > 0 ? "Cargo adicional:" : "Reembolso:"}
              </span>
              <span className={`font-bold ${diferenciaCosto > 0 ? "text-red-600" : "text-green-600"}`}>
                ${Math.abs(diferenciaCosto).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800 font-medium">Tu nuevo saldo</p>
            <p className="text-2xl font-bold text-blue-700">${userProfile?.saldo.toLocaleString()}</p>
          </div>

          <button
            onClick={volverAReservas}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
          >
            Volver a mis reservas
          </button>
        </div>
      </div>
    )
  }

  // Pantalla de confirmación de pago
  if (mostrarPago) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold text-center mb-4">Confirmar Cambios</h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Detalles de la modificación</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cancha:</span>
                <span>{canchas?.find((c) => c.numero_cancha === Number.parseInt(numero_cancha))?.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span>{fecha}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hora:</span>
                <span>
                  {hora_inicio} - {hora_termino}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duración:</span>
                <span>{filtroDuracion} minutos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jugadores:</span>
                <span>{jugadores.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Cambio en el costo</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Costo original:</span>
                <span>${costoOriginal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nuevo costo:</span>
                <span>${calcularCostoTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
                <span>{diferenciaCosto > 0 ? "Cargo adicional:" : "Reembolso:"}</span>
                <span className={diferenciaCosto > 0 ? "text-red-600" : "text-green-600"}>
                  ${Math.abs(diferenciaCosto).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-800">Tu saldo actual</p>
                <p className="text-lg font-bold text-blue-700">${userProfile?.saldo.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-500" />
            </div>

            {diferenciaCosto > 0 && (userProfile?.saldo || 0) < diferenciaCosto ? (
              <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
                <p className="font-medium">Saldo insuficiente</p>
                <p className="text-xs">
                  Necesitas ${(diferenciaCosto - (userProfile?.saldo || 0)).toLocaleString()} más para completar esta
                  modificación.
                </p>
                <button
                  onClick={() => router.push("/cargar-dinero")}
                  className="mt-1 w-full py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs flex items-center justify-center"
                >
                  <CreditCard className="h-3 w-3 mr-1" /> Cargar dinero
                </button>
              </div>
            ) : (
              <div className="mt-2 p-2 bg-green-100 text-green-700 text-sm rounded">
                <p>
                  {diferenciaCosto > 0
                    ? "Saldo suficiente para completar esta modificación"
                    : "Recibirás un reembolso por la diferencia"}
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button onClick={cancelarPago} className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800">
              Cancelar
            </button>
            <button
              onClick={confirmarPago}
              disabled={isSubmitting || (diferenciaCosto > 0 && (userProfile?.saldo || 0) < diferenciaCosto)}
              className={`flex-1 py-2 rounded text-white ${
                isSubmitting || (diferenciaCosto > 0 && (userProfile?.saldo || 0) < diferenciaCosto)
                  ? "bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? "Procesando..." : "Confirmar cambios"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-bold mb-6 text-center">Modificar Reserva</h1>

        {/* Aviso de antelación mínima */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-medium">Política de Modificación</p>
              <p className="text-xs text-blue-700 mt-1">
                Las modificaciones deben mantener un <strong>mínimo de 7 días de antelación</strong> y una duración
                entre <strong>90 y 180 minutos</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Información de saldo */}
        <div className="bg-green-50 p-3 rounded-lg mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-green-800 font-medium">Tu saldo disponible</p>
            <p className="text-lg font-bold text-green-700">${userProfile?.saldo.toLocaleString()}</p>
          </div>
          <Wallet className="h-6 w-6 text-green-600" />
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha (mínimo 7 días de antelación)</label>
            <select
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full border rounded p-2"
            >
              <option value="">Selecciona una fecha</option>
              {fechasValidas.map((date) => (
                <option key={date} value={date}>
                  {date} ({calcularDiasDeAntelacion(date)} días de antelación)
                </option>
              ))}
            </select>
            {fecha && <p className="text-xs text-gray-500 mt-1">Antelación: {calcularDiasDeAntelacion(fecha)} días</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
              <input
                type="time"
                value={hora_inicio}
                onChange={(e) => {
                  const horaFormateada = formatearHora(e.target.value)
                  setHoraInicio(horaFormateada)
                  if (horaFormateada) {
                    setHoraTermino(calcularHoraFin(horaFormateada, filtroDuracion))
                  }
                }}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora término</label>
              <input
                type="time"
                value={hora_termino}
                readOnly
                className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
                title="La hora de término se calcula automáticamente basada en la hora de inicio y duración"
              />
            </div>
          </div>

          {/* Selector de duración */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Duración de la reserva
            </label>
            <select
              value={filtroDuracion}
              onChange={(e) => {
                const nuevaDuracion = Number(e.target.value)
                setFiltroDuracion(nuevaDuracion)
                if (hora_inicio) {
                  setHoraTermino(calcularHoraFin(hora_inicio, nuevaDuracion))
                }
              }}
              required
              className="w-full border rounded p-2"
            >
              <option value={90}>90 minutos (1.5 horas)</option>
              <option value={120}>120 minutos (2 horas)</option>
              <option value={150}>150 minutos (2.5 horas)</option>
              <option value={180}>180 minutos (3 horas)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Duración: {filtroDuracion} minutos
              {hora_inicio && ` • Hora de término: ${calcularHoraFin(hora_inicio, filtroDuracion)}`}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cancha</label>
            <select
              value={numero_cancha}
              onChange={(e) => setNumeroCancha(e.target.value)}
              required
              className="w-full border rounded p-2"
            >
              <option value="">Selecciona una cancha</option>
              {canchas?.map((c) => (
                <option key={c.numero_cancha} value={c.numero_cancha}>
                  Cancha {c.numero_cancha} - {c.nombre} - ${c.valor.toLocaleString()} (Máx: {c.maxJugadores} personas)
                </option>
              ))}
            </select>
            {canchas && (
              <p className="text-xs text-gray-500 mt-1">
                {canchas.length} cancha{canchas.length !== 1 ? "s" : ""} disponible{canchas.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Sección de jugadores */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium text-gray-800 mb-2">
              Jugadores ({jugadores.length}/{maximoJugadores || "?"})
            </h3>

            {/* Lista de jugadores agregados */}
            {jugadores.length > 0 && (
              <div className="mb-4 space-y-2">
                {jugadores.map((jugador, index) => (
                  <div key={jugador.rut} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex-1">
                      <span className="font-medium">
                        {jugador.nombre} {jugador.apellido || "(Sin apellido)"}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">({jugador.rut})</span>
                      {jugador.edad > 0 && <span className="text-sm text-gray-500 ml-2">- {jugador.edad} años</span>}
                      {index === 0 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Reservante</span>
                      )}
                      {index === 0 && (!jugador.apellido || jugador.edad < 10) && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                          Datos incompletos
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <button
                          type="button"
                          onClick={() => setEditandoReservante(true)}
                          className="text-blue-500 hover:text-blue-700 text-xs"
                        >
                          Editar
                        </button>
                      )}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveJugador(jugador.rut)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {editandoReservante && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <h4 className="text-sm font-medium mb-2 text-blue-800">Completar datos del reservante</h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Apellido *"
                    value={datosReservante.apellido}
                    onChange={(e) => setDatosReservante({ ...datosReservante, apellido: e.target.value })}
                    className="px-2 py-1 border rounded text-sm bg-white text-gray-900"
                  />
                  <input
                    type="number"
                    placeholder="Edad *"
                    min="10"
                    value={datosReservante.edad || ""}
                    onChange={(e) =>
                      setDatosReservante({ ...datosReservante, edad: Number.parseInt(e.target.value) || 10 })
                    }
                    className="px-2 py-1 border rounded text-sm bg-white text-gray-900"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={actualizarDatosReservante}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditandoReservante(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm py-1 rounded"
                  >
                    Cancelar
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-1">* El apellido es requerido y la edad mínima es 10 años</p>
              </div>
            )}

            {/* Formulario para agregar jugadores */}
            {numero_cancha && jugadores.length < (maximoJugadores || 1) && (
              <div className="bg-gray-50 p-3 rounded">
                <h4 className="text-sm font-medium mb-2">Agregar jugador</h4>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nuevoJugador.nombre}
                    onChange={(e) => setNuevoJugador({ ...nuevoJugador, nombre: e.target.value })}
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={nuevoJugador.apellido}
                    onChange={(e) => setNuevoJugador({ ...nuevoJugador, apellido: e.target.value })}
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="RUT"
                    value={nuevoJugador.rut}
                    onChange={(e) => setNuevoJugador({ ...nuevoJugador, rut: e.target.value })}
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Edad (min. 10)"
                    min="10"
                    value={nuevoJugador.edad || ""}
                    onChange={(e) => setNuevoJugador({ ...nuevoJugador, edad: Number.parseInt(e.target.value) || 10 })}
                    className="px-2 py-1 border rounded text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAgregarJugador}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 rounded flex items-center justify-center"
                >
                  <Plus size={16} className="mr-1" /> Agregar Jugador
                </button>
              </div>
            )}
          </div>

          {/* Sección de equipamiento */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium text-gray-800 mb-2">
              Equipamiento
              {equipamientoSeleccionado.length > 0 && (
                <span className="ml-2 text-xs text-green-600">
                  ({equipamientoSeleccionado.length} tipo{equipamientoSeleccionado.length !== 1 ? "s" : ""} seleccionado
                  {equipamientoSeleccionado.length !== 1 ? "s" : ""})
                </span>
              )}
            </h3>

            <div className="space-y-3 max-h-48 overflow-y-auto border rounded p-3">
              {equipamientos?.map((equipment) => {
                const selectedQuantity = getEquipmentQuantity(equipment.id)
                return (
                  <div key={equipment.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{equipment.nombre}</div>
                      <div className="text-xs text-gray-500">
                        ${equipment.costo.toLocaleString()} c/u • Stock: {equipment.stock} • Tipo: {equipment.tipo}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEquipmentQuantityChange(equipment.id, -1)}
                        disabled={selectedQuantity === 0}
                        className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed text-xs"
                      >
                        <Minus size={12} />
                      </button>

                      <span className="w-8 text-center text-sm font-medium">{selectedQuantity}</span>

                      <button
                        type="button"
                        onClick={() => handleEquipmentQuantityChange(equipment.id, 1)}
                        disabled={selectedQuantity >= equipment.stock}
                        className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed text-xs"
                      >
                        <Plus size={12} />
                      </button>
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
                    {equipamientoSeleccionado.reduce((total, eq) => total + eq.costo * eq.cantidad, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Resumen de costos actualizado */}
          {numero_cancha && canchas && (
            <div className="bg-green-50 p-4 rounded border-t mt-4">
              <h3 className="font-medium text-green-800 mb-2">Resumen de costos:</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Cancha ({filtroDuracion} min):</span>
                  <span>
                    $
                    {canchas.find((c) => c.numero_cancha === Number.parseInt(numero_cancha))?.valor.toLocaleString() ||
                      0}
                  </span>
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
                  <span>Nuevo total:</span>
                  <span>${calcularCostoTotal().toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-xs mt-2">
                  <span>Costo original:</span>
                  <span>${costoOriginal.toLocaleString()}</span>
                </div>

                {calcularCostoTotal() !== costoOriginal && (
                  <div className="flex justify-between text-xs font-medium">
                    <span>{calcularCostoTotal() > costoOriginal ? "Cargo adicional:" : "Reembolso:"}</span>
                    <span className={calcularCostoTotal() > costoOriginal ? "text-red-600" : "text-green-600"}>
                      ${Math.abs(calcularCostoTotal() - costoOriginal).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/reservas")}
              className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:bg-gray-400"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
