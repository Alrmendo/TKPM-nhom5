import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorators';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      // Nếu không khai báo role thì cho phép truy cập
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Người dùng được thêm sau khi xác thực (ví dụ: từ JwtAuthGuard)
    return requiredRoles.includes(user?.role);
  }
}
