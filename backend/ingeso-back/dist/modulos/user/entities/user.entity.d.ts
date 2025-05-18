import { Reserva } from '../../reserva/entities/reserva.entity';
import { HistorialReserva } from '../../reserva/entities/historial-reserva.entity';
export declare class User {
    id: number;
    rut: string;
    password: string;
    nombre: string;
    correo: string;
    telefono: string;
    saldo: number;
    isAdmin: boolean;
    reservas: Reserva[];
    historialReservas: HistorialReserva[];
}
