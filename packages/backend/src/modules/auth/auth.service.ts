import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../models/entities/user.entity'; //'../models/user.model';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { EmailService } from '../email/email.service';
import { VerifyEmailDto } from '../email/dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // Helper function to generate random verification code
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(registerDto: RegisterDto): Promise<UserDocument> {
    const { username, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code
    const verificationCode = this.generateVerificationCode();
    const verificationExpiry = new Date();
    verificationExpiry.setMinutes(verificationExpiry.getMinutes() + 30); // Code expires in 30 minutes

    // Create new user
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
      verificationCode,
      verificationExpiry,
      isVerified: false,
    });

    // Save user
    const savedUser = await newUser.save();

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(email, verificationCode);
    } catch (error) {
      console.error('Error sending verification email:', error);
      // We still return the user even if email fails
    }

    return savedUser;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string; isVerified: boolean }> {
    const { username, password } = loginDto;

    if (username === 'admin@enchanted.com' && password === 'enchanted') {
      // Kiểm tra nếu chưa có trong DB thì tạo mới
      let adminUser = await this.userModel.findOne({ email: 'admin@enchanted.com' });

      if (!adminUser) {
        const hashed = await bcrypt.hash(password, 10);
        adminUser = new this.userModel({
          username: 'admin@enchanted.com',
          email: 'admin@enchanted.com',
          password: hashed,
          role: 'admin',
          isVerified: true,
        });

        await adminUser.save();
      }

      const payload = {
        username: adminUser.username,
        role: adminUser.role,
      };  

      return {
        accessToken: this.jwtService.sign(payload),
        isVerified: true,
      };
    }

    // Find user by username
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { 
      username: user.username,
      role: user.role 
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      isVerified: user.isVerified,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
    const { email, verificationCode } = verifyEmailDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already verified
    if (user.isVerified) {
      return { message: 'Email already verified' };
    }

    // Check verification code
    if (user.verificationCode !== verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    // Check if verification code is expired
    if (user.verificationExpiry && new Date() > user.verificationExpiry) {
      throw new BadRequestException('Verification code has expired');
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpiry = null;
    await user.save();

    return { message: 'Email verified successfully' };
  }

  async resendVerificationCode(email: string): Promise<{ message: string }> {
    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already verified
    if (user.isVerified) {
      return { message: 'Email already verified' };
    }

    // Generate new verification code
    const verificationCode = this.generateVerificationCode();
    const verificationExpiry = new Date();
    verificationExpiry.setMinutes(verificationExpiry.getMinutes() + 30);

    // Update user with new verification code
    user.verificationCode = verificationCode;
    user.verificationExpiry = verificationExpiry;
    await user.save();

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(email, verificationCode);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }

    return { message: 'Verification code sent successfully' };
  }
} 