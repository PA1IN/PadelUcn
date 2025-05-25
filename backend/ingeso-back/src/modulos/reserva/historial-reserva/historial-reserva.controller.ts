import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HistorialReservaService } from './historial-reserva.service';
import { CreateHistorialReservaDto } from './dto/create-historial-reserva.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';

@ApiTags('historial-reservas')
@Controller('historial-reservas')
// Comentamos temporalmente la protección JWT para pruebas
// @UseGuards(JwtAuthGuard)
export class HistorialReservaController {
  constructor(private readonly historialReservaService: HistorialReservaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro de historial de reserva' })
  @SwaggerResponse({ status: 201, description: 'Historial creado exitosamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createHistorialReservaDto: CreateHistorialReservaDto) {
    return this.historialReservaService.create(createHistorialReservaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de historial de reservas' })
  @SwaggerResponse({ status: 200, description: 'Lista de historiales obtenida exitosamente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.historialReservaService.findAll();
  }

  @Get('reserva/:id')
  @ApiOperation({ summary: 'Obtener historiales de una reserva específica' })
  @SwaggerResponse({ status: 200, description: 'Historiales obtenidos exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findByReserva(@Param('id') id: string) {
    return this.historialReservaService.findByReserva(+id);
  }

  @Get('usuario/:id')
  @ApiOperation({ summary: 'Obtener historiales de un usuario específico' })
  @SwaggerResponse({ status: 200, description: 'Historiales obtenidos exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Usuario no encontrado' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findByUsuario(@Param('id') id: string) {
    return this.historialReservaService.findByUsuario(+id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un historial específico por ID' })
  @SwaggerResponse({ status: 200, description: 'Historial obtenido exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Historial no encontrado' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.historialReservaService.findOne(+id);
  }
}
