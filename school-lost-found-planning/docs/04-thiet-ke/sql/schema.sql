-- ==============================================================================
-- School Lost & Found Database Schema (DDL)
-- Version: 1.0 (MVP)
-- Target RDBMS: MySQL 8.x / MariaDB 10.x / PostgreSQL compatible syntax
-- Author: TV3 - Backend & Data (@dxhai17)
-- Task: LF-10 (#3) - WBS 2.1
-- ==============================================================================

-- 1. Bảng USERS: Quản lý người dùng, tài khoản và phân quyền
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(30) NULL,
    phone VARCHAR(20) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' COMMENT 'USER, MODERATOR, ADMIN',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT 'ACTIVE, SUSPENDED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng CATEGORIES: Danh mục phân loại đồ thất lạc
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng ITEMS: Tin đăng báo mất (LOST) hoặc nhặt được (FOUND)
CREATE TABLE IF NOT EXISTS items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id INT NOT NULL,
    item_type VARCHAR(10) NOT NULL COMMENT 'LOST, FOUND',
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    approximate_location VARCHAR(200) NOT NULL,
    occurred_at DATETIME NOT NULL,
    publication_status VARCHAR(20) NOT NULL DEFAULT 'APPROVED' COMMENT 'PENDING_REVIEW, APPROVED, HIDDEN, REJECTED',
    business_status VARCHAR(20) NOT NULL DEFAULT 'OPEN' COMMENT 'OPEN, RESERVED, CLOSED, RESOLVED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    CONSTRAINT fk_items_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_items_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_items_type_status (item_type, publication_status, business_status),
    INDEX idx_items_category (category_id),
    INDEX idx_items_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng ITEM_IMAGES: Hình ảnh bài đăng (Lưu URL lưu trữ ngoài)
CREATE TABLE IF NOT EXISTS item_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    storage_url VARCHAR(500) NOT NULL,
    visibility VARCHAR(20) NOT NULL DEFAULT 'PUBLIC' COMMENT 'PUBLIC, PRIVATE',
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_images_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    INDEX idx_images_item (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng CLAIMS: Yêu cầu nhận lại đồ từ người tự nhận là chủ tài sản
CREATE TABLE IF NOT EXISTS claims (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL,
    claimant_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, ACCEPTED, REJECTED, WITHDRAWN',
    note TEXT NULL COMMENT 'Ghi chú phản hồi của Moderator',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_claims_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    CONSTRAINT fk_claims_claimant FOREIGN KEY (claimant_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_claims_item (item_id),
    INDEX idx_claims_claimant (claimant_id),
    INDEX idx_claims_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng CLAIM_PROOFS: Bằng chứng đối chiếu bảo mật (Chỉ chủ Claim và Moderator được xem)
CREATE TABLE IF NOT EXISTS claim_proofs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    claim_id BIGINT NOT NULL,
    proof_type VARCHAR(30) NOT NULL COMMENT 'DESCRIPTION, CONTACT, SERIAL_NUMBER, ATTACHMENT_URL',
    proof_content TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_proofs_claim FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE CASCADE,
    INDEX idx_proofs_claim (claim_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng HANDOVERS: Biên bản ghi nhận bàn giao đồ thực tế (Mỗi tin chỉ tối đa 1 bàn giao)
CREATE TABLE IF NOT EXISTS handovers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id BIGINT NOT NULL UNIQUE COMMENT 'Ràng buộc UNIQUE chống double-handover',
    claim_id BIGINT NOT NULL UNIQUE COMMENT 'Mỗi claim chỉ được bàn giao một lần',
    handover_by BIGINT NOT NULL COMMENT 'ID của Moderator xác nhận',
    claimant_id BIGINT NOT NULL COMMENT 'ID người thực tế nhận lại đồ',
    handover_at DATETIME NOT NULL,
    note TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_handovers_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE RESTRICT,
    CONSTRAINT fk_handovers_claim FOREIGN KEY (claim_id) REFERENCES claims(id) ON DELETE RESTRICT,
    CONSTRAINT fk_handovers_moderator FOREIGN KEY (handover_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_handovers_claimant FOREIGN KEY (claimant_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng AUDIT_LOGS: Nhật ký kiểm toán các thao tác quản trị
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL COMMENT 'HIDE_ITEM, RESTORE_ITEM, COMPLETE_HANDOVER, REJECT_CLAIM',
    target_type VARCHAR(30) NOT NULL COMMENT 'ITEM, CLAIM, USER',
    target_id BIGINT NOT NULL,
    details TEXT NULL,
    ip_address VARCHAR(45) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_audit_target (target_type, target_id),
    INDEX idx_audit_actor (actor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
