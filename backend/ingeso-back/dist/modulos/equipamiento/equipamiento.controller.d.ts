import { EquipamientoService } from './equipamiento.service';
import { CreateEquipamientoDto } from './dto/create-equipamiento.dto';
import { UpdateEquipamientoDto } from './dto/update-equipamiento.dto';
import { Equipamiento } from './entities/equipamiento.entity';
export declare class EquipamientoController {
    private readonly equipamientoService;
    constructor(equipamientoService: EquipamientoService);
    create(createEquipamientoDto: CreateEquipamientoDto): Promise<Equipamiento | null>;
    findAll(): Promise<{
        id_equipamiento: number;
        nombre: string;
        tipo: string;
        costo: number;
        stock: number;
    }[]>;
    findOne(id: string): Promise<{
        id_equipamiento: number;
        nombre: string;
        tipo: string;
        costo: number;
        stock: number;
    } | null>;
    update(id: string, updateEquipamientoDto: UpdateEquipamientoDto): Promise<Equipamiento | null>;
    remove(id: string): Promise<null>;
}
