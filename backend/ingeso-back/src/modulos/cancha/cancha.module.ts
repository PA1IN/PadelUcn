import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanchaService } from './cancha.service';
import { CanchaController } from './cancha.controller';
import { Cancha } from './entities/cancha.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cancha])],
  controllers: [CanchaController],
  providers: [CanchaService],
  exports: [CanchaService],
})
export class CanchaModule {}