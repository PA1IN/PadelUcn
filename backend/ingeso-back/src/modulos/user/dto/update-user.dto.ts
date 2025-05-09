import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, MinLength, IsOptional, IsEmail, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  nombre?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  @Matches(/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|ucn|alumnos\.ucn|disc\.ucn|ce\.ucn|live)+\.[a-zA-Z]{2,}$/, {
    message: 'El correo debe ser de un dominio válido (gmail.com, hotmail.com, ucn.cl, etc.)',
  })
  correo?: string;
}
