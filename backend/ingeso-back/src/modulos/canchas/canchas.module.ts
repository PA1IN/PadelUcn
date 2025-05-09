import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CanchasService } from './canchas.service';
import { CanchasController } from './canchas.controller';
import { Cancha } from './entities/cancha.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cancha])],
  controllers: [CanchasController],
  providers: [CanchasService],
  exports: [CanchasService],
})
export class CanchasModule {}
