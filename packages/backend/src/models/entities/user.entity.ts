import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class Address {
  @Prop({ required: true })
  id: string;
  
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: false })
  company: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: false })
  apartment: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

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

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];

  @Prop({ default: null })
  defaultAddressId: string;

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