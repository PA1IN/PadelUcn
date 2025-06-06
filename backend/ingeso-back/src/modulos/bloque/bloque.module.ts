import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloqueService } from './bloque.service';
import { BloqueController } from './bloque.controller';
import { Bloque } from './entities/bloque.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bloque])],
  controllers: [BloqueController],
  providers: [BloqueService],
  exports: [BloqueService]
})
export class BloqueModule {}
