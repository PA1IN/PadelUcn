import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BoletaEquipamientoService } from './boleta-equipamiento.service';
import { CreateBoletaEquipamientoDto } from './dto/create-boleta-equipamiento.dto';
import { UpdateBoletaEquipamientoDto } from './dto/update-boleta-equipamiento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';

@ApiTags('boleta-equipamiento')
@Controller('boleta-equipamiento')
@UseGuards(JwtAuthGuard)
export class BoletaEquipamientoController {
  constructor(private readonly boletaEquipamientoService: BoletaEquipamientoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva boleta de equipamiento' })
  @SwaggerResponse({ status: 201, description: 'Boleta creada exitosamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o stock/saldo insuficiente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createBoletaEquipamientoDto: CreateBoletaEquipamientoDto) {
    return this.boletaEquipamientoService.create(createBoletaEquipamientoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las boletas de equipamiento' })
  @SwaggerResponse({ status: 200, description: 'Lista de boletas obtenida exitosamente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.boletaEquipamientoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una boleta de equipamiento por su ID' })
  @SwaggerResponse({ status: 200, description: 'Boleta obtenida exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Boleta no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.boletaEquipamientoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una boleta de equipamiento existente' })
  @SwaggerResponse({ status: 200, description: 'Boleta actualizada exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Boleta no encontrada' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o stock/saldo insuficiente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  update(@Param('id') id: string, @Body() updateBoletaEquipamientoDto: UpdateBoletaEquipamientoDto) {
    return this.boletaEquipamientoService.update(+id, updateBoletaEquipamientoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una boleta de equipamiento' })
  @SwaggerResponse({ status: 200, description: 'Boleta eliminada exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Boleta no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.boletaEquipamientoService.remove(+id);
  }

  @Get('reserva/:id')
  @ApiOperation({ summary: 'Obtener todas las boletas de equipamiento de una reserva' })
  @SwaggerResponse({ status: 200, description: 'Lista de boletas obtenida exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findByReserva(@Param('id') id: string) {
    return this.boletaEquipamientoService.findByReserva(+id);
  }
}
