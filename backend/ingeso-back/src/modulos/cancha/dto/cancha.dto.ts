import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, Min, Max, MinLength, MaxLength } from 'class-validator';

export class CreateCanchaDto {
  @IsNotEmpty({ message: 'El número de cancha es requerido' })
  @IsNumber({}, { message: 'El número debe ser un número' })
  @Min(1, { message: 'El número de cancha debe ser mayor a 0' })
  @Max(20, { message: 'El número de cancha no puede ser mayor a 20' })
  numero: number;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(200, { message: 'La descripción no puede tener más de 200 caracteres' })
  descripcion: string;

  @IsNotEmpty({ message: 'El valor es requerido' })
  @IsNumber({}, { message: 'El valor debe ser un número' })
  @Min(5000, { message: 'El valor mínimo es $5.000' })
  @Max(50000, { message: 'El valor máximo es $50.000' })
  valor: number;

  @IsNotEmpty({ message: 'El estado de mantenimiento es requerido' })
  @IsBoolean({ message: 'El mantenimiento debe ser un valor booleano' })
  mantenimiento: boolean;
}

export class UpdateCanchaDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(200, { message: 'La descripción no puede tener más de 200 caracteres' })
  descripcion?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El valor debe ser un número' })
  @Min(5000, { message: 'El valor mínimo es $5.000' })
  @Max(50000, { message: 'El valor máximo es $50.000' })
  valor?: number;

  @IsOptional()
  @IsBoolean({ message: 'El mantenimiento debe ser un valor booleano' })
  mantenimiento?: boolean;
}
