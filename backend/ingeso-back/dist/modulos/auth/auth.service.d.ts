import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiResponse } from '../../interface/Apiresponce';
import { User } from '../user/entities/user.entity';
export declare class AuthService {
    private userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    validateUser(rut: string, password: string): Promise<any>;
    login(user: any): Promise<ApiResponse<any>>;
    register(createUserDto: CreateUserDto): Promise<ApiResponse<User>>;
    getProfile(rut: string): Promise<ApiResponse<User>>;
}
