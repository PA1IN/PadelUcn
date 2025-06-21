import { useQuery } from "@tanstack/react-query"
import api from "@/api/axios"

export interface Cancha {
  id_cancha: number
  numero_cancha: number
  nombre: string
  descripcion: string
  mantenimiento: string
  valor: number
  maxJugadores: number;
}

export function useCanchas() {
  return useQuery<Cancha[]>({
    queryKey: ["canchas"],
    queryFn: async () => {
      const respuesta = await api.get("/api/canchas")
      const lista = respuesta.data
      console.log(lista.maxJugadores)

      if (!Array.isArray(lista)) {
        throw new Error("Error en la respuesta")
      }
      return lista || []
    },
  })
}

