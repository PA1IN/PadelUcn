import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  // Modificamos el endpoint de login para que no use la guardia de autenticación local
  // @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @SwaggerResponse({ status: 200, description: 'Usuario autenticado correctamente' })
  @SwaggerResponse({ status: 401, description: 'Credenciales inválidas' })  async login(@Body() loginDto: LoginDto) {
    // Implementamos la lógica de login directamente aquí para depuración
    const { rut, password } = loginDto;
    console.log('Login attempt for RUT:', rut);
    
    const user = await this.userService.findByRut(rut);
    
    if (!user) {
      console.log('Login failed: User not found');
      return {
        statusCode: 401,
        message: 'Credenciales inválidas: Usuario no encontrado',
        success: false
      };
    }
    
    console.log('User found, password type:', typeof user.password);
    
    try {
      // Verificamos el tipo y existencia de la contraseña para evitar errores de bcrypt
      if (!user.password || typeof user.password !== 'string') {
        console.error('Invalid password format in database:', user.password);
        return {
          statusCode: 401,
          message: 'Error en el formato de la contraseña en la base de datos',
          success: false
        };
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password validation result:', isPasswordValid);
      
      if (!isPasswordValid) {
        return {
          statusCode: 401,
          message: 'Credenciales inválidas: Contraseña incorrecta',
          success: false
        };
      }
      
      // Si las credenciales son válidas, generamos el token JWT
      const { password: _, ...userWithoutPassword } = user;
      return this.authService.login(userWithoutPassword);
    } catch (error) {
      console.error('Error during login process:', error);
      return {
        statusCode: 500,
        message: 'Error interno durante la autenticación: ' + error.message,
        success: false
      };
    }
  }
  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @SwaggerResponse({ status: 201, description: 'Usuario registrado correctamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o usuario ya existente' })
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('Datos recibidos para registro:', createUserDto);
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @SwaggerResponse({ status: 200, description: 'Perfil obtenido correctamente' })
  @SwaggerResponse({ status: 401, description: 'No autorizado' })
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.rut);
  }
}