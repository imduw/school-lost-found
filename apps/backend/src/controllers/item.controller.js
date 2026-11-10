const pool = require('../config/db');

const isStaff = (user) => user && ['ADMIN', 'MODERATOR'].includes(user.role);

const formatItemRow = (row) => ({
  id: Number(row.id),
  userId: Number(row.user_id),
  author: {
    id: Number(row.user_id),
    fullName: row.author_name,
    studentId: row.author_student_id,
  },
  categoryId: Number(row.category_id),
  category: {
    id: Number(row.category_id),
    name: row.category_name,
    slug: row.category_slug,
  },
  itemType: row.item_type,
  title: row.title,
  description: row.description,
  approximateLocation: row.approximate_location,
  occurredAt: row.occurred_at,
  publicationStatus: row.publication_status,
  businessStatus: row.business_status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

/**
 * GET /api/v1/categories
 * Lấy danh sách tất cả danh mục tài sản đang hoạt động
 */
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, slug, description, is_active FROM categories WHERE is_active = TRUE ORDER BY id ASC'
    );

    return res.status(200).json({
      success: true,
      data: result.rows.map((cat) => ({
        id: Number(cat.id),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isActive: cat.is_active,
      })),
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi tải danh mục tài sản',
      },
    });
  }
};

/**
 * GET /api/v1/items
 * Tìm kiếm và lọc tin đăng (?keyword=...&type=FOUND&categoryId=1&location=...&status=OPEN&mine=true)
 * Tự động ẩn các tin HIDDEN với người dùng thường / khách
 */
const getItems = async (req, res) => {
  try {
    const { keyword, type, categoryId, location, status, mine } = req.query;

    const conditions = ['i.deleted_at IS NULL'];
    const params = [];
    let paramIndex = 1;

    const wantMine = mine === 'true' || mine === '1';

    if (wantMine) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHENTICATED',
            message: 'Vui lòng đăng nhập để xem danh sách tin của bạn',
          },
        });
      }
      // Chủ tin được xem toàn bộ tin của chính mình (bao gồm cả tin đang bị HIDDEN để theo dõi)
      conditions.push(`i.user_id = $${paramIndex++}`);
      params.push(req.user.id);
    } else if (!isStaff(req.user)) {
      // Người thường và khách tuyệt đối không thấy tin HIDDEN/REJECTED/PENDING_REVIEW
      conditions.push(`i.publication_status = 'APPROVED'`);
    }

    if (keyword && keyword.trim() !== '') {
      conditions.push(
        `(i.title ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex} OR i.approximate_location ILIKE $${paramIndex})`
      );
      params.push(`%${keyword.trim()}%`);
      paramIndex++;
    }

    if (type && type.trim() !== '') {
      const normalizedType = type.trim().toUpperCase();
      if (!['LOST', 'FOUND'].includes(normalizedType)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Loại tin (type) chỉ chấp nhận LOST hoặc FOUND',
          },
        });
      }
      conditions.push(`i.item_type = $${paramIndex++}`);
      params.push(normalizedType);
    }

    if (categoryId && categoryId.trim() !== '') {
      const parsedCatId = Number(categoryId);
      if (!Number.isInteger(parsedCatId) || parsedCatId <= 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'categoryId không hợp lệ',
          },
        });
      }
      conditions.push(`i.category_id = $${paramIndex++}`);
      params.push(parsedCatId);
    }

    if (location && location.trim() !== '') {
      conditions.push(`i.approximate_location ILIKE $${paramIndex++}`);
      params.push(`%${location.trim()}%`);
    }

    if (status && status.trim() !== '') {
      const normalizedStatus = status.trim().toUpperCase();
      if (!['OPEN', 'RESERVED', 'CLOSED', 'RESOLVED'].includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Trạng thái (status) chỉ chấp nhận OPEN, RESERVED, CLOSED hoặc RESOLVED',
          },
        });
      }
      conditions.push(`i.business_status = $${paramIndex++}`);
      params.push(normalizedStatus);
    }

    const query = `
      SELECT 
        i.*,
        u.full_name AS author_name,
        u.student_id AS author_student_id,
        c.name AS category_name,
        c.slug AS category_slug
      FROM items i
      INNER JOIN users u ON i.user_id = u.id
      INNER JOIN categories c ON i.category_id = c.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY i.created_at DESC, i.id DESC
    `;

    const result = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      data: result.rows.map(formatItemRow),
    });
  } catch (error) {
    console.error('Get items error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi tìm kiếm tin đăng',
      },
    });
  }
};

/**
 * GET /api/v1/items/:id
 * Xem chi tiết 1 tin đăng; chặn 403 nếu tin đang bị HIDDEN với người ngoài quyền
 */
const getItemById = async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ID tin đăng không hợp lệ',
        },
      });
    }

    const result = await pool.query(
      `
      SELECT 
        i.*,
        u.full_name AS author_name,
        u.student_id AS author_student_id,
        c.name AS category_name,
        c.slug AS category_slug
      FROM items i
      INNER JOIN users u ON i.user_id = u.id
      INNER JOIN categories c ON i.category_id = c.id
      WHERE i.id = $1 AND i.deleted_at IS NULL
      `,
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Không tìm thấy tin đăng này',
        },
      });
    }

    const item = result.rows[0];

    // Kiểm tra quyền nếu tin không ở trạng thái APPROVED (VD: bị HIDDEN)
    if (item.publication_status !== 'APPROVED') {
      const isOwner = req.user && Number(req.user.id) === Number(item.user_id);
      if (!isOwner && !isStaff(req.user)) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Bạn không có quyền xem tin đăng đang bị ẩn này',
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: formatItemRow(item),
    });
  } catch (error) {
    console.error('Get item by ID error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi xem chi tiết tin đăng',
      },
    });
  }
};

/**
 * POST /api/v1/items
 * Tạo tin đăng LOST hoặc FOUND mới (bắt buộc đăng nhập, kiểm tra trường bắt buộc)
 */
const createItem = async (req, res) => {
  try {
    const { itemType, categoryId, title, description, approximateLocation, occurredAt } = req.body || {};

    // Kiểm tra sự có mặt của các trường bắt buộc
    if (
      !itemType ||
      categoryId === undefined ||
      categoryId === null ||
      !title ||
      !description ||
      !approximateLocation ||
      !occurredAt
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Vui lòng điền đầy đủ: itemType, categoryId, title, description, approximateLocation, occurredAt',
        },
      });
    }

    if (
      typeof itemType !== 'string' ||
      typeof title !== 'string' ||
      typeof description !== 'string' ||
      typeof approximateLocation !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Định dạng dữ liệu văn bản không hợp lệ',
        },
      });
    }

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
    const cleanLocation = approximateLocation.trim();
    const cleanType = itemType.trim().toUpperCase();

    if (!cleanTitle || !cleanDescription || !cleanLocation) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Tiêu đề, mô tả và khu vực không được để trống',
        },
      });
    }

    if (!['LOST', 'FOUND'].includes(cleanType)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'itemType chỉ chấp nhận LOST hoặc FOUND',
        },
      });
    }

    const parsedCatId = Number(categoryId);
    if (!Number.isInteger(parsedCatId) || parsedCatId <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'categoryId phải là số nguyên dương hợp lệ',
        },
      });
    }

    const parsedDate = new Date(occurredAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'occurredAt không đúng định dạng ngày giờ hợp lệ (ISO-8601)',
        },
      });
    }

    // Kiểm tra danh mục có tồn tại trong DB không
    const catCheck = await pool.query('SELECT id FROM categories WHERE id = $1 AND is_active = TRUE', [parsedCatId]);
    if (catCheck.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Danh mục (categoryId) không tồn tại hoặc đã bị vô hiệu hóa',
        },
      });
    }

    const insertResult = await pool.query(
      `
      INSERT INTO items (
        user_id, category_id, item_type, title, description, 
        approximate_location, occurred_at, publication_status, business_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'APPROVED', 'OPEN')
      RETURNING id
      `,
      [req.user.id, parsedCatId, cleanType, cleanTitle, cleanDescription, cleanLocation, parsedDate.toISOString()]
    );

    const newId = insertResult.rows[0].id;

    // Lấy lại bản ghi đầy đủ thông tin category & author
    const fullItemResult = await pool.query(
      `
      SELECT 
        i.*,
        u.full_name AS author_name,
        u.student_id AS author_student_id,
        c.name AS category_name,
        c.slug AS category_slug
      FROM items i
      INNER JOIN users u ON i.user_id = u.id
      INNER JOIN categories c ON i.category_id = c.id
      WHERE i.id = $1
      `,
      [newId]
    );

    return res.status(201).json({
      success: true,
      data: formatItemRow(fullItemResult.rows[0]),
    });
  } catch (error) {
    console.error('Create item error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi tạo tin đăng mới',
      },
    });
  }
};

/**
 * PUT /api/v1/items/:id
 * Chỉ chủ sở hữu tin mới được sửa khi tin còn đang ở trạng thái OPEN
 */
const updateItem = async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ID tin đăng không hợp lệ',
        },
      });
    }

    const existingResult = await pool.query('SELECT * FROM items WHERE id = $1 AND deleted_at IS NULL', [itemId]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Không tìm thấy tin đăng cần cập nhật',
        },
      });
    }

    const existingItem = existingResult.rows[0];

    // Kiểm tra chính chủ
    if (Number(existingItem.user_id) !== Number(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Bạn không có quyền chỉnh sửa tin đăng của người khác',
        },
      });
    }

    // Chỉ được sửa tin khi trạng thái là OPEN
    if (existingItem.business_status !== 'OPEN') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: `Không thể sửa tin đang ở trạng thái ${existingItem.business_status}. Chỉ được sửa tin đang mở (OPEN)`,
        },
      });
    }

    const { itemType, categoryId, title, description, approximateLocation, occurredAt } = req.body || {};

    const nextType = itemType !== undefined ? String(itemType).trim().toUpperCase() : existingItem.item_type;
    if (!['LOST', 'FOUND'].includes(nextType)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'itemType chỉ chấp nhận LOST hoặc FOUND',
        },
      });
    }

    const nextCatId = categoryId !== undefined ? Number(categoryId) : Number(existingItem.category_id);
    if (!Number.isInteger(nextCatId) || nextCatId <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'categoryId không hợp lệ',
        },
      });
    }

    if (categoryId !== undefined) {
      const catCheck = await pool.query('SELECT id FROM categories WHERE id = $1 AND is_active = TRUE', [nextCatId]);
      if (catCheck.rows.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Danh mục (categoryId) không tồn tại',
          },
        });
      }
    }

    const nextTitle = title !== undefined ? String(title).trim() : existingItem.title;
    const nextDescription = description !== undefined ? String(description).trim() : existingItem.description;
    const nextLocation =
      approximateLocation !== undefined ? String(approximateLocation).trim() : existingItem.approximate_location;

    if (!nextTitle || !nextDescription || !nextLocation) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Tiêu đề, mô tả và khu vực không được để trống',
        },
      });
    }

    let nextOccurredAt = existingItem.occurred_at;
    if (occurredAt !== undefined) {
      const parsedDate = new Date(occurredAt);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'occurredAt không đúng định dạng ngày giờ hợp lệ',
          },
        });
      }
      nextOccurredAt = parsedDate.toISOString();
    }

    await pool.query(
      `
      UPDATE items
      SET item_type = $1,
          category_id = $2,
          title = $3,
          description = $4,
          approximate_location = $5,
          occurred_at = $6
      WHERE id = $7
      `,
      [nextType, nextCatId, nextTitle, nextDescription, nextLocation, nextOccurredAt, itemId]
    );

    const updatedResult = await pool.query(
      `
      SELECT 
        i.*,
        u.full_name AS author_name,
        u.student_id AS author_student_id,
        c.name AS category_name,
        c.slug AS category_slug
      FROM items i
      INNER JOIN users u ON i.user_id = u.id
      INNER JOIN categories c ON i.category_id = c.id
      WHERE i.id = $1
      `,
      [itemId]
    );

    return res.status(200).json({
      success: true,
      data: formatItemRow(updatedResult.rows[0]),
    });
  } catch (error) {
    console.error('Update item error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi cập nhật tin đăng',
      },
    });
  }
};

/**
 * PATCH /api/v1/items/:id/resolve
 * Chủ tin báo mất (LOST) tự đánh dấu đã tìm thấy đồ (OPEN -> RESOLVED)
 */
const resolveLostItem = async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ID tin đăng không hợp lệ',
        },
      });
    }

    const existingResult = await pool.query('SELECT * FROM items WHERE id = $1 AND deleted_at IS NULL', [itemId]);
    if (existingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Không tìm thấy tin đăng',
        },
      });
    }

    const existingItem = existingResult.rows[0];

    // Chỉ chủ tin mới có quyền đánh dấu đã tìm thấy
    if (Number(existingItem.user_id) !== Number(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Chỉ chủ tin mới được đánh dấu đã tìm thấy đồ',
        },
      });
    }

    // Chỉ áp dụng cho tin LOST
    if (existingItem.item_type !== 'LOST') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Chỉ tin báo mất (LOST) mới sử dụng tính năng tự đánh dấu đã tìm thấy',
        },
      });
    }

    // Chặn thao tác lặp hoặc tin không ở trạng thái OPEN
    if (existingItem.business_status !== 'OPEN') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: `Tin đăng đã ở trạng thái ${existingItem.business_status}, không thể đánh dấu lại`,
        },
      });
    }

    await pool.query(`UPDATE items SET business_status = 'RESOLVED' WHERE id = $1`, [itemId]);

    const updatedResult = await pool.query(
      `
      SELECT 
        i.*,
        u.full_name AS author_name,
        u.student_id AS author_student_id,
        c.name AS category_name,
        c.slug AS category_slug
      FROM items i
      INNER JOIN users u ON i.user_id = u.id
      INNER JOIN categories c ON i.category_id = c.id
      WHERE i.id = $1
      `,
      [itemId]
    );

    return res.status(200).json({
      success: true,
      data: formatItemRow(updatedResult.rows[0]),
    });
  } catch (error) {
    console.error('Resolve lost item error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi đóng tin báo mất',
      },
    });
  }
};

module.exports = {
  getCategories,
  getItems,
  getItemById,
  createItem,
  updateItem,
  resolveLostItem,
};
