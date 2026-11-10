-- ==============================================================================
-- School Lost & Found Seed Data (DML Fixtures)
-- Version: 2.1 (PostgreSQL / Supabase Native - 5 Team Accounts)
-- Target RDBMS: PostgreSQL 14+ / Supabase
-- Author: TV3 - Backend & Data (@dxhai17)
-- Task: LF-10 (#3) - WBS 2.1
-- ==============================================================================

-- Làm sạch dữ liệu cũ (nếu muốn reset hoàn toàn về trạng thái ban đầu)
-- Bỏ comment dòng dưới nếu muốn xóa toàn bộ dữ liệu hiện có trước khi seed lại:
-- TRUNCATE TABLE audit_logs, handovers, claim_proofs, claims, item_images, items, users, categories RESTART IDENTITY CASCADE;

-- 1. NẠP DANH MỤC TÀI SẢN (CATEGORIES)
INSERT INTO categories (id, name, slug, description, is_active, created_at) VALUES
(1, 'Ví tiền & Bóp', 'vi-tien-bop', 'Ví da, bóp tiền, ví đựng thẻ', TRUE, NOW()),
(2, 'Thiết bị điện tử', 'thiet-bi-dien-tu', 'Điện thoại, laptop, tai nghe, sạc cáp', TRUE, NOW()),
(3, 'Thẻ & Giấy tờ cá nhân', 'the-giay-to', 'Thẻ sinh viên, CCCD, GPLX, thẻ ngân hàng', TRUE, NOW()),
(4, 'Balo, Túi xách & Áo khoác', 'balo-tui-xach', 'Balo học tập, cặp sách, mũ nón, áo khoác', TRUE, NOW()),
(5, 'Chìa khóa & Khác', 'chia-khoa-khac', 'Chìa khóa xe, bình nước, ô dù, đồ dùng cá nhân', TRUE, NOW())
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    slug = EXCLUDED.slug, 
    description = EXCLUDED.description;

-- 2. NẠP 5 TÀI KHOẢN CHÍNH THỨC CỦA NHÓM (USERS)
-- Mật khẩu mặc định cho toàn bộ tài khoản: Test@123456
-- Chuỗi băm BCrypt (cost factor 10): $2b$10$Qj8EsZAIWliMARiuDwtDu.24nwUlGW9zODWnaeipGqmbn45fh66iy
INSERT INTO users (id, email, password_hash, full_name, student_id, phone, role, status, created_at) VALUES
(1, 'vanchien@vku.udn.vn', '$2b$10$Qj8EsZAIWliMARiuDwtDu.24nwUlGW9zODWnaeipGqmbn45fh66iy', 'Nguyễn Văn Chiến', '23IT001', '0905111001', 'ADMIN', 'ACTIVE', NOW()),
(2, 'xuanhai@vku.udn.vn', '$2b$10$Qj8EsZAIWliMARiuDwtDu.24nwUlGW9zODWnaeipGqmbn45fh66iy', 'Đỗ Xuân Hải', '23IT002', '0905111002', 'ADMIN', 'ACTIVE', NOW()),
(3, 'minhduc@vku.udn.vn', '$2b$10$Qj8EsZAIWliMARiuDwtDu.24nwUlGW9zODWnaeipGqmbn45fh66iy', 'Võ Đình Minh Đức', '23IT003', '0905111003', 'MODERATOR', 'ACTIVE', NOW()),
(4, 'thitrang@vku.udn.vn', '$2b$10$Qj8EsZAIWliMARiuDwtDu.24nwUlGW9zODWnaeipGqmbn45fh66iy', 'Nguyễn Thị Trang', '23IT004', '0905111004', 'USER', 'ACTIVE', NOW()),
(5, 'namson@vku.udn.vn', '$2b$10$Qj8EsZAIWliMARiuDwtDu.24nwUlGW9zODWnaeipGqmbn45fh66iy', 'Phạm Viết Nam Sơn', '23IT005', '0905111005', 'USER', 'ACTIVE', NOW())
ON CONFLICT (id) DO UPDATE 
SET email = EXCLUDED.email, 
    password_hash = EXCLUDED.password_hash,
    full_name = EXCLUDED.full_name,
    student_id = EXCLUDED.student_id,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    status = EXCLUDED.status;

-- 3. NẠP TIN ĐĂNG BÁO MẤT VÀ NHẶT ĐƯỢC (ITEMS)
INSERT INTO items (id, user_id, category_id, item_type, title, description, approximate_location, occurred_at, publication_status, business_status, created_at) VALUES
-- Tin 1: FOUND còn OPEN của Nguyễn Thị Trang (ID 4 - USER) -> Dùng kiểm thử Claim & Handover (TC06, TC07, TC08, TC09)
(1, 4, 1, 'FOUND', '[SEED-TEST] Nhặt được ví da nam màu đen ở thư viện', 'Nhặt được chiếc ví da gập đôi màu đen tại bàn học tầng 2 thư viện VKU. Bên trong có một số tiền mặt và thẻ cá nhân.', 'Thư viện VKU - Tầng 2', NOW() - INTERVAL '1 day', 'APPROVED', 'OPEN', NOW() - INTERVAL '1 day'),

-- Tin 2: LOST còn OPEN của Phạm Viết Nam Sơn (ID 5 - USER) -> Dùng kiểm thử Chủ tin tự cập nhật Resolved (TC11)
(2, 5, 3, 'LOST', '[SEED-TEST] Đánh rơi thẻ sinh viên 23IT005 tại bãi đỗ xe', 'Mình bị rơi thẻ sinh viên VKU mang tên Phạm Viết Nam Sơn, khoa CNTT, khóa 23IT tại bãi xe cổng trước trường.', 'Bãi đỗ xe cổng chính VKU', NOW() - INTERVAL '2 days', 'APPROVED', 'OPEN', NOW() - INTERVAL '2 days'),

-- Tin 3: FOUND đã CLOSED của Nguyễn Thị Trang (ID 4 - USER) -> Đã bàn giao xong
(3, 4, 2, 'FOUND', '[SEED-TEST] Nhặt được tai nghe Bluetooth Baseus màu trắng', 'Nhặt được tai nghe nhét tai vỏ nhựa màu trắng ở góc phòng học V.204.', 'Giảng đường V - Phòng V.204', NOW() - INTERVAL '3 days', 'APPROVED', 'CLOSED', NOW() - INTERVAL '3 days'),

-- Tin 4: LOST bị ẩn (HIDDEN) của Phạm Viết Nam Sơn (ID 5 - USER) -> Kiểm tra tìm kiếm không lộ tin ẩn (TC05, TC10)
(4, 5, 5, 'LOST', '[SEED-TEST] Quên bình nước giữ nhiệt inox màu xanh lá', 'Bình nước inox Lock&Lock 500ml màu xanh lá cây bỏ quên ở ghế đá sân bóng rổ.', 'Sân bóng rổ VKU', NOW() - INTERVAL '4 days', 'HIDDEN', 'OPEN', NOW() - INTERVAL '4 days')
ON CONFLICT (id) DO UPDATE 
SET user_id = EXCLUDED.user_id,
    title = EXCLUDED.title, 
    description = EXCLUDED.description, 
    business_status = EXCLUDED.business_status;

-- 4. NẠP YÊU CẦU NHẬN ĐỒ ĐỐI CHIẾU (CLAIMS & PROOFS)
-- Gán 2 claim PENDING trên Tin 1 (Ví da của Trang) từ 2 người khác: Nam Sơn (ID 5) và Xuân Hải (ID 2)
INSERT INTO claims (id, item_id, claimant_id, status, note, created_at) VALUES
(1, 1, 5, 'PENDING', NULL, NOW() - INTERVAL '12 hours'),
(2, 1, 2, 'PENDING', NULL, NOW() - INTERVAL '6 hours')
ON CONFLICT (id) DO UPDATE 
SET claimant_id = EXCLUDED.claimant_id,
    status = EXCLUDED.status;

-- Nạp bằng chứng đối chiếu riêng (CLAIM_PROOFS) cho từng Claim
INSERT INTO claim_proofs (id, claim_id, proof_type, proof_content, created_at) VALUES
(1, 1, 'DESCRIPTION', 'Ví hiệu Pedro da sần màu đen, bên trong ngăn kéo phụ có 1 thẻ ATM BIDV đuôi số 4589 mang tên PHAM VIET NAM SON và đúng 150.000 đồng.', NOW() - INTERVAL '12 hours'),
(2, 2, 'DESCRIPTION', 'Ví da nam màu đen có gắn một móc khóa kim loại hình chữ V nhỏ ở cạnh viền góc phải.', NOW() - INTERVAL '6 hours')
ON CONFLICT (id) DO UPDATE 
SET proof_content = EXCLUDED.proof_content;

-- 5. NẠP BIÊN BẢN BÀN GIAO MẪU CHO TIN ĐÃ CLOSED (Tin 3)
-- Claim 3 của Nam Sơn (ID 5), được Võ Đình Minh Đức (ID 3 - MODERATOR) xác nhận bàn giao
INSERT INTO claims (id, item_id, claimant_id, status, note, created_at) VALUES
(3, 3, 5, 'ACCEPTED', 'Đã đối chiếu khớp số serial vỏ hộp và mở kết nối Bluetooth thành công.', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO UPDATE 
SET claimant_id = EXCLUDED.claimant_id,
    status = EXCLUDED.status;

INSERT INTO handovers (id, item_id, claim_id, handover_by, claimant_id, handover_at, note, created_at) VALUES
(1, 3, 3, 3, 5, NOW() - INTERVAL '1 day', 'Đã trao trả trực tiếp tại Văn phòng Công tác sinh viên. Người nhận xuất trình Thẻ SV 23IT005 trùng khớp.', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO UPDATE 
SET handover_by = EXCLUDED.handover_by,
    claimant_id = EXCLUDED.claimant_id,
    note = EXCLUDED.note;

-- 6. NẠP AUDIT LOG MẪU (Võ Đình Minh Đức - ID 3 - MODERATOR thực hiện)
INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, details, ip_address, created_at) VALUES
(1, 3, 'HIDE_ITEM', 'ITEM', 4, 'Ẩn tin theo yêu cầu do cần xác minh thông tin', '10.0.1.20', NOW() - INTERVAL '3 days'),
(2, 3, 'COMPLETE_HANDOVER', 'ITEM', 3, 'Xác nhận hoàn tất bàn giao tai nghe cho sinh viên Phạm Viết Nam Sơn', '10.0.1.20', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO UPDATE 
SET actor_id = EXCLUDED.actor_id,
    details = EXCLUDED.details;

-- 7. ĐỒNG BỘ SEQUENCES CỦA POSTGRESQL (Tránh lỗi duplicate key khi thêm mới dữ liệu qua API)
SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories));
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('items_id_seq', (SELECT COALESCE(MAX(id), 1) FROM items));
SELECT setval('claims_id_seq', (SELECT COALESCE(MAX(id), 1) FROM claims));
SELECT setval('claim_proofs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM claim_proofs));
SELECT setval('handovers_id_seq', (SELECT COALESCE(MAX(id), 1) FROM handovers));
SELECT setval('audit_logs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM audit_logs));
