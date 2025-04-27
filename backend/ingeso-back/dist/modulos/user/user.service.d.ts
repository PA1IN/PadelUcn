import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiResponse } from '../../interface/Apiresponce';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<ApiResponse<User>>;
    findAll(): Promise<ApiResponse<User[]>>;
    findOne(rut: string): Promise<ApiResponse<User>>;
    findByRut(rut: string): Promise<User>;
    update(rut: string, updateUserDto: UpdateUserDto): Promise<ApiResponse<User>>;
    remove(rut: string): Promise<ApiResponse<null>>;
}
