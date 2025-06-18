'use client';

import { useEstadisticasVentas } from '@/hooks/useAdminEstadisticas';

export default function EstadisticasAdminPage() {
  const { data, isLoading, isError } = useEstadisticasVentas();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Estadísticas del sistema</h1>

      {isLoading && <p>Cargando estadísticas...</p>}
      {isError && <p>Ocurrió un error al obtener las estadísticas.</p>}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reservas */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Reservas</h2>
            <p>Hoy: <strong>{data.cant_reservas_hoy}</strong></p>
            <p>Este mes: <strong>{data.cant_reservas_mes}</strong></p>
            <p>Pendientes: <strong>{data.cant_reservas_pendientes}</strong></p>
            <p>Confirmadas: <strong>{data.cant_reservas_confirmadas}</strong></p>
          </div>

          {/* Equipamientos */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Equipamiento</h2>
            <p>Transacciones hoy: <strong>{data.cant_transacciones_hoy}</strong></p>
            <p>Transacciones este mes: <strong>{data.cant_transacciones_mes}</strong></p>
            <p>Ingresos hoy: <strong>${data.ingresos_equipamiento_hoy}</strong></p>
            <p>Ingresos este mes: <strong>${data.ingresos_equipamiento_mes}</strong></p>
          </div>

          {/* Canchas */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Canchas</h2>
            <p>Ingresos hoy: <strong>${data.ingresos_cancha_hoy}</strong></p>
            <p>Ingresos este mes: <strong>${data.ingresos_cancha_mes}</strong></p>
          </div>

          {/* Totales */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-2">Totales</h2>
            <p>Ingresos hoy: <strong>${data.ingresos_total_hoy}</strong></p>
            <p>Ingresos este mes: <strong>${data.ingresos_total_mes}</strong></p>
            <p>Clientes activos: <strong>{data.clientes_activos}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}
