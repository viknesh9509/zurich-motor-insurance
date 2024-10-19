import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get the required roles for the route (if any)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    let userRole = request.headers['x-user-role'];

    if (Array.isArray(userRole)) {
      userRole = userRole[0];  
    }

    if (!userRole) {
      throw new UnauthorizedException('Role not found in the request');
    }

    if (!requiredRoles.includes(userRole)) {
      throw new UnauthorizedException('Role not allowed to access this resource');
    }

    return true;
  }
}
