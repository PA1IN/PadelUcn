import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUsuarioDto, CreateUsuarioDto } from '../usuario/dto/usuario.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginUsuarioDto) {
    const result = await this.authService.login(loginDto);
    
    // Frontend expects { token: string }
    return {
      token: result.access_token
    };
  }
  @Post('register')
  async register(@Body() createUserDto: CreateUsuarioDto) {
    const result = await this.authService.register(createUserDto);
    
    // Frontend expects { message: string }
    return {
      message: 'Usuario registrado exitosamente'
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    // Frontend expects UserProfile structure with: rut, nombre, correo, telefono, direccion?, is_admin, saldo
    const user = req.user;
    
    return {
      rut: user.rut,
      nombre: user.nombre,
      correo: user.correo,
      telefono: user.telefono || '',
      direccion: user.direccion || '',
      is_admin: user.isAdmin || false,
      saldo: user.saldo || 0
    };
  }
}