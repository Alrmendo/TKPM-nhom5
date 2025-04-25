const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục lưu trữ nếu chưa tồn tại
const createUploadDir = (dir) => {
  const uploadDir = path.join(__dirname, '../../public/uploads/', dir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// Cấu hình storage cho Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Xác định thư mục lưu trữ dựa trên route
    let uploadPath = createUploadDir('general');
    
    // Nếu là route review, lưu trong thư mục reviews
    if (req.originalUrl.includes('/review')) {
      uploadPath = createUploadDir('reviews');
    } 
    // Nếu là route dress, lưu trong thư mục dresses
    else if (req.originalUrl.includes('/dress')) {
      uploadPath = createUploadDir('dresses');
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Tạo tên file độc nhất với timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Lọc file, chỉ chấp nhận hình ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png and .webp format allowed!'), false);
  }
};

// Khởi tạo multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // giới hạn 5MB
  }
});

module.exports = upload; 