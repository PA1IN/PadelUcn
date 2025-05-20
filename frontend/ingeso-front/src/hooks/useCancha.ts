import { useQuery } from "@tanstack/react-query";
import api from '@/api/axios';

export interface Cancha { 
    id: number
    numero: number
    nombre: string
    descripcion: string
    mantenimiento: string
    valor: number
}

export function useCanchas(){
    return useQuery<Cancha[]>({
        queryKey: ["canchas"],
        queryFn: async () => {
            const respuesta = await api.get("/api/canchas")
            const data = respuesta.data.data 

            if (!Array.isArray(data))
            {
                throw new Error("Error en la respuesta")
            }
            return data || []
        },
    })
}