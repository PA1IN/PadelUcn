import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/api/axios"


export function useObtenerReservas(rut_usuario: string) {
  return useQuery({
    queryKey: ["reservas", rut_usuario],
    queryFn: async () => {
      const respuesta = await api.get(`/api/reserva/usuario/${rut_usuario}`)
      return respuesta.data.data
    },
    enabled: Boolean(rut_usuario),
  })
}

export interface Jugador {
  nombre: string
  apellido: string
  rut: string
  edad: number
}

export interface Datosreserva {
  fecha: string
  hora_inicio: string
  hora_termino: string
  rut_usuario: string
  numero_cancha: number
  equipamiento: { id: number; cantidad: number; costo: number }[]
  jugadores: Jugador[]
}


export function useCrearReserva(onSuccess?: () => void, onError?: (error: string) => void) {
  const clienteQuery = useQueryClient()
  return useMutation({
    mutationFn: async (reserva: Datosreserva) => {
      const respuesta = await api.post("api/reserva", reserva)
      return respuesta.data
    },
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["reservas"] })
      if (onSuccess) onSuccess()
    },
    onError: (error: string) => {
      if (onError) onError(error)
    },
  })
}


export function useEliminarReserva(rut: string) {
  const clienteQuery = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const respuesta = await api.delete(`api/reserva/${id}`)
      return respuesta.data
    },
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["reservas", rut] })
    },
  })
}

// 🔄 USAR ESTE HOOK PARA OBTENER UNA RESERVA POR ID
export function useReservaPorId(id: number) {
  return useQuery({
    queryKey: ["reserva", id],
    queryFn: async () => {
      const respuesta = await api.get(`/api/reserva/${id}`)
      return respuesta.data.data
    },
    enabled: !!id,
  })
}

export interface DatosReservaParcial {
  rut_usuario:string
  fecha?: string
  hora_inicio?: string
  hora_termino?: string
  numero_cancha?: number
  equipamiento?: { id: number; cantidad: number; costo: number }[]
  jugadores?: Jugador[]
}

// 🔄 USAR ESTE HOOK PARA MODIFICAR RESERVAS
export function useModificarReserva(rut: string) {
  const clienteQuery = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DatosReservaParcial }) => {
      const respuesta = await api.patch(`api/reserva/${id}`, data)
      return respuesta.data
    },
    onSuccess: () => {
      clienteQuery.invalidateQueries({ queryKey: ["reservas", rut] })
    },
  })
}

// 🔄 USAR ESTE HOOK PARA OBTENER EL MÁXIMO DE JUGADORES POR CANCHA
export function useMaximoJugadoresPorCancha(numero_cancha: number) {
  return useQuery({
    queryKey: ["maximoJugadores", numero_cancha],
    queryFn: async () => {
      const respuesta = await api.get(`/api/canchas/${numero_cancha}/maxJugadores`)
      return respuesta.data.data.maximoJugadores
    },
    enabled: !!numero_cancha,
  })
}

// 🔄 NUEVO HOOK PARA VERIFICAR DISPONIBILIDAD
export function useVerificarDisponibilidad(fecha: string, hora: string, numeroPersonas: number) {
  return useQuery({
    queryKey: ["disponibilidad", fecha, hora, numeroPersonas],
    queryFn: async () => {
      const respuesta = await api.get(
        `/api/disponibilidad?fecha=${fecha}&hora=${hora}&numeroPersonas=${numeroPersonas}`,
      )
      return respuesta.data.data
    },
    enabled: !!(fecha && hora && numeroPersonas > 0),
  })
}

// 🔄 NUEVO HOOK PARA OBTENER FECHAS DISPONIBLES
export function useFechasDisponibles() {
  return useQuery({
    queryKey: ["fechasDisponibles"],
    queryFn: async () => {
      const respuesta = await api.get("/api/fechas-disponibles")
      return respuesta.data.data
    },
  })
}
