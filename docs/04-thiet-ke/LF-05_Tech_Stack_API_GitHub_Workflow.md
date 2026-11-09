# LF-05: CHỐT TECH STACK, CẤU TRÚC SOURCE VÀ QUY TRÌNH GITHUB

| Thông tin | Nội dung |
| :--- | :--- |
| **Issue** | LF-05 – Chốt stack, cấu trúc source và quy trình GitHub |
| **Đầu ra** | Tech Stack Decision; Initial Data/API Contract; Source Structure; GitHub Workflow |
| **Trạng thái** | Bản đề xuất để nhóm xác nhận trước khi freeze |
| **Lưu ý** | Chưa thể xác nhận hoàn tất nghiệm thu nếu chưa có stack do nhóm xác nhận, smoke test, username thật và minh chứng GitHub. |

---

## 1. Mục tiêu và phạm vi LF-05

LF-05 thống nhất nền tảng kỹ thuật để Web và Backend phát triển song song mà không tự định nghĩa dữ liệu/API riêng. Phần này chốt hướng công nghệ, ranh giới source, hợp đồng dữ liệu/API ban đầu và quy trình GitHub; không triển khai toàn bộ sản phẩm.

* Web gồm User Portal và Admin Portal; gọi chung Backend REST API và Database.
* Backend chịu trách nhiệm Business Logic, Authentication/Authorization, State Machine và quyền truy cập dữ liệu.
* WP35 hiện là Rule-based Weighted Scoring; AI Image Recognition và Computer Vision nằm ngoài phạm vi MVP hiện tại.

---

## 2. Đề xuất Tech Stack

Tiêu chí Issue yêu cầu chọn công nghệ nhóm đã từng sử dụng. Bảng sau là cấu hình đề xuất để nhóm biểu quyết/xác nhận, không khẳng định cả 5 thành viên đã thành thạo.

| Thành phần | Đề xuất | Lý do / nguyên tắc |
| :--- | :--- | :--- |
| **Web User + Admin** | React.js + Vite | Một nền tảng Web, chia User/Admin theo route/module; gọi REST API. |
| **Backend** | Java 17 + Spring Boot 3.x | REST API dùng chung; Controller–Service–Repository; transaction và RBAC. |
| **Database** | Supabase (PostgreSQL) | Cơ sở dữ liệu quan hệ mạnh mẽ, hỗ trợ Transaction, Row Level Security (RLS), realtime và dễ dàng quản lý mở rộng. |
| **API Contract** | REST + JSON + OpenAPI/Swagger | Client có thể mock theo contract trước khi Backend hoàn tất. |
| **Image/File Storage** | Cloudinary hoặc object storage tương đương | Lưu file ngoài DB; DB chỉ lưu URL/metadata. |
| **Version Control** | Git + GitHub | Branch, PR, review, Issue và Project tracking. |

### 2.1 Điều kiện chốt stack
* Web, Backend owner xác nhận đã từng làm hoặc dựng được project mẫu chạy được.
* Không chọn framework mới chỉ vì phổ biến nếu nhóm chưa có kinh nghiệm và không đủ thời gian học.
* Smoke test trước khi freeze: Web gọi API; Backend đọc/ghi được record thử trong Database (Supabase).
* Nếu nhóm quen framework/backend/database khác, ưu tiên stack nhóm chứng minh được bằng project mẫu và cập nhật bảng trước khi merge.
* Biên bản chốt stack cần ghi: công nghệ được chọn, người xác nhận, ngày xác nhận và link/ảnh/video project mẫu.

---

## 3. Kiến trúc tổng thể và ranh giới trách nhiệm

```
React Web (User Portal + Admin Portal) ── HTTPS REST API ── Backend ── Database (Supabase)
                                                                 └── Image/File Storage
```

| Thành phần | Chịu trách nhiệm | Không chịu trách nhiệm |
| :--- | :--- | :--- |
| **Web User Portal** | UI/UX, form, client validation, hiển thị kết quả, gọi API. | Không tự xử lý business rules hoặc truy cập DB trực tiếp. |
| **Backend** | Authentication, RBAC, CRUD, State Machine, validation, transaction, events. | Không phụ thuộc giao diện cụ thể. |
| **Database (Supabase)** | Dữ liệu dùng chung, quan hệ, trạng thái, audit/event. | Không cho client truy cập trực tiếp các bảng nghiệp vụ lõi (chỉ truy cập qua API backend). |
| **Admin Portal** | Giao diện quản trị, kiểm duyệt, thống kê. | Không tự cài business logic thay Backend. |

---

## 4. Cấu trúc source đề xuất

Repository `school-lost-found` được tổ chức hợp nhất để quản lý cả tài liệu dự án và mã nguồn ứng dụng (Monorepo), giúp nhóm tinh gọn quy trình làm việc và đồng bộ tài liệu - mã nguồn:

```text
school-lost-found/
├── .github/               # Templates issue, PR, workflows
├── .githooks/             # Hooks kiểm tra commit
│
├── docs/                  # Tài liệu QLDA duy nhất (gồm 01 -> 06 + references)
│   ├── 01-khoi-tao/       # (có chứa phan-cong/ và biên bản ban đầu)
│   ├── 02-lap-ke-hoach/
│   ├── 03-yeu-cau/
│   ├── 04-thiet-ke/
│   ├── 05-giam-sat/
│   ├── 06-ban-giao/       # (có chứa SUBMISSION-CHECKLIST.md)
│   └── references/        # (chứa rubric và đề cương của thầy)
│
├── meeting-notes/         # Biên bản họp định kỳ
│
├── apps/                  # Phần code ứng dụng (web, backend)
│   ├── web/
│   └── backend/
│
├── database/              # Schema & seed SQL
├── .gitignore
└── README.md
```

Nếu nhóm đã có source repository riêng, giữ cấu trúc hiện tại và bổ sung các thư mục tương đương; không di chuyển code khi Sprint đang chạy.

---

## 5. Initial Data Contract

Mô hình khởi tạo ở mức entity/field để các nhóm thiết kế UI và API song song. Kiểu dữ liệu, nullability, index và constraint cuối cùng cần được Backend + Database owner xác nhận trong Data Dictionary/migration.

| Entity | Các trường chính | Ghi chú |
| :--- | :--- | :--- |
| **User** | id, fullName, email, passwordHash, role, accountStatus, createdAt, updatedAt | Role: USER, STAFF, ADMIN; không lưu plain-text password. |
| **Item** | id, ownerId, itemType, categoryId, name, publicDescription, identifyingFeatures, serialOrUniqueMark, approximateLocation, exactLocation, occurredAt, publicationStatus, businessStatus, deletedAt | itemType LOST/FOUND; Public API không trả field private. |
| **ItemImage** | id, itemId, storageUrl, visibility, sortOrder, createdAt | Ảnh lưu ngoài DB; visibility phân biệt public/private. |
| **Category** | id, name, parentId, isActive | Danh mục dùng chung. |
| **Claim** | id, itemId, claimantId, status, message, createdAt, updatedAt | State Machine; người claim không tự Accept. |
| **ClaimProof** | id, claimId, proofType, storageUrlOrValue, visibility, createdAt | Bằng chứng giới hạn theo Actor có quyền. |
| **Return** | id, claimId, initiatedBy, status, handoverAt, completedAt, note | Chỉ khởi tạo từ Claim Accepted hợp lệ. |
| **Notification** | id, recipientId, eventId, type, title, body, readAt, createdAt | In-app notification; eventId chống trùng. |
| **Report** | id, reporterId, targetType, targetId, reason, description, status, handledBy | Phục vụ Moderation & Report. |
| **ItemMatch** | id, sourceItemId, matchedItemId, score, ruleVersion, createdAt | Rule-based score; không có AI embedding trong baseline. |
| **EventLog/Outbox** | eventId, eventType, aggregateType, aggregateId, payload, createdAt, publishedAt | Ghi event nhất quán với transaction. |

### 5.1 Enum và State Machine

| Tên | Giá trị / luồng |
| :--- | :--- |
| **ItemType** | `LOST`, `FOUND` |
| **PublicationStatus** | `PENDING_REVIEW` → `APPROVED` / `REJECTED`; `REJECTED` → `PENDING_REVIEW`; `APPROVED` → `HIDDEN`; `HIDDEN` → `APPROVED`; `APPROVED` → `PENDING_REVIEW` khi sửa trường cốt lõi theo điều kiện. |
| **BusinessStatus** | `OPEN` → `RESERVED` → `CLOSED`; `RESERVED` → `OPEN` khi Claim Accepted bị hủy hợp lệ; `OPEN` → `CLOSED` theo quyền. |
| **ClaimStatus** | `PENDING` → `VERIFICATION` → `ACCEPTED` hoặc `REJECTED`; `PENDING`/`VERIFICATION` → `WITHDRAWN`; `ACCEPTED` → `CANCELLED` trước khi Return hoàn tất. |
| **ReturnStatus** | Chi tiết theo WP37; phải phân biệt đang xử lý, hoàn tất và hủy. |
| **AccountStatus** | `ACTIVE`, `SUSPENDED` (bổ sung `PENDING` nếu SRS yêu cầu). |

> **Lưu ý:** Item có Claim Pending/Verification/Accepted bị Workflow Lock: chủ bài không sửa trường cốt lõi, Soft Delete hoặc đóng thủ công. Chỉ một Claim trên cùng Item được Accept; thao tác đồng thời phải được bảo vệ bằng transaction/locking.

---

## 6. Initial REST API Contract

Quy ước: prefix `/api/v1`; JSON UTF-8; ngày giờ ISO-8601 UTC; ID UUID; Bearer access token; response lỗi thống nhất. Endpoint dưới đây là contract ban đầu, chưa thay thế OpenAPI chi tiết.

| Module | Method + Endpoint | Mục đích |
| :--- | :--- | :--- |
| **Auth** | `POST /auth/register` | Đăng ký. |
| **Auth** | `POST /auth/login` | Đăng nhập, nhận token. |
| **Auth** | `GET /auth/me` | Hồ sơ hiện tại. |
| **Auth** | `POST /auth/forgot-password` | Yêu cầu reset password qua email. |
| **Auth** | `POST /auth/reset-password` | Đặt mật khẩu mới. |
| **Items** | `POST /items` | Tạo bài Lost/Found. |
| **Items** | `GET /items` | Danh sách, tìm kiếm, lọc, phân trang. |
| **Items** | `GET /items/{itemId}` | Chi tiết Item theo quyền. |
| **Items** | `PATCH /items/{itemId}` | Cập nhật khi không Workflow Lock. |
| **Items** | `DELETE /items/{itemId}` | Soft Delete theo quyền. |
| **Items** | `PATCH /items/{itemId}/publication-status` | Duyệt/ẩn/khôi phục theo RBAC. |
| **Matching** | `GET /items/{itemId}/matching-suggestions` | Gợi ý Weighted Scoring. |
| **Claims** | `POST /items/{itemId}/claims` | Tạo Claim hợp lệ. |
| **Claims** | `GET /claims/{claimId}` | Xem Claim theo quyền. |
| **Claims** | `POST /claims/{claimId}/proofs` | Gửi bằng chứng. |
| **Claims** | `POST /claims/{claimId}/verification` | Chuyển Verification. |
| **Claims** | `POST /claims/{claimId}/accept` | Accept; Item OPEN → RESERVED. |
| **Claims** | `POST /claims/{claimId}/reject` | Reject. |
| **Claims** | `POST /claims/{claimId}/withdraw` | Rút Claim. |
| **Claims** | `POST /claims/{claimId}/cancel` | Hủy Accepted trước khi Return hoàn tất. |
| **Returns** | `POST /claims/{claimId}/returns` | Khởi tạo Return. |
| **Returns** | `GET /returns/{returnId}` | Xem trạng thái. |
| **Returns** | `PATCH /returns/{returnId}/status` | Cập nhật theo quyền. |
| **Notifications** | `GET /notifications` | Danh sách thông báo. |
| **Notifications** | `PATCH /notifications/{id}/read` | Đánh dấu đã đọc. |
| **Admin** | `GET /admin/users` | Danh sách user. |
| **Admin** | `PATCH /admin/users/{id}/status` | Khóa/mở tài khoản. |
| **Admin** | `GET /admin/reports` | Báo cáo vi phạm. |
| **Admin** | `GET /admin/statistics` | Dashboard. |

### 6.1 Response format

```json
{
  "success": true,
  "data": { ... },
  "meta": { "requestId": "uuid" }
}
```

```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Item not found"
  },
  "meta": { "requestId": "uuid" }
}
```

### 6.2 Ví dụ Item response công khai

```json
{
  "id": "uuid",
  "itemType": "FOUND",
  "category": {
    "id": "uuid",
    "name": "Electronics"
  },
  "name": "Black wallet",
  "publicDescription": "Found near library",
  "approximateLocation": "VKU campus - Library",
  "occurredAt": "2026-11-02T08:30:00Z",
  "publicationStatus": "APPROVED",
  "businessStatus": "OPEN",
  "images": [
    { "url": "https://storage.example/image.jpg" }
  ]
}
```

*Public Item response không trả identifyingFeatures, serialOrUniqueMark, exactLocation, internalNote, private media hoặc contact information nếu Actor chưa có quyền. Thông tin liên hệ chỉ chia sẻ cho các bên liên quan sau khi Claim Accepted.*

### 6.3 Error code tối thiểu

| HTTP | Code | Trường hợp |
| :--- | :--- | :--- |
| **400** | `VALIDATION_ERROR` | Thiếu field/sai định dạng. |
| **401** | `UNAUTHENTICATED` | Thiếu hoặc token không hợp lệ. |
| **403** | `FORBIDDEN` | Không có quyền. |
| **404** | `ITEM_NOT_FOUND` / `CLAIM_NOT_FOUND` | Không tìm thấy tài nguyên. |
| **409** | `STATE_CONFLICT` | Chuyển trạng thái sai hoặc xung đột đồng thời. |
| **429** | `RATE_LIMITED` | Vượt giới hạn gọi API. |
| **500** | `INTERNAL_ERROR` | Lỗi hệ thống. |

---

## 7. Quy trình GitHub

Repo `school-lost-found` quản lý toàn bộ tài liệu và source code. Mọi đóng góp phải tuân thủ nghiêm ngặt nguyên tắc branch/PR/review.

| Loại branch | Quy ước | Ví dụ |
| :--- | :--- | :--- |
| **Feature** | `feature/<short-description>` | `feature/item-create-api` |
| **Bug fix** | `fix/<short-description>` | `fix/claim-concurrency` |
| **Documentation** | `docs/<short-description>` | `docs/api-contract` |
| **Chore/config** | `chore/<short-description>` | `chore/setup-ci` |

### 7.1 Workflow
1. Nhận Issue; xác nhận Owner, Reviewer, Due date và Acceptance Criteria.
2. Chuyển card `Todo` → `In Progress`; đồng bộ `main` trước khi tạo branch.
3. Tạo branch theo quy ước; chỉ chỉnh sửa phần việc được giao.
4. Commit theo format repo: `[GiaiDoan] loai: mo ta`. Ví dụ: `[Design] docs: define initial API contract`.
5. Push branch và mở PR; liên kết Issue bằng `Closes #<issue-number>`.
6. PR có mô tả, checklist, test evidence và ít nhất một reviewer khác tác giả.
7. Chỉ merge sau khi review và checks đạt.
8. Sau merge, xác nhận Issue đóng và card `Done`; nếu Acceptance Criteria chưa đạt thì giữ mở/Blocked.

### 7.2 Cấu hình cần hoàn thiện
* Thay placeholder `@username-b`, `@username-c`... trong `.github/CODEOWNERS` bằng username thật của 5 thành viên.
* Nên chia `CODEOWNERS` theo thư mục thay vì wildcard `*` áp dụng toàn repo.
* Yêu cầu ít nhất một reviewer khác tác giả; bật branch protection/ruleset cho `main` nếu quyền repo cho phép.
* Mỗi thành viên clone repo và chạy `bash setup-hooks.sh` để cài local hooks.
* Đối chiếu commit-msg hook với `CONTRIBUTING.md`: tài liệu mô tả stage + type, cần bảo đảm hook validate cùng quy tắc nếu type là bắt buộc.
* Board có Backlog, Todo, In Progress, In Review, Done; chỉ đưa 5 task khởi động vào Todo.
* Mỗi card Todo phải có Owner, Reviewer, Due date và Issue link; không tự bịa username hoặc ngày.

---

## 8. 5 task khởi động đề xuất trên Project Board

| # | Task | Owner | Reviewer | Điều kiện Done |
| :-: | :--- | :--- | :--- | :--- |
| **1** | Tạo/chuẩn hóa repository và cấu trúc thư mục monorepo | Chưa phân công | Chưa phân công | Repo có README, .gitignore, source folders và quyền thành viên. |
| **2** | Khởi tạo Supabase DB schema + migration + seed | Chưa phân công | Chưa phân công | Migration/seed chạy được; đọc/ghi record thành công trên Supabase. |
| **3** | Khởi tạo Backend REST API và health check | Chưa phân công | Chưa phân công | Backend chạy local; health endpoint trả 200. |
| **4** | Khởi tạo Web gọi API | Chưa phân công | Chưa phân công | Web client cấu hình API base URL và gọi endpoint thành công. |
| **5** | Xuất OpenAPI/Data Dictionary bản đầu | Chưa phân công | Chưa phân công | Web, Backend thống nhất field, enum, status và endpoint MVP. |

---

## 9. Smoke test và minh chứng nghiệm thu

| Kiểm tra | Cách thực hiện | Minh chứng |
| :--- | :--- | :--- |
| **Backend khởi động** | Chạy local và gọi health endpoint. | Log + response 200. |
| **Database đọc/ghi** | Chạy migration/seed; tạo và đọc lại record trên Supabase. | SQL/log hoặc ảnh Supabase Dashboard table record. |
| **Web gọi API** | Gọi health endpoint/endpoint mock. | Ảnh Network tab/response. |
| **OpenAPI** | Mở Swagger UI hoặc kiểm tra openapi.yaml. | Link Swagger/file. |
| **GitHub workflow** | Tạo branch, commit, PR, review và merge thử. | URL PR đã merge + reviewer. |
| **Permissions/Board** | Kiểm tra 5 thành viên, CODEOWNERS, cột và 5 card Todo. | Ảnh Members, CODEOWNERS, Project Board. |

---

## 10. Các điểm cần nhóm xác nhận trước khi đóng LF-05

* Stack cuối cùng theo kinh nghiệm thực tế của Web, Backend và Database owner (Supabase).
* 5 GitHub username thật và mapping Owner/Reviewer để cập nhật CODEOWNERS.
* 5 cột Project Board và 5 task khởi động; điền Owner, Reviewer, Due date.
* Xác nhận Matching là Rule-based Weighted Scoring. Muốn AI Image Recognition thì phải Scope Change và cập nhật Scope/WBS/WBS Dictionary/API/estimate.
* Xác nhận các quyết định D01–D07 trong SRS ảnh hưởng đến Claim, Return, Item status và Notification trước khi freeze contract.

---

## 11. Checklist nghiệm thu LF-05

| Acceptance Criteria từ Issue | Trạng thái trong bản này | Việc còn lại |
| :--- | :--- | :--- |
| **Chọn stack nhóm đã dùng; test đọc/ghi; hướng dẫn chạy** | ĐỀ XUẤT – CHƯA XÁC NHẬN | Nhóm xác nhận stack; chạy smoke test và lưu bằng chứng. |
| **Freeze data structure/API contract** | BẢN CONTRACT KHỞI TẠO ĐÃ SOẠN | Backend + Web review và commit OpenAPI. |
| **Repo/permissions; CODEOWNERS; PR reviewer** | CHƯA HOÀN TẤT | Điền username, kiểm tra quyền, tạo PR và review. |
| **Board có 5 cột; 5 task Todo; Owner/Reviewer/Due date** | ĐÃ ĐỀ XUẤT 5 TASK | Cập nhật Project Board và điền người/ngày thật. |

> **Kết luận:** Đây là bản nền để nhóm review và chốt LF-05. Không đóng Issue chỉ vì đã có tài liệu; chỉ đóng khi các acceptance criteria có minh chứng thực tế trên repository, Project Board và kết quả smoke test.

---

### Nguồn nội bộ đã đối chiếu
* **WBS Tree & Work Package:** ranh giới Web/Backend, API Integration Mapping, dependency và Out of Scope.
* **WBS Dictionary:** WP33 Lost & Found, WP35 Rule-based Matching, WP36 Claim & Ownership Verification, State Machine và Field Visibility.
* **Project Scope / Week 3 project management material:** Web dùng chung Backend API và Database.
* **GitHub repository school-lost-found:** README, CONTRIBUTING, CODEOWNERS, setup-hooks.sh, PR template và Git hooks.