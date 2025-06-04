import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Registerdata
{
    rut: string;
    contraseña: string;
    nombre: string;
    correo: string;
}

interface Registerresponse
{
    message: string;
}

export function useRegister(onSuccess: () => void, onFail:(error:string)=>void) {
    return useMutation<Registerresponse,AxiosError,Registerdata>({        mutationFn: async ({rut, contraseña, nombre, correo}) => {
            const respuesta = await api.post('api/auth/register',{
                rut, 
                contraseña, 
                nombre_usuario: nombre, 
                correo,
                telefono: '+56900000000' // Default phone number
            });
            return respuesta.data;
        },
        onSuccess: () => {
            onSuccess();
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error xd';
            onFail(mensaje);
        }
    })
}
