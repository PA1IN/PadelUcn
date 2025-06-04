"use client";

import { useRouter } from "next/navigation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useObtenerReservas, useEliminarReserva} from "@/hooks/useReserva";
import { AlertTriangle, Trash2, Edit } from "lucide-react";

export default function VerReservasPage() {
  const router = useRouter();
  const { data: user, isLoading: cargandoUsuario } = useUserProfile();
  const rutUsuario = user?.rut || "";

  const {
    data: reservas = [],
    isLoading: cargandoReservas,
    isError,
    error,
  } = useObtenerReservas(rutUsuario);

  const eliminarReserva = useEliminarReserva(rutUsuario);

  const cancelarReserva = (id: number) => {
    if (!confirm("¿Seguro que deseas cancelar esta reserva?")) return;
    eliminarReserva.mutate(id);
  };

  const modificarReserva = (id: number) => {
    router.push(`/modificarReserva?id=${id}`);
  };

  if (cargandoUsuario || cargandoReservas)
    return <div className="p-6">Cargando reservas...</div>;

  if (isError)
    return (
      <div className="text-red-500 p-6">
        Error: {(error as Error)?.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Mis Reservas</h1>
        {reservas.length === 0 ? (
          <div className="text-center text-gray-500">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p>No tienes reservas registradas.</p>
          </div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Hora</th>
                <th className="p-2 border">Cancha</th>
                <th className="p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id_reserva} className="text-center">
                  <td className="border p-2">{reserva.fecha}</td>
                  <td className="border p-2">
                    {reserva.hora_inicio} - {reserva.hora_termino}
                  </td>
                  <td className="border p-2">{reserva.numero_cancha}</td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => modificarReserva(reserva.id_reserva)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      <Edit className="h-4 w-4 inline-block" /> Modificar
                    </button>
                    <button
                      onClick={() => cancelarReserva(reserva.id_reserva)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      <Trash2 className="h-4 w-4 inline-block" /> Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
