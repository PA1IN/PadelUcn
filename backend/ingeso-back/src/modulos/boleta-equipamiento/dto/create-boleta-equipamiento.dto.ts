import { IsNotEmpty, IsInt, Min, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBoletaEquipamientoDto {
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  @Type(() => Number)
  cantidad: number;

  @IsNotEmpty({ message: 'El ID de la reserva es requerido' })
  @IsInt({ message: 'El ID de la reserva debe ser un número entero' })
  @Type(() => Number)
  reservaId: number;

  @IsNotEmpty({ message: 'El ID del equipamiento es requerido' })
  @IsInt({ message: 'El ID del equipamiento debe ser un número entero' })
  @Type(() => Number)
  equipamientoId: number;
}
