import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsDateString,IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateReservaDto } from './create-reserva.dto';


class EquipamientoDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  cantidad?:number;

}

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  hora_inicio?: string;

  @IsOptional()
  @IsString()
  hora_termino?: string;
  
  @IsOptional()
  @IsNumber()
  numero_cancha?: number;

  @IsOptional()
  @IsArray()
  equipamiento?: {id: number, cantidad?:number} [];

}
