import { useQuery } from "@tanstack/react-query";
import api from '@/api/axios'

export interface Equipamiento {
    id: number;
    tipo: string;
    costo: number;
    stock: number;
    nombre: string;
}


export function useEquipamiento(){
    return useQuery<Equipamiento[]>({
        queryKey: ['equipamiento'],
        queryFn: async () => {
            const respuesta = await api.get('/api/equipamiento');
            return respuesta.data.data || [];
        },
    });
}