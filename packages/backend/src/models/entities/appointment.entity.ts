import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema()
export class Appointment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  userId: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ required: true })
  time: string;

  @Prop({ 
    required: true, 
    enum: [
      'Wedding Planning',
      'Photography',
      'Venue Booking',
      'Catering Services',
      'Decoration',
      'Wedding Cars'
    ] 
  })
  service: string;

  @Prop({ required: false })
  message: string;

  @Prop({ 
    required: true, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  })
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Dress', required: false })
  dressId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment); 