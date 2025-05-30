import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaController } from './reserva.controller';
import { ReservaService } from './reserva.service';
import { Reserva } from './entities/reserva.entity';
import { HistorialReserva } from './entities/historial-reserva.entity';
import { UserModule } from '../user/user.module';
import { CanchasModule } from '../canchas/canchas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva, HistorialReserva]),
    UserModule,
    CanchasModule
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
  exports: [ReservaService],
})
export class ReservaModule {}
