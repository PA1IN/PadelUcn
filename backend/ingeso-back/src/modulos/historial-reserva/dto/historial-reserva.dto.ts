import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsIn } from 'class-validator';

export class CreateHistorialReservaDto {
  @IsNotEmpty({ message: 'El estado es requerido' })
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @IsIn(['pendiente', 'confirmada', 'cancelada', 'completada'], {
    message: 'El estado debe ser: pendiente, confirmada, cancelada o completada'
  })
  estado: string;

  @IsNotEmpty({ message: 'El ID de reserva es requerido' })
  @IsNumber({}, { message: 'El ID de reserva debe ser un número' })
  @Min(1, { message: 'El ID de reserva debe ser mayor a 0' })
  idReserva: number;

  @IsNotEmpty({ message: 'El ID de usuario es requerido' })
  @IsNumber({}, { message: 'El ID de usuario debe ser un número' })
  @Min(1, { message: 'El ID de usuario debe ser mayor a 0' })
  idUsuario: number;
}

export class UpdateHistorialReservaDto {
  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto' })
  @IsIn(['pendiente', 'confirmada', 'cancelada', 'completada'], {
    message: 'El estado debe ser: pendiente, confirmada, cancelada o completada'
  })
  estado?: string;
}
