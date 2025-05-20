import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
export declare class AuthController {
    private authService;
    private userService;
    constructor(authService: AuthService, userService: UserService);
    login(loginDto: LoginDto): Promise<import("../../interface/Apiresponce").ApiResponse<any> | {
        statusCode: number;
        message: string;
        success: boolean;
    }>;
    register(createUserDto: CreateUserDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("../user/entities/user.entity").User>>;
    getProfile(req: any): Promise<import("../../interface/Apiresponce").ApiResponse<import("../user/entities/user.entity").User>>;
}
