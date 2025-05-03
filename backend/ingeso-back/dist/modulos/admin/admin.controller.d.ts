import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    create(createAdminDto: CreateAdminDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/admin.entity").Admin>>;
    findAll(): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/admin.entity").Admin[]>>;
    findOne(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/admin.entity").Admin>>;
    update(id: string, updateAdminDto: UpdateAdminDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/admin.entity").Admin>>;
    remove(id: string): Promise<import("../../interface/Apiresponce").ApiResponse<null>>;
}
