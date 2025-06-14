import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El RUT es requerido' })
  @IsString({ message: 'El RUT debe ser una cadena de texto' })
  @Matches(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' })
  rut: string;
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;
}

export class RegisterDto {
  @IsNotEmpty({ message: 'El RUT es requerido' })
  @IsString({ message: 'El RUT debe ser una cadena de texto' })
  @Matches(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener formato chileno válido (ej: 12345678-9)' })
  rut: string;

  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre_usuario: string;

  @IsNotEmpty({ message: 'El correo es requerido' })
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^\+56[2-9]\d{8}$/, { message: 'El teléfono debe tener formato chileno (+56XXXXXXXXX)' })
  telefono?: string;
}

export class LoginResponseDto {
  access_token: string;
  user: {
    id_usuario: number;  
    rut: string;
    nombre_usuario: string; 
    correo: string;
    telefono?: string;
    saldo: number;
    is_admin: boolean;
  };
}

export class RegisterResponseDto {
  id_usuario: number;  
  rut: string;
  nombre_usuario: string; 
  correo: string;
  telefono?: string;
  saldo: number;
  is_admin: boolean;
}
