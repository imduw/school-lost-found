const pool = require('../config/db');

const slugify = (text) =>
  String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

/**
 * GET /api/v1/admin/stats
 * Thống kê tổng quan cho Dashboard Staff / Admin
 */
const getDashboardStats = async (req, res) => {
  try {
    const [usersRes, itemsRes, claimsRes, handoversRes] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'ACTIVE')::int AS active FROM users`),
      pool.query(`
        SELECT 
          COUNT(*) FILTER (WHERE deleted_at IS NULL)::int AS total,
          COUNT(*) FILTER (WHERE deleted_at IS NULL AND item_type = 'LOST')::int AS lost_count,
          COUNT(*) FILTER (WHERE deleted_at IS NULL AND item_type = 'FOUND')::int AS found_count,
          COUNT(*) FILTER (WHERE deleted_at IS NULL AND business_status = 'OPEN')::int AS open_count,
          COUNT(*) FILTER (WHERE deleted_at IS NULL AND business_status = 'CLOSED')::int AS closed_count,
          COUNT(*) FILTER (WHERE deleted_at IS NULL AND publication_status = 'HIDDEN')::int AS hidden_count,
          COUNT(*) FILTER (WHERE deleted_at IS NULL AND publication_status = 'PENDING_REVIEW')::int AS pending_review_count
        FROM items
      `),
      pool.query(`
        SELECT 
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'PENDING')::int AS pending_count,
          COUNT(*) FILTER (WHERE status = 'ACCEPTED')::int AS accepted_count,
          COUNT(*) FILTER (WHERE status = 'REJECTED')::int AS rejected_count
        FROM claims
      `),
      pool.query(`SELECT COUNT(*)::int AS total FROM handovers`),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users: usersRes.rows[0],
        items: {
          total: itemsRes.rows[0].total,
          lostCount: itemsRes.rows[0].lost_count,
          foundCount: itemsRes.rows[0].found_count,
          openCount: itemsRes.rows[0].open_count,
          closedCount: itemsRes.rows[0].closed_count,
          hiddenCount: itemsRes.rows[0].hidden_count,
          pendingReviewCount: itemsRes.rows[0].pending_review_count,
        },
        claims: {
          total: claimsRes.rows[0].total,
          pendingCount: claimsRes.rows[0].pending_count,
          acceptedCount: claimsRes.rows[0].accepted_count,
          rejectedCount: claimsRes.rows[0].rejected_count,
        },
        handoversTotal: handoversRes.rows[0].total,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi lấy thống kê' },
    });
  }
};

/**
 * GET /api/v1/admin/users
 */
const getUsers = async (req, res) => {
  try {
    const { keyword, role, status } = req.query;
    const conditions = ['1 = 1'];
    const params = [];
    let idx = 1;

    if (keyword && keyword.trim() !== '') {
      conditions.push(`(full_name ILIKE $${idx} OR email ILIKE $${idx} OR student_id ILIKE $${idx})`);
      params.push(`%${keyword.trim()}%`);
      idx++;
    }
    if (role && role.trim() !== '') {
      conditions.push(`role = $${idx++}`);
      params.push(role.trim().toUpperCase());
    }
    if (status && status.trim() !== '') {
      conditions.push(`status = $${idx++}`);
      params.push(status.trim().toUpperCase());
    }

    const result = await pool.query(
      `
      SELECT id, email, full_name, student_id, phone, role, status, created_at, updated_at
      FROM users
      WHERE ${conditions.join(' AND ')}
      ORDER BY id ASC
      `,
      params
    );

    return res.status(200).json({
      success: true,
      data: result.rows.map((u) => ({
        id: Number(u.id),
        email: u.email,
        fullName: u.full_name,
        studentId: u.student_id,
        phone: u.phone,
        role: u.role,
        status: u.status,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
      })),
    });
  } catch (error) {
    console.error('Admin get users error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi tải danh sách tài khoản' },
    });
  }
};

/**
 * PATCH /api/v1/admin/users/:id/role
 */
const updateUserRole = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const { role } = req.body || {};
    const nextRole = role ? String(role).trim().toUpperCase() : '';

    if (!Number.isInteger(targetId) || targetId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID tài khoản không hợp lệ' },
      });
    }

    if (!['USER', 'MODERATOR', 'ADMIN'].includes(nextRole)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'role chỉ chấp nhận USER, MODERATOR hoặc ADMIN' },
      });
    }

    if (targetId === Number(req.user.id) && nextRole !== 'ADMIN') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Không thể tự hạ quyền ADMIN của chính mình' },
      });
    }

    const updateRes = await pool.query(
      `
      UPDATE users SET role = $1 WHERE id = $2
      RETURNING id, email, full_name, student_id, phone, role, status, created_at
      `,
      [nextRole, targetId]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Không tìm thấy tài khoản' },
      });
    }

    await pool.query(
      `INSERT INTO audit_logs (actor_id, action, target_type, target_id, details, ip_address) VALUES ($1, 'UPDATE_USER_ROLE', 'USER', $2, $3, $4)`,
      [req.user.id, targetId, `Đổi quyền tài khoản #${targetId} sang ${nextRole}`, req.ip || null]
    );

    const u = updateRes.rows[0];
    return res.status(200).json({
      success: true,
      data: {
        id: Number(u.id),
        email: u.email,
        fullName: u.full_name,
        studentId: u.student_id,
        phone: u.phone,
        role: u.role,
        status: u.status,
      },
    });
  } catch (error) {
    console.error('Update user role error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi đổi quyền tài khoản' },
    });
  }
};

/**
 * PATCH /api/v1/admin/users/:id/status
 */
const updateUserStatus = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const { status } = req.body || {};
    const nextStatus = status ? String(status).trim().toUpperCase() : '';

    if (!Number.isInteger(targetId) || targetId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID tài khoản không hợp lệ' },
      });
    }

    if (!['ACTIVE', 'SUSPENDED'].includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'status chỉ chấp nhận ACTIVE hoặc SUSPENDED' },
      });
    }

    if (targetId === Number(req.user.id) && nextStatus === 'SUSPENDED') {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Không thể tự khóa tài khoản đang đăng nhập của chính mình' },
      });
    }

    const updateRes = await pool.query(
      `
      UPDATE users SET status = $1 WHERE id = $2
      RETURNING id, email, full_name, student_id, phone, role, status
      `,
      [nextStatus, targetId]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Không tìm thấy tài khoản' },
      });
    }

    await pool.query(
      `INSERT INTO audit_logs (actor_id, action, target_type, target_id, details, ip_address) VALUES ($1, 'UPDATE_USER_STATUS', 'USER', $2, $3, $4)`,
      [req.user.id, targetId, `Cập nhật trạng thái tài khoản #${targetId} sang ${nextStatus}`, req.ip || null]
    );

    const u = updateRes.rows[0];
    return res.status(200).json({
      success: true,
      data: {
        id: Number(u.id),
        email: u.email,
        fullName: u.full_name,
        studentId: u.student_id,
        phone: u.phone,
        role: u.role,
        status: u.status,
      },
    });
  } catch (error) {
    console.error('Update user status error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi cập nhật trạng thái tài khoản' },
    });
  }
};

/**
 * GET /api/v1/admin/categories
 */
const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT c.*, COUNT(i.id) FILTER (WHERE i.deleted_at IS NULL)::int AS item_count
      FROM categories c
      LEFT JOIN items i ON i.category_id = c.id
      GROUP BY c.id
      ORDER BY c.id ASC
      `
    );

    return res.status(200).json({
      success: true,
      data: result.rows.map((c) => ({
        id: Number(c.id),
        name: c.name,
        slug: c.slug,
        description: c.description,
        isActive: c.is_active,
        itemCount: c.item_count,
        createdAt: c.created_at,
      })),
    });
  } catch (error) {
    console.error('Admin get categories error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi tải danh mục' },
    });
  }
};

/**
 * POST /api/v1/admin/categories
 */
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, isActive } = req.body || {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Tên danh mục không được để trống' },
      });
    }

    const cleanName = name.trim();
    const cleanSlug = slug && String(slug).trim() ? slugify(slug) : slugify(cleanName);
    const activeVal = isActive !== undefined ? Boolean(isActive) : true;

    const result = await pool.query(
      `
      INSERT INTO categories (name, slug, description, is_active)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [cleanName, cleanSlug, description ? String(description).trim() : null, activeVal]
    );

    const cat = result.rows[0];
    return res.status(201).json({
      success: true,
      data: {
        id: Number(cat.id),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isActive: cat.is_active,
        createdAt: cat.created_at,
      },
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_CATEGORY', message: 'Tên hoặc slug danh mục đã tồn tại' },
      });
    }
    console.error('Create category error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi tạo danh mục' },
    });
  }
};

/**
 * PUT /api/v1/admin/categories/:id
 */
const updateCategory = async (req, res) => {
  try {
    const catId = Number(req.params.id);
    if (!Number.isInteger(catId) || catId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID danh mục không hợp lệ' },
      });
    }

    const existing = await pool.query('SELECT * FROM categories WHERE id = $1', [catId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'CATEGORY_NOT_FOUND', message: 'Không tìm thấy danh mục' },
      });
    }

    const cur = existing.rows[0];
    const { name, slug, description, isActive } = req.body || {};

    const nextName = name !== undefined ? String(name).trim() : cur.name;
    if (!nextName) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Tên danh mục không được để trống' },
      });
    }

    const nextSlug = slug !== undefined ? slugify(slug) : cur.slug;
    const nextDesc = description !== undefined ? (description ? String(description).trim() : null) : cur.description;
    const nextActive = isActive !== undefined ? Boolean(isActive) : cur.is_active;

    const updated = await pool.query(
      `
      UPDATE categories SET name = $1, slug = $2, description = $3, is_active = $4
      WHERE id = $5
      RETURNING *
      `,
      [nextName, nextSlug, nextDesc, nextActive, catId]
    );

    const cat = updated.rows[0];
    return res.status(200).json({
      success: true,
      data: {
        id: Number(cat.id),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isActive: cat.is_active,
        createdAt: cat.created_at,
      },
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: { code: 'DUPLICATE_CATEGORY', message: 'Tên hoặc slug danh mục đã tồn tại' },
      });
    }
    console.error('Update category error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi cập nhật danh mục' },
    });
  }
};

/**
 * GET /api/v1/admin/audit-logs
 */
const getAuditLogs = async (req, res) => {
  try {
    const { keyword, action } = req.query;
    const conditions = ['1 = 1'];
    const params = [];
    let idx = 1;

    if (keyword && keyword.trim() !== '') {
      conditions.push(`(a.details ILIKE $${idx} OR u.full_name ILIKE $${idx} OR a.target_type ILIKE $${idx})`);
      params.push(`%${keyword.trim()}%`);
      idx++;
    }
    if (action && action.trim() !== '') {
      conditions.push(`a.action = $${idx++}`);
      params.push(action.trim().toUpperCase());
    }

    const result = await pool.query(
      `
      SELECT 
        a.*,
        u.full_name AS actor_name,
        u.email AS actor_email,
        u.role AS actor_role
      FROM audit_logs a
      INNER JOIN users u ON a.actor_id = u.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY a.created_at DESC, a.id DESC
      LIMIT 100
      `,
      params
    );

    return res.status(200).json({
      success: true,
      data: result.rows.map((r) => ({
        id: Number(r.id),
        actorId: Number(r.actor_id),
        actor: {
          id: Number(r.actor_id),
          fullName: r.actor_name,
          email: r.actor_email,
          role: r.actor_role,
        },
        action: r.action,
        targetType: r.target_type,
        targetId: Number(r.target_id),
        details: r.details,
        ipAddress: r.ip_address,
        createdAt: r.created_at,
      })),
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi tải nhật ký kiểm toán' },
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserRole,
  updateUserStatus,
  getAllCategories,
  createCategory,
  updateCategory,
  getAuditLogs,
};
