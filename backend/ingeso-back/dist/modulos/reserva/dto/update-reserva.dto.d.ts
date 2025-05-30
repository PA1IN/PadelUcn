import { CreateReservaDto } from './create-reserva.dto';
declare const UpdateReservaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateReservaDto>>;
export declare class UpdateReservaDto extends UpdateReservaDto_base {
    fecha?: string;
    horaInicio?: string;
    horaTermino?: string;
    canchaId?: number;
}
export {};
