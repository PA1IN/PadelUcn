import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservaService } from './reserva.service';
import { ReservaController } from './reserva.controller';
import { Reserva } from './entities/reserva.entity';
import { HistorialReservaModule } from '../historial-reserva/historial-reserva.module';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Cancha } from '../cancha/entities/cancha.entity';
import { BoletaEquipamiento } from '../boleta-equipamiento/entities/boleta-equipamiento.entity';
import { Equipamiento } from '../equipamiento/entities/equipamiento.entity';
import { Jugador } from '../jugador/entities/jugador.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reserva, 
      Usuario, 
      Cancha, 
      BoletaEquipamiento, 
      Equipamiento, 
      Jugador
    ]),
    HistorialReservaModule
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
  exports: [ReservaService]
})
export class ReservaModule {}
