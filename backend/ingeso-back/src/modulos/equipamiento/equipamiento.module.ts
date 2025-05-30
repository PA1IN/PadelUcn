import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipamientoController } from './equipamiento.controller';
import { EquipamientoService } from './equipamiento.service';
import { Equipamiento } from './entities/equipamiento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipamiento])],
  controllers: [EquipamientoController],
  providers: [EquipamientoService],
  exports: [EquipamientoService],
})
export class EquipamientoModule {}
