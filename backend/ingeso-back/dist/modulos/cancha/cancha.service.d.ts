import { Repository } from 'typeorm';
import { Cancha } from './entities/cancha.entity';
import { CreateCanchaDto, UpdateCanchaDto } from './dto/cancha.dto';
export declare class CanchaService {
    private canchaRepository;
    constructor(canchaRepository: Repository<Cancha>);
    create(createCanchaDto: CreateCanchaDto): Promise<Cancha>;
    findAll(): Promise<Cancha[]>;
    findByNumero(numero: number): Promise<Cancha>;
    update(numero: number, updateCanchaDto: UpdateCanchaDto): Promise<Cancha>;
    remove(numero: number): Promise<void>;
    findAvailableCourts(): Promise<Cancha[]>;
}
