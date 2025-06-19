import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './entities/usuario.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { Notificacion } from '../notificaciones/entities/notificacione.entity';
import { ReservaService } from '../reserva/reserva.service';
import { Reserva } from '../reserva/entities/reserva.entity';
import { Cancha } from '../cancha/entities/cancha.entity';
import { BoletaEquipamiento } from '../boleta-equipamiento/entities/boleta-equipamiento.entity'; 
import { Equipamiento } from '../equipamiento/entities/equipamiento.entity'; 
import { Jugador } from '../jugador/entities/jugador.entity'; 
import { HistorialReserva } from '../historial-reserva/entities/historial-reserva.entity'; 
import { HistorialReservaService } from '../historial-reserva/historial-reserva.service'; 
import { EquipamientoModule } from '../equipamiento/equipamiento.module';
import { CanchaService } from '../cancha/cancha.service'; 
import { EquipamientoService } from '../equipamiento/equipamiento.service';
import { TransaccionService } from '../transaccion/transaccion.service';
import { Transaccion } from '../transaccion/entities/transaccion.entity';
import { TransaccionModule } from '../transaccion/transaccion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Notificacion,
      Reserva,
      Cancha,
      BoletaEquipamiento,
      Equipamiento,      
      Jugador,          
      HistorialReserva,
    ]), 
    EquipamientoModule,
    TransaccionModule,
  ],
  controllers: [UsuarioController],
  providers: [
    UsuarioService, 
    NotificacionesService, 
    ReservaService,
    HistorialReservaService,
    CanchaService, 
    EquipamientoService,
  ], 
  exports: [UsuarioService], 
})
export class UsuarioModule {}