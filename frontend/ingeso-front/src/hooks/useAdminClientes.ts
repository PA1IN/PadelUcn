import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from '@/api/axios';

export interface Cliente {
    id_usuario: number
    rut: string 
    nombre: string
    correo: string
    telefono: string
    direccion?: string
    saldo: number
    is_admin: boolean
    fecha_registro?: string
    total_reservas: number
    ultima_reserva: string | null 
}

export interface nuevoCliente {
    rut: string
    nombre: string
    correo: string
    telefono: string
    direccion?:string
    contraseña: string
    saldo?: number
    is_admin?: boolean //revisar esto pa ver si hacer que un cliente puede ser admin o hacerlo por separado
}


export function useClientes() {
    return useQuery<Cliente[], Error>({
        queryKey:["admin-clientes"],
        queryFn: async () => {
            const {data} = await api.get("api/admin/clientes");
            return data.data;
        },
    })
}


export function useCrearCliente(){
    const clienteQuery = useQueryClient();

    return useMutation({
        mutationFn: async (cliente: nuevoCliente) => {
            const {data} = await api.post("/api/admin/clientes", cliente);
            return data;
        },
        onSuccess: () => {
            clienteQuery.invalidateQueries({queryKey: ["admin-clientes"]})
        },
    })
}