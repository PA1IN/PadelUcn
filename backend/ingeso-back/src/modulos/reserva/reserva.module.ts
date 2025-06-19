import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Reserva } from './entities/reserva.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Cancha } from '../cancha/entities/cancha.entity';
import { BoletaEquipamiento } from '../boleta-equipamiento/entities/boleta-equipamiento.entity';
import { Equipamiento } from '../equipamiento/entities/equipamiento.entity';
import { Jugador } from '../jugador/entities/jugador.entity';
import { HistorialReservaService } from '../historial-reserva/historial-reserva.service';
import { HistorialReserva } from '../historial-reserva/entities/historial-reserva.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { Notificacion } from '../notificaciones/entities/notificacione.entity';
import { TransaccionModule } from '../transaccion/transaccion.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reserva,
      Usuario,
      Cancha,
      BoletaEquipamiento,
      Equipamiento,
      Jugador,
      HistorialReserva,
      Notificacion,
      
    ]),
    TransaccionModule, 
  ],
  controllers: [ReservaController],
  providers: [
    ReservaService,
    HistorialReservaService,
    NotificacionesService,
    
  ],
  exports: [ReservaService],
})
export class ReservaModule {}
