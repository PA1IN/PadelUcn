import { useMutation } from '@tanstack/react-query';
import api from '@/api/axios';

interface LoginInput {
  rut: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export function useLogin(onSuccessCallback?: (token: string) => void) {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: async (credentials) => {
      const { data } = await api.post('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      onSuccessCallback?.(data.token);
    },
  });
}
