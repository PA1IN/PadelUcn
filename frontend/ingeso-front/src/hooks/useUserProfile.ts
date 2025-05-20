import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext'; // Asegúrate de tener este contexto

interface UserPerfil {
  rut: string;
  nombre: string;
  correo: string;
}

interface PerfilResponse {
  statusCode: number;
  message: string;
  data: UserPerfil;
  success: boolean;
}

export function useUserProfile() {
  const { token } = useAuth();

  return useQuery<UserPerfil>({
    queryKey: ['userProfile', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      try {
        const response = await api.get<PerfilResponse>('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Perfil obtenido:', response.data);
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const msg = (error.response.data as { message?: string })?.message || 'Error al obtener perfil';
          throw new Error(msg);
        }
        throw new Error('Error de conexión con el servidor');
      }
    },
    enabled: !!token, // solo ejecuta si hay token
  });
}
