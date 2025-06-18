import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NotificacionesService, CrearNotificacionDto } from './notificaciones.service'; // ✅ IMPORTAR DTO
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notificaciones')
@UseGuards(JwtAuthGuard)
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  // ✅ CREAR NOTIFICACIÓN - CORREGIDO
  @Post()
  async create(@Body() createNotificacionDto: CrearNotificacionDto) {
    return await this.notificacionesService.create(createNotificacionDto);
  }

  // ✅ OBTENER NOTIFICACIONES NO VISTAS (ENDPOINT PRINCIPAL)
  @Get('no-vistas/:idUsuario')
  async getNotificacionesNoVistas(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return await this.notificacionesService.getNotificacionesNoVistas(idUsuario);
  }

  // ✅ OBTENER HISTORIAL COMPLETO
  @Get('historial/:idUsuario')
  async getHistorialUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return await this.notificacionesService.getHistorialUsuario(idUsuario);
  }

  // ✅ CONTAR NO VISTAS
  @Get('count/:idUsuario')
  async contarNoVistas(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return await this.notificacionesService.contarNoVistas(idUsuario);
  }

  // ✅ MARCAR COMO LEÍDA
  @Patch('marcar-leida/:idNotificacion')
  async marcarComoLeida(@Param('idNotificacion', ParseIntPipe) idNotificacion: number) {
    return await this.notificacionesService.marcarComoLeida(idNotificacion);
  }

  // ✅ MARCAR TODAS COMO LEÍDAS
  @Patch('marcar-todas-leidas/:idUsuario')
  async marcarTodasComoLeidas(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return await this.notificacionesService.marcarTodasComoLeidas(idUsuario);
  }

  /*
  @Get('estadisticas/:idUsuario')
  async getEstadisticasUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    return await this.notificacionesService.getEstadisticasUsuario(idUsuario);
  }*/
}
