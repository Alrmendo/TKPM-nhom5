import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Check if user exists in the request (should be set by your authentication middleware)
    if (!request.user) {
      throw new UnauthorizedException('You must be logged in to access this resource');
    }
    
    // Check if user has admin role
    if (request.user.role !== 'admin') {
      throw new UnauthorizedException('You do not have permission to access this resource');
    }
    
    return true;
  }
} 