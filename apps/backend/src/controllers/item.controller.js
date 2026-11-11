const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const { UPLOAD_DIR } = require('../middlewares/upload.middleware');

const isStaff = (user) => user && ['ADMIN', 'MODERATOR'].includes(user.role);

const cleanupUploadedFiles = (files = []) => {
  for (const file of files) {
    if (file && file.path) {
      fs.unlink(file.path, () => {});
    }
  }
};

const formatImageRow = (row) => ({
  id: Number(row.id),
  itemId: Number(row.item_id),
  storageUrl: row.storage_url,
  visibility: row.visibility,
  sortOrder: Number(row.sort_order),
  createdAt: row.created_at,
});

const formatItemRow = (row, images = []) => ({
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
  images,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const attachImagesToItems = async (itemRows, currentUser) => {
  if (!itemRows || itemRows.length === 0) return [];
  const itemIds = itemRows.map((row) => Number(row.id));

  const imagesResult = await pool.query(
    `
    SELECT id, item_id, storage_url, visibility, sort_order, created_at
    FROM item_images
    WHERE item_id = ANY($1::bigint[])
    ORDER BY sort_order ASC, id ASC
    `,
    [itemIds]
  );

  const imagesByItemId = new Map();
  for (const imgRow of imagesResult.rows) {
    const key = Number(imgRow.item_id);
    if (!imagesByItemId.has(key)) {
      imagesByItemId.set(key, []);
    }
    imagesByItemId.get(key).push(imgRow);
  }

  return itemRows.map((row) => {
    const rawImages = imagesByItemId.get(Number(row.id)) || [];
    const canSeePrivate = isStaff(currentUser) || (currentUser && Number(currentUser.id) === Number(row.user_id));
    const visibleImages = rawImages
      .filter((img) => img.visibility === 'PUBLIC' || canSeePrivate)
      .map(formatImageRow);

    return formatItemRow(row, visibleImages);
  });
};

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
    const { keyword, type, categoryId, location, status, publicationStatus, mine } = req.query;

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
      conditions.push(`i.user_id = $${paramIndex++}`);
      params.push(req.user.id);
    } else if (!isStaff(req.user)) {
      conditions.push(`i.publication_status = 'APPROVED'`);
    } else if (publicationStatus && publicationStatus.trim() !== '') {
      const normalizedPub = publicationStatus.trim().toUpperCase();
      if (!['PENDING_REVIEW', 'APPROVED', 'HIDDEN', 'REJECTED'].includes(normalizedPub)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'publicationStatus chỉ chấp nhận PENDING_REVIEW, APPROVED, HIDDEN hoặc REJECTED',
          },
        });
      }
      conditions.push(`i.publication_status = $${paramIndex++}`);
      params.push(normalizedPub);
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
    const itemsWithImages = await attachImagesToItems(result.rows, req.user);

    return res.status(200).json({
      success: true,
      data: itemsWithImages,
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

    const [formattedItem] = await attachImagesToItems([item], req.user);

    return res.status(200).json({
      success: true,
      data: formattedItem,
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
 * Tạo tin đăng LOST hoặc FOUND mới (hỗ trợ cả JSON lẫn multipart/form-data đính kèm ảnh lưu vào item_images)
 */
const createItem = async (req, res) => {
  const uploadedFiles = req.uploadedFiles || [];
  let client;

  try {
    const { itemType, categoryId, title, description, approximateLocation, occurredAt } = req.body || {};

    if (
      !itemType ||
      categoryId === undefined ||
      categoryId === null ||
      !title ||
      !description ||
      !approximateLocation ||
      !occurredAt
    ) {
      cleanupUploadedFiles(uploadedFiles);
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
      cleanupUploadedFiles(uploadedFiles);
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
      cleanupUploadedFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Tiêu đề, mô tả và khu vực không được để trống',
        },
      });
    }

    if (!['LOST', 'FOUND'].includes(cleanType)) {
      cleanupUploadedFiles(uploadedFiles);
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
      cleanupUploadedFiles(uploadedFiles);
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
      cleanupUploadedFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'occurredAt không đúng định dạng ngày giờ hợp lệ (ISO-8601)',
        },
      });
    }

    const catCheck = await pool.query('SELECT id FROM categories WHERE id = $1 AND is_active = TRUE', [parsedCatId]);
    if (catCheck.rows.length === 0) {
      cleanupUploadedFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Danh mục (categoryId) không tồn tại hoặc đã bị vô hiệu hóa',
        },
      });
    }

    client = await pool.connect();
    await client.query('BEGIN');

    const insertResult = await client.query(
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

    // Nếu có ảnh upload kèm theo thì lưu vào bảng item_images
    for (let idx = 0; idx < uploadedFiles.length; idx++) {
      const file = uploadedFiles[idx];
      const storageUrl = `/uploads/items/${file.filename}`;
      await client.query(
        `
        INSERT INTO item_images (item_id, storage_url, visibility, sort_order)
        VALUES ($1, $2, 'PUBLIC', $3)
        `,
        [newId, storageUrl, idx]
      );
    }

    await client.query('COMMIT');

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

    const [formattedItem] = await attachImagesToItems(fullItemResult.rows, req.user);

    return res.status(201).json({
      success: true,
      data: formattedItem,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }
    cleanupUploadedFiles(uploadedFiles);
    console.error('Create item error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi tạo tin đăng mới',
      },
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * POST /api/v1/items/:id/images
 * Endpoint upload ảnh riêng cho sản phẩm, lưu đường dẫn vào bảng item_images
 */
const uploadItemImages = async (req, res) => {
  const uploadedFiles = req.uploadedFiles || [];
  let client;

  try {
    const itemId = Number(req.params.id);
    if (!Number.isInteger(itemId) || itemId <= 0) {
      cleanupUploadedFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ID tin đăng không hợp lệ',
        },
      });
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Vui lòng chọn ít nhất 1 file ảnh để tải lên (field: images)',
        },
      });
    }

    const existingResult = await pool.query('SELECT * FROM items WHERE id = $1 AND deleted_at IS NULL', [itemId]);
    if (existingResult.rows.length === 0) {
      cleanupUploadedFiles(uploadedFiles);
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Không tìm thấy tin đăng để gắn ảnh',
        },
      });
    }

    const item = existingResult.rows[0];
    const isOwner = Number(item.user_id) === Number(req.user.id);
    if (!isOwner && !isStaff(req.user)) {
      cleanupUploadedFiles(uploadedFiles);
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Bạn không có quyền tải ảnh lên tin đăng của người khác',
        },
      });
    }

    if (!isStaff(req.user) && item.business_status !== 'OPEN') {
      cleanupUploadedFiles(uploadedFiles);
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: 'Chỉ có thể bổ sung ảnh cho tin đang mở (OPEN)',
        },
      });
    }

    const requestedVisibility = req.body?.visibility ? String(req.body.visibility).trim().toUpperCase() : 'PUBLIC';
    if (!['PUBLIC', 'PRIVATE'].includes(requestedVisibility)) {
      cleanupUploadedFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'visibility chỉ chấp nhận PUBLIC hoặc PRIVATE',
        },
      });
    }

    const countResult = await pool.query(
      'SELECT COUNT(*)::int AS total, COALESCE(MAX(sort_order), -1)::int AS max_order FROM item_images WHERE item_id = $1',
      [itemId]
    );
    const currentTotal = countResult.rows[0].total;
    let nextOrder = countResult.rows[0].max_order + 1;

    if (currentTotal + uploadedFiles.length > 5) {
      cleanupUploadedFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Mỗi tin chỉ lưu tối đa 5 ảnh (hiện đã có ${currentTotal} ảnh)`,
        },
      });
    }

    client = await pool.connect();
    await client.query('BEGIN');

    const insertedImages = [];
    for (const file of uploadedFiles) {
      const storageUrl = `/uploads/items/${file.filename}`;
      const imgRes = await client.query(
        `
        INSERT INTO item_images (item_id, storage_url, visibility, sort_order)
        VALUES ($1, $2, $3, $4)
        RETURNING id, item_id, storage_url, visibility, sort_order, created_at
        `,
        [itemId, storageUrl, requestedVisibility, nextOrder++]
      );
      insertedImages.push(formatImageRow(imgRes.rows[0]));
    }

    await client.query('COMMIT');

    return res.status(201).json({
      success: true,
      data: insertedImages,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }
    cleanupUploadedFiles(uploadedFiles);
    console.error('Upload item images error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi lưu ảnh sản phẩm',
      },
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * DELETE /api/v1/items/:id/images/:imageId
 * Xóa một ảnh đã tải lên khỏi bảng item_images và ổ đĩa
 */
const deleteItemImage = async (req, res) => {
  try {
    const itemId = Number(req.params.id);
    const imageId = Number(req.params.imageId);
    if (!Number.isInteger(itemId) || itemId <= 0 || !Number.isInteger(imageId) || imageId <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ID tin đăng hoặc ID ảnh không hợp lệ',
        },
      });
    }

    const itemResult = await pool.query('SELECT * FROM items WHERE id = $1 AND deleted_at IS NULL', [itemId]);
    if (itemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Không tìm thấy tin đăng',
        },
      });
    }

    const item = itemResult.rows[0];
    const isOwner = Number(item.user_id) === Number(req.user.id);
    if (!isOwner && !isStaff(req.user)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Bạn không có quyền xóa ảnh của tin đăng này',
        },
      });
    }

    if (!isStaff(req.user) && item.business_status !== 'OPEN') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: 'Chỉ có thể xóa ảnh khi tin đang ở trạng thái OPEN',
        },
      });
    }

    const deleteRes = await pool.query(
      'DELETE FROM item_images WHERE id = $1 AND item_id = $2 RETURNING storage_url',
      [imageId, itemId]
    );

    if (deleteRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'IMAGE_NOT_FOUND',
          message: 'Không tìm thấy ảnh cần xóa',
        },
      });
    }

    const storageUrl = deleteRes.rows[0].storage_url;
    if (storageUrl && storageUrl.startsWith('/uploads/items/')) {
      const filename = path.basename(storageUrl);
      fs.unlink(path.join(UPLOAD_DIR, filename), () => {});
    }

    return res.status(200).json({
      success: true,
      data: { message: 'Đã xóa ảnh thành công' },
    });
  } catch (error) {
    console.error('Delete item image error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi xóa ảnh',
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

    if (Number(existingItem.user_id) !== Number(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Bạn không có quyền chỉnh sửa tin đăng của người khác',
        },
      });
    }

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

    const [formattedItem] = await attachImagesToItems(updatedResult.rows, req.user);

    return res.status(200).json({
      success: true,
      data: formattedItem,
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

    if (Number(existingItem.user_id) !== Number(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Chỉ chủ tin mới được đánh dấu đã tìm thấy đồ',
        },
      });
    }

    if (existingItem.item_type !== 'LOST') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Chỉ tin báo mất (LOST) mới sử dụng tính năng tự đánh dấu đã tìm thấy',
        },
      });
    }

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

    const [formattedItem] = await attachImagesToItems(updatedResult.rows, req.user);

    return res.status(200).json({
      success: true,
      data: formattedItem,
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

/**
 * PATCH /api/v1/items/:id/visibility
 * Chỉ Admin/Moderator được phép ẩn (HIDDEN), duyệt (APPROVED) hoặc từ chối (REJECTED) tin kèm lý do
 * Không làm thay đổi business_status (VD: tin đã CLOSED giữ nguyên trạng thái CLOSED khi khôi phục)
 */
const updateItemVisibility = async (req, res) => {
  let client;
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

    const { publicationStatus, status, reason } = req.body || {};
    const targetStatus = (publicationStatus || status || '').trim().toUpperCase();

    if (!['APPROVED', 'HIDDEN', 'REJECTED'].includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'publicationStatus chỉ chấp nhận APPROVED, HIDDEN hoặc REJECTED',
        },
      });
    }

    const cleanReason = reason ? String(reason).trim() : '';
    if ((targetStatus === 'HIDDEN' || targetStatus === 'REJECTED') && !cleanReason) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Vui lòng nhập lý do khi ẩn hoặc từ chối tin đăng',
        },
      });
    }

    client = await pool.connect();
    await client.query('BEGIN');

    const existingResult = await client.query('SELECT * FROM items WHERE id = $1 AND deleted_at IS NULL FOR UPDATE', [
      itemId,
    ]);

    if (existingResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Không tìm thấy tin đăng',
        },
      });
    }

    await client.query(`UPDATE items SET publication_status = $1 WHERE id = $2`, [targetStatus, itemId]);

    const actionMap = {
      HIDDEN: 'HIDE_ITEM',
      APPROVED: 'RESTORE_ITEM',
      REJECTED: 'REJECT_ITEM',
    };

    const detailsText =
      cleanReason || `Cập nhật trạng thái hiển thị sang ${targetStatus}`;

    await client.query(
      `
      INSERT INTO audit_logs (actor_id, action, target_type, target_id, details, ip_address)
      VALUES ($1, $2, 'ITEM', $3, $4, $5)
      `,
      [req.user.id, actionMap[targetStatus], itemId, detailsText, req.ip || null]
    );

    await client.query('COMMIT');

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

    const [formattedItem] = await attachImagesToItems(updatedResult.rows, req.user);

    return res.status(200).json({
      success: true,
      data: formattedItem,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }
    console.error('Update item visibility error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi cập nhật trạng thái hiển thị tin',
      },
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = {
  getCategories,
  getItems,
  getItemById,
  createItem,
  uploadItemImages,
  deleteItemImage,
  updateItem,
  resolveLostItem,
  updateItemVisibility,
};
