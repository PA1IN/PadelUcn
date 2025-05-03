import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBoletaEquipamientoDto {
  @IsNotEmpty()
  @IsString()
  rut_usuario: string;

  @IsNotEmpty()
  @IsNumber()
  id_reserva: number;

  @IsNotEmpty()
  @IsNumber()
  id_equipamiento: number;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;
}
