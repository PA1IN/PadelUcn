import { HistorialReservaService } from './historial-reserva.service';
import { CreateHistorialReservaDto } from './dto/create-historial-reserva.dto';
export declare class HistorialReservaController {
    private readonly historialReservaService;
    constructor(historialReservaService: HistorialReservaService);
    create(createHistorialReservaDto: CreateHistorialReservaDto): Promise<import("../../../interface/Apiresponce").ApiResponse<import("../entities/historial-reserva.entity").HistorialReserva>>;
    findAll(): Promise<import("../../../interface/Apiresponce").ApiResponse<import("../entities/historial-reserva.entity").HistorialReserva[]>>;
    findByReserva(id: string): Promise<import("../../../interface/Apiresponce").ApiResponse<import("../entities/historial-reserva.entity").HistorialReserva[]>>;
    findByUsuario(id: string): Promise<import("../../../interface/Apiresponce").ApiResponse<import("../entities/historial-reserva.entity").HistorialReserva[]>>;
    findOne(id: string): Promise<import("../../../interface/Apiresponce").ApiResponse<import("../entities/historial-reserva.entity").HistorialReserva>>;
}
