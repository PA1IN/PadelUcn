import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty({ message: 'El campo isAdmin es requerido' })
  @IsBoolean({ message: 'El campo isAdmin debe ser un booleano' })
  isAdmin: boolean;
}
