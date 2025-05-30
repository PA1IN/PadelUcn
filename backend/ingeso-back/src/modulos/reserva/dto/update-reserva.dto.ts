import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './create-reserva.dto';
import { IsOptional, IsDateString, Matches, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
  @IsOptional()
  @IsDateString({}, { message: 'Formato de fecha inválido, use YYYY-MM-DD' })
  fecha?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Formato de hora inválido, use HH:MM:SS',
  })
  horaInicio?: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'Formato de hora inválido, use HH:MM:SS',
  })
  horaTermino?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El ID de la cancha debe ser un número' })
  @Type(() => Number)
  canchaId?: number;
}
