import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";


export interface reservaAdmin {
    id: number
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
        id: number
        nombre: string
        numero: number
        valor: number
    }

    historial_actual: {
        id:number
        estado: string
        fechaEstado: string
    }

    equipamiento: Array<{
        id: number
        nombre: string
        cantidad: number
        costo: number
        monto_total?: number //revisar si pal equipamiento se genera la cantidad por el valor en alguna variable
                            //dentro del backend o se calcula como en la db
    }>

    costo_total: number //monto total del equipmento + el valor de la cancha
}

export function useTodasLasReservas() {

    const { token,loading } = useAuth();
    return useQuery<reservaAdmin[], Error>({
        queryKey: ["admin-reservas"],
        queryFn: async () => {
            const { data } = await api.get("/api/reserva")
            return data.data
        },
        enabled: !loading && !!token,
    })
}

export type estadoReserva = "confirmar" | "cancelar" | "pendiente"

export function useCambiarEstadoReserva() {
    const clienteQuery = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, nuevoEstado }: { id: number; nuevoEstado: estadoReserva}) => {
            const { data } = await api.put(`/api/reserva/${id}/${nuevoEstado}`, {});
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
        mutateAsync: (id: number) => cambiarEstado.mutateAsync({
            id, nuevoEstado: "confirmar"
        }),
    }
}

export function useCancelarReservaAdmin() {
    const cambiarEstado = useCambiarEstadoReserva()

    return {
        ...cambiarEstado,
        mutateAsync: (id: number) => cambiarEstado.mutateAsync({
            id, nuevoEstado: "cancelar"
        }),
    }
}