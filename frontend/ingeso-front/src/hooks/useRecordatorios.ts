import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export interface Recordatorio {
    id: number
    tipo: "reserva" | "cancha_nueva" | "pago_pendiente"
    destinatario: string
    mensaje: string
    fecha_envio: string
    estado: "enviado" | "pendiente" | "fallido"
}

export interface nuevoRecordatorio {
    tipo: "reserva" | "cancha_nueva" | "pago_pendiente"
    destinatarios: string[] //pueden ser los ruts o los correos de los usuarios
    mensaje: string
    id_reserva?:number
    id_cancha?:number
}

//pa mandar un recordatorio individual
export function useEnviarRecordatorio() {
    return useMutation({
        mutationFn: async (recordatorio: nuevoRecordatorio) => {
            const { data } = await api.post("/api/admin/recordatorios", recordatorio);
            return data;
        },
    })
}

//pa mandar un recordatorio masivo
export function useEnviarRecordatorioMasico() {
    return useMutation({
        mutationFn: async (recordatorio: nuevoRecordatorio) => {
            const { data } = await api.post("/api/admin/recordatorios/masivo", recordatorio);
            return data;
        },
    })
}

//pa ver el historial de los recordatorios
export function useHistorialRecordatorios() {
    return useQuery<Recordatorio[], Error>({
        queryKey: ["admin-recordatorios"],
        queryFn: async () => {
            const { data } = await api.get("api/admin/recordatorios");
            return data.data;
        }
    })
}

//pa mandar recordatorios con anticipacion a una fecha de las reservas proximas
export function useRecordatoriosAnticipados() {
    return useMutation({
        mutationFn: async (horasAntes:number = 24) => {
            const { data } = await api.post("/api/admin/recordatorios/anticipados", { horasAntes});
            return data;
        }
    })
}

