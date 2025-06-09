import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JugadorController } from './jugador.controller';
import { JugadorService } from './jugador.service';
import { Jugador } from './entities/jugador.entity';
import { Reserva } from '../reserva/entities/reserva.entity';
import { Cancha } from '../cancha/entities/cancha.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jugador, Reserva, Cancha])
  ],
  controllers: [JugadorController],
  providers: [JugadorService],
  exports: [JugadorService]
})
export class JugadorModule {}