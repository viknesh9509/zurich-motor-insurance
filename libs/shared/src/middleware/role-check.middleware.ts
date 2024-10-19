import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RoleCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userRole = req.headers['x-user-role']; 

    if (!userRole) {
      throw new UnauthorizedException('Role not found in the request');
    }

    if (userRole !== 'admin') {
      throw new UnauthorizedException('Insufficient permissions');
    }

    next(); 
  }
}
