import { IsNotEmpty, IsBoolean, IsString, IsNumber, IsOptional, IsArray, ValidateNested, Matches, IsDateString, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateJugadorDto } from '../../jugador/dto/jugador.dto';

export class EquipamientoReservaDto {
  @IsNotEmpty({ message: 'El ID del equipamiento es requerido' })
  @IsNumber({}, { message: 'El ID debe ser un número' })
  id: number; 

  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  @Max(10, { message: 'La cantidad máxima es 10' })
  cantidad: number;

   @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre?: string;

  
  @IsOptional()
  @IsNumber({}, { message: 'El costo debe ser un número' })
  costo?: number; 
}

export class CreateReservaDto {
  @IsNotEmpty({ message: 'La fecha es requerida' })
  @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
  fecha: string;

  @IsNotEmpty({ message: 'La hora de inicio es requerida' })
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de inicio debe tener formato HH:MM' })
  hora_inicio: string;

  @IsNotEmpty({ message: 'La hora de término es requerida' })
  @IsString({ message: 'La hora de término debe ser una cadena de texto' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de término debe tener formato HH:MM' })
  hora_termino: string;

  @IsNotEmpty({ message: 'El RUT del usuario es requerido' })
  @IsString({ message: 'El RUT debe ser una cadena de texto' })
  @Matches(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' })
  rut_usuario: string;

  @IsNotEmpty({ message: 'El número de cancha es requerido' })
  @IsNumber({}, { message: 'El número de cancha debe ser un número' })
  @Min(1, { message: 'El número de cancha debe ser mayor a 0' })
  numero_cancha: number;

  @IsOptional()
  @IsArray({ message: 'Los jugadores deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => CreateJugadorDto)
  jugadores?: CreateJugadorDto[];

  @IsOptional()
  @IsArray({ message: 'El equipamiento debe ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => EquipamientoReservaDto)
  equipamiento?: EquipamientoReservaDto[];
}

export class UpdateReservaDto {
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
  fecha?: string;

  @IsOptional()
  @IsString({ message: 'La hora de inicio debe ser una cadena de texto' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de inicio debe tener formato HH:MM' })
  hora_inicio?: string;

  @IsOptional()
  @IsString({ message: 'La hora de término debe ser una cadena de texto' })
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de término debe tener formato HH:MM' })
  hora_termino?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El número de cancha debe ser un número' })
  @Min(1, { message: 'El número de cancha debe ser mayor a 0' })
  numero_cancha?: number;

  @IsOptional()
  @IsArray({ message: 'El equipamiento debe ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => EquipamientoReservaDto)
  equipamiento?: EquipamientoReservaDto[];

  @IsBoolean()
  @IsOptional()
  existe?: boolean;

  @IsOptional()
  @IsArray()
  jugadores?: Array<{
    nombre: string;
    apellido: string;
    rut: string;
    edad: number;
  }>;
}
