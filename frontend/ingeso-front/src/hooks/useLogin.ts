import {useMutation} from '@tanstack/react-query';
import api from '../api/axios';
import { AxiosError } from 'axios';

interface Logindata {
    rut: string;
    password: string;
}

interface Loginresponse {
    message: string;
    data: {
        token: string;
    };
    statusCode: number;
    success: boolean;
}

export function useLogin(onSuccess: (token: string)=> void, onFail:(error:string)=> void) {
    return useMutation<Loginresponse,AxiosError,Logindata>({
        mutationFn: async ({rut,password}: Logindata): Promise<Loginresponse> => {
            const respuesta = await api.post('/api/auth/login', {rut,password});
            return respuesta.data;
        },
        onSuccess: (data) => {
            onSuccess(data.data.token);
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error xd';
            onFail(mensaje);
        }

    });
}