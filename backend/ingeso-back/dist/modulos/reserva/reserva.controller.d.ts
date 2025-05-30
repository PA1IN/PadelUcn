import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
export declare class ReservaController {
    private readonly reservaService;
    constructor(reservaService: ReservaService);
    create(createReservaDto: CreateReservaDto, req: any): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva>>;
    findAll(): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva[]>>;
    findOne(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva>>;
    update(id: string, updateReservaDto: UpdateReservaDto, req: any): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva>>;
    remove(id: string, req: any): Promise<import("../../interface/Apiresponce").ApiResponse<null>>;
    findByUsuario(rut: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva[]>>;
    findByCancha(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva[]>>;
    verificarDisponibilidad(numero: string, fecha: string, horaInicio: string, horaTermino: string): Promise<import("../../interface/Apiresponce").ApiResponse<boolean>>;
    obtenerHorariosDisponibles(numero: string, fecha: string): Promise<import("../../interface/Apiresponce").ApiResponse<any>>;
    obtenerHistorial(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/historial-reserva.entity").HistorialReserva[]>>;
    obtenerEstadisticas(): Promise<import("../../interface/Apiresponce").ApiResponse<any>>;
}
