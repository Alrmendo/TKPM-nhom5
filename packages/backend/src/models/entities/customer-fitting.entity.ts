import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types as MongooseSchema } from 'mongoose';

@Schema()
export class Measurement {
  @Prop({ required: true, type: Number })
  bust: number;

  @Prop({ required: true, type: Number })
  waist: number;

  @Prop({ required: true, type: Number })
  hips: number;

  @Prop({ required: true, type: Number })
  height: number;

  @Prop({ type: Number })
  shoulderWidth: number;

  @Prop({ type: Number })
  armLength: number;

  @Prop({ type: Number })
  legLength: number;

  @Prop({ type: String })
  notes: string;
}

const MeasurementSchema = SchemaFactory.createForClass(Measurement);

@Schema({ timestamps: true })
export class CustomerFitting extends Document {
  @Prop({ type: MongooseSchema.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, type: String })
  customerName: string;

  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  phone: string;

  @Prop({ type: MeasurementSchema, required: true })
  measurements: Measurement;

  @Prop({ type: [String], default: [] })
  preferredStyles: string[];

  @Prop({ 
    type: String, 
    enum: ['Traditional', 'Modern', 'Beach', 'Garden', 'Classic', 'Vintage', 'Artistic', 'Minimalist'],
    required: true
  })
  photographyConcept: string;

  @Prop({ type: [String], default: [] })
  photoReferenceUrls: string[];

  @Prop({ 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending',
    required: true 
  })
  status: string;

  @Prop({ type: Date })
  appointmentDate: Date;

  @Prop({ type: String })
  notes: string;
}

export const CustomerFittingSchema = SchemaFactory.createForClass(CustomerFitting); 