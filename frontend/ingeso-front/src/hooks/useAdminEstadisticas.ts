import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export interface estadisticasVentas { 
    
    //pa hacer las estadisticas de las reservas
    cant_reservas_hoy: number
    cant_reservas_mes: number
    cant_reservas_pendientes: number
    cant_reservas_confirmadas: number

    //pa hacer las estadisticas de los equipamientos en las transacciones
    cant_transacciones_hoy: number
    cant_transacciones_mes: number
    ingresos_equipamiento_hoy: number
    ingresos_equipamiento_mes: number

    //pa hacer las estadisticas de las canchas
    ingresos_cancha_hoy: number
    ingresos_cancha_mes: number

    //pa sacar los totales
    ingresos_total_hoy: number
    ingresos_total_mes: number
    clientes_activos : number
}

export interface transaccionCompleta {
    id_transaccion: number
    fecha: string
    reserva: {
        id_reserva: string
        fecha: string
        hora_inicio: string
        hora_termino: string
        usuario: {
            id_usuario: number
            nombre: string
            rut: string
        }
        cancha: {
            nombre: string
            id_cancha: number
        }
    }
    boleta_equipamiento: {
        id_historial: number
        cantidad: number
        monto_total: number
        equipamiento: {
            nombre: string
            tipo: string
            costo: number
        }
    }
}


export function useEstadisticasVentas() {
    return useQuery<estadisticasVentas, Error>({
        queryKey:["admin-estadisticas"],
        queryFn: async () => {
            const { data } = await api.get("/api/admin/estadisticas")
            return data.data
        },
    })
}

export function useHistorialTransacciones(fechaInicio?: string, fechaFin?: string){
    return useQuery<transaccionCompleta[],Error>({
        queryKey: ["admin-transacciones", fechaInicio, fechaFin],
        queryFn: async () => {
            const params = new URLSearchParams()
            if(fechaInicio){
                params.append("fechaInicio", fechaInicio)
            }
            if(fechaFin){
                params.append("fechaFin", fechaFin)
            }

            const { data } = await api.get(`/api/admin/transacciones?${params.toString()}`)
            return data.data
        }
    })
}
