import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { UpdateNotificacioneDto } from './dto/update-notificacione.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('notificaciones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  //historial de notificaciones
  @Get('historial/:idUsuario')
  @Roles('admin', 'user')
  getHistorial(@Param('idUsuario') idUsuario: string) {
    return this.notificacionesService.getHistorialUsuario(+idUsuario);
  }

  // notificaciones leidas
  @Get('no-leidas/:idUsuario')
  @Roles('admin', 'user')
  getNoLeidas(@Param('idUsuario') idUsuario: string) {
    return this.notificacionesService.getNotificacionesNoLeidas(+idUsuario);
  }

  //Marca la notificación como leida
  @Patch(':id/marcar-leida')
  @Roles('admin', 'user')
  marcarComoLeida(@Param('id') id: string) {
    return this.notificacionesService.marcarComoLeida(+id);
  }

  //marca todas como leidas
  @Patch('marcar-todas-leidas/:idUsuario')
  @Roles('admin', 'user')
  marcarTodasComoLeidas(@Param('idUsuario') idUsuario: string) {
    return this.notificacionesService.marcarTodasComoLeidas(+idUsuario);
  }

  //elimina la notificacion del historial
  @Delete(':id')
  @Roles('admin', 'user')
  eliminarDelHistorial(@Param('id') id: string) {
    return this.notificacionesService.eliminarNotificacion(+id);
  }

  //crear notificaciones (admin)
  @Post()
  @Roles('admin')
  create(@Body() createNotificacioneDto: CreateNotificacioneDto) {
    return this.notificacionesService.create(createNotificacioneDto);
  }

  // estadisticas (en desarollo)
  @Get('estadisticas/:idUsuario')
  @Roles('admin', 'user')
  getEstadisticas(@Param('idUsuario') idUsuario: string) {
    return this.notificacionesService.getEstadisticasUsuario(+idUsuario);
  }
}
