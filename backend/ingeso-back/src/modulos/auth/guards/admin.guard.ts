import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CreateResponse } from '../../../utils/api-response.util';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar si el usuario es administrador
    if (user && user.isAdmin === true) {
      return true;
    }

    throw new UnauthorizedException(
      CreateResponse(
        'Acceso denegado. Se requieren permisos de administrador.',
        null,
        'FORBIDDEN'
      )
    );
  }
}
