import { PartialType } from '@nestjs/mapped-types';
import { CreateCanchaDto } from './create-cancha.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateCanchaDto extends PartialType(CreateCanchaDto) {
    @IsOptional()
    @IsNumber({}, { message: 'El costo debe ser un valor numérico' })
    @Min(0, { message: 'El costo no puede ser negativo' })
    costo?: number;
}
