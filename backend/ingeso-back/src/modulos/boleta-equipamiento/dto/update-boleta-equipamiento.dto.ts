import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBoletaEquipamientoDto {
  @IsNumber()
  @IsOptional()
  cantidad?: number;

  @IsNumber()
  @IsOptional()
  monto_total?: number;

  @IsNumber()
  @IsOptional()
  id_reserva?: number;

  @IsNumber()
  @IsOptional()
  id_equipamiento?: number;
}
