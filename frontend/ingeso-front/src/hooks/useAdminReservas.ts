import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";


export interface reservaAdmin {
    id_reserva: number
    fecha: string
    hora_inicio: string
    hora_termino: string
    usuario: {
        id_usuario: number
        rut: string
        nombre: string
        correo: string
        telefono: string
    }
    cancha: {
        id_cancha: number
        nombre: string
        numero: number
        valor: number
    }

    historial_actual: {
        estado: string
        fecha_estado: string
    }

    equipamiento: Array<{
        id_equipamiento: number
        nombre: string
        cantidad: number
        costo: number
        monto_total?: number //revisar si pal equipamiento se genera la cantidad por el valor en alguna variable
                            //dentro del backend o se calcula como en la db
    }>

    costo_total: number //monto total del equipmento + el valor de la cancha
}

export function useTodasLasReservas() {
    return useQuery<reservaAdmin[], Error>({
        queryKey: ["admin-reservas"],
        queryFn: async () => {
            const { data } = await api.get("/api/reservas")
            return data.data
        },
    })
}

export type estadoReserva = "confirmada" | "cancelada" | "pendiente"

export function useCambiarEstadoReserva() {
    const clienteQuery = useQueryClient()

    return useMutation({
        mutationFn: async ({ idReserva, nuevoEstado }: { idReserva: number; nuevoEstado: estadoReserva}) => {
            const { data } = await api.put(`/api/reservas/${idReserva}/estado`, { estado: nuevoEstado});
            return data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({ queryKey: ["admin-reservas"]})
        }
    })
}




export function useConfirmarReserva() {
    const cambiarEstado = useCambiarEstadoReserva()

    return {
        ...cambiarEstado,
        mutateAsync: (idReserva: number) => cambiarEstado.mutateAsync({
            idReserva, nuevoEstado: "confirmada"
        }),
    }
}

export function useCancelarReservaAdmin() {
    const cambiarEstado = useCambiarEstadoReserva()

    return {
        ...cambiarEstado,
        mutateAsync: (idReserva: number) => cambiarEstado.mutateAsync({
            idReserva, nuevoEstado: "cancelada"
        }),
    }
}