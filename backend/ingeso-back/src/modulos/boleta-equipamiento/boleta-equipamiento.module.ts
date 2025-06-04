import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletaEquipamientoService } from './boleta-equipamiento.service';
import { BoletaEquipamientoController } from './boleta-equipamiento.controller';
import { BoletaEquipamiento } from './entities/boleta-equipamiento.entity';
import { EquipamientoModule } from '../equipamiento/equipamiento.module';
import { Reserva } from '../reserva/entities/reserva.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoletaEquipamiento, Reserva]),
    EquipamientoModule, // Importar el módulo de equipamiento para usar su servicio
  ],
  controllers: [BoletaEquipamientoController],
  providers: [BoletaEquipamientoService],
  exports: [BoletaEquipamientoService],
})
export class BoletaEquipamientoModule {}
