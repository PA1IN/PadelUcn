'use client'

import { useHistorialTransacciones } from '@/hooks/useAdminEstadisticas'
import { useState } from 'react'
import dayjs from 'dayjs'

export default function HistorialVentasAdminPage() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const { data, isLoading, isError, refetch } = useHistorialTransacciones(fechaInicio, fechaFin)

  const handleFiltrar = () => {
    refetch()
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>

      <div className="mb-4 flex gap-4 items-end">
        <div>
          <label className="block text-sm">Fecha Inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Fecha Fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <button onClick={handleFiltrar} className="bg-blue-600 text-white px-4 py-2 rounded">
          Filtrar
        </button>
      </div>

      {isLoading ? (
        <p>Cargando historial...</p>
      ) : isError ? (
        <p>Error al cargar las transacciones.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">ID Transacción</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Cliente</th>
                <th className="border p-2">Cancha</th>
                <th className="border p-2">Equipamiento</th>
                <th className="border p-2">Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((transaccion) => (
                <tr key={transaccion.id_transaccion}>
                  <td className="border p-2">{transaccion.id_transaccion}</td>
                  <td className="border p-2">{dayjs(transaccion.fecha).format('DD-MM-YYYY')}</td>
                  <td className="border p-2">
                    {transaccion.reserva.usuario.nombre} ({transaccion.reserva.usuario.rut})
                  </td>
                  <td className="border p-2">{transaccion.reserva.cancha.nombre}</td>
                  <td className="border p-2">
                    {transaccion.boleta_equipamiento.equipamiento.nombre} x{' '}
                    {transaccion.boleta_equipamiento.cantidad}
                  </td>
                  <td className="border p-2">${transaccion.boleta_equipamiento.monto_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
