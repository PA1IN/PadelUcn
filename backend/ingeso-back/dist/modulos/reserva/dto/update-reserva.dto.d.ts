import { CreateReservaDto } from './create-reserva.dto';
declare const UpdateReservaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateReservaDto>>;
export declare class UpdateReservaDto extends UpdateReservaDto_base {
    fecha?: string;
    hora_inicio?: string;
    hora_termino?: string;
    numero_cancha?: number;
    equipamiento?: {
        id: number;
        cantidad?: number;
    }[];
}
export {};
