import { Injectable } from '@nestjs/common';
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
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: payload.sub },
    });
    
    // Excluimos la contraseña por seguridad
    if (usuario) {
      const { contrasena, ...result } = usuario;
      return result;
    }
    
    return null;
  }
}