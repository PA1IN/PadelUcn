import { IsNotEmpty, IsString, IsNumber, IsOptional, Matches, Min, Max, MinLength } from 'class-validator';

export class CreateJugadorDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es requerido' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  apellido: string;

  @IsNotEmpty({ message: 'El RUT es requerido' })
  @IsString({ message: 'El RUT debe ser una cadena de texto' })
  @Matches(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' })
  rut: string;

  @IsNotEmpty({ message: 'La edad es requerida' })
  @IsNumber({}, { message: 'La edad debe ser un número' })
  @Min(10, { message: 'La edad mínima es 10 años' })
  @Max(80, { message: 'La edad máxima es 80 años' })
  edad: number;
}

export class UpdateJugadorDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  apellido?: string;

  @IsOptional()
  @IsString({ message: 'El RUT debe ser una cadena de texto' })
  @Matches(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' })
  rut?: string;

  @IsOptional()
  @IsNumber({}, { message: 'La edad debe ser un número' })
  @Min(10, { message: 'La edad mínima es 10 años' })
  @Max(80, { message: 'La edad máxima es 80 años' })
  edad?: number;
}
