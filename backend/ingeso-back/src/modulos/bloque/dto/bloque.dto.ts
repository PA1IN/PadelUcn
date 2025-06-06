import { IsNotEmpty, IsString, IsOptional, IsBoolean, Matches } from "class-validator";

export class CreateBloqueDto {
    @IsNotEmpty({ message: 'La hora de inicio es requerida' })
    @IsString({ message: 'La horea de inicio debe ser una cadena de texto' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de inicio debe tener formato HH:MM' })
    hora_inicio: string;

    @IsNotEmpty({ message: 'La hora de termino es requerida' })
    @IsString({ message: 'La hora de termino debe ser una cadena de texto' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de término debe tener formato HH:MM' })
    hora_termino: string;

    @IsOptional()
    @IsString({ message: 'Los dias deben ser una cadena de texto' })
    @Matches(/^(lun|mar|mie|jue|vie|sab|dom)(,(lun|mar|mie|jue|vie|sab|dom))*$/, { 
    message: 'Los días deben estar separados por comas (ej: lun,mar,mie)'})
    dias?: string;

    @IsOptional()
    @IsBoolean({ message: 'Activo debe ser un valor booleano' })
    activo?: boolean;
}

export class UpdateBloqueDto {
    
    @IsOptional()
    @IsString({ message: 'La hora de inicio debe ser  una cadena de texto' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de inicio debe tener formato HH:MM' })
    hora_inicio?: string;

    @IsOptional()
    @IsString({ message: 'La hora de termino debe ser una caedena de texto' })
    @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'La hora de término debe tener formato HH:MM' })
  hora_termino?: string;

    @IsOptional()
    @IsString({ message: 'Los dias deben ser una cadena de texto' })
    @Matches(/^(lun|mar|mie|jue|vie|sab|dom)(,(lun|mar|mie|jue|vie|sab|dom))*$/, { 
    message: 'Los días deben estar separados por comas (ej: lun,mar,mie)' })
    dias?: string;

    @IsOptional()
    @IsBoolean({ message: 'Activo debe ser un valor booleano' })
    activo?: boolean;
}

