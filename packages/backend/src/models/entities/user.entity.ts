import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;
  
  @Prop({ default: '' })
  firstName: string;
  
  @Prop({ default: '' })
  lastName: string;
  
  @Prop({ default: '' })
  phone: string;
  
  @Prop({ default: '' })
  dateOfBirth: string;
  
  @Prop({ default: '' })
  profileImageUrl: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: 'user' })
  role: 'user' | 'admin';
  
  @Prop({ type: String, nullable: true })
  verificationCode: string | null;
  
  @Prop({ type: Date, nullable: true })
  verificationExpiry: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User); 