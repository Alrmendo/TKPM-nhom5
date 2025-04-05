import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Color {
  @Prop({ required: true })
  name: string; // ví dụ: "Đỏ", "Đen"
  @Prop()
  hexCode: string; // #FF0000
}

export const ColorSchema = SchemaFactory.createForClass(Color);
