import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DressDocument = Dress & Document;

@Schema()
export class Dress {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dailyRentalPrice: number;

  @Prop({ required: true })
  purchasePrice: number;

  @Prop({
    type: [{
      username: String,
      rate: { type: Number, min: 1, max: 5 }
    }],
    default: []
  })
  ratings: {
    username: string;
    rate: number;
  }[];

  @Prop({
    type: [{
      username: String,
      reviewText: String,
      icon: String,
      date: Date
    }],
    default: []
  })
  reviews: {
    username: string;
    reviewText: string;
    icon?: string;
    date: Date;
  }[];

  @Prop({
    type: [{
      size: { type: Types.ObjectId, ref: 'Size' },
      color: { type: Types.ObjectId, ref: 'Color' },
      stock: Number
    }],
    default: []
  })
  variants: {
    size: Types.ObjectId;
    color: Types.ObjectId;
    stock: number;
  }[];

  @Prop()
  rentalStartDate: Date;

  @Prop()
  rentalEndDate: Date;

  @Prop({
    type: {
      productDetail: String,
      sizeAndFit: String,
      description: String
    }
  })
  description: {
    productDetail: string;
    sizeAndFit: string;
    description: string;
  };

  @Prop({ type: [String] })
  images: string[];

  @Prop()
  style: string;

  @Prop()
  material: string;
}

export const DressSchema = SchemaFactory.createForClass(Dress);
