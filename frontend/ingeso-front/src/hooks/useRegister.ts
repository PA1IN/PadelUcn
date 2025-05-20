import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import axios, { AxiosError } from 'axios';

interface RegisterData {
  rut: string;
  password: string;
  nombre: string;
  correo: string;
}

interface RegisterResponse {
  message: string;
}

export function useRegister(
  onSuccess: () => void,
  onFail: (error: string) => void
) {
  return useMutation<RegisterResponse, AxiosError, RegisterData>({
    mutationFn: async (data: RegisterData) => {
      try {
        const response = await api.post<RegisterResponse>('api/auth/register', data);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const mensaje = (error.response.data as { message?: string })?.message || 'Error al registrar usuario';
          throw new Error(mensaje);
        }
        throw new Error('Error de conexión con el servidor');
      }
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: Error) => {
      onFail(error.message);
    },
  });
}
