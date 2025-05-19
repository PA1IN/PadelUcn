import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBoletaEquipamientoDto {
  @IsNotEmpty()
  @IsNumber()
  id_reserva: number;

  @IsNotEmpty()
  @IsNumber()
  id_equipamiento: number;

  @IsNotEmpty()
  @IsNumber()
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  monto_total: number;
}
