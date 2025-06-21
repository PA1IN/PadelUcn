"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useObtenerSaldo } from "@/hooks/useSaldo"
import { Wallet, CreditCard, CalendarRange, ClipboardList, Bell, Mail, BadgeIcon as IdCard, User } from "lucide-react"

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

  const irANotificaciones = () => {
    router.push("/notificacion")
  }

  const irATablaReserva = () => {
    router.push("/reservaTabla")
  }

  const irAVerReservas = () => {
    router.push("/reservas")
  }

  const irACargarDinero = () => {
    router.push("/cargarDinero")
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

  if (!userProfile || !saldo) return null

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Barra lateral mejorada */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Menú</h2>
          <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center text-green-800">
              <Wallet className="h-5 w-5 mr-2" />
              <span className="font-medium">Tu Saldo</span>
            </div>
            <div className="mt-1 text-xl font-bold text-green-700">${saldo.saldo.toLocaleString()}</div>
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
          onClick={irANotificaciones}
          className="w-full text-left flex items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
        >
          <Bell className="h-5 w-5 mr-2" />
          Mis notificaciones
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
          {/* Avatar y bienvenida */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Bienvenido, {userProfile?.nombre_usuario}!</h2>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3">
            <div className="flex items-center justify-center text-gray-600">
              <Mail className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-medium"><strong>Correo: </strong></span>
              <span className="ml-2">{userProfile?.correo}</span>
            </div>

            <div className="flex items-center justify-center text-gray-600">
              <IdCard className="h-5 w-5 mr-2 text-gray-500" />
              <span className="font-medium"><strong>RUT: </strong></span>
              <span className="ml-2">{userProfile?.rut}</span>
            </div>

            <div className="flex items-center justify-center text-green-600 font-medium pt-2 border-t border-gray-200">
              <Wallet className="h-5 w-5 mr-2" />
              <span className="font-medium">Saldo disponible:</span>
              <span className="ml-2 text-lg font-bold">${saldo?.saldo?.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button
              onClick={irATablaReserva}
              className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition group"
            >
              <CalendarRange className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-green-800">Reservar cancha</p>
              <p className="text-sm text-green-600 mt-1">Encuentra y reserva tu cancha favorita</p>
            </button>

            <button
              onClick={irACargarDinero}
              className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition group"
            >
              <CreditCard className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-purple-800">Cargar dinero</p>
              <p className="text-sm text-purple-600 mt-1">Añade saldo a tu cuenta</p>
            </button>

            <button
              onClick={irAVerReservas}
              className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition group"
            >
              <ClipboardList className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-blue-800">Mis reservas</p>
              <p className="text-sm text-blue-600 mt-1">Revisa tus reservas activas</p>
            </button>

            <button
              onClick={irANotificaciones}
              className="p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg transition group"
            >
              <Bell className="h-8 w-8 text-yellow-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-yellow-800">Notificaciones</p>
              <p className="text-sm text-yellow-600 mt-1">Revisa tus mensajes</p>
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">¿Necesitas ayuda?</h3>
            <p className="text-sm text-blue-600">
              Si tienes alguna duda sobre cómo usar la plataforma, no dudes en contactarnos.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
