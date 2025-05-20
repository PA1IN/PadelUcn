import { Reserva } from '../../reserva/entities/reserva.entity';
export declare class Cancha {
    id: number;
    numero: number;
    nombre: string;
    descripcion: string;
    mantenimiento: boolean;
    valor: number;
    reservas: Reserva[];
}
