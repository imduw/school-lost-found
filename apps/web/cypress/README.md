# Kiểm thử Cypress — School Lost & Found

Bộ kiểm thử chạy giao diện React và API Express thật với PostgreSQL 16 riêng trong Docker. Có test dương, test âm, phân quyền, lưu dữ liệu, upload ảnh và hai request bàn giao đồng thời. Không dùng mock API nghiệp vụ; riêng UI-11 cố ý giả lập phản hồi 503 để kiểm tra hiển thị lỗi.

## 1. Chạy lại

Yêu cầu: Docker đang chạy và tài khoản có quyền dùng Docker; Google Chrome; Node.js **22.22+** theo yêu cầu của React Router trong dự án. Linux cần các thư viện hệ thống của Cypress và DISPLAY hoặc Xvfb, xem [hướng dẫn cài Cypress](https://docs.cypress.io/app/get-started/install-cypress).

Tại thư mục gốc repository:

```bash
npm ci --prefix apps/backend
npm ci --prefix apps/web
npm --prefix apps/web run test:e2e
```

Hai cổng **5000** và **5173** cần còn trống. Runner tự tạo database, chạy schema/seed, khởi động backend/frontend và gọi Cypress Chrome headless. Khi kết thúc, runner dừng server, xóa container/database test và chỉ dọn file upload phát sinh trong lần chạy. Không cần `.env` hoặc tài khoản Supabase. Mật khẩu database/JWT được tạo ngẫu nhiên cho mỗi lần chạy, không ghi vào repo và không đưa vào config trình duyệt Cypress.

Chạy một phần trong lúc phát triển:

```bash
npm --prefix apps/web run test:e2e -- --spec 'cypress/e2e/api-claims.cy.js'
```

**Mỗi lần chạy thay thế báo cáo/ảnh lần trước.** Sau khi kiểm tra một spec, chạy lại toàn bộ để báo cáo bàn giao có đủ ca. Exit code khác 0 khi có ca fail/skipped hoặc lỗi môi trường; các ca phát hiện lỗi sản phẩm giữ trạng thái FAIL đến khi sản phẩm được sửa. Không cấu hình retry hoặc bỏ qua lỗi JavaScript của ứng dụng.

## 2. Ma trận phạm vi

| Nhóm | Spec | Phạm vi |
|---|---|---|
| Xác thực | `api-auth.cy.js` | Health, JSON envelope, đăng nhập ba vai trò, đăng ký, validation, JWT, đăng xuất, khóa tài khoản và hạ quyền |
| Tin đăng | `api-items.cy.js` | Danh mục, tìm/lọc, mine, detail, LOST/FOUND, trường bắt buộc, sửa, resolve, quyền chủ tin, ẩn/duyệt/từ chối/khôi phục |
| Nhận đồ | `api-claims.cy.js` | Tạo, trùng, tự claim, tin đóng/ẩn/chưa duyệt, proof privacy, my, danh sách staff, rút, từ chối, bàn giao, tranh chấp đồng thời |
| Quản trị | `api-admin.cy.js` | Stats, tìm người dùng, quyền ADMIN/MOD/USER, đổi role, khóa/mở khóa, tự bảo vệ admin, danh mục, audit |
| Upload | `api-uploads.cy.js` | Tạo tin multipart, thêm/xóa ảnh, quyền ảnh PRIVATE, URL ảnh proof, MIME không hợp lệ, quá 5MB, quá 5 file, tin đã đóng |
| Public UI | `ui-public.cy.js` | Trang chủ, login/register/logout, giữ phiên, tìm/lọc/reset/rỗng, mine, điều hướng, trang cần đăng nhập, lỗi API, mobile |
| Items/claims UI | `ui-items-claims.cy.js` | Đăng LOST/FOUND có ảnh, sửa/resolve, thêm/xóa ảnh, gửi bằng chứng, my-claims/rút/hủy dialog, luồng mobile |
| Portal UI | `ui-portals.cy.js` | Chặn sai vai trò, dashboard ADMIN/MOD, người dùng, danh mục, audit, duyệt/ẩn tin, từ chối claim, ba bước xác minh và bàn giao, alias route |

Đối chiếu LF-17: TC01→AUTH; TC02/TC03/TC05/TC10/TC11→ITEM+UI; TC06/TC07/TC08/TC09→CLAIM+FILE+UI; TC13→UI desktop/mobile. TC12 chỉ kiểm tra chạy local trong phiên này, chưa có xác nhận máy thứ hai/CI. TC14 UAT, TC15 HTTPS và TC16 bộ hồ sơ Drive cần chạy riêng. Upload ảnh hiện đã tồn tại trong ứng dụng nên được kiểm thử dù kế hoạch LF-17 cũ từng để ngoài phạm vi.

Đây là bao phủ theo chức năng và kịch bản, không phải tỷ lệ bao phủ từng dòng/nhánh code hay mọi tổ hợp dữ liệu. Chưa có kiểm thử tải, đầy đủ accessibility, cross-browser, thiết bị thật hoặc hạ tầng Supabase/production.

## 3. Dữ liệu kiểm thử

Runner áp dụng nguyên bản `database/schema.sql`, nạp `database/seed.sql`, sau đó thay tên/email/MSSV/điện thoại/bằng chứng và bổ sung trạng thái cần test. Mỗi test reset lại dữ liệu; không dùng database có sẵn của người dùng.

| Account | Vai trò/trạng thái | ID |
|---|---|---:|
| `admin@slf.test` | ADMIN | 1 |
| `other@slf.test` | USER khác | 2 |
| `moderator@slf.test` | MODERATOR | 3 |
| `owner@slf.test` | Chủ tin FOUND | 4 |
| `claimant@slf.test` | Người nhận và chủ tin LOST | 5 |
| `suspended@slf.test` | USER bị khóa | 6 |

Mật khẩu fixture: `Test@123456` (chỉ cho database tạm). Tin 1 FOUND OPEN có hai claim PENDING; tin 2 LOST OPEN; tin 3 FOUND CLOSED có bàn giao; tin 4 HIDDEN; tin 5 PENDING_REVIEW; tin 6 REJECTED. Nội dung riêng trong fixture là dữ liệu giả lập.

## 4. Báo cáo và screenshot

- [Báo cáo chi tiết từng test case](../../../docs/05-giam-sat/cypress/bao-cao-test-case.md)
- [Danh sách ảnh theo test case](../../../docs/05-giam-sat/cypress/danh-sach-screenshot.md)
- [Kết quả JSON](../../../docs/05-giam-sat/cypress/results.json)
- [Các lỗi sản phẩm phát hiện](../../../docs/05-giam-sat/cypress/loi-phat-hien.md)
- Log server local: `apps/web/cypress/results/backend.log` và `frontend.log` (được bỏ qua bởi root `.gitignore`).

`scripts/e2e-report.cjs` lấy kết quả thực tế từ [sự kiện after:run của Cypress](https://docs.cypress.io/api/node-events/after-run-api), xuất bước kiểm thử, kỳ vọng, trạng thái, lỗi assertion và đường dẫn ảnh. `afterEach` chụp mỗi ca; Cypress tự chụp thêm ảnh tại thời điểm fail. Ảnh API là trang bằng chứng hiển thị phản hồi thật đã che token; ảnh UI là giao diện thực tế.

## 5. Kiểm tra mã nguồn bộ test

```bash
npm --prefix apps/web run lint
npm --prefix apps/web run build
```

Không cần tài khoản Cypress Cloud và không upload kết quả ra dịch vụ ngoài.
