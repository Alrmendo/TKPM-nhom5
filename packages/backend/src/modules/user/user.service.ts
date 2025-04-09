import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../../models/entities/user.entity';
import { UpdateProfileDto, UpdatePasswordDto, UpdateUsernameDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByUsername(username: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getProfile(username: string): Promise<any> {
    const user = await this.findByUsername(username);
    const { password, verificationCode, verificationExpiry, ...userProfile } = user.toObject();
    return userProfile;
  }

  async updateProfile(username: string, updateProfileDto: UpdateProfileDto): Promise<any> {
    const user = await this.findByUsername(username);
    
    // Update fields
    if (updateProfileDto.firstName !== undefined) user.firstName = updateProfileDto.firstName;
    if (updateProfileDto.lastName !== undefined) user.lastName = updateProfileDto.lastName;
    if (updateProfileDto.phone !== undefined) user.phone = updateProfileDto.phone;
    if (updateProfileDto.dateOfBirth !== undefined) user.dateOfBirth = updateProfileDto.dateOfBirth;
    
    // Don't allow email updates through this method for security reasons
    // Email updates should go through a separate flow with verification
    
    user.updatedAt = new Date();
    await user.save();
    
    const { password, verificationCode, verificationExpiry, ...userProfile } = user.toObject();
    return userProfile;
  }

  async updatePassword(username: string, updatePasswordDto: UpdatePasswordDto): Promise<any> {
    const { currentPassword, newPassword, confirmPassword } = updatePasswordDto;
    
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New password and confirm password do not match');
    }
    
    const user = await this.findByUsername(username);
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    
    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.updatedAt = new Date();
    await user.save();
    
    return { message: 'Password updated successfully' };
  }

  async updateUsername(username: string, updateUsernameDto: UpdateUsernameDto): Promise<any> {
    const { newUsername, password } = updateUsernameDto;
    
    // Check if new username already exists
    const existingUser = await this.userModel.findOne({ username: newUsername });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }
    
    const user = await this.findByUsername(username);
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect');
    }
    
    user.username = newUsername;
    user.updatedAt = new Date();
    await user.save();
    
    const { password: pwd, verificationCode, verificationExpiry, ...userProfile } = user.toObject();
    return userProfile;
  }

  async updateProfileImage(username: string, imageUrl: string): Promise<any> {
    const user = await this.findByUsername(username);
    
    // Update profile image URL
    user.profileImageUrl = imageUrl;
    user.updatedAt = new Date();
    await user.save();
    
    const { password, verificationCode, verificationExpiry, ...userProfile } = user.toObject();
    return userProfile;
  }
} 