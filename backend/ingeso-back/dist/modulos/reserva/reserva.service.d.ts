import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Cancha } from '../canchas/entities/cancha.entity';
import { User } from '../user/entities/user.entity';
import { Reserva } from './entities/reserva.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { HistorialReservaService } from './historial-reserva/historial-reserva.service';
import { BoletaEquipamiento } from '../boleta-equipamiento/entities/boleta-equipamiento.entity';
export declare class ReservaService {
    private boletaEquipamientoRepository;
    private usuarioRepository;
    private canchaRespository;
    private reservaRepository;
    private historialReservaService;
    constructor(boletaEquipamientoRepository: Repository<BoletaEquipamiento>, usuarioRepository: Repository<User>, canchaRespository: Repository<Cancha>, reservaRepository: Repository<Reserva>, historialReservaService: HistorialReservaService);
    create(createReservaDto: CreateReservaDto): Promise<ApiResponse<Reserva>>;
    findAll(): Promise<ApiResponse<Reserva[]>>;
    findOne(id: number): Promise<ApiResponse<Reserva>>;
    findByUsuario(rutUsuario: string): Promise<ApiResponse<Reserva[]>>;
    findByCancha(numeroCancha: number): Promise<ApiResponse<Reserva[]>>;
    update(id: number, updateReservaDto: UpdateReservaDto): Promise<ApiResponse<Reserva>>;
    remove(id: number): Promise<ApiResponse<null>>;
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
