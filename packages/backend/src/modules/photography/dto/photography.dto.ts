import { IsArray, IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { PhotographyPackageType, PhotographyServiceStatus, BookingStatus } from '../../../models/photography.model';
import { Type } from 'class-transformer';

export class CreatePhotographyServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(PhotographyPackageType)
  packageType: PhotographyPackageType;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  photographer?: string;

  @IsOptional()
  @IsEnum(PhotographyServiceStatus)
  status?: PhotographyServiceStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];
}

export class UpdatePhotographyServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(PhotographyPackageType)
  packageType?: PhotographyPackageType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  photographer?: string;

  @IsOptional()
  @IsEnum(PhotographyServiceStatus)
  status?: PhotographyServiceStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];
}

export class CreatePhotographyBookingDto {
  @IsNotEmpty()
  @IsMongoId()
  serviceId: string;
  
  @IsOptional()
  @IsMongoId()
  customerId?: string; // Optional as it can be derived from authenticated user

  @IsNotEmpty()
  @IsDateString()
  shootingDate: string;

  @IsNotEmpty()
  @IsString()
  shootingTime: string;

  @IsNotEmpty()
  @IsString()
  shootingLocation: string;

  @IsOptional()
  @IsString()
  additionalRequests?: string;
}

export class UpdatePhotographyBookingDto {
  @IsOptional()
  @IsDateString()
  shootingDate?: string;

  @IsOptional()
  @IsString()
  shootingTime?: string;

  @IsOptional()
  @IsString()
  shootingLocation?: string;

  @IsOptional()
  @IsString()
  additionalRequests?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class PhotographyBookingQueryDto {
  @IsOptional()
  @IsMongoId()
  customerId?: string;

  @IsOptional()
  @IsMongoId()
  serviceId?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;
}

export class PhotoServiceBookingItem {
  @IsNotEmpty()
  @IsMongoId()
  serviceId: string;

  @IsNotEmpty()
  @IsDateString()
  shootingDate: string;

  @IsOptional()
  @IsString()
  shootingTime?: string;

  @IsNotEmpty()
  @IsString()
  shootingLocation: string;

  @IsOptional()
  @IsString()
  additionalRequests?: string;
}

export class PaymentDetailsDto {
  @IsNotEmpty()
  @IsObject()
  paymentMethod: any;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  depositAmount: number;

  @IsNotEmpty()
  @IsNumber()
  remainingAmount: number;
}

export class CreatePhotographyBookingWithPaymentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhotoServiceBookingItem)
  bookingItems: PhotoServiceBookingItem[];

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails: PaymentDetailsDto;

  @IsNotEmpty()
  @IsObject()
  shippingAddress: any; // Same structure as order address
}
