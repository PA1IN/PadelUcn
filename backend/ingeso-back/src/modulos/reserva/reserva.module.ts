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

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, HistorialReserva, Cancha, User])],
  controllers: [ReservaController, HistorialReservaController],
  providers: [ReservaService, HistorialReservaService],
  exports: [ReservaService, HistorialReservaService],
})
export class ReservaModule {}
