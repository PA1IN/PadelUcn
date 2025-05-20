"use client"

import { useState, useEffect } from "react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useCrearReserva } from "@/hooks/useReserva"
import { useCanchas } from "@/hooks/useCancha"
import { useEquipamiento } from "@/hooks/useEquipamiento"

function formatDateInSpanish(dateStr: string): string {
  const date = new Date(dateStr)
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} de ${month} de ${year}`
}

export default function ReservaTabla() {
  const { data: user } = useUserProfile()
  const { data: courts, isLoading: loadingCourts, isError: errorCanchas } = useCanchas()
  const { data: availableEquipment = [], isError: errorEquipamiento } = useEquipamiento()

  const [selectedCourt, setSelectedCourt] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const crearReserva = useCrearReserva(
    () => {
      setSuccess("Reserva creada exitosamente")
      setSelectedCourt("")
      setSelectedDate("")
      setSelectedTime("")
      setSelectedEquipment([])
    },
    (error) => setError(error?.response?.data?.message || "Error al crear reserva")
  )

  useEffect(() => {
    const today = new Date()
    const dates = [...Array(30)].map((_, i) => {
      const d = new Date()
      d.setDate(today.getDate() + i)
      return d.toISOString().split("T")[0]
    })
    setAvailableDates(dates)
  }, [])

  useEffect(() => {
    if (!selectedDate) return setAvailableTimes([])
    const baseTimes = [
      "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
      "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
    ]
    setAvailableTimes(baseTimes)
  }, [selectedDate])

  const toggleEquipment = (equipmentId: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipmentId) ? prev.filter(id => id !== equipmentId) : [...prev, equipmentId]
    )
  }

  const calcularHoraTermino = (inicio: string): string => {
    const [h, m] = inicio.split(":").map(Number)
    const date = new Date()
    date.setHours(h, m + 60)
    return date.toTimeString().substring(0, 5)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!selectedCourt || !selectedDate || !selectedTime || !user?.rut) {
      setError("Completa todos los campos requeridos")
      return
    }

    crearReserva.mutate({
      fecha: selectedDate,
      hora_inicio: selectedTime,
      hora_termino: calcularHoraTermino(selectedTime),
      rut_usuario: user.rut,
      numero_cancha: parseInt(selectedCourt),
      equipamiento: selectedEquipment
    })
  }

  if (!user) return <div className="text-center mt-10 text-red-600">Cargando perfil del usuario...</div>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-green-500 text-white p-4 rounded w-full max-w-md mb-4">
        <h1 className="text-xl font-bold">Reserva tu Cancha</h1>
      </div>

      <div className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md">
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600 whitespace-pre-line">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cancha *</label>
            <select value={selectedCourt} onChange={e => setSelectedCourt(e.target.value)} required disabled={loadingCourts} className="w-full px-3 py-2 border rounded">
              <option value="">Selecciona una cancha</option>
              {Array.isArray(courts) && courts.map(c => (
                <option key={c.numero} value={String(c.numero)}>{`Cancha ${c.numero} - $${c.valor}/h - ${c.nombre}`}</option>
              ))}
            </select>
            {errorCanchas && <p className="text-red-500 text-sm">Error al cargar las canchas</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha *</label>
            <select value={selectedDate} onChange={e => setSelectedDate(e.target.value)} required className="w-full px-3 py-2 border rounded">
              <option value="">Selecciona una fecha</option>
              {availableDates.map(date => <option key={date} value={date}>{formatDateInSpanish(date)}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hora *</label>
            <select value={selectedTime} onChange={e => setSelectedTime(e.target.value)} required className="w-full px-3 py-2 border rounded">
              <option value="">Selecciona una hora</option>
              {availableTimes.map(time => <option key={time} value={time}>{time}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipamiento</label>
            <div className="flex flex-wrap gap-2">
              {availableEquipment.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggleEquipment(e.id.toString())}
                  className={`px-3 py-1 text-sm rounded transition ${
                    selectedEquipment.includes(e.id.toString())
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {e.nombre}
                </button>
              ))}
              {errorEquipamiento && <p className="text-red-500 text-sm">Error al cargar equipamiento</p>}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={crearReserva.isPending}
              className={`w-full py-2 rounded text-white ${crearReserva.isPending ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
            >
              {crearReserva.isPending ? "Procesando..." : "Confirmar Reserva"}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-gray-200 mt-6">
          <p className="text-center text-sm text-black">
            <a href="/home" className="text-green-600 hover:underline">Volver a la página principal</a>
          </p>
        </div>
      </div>
    </div>
  )
}
