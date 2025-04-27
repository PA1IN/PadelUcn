import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCanchaDto {
  @IsNotEmpty({ message: 'El número de la cancha es requerido' })
  @IsNumber({}, { message: 'El número de la cancha debe ser un valor numérico' })
  @Min(1, { message: 'El número de la cancha debe ser mayor a 0' })
  numero: number;

  @IsNotEmpty({ message: 'El costo de la cancha es requerido' })
  @IsNumber({}, { message: 'El costo debe ser un valor numérico' })
  @Min(0, { message: 'El costo no puede ser negativo' })
  costo: number;
}
