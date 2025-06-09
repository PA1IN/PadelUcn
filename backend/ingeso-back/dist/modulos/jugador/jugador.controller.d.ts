import { JugadorService } from './jugador.service';
import { CreateJugadorDto } from './dto/jugador.dto';
import { ApiResponse } from '../../interface/Apiresponce';
export declare class JugadorController {
    private readonly jugadorService;
    constructor(jugadorService: JugadorService);
    create(createJugadorDto: CreateJugadorDto): Promise<ApiResponse<import("./entities/jugador.entity").Jugador>>;
    findAll(): Promise<ApiResponse<import("./entities/jugador.entity").Jugador[]>>;
    findOne(id: string): Promise<ApiResponse<import("./entities/jugador.entity").Jugador>>;
    createBatch(createJugadoresDto: CreateJugadorDto[]): Promise<ApiResponse<{
        success: boolean;
        message: string;
        data: any;
        statusCode?: number;
        error?: string;
    }[]>>;
}
