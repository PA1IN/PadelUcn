'use client'

import { useEquipamientos, useCrearEquipamiento } from '@/hooks/useAdminEquipamiento'
import { useState } from 'react'
import type { Equipamiento } from '@/hooks/useAdminEquipamiento'

export default function EquipamientoAdminPage() {
  const { data: equipamientos, isLoading, isError } = useEquipamientos()
  const { mutate: crearEquipamiento } = useCrearEquipamiento()

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    costo: 0,
    stock: 0,
  })

  const enviar = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'costo' || name === 'stock' ? Number(value) : value,
    }))
  }

  const registrarEquipamiento = (e: React.FormEvent) => {
    e.preventDefault()
    crearEquipamiento(formData)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Equipamiento</h1>

      <form onSubmit={registrarEquipamiento} className="mb-6 bg-gray-100 p-4 rounded space-y-4">
        <h2 className="text-xl font-semibold">Agregar Equipamiento</h2>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="tipo"
          value={formData.tipo}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        >
          <option value=""> Seleccione un tipo </option>
          <option value="Raqueta"> Raqueta </option>
          <option value="Pelota"> Pelota </option>
          <option value="Red"> Red </option>
          <option value="Otro"> Otro </option>
        </select>

        <input
          type="number"
          name="costo"
          placeholder="Costo de arriendo"
          value={formData.costo}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock disponible"
          value={formData.stock}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear Equipamiento
        </button>
      </form>

      {isLoading ? (
        <p>Cargando equipamientos...</p>
      ) : isError ? (
        <p>Error al cargar los equipamientos.</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2"> Nombre </th>
              <th className="border p-2"> Tipo </th>
              <th className="border p-2"> Costo </th>
              <th className="border p-2"> Stock </th>
            </tr>
          </thead>
          <tbody>
            {equipamientos?.map((e: Equipamiento) => (
              <tr key={e.id_equipamiento}>
                <td className="border p-2">{e.nombre}</td>
                <td className="border p-2">{e.tipo}</td>
                <td className="border p-2">${e.costo}</td>
                <td className="border p-2">{e.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
