// app/boleta/page.tsx
"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useObtenerReservas } from "@/hooks/useReserva";
import { FileText } from "lucide-react";

export default function BoletaPage() {
  const { data: user, isLoading: cargandoUsuario } = useUserProfile();
  const rutUsuario = user?.rut || "";

  const {
    data: reservas = [],
    isLoading: cargandoReservas,
    isError,
    error,
  } = useObtenerReservas(rutUsuario);

  if (cargandoUsuario || cargandoReservas)
    return <div className="p-6">Cargando boletas...</div>;

  if (isError)
    return (
      <div className="text-red-500 p-6">
        Error: {(error as Error)?.message}
      </div>
    );

  // filtrar solo reservas finalizadas para mostrar como “boletas”
  const reservasConBoleta = reservas.filter((r) => r.estado === "Finalizada");

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Historial de Boletas</h1>
        {reservasConBoleta.length === 0 ? (
          <div className="text-center text-gray-500">
            <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400" />
            <p>No tienes boletas generadas.</p>
          </div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Fecha</th>
                <th className="p-2 border">Hora</th>
                <th className="p-2 border">Cancha</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {reservasConBoleta.map((reserva: any) => (
                <tr key={reserva.id_reserva} className="text-center">
                  <td className="border p-2">{reserva.fecha}</td>
                  <td className="border p-2">
                    {reserva.hora_inicio} - {reserva.hora_termino}
                  </td>
                  <td className="border p-2">{reserva.numero_cancha}</td>
                  <td className="border p-2">${reserva.total?.toLocaleString() || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
