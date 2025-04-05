import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

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