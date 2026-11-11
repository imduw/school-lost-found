const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOAD_DIR = path.resolve(__dirname, '../../uploads/items');

// Đảm bảo thư mục lưu ảnh luôn tồn tại
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `item-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const err = new Error('Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP hoặc GIF');
    err.code = 'INVALID_FILE_TYPE';
    return cb(err, false);
  }
  return cb(null, true);
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Tối đa 5MB mỗi ảnh
    files: 5, // Tối đa 5 ảnh mỗi lần upload
  },
}).fields([
  { name: 'images', maxCount: 5 },
  { name: 'image', maxCount: 1 },
]);

/**
 * Middleware xử lý upload ảnh multipart/form-data (hỗ trợ cả request JSON thường)
 * Gom danh sách file hợp lệ vào req.uploadedFiles
 */
const handleItemImageUpload = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    req.uploadedFiles = [];
    return next();
  }

  return multerUpload(req, res, (err) => {
    if (err) {
      let message = err.message || 'Lỗi tải ảnh lên máy chủ';
      if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'Kích thước mỗi ảnh không được vượt quá 5MB';
      } else if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
        message = 'Chỉ được tải lên tối đa 5 ảnh cho mỗi tin đăng';
      }

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message,
        },
      });
    }

    const filesFromImages = req.files?.images || [];
    const filesFromImage = req.files?.image || [];
    req.uploadedFiles = [...filesFromImages, ...filesFromImage];
    return next();
  });
};

module.exports = {
  handleItemImageUpload,
  UPLOAD_DIR,
};
