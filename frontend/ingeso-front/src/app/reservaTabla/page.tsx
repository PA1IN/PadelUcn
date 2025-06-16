"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addDays, format } from "date-fns"
import { es } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { useCanchas } from "@/hooks/useCancha"
import { useEquipamiento } from "@/hooks/useEquipamiento"
import {
  useCrearReserva,
  useMaximoJugadoresPorCancha,
  useVerificarDisponibilidad,
} from "@/hooks/useReserva"
import { useObtenerSaldo, useActualizarSaldo } from "@/hooks/useSaldo"
import { useUserProfile } from "@/hooks/useUserProfile"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, CalendarRange, Users, Clock4, DollarSign, Check, CircleCheckBig, User } from "lucide-react"

export default function ReservaTabla() {
  const router = useRouter()

  const { data: canchas } = useCanchas()
  const { data: equipamiento } = useEquipamiento()
  const { data: userProfile } = useUserProfile()
  const { data: saldo } = useObtenerSaldo()
  const actualizarSaldo = useActualizarSaldo()

  const [canchaSeleccionada, setCanchaSeleccionada] = useState<any | null>(null)
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 0),
  })
  const [horaInicio, setHoraInicio] = useState<string>("08:00")

  const maxJugadores = useMaximoJugadoresPorCancha(canchaSeleccionada?.numero || 0)

  const verificarDisponibilidad = useVerificarDisponibilidad(
    range?.from ? format(range.from, "yyyy-MM-dd") : "",
    horaInicio,
    canchaSeleccionada?.numero || 0
  )

  const crearReserva = useCrearReserva(
    () => {
      console.log("Reserva creada con éxito.")
    },
    (error) => {
      console.error("Error al crear reserva:", error)
    }
  )

  const [pantalla, setPantalla] = useState(0)

  const calcularHoraFin = (horaInicio: string): string => {
    const [h, m] = horaInicio.split(":").map(Number)
    const horaFin = h + 1
    return `${horaFin.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`
  }

  const [reservaEnProceso, setReservaEnProceso] = useState<any | null>(null)
  const [numeroJugadores, setNumeroJugadores] = useState(2)
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] = useState<{ id: number; cantidad: number }[]>([])
  const [jugadores, setJugadores] = useState<string[]>([])
  const [confirmandoPago, setConfirmandoPago] = useState(false)

  const esFechaValida =
    range?.from &&
    new Date(range.from).getTime() >= new Date(new Date().setDate(new Date().getDate() + 7)).getTime()

  const manejarConfirmarFiltros = () => {
    if (!range?.from || !horaInicio || !canchaSeleccionada) return

    if (verificarDisponibilidad.data === false) {
    alert("La cancha seleccionada no está disponible en ese horario.")
    return
    }

    const fechaFormateada = format(range.from, "yyyy-MM-dd")

    const costoEquipamiento = equipamientoSeleccionado.reduce((total, eq) => {
      const e = equipamiento?.find((e) => e.id_equipamiento === eq.id)
      return total + (e?.costo || 0) * eq.cantidad
    }, 0)

    const costoCancha = canchaSeleccionada.valor
    const costoTotal = costoCancha + costoEquipamiento

    setReservaEnProceso({
      fecha: fechaFormateada,
      hora_inicio: horaInicio,
      hora_termino: calcularHoraFin(horaInicio),
      numero_cancha: canchaSeleccionada.numero,
      equipamiento: equipamientoSeleccionado,
      jugadores,
      costo_total: costoTotal,
    })

    setPantalla(1)
  }

  const manejarConfirmarPago = async () => {
    if (!reservaEnProceso || !userProfile?.rut || saldo?.saldo === undefined) return

    if (saldo.saldo < reservaEnProceso.costo_total) {
      alert("Saldo insuficiente para realizar la reserva.")
      return
    }

    setConfirmandoPago(true)

    try {
      await crearReserva.mutateAsync({
        fecha: reservaEnProceso.fecha,
        hora_inicio: reservaEnProceso.hora_inicio,
        hora_termino: reservaEnProceso.hora_termino,
        rut_usuario: userProfile.rut,
        numero_cancha: reservaEnProceso.numero_cancha,
        jugadores: reservaEnProceso.jugadores,
        equipamiento: reservaEnProceso.equipamiento.map((eq: any) => {
          const e = equipamiento?.find((e) => e.id_equipamiento === eq.id)
          return {
            id: eq.id,
            cantidad: eq.cantidad,
            costo: e?.costo || 0,
          }
        }),
      })

      await actualizarSaldo.mutateAsync({
        nuevoSaldo: saldo.saldo - reservaEnProceso.costo_total,
        transaccion: "Reserva de cancha",
      })

      setPantalla(2)
    } catch (error) {
      console.error("Error al confirmar la reserva:", error)
      alert("Error al confirmar la reserva. Intenta nuevamente.")
    } finally {
      setConfirmandoPago(false)
    }
  }

  const manejarAgregarJugador = () => {
    if (jugadores.length < numeroJugadores) {
      setJugadores([...jugadores, ""])
    }
  }

  const manejarActualizarJugador = (index: number, value: string) => {
    const nuevos = [...jugadores]
    nuevos[index] = value
    setJugadores(nuevos)
  }

  const manejarEliminarJugador = (index: number) => {
    const nuevos = [...jugadores]
    nuevos.splice(index, 1)
    setJugadores(nuevos)
  }

  const manejarVolverAInicio = () => {
    router.push("/home")
  }


  if (pantalla === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Reservar tu Cancha</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <Label className="flex items-center gap-2">
                  <CalendarRange className="w-4 h-4 text-gray-600" />
                  Selecciona una fecha (mínimo 7 días de anticipación)
                </Label>
                <Calendar
                  mode="single"
                  locale={es}
                  selected={range?.from}
                  onSelect={(date) =>
                    setRange({ from: date || new Date(), to: date || new Date() })
                  }
                  numberOfMonths={1}
                  disabled={(date) =>
                    date < new Date(new Date().setDate(new Date().getDate() + 7))
                  }
                />
                {!esFechaValida && (
                  <p className="text-sm text-red-600 mt-2">
                    Debes seleccionar una fecha con al menos 7 días de anticipación.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock4 className="w-4 h-4 text-gray-600" />
                  Selecciona la hora de inicio
                </Label>

                <Input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-4">
              <Label className="text-lg flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-600" />
                Número de jugadores:
              </Label>

              <Button
                type="button"
                onClick={() => setNumeroJugadores((prev) => Math.max(prev - 1, 1))}
                variant="outline"
              >
                -
              </Button>
              <span className="text-xl font-bold">{numeroJugadores}</span>
              <Button
                type="button"
                onClick={() =>
                  setNumeroJugadores((prev) =>
                    maxJugadores?.data ? Math.min(prev + 1, maxJugadores.data) : prev + 1
                  )
                }
                variant="outline"
              >
                +
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Máximo permitido: {maxJugadores?.data ?? "?"} jugadores
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label className="text-lg">Canchas Disponibles:</Label>
            {canchas?.map((cancha) => (
              <Card
                key={cancha.numero}
                className={`cursor-pointer ${
                  canchaSeleccionada?.numero === cancha.numero
                    ? "border-2 border-green-500"
                    : "hover:border-green-300"
                }`}
                onClick={() => setCanchaSeleccionada(cancha)}
              >
                <CardContent className="p-4 space-y-1">
                  <p className="font-bold text-gray-800">{cancha.nombre}</p>
                  <p className="text-gray-600">Capacidad: {cancha.cantidad_max_jugador} jugadores</p>
                  <p className="text-gray-600">Valor: ${cancha.valor.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {verificarDisponibilidad.isFetched && !verificarDisponibilidad.data && (
            <p className="text-sm text-red-600">
              ⚠️ La cancha seleccionada no está disponible en ese horario.
            </p>
          )}


          <Separator />

          <Button
            onClick={manejarConfirmarFiltros}
            disabled={!esFechaValida || !horaInicio || !canchaSeleccionada}
            className="w-full"
          >
            Siguiente <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }


  if (pantalla === 1 && reservaEnProceso) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Detalles de la Reserva</h1>

          <Card>
            <CardContent className="p-4 space-y-2">
              <p><strong>Fecha:</strong> {reservaEnProceso.fecha}</p>
              <p>
                <strong>Horario:</strong> {reservaEnProceso.hora_inicio} - {reservaEnProceso.hora_termino}
              </p>
              <p><strong>Cancha:</strong> Nº {reservaEnProceso.numero_cancha}</p>
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-2">
            <Label className="text-lg flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              Jugadores ({jugadores.length}/{numeroJugadores})
            </Label>

            {jugadores.map((jugador, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={`Jugador ${index + 1}`}
                  value={jugador}
                  onChange={(e) => manejarActualizarJugador(index, e.target.value)}
                  className="flex-1"
                />
                <Button variant="destructive" onClick={() => manejarEliminarJugador(index)}>Eliminar</Button>
              </div>
            ))}
            {jugadores.length < numeroJugadores && (
              <Button variant="outline" onClick={manejarAgregarJugador}>Agregar Jugador</Button>
            )}
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="text-lg">Equipamiento (opcional)</Label>
            {equipamiento?.map((eq) => {
              const seleccionado = equipamientoSeleccionado.find((e) => e.id === eq.id_equipamiento)
              const cantidad = seleccionado?.cantidad || 0
              return (
                <Card key={eq.id_equipamiento} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{eq.nombre}</p>
                    <p className="text-sm text-gray-600">
                      ${eq.costo.toLocaleString()} c/u • Stock: {eq.stock}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setEquipamientoSeleccionado((prev) =>
                          prev.map((e) =>
                            e.id === eq.id_equipamiento
                              ? { ...e, cantidad: Math.max(e.cantidad - 1, 0) }
                              : e
                          )
                        )
                      }
                    >
                      -
                    </Button>
                    <span className="text-lg font-bold">{cantidad}</span>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const existe = equipamientoSeleccionado.find((e) => e.id === eq.id_equipamiento)
                        if (existe) {
                          setEquipamientoSeleccionado((prev) =>
                            prev.map((e) =>
                              e.id === eq.id_equipamiento ? { ...e, cantidad: e.cantidad + 1 } : e
                            )
                          )
                        } else {
                          setEquipamientoSeleccionado((prev) => [
                            ...prev,
                            { id: eq.id_equipamiento, cantidad: 1 },
                          ])
                        }
                      }}
                    >
                      +
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>

          <Separator />

          <div className="flex justify-between text-xl font-bold">
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Total a pagar:
            </span>
            <span>${reservaEnProceso.costo_total.toLocaleString()}</span>
          </div>

          <Button
            onClick={manejarConfirmarPago}
            disabled={confirmandoPago}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {confirmandoPago ? "Procesando..." : (
              <>
                Confirmar y Pagar <Check className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>

        </div>
      </div>
    )
  }


  if (pantalla === 2 && reservaEnProceso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center space-y-6">
          <div className="flex justify-center">
            <CircleCheckBig className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">¡Reserva Confirmada!</h1>
          <p className="text-gray-600">Tu reserva ha sido procesada correctamente.</p>

          <div className="text-left space-y-2 text-gray-700">
            <p>
              <strong>Fecha:</strong> {reservaEnProceso.fecha}
            </p>
            <p>
              <strong>Horario:</strong> {reservaEnProceso.hora_inicio} - {reservaEnProceso.hora_termino}
            </p>
            <p>
              <strong>Cancha:</strong> Nº {reservaEnProceso.numero_cancha}
            </p>
            <p>
              <strong>Total Pagado:</strong> ${reservaEnProceso.costo_total.toLocaleString()}
            </p>
          </div>

          <Button onClick={manejarVolverAInicio} className="w-full">
            Volver al inicio
          </Button>
        </div>
      </div>
    )
  }

  return null
}
