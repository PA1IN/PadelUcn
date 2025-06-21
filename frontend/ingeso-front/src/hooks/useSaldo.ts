import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import api from "@/api/axios"
import { useAuth } from "@/context/AuthContext"
// 🔄 NUEVO HOOK PARA OBTENER SALDO DEL USUARIO
export function useObtenerSaldo() {
  const { token, loading } = useAuth();
  return useQuery({
    queryKey: ["saldo"],
    queryFn: async () => {
      const respuesta = await api.get("/api/auth/saldo")
      return respuesta.data.data
    },
    enabled: !loading && !!token,
  })
}

// 🔄 NUEVO HOOK PARA ACTUALIZAR SALDO DEL USUARIO
export function useActualizarSaldo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ nuevoSaldo, transaccion }: { nuevoSaldo: number; transaccion?: string }) => {
      const respuesta = await api.patch("/api/auth/saldo", { nuevoSaldo, transaccion })
      console.log(nuevoSaldo);
      console.log(respuesta.data);
      return respuesta.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saldo"] })
    },
  })
}

// 🔄 NUEVO HOOK PARA CARGAR SALDO (SIMULACIÓN DE PAGO)
export function useCargarSaldo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ monto, datosPago }: { monto: number; datosPago: any }) => {
      // Obtener saldo actual
      const saldoActual = await api.get("/api/auth/saldo")
      const nuevoSaldo = saldoActual.data.data.saldo + monto

      // Actualizar saldo
      const respuesta = await api.patch("/api/auth/saldo", {
        nuevoSaldo,
        transaccion: `Recarga de saldo: $${monto.toLocaleString()}`,
      })

      return respuesta.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saldo"] })
    },
  })
}
