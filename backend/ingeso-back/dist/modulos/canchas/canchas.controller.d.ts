import { CanchasService } from './canchas.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
import { Cancha } from './entities/cancha.entity';
export declare class CanchasController {
    private readonly canchasService;
    constructor(canchasService: CanchasService);
    create(createCanchaDto: CreateCanchaDto): Promise<import("../../interface/Apiresponce").ApiResponse<Cancha>>;
    findAll(): Promise<import("../../interface/Apiresponce").ApiResponse<Cancha[]>>;
    findOne(numero: string): Promise<import("../../interface/Apiresponce").ApiResponse<Cancha>>;
    update(numero: string, updateCanchaDto: UpdateCanchaDto): Promise<import("../../interface/Apiresponce").ApiResponse<Cancha>>;
    remove(numero: string): Promise<import("../../interface/Apiresponce").ApiResponse<null>>;
}
