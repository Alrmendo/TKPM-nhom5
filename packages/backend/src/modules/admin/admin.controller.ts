// src/modules/admin/admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard'; 
import { Roles } from '../../decorators/role.decorators';
import { RolesGuard } from '../../guards/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('style')
  @Roles('admin')
  getAdminPage() {
    return { message: 'Welcome Admin! This is the admin page data.' };
  }
}
