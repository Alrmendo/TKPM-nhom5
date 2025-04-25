import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PhotographyService } from './photography.service';
import { PhotographyController, AdminPhotographyController } from './photography.controller';
import { 
  PhotographyService as PhotographyServiceModel,
  PhotographyServiceSchema,
  PhotographyBooking,
  PhotographyBookingSchema
} from '../../models/photography.model';
import { PhotographySeedService } from './photography-seed';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhotographyServiceModel.name, schema: PhotographyServiceSchema },
      { name: PhotographyBooking.name, schema: PhotographyBookingSchema }
    ]),
    CloudinaryModule
  ],
  controllers: [PhotographyController, AdminPhotographyController],
  providers: [PhotographyService, PhotographySeedService],
  exports: [PhotographyService, PhotographySeedService]
})
export class PhotographyModule {}
