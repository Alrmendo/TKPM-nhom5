import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  UNDER_REVIEW = 'under-review'
}

@Schema()
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Dress', required: true })
  dressId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  pricePerDay: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ 
    type: [{ 
      type: OrderItemSchema 
    }],
    required: true 
  })
  items: OrderItem[];

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  arrivalDate: Date;

  @Prop()
  returnDate: Date;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Prop({ required: true })
  totalAmount: number;

  @Prop()
  notes: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order); 