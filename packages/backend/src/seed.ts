import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Color } from './models/entities/color.entity';
import { Size } from './models/entities/size.entity';
import { Dress } from './models/entities/dress.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const colorModel = app.get<Model<Color>>(getModelToken(Color.name));
  const sizeModel = app.get<Model<Size>>(getModelToken(Size.name));
  const dressModel = app.get<Model<Dress>>(getModelToken(Dress.name));

  // Kiểm tra xem đã có dữ liệu hay chưa
  const colorsCount = await colorModel.countDocuments();
  const sizesCount = await sizeModel.countDocuments();

  if (colorsCount === 0) {
    console.log('Seeding colors...');
    // Tạo dữ liệu mẫu cho Colors
    const colorsData = [
      { name: 'Đỏ', hexCode: '#FF0000' },
      { name: 'Đen', hexCode: '#000000' },
      { name: 'Xanh', hexCode: '#0000FF' },
      { name: 'Vàng', hexCode: '#FFFF00' },
      { name: 'Trắng', hexCode: '#FFFFFF' },
      { name: 'Hồng', hexCode: '#FFC0CB' },
      { name: 'Xanh lá', hexCode: '#00FF00' },
      { name: 'Tím', hexCode: '#800080' },
    ];
    await colorModel.insertMany(colorsData);
    console.log('Colors seeded successfully.');
  } else {
    console.log(`Skipping color seeding. ${colorsCount} colors already exist.`);
  }

  if (sizesCount === 0) {
    console.log('Seeding sizes...');
    // Tạo dữ liệu mẫu cho Sizes
    const sizesData = [
      { label: 'XS' },
      { label: 'S' },
      { label: 'M' },
      { label: 'L' },
      { label: 'XL' },
      { label: 'XXL' },
    ];
    await sizeModel.insertMany(sizesData);
    console.log('Sizes seeded successfully.');
  } else {
    console.log(`Skipping size seeding. ${sizesCount} sizes already exist.`);
  }

  // Không thêm dữ liệu váy mẫu nữa - thay vì xóa hết

  console.log('Seed completed successfully.');
  process.exit();
}

bootstrap();
