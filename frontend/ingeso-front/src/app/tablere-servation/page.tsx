"use client"

import type React from "react"

import { useState, useEffect } from "react"

// Tipos para los datos
type Court = {
  id: string
  name: string
  type: string
}

type Equipment = {
  id: string
  name: string
}

// Función auxiliar para formatear fechas en español sin dependencias externas
function formatDateInSpanish(dateStr: string): string {
  const date = new Date(dateStr)

 
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]

  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${day} de ${month} de ${year}`
}

export default function ReservaTabla() {
  // Estados para los datos seleccionados
  const [selectedCourt, setSelectedCourt] = useState("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([])

  // Estados para los datos disponibles
  const [courts, setCourts] = useState<Court[]>([])
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>([])

  // Estados para el manejo de carga y errores
  const [loading, setLoading] = useState({
    courts: true,
    dates: true,
    times: false,
    equipment: false,
    submit: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Cargar canchas desde la API
  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await fetch("/api/courts")
        if (!response.ok) throw new Error("Error al cargar las canchas")

        const data = await response.json()
        setCourts(data.courts)
      } catch (err) {
        setError("No se pudieron cargar las canchas. Intente nuevamente.")
        console.error(err)
      } finally {
        setLoading((prev) => ({ ...prev, courts: false }))
      }
    }

    fetchCourts()
  }, [])

  // Cargar fechas disponibles desde la API
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch("/api/dates")
        if (!response.ok) throw new Error("Error al cargar las fechas")

        const data = await response.json()
        setAvailableDates(data.dates)
      } catch (err) {
        setError("No se pudieron cargar las fechas disponibles. Intente nuevamente.")
        console.error(err)
      } finally {
        setLoading((prev) => ({ ...prev, dates: false }))
      }
    }

    fetchDates()
  }, [])

  // Cargar horas disponibles cuando cambia la fecha
  useEffect(() => {
    if (!selectedDate) {
      setAvailableTimes([])
      return
    }

    const fetchTimes = async () => {
      setLoading((prev) => ({ ...prev, times: true }))
      setSelectedTime("")

      try {
        const response = await fetch(`/api/times?date=${selectedDate}`)
        if (!response.ok) throw new Error("Error al cargar las horas")

        const data = await response.json()
        setAvailableTimes(data.times)
      } catch (err) {
        setError("No se pudieron cargar las horas disponibles. Intente nuevamente.")
        console.error(err)
      } finally {
        setLoading((prev) => ({ ...prev, times: false }))
      }
    }

    fetchTimes()
  }, [selectedDate])

  // Cargar equipamiento disponible cuando cambia la hora
  useEffect(() => {
    if (!selectedTime) {
      setAvailableEquipment([])
      return
    }

    const fetchEquipment = async () => {
      setLoading((prev) => ({ ...prev, equipment: true }))
      setSelectedEquipment([])

      try {
        const response = await fetch(`/api/equipment?time=${selectedTime}`)
        if (!response.ok) throw new Error("Error al cargar el equipamiento")

        const data = await response.json()
        setAvailableEquipment(data.equipment)
      } catch (err) {
        setError("No se pudo cargar el equipamiento disponible. Intente nuevamente.")
        console.error(err)
      } finally {
        setLoading((prev) => ({ ...prev, equipment: false }))
      }
    }

    fetchEquipment()
  }, [selectedTime])

  const toggleEquipment = (equipmentId: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(equipmentId) ? prev.filter((id) => id !== equipmentId) : [...prev, equipmentId],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!selectedCourt || !selectedDate || !selectedTime) {
      setError("Por favor, completa los campos obligatorios")
      return
    }

    setLoading((prev) => ({ ...prev, submit: true }))

    try {
      const response = await fetch("/api/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courtId: selectedCourt,
          date: selectedDate,
          time: selectedTime,
          equipment: selectedEquipment,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Error al procesar la reserva")
      }

      // Mostrar mensaje de éxito con el nombre de la cancha seleccionada
      const courtName = courts.find((c) => c.id === selectedCourt)?.name || "desconocida"
      const formattedDate = formatDateInSpanish(selectedDate)

      setSuccess(`Reserva confirmada con ID: ${data.reservationId}
        Cancha: ${courtName}
        Fecha: ${formattedDate}
        Hora: ${selectedTime}`)

      // Resetear formulario
      setSelectedCourt("")
      setSelectedDate("")
      setSelectedTime("")
      setSelectedEquipment([])
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al procesar la reserva. Intente nuevamente.")
      console.error(err)
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-green-500 text-white p-4 rounded w-full max-w-md mb-4">
        <h1 className="text-xl font-bold">Reserva tu Cancha</h1>
      </div>

      <div className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
            <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <span className="sr-only">Cerrar</span>
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 whitespace-pre-line">
            <span className="block sm:inline">{success}</span>
            <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccess(null)}>
              <span className="sr-only">Cerrar</span>
              <span className="text-xl">&times;</span>
            </button>
          </div>
        )}

        <p className="text-gray-700 text-center mb-4">
          Selecciona la cancha, fecha, hora y equipamiento para tu reserva.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Cancha */}
          <div>
            <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-2">
              Cancha <span className="text-red-500">*</span>
            </label>
            <select
              id="court"
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading.courts}
            >
              <option value="">Selecciona una cancha</option>
              {courts.map((court) => (
                <option key={court.id} value={court.id}>
                  {court.name} - {court.type}
                </option>
              ))}
            </select>
            {loading.courts && <p className="text-sm text-black mt-1">Cargando canchas...</p>}
          </div>

          {/* Selección de Fecha */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha <span className="text-red-500">*</span>
            </label>
            <select
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={loading.dates}
            >
              <option value="">Selecciona una fecha</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {formatDateInSpanish(date)}
                </option>
              ))}
            </select>
            {loading.dates && <p className="text-sm text-black mt-1">Cargando fechas...</p>}
          </div>

          {/* Selección de Hora */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Hora <span className="text-red-500">*</span>
            </label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={!selectedDate || loading.times}
            >
              <option value="">Selecciona una hora</option>
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {loading.times && <p className="text-sm text-black mt-1">Cargando horas disponibles...</p>}
          </div>

          {/* Selección de Equipamiento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipamiento disponible</label>
            <div className="flex flex-wrap gap-2">
              {loading.equipment ? (
                <p className="text-sm text-black">Cargando equipamiento disponible...</p>
              ) : availableEquipment.length > 0 ? (
                availableEquipment.map((equipment) => (
                  <button
                    key={equipment.id}
                    type="button"
                    onClick={() => toggleEquipment(equipment.id)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      selectedEquipment.includes(equipment.id)
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {equipment.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-black">
                  {selectedTime
                    ? "No hay equipamiento disponible"
                    : "Selecciona una hora para ver equipamiento disponible"}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className={`w-full py-2.5 rounded-md font-medium transition-colors ${
                loading.submit
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
              disabled={!selectedCourt || !selectedDate || !selectedTime || loading.submit}
            >
              {loading.submit ? "Procesando..." : "Confirmar Reserva"}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-gray-200 mt-6">
          <p className="text-center text-sm text-black">
            <a href="/" className="text-green-600 hover:underline">
              Volver a la página principal
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
