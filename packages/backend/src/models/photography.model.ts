import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './entities/user.entity';

export enum PhotographyPackageType {
  PRE_WEDDING = 'Pre-Wedding',
  WEDDING_DAY = 'Wedding Day',
  STUDIO = 'Studio',
  OUTDOOR = 'Outdoor',
  CUSTOM = 'Custom',
}

export enum PhotographyServiceStatus {
  AVAILABLE = 'Available',
  PAUSED = 'Paused',
  BOOKED = 'Booked',
}

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed',
}

@Schema({ timestamps: true })
export class PhotographyService extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ 
    required: true, 
    enum: PhotographyPackageType,
    default: PhotographyPackageType.WEDDING_DAY 
  })
  packageType: PhotographyPackageType;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  duration: string;

  @Prop()
  location: string;

  @Prop()
  photographer: string;

  @Prop({ 
    required: true,
    enum: PhotographyServiceStatus,
    default: PhotographyServiceStatus.AVAILABLE
  })
  status: PhotographyServiceStatus;

  @Prop()
  imageUrls: string[];

  @Prop()
  features: string[];
}

@Schema({ timestamps: true })
export class PhotographyBooking extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  customerId: MongooseSchema.Types.ObjectId | User;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'PhotographyService' })
  serviceId: MongooseSchema.Types.ObjectId | PhotographyService;

  @Prop({ required: true })
  bookingDate: Date;

  @Prop({ required: true })
  shootingDate: Date;

  @Prop()
  shootingTime: string;

  @Prop()
  shootingLocation: string;

  @Prop()
  additionalRequests: string;

  @Prop({ 
    required: true,
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @Prop()
  notes: string;
}

export const PhotographyServiceSchema = SchemaFactory.createForClass(PhotographyService);
export const PhotographyBookingSchema = SchemaFactory.createForClass(PhotographyBooking);
