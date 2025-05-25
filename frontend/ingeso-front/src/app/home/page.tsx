"use client"

import { useEffect, useState } from "react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function Home() {
  const { token, setToken, loading } = useAuth();
  const router = useRouter()
  const { data: user, isLoading: cargauser, isError } = useUserProfile()
  const [verificador, setVerificador] = useState(true)

  useEffect(() => {
    if (!loading){
      if (!token) {
        router.replace("/login")
      } else {
        setVerificador(false)
      }
    }
  }, [token, loading,router])

  if (verificador) return null
  if (cargauser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    setToken(null)
    router.push("/login")
    return null
  }

  const logout = () => {
    setToken(null)
    sessionStorage.removeItem("token")
    router.push("/login")
  }

  const irATablaReserva = () => {
    router.push("/reservaTabla")
  }

  const irAVerReservas = () => {
    router.push("/reservas")
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
    
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <h2 className="text-lg font-bold text-gray-800">Menú</h2>
        <button
          onClick={irATablaReserva}
          className="w-full text-left bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
        >
          Realizar una reserva
        </button>
        <button
          onClick={irAVerReservas}
          className="w-full text-left bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        >
          Ver mis reservas
        </button>

        <button
          onClick={logout}
          className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Bienvenido, {user?.nombre}!</h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-600 mb-2 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <strong>Correo: </strong> {user?.correo}
            </p>
            <p className="text-gray-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
              <strong>RUT: </strong> {user?.rut}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
