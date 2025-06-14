import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
     console.log('ROLES GUARD VALIDATION');
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('🔍 Required roles:', requiredRoles);

    if (!requiredRoles) {
      console.log('No roles required - acceso permitido');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('👤 Usuario en RolesGuard:', user);
    console.log('👤 user.is_admin:', user?.is_admin);
    console.log('👤 Tipo de user.is_admin:', typeof user?.is_admin);
    
    if (!user) {
      console.log('No user found in request');
      throw new ForbiddenException('No tiene permisos para acceder a este recurso');
    }

    if (requiredRoles.includes('admin') && user.is_admin) {
      console.log('Admin autorizado - acceso permitido');
      return true;
    }
      console.log('RolesGuard - Acceso denegado');
    console.log('Required roles:', requiredRoles);
    console.log('User is_admin:', user.is_admin);

    throw new ForbiddenException('No tiene permisos para acceder a este recurso');
  }
}
