/*'use client';

import { useEstadisticasVentas, useHistorialTransacciones } from '@/hooks/useAdminEstadisticas';
import { useState } from 'react';

export default function EstadisticasAdminPage() {
  const { data: resumen, isLoading: loadingResumen } = useEstadisticasVentas();

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const { data: transacciones, refetch } = useHistorialTransacciones(fechaInicio, fechaFin);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Estadísticas</h1>

      {loadingResumen ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Estadistica titulo="Reservas Hoy" valor={resumen?.cant_reservas_hoy} />
          <Estadistica titulo="Reservas Mes" valor={resumen?.cant_reservas_mes} />
          <Estadistica titulo="Pendientes" valor={resumen?.cant_reservas_pendientes} />
          <Estadistica titulo="Confirmadas" valor={resumen?.cant_reservas_confirmadas} />
          <Estadistica titulo="Transacciones Hoy" valor={resumen?.cant_transacciones_hoy} />
          <Estadistica titulo="Transacciones Mes" valor={resumen?.cant_transacciones_mes} />
          <Estadistica titulo="Ingresos Equipamiento Hoy" valor={`$${resumen?.ingresos_equipamiento_hoy}`} />
          <Estadistica titulo="Ingresos Equipamiento Mes" valor={`$${resumen?.ingresos_equipamiento_mes}`} />
          <Estadistica titulo="Ingresos Canchas Hoy" valor={`$${resumen?.ingresos_cancha_hoy}`} />
          <Estadistica titulo="Ingresos Canchas Mes" valor={`$${resumen?.ingresos_cancha_mes}`} />
          <Estadistica titulo="Total Hoy" valor={`$${resumen?.ingresos_total_hoy}`} />
          <Estadistica titulo="Total Mes" valor={`$${resumen?.ingresos_total_mes}`} />
          <Estadistica titulo="Clientes Activos" valor={resumen?.clientes_activos} />
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Historial de Transacciones</h2>
        <div className="flex gap-4 items-center mb-4">
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="p-2 border rounded"
          />
          <button onClick={() => refetch()} className="bg-blue-600 text-white px-4 py-2 rounded">
            Buscar
          </button>
        </div>

        {transacciones?.length === 0 ? (
          <p>No hay transacciones para este rango.</p>
        ) : (
          <div className="overflow-auto">
            <table className="table-auto w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Fecha</th>
                  <th className="border px-2 py-1">Usuario</th>
                  <th className="border px-2 py-1">Cancha</th>
                  <th className="border px-2 py-1">Horario</th>
                  <th className="border px-2 py-1">Equipamiento</th>
                  <th className="border px-2 py-1">Monto Total</th>
                </tr>
              </thead>
              <tbody>
                {transacciones?.map((t) => (
                  <tr key={t.id_transaccion}>
                    <td className="border px-2 py-1">{t.fecha}</td>
                    <td className="border px-2 py-1">
                      {t.reserva.usuario.nombre} ({t.reserva.usuario.rut})
                    </td>
                    <td className="border px-2 py-1">{t.reserva.cancha.nombre}</td>
                    <td className="border px-2 py-1">
                      {t.reserva.hora_inicio} - {t.reserva.hora_termino}
                    </td>
                    <td className="border px-2 py-1">
                      {t.boleta_equipamiento?.equipamiento.nombre} x{t.boleta_equipamiento?.cantidad}
                    </td>
                    <td className="border px-2 py-1">${t.boleta_equipamiento?.monto_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Estadistica({ titulo, valor }: { titulo: string; valor: string | number | undefined }) {
  return (
    <div className="p-4 bg-white border rounded shadow">
      <h3 className="text-sm text-gray-600">{titulo}</h3>
      <p className="text-xl font-bold">{valor ?? '-'}</p>
    </div>
  );
}*/


"use client"

import { useState } from "react"
import { useEstadisticasVentas, useHistorialTransacciones } from "@/hooks/useAdminEstadisticas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CalendarDays,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Package,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Search,
  FileText,
} from "lucide-react"

export default function EstadisticasAdminPage() {
  const { data: resumen, isLoading: loadingResumen } = useEstadisticasVentas()

  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const {
    data: transacciones,
    isLoading: loadingTransacciones,
    refetch,
  } = useHistorialTransacciones()

  const formatearPrecio = (precio: number | undefined) => {
    if (!precio) return "$0"
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio)
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const handleBuscar = () => {
    refetch()
  }

  const limpiarFiltros = () => {
    setFechaInicio("")
    setFechaFin("")
  }

  if (loadingResumen) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Estadísticas y Reportes</h1>
        <p className="text-muted-foreground">Panel de control con métricas clave del negocio</p>
      </div>

      {/* Estadísticas de Reservas */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Reservas
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumen?.cant_reservas_hoy || 0}</div>
              <p className="text-xs text-muted-foreground">Reservas del día actual</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservas del Mes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumen?.cant_reservas_mes || 0}</div>
              <p className="text-xs text-muted-foreground">Total del mes actual</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{resumen?.cant_reservas_pendientes || 0}</div>
              <p className="text-xs text-muted-foreground">Esperando confirmación</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resumen?.cant_reservas_confirmadas || 0}</div>
              <p className="text-xs text-muted-foreground">Reservas activas</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Estadísticas de Transacciones */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Transacciones
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transacciones Hoy</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumen?.cant_transacciones_hoy || 0}</div>
              <p className="text-xs text-muted-foreground">Transacciones del día</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transacciones del Mes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumen?.cant_transacciones_mes || 0}</div>
              <p className="text-xs text-muted-foreground">Total del mes actual</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumen?.clientes_activos || 0}</div>
              <p className="text-xs text-muted-foreground">Usuarios con reservas</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Estadísticas de Ingresos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Ingresos
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipamiento Hoy</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatearPrecio(resumen?.ingresos_equipamiento_hoy)}</div>
              <p className="text-xs text-muted-foreground">Ingresos por equipamiento</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canchas Hoy</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatearPrecio(resumen?.ingresos_cancha_hoy)}</div>
              <p className="text-xs text-muted-foreground">Ingresos por canchas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hoy</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatearPrecio(resumen?.ingresos_total_hoy)}</div>
              <p className="text-xs text-muted-foreground">Ingresos totales del día</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Equipamiento Mes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatearPrecio(resumen?.ingresos_equipamiento_mes)}</div>
              <p className="text-xs text-muted-foreground">Ingresos mensuales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canchas Mes</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatearPrecio(resumen?.ingresos_cancha_mes)}</div>
              <p className="text-xs text-muted-foreground">Ingresos mensuales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatearPrecio(resumen?.ingresos_total_mes)}</div>
              <p className="text-xs text-muted-foreground">Ingresos totales del mes</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Historial de Transacciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historial de Transacciones
          </CardTitle>
          <CardDescription>Consulta las transacciones por rango de fechas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input id="fechaFin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBuscar} disabled={loadingTransacciones}>
                <Search className="w-4 h-4 mr-2" />
                {loadingTransacciones ? "Buscando..." : "Buscar"}
              </Button>
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar
              </Button>
            </div>
          </div>

          {/* Tabla de Transacciones */}
          {loadingTransacciones ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : !transacciones || transacciones.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay transacciones</h3>
              <p className="text-muted-foreground">
                {fechaInicio || fechaFin
                  ? "No se encontraron transacciones para el rango de fechas seleccionado."
                  : "Selecciona un rango de fechas para ver las transacciones."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Cancha</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Equipamiento</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transacciones.map((transaccion) => (
                    <TableRow key={transaccion.id_transaccion}>
                      <TableCell>
                        <div className="font-medium">{formatearFecha(transaccion.fecha)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{transaccion.reserva.usuario.nombre}</div>
                          <div className="text-sm text-muted-foreground">{transaccion.reserva.usuario.rut}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{transaccion.reserva.cancha.nombre}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{formatearFecha(transaccion.reserva.fecha)}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaccion.reserva.hora_inicio} - {transaccion.reserva.hora_termino}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {transaccion.boleta_equipamiento ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Package className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{transaccion.boleta_equipamiento.equipamiento.nombre}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Cantidad: {transaccion.boleta_equipamiento.cantidad}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin equipamiento</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-medium">
                          {formatearPrecio(transaccion.boleta_equipamiento?.monto_total || 0)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

