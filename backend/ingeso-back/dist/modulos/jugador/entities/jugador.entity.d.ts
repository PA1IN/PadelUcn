import { Reserva } from '../../reserva/entities/reserva.entity';
export declare class Jugador {
    id: number;
    nombre: string;
    apellido: string;
    rut: string;
    edad: number;
    reserva: Reserva;
    idReserva: number;
}
