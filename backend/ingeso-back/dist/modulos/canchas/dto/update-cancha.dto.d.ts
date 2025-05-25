import { CreateCanchaDto } from './create-cancha.dto';
declare const UpdateCanchaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCanchaDto>>;
export declare class UpdateCanchaDto extends UpdateCanchaDto_base {
    nombre?: string;
    descripcion?: string;
    mantenimiento?: boolean;
    valor?: number;
}
export {};
