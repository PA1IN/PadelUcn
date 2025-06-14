import { Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'padelunicket', // Cambiar en producción
    });
  }

  async validate(payload: any) {
    console.log('JWT STRATEGY VALIDATION');
    console.log('Payload recibido:', payload);
    console.log('Payload.sub:', payload.sub);
    console.log('Tipo de payload.sub:', typeof payload.sub);
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: payload.sub },
      select: ['id_usuario', 'rut', 'nombre_usuario', 'correo', 'telefono', 'saldo', 'is_admin']
    });
    console.log('Usuario encontrado:', usuario);
    console.log('Usuario is_admin:', usuario?.is_admin);
    
    if (!usuario) {
      console.log('Usuario no encontrado en JWT validation');
      throw new UnauthorizedException('Token inválido');
    }
     console.log('JWT Strategy - Usuario validado correctamente');
    console.log('JWT Strategy - Retornando usuario:', {
      id_usuario: usuario.id_usuario,
      rut: usuario.rut,
      is_admin: usuario.is_admin
    });
    
    return usuario;
  }
}