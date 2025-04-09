import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Size, SizeSchema } from '../../models/entities/size.entity';
import { Color, ColorSchema } from '../../models/entities/color.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Size.name, schema: SizeSchema },
      { name: Color.name, schema: ColorSchema },
    ]),
  ],
  controllers: [AdminController]
})
export class AdminModule {}
