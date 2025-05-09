import { Reserva } from '../../reserva/entities/reserva.entity';
export declare class Admin {
    id_admin: number;
    nombre_usuario: string;
    password: string;
    reservas: Reserva[];
}
