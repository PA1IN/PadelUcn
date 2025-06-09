import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UsuarioService } from '../usuario/usuario.service';
export declare class AuthController {
    private readonly authService;
    private readonly usuarioService;
    constructor(authService: AuthService, usuarioService: UsuarioService);
    login(loginDto: LoginDto): Promise<import("../../interface/Apiresponce").ApiResponse<import("./dto/auth.dto").LoginResponseDto> | import("../../interface/Apiresponce").ApiResponse<null>>;
    register(createUserDto: RegisterDto): Promise<import("../../interface/Apiresponce").ApiResponse<null> | import("../../interface/Apiresponce").ApiResponse<import("./dto/auth.dto").RegisterResponseDto>>;
}
