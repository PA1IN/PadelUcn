import { IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateBoletaEquipamientoDto {
  @IsNotEmpty({ message: 'El ID de reserva es requerido' })
  @IsNumber({}, { message: 'El ID de reserva debe ser un número' })
  @Min(1, { message: 'El ID de reserva debe ser mayor a 0' })
  id_reserva: number;

  @IsNotEmpty({ message: 'El ID de equipamiento es requerido' })
  @IsNumber({}, { message: 'El ID de equipamiento debe ser un número' })
  @Min(1, { message: 'El ID de equipamiento debe ser mayor a 0' })
  id_equipamiento: number;

  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  @Max(10, { message: 'La cantidad máxima es 10' })
  cantidad: number;
}

export class UpdateBoletaEquipamientoDto {
  @IsOptional()
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  @Max(10, { message: 'La cantidad máxima es 10' })
  cantidad?: number;
}
