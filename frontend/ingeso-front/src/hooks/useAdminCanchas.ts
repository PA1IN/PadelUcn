import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

export interface Cancha {
    id: number
    numero: number
    nombre: string
    descripcion: string
    valor: number
    cantidadMaxJugador: number
    mantenimiento: boolean
}

export interface nuevaCancha {
    numero: number; 
    nombre: string; 
    descripcion: string;
    valor: number;
    cantidadMaxJugador: number

}

export function useAdminCanchas() {
    const { token, loading } = useAuth();
    return useQuery<Cancha[], Error>({
        queryKey: ["admin-canchas"],
        queryFn: async () => {
            const { data } = await api.get("/api/usuarios/admin/canchas");
            return data.data;
        },
        enabled: !loading && !!token,
    })
}

export function useCrearCancha() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (cancha: nuevaCancha) => {
            const { data } = await api.post("/api/usuarios/admin/canchas", cancha);
            return data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey: ["canchas"]})
            clienteQuery.invalidateQueries({queryKey: ["admin-canchas"]})
        },
    })
}


export function useActualizarCancha() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({id, cancha }: {id: number; cancha: Partial<nuevaCancha>}) => {
            const { data } = await api.patch(`/api/usuarios/admin/canchas/${id}`, cancha)
            return data; 
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:["canchas"]})
            clienteQuery.invalidateQueries({queryKey: ["admin-canchas"]})
        },
    })
}