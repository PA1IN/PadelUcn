/*'use client';

import { Cliente, useClientes, useCrearCliente } from '@/hooks/useAdminClientes';
import { useState } from 'react';

export default function ClientesAdminPage() {
  const { data, isLoading, isError } = useClientes();
  const { mutate: crearCliente } = useCrearCliente();

  const [formData, setFormData] = useState({
    rut: '',
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    contrasena: '',
    saldo: 0,
  });

  const enviar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const registrarCliente = (e: React.FormEvent) => {
    e.preventDefault();
    crearCliente(formData);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <form onSubmit={registrarCliente} className="mb-6 bg-gray-100 p-4 rounded space-y-4">
        <h2 className="text-xl font-semibold">Registrar Cliente</h2>

        <input
          type="text"
          name="rut"
          placeholder="RUT"
          value={formData.rut}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={formData.correo}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="direccion"
          placeholder="Dirección (opcional)"
          value={formData.direccion}
          onChange={enviar}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={formData.contraseña}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Registrar Cliente
        </button>
      </form>

      {isLoading ? (
        <p>Cargando clientes...</p>
      ) : isError ? (
        <p>Error al cargar clientes.</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2"> Nombre </th>
              <th className="border p-2"> Correo </th>
              <th className="border p-2"> Teléfono </th>
              <th className="border p-2"> RUT </th>
              <th className="border p-2"> Reservas </th>
              <th className="border p-2"> Saldo </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((c: Cliente) => (
              <tr key={c.rut}>
                <td className="border p-2">{c.nombre}</td>
                <td className="border p-2">{c.correo}</td>
                <td className="border p-2">{c.telefono}</td>
                <td className="border p-2">{c.rut}</td>
                <td className="border p-2">{c.total_reservas}</td>
                <td className="border p-2">${c.saldo}</td>
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
import { useClientes, useCrearCliente, type nuevoCliente } from "@/hooks/useAdminClientes"
import { useEnviarRecordatorio } from "@/hooks/useRecordatorios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Users, Mail, Phone, MapPin, DollarSign, Calendar, CheckCircle, FileText, UserCheck } from "lucide-react"

export default function ClientesAdminPage() {
  const { data: clientes, isLoading, isError } = useClientes()
  const { mutateAsync: crearCliente, isPending: creandoCliente } = useCrearCliente()
  const { mutateAsync: enviarRecordatorio } = useEnviarRecordatorio()
  const { toast } = useToast()

  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [alertaExito, setAlertaExito] = useState(false)
  const [clienteCreado, setClienteCreado] = useState<string>("")
  const [formData, setFormData] = useState<nuevoCliente>({
    rut: "",
    nombre: "",
    correo: "",
    telefono: "",
    direccion: "",
    contraseña: "",
    saldo: 0,
  })

  const [errores, setErrores] = useState<Partial<nuevoCliente>>({})

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<nuevoCliente> = {}

    if (!formData.rut.trim()) {
      nuevosErrores.rut = ""
    }
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = ""
    }
    if (!formData.correo.trim() || !/\S+@\S+\.\S+/.test(formData.correo)) {
      nuevosErrores.correo = ""
    }
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = ""
    }
    if (!formData.contraseña.trim() || formData.contraseña.length < 6) {
      nuevosErrores.contraseña = ""
    }

    // Verificar si el RUT o correo ya existe
    if (clientes?.some((cliente) => cliente.rut === formData.rut)) {
      nuevosErrores.rut = ""
      toast({
        title: "Error",
        description: "Ya existe un cliente con ese RUT",
        variant: "destructive",
      })
    }

    if (clientes?.some((cliente) => cliente.correo === formData.correo)) {
      nuevosErrores.correo = ""
      toast({
        title: "Error",
        description: "Ya existe un cliente con ese correo",
        variant: "destructive",
      })
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "saldo" ? Number(value) : value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name as keyof nuevoCliente] !== undefined) {
      setErrores((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const resetFormulario = () => {
    setFormData({
      rut: "",
      nombre: "",
      correo: "",
      telefono: "",
      direccion: "",
      contraseña: "",
      saldo: 0,
    })
    setErrores({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    try {
      console.log(formData)
      await crearCliente(formData)

      // Enviar notificación de bienvenida al nuevo cliente
      await enviarRecordatorio({
        tipo: "reserva",
        destinatarios: [formData.correo],
        mensaje: `¡Bienvenido ${formData.nombre}! Tu cuenta ha sido creada exitosamente. Ya puedes comenzar a hacer reservas en nuestro complejo deportivo.`,
      })

      setClienteCreado(formData.nombre)
      setAlertaExito(true)
      setDialogAbierto(false)
      resetFormulario()

      toast({
        title: "¡Cliente registrado exitosamente!",
        description: `El cliente "${formData.nombre}" ha sido agregado y se ha enviado un correo de bienvenida.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar el cliente. Intenta nuevamente.",
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

  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return "Nunca"
    return new Date(fecha).toLocaleDateString("es-CL")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium mb-2">Error al cargar clientes</h3>
            <p className="text-muted-foreground">No se pudieron cargar los clientes. Intenta recargar la página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalSaldo = clientes?.reduce((total, cliente) => total + cliente.saldo, 0) || 0
  const totalReservas = clientes?.reduce((total, cliente) => total + cliente.total_reservas, 0) || 0
  const clientesActivos = clientes?.filter((cliente) => cliente.total_reservas > 0).length || 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h1>
          <p className="text-muted-foreground">Administra los clientes registrados en tu sistema</p>
        </div>
        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Cliente</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo cliente. Los campos marcados son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rut">RUT</Label>
                  <Input
                    id="rut"
                    name="rut"
                    placeholder="12.345.678-9"
                    value={formData.rut}
                    onChange={handleChange}
                    className={errores.rut !== undefined ? "border-red-500" : ""}
                  />
                  {errores.rut !== undefined && <p className="text-sm text-red-500">RUT requerido y único</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    placeholder="+56 9 1234 5678"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={errores.telefono !== undefined ? "border-red-500" : ""}
                  />
                  {errores.telefono !== undefined && <p className="text-sm text-red-500">Teléfono requerido</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Juan Pérez González"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={errores.nombre !== undefined ? "border-red-500" : ""}
                />
                {errores.nombre !== undefined && <p className="text-sm text-red-500">Nombre requerido</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="juan@ejemplo.com"
                  value={formData.correo}
                  onChange={handleChange}
                  className={errores.correo !== undefined ? "border-red-500" : ""}
                />
                {errores.correo !== undefined && (
                  <p className="text-sm text-red-500">Correo válido requerido y único</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección (Opcional)</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  placeholder="Av. Principal 123, Santiago"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contraseña">Contraseña</Label>
                <Input
                  id="contraseña"
                  name="contraseña"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.contraseña}
                  onChange={handleChange}
                  className={errores.contraseña !== undefined ? "border-red-500" : ""}
                />
                {errores.contraseña !== undefined && (
                  <p className="text-sm text-red-500">Contraseña requerida (mínimo 6 caracteres)</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="saldo">Saldo Inicial (Opcional)</Label>
                <Input
                  id="saldo"
                  name="saldo"
                  type="number"
                  placeholder="0"
                  value={formData.saldo || ""}
                  onChange={handleChange}
                />
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
                <Button type="submit" disabled={creandoCliente} className="bg-blue-600 hover:bg-blue-700">
                  {creandoCliente ? "Registrando..." : "Registrar Cliente"}
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
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Clientes registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesActivos}</div>
            <p className="text-xs text-muted-foreground">Con reservas realizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservas}</div>
            <p className="text-xs text-muted-foreground">Reservas realizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatearPrecio(totalSaldo)}</div>
            <p className="text-xs text-muted-foreground">En cuentas de clientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Información detallada de todos los clientes registrados</CardDescription>
        </CardHeader>
        <CardContent>
          {!clientes || clientes.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay clientes registrados</h3>
              <p className="text-muted-foreground mb-4">Comienza registrando tu primer cliente</p>
              <Button onClick={() => setDialogAbierto(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Registrar Primer Cliente
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Actividad</TableHead>
                    <TableHead>Saldo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.id_usuario}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{cliente.nombre_usuario}</div>
                          <div className="text-sm text-muted-foreground">{cliente.rut}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{cliente.correo}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{cliente.telefono}</span>
                          </div>
                          {cliente.direccion && (
                            <div className="flex items-center space-x-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate max-w-xs">{cliente.direccion}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{cliente.total_reservas}</span>
                            <span className="text-sm text-muted-foreground">reservas</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Última: {formatearFecha(cliente.ultima_reserva)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatearPrecio(cliente.saldo)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cliente.total_reservas > 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            Nuevo
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
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <AlertDialogTitle className="text-center">¡Cliente Registrado Exitosamente!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              El cliente <strong>"{clienteCreado}"</strong> ha sido registrado correctamente en el sistema y se ha
              enviado un correo de bienvenida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertaExito(false)} className="bg-blue-600 hover:bg-blue-700">
              ¡Perfecto!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

