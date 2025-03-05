# TKPM-nhom5
# Cấu trúc thư mục đồ án đề xuất
```
TKPM-NHOM5/
├── public/                     # Tệp tĩnh (favicon, hình ảnh...)
├── src/
│   ├── assets/                  # Ảnh, icons, fonts, CSS global... phải import
│   ├── components/              # Các component tái sử dụng
│   ├── layouts/                  # Layouts (Header, Footer, Sidebar...)
│   ├── pages/                    # Các page chính (Home, Login, Dashboard...)
│   ├── routes/                   # Định nghĩa route (tuỳ chọn)
│   ├── services/                 # Các hàm gọi API
│   ├── hooks/                    # Custom hooks
│   ├── utils/                    # Hàm tiện ích chung
│   ├── App.jsx                    # Component gốc của App
│   ├── main.jsx                   # Điểm khởi chạy của ứng dụng
│   └── index.css                  # File CSS gốc
├── .gitignore                    # Bỏ qua file/thư mục khi commit
├── index.html                    # File HTML chính (gắn root #app)
├── package.json                  # Khai báo dependency
├── README.md                     # Mô tả project
├── vite.config.js                 # Config cho Vite
└── eslint.config.js             # Nơi hỗ trợ phát hiện lỗi compile time
```

