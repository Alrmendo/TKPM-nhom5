import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Reply {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, trim: true })
  replyText: string;

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  icon?: string;
}

const ReplySchema = SchemaFactory.createForClass(Reply);

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Dress', required: true })
  dressId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true, trim: true })
  reviewText: string;

  @Prop([String])
  images: string[];

  @Prop({ default: Date.now })
  date: Date;

  @Prop()
  icon?: string;

  @Prop({ type: [ReplySchema], default: [] })
  replies: Reply[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ dressId: 1 }); 