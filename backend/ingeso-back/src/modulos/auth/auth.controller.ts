import { Controller, Post, Body, Get, UseGuards, Req,Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto,AgregarSaldoDto } from './dto/auth.dto';
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
  async agregarSaldo(
    @Req() req, 
    @Body() data: { nuevoSaldo?: number; montoAAgregar?: number; transaccion?: string }
  ) {
    try {
      const usuario = await this.usuarioService.findOne(req.user.id_usuario);
      let montoAgregar: number;
      
      // Determinar si estamos usando el nuevo o viejo formato
      if (data.montoAAgregar !== undefined) {
        // Nuevo formato: monto a agregar
        montoAgregar = data.montoAAgregar;
      } else if (data.nuevoSaldo !== undefined) {
        // ✅ CAMBIO AQUÍ - Interpretar nuevoSaldo como monto a agregar
        montoAgregar = data.nuevoSaldo; // Ya no restamos el saldo actual
      } else {
        return CreateResponse(
          'Se requiere montoAAgregar o nuevoSaldo',
          null,
          'BAD_REQUEST',
          'Datos incompletos',
          false
        );
      }
      
      // Validar que el monto sea positivo
      if (montoAgregar <= 0) {
        return CreateResponse(
          'El monto a agregar debe ser mayor que cero',
          null,
          'BAD_REQUEST',
          'Monto inválido',
          false
        );
      }
      
      // Solo actualizar si hay un monto a agregar
      let usuarioActualizado;
      if (montoAgregar !== 0) {
        usuarioActualizado = await this.usuarioService.addSaldo(
          usuario.rut,
          { monto: montoAgregar }
        );
      } else {
        usuarioActualizado = usuario;
      }
      
      return CreateResponse(
        'Saldo actualizado exitosamente',
        {
          saldo_anterior: usuario.saldo,
          saldo_nuevo: usuarioActualizado.saldo,
          monto_agregado: montoAgregar,
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