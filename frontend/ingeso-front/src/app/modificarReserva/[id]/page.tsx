"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useModificarReserva, useReservaPorId } from "@/hooks/useReserva"
import { useCanchas } from "@/hooks/useCancha"
import { useEquipamiento } from "@/hooks/useEquipamiento"

interface EquipamientoSeleccionado {
  id: number
  cantidad: number
}

export default function ModificarReserva() {
  const router = useRouter()
  const params = useParams()
  const id = typeof params?.id === "string" ? parseInt(params.id) : undefined

  const { data: user } = useUserProfile()
  const { data: canchas } = useCanchas()
  const { data: equipamiento = [] } = useEquipamiento()
  const { data: reservaActual, isLoading } = useReservaPorId(id)

  const modificarReserva = useModificarReserva()

  const [fecha, setFecha] = useState("")
  const [hora_inicio, setHoraInicio] = useState("")
  const [hora_termino, setHoraTermino] = useState("")
  const [numero_cancha, setNumeroCancha] = useState("")
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState<EquipamientoSeleccionado[]>([])

  useEffect(() => {
    if (reservaActual) {
      setFecha(reservaActual.fecha)
      setHoraInicio(reservaActual.hora_inicio)
      setHoraTermino(reservaActual.hora_termino)
      setNumeroCancha(reservaActual.cancha.numero.toString())
      setEquipamientoSeleccionado(
        reservaActual.boletas?.map(b => ({
          id: b.equipamiento.id,
          cantidad: b.cantidad ?? 1
        })) || []
      )
    }
  }, [reservaActual])

  const toggleEquipamiento = (id: number) => {
    setEquipamientoSeleccionado(prev => {
      const existe = prev.find(e => e.id === id)
      if (existe) {
        return prev.filter(e => e.id !== id)
      } else {
        return [...prev, { id, cantidad: 1 }]
      }
    })
  }

  const cambiarCantidad = (id: number, cantidad: number) => {
    setEquipamientoSeleccionado(prev =>
      prev.map(e => e.id === id ? { ...e, cantidad } : e)
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fecha || !hora_inicio || !hora_termino || !numero_cancha || !id) return

    modificarReserva.mutate({
      id: id,
      data: {
        fecha,
        hora_inicio,
        hora_termino,
        numero_cancha: parseInt(numero_cancha),
        equipamiento: equipamientoSeleccionado
      }
    }, {
      onSuccess: () => {
        alert("Reserva modificada exitosamente")
        router.push("/reservas")
      },
      onError: () => {
        alert("Error al modificar reserva")
      }
    })
  }

  if (isLoading || !reservaActual) return <p className="p-4">Cargando datos de la reserva...</p>

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Modificar Reserva</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required className="border w-full p-2" />
        <input type="time" value={hora_inicio} onChange={e => setHoraInicio(e.target.value)} required className="border w-full p-2" />
        <input type="time" value={hora_termino} onChange={e => setHoraTermino(e.target.value)} required className="border w-full p-2" />
        <select value={numero_cancha} onChange={e => setNumeroCancha(e.target.value)} required className="border w-full p-2">
          <option value="">Selecciona una cancha</option>
          {canchas?.map((c: any) => (
            <option key={c.numero} value={c.numero}>Cancha {c.numero} - ${c.valor}</option>
          ))}
        </select>

        <div className="flex flex-col gap-3">
          <p className="font-medium">Equipamiento:</p>
          {equipamiento.map((e: any) => {
            const seleccionado = equipamientoSeleccionado.find(eq => eq.id === e.id)
            return (
              <div key={e.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!seleccionado}
                  onChange={() => toggleEquipamiento(e.id)}
                />
                <label className="flex-1">{e.nombre}</label>
                {seleccionado && (
                  <input
                    type="number"
                    min={1}
                    value={seleccionado.cantidad}
                    onChange={evt => cambiarCantidad(e.id, Number(evt.target.value))}
                    className="w-16 border p-1"
                  />
                )}
              </div>
            )
          })}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Guardar Cambios
        </button>
      </form>
    </div>
  )
}
