import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

export interface notificacion {
    id: number;
    titulo: string;
    mensaje: string;
    tipoEvento: string;
    fechaCreacion: string;
    leida: boolean;
    idUsuario: number;
}

export function useNotificaciones(idUsuario: number) {
    return useQuery<notificacion[],Error>({
        queryKey:['notificaciones-usuario', idUsuario],
        queryFn: async () => {
            const { data } = await api.get(`/api/notificaciones/historial/${idUsuario}`)
            return data.data
        }, 
        enabled: !!idUsuario
    })

}

export function useMarcarNotificacionLeida () {
    const clienteQuery = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            await api.patch(`/api/notificaciones/marcar-leida/${id}`, { leida: true});
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({ queryKey: ['notificaciones-usuario']});
        },
    });
}