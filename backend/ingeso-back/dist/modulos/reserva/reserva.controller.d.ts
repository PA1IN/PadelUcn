import { ReservaService } from './reserva.service';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
export declare class ReservaController {
    private readonly reservaService;
    constructor(reservaService: ReservaService);
    private transformReservaResponse;
    create(createReservaDto: CreateReservaDto, req: any): Promise<{
        id_reserva: number;
        fecha: Date;
        hora_inicio: string;
        hora_termino: string;
        id_usuario: number;
        id_cancha: number;
        numero_cancha: number | null;
        nombre_cancha: string | null;
        valor_cancha: number | null;
        usuario: {
            id: number;
            rut: string;
            nombre: string;
            correo: string;
            saldo: number;
        } | null;
        cancha: {
            id_cancha: number;
            numero_cancha: number;
            nombre: string;
            descripcion: string;
            valor: number;
        } | null;
        jugadores: {
            id_jugador: number;
            nombre: string;
            apellido: string;
            rut: string;
            edad: number;
            id_reserva: number;
        }[];
        boletas: {
            id_boleta: number;
            cantidad: number;
            monto_total: number;
            id_reserva: number;
            id_equipamiento: number;
            equipamiento: {
                id_equipamiento: number;
                nombre: string;
                tipo: string;
                costo: number;
            } | null;
        }[];
        historial: {
            id_historial: number;
            estado: string;
            fecha_estado: Date;
            id_reserva: number;
            id_usuario: number;
        }[];
    } | null>;
    findAll(): Promise<{
        id_reserva: number;
        fecha: Date;
        hora_inicio: string;
        hora_termino: string;
        id_usuario: number;
        id_cancha: number;
        numero_cancha: number | null;
        nombre_cancha: string | null;
        valor_cancha: number | null;
        usuario: {
            id: number;
            rut: string;
            nombre: string;
            correo: string;
            saldo: number;
        } | null;
        cancha: {
            id_cancha: number;
            numero_cancha: number;
            nombre: string;
            descripcion: string;
            valor: number;
        } | null;
        jugadores: {
            id_jugador: number;
            nombre: string;
            apellido: string;
            rut: string;
            edad: number;
            id_reserva: number;
        }[];
        boletas: {
            id_boleta: number;
            cantidad: number;
            monto_total: number;
            id_reserva: number;
            id_equipamiento: number;
            equipamiento: {
                id_equipamiento: number;
                nombre: string;
                tipo: string;
                costo: number;
            } | null;
        }[];
        historial: {
            id_historial: number;
            estado: string;
            fecha_estado: Date;
            id_reserva: number;
            id_usuario: number;
        }[];
    }[]>;
    findOne(id: string, req: any): Promise<{
        id_reserva: number;
        fecha: Date;
        hora_inicio: string;
        hora_termino: string;
        id_usuario: number;
        id_cancha: number;
        numero_cancha: number | null;
        nombre_cancha: string | null;
        valor_cancha: number | null;
        usuario: {
            id: number;
            rut: string;
            nombre: string;
            correo: string;
            saldo: number;
        } | null;
        cancha: {
            id_cancha: number;
            numero_cancha: number;
            nombre: string;
            descripcion: string;
            valor: number;
        } | null;
        jugadores: {
            id_jugador: number;
            nombre: string;
            apellido: string;
            rut: string;
            edad: number;
            id_reserva: number;
        }[];
        boletas: {
            id_boleta: number;
            cantidad: number;
            monto_total: number;
            id_reserva: number;
            id_equipamiento: number;
            equipamiento: {
                id_equipamiento: number;
                nombre: string;
                tipo: string;
                costo: number;
            } | null;
        }[];
        historial: {
            id_historial: number;
            estado: string;
            fecha_estado: Date;
            id_reserva: number;
            id_usuario: number;
        }[];
    } | null>;
    update(id: string, updateReservaDto: UpdateReservaDto, req: any): Promise<{
        id_reserva: number;
        fecha: Date;
        hora_inicio: string;
        hora_termino: string;
        id_usuario: number;
        id_cancha: number;
        numero_cancha: number | null;
        nombre_cancha: string | null;
        valor_cancha: number | null;
        usuario: {
            id: number;
            rut: string;
            nombre: string;
            correo: string;
            saldo: number;
        } | null;
        cancha: {
            id_cancha: number;
            numero_cancha: number;
            nombre: string;
            descripcion: string;
            valor: number;
        } | null;
        jugadores: {
            id_jugador: number;
            nombre: string;
            apellido: string;
            rut: string;
            edad: number;
            id_reserva: number;
        }[];
        boletas: {
            id_boleta: number;
            cantidad: number;
            monto_total: number;
            id_reserva: number;
            id_equipamiento: number;
            equipamiento: {
                id_equipamiento: number;
                nombre: string;
                tipo: string;
                costo: number;
            } | null;
        }[];
        historial: {
            id_historial: number;
            estado: string;
            fecha_estado: Date;
            id_reserva: number;
            id_usuario: number;
        }[];
    } | null>;
    remove(id: string, req: any): Promise<null>;
    findByUsuario(rut: string, req: any): Promise<{
        id_reserva: number;
        fecha: Date;
        hora_inicio: string;
        hora_termino: string;
        id_usuario: number;
        id_cancha: number;
        numero_cancha: number | null;
        nombre_cancha: string | null;
        valor_cancha: number | null;
        usuario: {
            id: number;
            rut: string;
            nombre: string;
            correo: string;
            saldo: number;
        } | null;
        cancha: {
            id_cancha: number;
            numero_cancha: number;
            nombre: string;
            descripcion: string;
            valor: number;
        } | null;
        jugadores: {
            id_jugador: number;
            nombre: string;
            apellido: string;
            rut: string;
            edad: number;
            id_reserva: number;
        }[];
        boletas: {
            id_boleta: number;
            cantidad: number;
            monto_total: number;
            id_reserva: number;
            id_equipamiento: number;
            equipamiento: {
                id_equipamiento: number;
                nombre: string;
                tipo: string;
                costo: number;
            } | null;
        }[];
        historial: {
            id_historial: number;
            estado: string;
            fecha_estado: Date;
            id_reserva: number;
            id_usuario: number;
        }[];
    }[]>;
    findByCancha(numero: string): Promise<{
        id_reserva: number;
        fecha: Date;
        hora_inicio: string;
        hora_termino: string;
        id_usuario: number;
        id_cancha: number;
        numero_cancha: number | null;
        nombre_cancha: string | null;
        valor_cancha: number | null;
        usuario: {
            id: number;
            rut: string;
            nombre: string;
            correo: string;
            saldo: number;
        } | null;
        cancha: {
            id_cancha: number;
            numero_cancha: number;
            nombre: string;
            descripcion: string;
            valor: number;
        } | null;
        jugadores: {
            id_jugador: number;
            nombre: string;
            apellido: string;
            rut: string;
            edad: number;
            id_reserva: number;
        }[];
        boletas: {
            id_boleta: number;
            cantidad: number;
            monto_total: number;
            id_reserva: number;
            id_equipamiento: number;
            equipamiento: {
                id_equipamiento: number;
                nombre: string;
                tipo: string;
                costo: number;
            } | null;
        }[];
        historial: {
            id_historial: number;
            estado: string;
            fecha_estado: Date;
            id_reserva: number;
            id_usuario: number;
        }[];
    }[]>;
    verificarDisponibilidad(numero: string, fecha: string, horaInicio: string, horaTermino: string): Promise<{
        disponible: boolean;
    }>;
    obtenerHorariosDisponibles(numero: string, fecha: string): Promise<{
        horariosDisponibles: any;
    }>;
    obtenerEstadisticas(): Promise<any>;
}
