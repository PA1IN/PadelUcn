import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Reserva } from './entities/reserva.entity';
import { User } from '../user/entities/user.entity';
import { Cancha } from '../canchas/entities/cancha.entity';
import { HistorialReserva } from './entities/historial-reserva.entity';
import { HistorialReservaService } from './historial-reserva/historial-reserva.service';
import { HistorialReservaController } from './historial-reserva/historial-reserva.controller';
import { BoletaEquipamiento } from '../boleta-equipamiento/entities/boleta-equipamiento.entity';
import { Equipamiento } from '../equipamiento/entities/equipamiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, HistorialReserva, Cancha, User, BoletaEquipamiento, Equipamiento])],
  controllers: [ReservaController, HistorialReservaController],
  providers: [ReservaService, HistorialReservaService],
  exports: [ReservaService, HistorialReservaService],
})
export class ReservaModule {}
