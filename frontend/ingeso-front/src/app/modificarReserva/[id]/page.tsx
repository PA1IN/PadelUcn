"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  useModificarReserva,
  useObtenerReservaPorId,
  EquipamientoSeleccionado,
} from "@/hooks/useReserva";
import { useCanchas } from "@/hooks/useCanchas";
import { useEquipamiento } from "@/hooks/useEquipamiento";
import { useActualizarSaldo } from "@/hooks/useActualizarSaldo";
import { useToast } from "@/components/ui/use-toast";

export default function ModificarReservaPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const { data: usuario } = useUserProfile();
  const { data: canchas = [] } = useCanchas();
  const { data: equipamientos = [] } = useEquipamiento();
  const {
    data: reserva,
    isLoading,
    isError,
  } = useObtenerReservaPorId(Number(id));
  const modificarReserva = useModificarReserva();
  const actualizarSaldo = useActualizarSaldo();

  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaTermino, setHoraTermino] = useState("");
  const [numeroCancha, setNumeroCancha] = useState("");
  const [equipamientoSeleccionado, setEquipamientoSeleccionado] =
    useState<EquipamientoSeleccionado[]>([]);

  useEffect(() => {
    if (reserva) {
      setFecha(reserva.fecha);
      setHoraInicio(reserva.hora_inicio);
      setHoraTermino(reserva.hora_termino);
      setNumeroCancha(reserva.numero_cancha.toString());
      setEquipamientoSeleccionado(reserva.equipamiento || []);
    }
  }, [reserva]);

  const calcularCostoTotal = () => {
    const cancha = canchas.find(
      (c) => c.numero_cancha === Number(numeroCancha)
    );
    const costoCancha = cancha?.valor || 0;
    const costoEquipamiento = equipamientoSeleccionado.reduce(
      (acc, eq) => acc + eq.costo * eq.cantidad,
      0
    );
    return costoCancha + costoEquipamiento;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha || !horaInicio || !horaTermino || !numeroCancha) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await modificarReserva.mutateAsync({
        id_reserva: Number(id),
        fecha,
        hora_inicio: horaInicio,
        hora_termino: horaTermino,
        numero_cancha: Number(numeroCancha),
        equipamiento_id: equipamientoSeleccionado.map((eq) => ({
          id: eq.id_equipamiento,
          cantidad: eq.cantidad,
        })),
      });

      const nuevoCosto = calcularCostoTotal();
      const costoAnterior = reserva?.costo_total || 0;
      const diferencia = nuevoCosto - costoAnterior;

      if (usuario?.rut) {
        const nuevoSaldo = (usuario.saldo || 0) - diferencia;
        actualizarSaldo.mutate({ rut: usuario.rut, monto: nuevoSaldo });
      }

      toast({
        title: "Reserva modificada",
        description: "La reserva fue actualizada correctamente.",
      });

      router.push("/reservas");
    } catch (err: any) {
      toast({
        title: "Error al modificar",
        description: err.message || "No se pudo modificar la reserva.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="p-6">Cargando reserva...</div>;
  if (isError || !reserva)
    return <div className="p-6 text-red-500">Error cargando reserva</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-xl mx-auto space-y-4"
      >
        <h1 className="text-xl font-bold text-center text-blue-600">
          Modificar Reserva
        </h1>

        <div>
          <label className="block text-sm font-medium">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Hora Inicio</label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hora Término</label>
            <input
              type="time"
              value={horaTermino}
              onChange={(e) => setHoraTermino(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Cancha</label>
          <select
            value={numeroCancha}
            onChange={(e) => setNumeroCancha(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Selecciona una cancha</option>
            {canchas.map((c) => (
              <option key={c.id_cancha} value={c.numero_cancha}>
                {c.nombre} - ${c.valor}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Equipamiento</label>
          <div className="space-y-2">
            {equipamientos.map((eq) => {
              const selected = equipamientoSeleccionado.find(
                (e) => e.id_equipamiento === eq.id_equipamiento
              );
              const cantidad = selected?.cantidad || 0;

              return (
                <div
                  key={eq.id_equipamiento}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm">
                      {eq.nombre} (${eq.costo})
                    </p>
                    <p className="text-xs text-gray-500">
                      Stock: {eq.stock}
                    </p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={eq.stock}
                    value={cantidad}
                    onChange={(e) => {
                      const nuevaCantidad = parseInt(e.target.value) || 0;
                      setEquipamientoSeleccionado((prev) => {
                        const sinActual = prev.filter(
                          (p) => p.id_equipamiento !== eq.id_equipamiento
                        );
                        return nuevaCantidad > 0
                          ? [...sinActual, { ...eq, cantidad: nuevaCantidad }]
                          : sinActual;
                      });
                    }}
                    className="w-16 border p-1 rounded text-sm"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between font-bold text-green-700">
          <span>Total:</span>
          <span>${calcularCostoTotal().toLocaleString()}</span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
