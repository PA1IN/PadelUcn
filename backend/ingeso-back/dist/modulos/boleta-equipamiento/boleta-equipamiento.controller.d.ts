import { BoletaEquipamientoService } from './boleta-equipamiento.service';
import { CreateBoletaEquipamientoDto } from './dto/create-boleta-equipamiento.dto';
import { UpdateBoletaEquipamientoDto } from './dto/update-boleta-equipamiento.dto';
export declare class BoletaEquipamientoController {
    private readonly boletaEquipamientoService;
    constructor(boletaEquipamientoService: BoletaEquipamientoService);
    create(createBoletaEquipamientoDto: CreateBoletaEquipamientoDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/boleta-equipamiento.entity").BoletaEquipamiento>>;
    findAll(): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/boleta-equipamiento.entity").BoletaEquipamiento[]>>;
    findOne(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/boleta-equipamiento.entity").BoletaEquipamiento>>;
    update(id: string, updateBoletaEquipamientoDto: UpdateBoletaEquipamientoDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/boleta-equipamiento.entity").BoletaEquipamiento>>;
    remove(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<null>>;
}
