/*'use client';

import {
  useEnviarRecordatorio,
  useEnviarRecordatorioMasico,
  useHistorialRecordatorios,
  useRecordatoriosAnticipados,
  nuevoRecordatorio,
} from '@/hooks/useRecordatorios';
import { useState } from 'react';

export default function RecordatoriosAdminPage() {
  const { data: historial, isLoading } = useHistorialRecordatorios();
  const { mutate: enviarIndividual } = useEnviarRecordatorio();
  const { mutate: enviarMasivo } = useEnviarRecordatorioMasico();
  const { mutate: enviarAnticipado } = useRecordatoriosAnticipados();

  const [formData, setFormData] = useState({
    tipo: 'reserva',
    destinatarios: '',
    mensaje: '',
    id_reserva: '',
    id_cancha: '',
  });

  const enviar = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registarRecordatorio = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: nuevoRecordatorio = {
      tipo: formData.tipo as 'reserva' | 'cancha_nueva' | 'pago_pendiente',
      mensaje: formData.mensaje,
      destinatarios: formData.destinatarios.split(',').map(s => s.trim()),
    };

    if (formData.id_reserva) payload.id_reserva = Number(formData.id_reserva);
    if (formData.id_cancha) payload.id_cancha = Number(formData.id_cancha);

    enviarIndividual(payload);
  };

  const handleSubmitMasivo = () => {
    enviarMasivo({
      tipo: formData.tipo as 'reserva' | 'cancha_nueva' | 'pago_pendiente',
      mensaje: formData.mensaje,
      destinatarios: formData.destinatarios.split(',').map(s => s.trim()),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Recordatorios</h1>

      <form onSubmit={registarRecordatorio} className="space-y-4 bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-semibold">Enviar Recordatorio Individual</h2>

        <select
          name="tipo"
          value={formData.tipo}
          onChange={enviar}
          className="w-full p-2 border rounded"
        >
          <option value="reserva">Reserva</option>
          <option value="cancha_nueva">Cancha Nueva</option>
          <option value="pago_pendiente">Pago Pendiente</option>
        </select>

        <input
          type="text"
          name="destinatarios"
          placeholder="Destinatarios (separados por coma)"
          value={formData.destinatarios}
          onChange={enviar}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="mensaje"
          placeholder="Mensaje"
          value={formData.mensaje}
          onChange={enviar}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="id_reserva"
          placeholder="ID Reserva (opcional)"
          value={formData.id_reserva}
          onChange={enviar}
          className="w-full p-2 border rounded"
        />

        <input
          type="number"
          name="id_cancha"
          placeholder="ID Cancha (opcional)"
          value={formData.id_cancha}
          onChange={enviar}
          className="w-full p-2 border rounded"
        />

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Enviar Individual
          </button>
          <button type="button" onClick={handleSubmitMasivo} className="bg-purple-600 text-white px-4 py-2 rounded">
            Enviar Masivo
          </button>
        </div>
      </form>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Enviar Recordatorios Anticipados</h2>
        <button
          onClick={() => enviarAnticipado(24)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Enviar a 24h de Anticipación
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Historial de Recordatorios</h2>
      {isLoading ? (
        <p>Cargando historial...</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Destinatario</th>
              <th className="border p-2">Mensaje</th>
              <th className="border p-2">Fecha Envío</th>
              <th className="border p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {historial?.map(r => (
              <tr key={r.id}>
                <td className="border p-2">{r.id}</td>
                <td className="border p-2">{r.tipo}</td>
                <td className="border p-2">{r.destinatario}</td>
                <td className="border p-2">{r.mensaje}</td>
                <td className="border p-2">{r.fecha_envio}</td>
                <td className="border p-2">{r.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}*/


"use client"

import type React from "react"

import { useState } from "react"
import {
  useEnviarRecordatorio,
  useEnviarRecordatorioMasico,
  useHistorialRecordatorios,
  useRecordatoriosAnticipados,
  type nuevoRecordatorio,
} from "@/hooks/useRecordatorios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Bell,
  Send,
  Users,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  Calendar,
  MapPin,
  FileText,
  Zap,
} from "lucide-react"

interface EnvioExitoso {
  tipo: string
  destinatarios: string[]
  mensaje: string
  id_reserva?: number
  id_cancha?: number
  esEnvioMasivo: boolean
}

export default function RecordatoriosAdminPage() {
  const { data: historial, isLoading } = useHistorialRecordatorios()
  const { mutateAsync: enviarIndividual, isPending: enviandoIndividual } = useEnviarRecordatorio()
  const { mutateAsync: enviarMasivo, isPending: enviandoMasivo } = useEnviarRecordatorioMasico()
  const { mutateAsync: enviarAnticipado, isPending: enviandoAnticipado } = useRecordatoriosAnticipados()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    tipo: "reserva",
    destinatarios: "",
    mensaje: "",
    id_reserva: "",
    id_cancha: "",
  })

  const [alertaExito, setAlertaExito] = useState(false)
  const [detallesEnvio, setDetallesEnvio] = useState<EnvioExitoso | null>(null)
  const [dialogAnticipado, setDialogAnticipado] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tipo: value }))
  }

  const resetFormulario = () => {
    setFormData({
      tipo: "reserva",
      destinatarios: "",
      mensaje: "",
      id_reserva: "",
      id_cancha: "",
    })
  }

  const mostrarExito = (envio: EnvioExitoso) => {
    setDetallesEnvio(envio)
    setAlertaExito(true)
  }

  const registrarRecordatorio = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.destinatarios.trim() || !formData.mensaje.trim()) {
      toast({
        title: "Error",
        description: "Destinatarios y mensaje son obligatorios",
        variant: "destructive",
      })
      return
    }

    const payload: nuevoRecordatorio = {
      tipo: formData.tipo as "reserva" | "cancha_nueva" | "pago_pendiente",
      mensaje: formData.mensaje,
      destinatarios: formData.destinatarios.split(",").map((s) => s.trim()),
    }

    if (formData.id_reserva) payload.id_reserva = Number(formData.id_reserva)
    if (formData.id_cancha) payload.id_cancha = Number(formData.id_cancha)

    try {
      await enviarIndividual(payload)
      mostrarExito({
        tipo: formData.tipo,
        destinatarios: payload.destinatarios,
        mensaje: formData.mensaje,
        id_reserva: payload.id_reserva,
        id_cancha: payload.id_cancha,
        esEnvioMasivo: false,
      })
      resetFormulario()
      toast({
        title: "Recordatorio enviado",
        description: "El recordatorio individual ha sido enviado exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el recordatorio. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitMasivo = async () => {
    if (!formData.mensaje.trim()) {
      toast({
        title: "Error",
        description: "El mensaje es obligatorio para envío masivo",
        variant: "destructive",
      })
      return
    }

    try {
      await enviarMasivo({
        tipo: formData.tipo as "reserva" | "cancha_nueva" | "pago_pendiente",
        mensaje: formData.mensaje,
        destinatarios: [], // Envío masivo a todos los usuarios
      })

      mostrarExito({
        tipo: formData.tipo,
        destinatarios: ["Todos los usuarios"],
        mensaje: formData.mensaje,
        esEnvioMasivo: true,
      })

      resetFormulario()
      toast({
        title: "Recordatorio masivo enviado",
        description: "El recordatorio ha sido enviado a todos los usuarios",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el recordatorio masivo. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleEnviarAnticipado = async (horas: number) => {
    try {
      await enviarAnticipado(horas)
      setDialogAnticipado(false)
      toast({
        title: "Recordatorios anticipados enviados",
        description: `Se han enviado recordatorios a ${horas} horas de anticipación`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron enviar los recordatorios anticipados",
        variant: "destructive",
      })
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "reserva":
        return <Calendar className="h-4 w-4" />
      case "cancha_nueva":
        return <MapPin className="h-4 w-4" />
      case "pago_pendiente":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "reserva":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Calendar className="w-3 h-3 mr-1" />
            Reserva
          </Badge>
        )
      case "cancha_nueva":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <MapPin className="w-3 h-3 mr-1" />
            Cancha Nueva
          </Badge>
        )
      case "pago_pendiente":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pago Pendiente
          </Badge>
        )
      default:
        return <Badge variant="outline">{tipo}</Badge>
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "enviado":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enviado
          </Badge>
        )
      case "pendiente":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        )
      case "fallido":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Fallido
          </Badge>
        )
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="h-8 w-8" />
          Gestión de Recordatorios
        </h1>
        <p className="text-muted-foreground">Envía recordatorios individuales, masivos y anticipados a los usuarios</p>
      </div>

      {/* Formulario de Recordatorios */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recordatorio Individual/Masivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Enviar Recordatorio
            </CardTitle>
            <CardDescription>Envía recordatorios a usuarios específicos o a todos los usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={registrarRecordatorio} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Recordatorio</Label>
                <Select value={formData.tipo} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reserva">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Reserva
                      </div>
                    </SelectItem>
                    <SelectItem value="cancha_nueva">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Cancha Nueva
                      </div>
                    </SelectItem>
                    <SelectItem value="pago_pendiente">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Pago Pendiente
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinatarios">Destinatarios (opcional para envío masivo)</Label>
                <Input
                  id="destinatarios"
                  name="destinatarios"
                  placeholder="12345678-9, 22222222-2"
                  value={formData.destinatarios}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground">
                  Separa múltiples destinatarios con comas. Deja vacío para envío masivo.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensaje">Mensaje</Label>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Escribe tu mensaje aquí..."
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id_reserva">ID Reserva (opcional)</Label>
                  <Input
                    id="id_reserva"
                    name="id_reserva"
                    type="number"
                    placeholder="123"
                    value={formData.id_reserva}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_cancha">ID Cancha (opcional)</Label>
                  <Input
                    id="id_cancha"
                    name="id_cancha"
                    type="number"
                    placeholder="456"
                    value={formData.id_cancha}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={enviandoIndividual}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {enviandoIndividual ? "Enviando..." : "Enviar Individual"}
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitMasivo}
                  disabled={enviandoMasivo}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {enviandoMasivo ? "Enviando..." : "Enviar Masivo"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recordatorios Anticipados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recordatorios Anticipados
            </CardTitle>
            <CardDescription>Envía recordatorios automáticos antes de las reservas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Envía recordatorios automáticos a usuarios con reservas próximas
            </p>
            <Dialog open={dialogAnticipado} onOpenChange={setDialogAnticipado}>
              <DialogTrigger asChild>
                <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Configurar Recordatorios Anticipados
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Recordatorios Anticipados</DialogTitle>
                  <DialogDescription>
                    Selecciona cuántas horas antes de la reserva quieres enviar los recordatorios
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Button
                    onClick={() => handleEnviarAnticipado(24)}
                    disabled={enviandoAnticipado}
                    className="justify-start bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    24 horas antes
                  </Button>
                  <Button
                    onClick={() => handleEnviarAnticipado(12)}
                    disabled={enviandoAnticipado}
                    className="justify-start bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    12 horas antes
                  </Button>
                  <Button
                    onClick={() => handleEnviarAnticipado(6)}
                    disabled={enviandoAnticipado}
                    className="justify-start bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Clock className="w-4 h-4 mr-2" />6 horas antes
                  </Button>
                  <Button
                    onClick={() => handleEnviarAnticipado(2)}
                    disabled={enviandoAnticipado}
                    className="justify-start bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Clock className="w-4 h-4 mr-2" />2 horas antes
                  </Button>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogAnticipado(false)}>
                    Cancelar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Historial de Recordatorios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Historial de Recordatorios
          </CardTitle>
          <CardDescription>Registro de todos los recordatorios enviados</CardDescription>
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
          ) : !historial || historial.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay recordatorios</h3>
              <p className="text-muted-foreground">Los recordatorios enviados aparecerán aquí</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Destinatario</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Fecha Envío</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historial.map((recordatorio) => (
                    <TableRow key={recordatorio.id}>
                      <TableCell>
                        <Badge variant="outline">#{recordatorio.id}</Badge>
                      </TableCell>
                      <TableCell>{getTipoBadge(recordatorio.tipo)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{recordatorio.destinatario}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm truncate" title={recordatorio.mensaje}>
                            {recordatorio.mensaje}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatearFecha(recordatorio.fecha_envio)}</div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(recordatorio.estado)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Envío Exitoso */}
      <AlertDialog open={alertaExito} onOpenChange={setAlertaExito}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center">¡Recordatorio Enviado Exitosamente!</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                {detallesEnvio && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Tipo de Recordatorio:</strong>
                        <div className="mt-1">{getTipoBadge(detallesEnvio.tipo)}</div>
                      </div>
                      <div>
                        <strong>Tipo de Envío:</strong>
                        <div className="mt-1">
                          <Badge variant={detallesEnvio.esEnvioMasivo ? "default" : "secondary"}>
                            {detallesEnvio.esEnvioMasivo ? "Masivo" : "Individual"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <strong>Destinatarios:</strong>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {detallesEnvio.esEnvioMasivo
                          ? "Todos los usuarios registrados"
                          : detallesEnvio.destinatarios.join(", ")}
                      </p>
                    </div>
                    <div>
                      <strong>Mensaje:</strong>
                      <p className="mt-1 text-sm text-muted-foreground bg-white p-2 rounded border">
                        {detallesEnvio.mensaje}
                      </p>
                    </div>
                    {(detallesEnvio.id_reserva || detallesEnvio.id_cancha) && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {detallesEnvio.id_reserva && (
                          <div>
                            <strong>ID Reserva:</strong>
                            <p className="mt-1">#{detallesEnvio.id_reserva}</p>
                          </div>
                        )}
                        {detallesEnvio.id_cancha && (
                          <div>
                            <strong>ID Cancha:</strong>
                            <p className="mt-1">#{detallesEnvio.id_cancha}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertaExito(false)} className="bg-green-600 hover:bg-green-700">
              ¡Perfecto!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
