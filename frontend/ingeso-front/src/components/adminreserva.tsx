"use client"

import { useState, useMemo } from "react"
import {
  useTodasLasReservas,
  useConfirmarReserva,
  useCancelarReservaAdmin,
  type reservaAdmin,
} from "@/hooks/useAdminReservas"
import { useEnviarRecordatorio } from "@/hooks/useRecordatorios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle, Clock, User, MapPin, Package, DollarSign, Edit, Eye, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formatearPrecio = (precio: number | undefined | null) => {
  if (!precio && precio !== 0) return "$0"
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(precio)
}

export default function AdminReservasPage() {
  const { data: todasLasReservas, isLoading } = useTodasLasReservas()
  const { mutateAsync: confirmarReserva, isPending: confirmando } = useConfirmarReserva()
  const { mutateAsync: cancelarReserva, isPending: cancelando } = useCancelarReservaAdmin()
  const { mutateAsync: enviarRecordatorio } = useEnviarRecordatorio()
  const { toast } = useToast()

  const [reservaACancelar, setReservaACancelar] = useState<reservaAdmin | null>(null)
  const [motivoCancelacion, setMotivoCancelacion] = useState("")
  const [reservaAConfirmar, setReservaAConfirmar] = useState<reservaAdmin | null>(null)

  const [vistaActual, setVistaActual] = useState<"pendientes" | "todas">("pendientes")
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [filtroFecha, setFiltroFecha] = useState<string>("")

  const todasLasReservasActivas = todasLasReservas || []
  const reservasPendientes = todasLasReservas?.filter((reserva) => reserva.estado?.toLowerCase() === "pendiente") || []

  const router = useRouter()

  const handleModificar = (reservaId: number) => {
    router.push(`/adminDashboard/reservas/${reservaId}`)
  }

  const handleConfirmar = async (reserva: reservaAdmin) => {
    try {
      await confirmarReserva(reserva.id)

      // Enviar notificación al usuario
      await enviarRecordatorio({
        tipo: "reserva",
        destinatarios: [reserva.usuario.correo],
        mensaje: `Tu reserva para el ${reserva.fecha} de ${reserva.hora_inicio} a ${reserva.hora_termino} en ${reserva.cancha.nombre} ha sido confirmada.`,
        id_reserva: reserva.id,
      })

      toast({
        title: "Reserva confirmada",
        description: `La reserva #${reserva.id} ha sido confirmada y se ha notificado al usuario.`,
        variant: "default",
      })

      setReservaAConfirmar(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo confirmar la reserva. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleCancelar = async () => {
    if (!reservaACancelar || !motivoCancelacion.trim()) {
      toast({
        title: "Error",
        description: "Debes ingresar un motivo para la cancelación.",
        variant: "destructive",
      })
      return
    }

    try {
      await cancelarReserva(reservaACancelar.id)

      // Enviar notificación al usuario sobre la cancelación
      await enviarRecordatorio({
        tipo: "reserva",
        destinatarios: [reservaACancelar.usuario.correo],
        mensaje: `Tu reserva para el ${reservaACancelar.fecha} ha sido cancelada. Motivo: ${motivoCancelacion}`,
        id_reserva: reservaACancelar.id,
      })

      toast({
        title: "Reserva cancelada",
        description: `La reserva #${reservaACancelar.id} ha sido cancelada y se ha notificado al usuario.`,
        variant: "default",
      })

      setReservaACancelar(null)
      setMotivoCancelacion("")
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar la reserva. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "confirmada":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Confirmada
          </Badge>
        )
      case "cancelada":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const reservasFiltradas = useMemo(() => {
    console.log(" Iniciando filtrado...")
    console.log(" Todas las reservas:", todasLasReservasActivas.length)
    console.log(" Reservas pendientes:", reservasPendientes.length)
    console.log(" Vista actual:", vistaActual)
    console.log(" Filtro estado:", filtroEstado)
    console.log(" Filtro fecha:", filtroFecha)

    // Empezar con el conjunto base según la vista
    let reservas = vistaActual === "pendientes" ? reservasPendientes : todasLasReservasActivas

    console.log(" Reservas base después de vista:", reservas.length)

    // Aplicar filtro de estado solo si no es "todos" Y si estamos en vista "todas"
    if (filtroEstado !== "todos" && vistaActual === "todas") {
      const reservasAntesFiltro = reservas.length
      reservas = reservas.filter((r) => {
        const estadoReserva = r.estado?.toLowerCase()
        const coincide = estadoReserva === filtroEstado.toLowerCase()

        if (!coincide) {
          console.log(` Reserva ${r.id}: estado "${estadoReserva}" no coincide con filtro "${filtroEstado}"`)
        }

        return coincide
      })
      console.log(` Filtro estado aplicado: ${reservasAntesFiltro} → ${reservas.length}`)
    }

    // Aplicar filtro de fecha
    if (filtroFecha) {
      const reservasAntesFiltro = reservas.length
      reservas = reservas.filter((r) => {
        const fechaReserva = r.fecha
        const coincide = fechaReserva === filtroFecha

        if (!coincide) {
          console.log(` Reserva ${r.id}: fecha "${fechaReserva}" no coincide con filtro "${filtroFecha}"`)
        }

        return coincide
      })
      console.log(` Filtro fecha aplicado: ${reservasAntesFiltro} → ${reservas.length}`)
    }

    console.log(" Reservas finales filtradas:", reservas.length)

    // Mostrar muestra de los estados de las reservas para debug
    if (reservas.length > 0) {
      console.log(" Estados de las primeras 3 reservas:")
      reservas.slice(0, 3).forEach((r) => {
        console.log(`  - Reserva ${r.id}: estado = "${r.estado}"`)
      })
    }

    return reservas
  }, [vistaActual, reservasPendientes, todasLasReservasActivas, filtroEstado, filtroFecha])

  const limpiarFiltros = () => {
    setFiltroEstado("todos")
    setFiltroFecha("")
    setVistaActual("todas")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestión Completa de Reservas</h1>
        <p className="text-muted-foreground">
          Administra todas las reservas: confirma, modifica y cancela sin restricciones
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservasPendientes.length}</div>
            <p className="text-xs text-muted-foreground">Esperando confirmación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todasLasReservasActivas.length}</div>
            <p className="text-xs text-muted-foreground">Todas las reservas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todasLasReservasActivas.filter((r) => r.estado?.toLowerCase() === "confirmada").length}
            </div>
            <p className="text-xs text-muted-foreground">Reservas activas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Filtros y Vista</CardTitle>
              <CardDescription>Personaliza la vista de reservas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Label>Vista:</Label>
              <Select value={vistaActual} onValueChange={(value: "pendientes" | "todas") => setVistaActual(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendientes">Solo Pendientes</SelectItem>
                  <SelectItem value="todas">Todas las Reservas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label>Estado:</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado} disabled={vistaActual === "pendientes"}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              {vistaActual === "pendientes" && (
                <span className="text-xs text-muted-foreground">(Deshabilitado en vista pendientes)</span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Label>Fecha:</Label>
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <Button variant="outline" onClick={limpiarFiltros} className="bg-gray-50 hover:bg-gray-100">
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {vistaActual === "pendientes" ? "Reservas Pendientes" : "Todas las Reservas"} ({reservasFiltradas.length})
          </CardTitle>
          <CardDescription>
            {vistaActual === "pendientes"
              ? "Lista de reservas que requieren tu atención"
              : "Vista completa de todas las reservas del sistema"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservasFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {vistaActual === "pendientes" ? "¡Todo al día!" : "No hay reservas"}
              </h3>
              <p className="text-muted-foreground">
                {vistaActual === "pendientes"
                  ? "No hay reservas pendientes por revisar."
                  : "No se encontraron reservas con los filtros aplicados."}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reserva</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Cancha</TableHead>
                    <TableHead>Equipamiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservasFiltradas.map((reserva) => (
                    <TableRow key={reserva.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">#{reserva.id}</div>
                          <div className="text-sm text-muted-foreground">{reserva.fecha}</div>
                          <div className="text-sm text-muted-foreground">
                            {reserva.hora_inicio} - {reserva.hora_termino}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{reserva.usuario.nombre}</div>
                            <div className="text-sm text-muted-foreground">{reserva.usuario.rut}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{reserva.cancha.nombre}</div>
                            <div className="text-sm text-muted-foreground">#{reserva.cancha.numero}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(reserva.equipamiento ?? []).length === 0 ? (
                          <span className="text-muted-foreground text-sm">Sin equipamiento</span>
                        ) : (
                          <div className="space-y-1">
                            {reserva.equipamiento.map((eq) => (
                              <div key={eq.id} className="flex items-center space-x-1 text-sm">
                                <Package className="h-3 w-3 text-muted-foreground" />
                                <span>
                                  {eq.nombre} x{eq.cantidad}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getEstadoBadge(reserva.estado)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatearPrecio(reserva.costo_total)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleModificar(reserva.id)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Modificar
                          </Button>

                          {reserva.estado?.toLowerCase() === "pendiente" && (
                            <Button
                              size="sm"
                              onClick={() => setReservaAConfirmar(reserva)}
                              disabled={confirmando}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirmar
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setReservaACancelar(reserva)}
                            disabled={cancelando}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Cancelar
                          </Button>
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

      {/* Dialog para confirmar reserva */}
      <AlertDialog open={!!reservaAConfirmar} onOpenChange={() => setReservaAConfirmar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Reserva</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas confirmar la reserva #{reservaAConfirmar?.id}? Se enviará una notificación al
              usuario confirmando su reserva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => reservaAConfirmar && handleConfirmar(reservaAConfirmar)}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar Reserva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para cancelar reserva */}
      <Dialog
        open={!!reservaACancelar}
        onOpenChange={() => {
          setReservaACancelar(null)
          setMotivoCancelacion("")
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <DialogDescription>
              Ingresa el motivo de la cancelación. Esta información será enviada al usuario.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo de cancelación</Label>
              <Textarea
                id="motivo"
                placeholder="Ej: Mantenimiento de cancha, condiciones climáticas adversas..."
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReservaACancelar(null)
                setMotivoCancelacion("")
              }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleCancelar} disabled={!motivoCancelacion.trim() || cancelando}>
              {cancelando ? "Cancelando..." : "Cancelar Reserva"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
