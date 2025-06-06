import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialReservaService } from './historial-reserva.service';
import { HistorialReserva } from './entities/historial-reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialReserva])],
  providers: [HistorialReservaService],
  exports: [HistorialReservaService],
})
export class HistorialReservaModule {}
