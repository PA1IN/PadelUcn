'use client';

import { useEstadisticasVentas, useHistorialTransacciones } from '@/hooks/useAdminEstadisticas';
import { useState } from 'react';

export default function EstadisticasAdminPage() {
  const { data: resumen, isLoading: loadingResumen } = useEstadisticasVentas();

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const { data: transacciones, refetch } = useHistorialTransacciones(fechaInicio, fechaFin);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Estadísticas</h1>

      {loadingResumen ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Estadistica titulo="Reservas Hoy" valor={resumen?.cant_reservas_hoy} />
          <Estadistica titulo="Reservas Mes" valor={resumen?.cant_reservas_mes} />
          <Estadistica titulo="Pendientes" valor={resumen?.cant_reservas_pendientes} />
          <Estadistica titulo="Confirmadas" valor={resumen?.cant_reservas_confirmadas} />
          <Estadistica titulo="Transacciones Hoy" valor={resumen?.cant_transacciones_hoy} />
          <Estadistica titulo="Transacciones Mes" valor={resumen?.cant_transacciones_mes} />
          <Estadistica titulo="Ingresos Equipamiento Hoy" valor={`$${resumen?.ingresos_equipamiento_hoy}`} />
          <Estadistica titulo="Ingresos Equipamiento Mes" valor={`$${resumen?.ingresos_equipamiento_mes}`} />
          <Estadistica titulo="Ingresos Canchas Hoy" valor={`$${resumen?.ingresos_cancha_hoy}`} />
          <Estadistica titulo="Ingresos Canchas Mes" valor={`$${resumen?.ingresos_cancha_mes}`} />
          <Estadistica titulo="Total Hoy" valor={`$${resumen?.ingresos_total_hoy}`} />
          <Estadistica titulo="Total Mes" valor={`$${resumen?.ingresos_total_mes}`} />
          <Estadistica titulo="Clientes Activos" valor={resumen?.clientes_activos} />
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Historial de Transacciones</h2>
        <div className="flex gap-4 items-center mb-4">
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="p-2 border rounded"
          />
          <button onClick={() => refetch()} className="bg-blue-600 text-white px-4 py-2 rounded">
            Buscar
          </button>
        </div>

        {transacciones?.length === 0 ? (
          <p>No hay transacciones para este rango.</p>
        ) : (
          <div className="overflow-auto">
            <table className="table-auto w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Fecha</th>
                  <th className="border px-2 py-1">Usuario</th>
                  <th className="border px-2 py-1">Cancha</th>
                  <th className="border px-2 py-1">Horario</th>
                  <th className="border px-2 py-1">Equipamiento</th>
                  <th className="border px-2 py-1">Monto Total</th>
                </tr>
              </thead>
              <tbody>
                {transacciones?.map((t) => (
                  <tr key={t.id_transaccion}>
                    <td className="border px-2 py-1">{t.fecha}</td>
                    <td className="border px-2 py-1">
                      {t.reserva.usuario.nombre} ({t.reserva.usuario.rut})
                    </td>
                    <td className="border px-2 py-1">{t.reserva.cancha.nombre}</td>
                    <td className="border px-2 py-1">
                      {t.reserva.hora_inicio} - {t.reserva.hora_termino}
                    </td>
                    <td className="border px-2 py-1">
                      {t.boleta_equipamiento?.equipamiento.nombre} x{t.boleta_equipamiento?.cantidad}
                    </td>
                    <td className="border px-2 py-1">${t.boleta_equipamiento?.monto_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Estadistica({ titulo, valor }: { titulo: string; valor: string | number | undefined }) {
  return (
    <div className="p-4 bg-white border rounded shadow">
      <h3 className="text-sm text-gray-600">{titulo}</h3>
      <p className="text-xl font-bold">{valor ?? '-'}</p>
    </div>
  );
}
