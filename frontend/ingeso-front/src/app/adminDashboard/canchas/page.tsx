'use client';
import { Cancha, useAdminCanchas, useCrearCancha } from '@/hooks/useAdminCanchas';
import { useState } from 'react';

export default function CanchasAdminPage() {
  const { data, isLoading, isError } = useAdminCanchas();
  const { mutate: crearCancha } = useCrearCancha();

  const [formData, setFormData] = useState({
    numero: 0,
    nombre: '',
    descripcion: '',
    valor: 0,
    cantidad_max_jugadores: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valor' || name === 'cantidad_max_jugador' || name === 'numero' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crearCancha(formData);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Canchas</h1>

      {/* Formulario para agregar */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold">Agregar Cancha</h2>

        <input
          type="number"
          name="numero"
          placeholder="Número de cancha"
          value={formData.numero}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="valor"
          placeholder="Valor"
          value={formData.valor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="cantidad_max_jugador"
          placeholder="Máx. Jugadores"
          value={formData.cantidad_max_jugadores}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear Cancha
        </button>
      </form>

      {isLoading ? (
        <p>Cargando canchas...</p>
      ) : isError ? (
        <p>Error al cargar canchas.</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2"> Número </th>
              <th className="border p-2"> Nombre </th>
              <th className="border p-2"> Descripción </th>
              <th className="border p-2"> Valor </th>
              <th className="border p-2"> Máximo de jugadores </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c: Cancha) => (
              <tr key={c.numero}>
                <td className="border p-2">{c.numero}</td>
                <td className="border p-2">{c.nombre}</td>
                <td className="border p-2">{c.descripcion}</td>
                <td className="border p-2">${c.valor}</td>
                <td className="border p-2">{c.cantidad_max_jugadores}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
