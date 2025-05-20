import { IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateHistorialReservaDto {
  @IsNotEmpty()
  @IsEnum(['Cancelado', 'Modificado', 'Completado', 'Pendiente'], {
    message: 'El estado debe ser: Cancelado, Modificado, Completado o Pendiente'
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
