import { AuthService } from './auth.service';
import { LoginUsuarioDto, CreateUsuarioDto } from '../usuario/dto/usuario.dto';
import { UsuarioService } from '../usuario/usuario.service';
export declare class AuthController {
    private readonly authService;
    private readonly usuarioService;
    constructor(authService: AuthService, usuarioService: UsuarioService);
    login(loginDto: LoginUsuarioDto): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<{
        usuario: any;
        access_token: string;
    }>>;
    register(createUserDto: CreateUsuarioDto): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<{
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
    }>>;
}
