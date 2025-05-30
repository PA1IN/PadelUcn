import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipamientoDto } from './create-equipamiento.dto';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateEquipamientoDto extends PartialType(CreateEquipamientoDto) {
  @IsOptional()
  @IsString({ message: 'El tipo debe ser texto' })
  tipo?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  nombre?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @Min(0, { message: 'El costo no puede ser negativo' })
  costo?: number;
}
