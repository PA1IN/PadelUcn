import { User } from '../../user/entities/user.entity';
import { Reserva } from './reserva.entity';
export declare class HistorialReserva {
    id: number;
    estado: string;
    fechaEstado: Date;
    reserva: Reserva;
    idReserva: number;
    usuario: User;
    idUsuario: number;
}
