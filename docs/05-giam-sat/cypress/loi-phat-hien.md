# Các lỗi phát hiện bằng Cypress

Ngày kiểm thử: **14/11/2026 (UTC+7)**. Người thực thi: Codex theo yêu cầu kiểm thử của người dùng; chưa có review/nghiệm thu từ thành viên nhóm. Các lỗi dưới đây tái hiện trên ứng dụng local với backend Express thật và PostgreSQL 16 riêng. Chưa sửa mã nghiệp vụ trong đợt kiểm thử này.

Đối chiếu trạng thái lần chạy cuối trong [báo cáo test case](bao-cao-test-case.md) và [ảnh chụp theo mã ca](danh-sach-screenshot.md). Mức ưu tiên là đề xuất để nhóm đánh giá, chưa phải issue đã được giao.

## 1. Danh sách lỗi

| Mã | Ca kiểm thử | Ưu tiên đề xuất | Thực tế | Kỳ vọng / hướng xử lý |
|---|---|---|---|---|
| BUG-01 | AUTH-11 | P2 | `POST /auth/register` với email `not-an-email` trả **201** và tạo user. | API cần kiểm tra định dạng email và trả 400; không chỉ dựa vào input email trên UI. |
| BUG-02 | AUTH-14 | P1 | ADMIN khóa tài khoản nhưng JWT đã cấp trước đó vẫn đọc `/claims/my` với **200**. | Trạng thái SUSPENDED cần có hiệu lực đối với phiên đang dùng; xác minh trạng thái user hoặc phiên tại backend. |
| BUG-03 | AUTH-15 | P1 | MODERATOR bị hạ xuống USER nhưng JWT cũ vẫn gọi `/auth/admin-check` với **200**. | Quyền tại thời điểm request phải theo dữ liệu hiện hành; không giữ quyền quản trị cũ đến hết hạn JWT. |
| BUG-04 | FILE-05, FILE-06 | P1 | Ảnh PRIVATE và ảnh bằng chứng được tải trực tiếp qua `/uploads/...` **không cần JWT**, trả **200**. API JSON có lọc quyền nhưng static file không kiểm tra quyền. | Bảo vệ đường dẫn ảnh riêng bằng xác thực/quyền chủ tin hoặc chủ claim/cán bộ phù hợp; giữ ảnh công khai truy cập được. |
| BUG-05 | UI-12 | P2 | Trang `/items/1` có `scrollWidth` lớn hơn 390 px ở viewport **390×844**, gây cuộn ngang. | Bố cục chi tiết cần co về một cột ở mobile; không rộng hơn viewport. |
| BUG-06 | UI-31 | P1 | Trang bàn giao mở sẵn cả **3 checkbox đã chọn**, gồm bước xác nhận đã đối chiếu trực tiếp. | Mặc định chưa xác minh; cán bộ chủ động chọn từng bước cho yêu cầu đang xử lý. |

## 2. Cách tái hiện

Từ thư mục gốc, chạy toàn bộ:

```bash
npm --prefix apps/web run test:e2e
```

Hoặc chọn spec theo nhóm lỗi:

```bash
npm --prefix apps/web run test:e2e -- --spec 'cypress/e2e/api-auth.cy.js'
npm --prefix apps/web run test:e2e -- --spec 'cypress/e2e/api-uploads.cy.js'
npm --prefix apps/web run test:e2e -- --spec 'cypress/e2e/ui-public.cy.js'
npm --prefix apps/web run test:e2e -- --spec 'cypress/e2e/ui-portals.cy.js'
```

Các lệnh chạy riêng thay thế báo cáo/ảnh lần trước; cần chạy lại toàn bộ để tạo gói evidence hoàn chỉnh. Mỗi test có seed độc lập, vì vậy không cần tái hiện theo thứ tự các ca trước.

## 3. Vị trí cần xem khi sửa

- BUG-01: [auth.controller.js](../../../apps/backend/src/controllers/auth.controller.js), hàm `register`.
- BUG-02/03: [auth.middleware.js](../../../apps/backend/src/middlewares/auth.middleware.js), `verifyToken`, `optionalAuth`, `requireRole`; phối hợp `updateUserStatus`/`updateUserRole`.
- BUG-04: [app.js](../../../apps/backend/src/app.js), middleware static `/uploads`; [upload.middleware.js](../../../apps/backend/src/middlewares/upload.middleware.js) và luồng đọc proof/ảnh.
- BUG-05: [ItemDetail.css](../../../apps/web/src/pages/public/ItemDetail.css), các grid hai cột và cột ảnh cố định.
- BUG-06: [ClaimVerificationHandoverPage.jsx](../../../apps/web/src/pages/staff/ClaimVerificationHandoverPage.jsx), giá trị khởi tạo `checks` và khi chuyển claim.

## 4. Ghi chú kiểm thử

- Luồng chống bàn giao đồng thời dùng **hai request thực sự song song** và kiểm tra bảng `claims`, `items`, `handovers` sau giao dịch; không thay thế bằng hai request tuần tự.
- Ba khác biệt trong bản test UI ban đầu đã được sửa ở bộ test: phản hồi cache 304 là hợp lệ; cần chờ danh mục tải xong trước khi tạo; cần chọn đúng claim sau khi lọc. Những lỗi test này không được tính là lỗi sản phẩm trong báo cáo cuối.
- Validation checklist vẫn được kiểm thử riêng bằng cách bỏ chọn trước khi submit (UI-29). UI-31 kiểm tra giá trị mặc định để không che mất BUG-06.
- Danh sách trên không thay cho đánh giá bảo mật toàn diện hoặc UAT.
