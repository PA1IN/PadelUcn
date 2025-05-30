import { CanchasService } from './canchas.service';
import { CreateCanchaDto } from './dto/create-cancha.dto';
import { UpdateCanchaDto } from './dto/update-cancha.dto';
export declare class CanchasController {
    private readonly canchasService;
    constructor(canchasService: CanchasService);
    create(createCanchaDto: CreateCanchaDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/cancha.entity").Cancha>>;
    findAll(): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/cancha.entity").Cancha[]>>;
    findOne(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/cancha.entity").Cancha>>;
    update(id: string, updateCanchaDto: UpdateCanchaDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/cancha.entity").Cancha>>;
    remove(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<null>>;
}
