import { Controller, Post, Body, Get, UseGuards, Req,Patch } from '@nestjs/common';
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
  ) {}  
  @Post('login')
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
    @Get('saldo')
  @UseGuards(JwtAuthGuard)
  async obtenerSaldo(@Req() req) {
    try {
      // Obtener usuario completo desde la base de datos
      const usuario = await this.usuarioService.findOne(req.user.id_usuario);
      
      return CreateResponse(
        'Saldo obtenido exitosamente',
        { saldo: usuario.saldo },
        'OK'
      );
    } catch (error) {
      return CreateResponse(
        'Error al obtener saldo',
        null,
        'BAD_REQUEST',
        error.message,
        false
      );
    }
  }

  @Patch('saldo')
  @UseGuards(JwtAuthGuard)
  async actualizarSaldo(@Req() req, @Body() data: { nuevoSaldo: number; transaccion?: string }) {
    try {
      // ✅ VALIDAR NUEVO SALDO
      if (data.nuevoSaldo < 0) {
        return CreateResponse(
          'El saldo no puede ser negativo',
          null,
          'BAD_REQUEST',
          'Saldo inválido',
          false
        );
      }

      const usuario = await this.usuarioService.findOne(req.user.id_usuario);
      
      // Calcular diferencia de saldo
      const diferencia = data.nuevoSaldo - usuario.saldo;
      
      // ✅ ACTUALIZAR DIRECTAMENTE EL SALDO
      const usuarioActualizado = await this.usuarioService.update(
        req.user.id_usuario, 
        { saldo: data.nuevoSaldo },
         req.user  // ✅ AGREGAR PARÁMETRO currentUser
    );
      
      return CreateResponse(
        'Saldo actualizado exitosamente',
        {
          saldo_anterior: usuario.saldo,
          saldo_nuevo: data.nuevoSaldo,
          diferencia: diferencia,
          transaccion: data.transaccion || 'Actualización de saldo'
        },
        'OK'
      );
    } catch (error) {
      return CreateResponse(
        'Error al actualizar saldo',
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