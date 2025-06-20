import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateResponse } from '../../utils/api-response.util';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
  
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req) {
    try {
      console.log('Profile request for user ID:', req.user.id_usuario);
      
      // Obtener usuario completo desde la base de datos
      const usuario = await this.usuarioService.findOne(req.user.id_usuario);
      
      // Remover contraseña de la respuesta
      const { contrasena, ...userWithoutPassword } = usuario;
      
      return CreateResponse(
        'Perfil obtenido exitosamente',
        userWithoutPassword,
        'OK'
      );
    } catch (error) {
      console.error('Profile error:', error);
      return CreateResponse(
        'Error al obtener perfil',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
}
}