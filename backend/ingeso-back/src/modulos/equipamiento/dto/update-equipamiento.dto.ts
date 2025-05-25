import { PartialType } from '@nestjs/mapped-types';
import { CreateEquipamientoDto } from './create-equipamiento.dto';

export class UpdateEquipamientoDto extends PartialType(CreateEquipamientoDto) {}
