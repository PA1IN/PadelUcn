import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { Notificacion } from './entities/notificacione.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Reserva } from '../reserva/entities/reserva.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notificacion, Usuario, Reserva])
  ],
  controllers: [NotificacionesController],
  providers: [NotificacionesService],
  exports: [NotificacionesService]
})
export class NotificacionesModule {}
