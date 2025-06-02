import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateBoletaEquipamientoDto {
  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  monto_total: number;

  @IsNumber()
  @IsNotEmpty()
  id_reserva: number;

  @IsNumber()
  @IsNotEmpty()
  id_equipamiento: number;
}
