import { CreateBoletaEquipamientoDto } from './create-boleta-equipamiento.dto';
declare const UpdateBoletaEquipamientoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBoletaEquipamientoDto>>;
export declare class UpdateBoletaEquipamientoDto extends UpdateBoletaEquipamientoDto_base {
    cantidad?: number;
    monto_total?: number;
    id_reserva?: number;
    id_equipamiento?: number;
}
export {};
