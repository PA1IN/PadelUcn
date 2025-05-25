import { PartialType } from '@nestjs/mapped-types';
import { CreateCanchaDto } from './create-cancha.dto';
import { IsNumber, IsOptional, Min, IsString, IsBoolean } from 'class-validator';

export class UpdateCanchaDto extends PartialType(CreateCanchaDto) {
    @IsOptional()
    @IsString({ message: 'El nombre debe ser un texto' })
    nombre?: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto' })
    descripcion?: string;

    @IsOptional()
    @IsBoolean({ message: 'El estado de mantenimiento debe ser un booleano' })
    mantenimiento?: boolean;

    @IsOptional()
    @IsNumber({}, { message: 'El valor debe ser un valor numérico' })
    @Min(0, { message: 'El valor no puede ser negativo' })
    valor?: number;
}
