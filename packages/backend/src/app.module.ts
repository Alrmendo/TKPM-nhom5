import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { AdminModule } from './modules/admin/admin.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { EmailModule } from './modules/email/email.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    DatabaseModule,
    AuthModule,
    CloudinaryModule,
    AdminModule,
    EmailModule,
    UserModule,
  ],
})
export class AppModule {}
