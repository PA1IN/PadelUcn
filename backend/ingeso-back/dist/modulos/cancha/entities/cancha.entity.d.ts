import { Reserva } from '../../reserva/entities/reserva.entity';
export declare class Cancha {
    id: number;
    numero: number;
    nombre: string;
    descripcion: string;
    valor: number;
    mantenimiento: boolean;
    cantidadMaxJugador: number;
    reservas: Reserva[];
}
