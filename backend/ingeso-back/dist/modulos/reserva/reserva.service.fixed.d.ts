import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { HistorialReserva } from './entities/historial-reserva.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { UserService } from '../user/user.service';
import { CanchasService } from '../canchas/canchas.service';
export declare class ReservaService {
    private reservaRepository;
    private historialRepository;
    private userService;
    private canchasService;
    constructor(reservaRepository: Repository<Reserva>, historialRepository: Repository<HistorialReserva>, userService: UserService, canchasService: CanchasService);
    create(createReservaDto: CreateReservaDto, usuarioId: number): Promise<ApiResponse<Reserva>>;
    findAll(): Promise<ApiResponse<Reserva[]>>;
    findOne(id: number): Promise<ApiResponse<Reserva>>;
    update(id: number, updateReservaDto: UpdateReservaDto, usuarioId: number): Promise<ApiResponse<Reserva>>;
    cancelar(id: number, usuarioId: number): Promise<ApiResponse<null>>;
    findByUsuario(rut: string): Promise<ApiResponse<Reserva[]>>;
    findByCancha(id: number): Promise<ApiResponse<Reserva[]>>;
    verificarDisponibilidad(canchaId: number, fecha: string, horaInicio: string | Date, horaTermino: string | Date, reservaIdExcluir?: number): Promise<ApiResponse<boolean>>;
    obtenerHorariosDisponibles(canchaId: number, fecha: string): Promise<ApiResponse<any>>;
    obtenerEstadisticas(): Promise<ApiResponse<any>>;
    obtenerHistorial(id: number): Promise<ApiResponse<HistorialReserva[]>>;
}
