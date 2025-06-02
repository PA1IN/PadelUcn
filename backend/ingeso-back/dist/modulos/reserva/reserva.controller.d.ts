import { ReservaService } from './reserva.service';
import { CreateReservaDto, UpdateReservaDto } from './dto/reserva.dto';
export declare class ReservaController {
    private readonly reservaService;
    constructor(reservaService: ReservaService);
    create(createReservaDto: CreateReservaDto, req: any): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva>>>;
    findAll(): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva[]>>>;
    findOne(id: string, req: any): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva>>;
    update(id: string, updateReservaDto: UpdateReservaDto, req: any): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva>>>;
    remove(id: string, req: any): Promise<import("../../interface/Apiresponce").ApiResponse<null>>;
    findByUsuario(rut: string, req: any): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva[]>>>;
    findByCancha(numero: string): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<import("../../interface/Apiresponce").ApiResponse<import("./entities/reserva.entity").Reserva[]>>>;
    verificarDisponibilidad(numero: string, fecha: string, horaInicio: string, horaTermino: string): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<{
        disponible: boolean;
    }>>;
    obtenerHorariosDisponibles(numero: string, fecha: string): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<{
        horariosDisponibles: import("../../interface/Apiresponce").ApiResponse<{
            horariosDisponibles: Array<{
                inicio: string;
                fin: string;
            }>;
        }>;
    }>>;
    obtenerEstadisticas(): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<import("../../interface/Apiresponce").ApiResponse<any>>>;
}
