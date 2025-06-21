import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { useAuth } from '@/context/AuthContext';

export interface UserProfile {
  id_usuario: number;
  rut: string;
  nombre_usuario: string;
  correo: string;
  telefono: string;
  direccion?: string;
  is_admin: boolean;
  saldo: number;
}

export function useUserProfile() {

  const { token, loading } = useAuth();

  return useQuery<UserProfile, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data } = await api.get('/api/auth/profile');
      return data.data;
    },
    enabled: !loading && !!token,
  });
}
