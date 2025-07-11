import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { EmailModule } from './modules/email/email.module';
import { UserModule } from './modules/user/user.module';
import { DressModule } from './modules/dress/dress.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/review/review.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { PhotographyModule } from './modules/photography/photography.module';
import { ChatModule } from './modules/chat/chat.module';

// Thêm vào để chạy seed
import { Color, ColorSchema } from './models/entities/color.entity';
import { Size, SizeSchema } from './models/entities/size.entity';
import { Dress, DressSchema } from './models/entities/dress.entity';
import { Order, OrderSchema } from './models/entities/order.entity';
import { Cart, CartSchema } from './models/entities/cart.entity';
import { Review, ReviewSchema } from './models/entities/review.entity';
import { Appointment, AppointmentSchema } from './models/entities/appointment.entity';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    DatabaseModule,
    AuthModule,
    CloudinaryModule,
    AdminModule,
    EmailModule,
    UserModule,
    DressModule,
    CartModule,
    OrderModule,
    ReviewModule,
    AppointmentModule,
    PhotographyModule,
    ChatModule,

    MongooseModule.forFeature([
      { name: Color.name, schema: ColorSchema },
      { name: Size.name, schema: SizeSchema },
      { name: Dress.name, schema: DressSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
})
export class AppModule {}
