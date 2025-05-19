import { IsDateString, IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

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
  @IsNumber()
  id_usuario: number;

  @IsNotEmpty()
  @IsNumber()
  id_cancha: number;
  
  @IsOptional()
  @IsNumber()
  precio?: number;
  
  @IsOptional()
  @IsBoolean()
  pagado?: boolean;
}
