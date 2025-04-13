import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  email?: string;

  @Prop()
  address?: string;

  @Prop()
  city?: string;

  @Prop()
  postalCode?: string;

  @Prop()
  notes?: string;

  @Prop({ default: false })
  isContacted: boolean;

  @Prop({ default: 'pending' })
  status: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact); 