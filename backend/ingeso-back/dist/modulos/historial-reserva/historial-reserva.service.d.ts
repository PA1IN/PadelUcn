import { Repository } from 'typeorm';
import { HistorialReserva } from './entities/historial-reserva.entity';
interface CreateHistorialDto {
    estado: string;
    idReserva: number;
    idUsuario: number;
}
export declare class HistorialReservaService {
    private historialRepository;
    constructor(historialRepository: Repository<HistorialReserva>);
    create(createHistorialDto: CreateHistorialDto): Promise<HistorialReserva>;
    findAll(): Promise<HistorialReserva[]>;
    findOne(id: number): Promise<HistorialReserva>;
    findByReserva(idReserva: number): Promise<HistorialReserva[]>;
    findByUsuario(idUsuario: number): Promise<HistorialReserva[]>;
}
export {};
