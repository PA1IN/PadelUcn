import { Repository } from 'typeorm';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
import { Cancha } from '../cancha/entities/cancha.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Reserva } from './entities/reserva.entity';
import { HistorialReservaService } from '../historial-reserva/historial-reserva.service';
import { BoletaEquipamiento } from '../boleta-equipamiento/entities/boleta-equipamiento.entity';
import { Equipamiento } from '../equipamiento/entities/equipamiento.entity';
import { Jugador } from '../jugador/entities/jugador.entity';
import { ApiResponse } from '../../interface/Apiresponce';
export declare class ReservaService {
    private boletaEquipamientoRepository;
    private usuarioRepository;
    private canchaRespository;
    private reservaRepository;
    private equipamientoRepository;
    private jugadorRepository;
    private historialReservaService;
    constructor(boletaEquipamientoRepository: Repository<BoletaEquipamiento>, usuarioRepository: Repository<Usuario>, canchaRespository: Repository<Cancha>, reservaRepository: Repository<Reserva>, equipamientoRepository: Repository<Equipamiento>, jugadorRepository: Repository<Jugador>, historialReservaService: HistorialReservaService);
    create(createReservaDto: CreateReservaDto, isAdmin?: boolean): Promise<ApiResponse<Reserva>>;
    findAll(): Promise<ApiResponse<Reserva[]>>;
    findOne(id: number): Promise<ApiResponse<Reserva>>;
    findByUsuario(rutUsuario: string): Promise<ApiResponse<Reserva[]>>;
    findByCancha(numeroCancha: number): Promise<ApiResponse<Reserva[]>>;
    update(id: number, updateReservaDto: UpdateReservaDto, isAdmin?: boolean): Promise<ApiResponse<Reserva>>;
    remove(id: number, isAdmin?: boolean): Promise<ApiResponse<null>>;
    verificarDisponibilidad(numeroCancha: number, fechaStr: string, horaInicio: string, horaTermino: string): Promise<ApiResponse<{
        disponible: boolean;
    }>>;
    obtenerHorariosDisponibles(numeroCancha: number, fechaStr: string): Promise<ApiResponse<{
        horariosDisponibles: Array<{
            inicio: string;
            fin: string;
        }>;
    }>>;
    obtenerEstadisticas(): Promise<ApiResponse<any>>;
    findOneByIdForCheckout(id: number): Promise<ApiResponse<Reserva>>;
}
