const jwt = require('jsonwebtoken');

// Lưu tạm danh sách token đã đăng xuất để từ chối nếu dùng lại (phục vụ test TC01)
const revokedTokens = new Set();

const revokeToken = (token) => {
  if (token) {
    revokedTokens.add(token);
  }
};

const isTokenRevoked = (token) => revokedTokens.has(token);

/**
 * Middleware bắt buộc xác thực JWT Token
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Vui lòng đăng nhập để thực hiện thao tác này (thiếu Bearer token)',
      },
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token || isTokenRevoked(token)) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Phiên đăng nhập không hợp lệ hoặc đã đăng xuất',
      },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHENTICATED',
        message: 'Token không hợp lệ hoặc đã hết hạn',
      },
    });
  }
};

/**
 * Middleware xác thực không bắt buộc (dành cho endpoint public cần biết thêm quyền nếu có đăng nhập)
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token || isTokenRevoked(token)) {
    req.user = null;
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    req.token = token;
  } catch (error) {
    req.user = null;
  }

  return next();
};

/**
 * Middleware kiểm tra phân quyền theo Role (VD: requireRole('ADMIN', 'MODERATOR'))
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHENTICATED',
          message: 'Vui lòng đăng nhập trước khi kiểm tra quyền',
        },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Bạn không có quyền truy cập chức năng này',
        },
      });
    }

    return next();
  };
};

module.exports = {
  verifyToken,
  optionalAuth,
  requireRole,
  revokeToken,
  isTokenRevoked,
};
