import { Usuario } from '../../usuario/entities/usuario.entity';
import { Cancha } from '../../cancha/entities/cancha.entity';
import { HistorialReserva } from '../../historial-reserva/entities/historial-reserva.entity';
import { BoletaEquipamiento } from '../../boleta-equipamiento/entities/boleta-equipamiento.entity';
import { Jugador } from '../../jugador/entities/jugador.entity';
export declare class Reserva {
    id: number;
    fecha: Date;
    hora_inicio: string;
    hora_termino: string;
    usuario: Usuario;
    idUsuario: number;
    cancha: Cancha;
    idCancha: number;
    historiales: HistorialReserva[];
    boletas: BoletaEquipamiento[];
    jugadores: Jugador[];
}
