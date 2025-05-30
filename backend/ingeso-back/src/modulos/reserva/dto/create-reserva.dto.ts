import { IsNotEmpty, IsString, IsDate, IsDateString, IsNumber, IsOptional, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservaDto {
  @IsNotEmpty({ message: 'La fecha de la reserva es requerida' })
  @IsDateString({}, { message: 'Formato de fecha inválido, use YYYY-MM-DD' })
  fecha: string;

  @IsNotEmpty({ message: 'La hora de inicio es requerida' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Formato de hora inválido, use HH:MM:SS',
  })
  horaInicio: string;

  @IsNotEmpty({ message: 'La hora de término es requerida' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Formato de hora inválido, use HH:MM:SS',
  })
  horaTermino: string;

  @IsNotEmpty({ message: 'El ID de la cancha es requerido' })
  @IsNumber({}, { message: 'El ID de la cancha debe ser un número' })
  @Type(() => Number)
  canchaId: number;

  @IsOptional()
  @IsNumber({}, { message: 'El ID del usuario debe ser un número' })
  @Type(() => Number)
  usuarioId?: number;

  @IsOptional()
  @IsString({ message: 'El RUT del usuario debe ser texto' })
  rutUsuario?: string;
}
