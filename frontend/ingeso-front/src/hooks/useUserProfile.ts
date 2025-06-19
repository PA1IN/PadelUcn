import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

export interface UserProfile {
  id_usuario: number;
  rut: string;
  nombre: string;
  correo: string;
  telefono: string;
  direccion?: string;
  is_admin: boolean;
  saldo: number;
}

export function useUserProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data } = await api.get('/api/auth/profile');
      return data;
    },
  });
}
