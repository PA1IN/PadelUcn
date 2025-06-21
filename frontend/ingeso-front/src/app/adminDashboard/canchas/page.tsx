/*'use client';
import { Cancha, useAdminCanchas, useCrearCancha } from '@/hooks/useAdminCanchas';
import { useState } from 'react';

export default function CanchasAdminPage() {
  const { data, isLoading, isError } = useAdminCanchas();
  const { mutate: crearCancha } = useCrearCancha();

  const [formData, setFormData] = useState({
    numero: 0,
    nombre: '',
    descripcion: '',
    valor: 0,
    cantidadMaxJugador: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'valor' || name === 'cantidad_max_jugador' || name === 'numero' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crearCancha(formData);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Canchas</h1>

     
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold">Agregar Cancha</h2>

        <input
          type="number"
          name="numero"
          placeholder="Número de cancha"
          value={formData.numero}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="valor"
          placeholder="Valor"
          value={formData.valor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="cantidad_max_jugador"
          placeholder="Máx. Jugadores"
          value={formData.cantidadMaxJugador}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear Cancha
        </button>
      </form>

      {isLoading ? (
        <p>Cargando canchas...</p>
      ) : isError ? (
        <p>Error al cargar canchas.</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2"> Número </th>
              <th className="border p-2"> Nombre </th>
              <th className="border p-2"> Descripción </th>
              <th className="border p-2"> Valor </th>
              <th className="border p-2"> Máximo de jugadores </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c: Cancha) => (
              <tr key={c.numero}>
                <td className="border p-2">{c.numero}</td>
                <td className="border p-2">{c.nombre}</td>
                <td className="border p-2">{c.descripcion}</td>
                <td className="border p-2">${c.valor}</td>
                <td className="border p-2">{c.cantidadMaxJugador}</td>
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
import { useAdminCanchas, useCrearCancha, type nuevaCancha } from "@/hooks/useAdminCanchas"
import { useEnviarRecordatorioMasico } from "@/hooks/useRecordatorios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Plus, MapPin, Users, DollarSign, FileText, CheckCircle, Wrench } from "lucide-react"

export default function CanchasAdminPage() {
  const { data: canchas, isLoading, isError } = useAdminCanchas()
  const { mutateAsync: crearCancha, isPending: creandoCancha } = useCrearCancha()
  const { mutateAsync: enviarRecordatorio } = useEnviarRecordatorioMasico()
  const { toast } = useToast()

  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [alertaExito, setAlertaExito] = useState(false)
  const [canchaCreada, setCanchaCreada] = useState<string>("")
  const [formData, setFormData] = useState<nuevaCancha>({
    numero: 0,
    nombre: "",
    descripcion: "",
    valor: 0,
    cantidadMaxJugador: 0,
  })

  const [errores, setErrores] = useState<Partial<nuevaCancha>>({})

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<nuevaCancha> = {}

    if (!formData.numero || formData.numero <= 0) {
      nuevosErrores.numero = 0
    }
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = ""
    }
    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = ""
    }
    if (!formData.valor || formData.valor <= 0) {
      nuevosErrores.valor = 0
    }
    if (!formData.cantidadMaxJugador || formData.cantidadMaxJugador <= 0) {
      nuevosErrores.cantidadMaxJugador = 0
    }

    // Verificar si el número de cancha ya existe
    if (canchas?.some((cancha) => cancha.numero === formData.numero)) {
      nuevosErrores.numero = 0
      toast({
        title: "Error",
        description: "Ya existe una cancha con ese número",
        variant: "destructive",
      })
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["valor", "cantidadMaxJugador", "numero"].includes(name) ? Number(value) : value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name as keyof nuevaCancha] !== undefined) {
      setErrores((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const resetFormulario = () => {
    setFormData({
      numero: 0,
      nombre: "",
      descripcion: "",
      valor: 0,
      cantidadMaxJugador: 0,
    })
    setErrores({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    try {
      await crearCancha(formData)

      // Enviar notificación masiva sobre la nueva cancha
      await enviarRecordatorio({
        tipo: "cancha_nueva",
        destinatarios: [], // Se enviará a todos los usuarios
        mensaje: `¡Nueva cancha disponible! ${formData.nombre} - Capacidad: ${formData.cantidadMaxJugador} jugadores. ¡Reserva ya!`,
        id_cancha: formData.numero,
      })

      setCanchaCreada(formData.nombre)
      setAlertaExito(true)
      setDialogAbierto(false)
      resetFormulario()

      toast({
        title: "¡Cancha creada exitosamente!",
        description: `La cancha "${formData.nombre}" ha sido agregada y se ha notificado a todos los usuarios.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la cancha. Intenta nuevamente.",
        variant: "destructive",
      })
    }
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
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
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium mb-2">Error al cargar canchas</h3>
            <p className="text-muted-foreground">No se pudieron cargar las canchas. Intenta recargar la página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Canchas</h1>
          <p className="text-muted-foreground">Administra las canchas disponibles en tu complejo deportivo</p>
        </div>
        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cancha
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white z-50">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Cancha</DialogTitle>
              <DialogDescription>
                Completa la información de la nueva cancha. Todos los campos son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número de Cancha</Label>
                  <Input
                    id="numero"
                    name="numero"
                    type="number"
                    placeholder="Ej: 1"
                    value={formData.numero || ""}
                    onChange={handleChange}
                    className={errores.numero !== undefined ? "border-red-500" : ""}
                  />
                  {errores.numero !== undefined && (
                    <p className="text-sm text-red-500">Número de cancha requerido y único</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cantidadMaxJugador">Máx. Jugadores</Label>
                  <Input
                    id="cantidadMaxJugador"
                    name="cantidadMaxJugador"
                    type="number"
                    placeholder="Ej: 10"
                    value={formData.cantidadMaxJugador || ""}
                    onChange={handleChange}
                    className={errores.cantidadMaxJugador !== undefined ? "border-red-500" : ""}
                  />
                  {errores.cantidadMaxJugador !== undefined && (
                    <p className="text-sm text-red-500">Cantidad máxima requerida</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Cancha</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Ej: Cancha Principal"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={errores.nombre !== undefined ? "border-red-500" : ""}
                />
                {errores.nombre !== undefined && <p className="text-sm text-red-500">Nombre requerido</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Describe las características de la cancha..."
                  value={formData.descripcion}
                  onChange={handleChange}
                  className={errores.descripcion !== undefined ? "border-red-500" : ""}
                />
                {errores.descripcion !== undefined && <p className="text-sm text-red-500">Descripción requerida</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor por Hora (CLP)</Label>
                <Input
                  id="valor"
                  name="valor"
                  type="number"
                  placeholder="Ej: 25000"
                  value={formData.valor || ""}
                  onChange={handleChange}
                  className={errores.valor !== undefined ? "border-red-500" : ""}
                />
                {errores.valor !== undefined && <p className="text-sm text-red-500">Valor requerido</p>}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogAbierto(false)
                    resetFormulario()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={creandoCancha} className="bg-green-600 hover:bg-green-700">
                  {creandoCancha ? "Creando..." : "Crear Cancha"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Canchas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{canchas?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Canchas disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacidad Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {canchas?.reduce((total, cancha) => total + cancha.cantidadMaxJugador, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">Jugadores simultáneos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {canchas?.length
                ? formatearPrecio(canchas.reduce((total, cancha) => total + cancha.valor, 0) / canchas.length)
                : "$0"}
            </div>
            <p className="text-xs text-muted-foreground">Por hora</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Mantenimiento</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{canchas?.filter((cancha) => cancha.mantenimiento).length || 0}</div>
            <p className="text-xs text-muted-foreground">Canchas no disponibles</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Canchas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Canchas</CardTitle>
          <CardDescription>Información detallada de todas las canchas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          {!canchas || canchas.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay canchas registradas</h3>
              <p className="text-muted-foreground mb-4">Comienza agregando tu primera cancha</p>
              <Button onClick={() => setDialogAbierto(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primera Cancha
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cancha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Precio/Hora</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {canchas.map((cancha) => (
                    <TableRow key={cancha.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{cancha.nombre}</div>
                          <div className="text-sm text-muted-foreground">#{cancha.numero}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm text-muted-foreground line-clamp-2">{cancha.descripcion}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{cancha.cantidadMaxJugador}</span>
                          <span className="text-sm text-muted-foreground">jugadores</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatearPrecio(cancha.valor)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cancha.mantenimiento ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <Wrench className="w-3 h-3 mr-1" />
                            Mantenimiento
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Disponible
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerta de éxito */}
      <AlertDialog open={alertaExito} onOpenChange={setAlertaExito}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center">¡Cancha Agregada Exitosamente!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              La cancha <strong>"{canchaCreada}"</strong> ha sido agregada correctamente al sistema y se ha notificado a
              todos los usuarios sobre su disponibilidad.
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
