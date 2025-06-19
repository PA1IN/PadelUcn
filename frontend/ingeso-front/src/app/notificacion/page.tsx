'use client';

import { useUserProfile } from '@/hooks/useUserProfile';
import { useNotificaciones, useMarcarNotificacionLeida} from '@/hooks/useNotificarUsuario';
import dayjs from 'dayjs';

export default function MisNotificacionesPage() {
  const { data: usuario } = useUserProfile();
  const idUsuario = usuario?.id_usuario;

  const { data: notificaciones, isLoading, isError } = useNotificaciones(idUsuario || 0);
  const { mutate: marcarLeida } = useMarcarNotificacionLeida();

  const handleMarcarLeida = (id: number, yaLeida: boolean) => {
    if (!yaLeida) {
      marcarLeida(id);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Notificaciones</h1>

      {isLoading ? (
        <p>Cargando notificaciones...</p>
      ) : isError ? (
        <p>Error al obtener tus notificaciones.</p>
      ) : !notificaciones ? (
        <p>No se pudo cargar la info</p>
      ) : notificaciones.length === 0 ? (
        <p>No tienes notificaciones.</p>
      ) : (
        <ul className="space-y-4">
          {notificaciones.map((n) => (
            <li
              key={n.id}
              onClick={() => handleMarcarLeida(n.id, n.leida)}
              className={`p-4 border rounded bg-white shadow-sm cursor-pointer ${
                n.leida ? '' : 'border-yellow-400'
              }`}
            >
              <h2 className="text-lg font-semibold">{n.titulo}</h2>
              <p className="text-gray-700">{n.mensaje}</p>
              <div className="text-sm text-gray-500 mt-1">
                {dayjs(n.fechaCreacion).format('DD-MM-YYYY HH:mm')} · Tipo: {n.tipoEvento}
              </div>
              {!n.leida && (
                <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded mt-1 inline-block">
                  No leída (click para marcar)
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
