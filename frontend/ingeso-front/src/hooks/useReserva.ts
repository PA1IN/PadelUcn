import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import api from '@/api/axios'


export function useObtenerReservas(rut_usuario:string){
    return useQuery({
        queryKey:['reservas',rut_usuario],
        queryFn: async () => {
            const respuesta = await api.get(`/api/reserva/usuario/${rut_usuario}`)
            return respuesta.data.data
        },
        enabled: Boolean(rut_usuario),
    })
}

export interface Datosreserva {
    fecha: string
    hora_inicio: string
    hora_termino: string
    rut_usuario: string
    numero_cancha: number
    equipamiento: number
}

export function useCrearReserva(onSuccess?: () => void, onError?: (error:string)=> void){
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (reserva: Datosreserva) => {
            const respuesta = await api.post("api/reserva",reserva)
            return respuesta.data
        },
        onSuccess:() => {
            clienteQuery.invalidateQueries({queryKey:['reservas']})
            if (onSuccess) onSuccess()
        },
        onError: (error: string) => {
            if(onError) onError(error)
        }
    })
}

export function useEliminarReserva(rut: string){
    const clienteQuery = useQueryClient()
    
    return useMutation({
        mutationFn: async (id:number) => {
            await api.delete(`api/reserva/${id}`)
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reservas', rut]})
        },
    })
}


export function useReservaPorId(id:number){
    return useQuery({
        queryKey:['reserva',id],
        queryFn: async () => {
            const respuesta = await api.get(`/api/reserva/${id}`)
            return respuesta.data.data
        },
        enabled:!!id,
    })
}


export interface DatosReservaParcial {
    fecha: string
    hora_inicio: string
    hora_termino: string
    numero_cancha?:number
    equipamiento?:string[]
}

export function useModificarReserva(rut:string){
    const clienteQuery = useQueryClient()
    return useMutation({
        mutationFn: async ({id, data}: {id:number; data: DatosReservaParcial }) => {
            const respuesta = await api.patch(`api/reserva/${id}`,data)
            return respuesta.data
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:['reservas',rut]})
        }
    })
}

