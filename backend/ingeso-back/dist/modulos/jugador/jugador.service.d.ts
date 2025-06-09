import { Repository } from 'typeorm';
import { Jugador } from './entities/jugador.entity';
import { CreateJugadorDto } from './dto/jugador.dto';
import { ApiResponse } from '../../interface/Apiresponce';
import { Reserva } from '../reserva/entities/reserva.entity';
import { Cancha } from '../cancha/entities/cancha.entity';
export declare class JugadorService {
    private jugadorRepository;
    private reservaRepository;
    private canchaRepository;
    constructor(jugadorRepository: Repository<Jugador>, reservaRepository: Repository<Reserva>, canchaRepository: Repository<Cancha>);
    create(createJugadorDto: CreateJugadorDto): Promise<ApiResponse<Jugador>>;
    findAll(): Promise<ApiResponse<Jugador[]>>;
    findOne(id: number): Promise<ApiResponse<Jugador>>;
}
