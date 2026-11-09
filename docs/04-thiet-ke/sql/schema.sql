-- ==============================================================================
-- School Lost & Found Database Schema (DDL)
-- Version: 2.0 (PostgreSQL / Supabase Native)
-- Target RDBMS: PostgreSQL 14+ / Supabase
-- Author: TV3 - Backend & Data (@dxhai17)
-- Task: LF-10 (#3) - WBS 2.1
-- ==============================================================================

-- Bật extension hỗ trợ UUID nếu cần mở rộng
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Hàm tự động cập nhật timestamp cho cột updated_at
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. BẢNG USERS: Quản lý người dùng, tài khoản và phân quyền
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(30),
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'USER', -- 'USER', 'MODERATOR', 'ADMIN'
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 2. BẢNG CATEGORIES: Danh mục phân loại đồ thất lạc
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. BẢNG ITEMS: Tin đăng báo mất (LOST) hoặc nhặt được (FOUND)
CREATE TABLE IF NOT EXISTS items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    item_type VARCHAR(10) NOT NULL, -- 'LOST', 'FOUND'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    approximate_location VARCHAR(200) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    publication_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED', -- 'PENDING_REVIEW', 'APPROVED', 'HIDDEN', 'REJECTED'
    business_status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'RESERVED', 'CLOSED', 'RESOLVED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_items_type_status ON items(item_type, publication_status, business_status);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);

DROP TRIGGER IF EXISTS trg_items_updated_at ON items;
CREATE TRIGGER trg_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 4. BẢNG ITEM_IMAGES: Hình ảnh đính kèm (Lưu trữ URL ngoài)
CREATE TABLE IF NOT EXISTS item_images (
    id BIGSERIAL PRIMARY KEY,
    item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    storage_url VARCHAR(500) NOT NULL,
    visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC', -- 'PUBLIC', 'PRIVATE'
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_images_item ON item_images(item_id);

-- 5. BẢNG CLAIMS: Yêu cầu nhận lại đồ từ người tự nhận là chủ tài sản
CREATE TABLE IF NOT EXISTS claims (
    id BIGSERIAL PRIMARY KEY,
    item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    claimant_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'
    note TEXT, -- Ghi chú của Moderator/Admin
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_claims_item ON claims(item_id);
CREATE INDEX IF NOT EXISTS idx_claims_claimant ON claims(claimant_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

DROP TRIGGER IF EXISTS trg_claims_updated_at ON claims;
CREATE TRIGGER trg_claims_updated_at
BEFORE UPDATE ON claims
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- 6. BẢNG CLAIM_PROOFS: Bằng chứng đối chiếu bảo mật (Chỉ chủ Claim và Moderator/Admin được xem)
CREATE TABLE IF NOT EXISTS claim_proofs (
    id BIGSERIAL PRIMARY KEY,
    claim_id BIGINT NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
    proof_type VARCHAR(30) NOT NULL, -- 'DESCRIPTION', 'CONTACT', 'SERIAL_NUMBER', 'ATTACHMENT_URL'
    proof_content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proofs_claim ON claim_proofs(claim_id);

-- 7. BẢNG HANDOVERS: Biên bản ghi nhận bàn giao đồ thực tế (Tối đa 1 bàn giao thành công/tin)
CREATE TABLE IF NOT EXISTS handovers (
    id BIGSERIAL PRIMARY KEY,
    item_id BIGINT NOT NULL UNIQUE REFERENCES items(id) ON DELETE RESTRICT,
    claim_id BIGINT NOT NULL UNIQUE REFERENCES claims(id) ON DELETE RESTRICT,
    handover_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    claimant_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    handover_at TIMESTAMPTZ NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. BẢNG AUDIT_LOGS: Nhật ký kiểm toán thao tác quản trị
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action VARCHAR(50) NOT NULL, -- 'HIDE_ITEM', 'RESTORE_ITEM', 'COMPLETE_HANDOVER', 'REJECT_CLAIM'
    target_type VARCHAR(30) NOT NULL, -- 'ITEM', 'CLAIM', 'USER'
    target_id BIGINT NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_target ON audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);
