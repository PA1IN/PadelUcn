import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'El RUT es requerido' })
  @IsString({ message: 'El RUT debe ser una cadena de texto' })
  @Matches(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' })
  rut: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
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
  @Matches(/^(\+?56)?[2-9]\d{7,8}$/, { message: 'El teléfono debe tener un formato válido chileno' })
  telefono?: string;
}

export class CreateUsuarioAdminDto extends CreateUsuarioDto {
  @IsOptional()
  @IsBoolean()
  is_admin?: boolean;
}

export class LoginUsuarioDto {
  @IsNotEmpty({ message: 'El RUT es requerido' })
  @IsString({ message: 'El RUT debe ser una cadena de texto' })
  @Matches(/^[0-9]+-[0-9kK]{1}$/, { message: 'El RUT debe tener un formato válido (ej: 12345678-9)' })
  rut: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena: string;
}

export class AddSaldoUsuarioDto {
  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(1000, { message: 'El monto mínimo es $1.000' })
  @Max(1000000, { message: 'El monto máximo es $1.000.000' })
  monto: number;
}

export class UpdateAdminDto {
  @IsNotEmpty({ message: 'El valor isAdmin es requerido' })
  @IsBoolean({ message: 'isAdmin debe ser un valor booleano' })
  isAdmin: boolean;
}

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre_usuario?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  correo?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrasena?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Matches(/^(\+?56)?[2-9]\d{7,8}$/, { message: 'El teléfono debe tener un formato válido chileno' })
  telefono?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El saldo debe ser un número' })
  @Min(0, { message: 'El saldo no puede ser negativo' })
  saldo?: number;
}
