import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  UNDER_REVIEW = 'under-review'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
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
  
  @Prop({ type: String, default: 'rent', enum: ['rent', 'buy'] })
  purchaseType: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema()
export class Address {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  company: string;

  @Prop({ required: true })
  address: string;

  @Prop()
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
export class PaymentMethod {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, enum: ['credit_card', 'paypal', 'cash_on_delivery'] })
  type: string;

  @Prop()
  last4: string;

  @Prop()
  cardBrand: string;

  @Prop()
  expiryDate: string;
}

export const PaymentMethodSchema = SchemaFactory.createForClass(PaymentMethod);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  orderNumber: string;

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

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ required: true })
  totalAmount: number;
  
  @Prop()
  remainingPayment: number;
  
  @Prop({ enum: ['perfect', 'good', 'damaged'] })
  returnCondition: string;
  
  @Prop()
  damageDescription: string;
  
  @Prop()
  additionalCharges: number;

  @Prop()
  notes: string;

  @Prop({ type: AddressSchema })
  shippingAddress: Address;

  @Prop({ type: PaymentMethodSchema })
  paymentMethod: PaymentMethod;
}

export const OrderSchema = SchemaFactory.createForClass(Order);