import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);
  
  constructor(private authService: AuthService) {
    super({
      usernameField: 'rut',
    });
    this.logger.log('LocalStrategy initialized with usernameField: rut');
  }

  async validate(rut: string, password: string): Promise<any> {
    this.logger.log(`Attempting to validate user with rut: ${rut}`);
    try {
      const user = await this.authService.validateUser(rut, password);
      if (!user) {
        this.logger.error(`Authentication failed: Invalid credentials for rut ${rut}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }
      this.logger.log(`Authentication successful for rut ${rut}`);
      return user;
    } catch (error) {
      this.logger.error(`Authentication error: ${error.message}`, error.stack);
      throw error;
    }
  }
}