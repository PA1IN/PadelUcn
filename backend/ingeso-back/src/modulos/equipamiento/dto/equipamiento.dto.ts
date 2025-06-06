import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, Max, MinLength, MaxLength, IsIn } from 'class-validator';

export class CreateEquipamientoDto {
  @IsNotEmpty({ message: 'El tipo es requerido' })
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  @IsIn(['raqueta', 'pelota', 'zapatillas', 'muñequera', 'vincha', 'toalla'], {
    message: 'El tipo debe ser: raqueta, pelota, zapatillas, muñequera, vincha o toalla'
  })
  tipo: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @Max(1000, { message: 'El stock máximo es 1000' })
  stock: number;

  @IsNotEmpty({ message: 'El costo es requerido' })
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @Min(100, { message: 'El costo mínimo es $100' })
  @Max(50000, { message: 'El costo máximo es $50.000' })
  costo: number;
}

export class UpdateEquipamientoDto {
  @IsOptional()
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  @IsIn(['raqueta', 'pelota', 'zapatillas', 'muñequera', 'vincha', 'toalla'], {
    message: 'El tipo debe ser: raqueta, pelota, zapatillas, muñequera, vincha o toalla'
  })
  tipo?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @Max(1000, { message: 'El stock máximo es 1000' })
  stock?: number;

  @IsOptional()
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @Min(100, { message: 'El costo mínimo es $100' })
  @Max(50000, { message: 'El costo máximo es $50.000' })
  costo?: number;
}
