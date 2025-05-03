import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { ApiResponse } from '../../interface/Apiresponce';
export declare class AdminService {
    private adminRepository;
    constructor(adminRepository: Repository<Admin>);
    create(createAdminDto: CreateAdminDto): Promise<ApiResponse<Admin>>;
    findAll(): Promise<ApiResponse<Admin[]>>;
    findOne(id: number): Promise<ApiResponse<Admin>>;
    findByUsername(username: string): Promise<Admin | null>;
    update(id: number, updateAdminDto: UpdateAdminDto): Promise<ApiResponse<Admin>>;
    remove(id: number): Promise<ApiResponse<null>>;
}
