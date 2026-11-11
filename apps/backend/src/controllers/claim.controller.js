const fs = require('fs');
const pool = require('../config/db');

const isStaff = (user) => user && ['ADMIN', 'MODERATOR'].includes(user.role);

const cleanupUploadedFiles = (files = []) => {
  for (const file of files) {
    if (file && file.path) {
      fs.unlink(file.path, () => {});
    }
  }
};

const formatProofRow = (row) => ({
  id: Number(row.id),
  claimId: Number(row.claim_id),
  proofType: row.proof_type,
  proofContent: row.proof_content,
  createdAt: row.created_at,
});

const formatClaimRow = (row, proofs = []) => ({
  id: Number(row.id),
  itemId: Number(row.item_id),
  claimantId: Number(row.claimant_id),
  status: row.status,
  note: row.note,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  claimant: row.claimant_name
    ? {
        id: Number(row.claimant_id),
        fullName: row.claimant_name,
        email: row.claimant_email,
        studentId: row.claimant_student_id,
        phone: row.claimant_phone,
      }
    : undefined,
  item: row.item_title
    ? {
        id: Number(row.item_id),
        itemType: row.item_type,
        title: row.item_title,
        approximateLocation: row.item_location,
        businessStatus: row.item_business_status,
        publicationStatus: row.item_publication_status,
        categoryName: row.category_name,
        authorName: row.item_author_name,
      }
    : undefined,
  handover: row.handover_id
    ? {
        id: Number(row.handover_id),
        handoverBy: Number(row.handover_by),
        handoverByName: row.handover_by_name,
        handoverAt: row.handover_at,
        note: row.handover_note,
      }
    : null,
  proofs,
});

const attachProofsToClaims = async (claimRows) => {
  if (!claimRows || claimRows.length === 0) return [];
  const claimIds = claimRows.map((row) => Number(row.id));

  const proofsResult = await pool.query(
    `
    SELECT id, claim_id, proof_type, proof_content, created_at
    FROM claim_proofs
    WHERE claim_id = ANY($1::bigint[])
    ORDER BY id ASC
    `,
    [claimIds]
  );

  const proofsByClaim = new Map();
  for (const pRow of proofsResult.rows) {
    const key = Number(pRow.claim_id);
    if (!proofsByClaim.has(key)) {
      proofsByClaim.set(key, []);
    }
    proofsByClaim.get(key).push(formatProofRow(pRow));
  }

  return claimRows.map((row) => formatClaimRow(row, proofsByClaim.get(Number(row.id)) || []));
};

/**
 * POST /api/v1/items/:id/claims
 * Người dùng gửi yêu cầu nhận lại đồ kèm bằng chứng đối chiếu riêng tư
 */
const createClaim = async (req, res) => {
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

    const { proofContent, description, message, proofType } = req.body || {};
    const rawProofText = proofContent || description || message || '';
    const cleanProofText = typeof rawProofText === 'string' ? rawProofText.trim() : '';

    if (!cleanProofText && uploadedFiles.length === 0) {
      cleanupUploadedFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Vui lòng cung cấp mô tả hoặc ảnh bằng chứng đối chiếu quyền sở hữu',
        },
      });
    }

    const normalizedProofType = proofType ? String(proofType).trim().toUpperCase() : 'DESCRIPTION';
    if (!['DESCRIPTION', 'CONTACT', 'SERIAL_NUMBER', 'ATTACHMENT_URL'].includes(normalizedProofType)) {
      cleanupUploadedFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'proofType không hợp lệ',
        },
      });
    }

    client = await pool.connect();
    await client.query('BEGIN');

    // Khóa hàng item để tránh race condition nếu tin sắp đóng
    const itemRes = await client.query('SELECT * FROM items WHERE id = $1 AND deleted_at IS NULL FOR UPDATE', [itemId]);
    if (itemRes.rows.length === 0) {
      await client.query('ROLLBACK');
      cleanupUploadedFiles(uploadedFiles);
      return res.status(404).json({
        success: false,
        error: {
          code: 'ITEM_NOT_FOUND',
          message: 'Không tìm thấy tin đăng',
        },
      });
    }

    const item = itemRes.rows[0];

    if (item.publication_status !== 'APPROVED') {
      await client.query('ROLLBACK');
      cleanupUploadedFiles(uploadedFiles);
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Không thể gửi yêu cầu nhận đồ cho tin đang bị ẩn hoặc chưa được duyệt',
        },
      });
    }

    if (item.item_type !== 'FOUND') {
      await client.query('ROLLBACK');
      cleanupUploadedFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Chỉ có thể gửi yêu cầu nhận đồ cho tin Nhặt được (FOUND)',
        },
      });
    }

    if (item.business_status !== 'OPEN') {
      await client.query('ROLLBACK');
      cleanupUploadedFiles(uploadedFiles);
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: `Tin đăng này đang ở trạng thái ${item.business_status}, không thể nhận thêm yêu cầu`,
        },
      });
    }

    if (Number(item.user_id) === Number(req.user.id)) {
      await client.query('ROLLBACK');
      cleanupUploadedFiles(uploadedFiles);
      return res.status(400).json({
        success: false,
        error: {
          code: 'SELF_CLAIM_NOT_ALLOWED',
          message: 'Bạn không thể tự gửi yêu cầu nhận đồ trên tin đăng do chính mình tạo',
        },
      });
    }

    const dupRes = await client.query(
      `SELECT id FROM claims WHERE item_id = $1 AND claimant_id = $2 AND status = 'PENDING'`,
      [itemId, req.user.id]
    );
    if (dupRes.rows.length > 0) {
      await client.query('ROLLBACK');
      cleanupUploadedFiles(uploadedFiles);
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_PENDING_CLAIM',
          message: 'Bạn đã gửi một yêu cầu nhận đồ đang chờ xử lý cho tin này rồi',
        },
      });
    }

    const claimInsert = await client.query(
      `
      INSERT INTO claims (item_id, claimant_id, status)
      VALUES ($1, $2, 'PENDING')
      RETURNING id
      `,
      [itemId, req.user.id]
    );
    const claimId = claimInsert.rows[0].id;

    if (cleanProofText) {
      await client.query(
        `
        INSERT INTO claim_proofs (claim_id, proof_type, proof_content)
        VALUES ($1, $2, $3)
        `,
        [claimId, normalizedProofType, cleanProofText]
      );
    }

    for (const file of uploadedFiles) {
      const storageUrl = `/uploads/proofs/${file.filename}`;
      await client.query(
        `
        INSERT INTO claim_proofs (claim_id, proof_type, proof_content)
        VALUES ($1, 'ATTACHMENT_URL', $2)
        `,
        [claimId, storageUrl]
      );
    }

    await client.query('COMMIT');

    const fullRes = await pool.query(
      `
      SELECT 
        c.*,
        u.full_name AS claimant_name,
        u.email AS claimant_email,
        u.student_id AS claimant_student_id,
        u.phone AS claimant_phone,
        i.item_type,
        i.title AS item_title,
        i.approximate_location AS item_location,
        i.business_status AS item_business_status,
        i.publication_status AS item_publication_status
      FROM claims c
      INNER JOIN users u ON c.claimant_id = u.id
      INNER JOIN items i ON c.item_id = i.id
      WHERE c.id = $1
      `,
      [claimId]
    );

    const [formattedClaim] = await attachProofsToClaims(fullRes.rows);

    return res.status(201).json({
      success: true,
      data: formattedClaim,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }
    cleanupUploadedFiles(uploadedFiles);
    console.error('Create claim error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi gửi yêu cầu nhận đồ',
      },
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * GET /api/v1/claims/my
 * Lấy danh sách các yêu cầu nhận đồ của chính người dùng đang đăng nhập
 */
const getMyClaims = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        c.*,
        i.item_type,
        i.title AS item_title,
        i.approximate_location AS item_location,
        i.business_status AS item_business_status,
        i.publication_status AS item_publication_status,
        cat.name AS category_name,
        au.full_name AS item_author_name,
        h.id AS handover_id,
        h.handover_by,
        hm.full_name AS handover_by_name,
        h.handover_at,
        h.note AS handover_note
      FROM claims c
      INNER JOIN items i ON c.item_id = i.id
      INNER JOIN categories cat ON i.category_id = cat.id
      INNER JOIN users au ON i.user_id = au.id
      LEFT JOIN handovers h ON h.claim_id = c.id
      LEFT JOIN users hm ON h.handover_by = hm.id
      WHERE c.claimant_id = $1 AND i.deleted_at IS NULL
      ORDER BY c.created_at DESC, c.id DESC
      `,
      [req.user.id]
    );

    const formatted = await attachProofsToClaims(result.rows);
    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Get my claims error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi tải danh sách yêu cầu của bạn',
      },
    });
  }
};

/**
 * GET /api/v1/claims
 * Chỉ Admin/Moderator xem toàn bộ danh sách Claim để kiểm duyệt và đối chiếu bàn giao
 */
const getAllClaims = async (req, res) => {
  try {
    const { status, itemId, keyword } = req.query;
    const conditions = ['i.deleted_at IS NULL'];
    const params = [];
    let paramIdx = 1;

    if (status && status.trim() !== '') {
      const normalizedStatus = status.trim().toUpperCase();
      if (!['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'].includes(normalizedStatus)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'status chỉ chấp nhận PENDING, ACCEPTED, REJECTED hoặc WITHDRAWN',
          },
        });
      }
      conditions.push(`c.status = $${paramIdx++}`);
      params.push(normalizedStatus);
    }

    if (itemId && itemId.trim() !== '') {
      const parsedItemId = Number(itemId);
      if (!Number.isInteger(parsedItemId) || parsedItemId <= 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'itemId không hợp lệ',
          },
        });
      }
      conditions.push(`c.item_id = $${paramIdx++}`);
      params.push(parsedItemId);
    }

    if (keyword && keyword.trim() !== '') {
      conditions.push(
        `(i.title ILIKE $${paramIdx} OR u.full_name ILIKE $${paramIdx} OR u.student_id ILIKE $${paramIdx} OR CAST(c.id AS TEXT) = $${paramIdx + 1})`
      );
      params.push(`%${keyword.trim()}%`);
      params.push(keyword.trim());
      paramIdx += 2;
    }

    const result = await pool.query(
      `
      SELECT 
        c.*,
        u.full_name AS claimant_name,
        u.email AS claimant_email,
        u.student_id AS claimant_student_id,
        u.phone AS claimant_phone,
        i.item_type,
        i.title AS item_title,
        i.approximate_location AS item_location,
        i.business_status AS item_business_status,
        i.publication_status AS item_publication_status,
        cat.name AS category_name,
        au.full_name AS item_author_name,
        h.id AS handover_id,
        h.handover_by,
        hm.full_name AS handover_by_name,
        h.handover_at,
        h.note AS handover_note
      FROM claims c
      INNER JOIN users u ON c.claimant_id = u.id
      INNER JOIN items i ON c.item_id = i.id
      INNER JOIN categories cat ON i.category_id = cat.id
      INNER JOIN users au ON i.user_id = au.id
      LEFT JOIN handovers h ON h.claim_id = c.id
      LEFT JOIN users hm ON h.handover_by = hm.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY 
        CASE WHEN c.status = 'PENDING' THEN 0 ELSE 1 END,
        c.created_at DESC,
        c.id DESC
      `,
      params
    );

    const formatted = await attachProofsToClaims(result.rows);
    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Get all claims error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi tải danh sách yêu cầu nhận đồ',
      },
    });
  }
};

/**
 * Kiểm tra quyền đọc chi tiết Claim & Proof (Proof Privacy - TC07):
 * Chỉ chính chủ Claim (claimant_id) hoặc Admin/Moderator mới được phép đọc.
 * Chủ tin đăng (nếu không phải claimant/staff) và user khác đều bị từ chối 403.
 */
const loadAuthorizedClaim = async (claimId, user) => {
  const result = await pool.query(
    `
    SELECT 
      c.*,
      u.full_name AS claimant_name,
      u.email AS claimant_email,
      u.student_id AS claimant_student_id,
      u.phone AS claimant_phone,
      i.item_type,
      i.title AS item_title,
      i.approximate_location AS item_location,
      i.business_status AS item_business_status,
      i.publication_status AS item_publication_status,
      cat.name AS category_name,
      au.full_name AS item_author_name,
      h.id AS handover_id,
      h.handover_by,
      hm.full_name AS handover_by_name,
      h.handover_at,
      h.note AS handover_note
    FROM claims c
    INNER JOIN users u ON c.claimant_id = u.id
    INNER JOIN items i ON c.item_id = i.id
    INNER JOIN categories cat ON i.category_id = cat.id
    INNER JOIN users au ON i.user_id = au.id
    LEFT JOIN handovers h ON h.claim_id = c.id
    LEFT JOIN users hm ON h.handover_by = hm.id
    WHERE c.id = $1 AND i.deleted_at IS NULL
    `,
    [claimId]
  );

  if (result.rows.length === 0) {
    return { errorStatus: 404, errorCode: 'CLAIM_NOT_FOUND', errorMessage: 'Không tìm thấy yêu cầu nhận đồ' };
  }

  const claimRow = result.rows[0];
  const isClaimant = Number(claimRow.claimant_id) === Number(user.id);

  if (!isClaimant && !isStaff(user)) {
    return {
      errorStatus: 403,
      errorCode: 'FORBIDDEN',
      errorMessage: 'Bạn không có quyền xem thông tin bằng chứng đối chiếu của người khác',
    };
  }

  const [formatted] = await attachProofsToClaims([claimRow]);
  return { claim: formatted };
};

/**
 * GET /api/v1/claims/:id
 */
const getClaimById = async (req, res) => {
  try {
    const claimId = Number(req.params.id);
    if (!Number.isInteger(claimId) || claimId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID yêu cầu không hợp lệ' },
      });
    }

    const result = await loadAuthorizedClaim(claimId, req.user);
    if (result.errorStatus) {
      return res.status(result.errorStatus).json({
        success: false,
        error: { code: result.errorCode, message: result.errorMessage },
      });
    }

    return res.status(200).json({
      success: true,
      data: result.claim,
    });
  } catch (error) {
    console.error('Get claim by ID error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi xem chi tiết yêu cầu' },
    });
  }
};

/**
 * GET /api/v1/claims/:id/proofs
 * Trả riêng danh sách bằng chứng đối chiếu (chỉ Claimant và Admin/Moderator xem được)
 */
const getClaimProofs = async (req, res) => {
  try {
    const claimId = Number(req.params.id);
    if (!Number.isInteger(claimId) || claimId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID yêu cầu không hợp lệ' },
      });
    }

    const result = await loadAuthorizedClaim(claimId, req.user);
    if (result.errorStatus) {
      return res.status(result.errorStatus).json({
        success: false,
        error: { code: result.errorCode, message: result.errorMessage },
      });
    }

    return res.status(200).json({
      success: true,
      data: result.claim.proofs,
    });
  } catch (error) {
    console.error('Get claim proofs error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi đọc bằng chứng đối chiếu' },
    });
  }
};

/**
 * POST /api/v1/claims/:id/handover
 * Moderator/Admin xác nhận đã đối chiếu và bàn giao đồ thực tế.
 * Chống bàn giao kép đồng thời (Race condition) bằng Transaction + SELECT ... FOR UPDATE + UNIQUE(item_id).
 */
const completeHandover = async (req, res) => {
  let client;
  try {
    const claimId = Number(req.params.id);
    if (!Number.isInteger(claimId) || claimId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID yêu cầu không hợp lệ' },
      });
    }

    const { note, handoverAt } = req.body || {};
    let parsedHandoverAt = new Date();
    if (handoverAt !== undefined && handoverAt !== null && String(handoverAt).trim() !== '') {
      parsedHandoverAt = new Date(handoverAt);
      if (Number.isNaN(parsedHandoverAt.getTime())) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Thời gian bàn giao (handoverAt) không đúng định dạng ngày giờ hợp lệ',
          },
        });
      }
    }

    const cleanNote = note ? String(note).trim() : 'Đã đối chiếu và hoàn tất bàn giao tài sản';

    client = await pool.connect();
    await client.query('BEGIN');

    // Bước 1: Đọc item_id (không khóa) để luôn khóa theo thứ tự cha -> con (items trước, claims sau), tránh deadlock khi 2 request bàn giao chạy đồng thời
    const claimLookupRes = await client.query('SELECT item_id FROM claims WHERE id = $1', [claimId]);
    if (claimLookupRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: { code: 'CLAIM_NOT_FOUND', message: 'Không tìm thấy yêu cầu nhận đồ' },
      });
    }

    const targetItemId = claimLookupRes.rows[0].item_id;

    // Bước 2: Khóa bản ghi item ĐẦU TIÊN để tuần tự hóa mọi thao tác bàn giao trên cùng 1 món đồ
    const itemRes = await client.query('SELECT * FROM items WHERE id = $1 AND deleted_at IS NULL FOR UPDATE', [
      targetItemId,
    ]);
    if (itemRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: { code: 'ITEM_NOT_FOUND', message: 'Không tìm thấy tin đăng liên quan' },
      });
    }

    const item = itemRes.rows[0];
    if (item.item_type !== 'FOUND') {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Chỉ bàn giao cho tin nhặt được (FOUND)' },
      });
    }

    if (!['OPEN', 'RESERVED'].includes(item.business_status)) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: `Món đồ này đã ở trạng thái ${item.business_status}, không thể bàn giao thêm lần nữa`,
        },
      });
    }

    // Bước 3: Sau khi giữ khóa item, mới khóa bản ghi claim hiện tại và kiểm tra lại trạng thái mới nhất
    const claimRes = await client.query('SELECT * FROM claims WHERE id = $1 FOR UPDATE', [claimId]);
    if (claimRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: { code: 'CLAIM_NOT_FOUND', message: 'Không tìm thấy yêu cầu nhận đồ' },
      });
    }

    const claim = claimRes.rows[0];
    if (claim.status !== 'PENDING') {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: `Yêu cầu này đã ở trạng thái ${claim.status}, không thể xác nhận bàn giao lại`,
        },
      });
    }

    // Bước 3: Kiểm tra lại bảng handovers (phòng thủ lớp 2)
    const existingHandover = await client.query('SELECT id FROM handovers WHERE item_id = $1', [item.id]);
    if (existingHandover.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: 'Món đồ này đã có biên bản bàn giao thành công trước đó',
        },
      });
    }

    // Bước 4: Cập nhật claim được chọn -> ACCEPTED
    await client.query(`UPDATE claims SET status = 'ACCEPTED', note = $1 WHERE id = $2`, [cleanNote, claimId]);

    // Bước 5: Tự động từ chối tất cả các claim PENDING khác trên cùng món đồ
    const rejectOthersRes = await client.query(
      `
      UPDATE claims 
      SET status = 'REJECTED', note = 'Đồ đã được bàn giao cho người nhận hợp lệ khác'
      WHERE item_id = $1 AND id != $2 AND status = 'PENDING'
      `,
      [item.id, claimId]
    );

    // Bước 6: Đóng tin đăng -> CLOSED
    await client.query(`UPDATE items SET business_status = 'CLOSED' WHERE id = $1`, [item.id]);

    // Bước 7: Lưu biên bản bàn giao
    const handoverRes = await client.query(
      `
      INSERT INTO handovers (item_id, claim_id, handover_by, claimant_id, handover_at, note)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [item.id, claimId, req.user.id, claim.claimant_id, parsedHandoverAt.toISOString(), cleanNote]
    );

    // Bước 8: Ghi Audit Log
    await client.query(
      `
      INSERT INTO audit_logs (actor_id, action, target_type, target_id, details, ip_address)
      VALUES ($1, 'COMPLETE_HANDOVER', 'ITEM', $2, $3, $4)
      `,
      [
        req.user.id,
        item.id,
        `Bàn giao tin #${item.id} theo Claim #${claimId}. Ghi chú: ${cleanNote}`,
        req.ip || null,
      ]
    );

    await client.query('COMMIT');

    const handover = handoverRes.rows[0];
    return res.status(200).json({
      success: true,
      data: {
        handover: {
          id: Number(handover.id),
          itemId: Number(handover.item_id),
          claimId: Number(handover.claim_id),
          handoverBy: Number(handover.handover_by),
          claimantId: Number(handover.claimant_id),
          handoverAt: handover.handover_at,
          note: handover.note,
          createdAt: handover.created_at,
        },
        claimStatus: 'ACCEPTED',
        itemBusinessStatus: 'CLOSED',
        autoRejectedClaimsCount: rejectOthersRes.rowCount || 0,
      },
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }
    // Mã lỗi 23505 trong PostgreSQL là vi phạm UNIQUE constraint (xảy ra khi 2 request đụng nhau ở tầng DB)
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: 'Xung đột đồng thời: Món đồ này đã được bàn giao bởi một thao tác khác',
        },
      });
    }
    console.error('Complete handover error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Lỗi hệ thống khi ghi nhận bàn giao đồ',
      },
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * POST /api/v1/claims/:id/reject
 * Moderator/Admin từ chối một yêu cầu nhận đồ đang chờ xử lý
 */
const rejectClaim = async (req, res) => {
  let client;
  try {
    const claimId = Number(req.params.id);
    if (!Number.isInteger(claimId) || claimId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID yêu cầu không hợp lệ' },
      });
    }

    const { note, reason } = req.body || {};
    const cleanNote = (note || reason || '').trim() || 'Thông tin đối chiếu chưa trùng khớp với tài sản thực tế';

    client = await pool.connect();
    await client.query('BEGIN');

    const claimRes = await client.query('SELECT * FROM claims WHERE id = $1 FOR UPDATE', [claimId]);
    if (claimRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        error: { code: 'CLAIM_NOT_FOUND', message: 'Không tìm thấy yêu cầu nhận đồ' },
      });
    }

    const claim = claimRes.rows[0];
    if (claim.status !== 'PENDING') {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: `Yêu cầu này đang ở trạng thái ${claim.status}, không thể từ chối`,
        },
      });
    }

    await client.query(`UPDATE claims SET status = 'REJECTED', note = $1 WHERE id = $2`, [cleanNote, claimId]);

    await client.query(
      `
      INSERT INTO audit_logs (actor_id, action, target_type, target_id, details, ip_address)
      VALUES ($1, 'REJECT_CLAIM', 'CLAIM', $2, $3, $4)
      `,
      [req.user.id, claimId, cleanNote, req.ip || null]
    );

    await client.query('COMMIT');

    const updatedRes = await loadAuthorizedClaim(claimId, req.user);
    return res.status(200).json({
      success: true,
      data: updatedRes.claim,
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK').catch(() => {});
    }
    console.error('Reject claim error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi từ chối yêu cầu nhận đồ' },
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};

/**
 * POST /api/v1/claims/:id/withdraw
 * Chủ yêu cầu tự rút lại claim khi đang PENDING
 */
const withdrawClaim = async (req, res) => {
  try {
    const claimId = Number(req.params.id);
    if (!Number.isInteger(claimId) || claimId <= 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'ID yêu cầu không hợp lệ' },
      });
    }

    const claimRes = await pool.query('SELECT * FROM claims WHERE id = $1', [claimId]);
    if (claimRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'CLAIM_NOT_FOUND', message: 'Không tìm thấy yêu cầu nhận đồ' },
      });
    }

    const claim = claimRes.rows[0];
    if (Number(claim.claimant_id) !== Number(req.user.id)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Bạn chỉ có thể rút yêu cầu do chính mình gửi' },
      });
    }

    if (claim.status !== 'PENDING') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'STATE_CONFLICT',
          message: `Không thể rút yêu cầu đã ở trạng thái ${claim.status}`,
        },
      });
    }

    await pool.query(`UPDATE claims SET status = 'WITHDRAWN' WHERE id = $1`, [claimId]);
    const updatedRes = await loadAuthorizedClaim(claimId, req.user);

    return res.status(200).json({
      success: true,
      data: updatedRes.claim,
    });
  } catch (error) {
    console.error('Withdraw claim error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Lỗi hệ thống khi rút yêu cầu nhận đồ' },
    });
  }
};

module.exports = {
  createClaim,
  getMyClaims,
  getAllClaims,
  getClaimById,
  getClaimProofs,
  completeHandover,
  rejectClaim,
  withdrawClaim,
};
