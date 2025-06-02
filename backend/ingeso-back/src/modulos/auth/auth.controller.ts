import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUsuarioDto, CreateUsuarioDto } from '../usuario/dto/usuario.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { CreateResponse } from '../../utils/api-response.util';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
  ) {}
  @Post('login')
  async login(@Body() loginDto: LoginUsuarioDto) {
    try {
      const result = await this.authService.login(loginDto);
      
      return CreateResponse(
        'Inicio de sesión exitoso',
        result,
        'OK'
      );
    } catch (error) {
      return CreateResponse(
        'Error al iniciar sesión',
        null,
        'UNAUTHORIZED',
        error.message,
        false
      );
    }
  }  @Post('register')
  async register(@Body() createUserDto: CreateUsuarioDto) {
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