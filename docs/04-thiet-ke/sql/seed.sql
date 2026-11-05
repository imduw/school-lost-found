-- ==============================================================================
-- School Lost & Found Seed Data (DML Fixtures)
-- Version: 1.0 (MVP)
-- Target RDBMS: MySQL 8.x / MariaDB 10.x / PostgreSQL compatible
-- Author: TV3 - Backend & Data (@dxhai17)
-- Task: LF-10 (#3) - WBS 2.1
-- Ghi chú: Phục vụ kiểm thử trực tiếp các ca TC01, TC02, TC03, TC05, TC06, TC07, TC08, TC09, TC10, TC11 trong LF-17
-- ==============================================================================

-- 1. NẠP DANH MỤC TÀI SẢN (CATEGORIES)
INSERT INTO categories (id, name, slug, description, is_active, created_at) VALUES
(1, 'Ví tiền & Bóp', 'vi-tien-bop', 'Ví da, bóp tiền, ví đựng thẻ', TRUE, NOW()),
(2, 'Thiết bị điện tử', 'thiet-bi-dien-tu', 'Điện thoại, laptop, tai nghe, sạc cáp', TRUE, NOW()),
(3, 'Thẻ & Giấy tờ cá nhân', 'the-giay-to', 'Thẻ sinh viên, CCCD, GPLX, thẻ ngân hàng', TRUE, NOW()),
(4, 'Balo, Túi xách & Áo khoác', 'balo-tui-xach', 'Balo học tập, cặp sách, mũ nón, áo khoác', TRUE, NOW()),
(5, 'Chìa khóa & Khác', 'chia-khoa-khac', 'Chìa khóa xe, bình nước, ô dù, đồ dùng cá nhân', TRUE, NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. NẠP TÀI KHOẢN THỬ NGHIỆM (USERS)
-- Mật khẩu mặc định cho toàn bộ tài khoản thử nghiệm: Test@123456
-- Chuỗi băm BCrypt (cost factor 10): $2a$10$7EqJtq98hPqEX7fNZaODo.9QkG7R8v1qGZZ10R5H7Pz1YhH8WwT7S
INSERT INTO users (id, email, password_hash, full_name, student_id, phone, role, status, created_at) VALUES
(1, 'user_a@vku.udn.vn', '$2a$10$7EqJtq98hPqEX7fNZaODo.9QkG7R8v1qGZZ10R5H7Pz1YhH8WwT7S', 'Nguyễn Văn A', '23IT001', '0905111001', 'USER', 'ACTIVE', NOW()),
(2, 'user_b@vku.udn.vn', '$2a$10$7EqJtq98hPqEX7fNZaODo.9QkG7R8v1qGZZ10R5H7Pz1YhH8WwT7S', 'Trần Thị B', '23IT002', '0905111002', 'USER', 'ACTIVE', NOW()),
(3, 'user_c@vku.udn.vn', '$2a$10$7EqJtq98hPqEX7fNZaODo.9QkG7R8v1qGZZ10R5H7Pz1YhH8WwT7S', 'Lê Văn C', '23IT003', '0905111003', 'USER', 'ACTIVE', NOW()),
(4, 'mod_m@vku.udn.vn', '$2a$10$7EqJtq98hPqEX7fNZaODo.9QkG7R8v1qGZZ10R5H7Pz1YhH8WwT7S', 'Cán bộ Quản lý Đồ thất lạc VKU', 'CB-QL01', '0905999001', 'MODERATOR', 'ACTIVE', NOW()),
(5, 'admin@vku.udn.vn', '$2a$10$7EqJtq98hPqEX7fNZaODo.9QkG7R8v1qGZZ10R5H7Pz1YhH8WwT7S', 'Quản trị viên Hệ thống VKU', 'ADMIN-01', '0905999999', 'ADMIN', 'ACTIVE', NOW())
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 3. NẠP TIN ĐĂNG BÁO MẤT VÀ NHẶT ĐƯỢC (ITEMS)
INSERT INTO items (id, user_id, category_id, item_type, title, description, approximate_location, occurred_at, publication_status, business_status, created_at) VALUES
-- Tin 1: FOUND còn OPEN của User B -> Dùng cho kiểm thử Claim & Concurrency Handover (TC06, TC07, TC08, TC09)
(1, 2, 1, 'FOUND', '[SEED-TEST] Nhặt được ví da nam màu đen ở thư viện', 'Nhặt được chiếc ví da gập đôi màu đen tại bàn học tầng 2 thư viện VKU. Bên trong có một số tiền mặt và thẻ cá nhân.', 'Thư viện VKU - Tầng 2', NOW() - INTERVAL 1 DAY, 'APPROVED', 'OPEN', NOW() - INTERVAL 1 DAY),

-- Tin 2: LOST còn OPEN của User A -> Dùng cho kiểm thử Chủ tin tự cập nhật Resolved (TC11)
(2, 1, 3, 'LOST', '[SEED-TEST] Đánh rơi thẻ sinh viên 23IT001 tại bãi đỗ xe', 'Mình bị rơi thẻ sinh viên VKU mang tên Nguyễn Văn A, khoa CNTT, khóa 23IT tại bãi xe cổng trước trường.', 'Bãi đỗ xe cổng chính VKU', NOW() - INTERVAL 2 DAY, 'APPROVED', 'OPEN', NOW() - INTERVAL 2 DAY),

-- Tin 3: FOUND đã CLOSED (Đã bàn giao hoàn tất trước đó) -> Kiểm tra không cho phép gửi thêm claim
(3, 2, 2, 'FOUND', '[SEED-TEST] Nhặt được tai nghe Bluetooth Baseus màu trắng', 'Nhặt được tai nghe nhét tai vỏ nhựa màu trắng ở góc phòng học V.204.', 'Giảng đường V - Phòng V.204', NOW() - INTERVAL 3 DAY, 'APPROVED', 'CLOSED', NOW() - INTERVAL 3 DAY),

-- Tin 4: LOST nhưng bị Moderator ẩn (HIDDEN) -> Kiểm tra tìm kiếm không lộ tin ẩn (TC05, TC10)
(4, 1, 5, 'LOST', '[SEED-TEST] Quên bình nước giữ nhiệt inox màu xanh lá', 'Bình nước inox Lock&Lock 500ml màu xanh lá cây bỏ quên ở ghế đá sân bóng rổ.', 'Sân bóng rổ VKU', NOW() - INTERVAL 4 DAY, 'HIDDEN', 'OPEN', NOW() - INTERVAL 4 DAY)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- 4. NẠP YÊU CẦU NHẬN ĐỒ ĐỐI CHIẾU (CLAIMS & PROOFS)
-- Gán 2 claim PENDING trên Tin 1 (Ví da) từ 2 người khác nhau: User A (ID 1) và User C (ID 3)
INSERT INTO claims (id, item_id, claimant_id, status, note, created_at) VALUES
(1, 1, 1, 'PENDING', NULL, NOW() - INTERVAL 12 HOUR),
(2, 1, 3, 'PENDING', NULL, NOW() - INTERVAL 6 HOUR)
ON DUPLICATE KEY UPDATE id=VALUES(id);

-- Nạp bằng chứng đối chiếu riêng (CLAIM_PROOFS) cho từng Claim
INSERT INTO claim_proofs (id, claim_id, proof_type, proof_content, created_at) VALUES
(1, 1, 'DESCRIPTION', 'Ví hiệu Pedro da sần màu đen, bên trong ngăn kéo phụ có 1 thẻ ATM BIDV đuôi số 4589 mang tên NGUYEN VAN A và đúng 150.000 đồng.', NOW() - INTERVAL 12 HOUR),
(2, 2, 'DESCRIPTION', 'Ví da nam màu đen có gắn một móc khóa kim loại hình chữ V nhỏ ở cạnh viền góc phải.', NOW() - INTERVAL 6 HOUR)
ON DUPLICATE KEY UPDATE id=VALUES(id);

-- 5. NẠP BIÊN BẢN BÀN GIAO MẪU CHO TIN ĐÃ CLOSED (Tin 3)
INSERT INTO claims (id, item_id, claimant_id, status, note, created_at) VALUES
(3, 3, 1, 'ACCEPTED', 'Đã đối chiếu khớp số serial vỏ hộp và mở kết nối Bluetooth thành công.', NOW() - INTERVAL 2 DAY)
ON DUPLICATE KEY UPDATE id=VALUES(id);

INSERT INTO handovers (id, item_id, claim_id, handover_by, claimant_id, handover_at, note, created_at) VALUES
(1, 3, 3, 4, 1, NOW() - INTERVAL 1 DAY, 'Đã trao trả trực tiếp tại Văn phòng Công tác sinh viên. Người nhận xuất trình Thẻ SV 23IT001 trùng khớp.', NOW() - INTERVAL 1 DAY)
ON DUPLICATE KEY UPDATE id=VALUES(id);

-- 6. NẠP AUDIT LOG MẪU
INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, details, ip_address, created_at) VALUES
(1, 4, 'HIDE_ITEM', 'ITEM', 4, 'Ẩn tin theo yêu cầu do cần xác minh thông tin', '10.0.1.20', NOW() - INTERVAL 3 DAY),
(2, 4, 'COMPLETE_HANDOVER', 'ITEM', 3, 'Xác nhận hoàn tất bàn giao tai nghe cho sinh viên Nguyễn Văn A', '10.0.1.20', NOW() - INTERVAL 1 DAY)
ON DUPLICATE KEY UPDATE id=VALUES(id);
