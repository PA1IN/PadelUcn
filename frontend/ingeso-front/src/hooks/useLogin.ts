
/*
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
        access_token: string;
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
            onSuccess(data.data.access_token);
        },
        onError:(error) => {
            const mensaje = (error.response?.data as {message?: string})?.message || 'no se pudo identificar el error xd';
            onFail(mensaje);
        }

    });
}
    */

import { useMutation } from '@tanstack/react-query';
import api from '../api/axios'; // Tu instancia personalizada de Axios
import axios, { AxiosError } from 'axios';

interface LoginData {
  rut: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    access_token: string;
  };
  statusCode: number;
  success: boolean;
}

export function useLogin(
  onSuccess: (token: string) => void,
  onFail: (error: string) => void
) {
  return useMutation<LoginResponse, AxiosError, LoginData>({
    mutationFn: async (loginData: LoginData) => {
      try {
        const response = await api.post<LoginResponse>('/api/auth/login', loginData);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const mensaje = (error.response.data as { message?: string })?.message || 'Error al iniciar sesión';
          throw new Error(mensaje);
        }
        throw new Error('Error de conexión con el servidor');
      }
    },
    onSuccess: (data) => {
      onSuccess(data.data.access_token);
    },
    onError: (error: Error) => {
      onFail(error.message);
    },
  });
}
