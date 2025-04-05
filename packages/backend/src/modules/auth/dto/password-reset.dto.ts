import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RequestPasswordResetDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  resetCode: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
} 