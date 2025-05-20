import { Repository } from 'typeorm';
import { HistorialReserva } from '../entities/historial-reserva.entity';
import { CreateHistorialReservaDto } from './dto/create-historial-reserva.dto';
import { ApiResponse } from '../../../interface/Apiresponce';
export declare class HistorialReservaService {
    private historialReservaRepository;
    constructor(historialReservaRepository: Repository<HistorialReserva>);
    create(createHistorialReservaDto: CreateHistorialReservaDto): Promise<ApiResponse<HistorialReserva>>;
    findAll(): Promise<ApiResponse<HistorialReserva[]>>;
    findByReserva(idReserva: number): Promise<ApiResponse<HistorialReserva[]>>;
    findByUsuario(idUsuario: number): Promise<ApiResponse<HistorialReserva[]>>;
    findOne(id: number): Promise<ApiResponse<HistorialReserva>>;
}
