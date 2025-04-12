import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Size, SizeSchema } from '../../models/entities/size.entity';
import { Color, ColorSchema } from '../../models/entities/color.entity';
import { User, UserSchema } from '../../models/entities/user.entity';
import { Order, OrderSchema } from '../../models/entities/order.entity';
import { Dress, DressSchema } from '../../models/entities/dress.entity';
import { Appointment, AppointmentSchema } from '../../models/entities/appointment.entity';
import { Contact, ContactSchema } from '../../models/entities/contact.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Size.name, schema: SizeSchema },
      { name: Color.name, schema: ColorSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Dress.name, schema: DressSchema },
      { name: Appointment.name, schema: AppointmentSchema },
      { name: Contact.name, schema: ContactSchema },
    ]),
  ],
  controllers: [AdminController]
})
export class AdminModule {}
