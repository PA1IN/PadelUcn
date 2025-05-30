import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateEquipamientoDto {
  @IsNotEmpty({ message: 'El tipo de equipamiento es requerido' })
  @IsString({ message: 'El tipo debe ser texto' })
  tipo: string;

  @IsNotEmpty({ message: 'El nombre del equipamiento es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  nombre: string;

  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @IsNotEmpty({ message: 'El costo es requerido' })
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @Min(0, { message: 'El costo no puede ser negativo' })
  costo: number;
}
