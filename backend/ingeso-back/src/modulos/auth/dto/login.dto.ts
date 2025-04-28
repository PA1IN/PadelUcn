import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El RUT es requerido' })
  @IsString({ message: 'El RUT debe ser texto' })
  rut: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser texto' })
  password: string;
}