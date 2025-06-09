import { CanchaService } from './cancha.service';
import { CreateCanchaDto, UpdateCanchaDto } from './dto/cancha.dto';
import { Cancha } from './entities/cancha.entity';
export declare class CanchaController {
    private readonly canchaService;
    constructor(canchaService: CanchaService);
    create(createCanchaDto: CreateCanchaDto): Promise<Cancha>;
    findAll(): Promise<{
        id_cancha: number;
        numero_cancha: number;
        nombre: string;
        descripcion: string;
        valor: number;
        maxJugadores: number;
    }[]>;
    findAvailable(): Promise<{
        id_cancha: number;
        numero_cancha: number;
        nombre: string;
        descripcion: string;
        valor: number;
        maxJugadores: number;
    }[]>;
    findOne(numero: number): Promise<{
        id_cancha: number;
        numero_cancha: number;
        nombre: string;
        descripcion: string;
        valor: number;
        maxJugadores: number;
    } | null>;
    update(numero: number, updateCanchaDto: UpdateCanchaDto): Promise<Cancha | null>;
    remove(numero: number): Promise<null>;
}
