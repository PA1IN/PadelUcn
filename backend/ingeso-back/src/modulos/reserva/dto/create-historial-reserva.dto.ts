import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateHistorialReservaDto {
  @IsNotEmpty({ message: 'El estado es requerido' })
  @IsString({ message: 'El estado debe ser texto' })
  estado: string;

  @IsNotEmpty({ message: 'El ID de la reserva es requerido' })
  @IsInt({ message: 'El ID de la reserva debe ser un número entero' })
  @Type(() => Number)
  reservaId: number;

  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @Type(() => Number)
  usuarioId: number;
}
