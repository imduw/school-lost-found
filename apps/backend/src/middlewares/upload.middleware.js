const fs = require('fs');
const path = require('path');
const multer = require('multer');

const ITEM_UPLOAD_DIR = path.resolve(__dirname, '../../uploads/items');
const PROOF_UPLOAD_DIR = path.resolve(__dirname, '../../uploads/proofs');

fs.mkdirSync(ITEM_UPLOAD_DIR, { recursive: true });
fs.mkdirSync(PROOF_UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const createImageUploadMiddleware = (targetDir, prefix, fieldSpecs) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, targetDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${prefix}-${uniqueSuffix}${ext}`);
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
      files: 5,
    },
  }).fields(fieldSpecs);

  return (req, res, next) => {
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
          message = 'Chỉ được tải lên tối đa 5 ảnh cho mỗi yêu cầu';
        }

        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message,
          },
        });
      }

      const collected = [];
      for (const spec of fieldSpecs) {
        if (req.files && req.files[spec.name]) {
          collected.push(...req.files[spec.name]);
        }
      }
      req.uploadedFiles = collected;
      return next();
    });
  };
};

const handleItemImageUpload = createImageUploadMiddleware(ITEM_UPLOAD_DIR, 'item', [
  { name: 'images', maxCount: 5 },
  { name: 'image', maxCount: 1 },
]);

const handleClaimProofUpload = createImageUploadMiddleware(PROOF_UPLOAD_DIR, 'proof', [
  { name: 'proofImages', maxCount: 5 },
  { name: 'images', maxCount: 5 },
]);

module.exports = {
  handleItemImageUpload,
  handleClaimProofUpload,
  UPLOAD_DIR: ITEM_UPLOAD_DIR,
  PROOF_UPLOAD_DIR,
};
