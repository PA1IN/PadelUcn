import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateBoletaEquipamientoDto } from './create-boleta-equipamiento.dto';

export class UpdateBoletaEquipamientoDto extends PartialType(CreateBoletaEquipamientoDto) {
  @IsNumber()
  @IsOptional()
  cantidad?: number;

  @IsNumber()
  @IsOptional()
  monto_total?: number;

  @IsNumber()
  @IsOptional()
  id_reserva?: number;

  @IsNumber()
  @IsOptional()
  id_equipamiento?: number;
}
