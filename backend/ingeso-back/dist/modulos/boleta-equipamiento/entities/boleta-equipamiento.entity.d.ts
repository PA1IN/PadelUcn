import { Reserva } from '../../reserva/entities/reserva.entity';
import { Equipamiento } from '../../equipamiento/entities/equipamiento.entity';
export declare class BoletaEquipamiento {
    id: number;
    cantidad: number;
    montoTotal: number;
    reserva: Reserva;
    idReserva: number;
    equipamiento: Equipamiento;
    idEquipamiento: number;
}
