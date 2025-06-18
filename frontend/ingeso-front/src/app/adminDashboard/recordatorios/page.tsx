'use client';

import {
  useEnviarRecordatorio,
  useEnviarRecordatorioMasico,
  useHistorialRecordatorios,
  useRecordatoriosAnticipados,
} from '@/hooks/useRecordatorios';
import { useState } from 'react';

export default function RecordatoriosAdminPage() {
  const { data: historial, isLoading } = useHistorialRecordatorios();
  const { mutate: enviarIndividual } = useEnviarRecordatorio();
  const { mutate: enviarMasivo } = useEnviarRecordatorioMasico();
  const { mutate: enviarAnticipado } = useRecordatoriosAnticipados();

  const [formData, setFormData] = useState({
    tipo: 'reserva',
    destinatarios: '',
    mensaje: '',
    id_reserva: '',
    id_cancha: '',
  });

  const enviar = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registarRecordatorio = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      tipo: formData.tipo,
      mensaje: formData.mensaje,
      destinatarios: formData.destinatarios.split(',').map(s => s.trim()),
    };

    if (formData.id_reserva) payload.id_reserva = Number(formData.id_reserva);
    if (formData.id_cancha) payload.id_cancha = Number(formData.id_cancha);

    enviarIndividual(payload);
  };

  const handleSubmitMasivo = () => {
    enviarMasivo({
      tipo: formData.tipo as any,
      mensaje: formData.mensaje,
      destinatarios: formData.destinatarios.split(',').map(s => s.trim()),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Recordatorios</h1>

      <form onSubmit={registarRecordatorio} className="space-y-4 bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold">Enviar Recordatorio Individual</h2>

        <select
          name="tipo"
          value={formData.tipo}
          onChange={enviar}
          className="w-full p-2 border rounded"
        >
          <option value="reserva">Reserva</option>
          <option value="cancha_nueva">Cancha Nueva</option>
          <option value="pago_pendiente">Pago Pendiente</option>
        </select>

        <input
          type="text"
          name="destinatarios"
          placeholder="Destinatarios (separados por coma)"
          value={formData.destinatarios}
          onChange={enviar}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="mensaje"
          placeholder="Mensaje"
          value={formData.mensaje}
          onChange={enviar}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="id_reserva"
          placeholder="ID Reserva (opcional)"
          value={formData.id_reserva}
          onChange={enviar}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="id_cancha"
          placeholder="ID Cancha (opcional)"
          value={formData.id_cancha}
          onChange={enviar}
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Enviar Individual
          </button>
          <button type="button" onClick={handleSubmitMasivo} className="bg-purple-600 text-white px-4 py-2 rounded">
            Enviar Masivo
          </button>
        </div>
      </form>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Enviar Recordatorios Anticipados</h2>
        <button
          onClick={() => enviarAnticipado(24)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Enviar a 24h de Anticipación
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Historial de Recordatorios</h2>
      {isLoading ? (
        <p>Cargando historial...</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Destinatario</th>
              <th className="border p-2">Mensaje</th>
              <th className="border p-2">Fecha Envío</th>
              <th className="border p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {historial?.map(r => (
              <tr key={r.id}>
                <td className="border p-2">{r.id}</td>
                <td className="border p-2">{r.tipo}</td>
                <td className="border p-2">{r.destinatario}</td>
                <td className="border p-2">{r.mensaje}</td>
                <td className="border p-2">{r.fecha_envio}</td>
                <td className="border p-2">{r.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
