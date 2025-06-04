"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useEquipamiento } from "@/hooks/useEquipamiento"
import { useCanchasDisponibles } from "@/hooks/useCanchasDisponibles"
import { useCrearReserva, Jugador, EquipamientoSeleccionado } from "@/hooks/useReserva"
import { useActualizarSaldo } from "@/hooks/useActualizarSaldo"

export default function ReservaTablaPage() {
  const router = useRouter()
  const { data: user } = useUserProfile()
  const { data: equipamiento = [] } = useEquipamiento()
  const [fecha, setFecha] = useState("")
  const [horaInicio, setHoraInicio] = useState("")
  const [jugadores, setJugadores] = useState<Jugador[]>([])
  const [nuevoJugador, setNuevoJugador] = useState({ nombre: "", apellido: "", rut: "", edad: "" })
  const [filtroPersonas, setFiltroPersonas] = useState(2)
  const [selectedEquipment, setSelectedEquipment] = useState<EquipamientoSeleccionado[]>([])
  const crearReserva = useCrearReserva()
  const actualizarSaldo = useActualizarSaldo()

  const [numeroCancha, setNumeroCancha] = useState("")
  const [mostrarCanchas, setMostrarCanchas] = useState(false)

  const {
    data: canchasDisponibles = [],
    refetch: refetchCanchas,
    isFetching,
  } = useCanchasDisponibles(
    {fecha, hora: horaInicio, personas: filtroPersonas},
    {enabled: false})

  const handleBuscarCanchas = () => {
    if (!fecha || !horaInicio) return
    setMostrarCanchas(true)
    refetchCanchas()
  }

  const handleAgregarJugador = () => {
    if (
      nuevoJugador.nombre.trim() &&
      nuevoJugador.apellido.trim() &&
      nuevoJugador.rut.trim() &&
      nuevoJugador.edad !== ""
    ) {
      setJugadores((prev) => [...prev, { ...nuevoJugador, edad: Number(nuevoJugador.edad) }])
      setNuevoJugador({ nombre: "", apellido: "", rut: "", edad: "" })
    }
  }

  const calcularCostoTotal = () => {
    const cancha = canchasDisponibles.find((c) => c.numero_cancha === Number(numeroCancha))
    const costoCancha = cancha?.valor ?? 0
    const costoEquipamiento = selectedEquipment.reduce(
      (acc, eq) => acc + eq.costo * eq.cantidad,
      0
    )
    return costoCancha + costoEquipamiento
  }

  const handleCrearReserva = async () => {
    if (!fecha || !horaInicio || !numeroCancha || jugadores.length !== filtroPersonas) return

    const [hora, minuto] = horaInicio.split(":").map(Number)
    const horaTermino = `${(hora + 1).toString().padStart(2, "0")}:${minuto.toString().padStart(2, "0")}`

    const reservaEnProcesoCosto = calcularCostoTotal()
    if ((user?.saldo ?? 0) < reservaEnProcesoCosto) {
      alert("Saldo insuficiente")
      return
    }

    try {
      await crearReserva.mutateAsync({
        fecha,
        hora_inicio: horaInicio,
        hora_termino: horaTermino,
        numero_cancha: Number(numeroCancha),
        jugadores,
        equipamiento_id: selectedEquipment.map((e) => ({
          id: e.id_equipamiento,
          cantidad: e.cantidad,
        })),
        rut_usuario: user?.rut ?? "",
      })

      await actualizarSaldo.mutateAsync({
        rut: user?.rut ?? "",
        monto: (user?.saldo ?? 0) - reservaEnProcesoCosto,
      })

      router.push("/verReservas")
    } catch (error) {
      console.error("Error creando reserva:", error)
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Crear Reserva</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow space-y-4">
          <h2 className="font-semibold text-lg text-gray-700">Datos de Reserva</h2>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleBuscarCanchas}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Buscar Canchas Disponibles
          </button>

          {mostrarCanchas && (
            <select
              value={numeroCancha}
              onChange={(e) => setNumeroCancha(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Selecciona una cancha</option>
              {isFetching ? (
                <option>Cargando...</option>
              ) : (
                canchasDisponibles.map((c) => (
                  <option key={c.id_cancha} value={c.numero_cancha}>
                    {c.nombre} - ${c.valor}
                  </option>
                ))
              )}
            </select>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow space-y-4">
          <h2 className="font-semibold text-lg text-gray-700">Jugadores</h2>

          <select
            value={filtroPersonas}
            onChange={(e) => setFiltroPersonas(Number(e.target.value))}
            className="w-full border p-2 rounded"
          >
            {[2, 4, 6].map((cant) => (
              <option key={cant} value={cant}>
                {cant} Personas
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoJugador.nombre}
              onChange={(e) => setNuevoJugador((prev) => ({ ...prev, nombre: e.target.value }))}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={nuevoJugador.apellido}
              onChange={(e) => setNuevoJugador((prev) => ({ ...prev, apellido: e.target.value }))}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="RUT"
              value={nuevoJugador.rut}
              onChange={(e) => setNuevoJugador((prev) => ({ ...prev, rut: e.target.value }))}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Edad"
              value={nuevoJugador.edad}
              onChange={(e) => setNuevoJugador((prev) => ({ ...prev, edad: e.target.value }))}
              className="border p-2 rounded"
            />
          </div>

          <button
            onClick={handleAgregarJugador}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            Agregar Jugador
          </button>

          <ul className="list-disc pl-5 text-sm text-gray-700">
            {jugadores.map((j, i) => (
              <li key={i}>
                {j.nombre} {j.apellido} ({j.rut}) - {j.edad} años
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mt-6 space-y-4">
        <h2 className="font-semibold text-lg text-gray-700">Equipamiento</h2>
        {equipamiento.map((eq) => {
          const seleccionado = selectedEquipment.find((e) => e.id_equipamiento === eq.id_equipamiento)
          const cantidad = seleccionado?.cantidad || 0

          return (
            <div key={eq.id_equipamiento} className="flex justify-between items-center">
              <div>
                <p className="text-sm">{eq.nombre} (${eq.costo})</p>
                <p className="text-xs text-gray-500">Stock: {eq.stock}</p>
              </div>
              <input
                type="number"
                min="0"
                max={eq.stock}
                value={cantidad}
                onChange={(e) => {
                  const nuevaCantidad = parseInt(e.target.value) || 0
                  setSelectedEquipment((prev) => {
                    const sinActual = prev.filter((p) => p.id_equipamiento !== eq.id_equipamiento)
                    return nuevaCantidad > 0
                      ? [...sinActual, { ...eq, cantidad: nuevaCantidad }]
                      : sinActual
                  })
                }}
                className="w-16 border p-1 rounded text-sm"
              />
            </div>
          )
        })}
      </div>

      <div className="flex justify-between items-center mt-4 font-bold text-green-700">
        <span>Total:</span>
        <span>${calcularCostoTotal().toLocaleString()}</span>
      </div>

      <button
        onClick={handleCrearReserva}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 mt-6 rounded"
      >
        Confirmar Reserva
      </button>
    </div>
  )
}
