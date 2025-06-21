import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

export interface notificacion {
    id_notificacion: number;
    titulo: string;
    mensaje: string;
    tipo_evento: string;
    fecha_creacion: string;
    leida: boolean;
    id_usuario: number;
}

export function useNotificaciones(id_usuario: number) {
    return useQuery<notificacion[],Error>({
        queryKey:['notificaciones-usuario', id_usuario],
        queryFn: async () => {
            const { data } = await api.get(`/api/notificaciones/historial/${id_usuario}`)
            return data.data
        }, 
        enabled: !!id_usuario
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