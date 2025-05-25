import { IsNotEmpty, IsString, MinLength, Matches, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El RUT es requerido' })
  @IsString({ message: 'El RUT debe ser texto' })
  @Matches(/^[0-9]+-[0-9kK]{1}$/, { message: 'Formato de RUT inválido (ej: 12345678-9)' })
  rut: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  nombre: string;

  @IsOptional()
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  @Matches(/^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo|ucn|alumnos\.ucn|disc\.ucn|ce\.ucn|live)+\.[a-zA-Z]{2,}$/, {
    message: 'El correo debe ser de un dominio válido (gmail.com, hotmail.com, ucn.cl, etc.)',
  })
  correo?: string;
}
