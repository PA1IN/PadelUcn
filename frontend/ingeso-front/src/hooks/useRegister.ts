import { useMutation } from "@tanstack/react-query"
import api from "../api/axios"
import type { AxiosError } from "axios"

interface Registerdata {
  rut: string
  contrasena: string
  nombre_usuario: string
  correo: string
}

interface Registerresponse {
  message: string
}

export function useRegister(onSuccess: () => void, onFail: (error: string) => void) {
  return useMutation<Registerresponse, AxiosError, Registerdata>({
    mutationFn: async ({ rut, contrasena, nombre_usuario, correo }) => {
      const respuesta = await api.post("api/auth/register", { rut, contrasena, nombre_usuario, correo })
      return respuesta.data
    },
    onSuccess: () => {
      onSuccess()
    },
    onError: (error) => {
      const mensaje = (error.response?.data as { message?: string })?.message || "no se pudo identificar el error xd"
      onFail(mensaje)
    },
  })
}
