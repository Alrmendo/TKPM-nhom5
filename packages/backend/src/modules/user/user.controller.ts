import { Controller, Get, Put, Post, Body, UseGuards, Req, BadRequestException, Res, UploadedFile, UseInterceptors, Param, NotFoundException, UnauthorizedException, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto, UpdatePasswordDto, UpdateUsernameDto, AddAddressDto, UpdateAddressDto, DeleteAddressDto, SetDefaultAddressDto } from './dto/update-profile.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

interface RequestWithUser extends Request {
  user: { username: string; role: string };
}

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    try {
      const userProfile = await this.userService.getProfile(req.user.username);
      return { success: true, data: userProfile };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: RequestWithUser, @Body() updateProfileDto: UpdateProfileDto) {
    try {
      const updatedProfile = await this.userService.updateProfile(req.user.username, updateProfileDto);
      return { success: true, data: updatedProfile };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Req() req: RequestWithUser, @Body() updatePasswordDto: UpdatePasswordDto) {
    try {
      const result = await this.userService.updatePassword(req.user.username, updatePasswordDto);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException || error instanceof BadRequestException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }

  @Put('username')
  @UseGuards(JwtAuthGuard)
  async updateUsername(@Req() req: RequestWithUser, @Body() updateUsernameDto: UpdateUsernameDto) {
    try {
      const updatedProfile = await this.userService.updateUsername(req.user.username, updateUsernameDto);
      return { success: true, data: updatedProfile };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException || error instanceof BadRequestException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }
  
  @Post('profile/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and GIF files are allowed.');
    }

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds the 5MB limit.');
    }

    try {
      // Upload to Cloudinary
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      
      // Update user profile with new image URL
      await this.userService.updateProfileImage(req.user.username, imageUrl);
      
      return { imageUrl };
    } catch (error) {
      throw new BadRequestException('Failed to upload image: ' + error.message);
    }
  }

  @Get('profile/:username')
  async getPublicProfile(@Param('username') username: string) {
    try {
      const profile = await this.userService.getPublicProfile(username);
      return { success: true, data: profile };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }

  // Address management endpoints
  @Get('addresses')
  @UseGuards(JwtAuthGuard)
  async getAddresses(@Req() req: RequestWithUser) {
    try {
      const addresses = await this.userService.getAddresses(req.user.username);
      return { success: true, data: addresses };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }

  @Post('addresses')
  @UseGuards(JwtAuthGuard)
  async addAddress(@Req() req: RequestWithUser, @Body() addAddressDto: AddAddressDto) {
    try {
      const updatedProfile = await this.userService.addAddress(req.user.username, addAddressDto);
      return { success: true, data: updatedProfile };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }

  @Put('addresses')
  @UseGuards(JwtAuthGuard)
  async updateAddress(@Req() req: RequestWithUser, @Body() updateAddressDto: UpdateAddressDto) {
    try {
      const updatedProfile = await this.userService.updateAddress(req.user.username, updateAddressDto);
      return { success: true, data: updatedProfile };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }

  @Delete('addresses')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(@Req() req: RequestWithUser, @Body() deleteAddressDto: DeleteAddressDto) {
    try {
      const updatedProfile = await this.userService.deleteAddress(req.user.username, deleteAddressDto);
      return { success: true, data: updatedProfile };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }

  @Put('addresses/default')
  @UseGuards(JwtAuthGuard)
  async setDefaultAddress(@Req() req: RequestWithUser, @Body() setDefaultAddressDto: SetDefaultAddressDto) {
    try {
      const updatedProfile = await this.userService.setDefaultAddress(req.user.username, setDefaultAddressDto);
      return { success: true, data: updatedProfile };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false, message: error.message };
      }
      throw error;
    }
  }
} 