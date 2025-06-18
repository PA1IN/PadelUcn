'use client';

import { Cliente, useClientes, useCrearCliente } from '@/hooks/useAdminClientes';
import { useState } from 'react';

export default function ClientesAdminPage() {
  const { data, isLoading, isError } = useClientes();
  const { mutate: crearCliente } = useCrearCliente();

  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    contraseña: '',
    saldo: 0,
  });

  const enviar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registrarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    crearCliente(formData);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <form onSubmit={registrarCliente} className="mb-6 bg-gray-100 p-4 rounded space-y-4">
        <h2 className="text-xl font-semibold">Registrar Cliente</h2>

        <input
          type="text"
          name="rut"
          placeholder="RUT"
          value={formData.rut}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección (opcional)"
          value={formData.direccion}
          onChange={enviar}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={formData.contraseña}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Registrar Cliente
        </button>
      </form>

      {isLoading ? (
        <p>Cargando clientes...</p>
      ) : isError ? (
        <p>Error al cargar clientes.</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2"> Nombre </th>
              <th className="border p-2"> Correo </th>
              <th className="border p-2"> Teléfono </th>
              <th className="border p-2"> RUT </th>
              <th className="border p-2"> Reservas </th>
              <th className="border p-2"> Saldo </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c: Cliente) => (
              <tr key={c.rut}>
                <td className="border p-2">{c.nombre}</td>
                <td className="border p-2">{c.correo}</td>
                <td className="border p-2">{c.telefono}</td>
                <td className="border p-2">{c.rut}</td>
                <td className="border p-2">{c.total_reservas}</td>
                <td className="border p-2">${c.saldo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
