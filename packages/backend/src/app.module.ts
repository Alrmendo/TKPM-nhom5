import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { EmailModule } from './modules/email/email.module';
import { UserModule } from './modules/user/user.module';
import { DressModule } from './modules/dress/dress.module';

// Thêm vào để chạy seed
import { Color, ColorSchema } from './models/entities/color.entity';
import { Size, SizeSchema } from './models/entities/size.entity';
import { Dress, DressSchema } from './models/entities/dress.entity';
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

    MongooseModule.forRoot('mongodb+srv://enchanted:2zlpDUeMpcTvv4X7@enchanted.ss8ztcz.mongodb.net/enchanted'),
    MongooseModule.forFeature([
      { name: Color.name, schema: ColorSchema },
      { name: Size.name, schema: SizeSchema },
      { name: Dress.name, schema: DressSchema },
    ]),
  ],
})
export class AppModule {}
