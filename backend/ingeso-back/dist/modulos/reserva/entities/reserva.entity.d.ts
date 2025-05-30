import { User } from '../../user/entities/user.entity';
import { Cancha } from '../../canchas/entities/cancha.entity';
import { HistorialReserva } from './historial-reserva.entity';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';
export declare class Reserva {
    id: number;
    fecha: Date;
    horaInicio: Date;
    horaTermino: Date;
    canchaId: number;
    usuarioId: number;
    cancha: Cancha;
    usuario: User;
    historialReservas: HistorialReserva[];
    boletasEquipamiento: BoletaEquipamiento[];
}
