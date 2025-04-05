import { Controller, Get, Put, Body, UseGuards, Req, BadRequestException, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UpdateProfileDto, UpdatePasswordDto, UpdateUsernameDto } from './dto/update-profile.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

interface RequestWithUser extends Request {
  user: { username: string; role: string };
}

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    return this.userService.getProfile(req.user.username);
  }

  @Put('profile')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(req.user.username, updateProfileDto);
  }

  @Put('password')
  async updatePassword(
    @Req() req: RequestWithUser,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(req.user.username, updatePasswordDto);
  }

  @Put('username')
  async updateUsername(
    @Req() req: RequestWithUser,
    @Body() updateUsernameDto: UpdateUsernameDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.updateUsername(req.user.username, updateUsernameDto);
    
    // Generate a new token with the updated username
    const payload = {
      username: user.username,
      role: user.role
    };
    
    const accessToken = this.jwtService.sign(payload);
    
    // Update the cookie with the new token
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return user;
  }
} 