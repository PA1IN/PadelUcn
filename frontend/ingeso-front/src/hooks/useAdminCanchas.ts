import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

export interface Cancha {
    id_cancha: number
    numero: number
    nombre: string
    descripcion: string
    valor: number
    cantidad_max_jugadores: number
    mantenimienti: boolean
}

export interface nuevaCancha {
    numero: number; 
    nombre: string; 
    descripcion: string;
    valor: number;
    cantidad_max_jugadores: number;
}

export function useAdminCanchas() {
    return useQuery<Cancha[], Error>({
        queryKey: ["admin-canchas"],
        queryFn: async () => {
            const { data } = await api.get("/api/admin/canchas");
            return data.data;
        },
    })
}

export function useCrearCancha() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async (cancha: nuevaCancha) => {
            const { data } = await api.post("/api/admin/canchas", cancha);
            return data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey: ["canchas"]})
        },
    })
}


export function useActualizarCancha() {
    const clienteQuery = useQueryClient();
    return useMutation({
        mutationFn: async ({id, cancha }: {id: number; cancha: Partial<nuevaCancha>}) => {
            const { data } = await api.patch(`/api/admin/canchas/${id}`, cancha)
            return data; 
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:["canchas"]})
        },
    })
}