import { User } from '../../user/entities/user.entity';
import { Reserva } from '../../reserva/entities/reserva.entity';
import { Equipamiento } from '../../equipamiento/entities/equipamiento.entity';
export declare class BoletaEquipamiento {
    id_boleta: number;
    usuario: User;
    reserva: Reserva;
    equipamiento: Equipamiento;
    cantidad: number;
}
