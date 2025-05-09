import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReservaDto {
  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  hora_inicio: string;

  @IsNotEmpty()
  @IsString()
  hora_termino: string;

  @IsNotEmpty()
  @IsString()
  rut_usuario: string;

  @IsNotEmpty()
  @IsNumber()
  numero_cancha: number;

  @IsOptional()
  @IsNumber()
  id_admin?: number;
}
