import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modulos/user/user.service';

interface JwtPayload{
  rut: string;
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
    return user;
  }
}