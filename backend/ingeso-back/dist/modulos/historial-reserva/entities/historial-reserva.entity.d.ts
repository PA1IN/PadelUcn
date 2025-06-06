import { Reserva } from '../../reserva/entities/reserva.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
export declare class HistorialReserva {
    id: number;
    estado: string;
    fechaEstado: Date;
    reserva: Reserva;
    idReserva: number;
    usuario: Usuario;
    idUsuario: number;
}
