import { Reserva } from '../../reserva/entities/reserva.entity';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';
export declare class User {
    rut: string;
    password: string;
    nombre: string;
    correo: string;
    reservas: Reserva[];
    boletas: BoletaEquipamiento[];
}
