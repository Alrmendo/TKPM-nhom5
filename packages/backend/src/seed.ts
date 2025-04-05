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

  // Xóa dữ liệu cũ
  await colorModel.deleteMany({});
  await sizeModel.deleteMany({});
  await dressModel.deleteMany({});

  // Tạo dữ liệu mẫu cho Colors (ví dụ: 4 màu)
  const colorsData = [
    { name: 'Đỏ', hexCode: '#FF0000' },
    { name: 'Đen', hexCode: '#000000' },
    { name: 'Xanh', hexCode: '#0000FF' },
    { name: 'Vàng', hexCode: '#FFFF00' },
  ];
  const colors = await colorModel.insertMany(colorsData);

  // Tạo dữ liệu mẫu cho Sizes (ví dụ: 4 kích cỡ)
  const sizesData = [
    { label: 'S' },
    { label: 'M' },
    { label: 'L' },
    { label: 'XL' },
  ];
  const sizes = await sizeModel.insertMany(sizesData);

  // Helper function: lấy random phần tử từ mảng
  const randomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

  // Hàm tạo variants cho dress, mỗi dress có nhiều variant
  const createVariants = () => {
    const variants = [];
    // Mỗi dress có 6-8 variant
    const variantCount = Math.floor(Math.random() * 3) + 6;
    for (let i = 0; i < variantCount; i++) {
      variants.push({
        size: randomItem(sizes)._id,
        color: randomItem(colors)._id,
        stock: Math.floor(Math.random() * 5) + 1, // stock từ 1 đến 5
      });
    }
    return variants;
  };

  type pairImage = {
    first: string,
    second: string
  }
  let imageUrls: pairImage[] = [
    {
      first: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxLo6dympOSSVBvR7S5XqohQO-GNQDUqztxQ&s',
      second: 'https://aocuoileman.com/wp-content/uploads/2020/04/chup-hinh-co-dau-don-13.jpg'
    },
    {
      first: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlAeBFnlEICTV52GB3YOoPcINKrBgVnsRmYQ&s',
      second: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5feChCwaPSQ6HkP8mDidFFa4fRGFfTx9TmA&s'
    },
    {
      first: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIVFXP8CYhZ8x1R-HOzynRDYEbHuKfyZ64pQ&s',
      second: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIVFXP8CYhZ8x1R-HOzynRDYEbHuKfyZ64pQ&s'
    },
    {
      first: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2AhYXoWXxl8G9iGAEYjlZTW2Aek2JROV-7w&s',
      second: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1E33MSVa7z5DGwjGZwOhha1p__t9c1wgh6Q&s'
    },
    {
      first: 'https://tiemchupanh.com/wp-content/uploads/2022/10/u4g3niube3pmjy7ur8z1641979636001.jpg',
      second: 'https://tonywedding.vn/wp-content/uploads/2021/12/TONYWEDDING-8-3.jpg'
    },
  ]
  // Tạo dữ liệu mẫu cho Dresses (ví dụ: 5 dress)
  const dressesData = [];
  for (let i = 0; i < 5; i++) {
    dressesData.push({
      name: `Dress ${i}`,
      dailyRentalPrice: 30 + i * 10, // ví dụ: 40, 50, 60...
      purchasePrice: 100 + i * 50,    // ví dụ: 150, 200, 250...
      ratings: [
        { username: `user${i}a`, rate: Math.floor(Math.random() * 5) + 1 },
        { username: `user${i}b`, rate: Math.floor(Math.random() * 5) + 1 },
      ],
      reviews: [
        {
          username: `user${i}a`,
          reviewText: `Review cho Dress ${i} - rất ấn tượng!`,
          icon: '👍',
          date: new Date(),
        },
        {
          username: `user${i}b`,
          reviewText: `Review cho Dress ${i} - chất lượng tuyệt vời.`,
          icon: '❤️',
          date: new Date(),
        },
      ],
      variants: createVariants(),
      rentalStartDate: new Date(),
      rentalEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      description: {
        productDetail: `Chi tiết sản phẩm cho Dress ${i}: chất liệu cao cấp, may tỉ mỉ.`,
        sizeAndFit: `Size & Fit cho Dress ${i}: phù hợp với nhiều dáng người.`,
        description: `Mô tả sản phẩm Dress ${i}: thanh lịch, hiện đại, phù hợp với nhiều dịp.`,
      },
      images: [
        imageUrls[i].first,
        imageUrls[i].second,
      ],
      style: randomItem(['Casual', 'Elegant', 'Vintage', 'Modern']),
      material: randomItem(['Cotton', 'Silk', 'Polyester', 'Linen']),
    });
  }

  await dressModel.insertMany(dressesData);

  console.log('Seed data created successfully.');
  process.exit();
}

bootstrap();
