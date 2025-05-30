import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoletaEquipamientoController } from './boleta-equipamiento.controller';
import { BoletaEquipamientoService } from './boleta-equipamiento.service';
import { BoletaEquipamiento } from './entities/boleta-equipamiento.entity';
import { ReservaModule } from '../reserva/reserva.module';
import { EquipamientoModule } from '../equipamiento/equipamiento.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoletaEquipamiento]),
    ReservaModule,
    EquipamientoModule,
    UserModule
  ],
  controllers: [BoletaEquipamientoController],
  providers: [BoletaEquipamientoService],
  exports: [BoletaEquipamientoService],
})
export class BoletaEquipamientoModule {}
