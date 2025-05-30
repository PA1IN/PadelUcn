import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modulos/user/user.service';

interface JwtPayload{
  rut: string;
  isAdmin: boolean;
}


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'padelucn-secret-key', // En producción, usar variables de entorno
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findByRut(payload.rut);
    // Incluir si el usuario es administrador
    return { ...user, isAdmin: payload.isAdmin };
  }
}