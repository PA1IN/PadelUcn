import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateCanchaDto {
  @IsNotEmpty({ message: 'El número de la cancha es requerido' })
  @IsNumber({}, { message: 'El número debe ser un valor numérico' })
  numero: number;

  @IsNotEmpty({ message: 'El nombre de la cancha es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser texto' })
  descripcion?: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado de mantenimiento debe ser booleano' })
  mantenimiento?: boolean;

  @IsNotEmpty({ message: 'El valor de la cancha es requerido' })
  @IsNumber({}, { message: 'El valor debe ser un número' })
  valor: number;
}
