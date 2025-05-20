import { IsNotEmpty, IsNumber, Min, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCanchaDto {
  @IsNotEmpty({ message: 'El número de la cancha es requerido' })
  @IsNumber({}, { message: 'El número de la cancha debe ser un valor numérico' })
  @Min(1, { message: 'El número de la cancha debe ser mayor a 0' })
  numero: number;

  @IsNotEmpty({ message: 'El nombre de la cancha es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  descripcion?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado de mantenimiento debe ser un booleano' })
  mantenimiento?: boolean;

  @IsNotEmpty({ message: 'El valor de la cancha es requerido' })
  @IsNumber({}, { message: 'El valor debe ser un valor numérico' })
  @Min(0, { message: 'El valor no puede ser negativo' })
  valor: number;
}
