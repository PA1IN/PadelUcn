"use client"

import { type SyntheticEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useLogin } from "@/hooks/useLogin"

export default function Login() {
  const [rut, setRut] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const { setToken } = useAuth()
  const router = useRouter()

  const login = useLogin(
    (token) => {
      setToken(token)
      router.push("/home")
    },
    (error) => {
      setErrorMsg(error)
    },
  )

  const submit = (e: SyntheticEvent) => {
    e.preventDefault()
    setErrorMsg("")
    login.mutate({ rut, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="flex mb-6 border-b border-gray-200">
          <span className="w-1/2 text-sm font-semibold py-2 text-center border-b-2 border-black text-black cursor-default">
            Iniciar sesión
          </span>
          <a href="/register" className="w-1/2 text-sm font-medium py-2 text-center text-gray-400 hover:text-black">
            Crear cuenta
          </a>
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center text-black">Login</h1>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700">
              RUT:
            </label>
            <input
              type="text"
              name="rut"
              id="rut"
              required
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              placeholder="Ingrese por favor su RUT sin puntos ni guiones..."
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-black focus:border-black placeholder:text-gray-400 text-gray-800"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña:
            </label>
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese por favor su contraseña..."
              className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-black focus:border-black placeholder:text-gray-400 text-gray-800"
            />
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className={`w-full py-2 rounded-md text-white transition ${
              login.isPending ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900"
            }`}
          >
            {login.isPending ? "Iniciando sesión... 🗣️🗣️" : "Login"}
          </button>
        </form>

        {/* Errores */}
        {login.isError && <p className="mt-4 text-sm text-red-600 text-center">Usuario o contraseña incorrectas</p>}
        {errorMsg && <p className="mt-2 text-sm text-red-600 text-center">{errorMsg}</p>}

        {/* Enlaces */}
        <div className="mt-6 text-sm text-center text-gray-600 space-y-1">
          <p>
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
          <p>
            ¿Olvidaste tu contraseña?{" "}
            <a href="/ForgotPassword" className="text-blue-600 hover:underline">
              Recupérala
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}


//export default Login;
