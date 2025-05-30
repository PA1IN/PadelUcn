import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EquipamientoService } from './equipamiento.service';
import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';

@ApiTags('equipamiento')
@Controller('equipamiento')
export class EquipamientoController {
  constructor(private readonly equipamientoService: EquipamientoService) {}
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Crear un nuevo equipamiento (solo administradores)' })
  @SwaggerResponse({ status: 201, description: 'Equipamiento creado exitosamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  @SwaggerResponse({ status: 403, description: 'Permisos insuficientes' })
  create(@Body() createEquipamientoDto: CreateEquipamientoDto) {
    return this.equipamientoService.create(createEquipamientoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los equipamientos' })
  @SwaggerResponse({ status: 200, description: 'Lista de equipamientos obtenida exitosamente' })
  findAll() {
    return this.equipamientoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un equipamiento por su ID' })
  @SwaggerResponse({ status: 200, description: 'Equipamiento obtenido exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Equipamiento no encontrado' })
  findOne(@Param('id') id: string) {
    return this.equipamientoService.findOne(+id);
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Actualizar un equipamiento existente (solo administradores)' })
  @SwaggerResponse({ status: 200, description: 'Equipamiento actualizado exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Equipamiento no encontrado' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  @SwaggerResponse({ status: 403, description: 'Permisos insuficientes' })
  update(@Param('id') id: string, @Body() updateEquipamientoDto: UpdateEquipamientoDto) {
    return this.equipamientoService.update(+id, updateEquipamientoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Eliminar un equipamiento (solo administradores)' })
  @SwaggerResponse({ status: 200, description: 'Equipamiento eliminado exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Equipamiento no encontrado' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  @SwaggerResponse({ status: 403, description: 'Permisos insuficientes' })
  remove(@Param('id') id: string) {
    return this.equipamientoService.remove(+id);
  }

  @Patch(':id/stock/:cantidad')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Actualizar stock de equipamiento (solo administradores)' })
  @SwaggerResponse({ status: 200, description: 'Stock de equipamiento actualizado exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Equipamiento no encontrado' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o stock insuficiente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  @SwaggerResponse({ status: 403, description: 'Permisos insuficientes' })
  updateStock(@Param('id') id: string, @Param('cantidad') cantidad: string) {
    return this.equipamientoService.updateStock(+id, +cantidad);
  }
}
