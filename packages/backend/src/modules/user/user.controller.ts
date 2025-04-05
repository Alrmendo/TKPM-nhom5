import { Controller, Get, Put, Post, Body, UseGuards, Req, BadRequestException, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateProfileDto, UpdatePasswordDto, UpdateUsernameDto } from './dto/update-profile.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

interface RequestWithUser extends Request {
  user: {
    username: string;
    // other properties as needed
  };
}

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    return this.userService.getProfile(req.user.username);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: RequestWithUser, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user.username, updateProfileDto);
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Req() req: RequestWithUser, @Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.updatePassword(req.user.username, updatePasswordDto);
  }

  @Put('username')
  @UseGuards(JwtAuthGuard)
  async updateUsername(@Req() req: RequestWithUser, @Body() updateUsernameDto: UpdateUsernameDto) {
    const user = await this.userService.updateUsername(req.user.username, updateUsernameDto);
    return user;
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
} 