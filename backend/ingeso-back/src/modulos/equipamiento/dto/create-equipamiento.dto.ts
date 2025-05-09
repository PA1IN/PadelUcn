import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEquipamientoDto {
  @IsNotEmpty()
  @IsString()
  tipo: string;

  @IsNotEmpty()
  @IsNumber()
  costo: number;

  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
