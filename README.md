# TKPM-nhom5 Monorepo - Hệ thống Quản lý, đặt mua Áo cưới và Dịch vụ Chụp ảnh

Monorepo cho dự án TKPM-nhom5, bao gồm cả frontend và backend cho hệ thống quản lý studio áo cưới và dịch vụ chụp ảnh.

## Cấu trúc dự án

```
./
├── packages/
│   ├── backend/     # NestJS backend application
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── admin/        # Quản lý admin
│   │   │   │   ├── appointment/  # Đặt lịch hẹn
│   │   │   │   ├── auth/         # Xác thực người dùng
│   │   │   │   ├── cart/         # Giỏ hàng
│   │   │   │   ├── chat/         # Hệ thống chat
│   │   │   │   ├── cloudinary/   # Quản lý upload hình ảnh
│   │   │   │   ├── contact/      # Form liên hệ
│   │   │   │   ├── database/     # Kết nối DB
│   │   │   │   ├── dress/        # Quản lý áo cưới
│   │   │   │   ├── email/        # Dịch vụ email
│   │   │   │   ├── order/        # Quản lý đơn hàng
│   │   │   │   ├── payment/      # Thanh toán
│   │   │   │   ├── photography/  # Dịch vụ chụp ảnh
│   │   │   │   ├── rental/       # Thuê áo cưới
│   │   │   │   ├── review/       # Đánh giá
│   │   │   │   └── user/         # Quản lý người dùng
│   └── frontend/    # React frontend application
├── package.json     # Root package.json cho quản lý monorepo
└── turbo.json      # Cấu hình Turborepo
```

## Yêu cầu hệ thống

- Node.js (v18.x hoặc cao hơn)
- npm (v9.x hoặc cao hơn)
- MongoDB (v6.x hoặc cao hơn)

## Bắt đầu

### 1. Cài đặt dependencies:

```bash
npm install
```

### 2. Cấu hình môi trường:

Tạo file `.env` trong thư mục `packages/backend` dựa trên file `.env.example` với các biến môi trường sau:

```env
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Base URL
FRONTEND_URL=http://localhost:5173
BASE_URL=http://localhost:5001

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_SECURE=true

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@example.com
```

### 3. Khởi động MongoDB:

Đảm bảo MongoDB đang chạy trên máy tính của bạn hoặc kết nối đến MongoDB Atlas.

### 4. Chạy ứng dụng trong môi trường development:

Sử dụng hai terminal riêng biệt để chạy frontend và backend:

**Terminal 1 - Backend:**
```bash
# Di chuyển vào thư mục backend
cd packages/backend

# Chạy backend ở chế độ development
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
# Di chuyển vào thư mục frontend
cd packages/frontend

# Chạy frontend
npm run dev
```

Sau khi chạy:
- Backend sẽ chạy tại: http://localhost:3000
- Frontend sẽ chạy tại: http://localhost:5173

**Thông tin tài khoản Admin:**
- Email: admin@enchanted.com
- Mật khẩu: enchanted

## Build và triển khai

### 1. Build tất cả packages:

```bash
npm run build
```

### 2. Chạy ứng dụng trong môi trường production:

```bash
# Chạy backend ở chế độ production
npm run start:prod -w @tkpm-nhom5/backend
```

## API Documentation

Sau khi chạy backend, bạn có thể truy cập Swagger UI API documentation tại:

```
http://localhost:3000/api
```

## Các tính năng chính

### Backend

1. **Quản lý người dùng và xác thực**
   - Đăng ký, đăng nhập
   - Phân quyền (Admin, Khách hàng)
   - Quản lý thông tin cá nhân

2. **Quản lý dịch vụ chụp ảnh**
   - Tạo/sửa/xóa gói dịch vụ chụp ảnh
   - Quản lý đặt lịch chụp ảnh
   - Cập nhật trạng thái dịch vụ

3. **Quản lý áo cưới**
   - Tạo/sửa/xóa thông tin áo cưới
   - Quản lý thuê áo cưới
   - Upload hình ảnh với Cloudinary

4. **Hệ thống chat**
   - Chat trực tiếp giữa khách hàng và admin
   - Quản lý cuộc trò chuyện

5. **Thanh toán và đơn hàng**
   - Thanh toán qua Stripe
   - Quản lý đơn hàng, trạng thái đơn hàng
   - Gửi email xác nhận đơn hàng

### Frontend

1. **Giao diện người dùng hiện đại**
   - Responsive design
   - Authentication với JWT
   - Trang quản trị cho admin

2. **Tính năng cho khách hàng**
   - Tìm kiếm và lọc dịch vụ/sản phẩm
   - Xem chi tiết áo cưới và dịch vụ
   - Đặt lịch chụp ảnh và thuê áo cưới
   - Quản lý giỏ hàng và thanh toán

## Cơ sở dữ liệu

Hệ thống sử dụng MongoDB với các collection chính:

1. **users** - Quản lý người dùng và admin
2. **dresses** - Thông tin về các mẫu áo cưới
3. **photographyServices** - Các gói dịch vụ chụp ảnh
4. **photographyBookings** - Thông tin đặt lịch chụp ảnh
5. **appointments** - Lịch hẹn thử áo và tham quan
6. **orders** - Đơn hàng đặt/thuê áo cưới
7. **carts** - Giỏ hàng của người dùng
8. **reviews** - Đánh giá của khách hàng
9. **chats** - Lưu trữ tin nhắn trao đổi

## Công nghệ sử dụng

### Backend
- NestJS
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (real-time chat)
- Nodemailer
- Cloudinary
- Stripe Payment

### Frontend
- React
- TypeScript
- TailwindCSS
- Material UI
- Axios
- React Router
- Socket.io Client
- Chart.js

## Development

Dự án này sử dụng [Turborepo](https://turbo.build/) để quản lý cấu trúc monorepo. Mỗi package có thể được phát triển độc lập trong khi vẫn chia sẻ cấu hình và dependencies chung.

## Contributors

- Nhóm 5 - Thiết kế Phần mềm
