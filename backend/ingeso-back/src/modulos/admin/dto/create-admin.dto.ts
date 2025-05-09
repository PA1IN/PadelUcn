import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  nombre_usuario: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
