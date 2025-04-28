import { Repository } from 'typeorm';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { Cancha } from './entities/cancha.entity';
import { ApiResponse } from '../../interface/Apiresponce';
export declare class CanchasService {
    private canchaRepository;
    constructor(canchaRepository: Repository<Cancha>);
    create(createCanchaDto: CreateCanchaDto): Promise<ApiResponse<Cancha>>;
    findAll(): Promise<ApiResponse<Cancha[]>>;
    findOne(numero: number): Promise<ApiResponse<Cancha>>;
    update(numero: number, updateCanchaDto: UpdateCanchaDto): Promise<ApiResponse<Cancha>>;
    remove(numero: number): Promise<ApiResponse<null>>;
}
