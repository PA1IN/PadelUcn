import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { LoginDto, RegisterDto, LoginResponseDto, RegisterResponseDto } from './dto/auth.dto';
export declare class AuthService {
    private usuarioRepository;
    private jwtService;
    constructor(usuarioRepository: Repository<Usuario>, jwtService: JwtService);
    validateUser(rut: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<LoginResponseDto>;
    register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
}
