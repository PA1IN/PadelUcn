import { AuthService } from './auth.service';
import { LoginUsuarioDto, CreateUsuarioDto } from '../usuario/dto/usuario.dto';
import { UsuarioService } from '../usuario/usuario.service';
export declare class AuthController {
    private readonly authService;
    private readonly usuarioService;
    constructor(authService: AuthService, usuarioService: UsuarioService);
    login(loginDto: LoginUsuarioDto): Promise<{
        token: string;
    }>;
    register(createUserDto: CreateUsuarioDto): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<{
        rut: any;
        nombre: any;
        correo: any;
        telefono: any;
        direccion: any;
        is_admin: any;
        saldo: any;
    }>;
}
