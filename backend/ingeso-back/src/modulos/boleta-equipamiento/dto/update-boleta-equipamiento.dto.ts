import { PartialType } from '@nestjs/mapped-types';
import { CreateBoletaEquipamientoDto } from './create-boleta-equipamiento.dto';

export class UpdateBoletaEquipamientoDto extends PartialType(CreateBoletaEquipamientoDto) {}
