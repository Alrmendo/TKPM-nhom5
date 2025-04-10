// src/modules/admin/admin.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard'; 
import { Roles } from '../../decorators/role.decorators';
import { RolesGuard } from '../../guards/roles.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Size } from '../../models/entities/size.entity';
import { Color } from '../../models/entities/color.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    @InjectModel(Size.name) private sizeModel: Model<Size>,
    @InjectModel(Color.name) private colorModel: Model<Color>,
  ) {}

  @Get('style')
  @Roles('admin')
  getAdminPage() {
    return { message: 'Welcome Admin! This is the admin page data.' };
  }

  @Get('sizes')
  @Roles('admin')
  async getAllSizes() {
    try {
      const sizes = await this.sizeModel.find().exec();
      return {
        success: true,
        data: sizes,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch sizes',
      };
    }
  }

  @Get('colors')
  @Roles('admin')
  async getAllColors() {
    try {
      const colors = await this.colorModel.find().exec();
      return {
        success: true,
        data: colors,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch colors',
      };
    }
  }
}
