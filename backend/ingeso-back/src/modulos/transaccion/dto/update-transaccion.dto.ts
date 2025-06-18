import { PartialType } from '@nestjs/mapped-types';
import { CreateTransaccionDto } from './create-transaccion.dto';

export class UpdateTransaccionDto extends PartialType(CreateTransaccionDto) {}
