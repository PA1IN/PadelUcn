export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-green-500 text-white p-4 rounded w-full max-w-md mb-4">
        <h1 className="text-xl font-bold">Sistema de Reservas de canchas</h1>
      </div>

      <div className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 text-center mb-4">
          Bienvenido al sistema de reservas. Accede o crea una cuenta para comenzar.
        </p>

        <p className="text-center">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </a>
        </p>

        <p className="text-center">
          ¿Te has registrado?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  )
}
