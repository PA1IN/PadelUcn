import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdatePagoDto {
  @IsNotEmpty()
  @IsBoolean()
  pagado: boolean;
}
