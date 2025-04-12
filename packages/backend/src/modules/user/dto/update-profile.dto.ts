import { IsEmail, IsOptional, IsString, MinLength, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;
}

export class AddressDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  apartment?: string;

  @IsString()
  city: string;

  @IsString()
  province: string;

  @IsString()
  postalCode: string;

  @IsString()
  phone: string;

  @IsString()
  country: string;
}

export class AddAddressDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
  
  @IsOptional()
  @IsBoolean()
  setAsDefault?: boolean;
}

export class UpdateAddressDto {
  @IsString()
  addressId: string;
  
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
  
  @IsOptional()
  @IsBoolean()
  setAsDefault?: boolean;
}

export class DeleteAddressDto {
  @IsString()
  addressId: string;
}

export class SetDefaultAddressDto {
  @IsString()
  addressId: string;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;
}

export class UpdateUsernameDto {
  @IsString()
  @MinLength(3)
  newUsername: string;

  @IsString()
  password: string;
} 