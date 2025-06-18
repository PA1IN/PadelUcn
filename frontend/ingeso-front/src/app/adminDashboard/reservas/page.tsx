'use client';

import {
  useTodasLasReservas,
  useConfirmarReserva,
  useCancelarReservaAdmin,
} from '@/hooks/useAdminReservas';

export default function AdminReservasPage() {
  const { data: reservas, isLoading } = useTodasLasReservas();
  const { mutateAsync: confirmarReserva } = useConfirmarReserva();
  const { mutateAsync: cancelarReserva } = useCancelarReservaAdmin();

  const handleConfirmar = async (id: number) => {
    await confirmarReserva(id);
  };

  const handleCancelar = async (id: number) => {
    await cancelarReserva(id);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservas</h1>

      {isLoading ? (
        <p>Cargando reservas...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Fecha</th>
                <th className="border px-4 py-2">Horario</th>
                <th className="border px-4 py-2">Usuario</th>
                <th className="border px-4 py-2">Cancha</th>
                <th className="border px-4 py-2">Equipamiento</th>
                <th className="border px-4 py-2">Estado</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas?.map((reserva) => (
                <tr key={reserva.id_reserva}>
                  <td className="border px-4 py-2">{reserva.id_reserva}</td>
                  <td className="border px-4 py-2">{reserva.fecha}</td>
                  <td className="border px-4 py-2">
                    {reserva.hora_inicio} - {reserva.hora_termino}
                  </td>
                  <td className="border px-4 py-2">
                    <div>{reserva.usuario.nombre}</div>
                    <div className="text-sm text-gray-500">{reserva.usuario.rut}</div>
                  </td>
                  <td className="border px-4 py-2">
                    <div>{reserva.cancha.nombre}</div>
                    <div className="text-sm text-gray-500">#{reserva.cancha.numero}</div>
                  </td>
                  <td className="border px-4 py-2">
                    {reserva.equipamiento.length === 0 ? (
                      <span className="text-gray-400">Sin equipamiento</span>
                    ) : (
                      <ul className="text-sm">
                        {reserva.equipamiento.map((eq) => (
                          <li key={eq.id_equipamiento}>
                            {eq.nombre} x{eq.cantidad} - ${eq.costo}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="border px-4 py-2 capitalize">{reserva.historial_actual.estado}</td>
                  <td className="border px-4 py-2">${reserva.costo_total}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleConfirmar(reserva.id_reserva)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleCancelar(reserva.id_reserva)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
