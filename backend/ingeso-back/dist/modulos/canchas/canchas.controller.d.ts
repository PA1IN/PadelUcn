import { CanchasService } from './canchas.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { Cancha } from './entities/cancha.entity';
export declare class CanchasController {
    private readonly canchasService;
    constructor(canchasService: CanchasService);
    create(createCanchaDto: CreateCanchaDto): Promise<ApiResponse<Cancha>>;
    findAll(): Promise<ApiResponse<Cancha[]>>;
    findOne(numero: string): Promise<ApiResponse<Cancha>>;
    update(numero: string, updateCanchaDto: UpdateCanchaDto): Promise<ApiResponse<Cancha>>;
    remove(numero: string): Promise<ApiResponse<null>>;
}
