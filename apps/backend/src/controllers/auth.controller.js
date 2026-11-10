const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { revokeToken } = require('../middlewares/auth.middleware');

/**
 * POST /api/v1/auth/login
 * Xác thực email & password bằng BCrypt, cấp phát JWT token
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Vui lòng nhập đầy đủ email và mật khẩu',
        },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      'SELECT id, email, password_hash, full_name, student_id, phone, role, status FROM users WHERE LOWER(email) = $1',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email hoặc mật khẩu không chính xác',
        },
      });
    }

    const user = result.rows[0];

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_SUSPENDED',
          message: 'Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ quản trị viên',
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email hoặc mật khẩu không chính xác',
        },
      });
    }

    const payload = {
      id: Number(user.id),
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      success: true,
      data: {
        token,
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: {
          id: Number(user.id),
          email: user.email,
          fullName: user.full_name,
          studentId: user.student_id,
          phone: user.phone,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi đăng nhập',
      },
    });
  }
};

/**
 * POST /api/v1/auth/logout
 * Vô hiệu hóa token hiện tại khỏi phiên làm việc
 */
const logout = (req, res) => {
  revokeToken(req.token);
  return res.status(200).json({
    success: true,
    data: {
      message: 'Đăng xuất thành công',
    },
  });
};

/**
 * GET /api/v1/auth/me
 * Lấy thông tin chi tiết tài khoản đang đăng nhập từ token hiện tại
 */
const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, full_name, student_id, phone, role, status, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Không tìm thấy thông tin tài khoản',
        },
      });
    }

    const user = result.rows[0];
    return res.status(200).json({
      success: true,
      data: {
        id: Number(user.id),
        email: user.email,
        fullName: user.full_name,
        studentId: user.student_id,
        phone: user.phone,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi lấy thông tin người dùng',
      },
    });
  }
};

/**
 * POST /api/v1/auth/register
 * Đăng ký tài khoản mới (mặc định gán quyền USER để bảo mật phân quyền server)
 */
const register = async (req, res) => {
  try {
    const { email, password, fullName, studentId, phone } = req.body || {};

    if (!email || !password || !fullName || typeof email !== 'string' || typeof password !== 'string' || typeof fullName !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu',
        },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanFullName = fullName.trim();

    if (!normalizedEmail || !cleanFullName) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email và họ tên không được để trống',
        },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Mật khẩu phải có ít nhất 6 ký tự',
        },
      });
    }

    const existingUser = await pool.query('SELECT id FROM users WHERE LOWER(email) = $1', [normalizedEmail]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email này đã được đăng ký trong hệ thống',
        },
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Phân quyền chặt phía server: tài khoản tự đăng ký luôn có role = 'USER'
    const assignedRole = 'USER';

    const insertResult = await pool.query(
      `
      INSERT INTO users (email, password_hash, full_name, student_id, phone, role, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE')
      RETURNING id, email, full_name, student_id, phone, role, status, created_at
      `,
      [normalizedEmail, passwordHash, cleanFullName, studentId ? String(studentId).trim() : null, phone ? String(phone).trim() : null, assignedRole]
    );

    const newUser = insertResult.rows[0];
    const payload = {
      id: Number(newUser.id),
      email: newUser.email,
      role: newUser.role,
      fullName: newUser.full_name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(201).json({
      success: true,
      data: {
        token,
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: {
          id: Number(newUser.id),
          email: newUser.email,
          fullName: newUser.full_name,
          studentId: newUser.student_id,
          phone: newUser.phone,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi đăng ký tài khoản',
      },
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
