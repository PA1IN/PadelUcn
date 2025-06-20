import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';

export interface Equipamiento {
  id_equipamiento: number;
  nombre: string;
  tipo: string;
  costo: number;
  stock: number;
}

export function useEquipamiento() {
  return useQuery<Equipamiento[], Error>({
    queryKey: ['equipamientos'],
    queryFn: async () => {
      const { data } = await api.get('api/equipamientos');
      return data.data;
    },
  });
}
