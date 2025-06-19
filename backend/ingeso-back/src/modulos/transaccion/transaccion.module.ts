import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionService } from './transaccion.service';
import { TransaccionController } from './transaccion.controller';
import { Transaccion } from './entities/transaccion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaccion]) 
  ],
  controllers: [TransaccionController],
  providers: [TransaccionService],
  exports: [TransaccionService], 
})
export class TransaccionModule {}
