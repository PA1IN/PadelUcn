import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { ApiResponse } from '../../interface/Apiresponce';
export declare class ReservaService {
    private reservaRepository;
    constructor(reservaRepository: Repository<Reserva>);
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
