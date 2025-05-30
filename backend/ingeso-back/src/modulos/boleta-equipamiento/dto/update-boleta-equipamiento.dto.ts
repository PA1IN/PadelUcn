import { PartialType } from '@nestjs/mapped-types';
import { CreateBoletaEquipamientoDto } from './create-boleta-equipamiento.dto';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateBoletaEquipamientoDto extends PartialType(CreateBoletaEquipamientoDto) {
  @IsOptional()
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  @Type(() => Number)
  cantidad?: number;
}
