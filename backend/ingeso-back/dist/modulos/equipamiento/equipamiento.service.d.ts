import { Repository } from 'typeorm';
import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';
import { Equipamiento } from './entities/equipamiento.entity';
import { ApiResponse } from '../../interface/Apiresponce';
export declare class EquipamientoService {
    private equipamientoRepository;
    constructor(equipamientoRepository: Repository<Equipamiento>);
    create(createEquipamientoDto: CreateEquipamientoDto): Promise<ApiResponse<Equipamiento>>;
    findAll(): Promise<ApiResponse<Equipamiento[]>>;
    findOne(id: number): Promise<ApiResponse<Equipamiento>>;
    update(id: number, updateEquipamientoDto: UpdateEquipamientoDto): Promise<ApiResponse<Equipamiento>>;
    remove(id: number): Promise<ApiResponse<null>>;
    actualizarStock(id: number, cantidad: number): Promise<ApiResponse<Equipamiento>>;
}
