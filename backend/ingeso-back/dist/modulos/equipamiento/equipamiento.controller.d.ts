import { EquipamientoService } from './equipamiento.service';
import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';
export declare class EquipamientoController {
    private readonly equipamientoService;
    constructor(equipamientoService: EquipamientoService);
    create(createEquipamientoDto: CreateEquipamientoDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/equipamiento.entity").Equipamiento>>;
    findAll(): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/equipamiento.entity").Equipamiento[]>>;
    findOne(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/equipamiento.entity").Equipamiento>>;
    update(id: string, updateEquipamientoDto: UpdateEquipamientoDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/equipamiento.entity").Equipamiento>>;
    remove(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<null>>;
}
