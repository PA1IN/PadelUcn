import { IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateHistorialReservaDto {
  @IsNotEmpty()
  @IsEnum(['Cancelado', 'Modificado', 'Completado', 'Pendiente', 'PAGADO', 'NO_PAGADO'], {
    message: 'El estado debe ser: Cancelado, Modificado, Completado, Pendiente, PAGADO o NO_PAGADO'
  })
  estado: string;
  
  @IsOptional()
  @IsDate()
  fechaEstado?: Date;
  
  @IsNotEmpty()
  @IsNumber()
  idReserva: number;
  
  @IsNotEmpty()
  @IsNumber()
  idUsuario: number;
}
