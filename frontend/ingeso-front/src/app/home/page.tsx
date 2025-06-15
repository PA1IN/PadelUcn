"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useObtenerSaldo } from "@/hooks/useSaldo"
import { Wallet, CreditCard, CalendarRange, ClipboardList } from "lucide-react"

export default function Home() {
  const { token, setToken, loading } = useAuth()
  const router = useRouter()

  const { data: userProfile, isLoading: isLoadingProfile, isError: isErrorProfile } = useUserProfile()
  const { data: saldo, isLoading: isLoadingSaldo, isError: isErrorSaldo } = useObtenerSaldo()

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.replace("/login")
      }
    }
  }, [token, loading, router])

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

  const irACargarDinero = () => {
    router.push("/cargar-dinero")
  }

  if (loading || isLoadingProfile || isLoadingSaldo) {
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

  
  if (isErrorProfile || isErrorSaldo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <p className="text-red-600">Error al cargar datos. Intenta nuevamente.</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Volver al login
          </button>
        </div>
      </div>
    )
  }

  if (!userProfile) return null

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Menú</h2>
          <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center text-green-800">
              <Wallet className="h-5 w-5 mr-2" />
              <span className="font-medium">Tu Saldo</span>
            </div>
            <div className="mt-1 text-xl font-bold text-green-700">${saldo?.toLocaleString()}</div>
          </div>
        </div>

        <button
          onClick={irATablaReserva}
          className="w-full text-left flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
        >
          <CalendarRange className="h-5 w-5 mr-2" />
          Realizar una reserva
        </button>

        <button
          onClick={irAVerReservas}
          className="w-full text-left flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        >
          <ClipboardList className="h-5 w-5 mr-2" />
          Ver mis reservas
        </button>

        <button
          onClick={irACargarDinero}
          className="w-full text-left flex items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Cargar dinero
        </button>

        <button
          onClick={logout}
          className="w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Bienvenido, {userProfile?.nombre}!</h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-600 mb-2 flex items-center justify-center">
              <strong>Correo: </strong> {userProfile?.correo}
            </p>
            <p className="text-gray-600 flex items-center justify-center">
              <strong>RUT: </strong> {userProfile?.rut}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
