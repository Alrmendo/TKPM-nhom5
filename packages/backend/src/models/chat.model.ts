import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  senderId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  receiverId: string | null;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: 'user' })
  senderRole: string; // 'user' or 'admin'
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
