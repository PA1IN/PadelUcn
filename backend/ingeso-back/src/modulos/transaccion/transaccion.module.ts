import { Module } from '@nestjs/common';
import { TransaccionService } from './transaccion.service';
import { TransaccionController } from './transaccion.controller';

@Module({
  controllers: [TransaccionController],
  providers: [TransaccionService],
})
export class TransaccionModule {}
