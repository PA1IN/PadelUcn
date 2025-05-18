import { ReservaService } from './reserva.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
export declare class ReservaController {
    private readonly reservaService;
    constructor(reservaService: ReservaService);
    create(createReservaDto: CreateReservaDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva>>;
    findAll(): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva[]>>;
    findByUsuario(rut: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva[]>>;
    findByCancha(numero: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva[]>>;
    findOne(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva>>;
    update(id: string, updateReservaDto: UpdateReservaDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva>>;
    remove(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<null>>;
    verificarDisponibilidad(numero: string, fecha: string, horaInicio: string, horaTermino: string): Promise<import("../../interface/Apiresponce").ApiResponse<{
        disponible: boolean;
    }>>;
    obtenerHorariosDisponibles(numero: string, fecha: string): Promise<import("../../interface/Apiresponce").ApiResponse<{
        horariosDisponibles: Array<{
            inicio: string;
            fin: string;
        }>;
    }>>;
    obtenerEstadisticas(): Promise<import("../../interface/Apiresponce").ApiResponse<any>>;
}
