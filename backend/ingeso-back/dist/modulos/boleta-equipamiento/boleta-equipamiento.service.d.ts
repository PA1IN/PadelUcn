import { Repository } from 'typeorm';
import { CreateBoletaEquipamientoDto } from './dto/create-boleta-equipamiento.dto';
import { UpdateBoletaEquipamientoDto } from './dto/update-boleta-equipamiento.dto';
import { BoletaEquipamiento } from './entities/boleta-equipamiento.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { EquipamientoService } from '../equipamiento/equipamiento.service';
export declare class BoletaEquipamientoService {
    private boletaRepository;
    private equipamientoService;
    constructor(boletaRepository: Repository<BoletaEquipamiento>, equipamientoService: EquipamientoService);
    create(createBoletaDto: CreateBoletaEquipamientoDto): Promise<ApiResponse<BoletaEquipamiento>>;
    findAll(): Promise<ApiResponse<BoletaEquipamiento[]>>;
    findOne(id: number): Promise<ApiResponse<BoletaEquipamiento>>;
    findByReserva(idReserva: number): Promise<ApiResponse<BoletaEquipamiento[]>>;
    update(id: number, updateBoletaDto: UpdateBoletaEquipamientoDto): Promise<ApiResponse<BoletaEquipamiento>>;
    remove(id: number): Promise<ApiResponse<null>>;
}
