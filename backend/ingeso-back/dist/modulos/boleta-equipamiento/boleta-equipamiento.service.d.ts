import { Repository } from 'typeorm';
import { CreateBoletaEquipamientoDto } from './dto/create-boleta-equipamiento.dto';
import { UpdateBoletaEquipamientoDto } from './dto/update-boleta-equipamiento.dto';
import { BoletaEquipamiento } from './entities/boleta-equipamiento.entity';
import { ApiResponse } from '../../interface/Apiresponce';
import { ReservaService } from '../reserva/reserva.service';
import { EquipamientoService } from '../equipamiento/equipamiento.service';
import { UserService } from '../user/user.service';
export declare class BoletaEquipamientoService {
    private boletaRepository;
    private reservaService;
    private equipamientoService;
    private userService;
    constructor(boletaRepository: Repository<BoletaEquipamiento>, reservaService: ReservaService, equipamientoService: EquipamientoService, userService: UserService);
    create(createBoletaDto: CreateBoletaEquipamientoDto): Promise<ApiResponse<BoletaEquipamiento>>;
    findAll(): Promise<ApiResponse<BoletaEquipamiento[]>>;
    findOne(id: number): Promise<ApiResponse<BoletaEquipamiento>>;
    update(id: number, updateBoletaDto: UpdateBoletaEquipamientoDto): Promise<ApiResponse<BoletaEquipamiento>>;
    remove(id: number): Promise<ApiResponse<null>>;
    findByReserva(reservaId: number): Promise<ApiResponse<BoletaEquipamiento[]>>;
}
