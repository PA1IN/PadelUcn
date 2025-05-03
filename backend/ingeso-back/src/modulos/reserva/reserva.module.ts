import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Reserva } from './entities/reserva.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  controllers: [ReservaController],
  providers: [ReservaService],
  exports: [ReservaService],
})
export class ReservaModule {}
