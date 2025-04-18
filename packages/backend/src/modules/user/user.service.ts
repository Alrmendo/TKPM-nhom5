import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, Address } from '../../models/entities/user.entity';
import { 
  UpdateProfileDto, 
  UpdatePasswordDto, 
  UpdateUsernameDto,
  AddAddressDto,
  UpdateAddressDto,
  DeleteAddressDto,
  SetDefaultAddressDto 
} from './dto/update-profile.dto';

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
  
  async findById(userId: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Invalid user ID or user not found`);
    }
  }

  async getProfile(username: string): Promise<any> {
    const user = await this.findByUsername(username);
    const { password, verificationCode, verificationExpiry, ...userProfile } = user.toObject();
    return userProfile;
  }

  // Get only public profile information for a user by username
  async getPublicProfile(username: string): Promise<any> {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Return only public fields
    return {
      username: user.username,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      profileImage: user.profileImageUrl || null,
      role: user.role
    };
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

  // Address management methods
  async addAddress(username: string, addAddressDto: AddAddressDto): Promise<any> {
    const user = await this.findByUsername(username);
    
    // Create new address with unique ID
    const addressId = new Date().getTime().toString();
    
    // Create a properly typed Address object
    const newAddress = {
      id: addressId,
      firstName: addAddressDto.address.firstName,
      lastName: addAddressDto.address.lastName,
      company: addAddressDto.address.company || '',
      address: addAddressDto.address.address,
      apartment: addAddressDto.address.apartment || '',
      city: addAddressDto.address.city,
      province: addAddressDto.address.province,
      postalCode: addAddressDto.address.postalCode,
      phone: addAddressDto.address.phone,
      country: addAddressDto.address.country
    } as Address;
    
    // Add address to user's addresses
    if (!user.addresses) {
      user.addresses = [];
    }
    
    user.addresses.push(newAddress);
    
    // If this is the first address or setAsDefault is true, set as default
    if (addAddressDto.setAsDefault || user.addresses.length === 1) {
      user.defaultAddressId = addressId;
    }
    
    user.updatedAt = new Date();
    await user.save();
    
    const { password, verificationCode, verificationExpiry, ...userProfile } = user.toObject();
    return userProfile;
  }
  
  async updateAddress(username: string, updateAddressDto: UpdateAddressDto): Promise<any> {
    const user = await this.findByUsername(username);
    const { addressId, address, setAsDefault } = updateAddressDto;
    
    // Find address by ID
    const addressIndex = user.addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }
    
    // Update address with proper typing
    user.addresses[addressIndex] = {
      id: addressId,
      firstName: address.firstName,
      lastName: address.lastName,
      company: address.company || '',
      address: address.address,
      apartment: address.apartment || '',
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      phone: address.phone,
      country: address.country
    } as Address;
    
    // If setAsDefault is true, update defaultAddressId
    if (setAsDefault) {
      user.defaultAddressId = addressId;
    }
    
    user.updatedAt = new Date();
    await user.save();
    
    const { password, verificationCode, verificationExpiry, ...userProfile } = user.toObject();
    return userProfile;
  }
  
  async deleteAddress(username: string, deleteAddressDto: DeleteAddressDto): Promise<any> {
    const user = await this.findByUsername(username);
    const { addressId } = deleteAddressDto;
    
    // Check if address exists
    const addressIndex = user.addresses.findIndex(addr => addr.id === addressId);
    if (addressIndex === -1) {
      throw new NotFoundException('Address not found');
    }
    
    // Remove address
    user.addresses = user.addresses.filter(addr => addr.id !== addressId);
    
    // If deleted address was the default, set a new default if addresses exist
    if (user.defaultAddressId === addressId && user.addresses.length > 0) {
      user.defaultAddressId = user.addresses[0].id;
    } else if (user.addresses.length === 0) {
      user.defaultAddressId = null;
    }
    
    user.updatedAt = new Date();
    await user.save();
    
    const { password, verificationCode, verificationExpiry, ...userProfile } = user.toObject();
    return userProfile;
  }
  
  async setDefaultAddress(username: string, setDefaultAddressDto: SetDefaultAddressDto): Promise<any> {
    const user = await this.findByUsername(username);
    const { addressId } = setDefaultAddressDto;
    
    // Check if address exists
    const addressExists = user.addresses.some(addr => addr.id === addressId);
    if (!addressExists) {
      throw new NotFoundException('Address not found');
    }
    
    // Set as default
    user.defaultAddressId = addressId;
    
    user.updatedAt = new Date();
    await user.save();
    
    const { password, verificationCode, verificationExpiry, ...userProfile } = user.toObject();
    return userProfile;
  }
  
  async getAddresses(username: string): Promise<any> {
    const user = await this.findByUsername(username);
    
    return {
      addresses: user.addresses || [],
      defaultAddressId: user.defaultAddressId
    };
  }
} 