import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Res, Req, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard'; 
import { Roles } from '../../decorators/role.decorators';
import { RolesGuard } from '../../guards/roles.guard';
import { Request, Response as ExpressResponse } from 'express';
import { VerifyEmailDto } from '../email/dto/verify-email.dto';
import { UserDocument } from '../../models/entities/user.entity';
import { RequestPasswordResetDto, ResetPasswordDto } from './dto/password-reset.dto';

export interface RequestWithUser extends Request {
  user: any; // Hoặc kiểu dữ liệu của bạn, ví dụ { userId: string, username: string }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    // Chuyển đổi Mongoose document thành JavaScript object để dễ truy cập
    const userObject = user.toObject();
    return {
      message: 'Registration successful. Please check your email for verification code.',
      userId: userObject._id.toString(),
      email: user.email,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const { accessToken, isVerified, email } = await this.authService.login(loginDto);
    
    // Set cookie "jwt" với các option bảo mật
    res.cookie('jwt', accessToken, {
      httpOnly: true, // Không cho phép truy cập từ JavaScript (giúp bảo vệ khỏi XSS)
      secure: true, 
      sameSite: 'none', 
      maxAge: 7 * 24 * 60 * 60 * 1000, // Thời hạn cookie: 7 ngày
    });
    
    if (!isVerified) {
      return { 
        message: 'Login successful but account not verified. Please verify your email.',
        isVerified: false,
        email
      };
    }
    
    return { 
      message: 'Login successful',
      isVerified: true
    };
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() { email }: { email: string }) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }
    return this.authService.resendVerificationCode(email);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() requestPasswordResetDto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(requestPasswordResetDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // Check if passwords match
    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    
    return this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.resetCode,
      resetPasswordDto.newPassword
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: ExpressResponse) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    const { role } = req.user;
    console.log('/auth/me')
    //if (!role) throw new Error('Role not found in token');
    return { role };
  }
} 

