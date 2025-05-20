"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useModificarReserva, useReservaPorId } from "@/hooks/useReserva"
import { useCanchas } from "@/hooks/useCancha"
import { useEquipamiento } from "@/hooks/useEquipamiento"

export default function ModificarReserva() {
  const router = useRouter()
  const params = useParams()
  const id = typeof params?.id === "string" ? parseInt(params.id) : undefined

  const { data: user } = useUserProfile()
  const { data: canchas } = useCanchas()
  const { data: equipamiento = [] } = useEquipamiento()
  const { data: reservaActual, isLoading } = useReservaPorId(id)

  const modificarReserva = useModificarReserva(user?.rut)

  const [fecha, setFecha] = useState("")
  const [hora_inicio, setHoraInicio] = useState("")
  const [hora_termino, setHoraTermino] = useState("")
  const [numero_cancha, setNumeroCancha] = useState("")
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState<number[]>([])

  useEffect(() => {
    if (reservaActual) {
      setFecha(reservaActual.fecha)
      setHoraInicio(reservaActual.hora_inicio)
      setHoraTermino(reservaActual.hora_termino)
      setNumeroCancha(reservaActual.cancha.numero.toString())
      setEquipamientoSeleccionado(reservaActual.boletas?.map(b => b.id_equipamiento) || [])
    }
  }, [reservaActual])

  const toggleEquipamiento = (id: number) => {
    setEquipamientoSeleccionado(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fecha || !hora_inicio || !hora_termino || !numero_cancha || !user?.rut || !id) return

    modificarReserva.mutate({
      id_reserva: id,
      datos: {
        fecha,
        hora_inicio,
        hora_termino,
        numero_cancha: parseInt(numero_cancha),
        equipamiento: equipamientoSeleccionado
      }
    }, {
      onSuccess: () => {
        alert("Reserva modificada exitosamente")
        router.push("/verReservas")
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

        <div className="flex flex-wrap gap-2">
          {equipamiento.map((e: any) => (
            <button key={e.id} type="button" onClick={() => toggleEquipamiento(e.id)}
              className={`px-3 py-1 rounded text-sm ${equipamientoSeleccionado.includes(e.id) ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`}> 
              {e.nombre}
            </button>
          ))}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar Cambios</button>
      </form>
    </div>
  )
}
