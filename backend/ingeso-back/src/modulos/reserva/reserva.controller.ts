import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';

@ApiTags('reservas')
@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear una nueva reserva' })
  @SwaggerResponse({ status: 201, description: 'Reserva creada exitosamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o conflictos de horario' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createReservaDto: CreateReservaDto, @Request() req) {
    // El ID de usuario viene del token JWT
    return this.reservaService.create(createReservaDto, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todas las reservas' })
  @SwaggerResponse({ status: 200, description: 'Lista de reservas obtenida exitosamente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.reservaService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener una reserva por su ID' })
  @SwaggerResponse({ status: 200, description: 'Reserva obtenida exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.reservaService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar una reserva existente' })
  @SwaggerResponse({ status: 200, description: 'Reserva actualizada exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o conflictos de horario' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto, @Request() req) {
    return this.reservaService.update(+id, updateReservaDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancelar una reserva' })
  @SwaggerResponse({ status: 200, description: 'Reserva cancelada exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string, @Request() req) {
    return this.reservaService.cancelar(+id, req.user.id);
  }

  @Get('usuario/:rut')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todas las reservas de un usuario' })
  @SwaggerResponse({ status: 200, description: 'Lista de reservas obtenida exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Usuario no encontrado' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findByUsuario(@Param('rut') rut: string) {
    return this.reservaService.findByUsuario(rut);
  }

  @Get('cancha/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener todas las reservas de una cancha' })
  @SwaggerResponse({ status: 200, description: 'Lista de reservas obtenida exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Cancha no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findByCancha(@Param('id') id: string) {
    return this.reservaService.findByCancha(+id);
  }

  @Get('disponibilidad/:numero/:fecha/:horaInicio/:horaTermino')
  @ApiOperation({ summary: 'Verificar disponibilidad de una cancha en un horario específico' })
  @SwaggerResponse({ status: 200, description: 'Disponibilidad verificada exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Cancha no encontrada' })
  verificarDisponibilidad(
    @Param('numero') numero: string,
    @Param('fecha') fecha: string,
    @Param('horaInicio') horaInicio: string,
    @Param('horaTermino') horaTermino: string
  ) {
    return this.reservaService.verificarDisponibilidad(+numero, fecha, horaInicio, horaTermino);
  }

  @Get('disponibilidad-dia/:numero/:fecha')
  @ApiOperation({ summary: 'Obtener todos los horarios disponibles de una cancha en una fecha' })
  @SwaggerResponse({ status: 200, description: 'Horarios disponibles obtenidos exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Cancha no encontrada' })
  obtenerHorariosDisponibles(
    @Param('numero') numero: string,
    @Param('fecha') fecha: string
  ) {
    return this.reservaService.obtenerHorariosDisponibles(+numero, fecha);
  }

  @Get('historial/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener el historial de una reserva' })
  @SwaggerResponse({ status: 200, description: 'Historial obtenido exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  obtenerHistorial(@Param('id') id: string) {
    return this.reservaService.obtenerHistorial(+id);
  }
  @Get('estadisticas')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Obtener estadísticas de uso de las canchas (solo administradores)' })
  @SwaggerResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  @SwaggerResponse({ status: 403, description: 'Permisos insuficientes' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  obtenerEstadisticas() {
    return this.reservaService.obtenerEstadisticas();
  }
}
