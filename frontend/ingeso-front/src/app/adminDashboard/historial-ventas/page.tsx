/*'use client'

import { useHistorialTransacciones } from '@/hooks/useAdminEstadisticas'
import { useState } from 'react'
import dayjs from 'dayjs'

export default function HistorialVentasAdminPage() {
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const { data, isLoading, isError, refetch } = useHistorialTransacciones(fechaInicio, fechaFin)

  const handleFiltrar = () => {
    refetch()
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historial de Ventas</h1>

      <div className="mb-4 flex gap-4 items-end">
        <div>
          <label className="block text-sm">Fecha Inicio</label>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Fecha Fin</label>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <button onClick={handleFiltrar} className="bg-blue-600 text-white px-4 py-2 rounded">
          Filtrar
        </button>
      </div>

      {isLoading ? (
        <p>Cargando historial...</p>
      ) : isError ? (
        <p>Error al cargar las transacciones.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">ID Transacción</th>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Cliente</th>
                <th className="border p-2">Cancha</th>
                <th className="border p-2">Equipamiento</th>
                <th className="border p-2">Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((transaccion) => (
                <tr key={transaccion.id_transaccion}>
                  <td className="border p-2">{transaccion.id_transaccion}</td>
                  <td className="border p-2">{dayjs(transaccion.fecha).format('DD-MM-YYYY')}</td>
                  <td className="border p-2">
                    {transaccion.reserva?.usuario?.nombre} ({transaccion.reserva?.usuario?.rut})
                  </td>
                  <td className="border p-2">{transaccion.reserva?.cancha?.nombre}</td>
                  <td className="border p-2">
                    {transaccion.boleta_equipamiento?.equipamiento?.nombre} x{' '}
                    {transaccion.boleta_equipamiento?.cantidad}
                  </td>
                  <td className="border p-2">${transaccion.boleta_equipamiento?.monto_total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}*/


"use client"

import { useState } from "react"
import { useHistorialTransacciones } from "@/hooks/useAdminEstadisticas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Receipt,
  Search,
  User,
  MapPin,
  Package,
  DollarSign,
  FileText,
  Download,
  Filter,
  RefreshCw,
  TrendingUp,
  AlertCircle,
} from "lucide-react"

export default function HistorialVentasAdminPage() {
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [filtroCliente, setFiltroCliente] = useState("")
  const [filtroCancha, setFiltroCancha] = useState("")
  const [ordenarPor, setOrdenarPor] = useState("fecha")
  const [mostrarDetalles, setMostrarDetalles] = useState<number | null>(null)

  const { data: transacciones, isLoading, isError, refetch } = useHistorialTransacciones()

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

  const formatearFechaCompleta = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const handleFiltrar = () => {
    refetch()
  }

  const limpiarFiltros = () => {
    setFechaInicio("")
    setFechaFin("")
    setFiltroCliente("")
    setFiltroCancha("")
    setOrdenarPor("fecha")
  }

  const establecerRangoRapido = (dias: number) => {
    const hoy = new Date()
    const fechaInicial = new Date()
    fechaInicial.setDate(hoy.getDate() - dias)

    setFechaInicio(fechaInicial.toISOString().split("T")[0])
    setFechaFin(hoy.toISOString().split("T")[0])
  }

  // Filtrar y ordenar transacciones
  const transaccionesFiltradas = transacciones
    ?.filter((t) => {
      const coincideCliente =
        !filtroCliente ||
        t.reserva.usuario.nombre.toLowerCase().includes(filtroCliente.toLowerCase()) ||
        t.reserva.usuario.rut.includes(filtroCliente)

      const coincideCancha = !filtroCancha || t.reserva.cancha.nombre.toLowerCase().includes(filtroCancha.toLowerCase())

      return coincideCliente && coincideCancha
    })
    ?.sort((a, b) => {
      switch (ordenarPor) {
        case "fecha":
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        case "monto":
          return (b.boleta_equipamiento?.monto_total || 0) - (a.boleta_equipamiento?.monto_total || 0)
        case "cliente":
          return a.reserva.usuario.nombre.localeCompare(b.reserva.usuario.nombre)
        default:
          return 0
      }
    })

  // Calcular estadísticas
  const totalTransacciones = transaccionesFiltradas?.length || 0
  const montoTotal = transaccionesFiltradas?.reduce((sum, t) => sum + (t.boleta_equipamiento?.monto_total || 0), 0) || 0
  const promedioVenta = totalTransacciones > 0 ? montoTotal / totalTransacciones : 0

  const exportarDatos = () => {
    if (!transaccionesFiltradas) return

    const csv = [
      ["ID", "Fecha", "Cliente", "RUT", "Cancha", "Equipamiento", "Cantidad", "Monto"].join(","),
      ...transaccionesFiltradas.map((t) =>
        [
          t.id_transaccion,
          formatearFecha(t.fecha),
          t.reserva.usuario.nombre,
          t.reserva.usuario.rut,
          t.reserva.cancha.nombre,
          t.boleta_equipamiento?.equipamiento.nombre || "N/A",
          t.boleta_equipamiento?.cantidad || 0,
          t.boleta_equipamiento?.monto_total || 0,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `historial-ventas-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium mb-2">Error al cargar el historial</h3>
            <p className="text-muted-foreground mb-4">No se pudieron cargar las transacciones. Intenta nuevamente.</p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Receipt className="h-8 w-8" />
            Historial de Ventas
          </h1>
          <p className="text-muted-foreground">Consulta y analiza todas las transacciones realizadas</p>
        </div>
        <Button onClick={exportarDatos} disabled={!transaccionesFiltradas?.length}>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros y Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
          <CardDescription>Filtra las transacciones por fecha, cliente o cancha</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rangos Rápidos */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => establecerRangoRapido(7)}>
              Últimos 7 días
            </Button>
            <Button variant="outline" size="sm" onClick={() => establecerRangoRapido(30)}>
              Últimos 30 días
            </Button>
            <Button variant="outline" size="sm" onClick={() => establecerRangoRapido(90)}>
              Últimos 3 meses
            </Button>
          </div>

          {/* Filtros Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha Inicio</Label>
              <Input
                id="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaFin">Fecha Fin</Label>
              <Input id="fechaFin" type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filtroCliente">Buscar Cliente</Label>
              <Input
                id="filtroCliente"
                placeholder="Nombre o RUT..."
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filtroCancha">Buscar Cancha</Label>
              <Input
                id="filtroCancha"
                placeholder="Nombre de cancha..."
                value={filtroCancha}
                onChange={(e) => setFiltroCancha(e.target.value)}
              />
            </div>
          </div>

          {/* Controles */}
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2">
              <Label>Ordenar por</Label>
              <Select value={ordenarPor} onValueChange={setOrdenarPor}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fecha">Fecha</SelectItem>
                  <SelectItem value="monto">Monto</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFiltrar} disabled={isLoading}>
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? "Buscando..." : "Buscar"}
              </Button>
              <Button variant="outline" onClick={limpiarFiltros}>
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Rápidas */}
      {transaccionesFiltradas && transaccionesFiltradas.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransacciones}</div>
              <p className="text-xs text-muted-foreground">Transacciones encontradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatearPrecio(montoTotal)}</div>
              <p className="text-xs text-muted-foreground">Ingresos del período</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio por Venta</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatearPrecio(promedioVenta)}</div>
              <p className="text-xs text-muted-foreground">Valor promedio</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de Transacciones */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones</CardTitle>
          <CardDescription>
            {transaccionesFiltradas?.length
              ? `Mostrando ${transaccionesFiltradas.length} transacciones`
              : "No hay transacciones para mostrar"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
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
          ) : !transaccionesFiltradas || transaccionesFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay transacciones</h3>
              <p className="text-muted-foreground">
                {fechaInicio || fechaFin || filtroCliente || filtroCancha
                  ? "No se encontraron transacciones con los filtros aplicados."
                  : "Selecciona un rango de fechas para ver las transacciones."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Cancha</TableHead>
                    <TableHead>Horario Reserva</TableHead>
                    <TableHead>Equipamiento</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transaccionesFiltradas.map((transaccion) => (
                    <TableRow key={transaccion.id_transaccion}>
                      <TableCell>
                        <Badge variant="outline">#{transaccion.id_transaccion}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{formatearFecha(transaccion.fecha)}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaccion.fecha).toLocaleTimeString("es-CL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{transaccion.reserva.usuario.nombre}</span>
                          </div>
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
                            <Badge variant="secondary" className="text-xs">
                              {transaccion.boleta_equipamiento.equipamiento.tipo}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Cantidad: {transaccion.boleta_equipamiento.cantidad}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin equipamiento</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-green-600">
                          {formatearPrecio(transaccion.boleta_equipamiento?.monto_total || 0)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMostrarDetalles(transaccion.id_transaccion)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalles */}
      <AlertDialog open={!!mostrarDetalles} onOpenChange={() => setMostrarDetalles(null)}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Detalles de la Transacción #{mostrarDetalles}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                {transaccionesFiltradas?.find((t) => t.id_transaccion === mostrarDetalles) && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {(() => {
                      const t = transaccionesFiltradas.find((tr) => tr.id_transaccion === mostrarDetalles)!
                      return (
                        <>
                          <div>
                            <strong>Fecha de Transacción:</strong>
                            <p>{formatearFechaCompleta(t.fecha)}</p>
                          </div>
                          <div>
                            <strong>Cliente:</strong>
                            <p>{t.reserva.usuario.nombre}</p>
                            <p className="text-muted-foreground">{t.reserva.usuario.rut}</p>
                          </div>
                          <div>
                            <strong>Reserva:</strong>
                            <p>Cancha: {t.reserva.cancha.nombre}</p>
                            <p>Fecha: {formatearFecha(t.reserva.fecha)}</p>
                            <p>
                              Horario: {t.reserva.hora_inicio} - {t.reserva.hora_termino}
                            </p>
                          </div>
                          {t.boleta_equipamiento && (
                            <div>
                              <strong>Equipamiento:</strong>
                              <p>{t.boleta_equipamiento.equipamiento.nombre}</p>
                              <p>Tipo: {t.boleta_equipamiento.equipamiento.tipo}</p>
                              <p>Cantidad: {t.boleta_equipamiento.cantidad}</p>
                              <p>Costo unitario: {formatearPrecio(t.boleta_equipamiento.equipamiento.costo)}</p>
                              <p className="font-bold">Total: {formatearPrecio(t.boleta_equipamiento.monto_total)}</p>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

