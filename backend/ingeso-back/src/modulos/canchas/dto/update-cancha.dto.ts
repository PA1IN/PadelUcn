import { PartialType } from '@nestjs/mapped-types';
import { CreateCanchaDto } from './create-cancha.dto';
import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class UpdateCanchaDto extends PartialType(CreateCanchaDto) {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado de mantenimiento debe ser booleano' })
  mantenimiento?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'El valor debe ser un número' })
  valor?: number;
}
