import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DressController } from './dress.controller';
import { DressService } from './dress.service';
import { Dress, DressSchema } from '../../models/entities/dress.entity';
import { Size, SizeSchema } from '../../models/entities/size.entity';
import { Color, ColorSchema } from '../../models/entities/color.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dress.name, schema: DressSchema },
      { name: Size.name, schema: SizeSchema },
      { name: Color.name, schema: ColorSchema },
    ]),
    CloudinaryModule,
  ],
  controllers: [DressController],
  providers: [DressService],
  exports: [DressService],
})
export class DressModule {} 