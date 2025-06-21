/*'use client'

import { useEquipamientos, useCrearEquipamiento } from '@/hooks/useAdminEquipamiento'
import { useState } from 'react'
import type { Equipamiento } from '@/hooks/useAdminEquipamiento'

export default function EquipamientoAdminPage() {
  const { data: equipamientos, isLoading, isError } = useEquipamientos()
  const { mutate: crearEquipamiento } = useCrearEquipamiento()

  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    costo: 0,
    stock: 0,
  })

  const enviar = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'costo' || name === 'stock' ? Number(value) : value,
    }))
  }

  const registrarEquipamiento = (e: React.FormEvent) => {
    e.preventDefault()
    crearEquipamiento(formData)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Equipamiento</h1>

      <form onSubmit={registrarEquipamiento} className="mb-6 bg-gray-100 p-4 rounded space-y-4">
        <h2 className="text-xl font-semibold">Agregar Equipamiento</h2>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="tipo"
          value={formData.tipo}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        >
          <option value=""> Seleccione un tipo </option>
          <option value="Raqueta"> Raqueta </option>
          <option value="Pelota"> Pelota </option>
          <option value="Red"> Red </option>
          <option value="Otro"> Otro </option>
        </select>

        <input
          type="number"
          name="costo"
          placeholder="Costo de arriendo"
          value={formData.costo}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock disponible"
          value={formData.stock}
          onChange={enviar}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Crear Equipamiento
        </button>
      </form>

      {isLoading ? (
        <p>Cargando equipamientos...</p>
      ) : isError ? (
        <p>Error al cargar los equipamientos.</p>
      ) : (
        <table className="table-auto w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2"> Nombre </th>
              <th className="border p-2"> Tipo </th>
              <th className="border p-2"> Costo </th>
              <th className="border p-2"> Stock </th>
            </tr>
          </thead>
          <tbody>
            {equipamientos?.map((e: Equipamiento) => (
              <tr key={e.id}>
                <td className="border p-2">{e.nombre}</td>
                <td className="border p-2">{e.tipo}</td>
                <td className="border p-2">${e.costo}</td>
                <td className="border p-2">{e.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}*/

"use client"

import type React from "react"

import { useState } from "react"
import { useEquipamientos, useCrearEquipamiento, type nuevoEquipamiento } from "@/hooks/useAdminEquipamiento"
import { useEnviarRecordatorioMasico } from "@/hooks/useRecordatorios"
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
import { Plus, Package, DollarSign, Archive, FileText, CheckCircle, AlertTriangle } from "lucide-react"

export default function EquipamientoAdminPage() {
  const { data: equipamientos, isLoading, isError } = useEquipamientos()
  const { mutateAsync: crearEquipamiento, isPending: creandoEquipamiento } = useCrearEquipamiento()
  const { mutateAsync: enviarRecordatorio } = useEnviarRecordatorioMasico()
  const { toast } = useToast()

  const [dialogAbierto, setDialogAbierto] = useState(false)
  const [alertaExito, setAlertaExito] = useState(false)
  const [equipamientoCreado, setEquipamientoCreado] = useState<string>("")
  const [formData, setFormData] = useState<nuevoEquipamiento>({
    nombre: "",
    tipo: "",
    costo: 0,
    stock: 0,
  })

  const [errores, setErrores] = useState<Partial<nuevoEquipamiento>>({})

  const tiposEquipamiento = [
    { value: "Raqueta", label: "Raqueta" },
    { value: "Pelota", label: "Pelota" },
    { value: "Red", label: "Red" },
    { value: "Balón", label: "Balón" },
    { value: "Conos", label: "Conos" },
    { value: "Petos", label: "Petos" },
    { value: "Otro", label: "Otro" },
  ]

  const validarFormulario = (): boolean => {
    const nuevosErrores: Partial<nuevoEquipamiento> = {}

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = ""
    }
    if (!formData.tipo.trim()) {
      nuevosErrores.tipo = ""
    }
    if (!formData.costo || formData.costo <= 0) {
      nuevosErrores.costo = 0
    }
    if (!formData.stock || formData.stock < 0) {
      nuevosErrores.stock = 0
    }

    // Verificar si el nombre ya existe
    if (equipamientos?.some((equipamiento) => equipamiento.nombre.toLowerCase() === formData.nombre.toLowerCase())) {
      nuevosErrores.nombre = ""
      toast({
        title: "Error",
        description: "Ya existe un equipamiento con ese nombre",
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
      [name]: ["costo", "stock"].includes(name) ? Number(value) : value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name as keyof nuevoEquipamiento] !== undefined) {
      setErrores((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tipo: value }))
    if (errores.tipo !== undefined) {
      setErrores((prev) => ({ ...prev, tipo: undefined }))
    }
  }

  const resetFormulario = () => {
    setFormData({
      nombre: "",
      tipo: "",
      costo: 0,
      stock: 0,
    })
    setErrores({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    try {
      await crearEquipamiento(formData)

      // Enviar notificación masiva sobre el nuevo equipamiento
      await enviarRecordatorio({
        tipo: "reserva",
        destinatarios: [], // Se enviará a todos los usuarios
        mensaje: `¡Nuevo equipamiento disponible! ${formData.nombre} (${formData.tipo}) - Costo: $${formData.costo.toLocaleString()} por hora. ¡Reserva ya!`,
      })

      setEquipamientoCreado(formData.nombre)
      setAlertaExito(true)
      setDialogAbierto(false)
      resetFormulario()

      toast({
        title: "¡Equipamiento agregado exitosamente!",
        description: `El equipamiento "${formData.nombre}" ha sido agregado y se ha notificado a todos los usuarios.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el equipamiento. Intenta nuevamente.",
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

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Sin Stock
        </Badge>
      )
    } else if (stock <= 5) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Stock Bajo
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Disponible
        </Badge>
      )
    }
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
            <h3 className="text-lg font-medium mb-2">Error al cargar equipamientos</h3>
            <p className="text-muted-foreground">
              No se pudieron cargar los equipamientos. Intenta recargar la página.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalEquipamientos = equipamientos?.length || 0
  const stockTotal = equipamientos?.reduce((total, equip) => total + equip.stock, 0) || 0
  const valorTotal = equipamientos?.reduce((total, equip) => total + equip.costo * equip.stock, 0) || 0
  const equipamientosSinStock = equipamientos?.filter((equip) => equip.stock === 0).length || 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Equipamiento</h1>
          <p className="text-muted-foreground">Administra el equipamiento disponible para alquiler</p>
        </div>
        <Dialog open={dialogAbierto} onOpenChange={setDialogAbierto}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Equipamiento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Equipamiento</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo equipamiento. Todos los campos son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Equipamiento</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Ej: Raqueta de Tenis"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={errores.nombre !== undefined ? "border-red-500" : ""}
                  />
                  {errores.nombre !== undefined && <p className="text-sm text-red-500">Nombre requerido y único</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={handleSelectChange}>
                    <SelectTrigger className={errores.tipo !== undefined ? "border-red-500" : ""}>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposEquipamiento.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errores.tipo !== undefined && <p className="text-sm text-red-500">Tipo requerido</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costo">Costo por Hora (CLP)</Label>
                  <Input
                    id="costo"
                    name="costo"
                    type="number"
                    placeholder="Ej: 5000"
                    value={formData.costo || ""}
                    onChange={handleChange}
                    className={errores.costo !== undefined ? "border-red-500" : ""}
                  />
                  {errores.costo !== undefined && <p className="text-sm text-red-500">Costo requerido</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Disponible</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    placeholder="Ej: 10"
                    value={formData.stock || ""}
                    onChange={handleChange}
                    className={errores.stock !== undefined ? "border-red-500" : ""}
                  />
                  {errores.stock !== undefined && <p className="text-sm text-red-500">Stock requerido</p>}
                </div>
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
                <Button type="submit" disabled={creandoEquipamiento} className="bg-purple-600 hover:bg-purple-700">
                  {creandoEquipamiento ? "Agregando..." : "Agregar Equipamiento"}
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
            <CardTitle className="text-sm font-medium">Total Equipamientos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEquipamientos}</div>
            <p className="text-xs text-muted-foreground">Tipos de equipamiento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockTotal}</div>
            <p className="text-xs text-muted-foreground">Unidades disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatearPrecio(valorTotal)}</div>
            <p className="text-xs text-muted-foreground">Valor total del stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equipamientosSinStock}</div>
            <p className="text-xs text-muted-foreground">Equipamientos agotados</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Equipamientos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Equipamientos</CardTitle>
          <CardDescription>Información detallada de todo el equipamiento disponible</CardDescription>
        </CardHeader>
        <CardContent>
          {!equipamientos || equipamientos.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay equipamientos registrados</h3>
              <p className="text-muted-foreground mb-4">Comienza agregando tu primer equipamiento</p>
              <Button onClick={() => setDialogAbierto(true)} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Equipamiento
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipamiento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Costo/Hora</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipamientos.map((equipamiento) => (
                    <TableRow key={equipamiento.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{equipamiento.nombre}</div>
                          <div className="text-sm text-muted-foreground">ID: {equipamiento.id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {equipamiento.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatearPrecio(equipamiento.costo)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Archive className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{equipamiento.stock}</span>
                          <span className="text-sm text-muted-foreground">unidades</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStockBadge(equipamiento.stock)}</TableCell>
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
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <AlertDialogTitle className="text-center">¡Equipamiento Agregado Exitosamente!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              El equipamiento <strong>"{equipamientoCreado}"</strong> ha sido agregado correctamente al sistema y se ha
              notificado a todos los usuarios sobre su disponibilidad.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertaExito(false)} className="bg-purple-600 hover:bg-purple-700">
              ¡Perfecto!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

