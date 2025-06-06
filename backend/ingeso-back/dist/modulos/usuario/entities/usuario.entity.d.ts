import { Reserva } from '../../reserva/entities/reserva.entity';
import { HistorialReserva } from '../../historial-reserva/entities/historial-reserva.entity';
export declare class Usuario {
    id: number;
    rut: string;
    nombre: string;
    correo: string;
    password: string;
    telefono: string;
    saldo: number;
    isAdmin: boolean;
    reservas: Reserva[];
    historiales: HistorialReserva[];
}
