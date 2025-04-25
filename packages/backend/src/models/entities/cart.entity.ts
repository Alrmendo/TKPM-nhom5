import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema()
export class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Dress', required: true })
  dressId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Size', required: true })
  sizeId: Types.ObjectId;

  @Prop({ required: true })
  sizeName: string;

  @Prop({ type: Types.ObjectId, ref: 'Color', required: true })
  colorId: Types.ObjectId;

  @Prop({ required: true })
  colorName: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  pricePerDay: number;
  
  @Prop({ type: String, default: 'rent', enum: ['rent', 'buy'] })
  purchaseType: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop()
  arrivalDate: Date;

  @Prop()
  returnDate: Date;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ 
    type: [{ 
      type: CartItemSchema 
    }],
    default: [] 
  })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart); 