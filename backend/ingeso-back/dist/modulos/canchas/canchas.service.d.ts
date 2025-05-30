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
    findOne(id: number): Promise<ApiResponse<Cancha>>;
    update(id: number, updateCanchaDto: UpdateCanchaDto): Promise<ApiResponse<Cancha>>;
    remove(id: number): Promise<ApiResponse<null>>;
}
