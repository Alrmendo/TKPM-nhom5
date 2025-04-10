import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Size {
  @Prop({ required: true })
  label: string; // S, M, L, XL...
}

export const SizeSchema = SchemaFactory.createForClass(Size);
