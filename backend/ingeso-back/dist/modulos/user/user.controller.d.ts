import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/user.entity").User>>;
    findAll(): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/user.entity").User[]>>;
    findOne(rut: string): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/user.entity").User>>;
    update(rut: string, updateUserDto: UpdateUserDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./entities/user.entity").User>>;
    remove(rut: string): Promise<import("../../interface/Apiresponce").ApiResponse<null>>;
}
