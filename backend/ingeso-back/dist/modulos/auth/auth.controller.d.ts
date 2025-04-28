import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any, loginDto: LoginDto): Promise<import("../../interface/Apiresponce").ApiResponse<{
        access_token: string;
    }>>;
    register(createUserDto: CreateUserDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("../user/entities/user.entity").User>>;
    getProfile(req: any): Promise<import("../../interface/Apiresponce").ApiResponse<import("../user/entities/user.entity").User>>;
}
