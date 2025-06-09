import { BloqueService } from './bloque.service';
import { CreateBloqueDto, UpdateBloqueDto } from './dto/bloque.dto';
import { Bloque } from './entities/bloque.entity';
export declare class BloqueController {
    private readonly bloqueService;
    constructor(bloqueService: BloqueService);
    create(createBloqueDto: CreateBloqueDto): Promise<Bloque | null>;
    findAll(): Promise<Bloque[]>;
    findActivos(): Promise<Bloque[]>;
    findOne(id: string): Promise<Bloque | null>;
    update(id: string, updateBloqueDto: UpdateBloqueDto): Promise<Bloque | null>;
    remove(id: string): Promise<null>;
}
