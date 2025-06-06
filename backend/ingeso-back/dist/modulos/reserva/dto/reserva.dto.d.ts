import { CreateJugadorDto } from '../../jugador/dto/jugador.dto';
export declare class EquipamientoReservaDto {
    id_equipamiento: number;
    cantidad: number;
}
export declare class CreateReservaDto {
    fecha: string;
    hora_inicio: string;
    hora_termino: string;
    rut_usuario: string;
    numero_cancha: number;
    jugadores?: CreateJugadorDto[];
    equipamiento?: EquipamientoReservaDto[];
}
export declare class UpdateReservaDto {
    fecha?: string;
    hora_inicio?: string;
    hora_termino?: string;
    numero_cancha?: number;
    equipamiento?: EquipamientoReservaDto[];
    jugadores?: CreateJugadorDto[];
}
