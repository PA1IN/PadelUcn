import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reservas')
@Controller(['reservas', 'reserva']) // Aceptar tanto 'reservas' como 'reserva' como rutas
// Comentamos temporalmente la protección JWT para pruebas
// @UseGuards(JwtAuthGuard) // Protegemos todas las rutas con JWT
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reserva de cancha' })
  @SwaggerResponse({ status: 201, description: 'Reserva creada exitosamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o cancha no disponible' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservaService.create(createReservaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reservas' })
  @SwaggerResponse({ status: 200, description: 'Lista de reservas obtenida exitosamente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.reservaService.findAll();
  }

  @Get('usuario/:rut')
  @ApiOperation({ summary: 'Obtener reservas de un usuario por su RUT' })
  @SwaggerResponse({ status: 200, description: 'Reservas del usuario obtenidas exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Usuario no encontrado' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findByUsuario(@Param('rut') rut: string) {
    return this.reservaService.findByUsuario(rut);
  }

  @Get('cancha/:numero')
  @ApiOperation({ summary: 'Obtener reservas de una cancha por su número' })
  @SwaggerResponse({ status: 200, description: 'Reservas de la cancha obtenidas exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Cancha no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findByCancha(@Param('numero') numero: string) {
    return this.reservaService.findByCancha(+numero);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reserva por su ID' })
  @SwaggerResponse({ status: 200, description: 'Reserva obtenida exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.reservaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una reserva existente' })
  @SwaggerResponse({ status: 200, description: 'Reserva actualizada exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservaService.update(+id, updateReservaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar/Eliminar una reserva' })
  @SwaggerResponse({ status: 200, description: 'Reserva eliminada exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.reservaService.remove(+id);
  }

  @Get('disponibilidad/:numero/:fecha/:horaInicio/:horaTermino')
  @ApiOperation({ summary: 'Verificar disponibilidad de una cancha en un horario específico' })
  @SwaggerResponse({ status: 200, description: 'Disponibilidad verificada' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  verificarDisponibilidad(
    @Param('numero') numero: string,
    @Param('fecha') fecha: string,
    @Param('horaInicio') horaInicio: string,
    @Param('horaTermino') horaTermino: string,
  ) {
    return this.reservaService.verificarDisponibilidad(+numero, fecha, horaInicio, horaTermino);
  }

  @Get('disponibilidad-dia/:numero/:fecha')
  @ApiOperation({ summary: 'Obtener todos los horarios disponibles de una cancha en un día' })
  @SwaggerResponse({ status: 200, description: 'Horarios disponibles obtenidos exitosamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  obtenerHorariosDisponibles(
    @Param('numero') numero: string,
    @Param('fecha') fecha: string
  ) {
    return this.reservaService.obtenerHorariosDisponibles(+numero, fecha);
  }
  @Get('estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas de uso de canchas' })
  @SwaggerResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  obtenerEstadisticas() {
    return this.reservaService.obtenerEstadisticas();
  }

  @Patch(':id/pago')
  @ApiOperation({ summary: 'Actualizar estado de pago de una reserva' })
  @SwaggerResponse({ status: 200, description: 'Estado de pago actualizado exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  // En producción debería estar protegido con @UseGuards(JwtAuthGuard)
  actualizarPago(@Param('id') id: string, @Body() updatePagoDto: UpdatePagoDto) {
    return this.reservaService.updatePago(+id, updatePagoDto.pagado);
  }

  @Get(':id/marcar-como-pagado')
  @ApiOperation({ summary: 'Marcar reserva como pagada (endpoint de conveniencia)' })
  @SwaggerResponse({ status: 200, description: 'Reserva marcada como pagada exitosamente' })
  @SwaggerResponse({ status: 404, description: 'Reserva no encontrada' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  // En producción debería estar protegido con @UseGuards(JwtAuthGuard)
  marcarComoPagado(@Param('id') id: string) {
    return this.reservaService.updatePago(+id, true);
  }
}
