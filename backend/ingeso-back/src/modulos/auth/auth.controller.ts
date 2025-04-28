import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiResponse as SwaggerResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @SwaggerResponse({ status: 200, description: 'Usuario autenticado correctamente' })
  @SwaggerResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @SwaggerResponse({ status: 201, description: 'Usuario registrado correctamente' })
  @SwaggerResponse({ status: 400, description: 'Datos inválidos o usuario ya existente' })
  async register(@Body() createUserDto: CreateUserDto) {
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