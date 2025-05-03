import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletaEquipamientoService } from './boleta-equipamiento.service';
import { BoletaEquipamientoController } from './boleta-equipamiento.controller';
import { BoletaEquipamiento } from './entities/boleta-equipamiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoletaEquipamiento])],
  controllers: [BoletaEquipamientoController],
  providers: [BoletaEquipamientoService],
  exports: [BoletaEquipamientoService],
})
export class BoletaEquipamientoModule {}
