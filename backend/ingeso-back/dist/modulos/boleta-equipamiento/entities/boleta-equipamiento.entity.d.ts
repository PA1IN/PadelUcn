import { Reserva } from '../../reserva/entities/reserva.entity';
import { Equipamiento } from '../../equipamiento/entities/equipamiento.entity';
export declare class BoletaEquipamiento {
    id: number;
    cantidad: number;
    montoTotal: number;
    reservaId: number;
    equipamientoId: number;
    reserva: Reserva;
    equipamiento: Equipamiento;
}
