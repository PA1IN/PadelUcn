import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { CreateUsuarioDto, LoginUsuarioDto } from '../usuario/dto/usuario.dto';
export declare class AuthService {
    private usuarioRepository;
    private jwtService;
    constructor(usuarioRepository: Repository<Usuario>, jwtService: JwtService);
    validateUser(rut: string, password: string): Promise<any>;
    login(loginDto: LoginUsuarioDto): Promise<{
        usuario: any;
        access_token: string;
    }>;
    register(createUsuarioDto: CreateUsuarioDto): Promise<{
        usuario: {
            id: number;
            rut: string;
            nombre: string;
            correo: string;
            telefono: string;
            saldo: number;
            isAdmin: boolean;
            reservas: import("../reserva/entities/reserva.entity").Reserva[];
            historiales: import("../historial-reserva/entities/historial-reserva.entity").HistorialReserva[];
        };
        access_token: string;
    }>;
}
