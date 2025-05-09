import { User } from '../../user/entities/user.entity';
import { Admin } from '../../admin/entities/admin.entity';
import { Cancha } from '../../canchas/entities/cancha.entity';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';
export declare class Reserva {
    id_reserva: number;
    fecha: Date;
    hora_inicio: string;
    hora_termino: string;
    usuario: User;
    administrador: Admin;
    cancha: Cancha;
    boletas: BoletaEquipamiento[];
}
