import { User } from '../../user/entities/user.entity';
import { Cancha } from '../../canchas/entities/cancha.entity';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';
import { HistorialReserva } from './historial-reserva.entity';
export declare class Reserva {
    id: number;
    fecha: Date;
    hora_inicio: string;
    hora_termino: string;
    usuario: User;
    cancha: Cancha;
    historial: HistorialReserva[];
    boletas: BoletaEquipamiento[];
}
