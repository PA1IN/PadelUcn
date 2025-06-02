import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateEquipamientoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsNumber()
  @IsNotEmpty()
  costo: number;
}
