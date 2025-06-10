import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateResponse } from '../../utils/api-response.util';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) {}  @Post('login')
async login(@Body() loginDto: LoginDto) {
  console.log('Login request received:', loginDto);
  try {
    const result = await this.authService.login(loginDto);
    console.log('Login successful');
    return result;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}  @Post('register')
  async register(@Body() createUserDto: RegisterDto) {
    try {
      const result = await this.authService.register(createUserDto);
      
      return CreateResponse(
        'Usuario registrado exitosamente',
        result,
        'CREATED'
      );
    } catch (error) {
      return CreateResponse(
        'Error al registrar usuario',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }
}