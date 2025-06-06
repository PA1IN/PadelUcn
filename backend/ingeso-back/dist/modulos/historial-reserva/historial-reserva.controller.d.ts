import { HistorialReservaService } from './historial-reserva.service';
import { HistorialReserva } from './entities/historial-reserva.entity';
export declare class HistorialReservaController {
    private readonly historialReservaService;
    constructor(historialReservaService: HistorialReservaService);
    findAll(): Promise<HistorialReserva[]>;
    findOne(id: string): Promise<HistorialReserva>;
    findByReserva(id: string): Promise<HistorialReserva[]>;
    findByUsuario(id: string): Promise<HistorialReserva[]>;
}
