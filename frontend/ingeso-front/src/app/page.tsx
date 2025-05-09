
export default function Home() {
  return (
    <>
      <div className="bg-green-500 text-white p-4 rounded">
        Sistema de Reservas de canchas
      </div>
      <p>
        ¿No tienes cuenta? <a href="/register" className="text-blue-600 hover:underline">Regístrate aquí</a>
      </p>
      <p>
        ¿Te has registrado? <a href="/login" className="text-blue-600 hover:underline">Inicia sesion aqui</a>
      </p>
    </>
    

    
  );
}
