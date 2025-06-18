import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";

export interface Equipamiento {
    id_equipamiento: number
    nombre: string
    tipo: string
    costo: number
    stock: number
}

export interface nuevoEquipamiento {
    nombre: string
    tipo: string
    costo: number
    stock: number
}

export function useEquipamientos() {
    return useQuery<Equipamiento[], Error>({
        queryKey:["admin-equipamientos"],
        queryFn: async () => {
            const { data } = await api.get("/api/admin/equipamientos");
            return data.data
        },
    })
}



export function useCrearEquipamiento(){
    const clienteQuery = useQueryClient()

    return useMutation({
        mutationFn: async (equipamiento: nuevoEquipamiento) => {
            const { data } = await api.post("/api/admin/equipamiento", equipamiento);
            return data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey: ["admin-equipamientos"]})
            clienteQuery.invalidateQueries({queryKey:["equipamientos"]})
        },
    })
}


export function useActualizarEquipamiento () {
    const clienteQuery = useQueryClient()

    return useMutation({
        mutationFn: async ({id, equipamiento}: {id: number; equipamiento: Partial<nuevoEquipamiento>}) => {
            const { data } = await api.patch(`/api/admin/equipamiento/${id}`, equipamiento);
            return data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey:["admin-equipamientos"]})
            clienteQuery.invalidateQueries({queryKey:["equipamientos"]})

        },
    })
}