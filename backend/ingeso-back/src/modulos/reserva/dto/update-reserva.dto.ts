import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateReservaDto } from './create-reserva.dto';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
  @IsOptional()
  @IsNumber()
  numero_cancha?: number;
}
