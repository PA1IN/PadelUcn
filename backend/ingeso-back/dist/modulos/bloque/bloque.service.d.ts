import { Repository } from 'typeorm';
import { Bloque } from './entities/bloque.entity';
import { CreateBloqueDto, UpdateBloqueDto } from './dto/bloque.dto';
import { ApiResponse } from '../../interface/Apiresponce';
export declare class BloqueService {
    private bloqueRepository;
    constructor(bloqueRepository: Repository<Bloque>);
    inicializarBloquesDefault(): Promise<void>;
    create(createBloqueDto: CreateBloqueDto): Promise<ApiResponse<Bloque>>;
    findAll(): Promise<ApiResponse<Bloque[]>>;
    findOne(id: number): Promise<ApiResponse<Bloque>>;
    update(id: number, updateBloqueDto: UpdateBloqueDto): Promise<ApiResponse<Bloque>>;
    remove(id: number): Promise<ApiResponse<null>>;
    findActivos(): Promise<ApiResponse<Bloque[]>>;
}
