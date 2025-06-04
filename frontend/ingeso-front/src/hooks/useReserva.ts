import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axios';

export interface Jugador {
  nombre: string;
  apellido: string;
  rut: string;
  edad: number;
}

export interface EquipamientoSeleccionado {
  id_equipamiento: number;
  nombre: string;
  cantidad: number;
  costo: number;
}

export interface Cancha {
  id_cancha: number;
  numero_cancha: number;
  nombre: string;
  valor: number;
  maxJugadores: number;
}

export interface Reserva {
  id_reserva: number;
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  rut_usuario: string;
  numero_cancha: number;
  costo_total: number;
  estado?: string;
  jugadores: Jugador[];
  equipamiento: EquipamientoSeleccionado[];
  cancha: Cancha;
}

export interface CrearReservaInput {
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  rut_usuario: string;
  numero_cancha: number;
  equipamiento_id: {id: number, cantidad: number}[];
  jugadores: Jugador[];
}

export interface ModificarReservaInput {
  id_reserva: number;
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  numero_cancha: number;
  equipamiento_id?: {id: number, cantidad: number}[];
  jugadores?: Jugador[];
}

export function useObtenerReservas(rutUsuario: string) {
  return useQuery<Reserva[], Error>({
    queryKey: ['reservas', rutUsuario],
    queryFn: async () => {
      const { data } = await api.get(`/reservas?rut=${rutUsuario}`);
      return data;
    },
    enabled: !!rutUsuario,
  });
}

export function useCrearReserva() {
  const queryClient = useQueryClient();

  return useMutation<Reserva, Error, CrearReservaInput>({
    mutationFn: async (newReserva) => {
      const { data } = await api.post('/reservas', newReserva);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservas', variables.rut_usuario] });
    },
  });
}

export function useModificarReserva() {
  const queryClient = useQueryClient();

  return useMutation<Reserva, Error, ModificarReservaInput>({
    mutationFn: async (updReserva) => {
      const { data } = await api.put(`/reservas/${updReserva.id_reserva}`, updReserva);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reservas', variables.id_reserva] });
      queryClient.invalidateQueries({ queryKey: ['reservas', _data.rut_usuario] });
    },
  });
}

export function useEliminarReserva(rutUsuario: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id_reserva) => {
      await api.delete(`/reservas/${id_reserva}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas', rutUsuario] });
    },
  });
}

export function useObtenerReservaPorId(id_reserva: number | undefined) {
  return useQuery<Reserva, Error>({
    queryKey: ['reserva', id_reserva],
    queryFn: async () => {
      const { data } = await api.get(`/reservas/${id_reserva}`);
      return data;
    },
    enabled: !!id_reserva,
  });
}
