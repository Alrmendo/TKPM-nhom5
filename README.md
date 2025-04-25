# TKPM-nhom5 Monorepo

Monorepo cho dự án TKPM-nhom5, bao gồm cả frontend và backend.

## Cấu trúc dự án

```
./
├── packages/
│   ├── backend/     # NestJS backend application
│   └── frontend/    # Frontend application
├── package.json     # Root package.json cho quản lý monorepo
└── turbo.json      # Cấu hình Turborepo
```

## Bắt đầu

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy môi trường development:
```bash
npm run dev
```

3. Build tất cả packages:
```bash
npm run build
```

4. Chạy tests:
```bash
npm run test
```

5. Lint code:
```bash
npm run lint
```

## Lệnh cho từng package

Bạn có thể chạy lệnh cho package cụ thể bằng workspace prefix:

```bash
# Backend commands
npm run dev -w @tkpm-nhom5/backend

# Frontend commands
npm run dev -w @tkpm-nhom5/frontend
```

## Backend API Documentation

Sau khi chạy backend, bạn có thể truy cập Swagger UI tại:
http://localhost:5000/api

## Môi trường

Tạo file `.env` trong thư mục packages/backend với các biến môi trường sau:

```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/tkpm-db
```

## Development

Dự án này sử dụng [Turborepo](https://turbo.build/) để quản lý cấu trúc monorepo. Mỗi package có thể được phát triển độc lập trong khi vẫn chia sẻ cấu hình và dependencies chung.
