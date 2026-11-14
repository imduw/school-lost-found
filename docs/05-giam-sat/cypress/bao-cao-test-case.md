# Báo cáo kiểm thử Cypress — School Lost & Found

Thời điểm hoàn tất: **lúc 10:01:03 GMT+7 Thứ Bảy, 14 tháng 11, 2026**.

## 1. Kết quả thực thi

| Tổng ca | Đạt | Lỗi | Bỏ qua/chưa chạy | Ảnh |
|---:|---:|---:|---:|---:|
| 106 | 99 | 7 | 0 | 114 |

- Commit ứng dụng: `0befeb43d2b8de151672d426b322259460ffa139`; bộ test là thay đổi đang làm trong workspace.
- Trình duyệt: **chrome 155.0.8059.39**; Cypress **15.21.2**.
- Frontend React/Vite: `http://127.0.0.1:5173`; Express thật: `http://127.0.0.1:5000`.
- PostgreSQL 16 trong Docker riêng, dùng DDL `database/schema.sql`, nạp `database/seed.sql` rồi thay dữ liệu cá nhân bằng dữ liệu Cypress; reset trước mỗi ca.
- Không stub API nghiệp vụ. Chỉ ca giao diện lỗi mạng dùng intercept lỗi có chủ đích; trang evidence API là tài liệu hiển thị request thật.
- Screenshot chụp sau mỗi ca; ca lỗi có thể có thêm ảnh tự động tại thời điểm thất bại. Trạng thái được lấy từ Cypress, không suy ra từ ảnh.

## 2. Danh sách test case

| Mã | Chức năng | Bước kiểm thử | Kết quả mong đợi | Thực tế | Bằng chứng |
|---|---|---|---|---|---|
| ADMIN-01 | Dashboard theo vai trò | ADMIN/MOD/USER gọi stats | ADMIN/MOD có thống kê; USER 403 | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-01.png) |
| ADMIN-02 | Danh sách và tìm kiếm người dùng | ADMIN tìm keyword + role + status | Chỉ tài khoản phù hợp, không có password_hash | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-02.png) |
| ADMIN-03 | Chặn MOD và USER quản lý tài khoản | MOD/USER gọi danh sách, đổi role và khóa user | Tất cả trả 403 | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-03.png) |
| ADMIN-04 | Đổi vai trò và đọc lại | ADMIN nâng USER lên MODERATOR; đăng nhập lại user | Role MODERATOR được lưu và JWT mới có quyền staff | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-04.png) |
| ADMIN-05 | Khóa và mở khóa tài khoản | ADMIN khóa USER, thử login; mở khóa, login lại | Khóa chặn login 403; mở khóa login 200 | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-05.png) |
| ADMIN-06 | Cấm tự hạ quyền hoặc tự khóa ADMIN | ADMIN đổi role bản thân sang USER và khóa chính mình | 400 cho cả hai | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-06.png) |
| ADMIN-07 | Validation quản lý người dùng | ID sai/không tồn tại, role sai, status sai | 400/404; không cập nhật user | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-07.png) |
| ADMIN-08 | Tạo và cập nhật danh mục | ADMIN tạo danh mục tiếng Việt rồi đổi tên/mô tả | 201 có slug; cập nhật lưu đúng | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-08.png) |
| ADMIN-09 | Ẩn danh mục khỏi form tạo tin | ADMIN ẩn category 1; public categories và tạo tin dùng category ẩn | Danh mục ẩn không ở public list; tạo tin bị 400; tin cũ còn xem được | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-09.png) |
| ADMIN-10 | Danh mục trùng và thiếu tên | Tạo tên/slug trùng, tên trống; sửa ID không tồn tại | 409; 400; 404 | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-10.png) |
| ADMIN-11 | MOD chỉ được đọc danh mục quản trị | MOD GET/POST/PUT danh mục | GET 200; POST và PUT 403 | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-11.png) |
| ADMIN-12 | Audit tìm kiếm, lọc và quyền | ADMIN/MOD đọc audit lọc HIDE_ITEM; USER đọc audit | Đúng action và keyword; USER bị 403 | **PASSED** | [Ảnh 1](screenshots/api-admin.cy.js/ADMIN-12.png) |
| AUTH-01 | Health và envelope 404 | GET health và route không tồn tại | Database CONNECTED; route lạ trả 404 ROUTE_NOT_FOUND | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-01.png) |
| AUTH-02 | Đăng nhập vai trò ADMIN | POST login rồi GET me và admin-check bằng JWT | Thông tin tài khoản đúng, không trả password; USER bị chặn admin-check | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-02.png) |
| AUTH-03 | Đăng nhập vai trò MODERATOR | POST login rồi GET me và admin-check bằng JWT | Thông tin tài khoản đúng, không trả password; USER bị chặn admin-check | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-03.png) |
| AUTH-04 | Đăng nhập vai trò USER | POST login rồi GET me và admin-check bằng JWT | Thông tin tài khoản đúng, không trả password; USER bị chặn admin-check | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-04.png) |
| AUTH-05 | Thiếu thông tin đăng nhập | POST /auth/login với dữ liệu không hợp lệ | HTTP 400, envelope lỗi | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-05.png) |
| AUTH-06 | Sai mật khẩu | POST /auth/login với dữ liệu không hợp lệ | HTTP 401, envelope lỗi | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-06.png) |
| AUTH-07 | Tài khoản không tồn tại | POST /auth/login với dữ liệu không hợp lệ | HTTP 401, envelope lỗi | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-07.png) |
| AUTH-08 | Tài khoản bị khóa | POST /auth/login với dữ liệu không hợp lệ | HTTP 403, envelope lỗi | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-08.png) |
| AUTH-09 | Đăng ký và chống tự cấp quyền ADMIN | Đăng ký role ADMIN, đọc me và thử đăng ký email trùng | 201 với role USER; email trùng 409 | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-09.png) |
| AUTH-10 | Validation đăng ký | Gửi thiếu họ tên, mật khẩu ngắn và email rỗng | Các request đều 400, không tạo user | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-10.png) |
| AUTH-11 | Email sai định dạng | Đăng ký email không có @ qua API | 400 VALIDATION_ERROR; không tạo tài khoản | **FAILED** | [Ảnh 1](screenshots/api-auth.cy.js/API%20%E2%80%94%20x%C3%A1c%20th%E1%BB%B1c%20v%C3%A0%20ph%C3%A2n%20quy%E1%BB%81n%20--%20AUTH-11%20%E2%80%94%20Email%20sai%20%C4%91%E1%BB%8Bnh%20d%E1%BA%A1ng%20(failed).png) · [Ảnh 2](screenshots/api-auth.cy.js/AUTH-11.png) |
| AUTH-12 | Thiếu JWT và JWT giả | GET me không token và gửi Bearer không hợp lệ | Cả hai request trả 401 | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-12.png) |
| AUTH-13 | Đăng xuất thu hồi phiên | Đăng nhập, logout rồi dùng lại JWT gọi me | Logout 200; JWT cũ nhận 401 | **PASSED** | [Ảnh 1](screenshots/api-auth.cy.js/AUTH-13.png) |
| AUTH-14 | Khóa tài khoản vô hiệu hóa phiên đang dùng | Đăng nhập USER, ADMIN khóa tài khoản, USER dùng JWT cũ đọc claims/my | API từ chối 401 hoặc 403 | **FAILED** | [Ảnh 1](screenshots/api-auth.cy.js/API%20%E2%80%94%20x%C3%A1c%20th%E1%BB%B1c%20v%C3%A0%20ph%C3%A2n%20quy%E1%BB%81n%20--%20AUTH-14%20%E2%80%94%20Kh%C3%B3a%20t%C3%A0i%20kho%E1%BA%A3n%20v%C3%B4%20hi%E1%BB%87u%20h%C3%B3a%20phi%C3%AAn%20%C4%91ang%20d%C3%B9ng%20(failed).png) · [Ảnh 2](screenshots/api-auth.cy.js/AUTH-14.png) |
| AUTH-15 | Hạ quyền có hiệu lực với JWT cũ | ADMIN hạ MODERATOR về USER; JWT MOD cũ đọc endpoint quản trị | 403 sau khi thay đổi quyền | **FAILED** | [Ảnh 1](screenshots/api-auth.cy.js/API%20%E2%80%94%20x%C3%A1c%20th%E1%BB%B1c%20v%C3%A0%20ph%C3%A2n%20quy%E1%BB%81n%20--%20AUTH-15%20%E2%80%94%20H%E1%BA%A1%20quy%E1%BB%81n%20c%C3%B3%20hi%E1%BB%87u%20l%E1%BB%B1c%20v%E1%BB%9Bi%20JWT%20c%C5%A9%20(failed).png) · [Ảnh 2](screenshots/api-auth.cy.js/AUTH-15.png) |
| CLAIM-01 | Tạo yêu cầu và đọc lại bằng chứng | ADMIN tạo claim trên tin 1; đọc detail/proofs | 201 PENDING, đúng claimant, bằng chứng được lưu | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-01.png) |
| CLAIM-02 | Khách gửi claim | POST /items/1/claims với tài khoản guest | HTTP 401; không thêm claim | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-02.png) |
| CLAIM-03 | Tự claim tin của mình | POST /items/1/claims với tài khoản owner | HTTP 400; không thêm claim | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-03.png) |
| CLAIM-04 | Gửi trùng claim PENDING | POST /items/1/claims với tài khoản claimant | HTTP 409; không thêm claim | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-04.png) |
| CLAIM-05 | Claim tin LOST | POST /items/2/claims với tài khoản other | HTTP 400; không thêm claim | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-05.png) |
| CLAIM-06 | Claim tin đã đóng | POST /items/3/claims với tài khoản other | HTTP 409; không thêm claim | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-06.png) |
| CLAIM-07 | Claim tin ẩn | POST /items/4/claims với tài khoản other | HTTP 403; không thêm claim | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-07.png) |
| CLAIM-08 | Claim tin chưa duyệt | POST /items/5/claims với tài khoản other | HTTP 403; không thêm claim | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-08.png) |
| CLAIM-09 | Claim tin không tồn tại | POST /items/99999/claims với tài khoản other | HTTP 404; không thêm claim | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-09.png) |
| CLAIM-10 | Thiếu bằng chứng | Gửi claim không có mô tả hoặc ảnh | 400 VALIDATION_ERROR | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-10.png) |
| CLAIM-11 | Quyền riêng tư detail và proof | Chủ claim/MOD xem; chủ tin/người khác/khách đọc claim 1 | Chủ claim/MOD 200; người ngoài 403 hoặc 401; không lộ proof | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-11.png) |
| CLAIM-12 | Danh sách của tôi và lọc staff | USER lấy my; MOD lọc PENDING, itemId, keyword | USER chỉ có claim 1,3; MOD nhận claim phù hợp | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-12.png) |
| CLAIM-13 | Rút yêu cầu và cấm rút hộ/lặp | Người khác rút claim 1; chủ claim rút 2 lần | 403; WITHDRAWN; lặp 409 | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-13.png) |
| CLAIM-14 | Từ chối yêu cầu và cấm thao tác lặp | MOD từ chối claim 1 rồi thử lại | REJECTED, audit REJECT_CLAIM; lặp 409 | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-14.png) |
| CLAIM-15 | Bàn giao thành công và từ chối claim còn lại | MOD bàn giao claim 1; kiểm tra DB; gọi lại | ACCEPTED/CLOSED, claim 2 REJECTED, 1 handover cho item 1; lặp 409 | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-15.png) |
| CLAIM-16 | Chống hai bàn giao đồng thời | Gửi đồng thời 2 request bàn giao claim 1 và 2 qua Promise.all; kiểm tra DB | Đúng một 200, một 409; một handover; một ACCEPTED và một REJECTED | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-16.png) |
| CLAIM-17 | USER không được bàn giao hoặc từ chối | USER gọi handover và reject; MOD bàn giao ngày sai | 403 cho USER; 400 ngày sai; chưa có handover mới | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-17.png) |
| CLAIM-18 | ID claim và bộ lọc không hợp lệ | Gửi ID âm, ID không tồn tại, status/itemId sai | 400 hoặc 404 đúng trường hợp | **PASSED** | [Ảnh 1](screenshots/api-claims.cy.js/CLAIM-18.png) |
| ITEM-01 | Danh mục và danh sách công khai | GET categories và items bằng khách | 5 danh mục; chỉ tin 1,2,3 công khai; không có bằng chứng | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-01.png) |
| ITEM-02 | Lọc kết hợp và kết quả rỗng | Tìm từ khóa + loại + danh mục + khu vực; tìm từ khóa không tồn tại | Chỉ tin 1 khớp; từ khóa khác trả [] | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-02.png) |
| ITEM-03 | Tin của tôi và tin ẩn | Khách gọi mine; chủ tin và staff đọc tin ẩn; khách đọc tin ẩn | Khách bị chặn; chủ tin/staff xem được | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-03.png) |
| ITEM-04 | Chi tiết tin và ID lỗi | Đọc tin 1, ID âm, ID không tồn tại | 200 đúng nội dung; 400 và 404 tương ứng | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-04.png) |
| ITEM-05 | Tạo tin LOST và đọc lại | USER tạo tin hợp lệ rồi GET theo ID | 201, chủ tin đúng, dữ liệu bền vững khi đọc lại | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-05.png) |
| ITEM-06 | Tạo tin FOUND và đọc lại | USER tạo tin hợp lệ rồi GET theo ID | 201, chủ tin đúng, dữ liệu bền vững khi đọc lại | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-06.png) |
| ITEM-07 | Khách không được đăng tin | POST items không JWT | 401 UNAUTHENTICATED | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-07.png) |
| ITEM-08 | Thiếu trường bắt buộc itemType | Tạo tin thiếu itemType | 400; số tin trong database giữ nguyên | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-08.png) |
| ITEM-09 | Thiếu trường bắt buộc categoryId | Tạo tin thiếu categoryId | 400; số tin trong database giữ nguyên | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-09.png) |
| ITEM-10 | Thiếu trường bắt buộc title | Tạo tin thiếu title | 400; số tin trong database giữ nguyên | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-10.png) |
| ITEM-11 | Thiếu trường bắt buộc description | Tạo tin thiếu description | 400; số tin trong database giữ nguyên | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-11.png) |
| ITEM-12 | Thiếu trường bắt buộc approximateLocation | Tạo tin thiếu approximateLocation | 400; số tin trong database giữ nguyên | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-12.png) |
| ITEM-13 | Thiếu trường bắt buộc occurredAt | Tạo tin thiếu occurredAt | 400; số tin trong database giữ nguyên | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-13.png) |
| ITEM-14 | Loại tin, danh mục và ngày sai | Tạo tin với itemType lạ, categoryId không tồn tại, ngày sai | 400 cho từng request | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-14.png) |
| ITEM-15 | Chủ tin sửa tin mở | Chủ tin PUT title và đọc lại | Title mới được lưu | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-15.png) |
| ITEM-16 | Cấm sửa tin người khác và tin đóng | USER sửa tin người khác; chủ tin sửa tin CLOSED | 403 và 409; dữ liệu giữ nguyên | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-16.png) |
| ITEM-17 | Đánh dấu tìm thấy và cấm thao tác lặp | Chủ tin LOST resolve 2 lần; người khác resolve | RESOLVED; lặp 409, người khác 403 | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-17.png) |
| ITEM-18 | Ẩn và khôi phục tin đã bàn giao | MOD ẩn tin CLOSED với lý do; khách không xem được; MOD khôi phục | CLOSED được giữ; có audit HIDE_ITEM và RESTORE_ITEM | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-18.png) |
| ITEM-19 | Kiểm duyệt: quyền, lý do và trạng thái | USER ẩn tin; MOD ẩn thiếu lý do; MOD gửi trạng thái sai | 403; 400; 400 | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-19.png) |
| ITEM-20 | Duyệt và từ chối tin chờ | MOD duyệt tin 5 và từ chối tin 1 có lý do | APPROVED và REJECTED; tin từ chối không xuất hiện công khai | **PASSED** | [Ảnh 1](screenshots/api-items.cy.js/ITEM-20.png) |
| FILE-01 | Tạo tin multipart có ảnh | POST items multipart với ảnh PNG | 201, có ảnh PUBLIC và URL tải được | **PASSED** | [Ảnh 1](screenshots/api-uploads.cy.js/FILE-01.png) |
| FILE-02 | Upload thêm và xóa ảnh | Chủ tin thêm PNG, xóa ảnh, GET lại URL và metadata | Upload 201; xóa 200; metadata rỗng; file 404 | **PASSED** | [Ảnh 1](screenshots/api-uploads.cy.js/FILE-02.png) |
| FILE-03 | Cấm upload/xóa ảnh tin của người khác | USER upload vào tin 1; chủ tin upload rồi USER khác xóa | 403 cho thao tác không có quyền | **PASSED** | [Ảnh 1](screenshots/api-uploads.cy.js/FILE-03.png) |
| FILE-04 | Ảnh PRIVATE không lộ trong JSON công khai | Upload PRIVATE, khách và chủ tin đọc detail | Khách images=[]; chủ tin thấy ảnh PRIVATE | **PASSED** | [Ảnh 1](screenshots/api-uploads.cy.js/FILE-04.png) |
| FILE-05 | Ảnh PRIVATE bị chặn khi truy cập URL trực tiếp | Lấy URL PRIVATE bằng chủ tin; khách tải trực tiếp URL không JWT | 401/403/404; nội dung ảnh riêng không được phục vụ công khai | **FAILED** | [Ảnh 1](screenshots/api-uploads.cy.js/API%20%E2%80%94%20upload%20v%C3%A0%20quy%E1%BB%81n%20truy%20c%E1%BA%ADp%20%E1%BA%A3nh%20--%20FILE-05%20%E2%80%94%20%E1%BA%A2nh%20PRIVATE%20b%E1%BB%8B%20ch%E1%BA%B7n%20khi%20truy%20c%E1%BA%ADp%20URL%20tr%E1%BB%B1c%20ti%E1%BA%BFp%20(failed).png) · [Ảnh 2](screenshots/api-uploads.cy.js/FILE-05.png) |
| FILE-06 | Ảnh bằng chứng bị chặn khi truy cập URL trực tiếp | Tạo claim ảnh; khách tải URL proof không JWT | 401/403/404; ảnh bằng chứng được bảo mật như API proofs | **FAILED** | [Ảnh 1](screenshots/api-uploads.cy.js/API%20%E2%80%94%20upload%20v%C3%A0%20quy%E1%BB%81n%20truy%20c%E1%BA%ADp%20%E1%BA%A3nh%20--%20FILE-06%20%E2%80%94%20%E1%BA%A2nh%20b%E1%BA%B1ng%20ch%E1%BB%A9ng%20b%E1%BB%8B%20ch%E1%BA%B7n%20khi%20truy%20c%E1%BA%ADp%20URL%20tr%E1%BB%B1c%20ti%E1%BA%BFp%20(failed).png) · [Ảnh 2](screenshots/api-uploads.cy.js/FILE-06.png) |
| FILE-07 | Từ chối file không phải ảnh | Upload dữ liệu vượt quy tắc qua multipart thật | 400 VALIDATION_ERROR | **PASSED** | [Ảnh 1](screenshots/api-uploads.cy.js/FILE-07.png) |
| FILE-08 | Từ chối ảnh vượt 5MB | Upload dữ liệu vượt quy tắc qua multipart thật | 400 VALIDATION_ERROR | **PASSED** | [Ảnh 1](screenshots/api-uploads.cy.js/FILE-08.png) |
| FILE-09 | Từ chối hơn 5 ảnh mỗi request | Upload dữ liệu vượt quy tắc qua multipart thật | 400 VALIDATION_ERROR | **PASSED** | [Ảnh 1](screenshots/api-uploads.cy.js/FILE-09.png) |
| FILE-10 | Chủ tin không thêm ảnh vào tin CLOSED | Upload ảnh vào tin 3 đã bàn giao | 409 STATE_CONFLICT | **PASSED** | [Ảnh 1](screenshots/api-uploads.cy.js/FILE-10.png) |
| UI-13 | Đăng tin LOST kèm ảnh | USER điền form, chọn ảnh thật và đăng; reload chi tiết | Tin và ảnh được lưu, đọc lại sau reload | **PASSED** | [Ảnh 1](screenshots/ui-items-claims.cy.js/UI-13.png) |
| UI-14 | Đăng tin FOUND kèm ảnh | USER điền form, chọn ảnh thật và đăng; reload chi tiết | Tin và ảnh được lưu, đọc lại sau reload | **PASSED** | [Ảnh 1](screenshots/ui-items-claims.cy.js/UI-14.png) |
| UI-15 | Sửa tin và đánh dấu đã tìm thấy | Chủ tin 2 sửa tiêu đề rồi đánh dấu tìm thấy | Title mới lưu; businessStatus RESOLVED; không còn nút sửa | **PASSED** | [Ảnh 1](screenshots/ui-items-claims.cy.js/UI-15.png) |
| UI-16 | Upload thêm ảnh và xóa ảnh | Chủ tin upload ảnh từ trang detail rồi xóa | Ảnh xuất hiện; bấm xóa làm ảnh biến mất và API images rỗng | **PASSED** | [Ảnh 1](screenshots/ui-items-claims.cy.js/UI-16.png) |
| UI-17 | Gửi claim kèm ảnh và rút yêu cầu | ADMIN gửi claim từ chi tiết tin 1; mở my-claims; rút trong dialog | Claim PENDING có ảnh; rút thành WITHDRAWN | **PASSED** | [Ảnh 1](screenshots/ui-items-claims.cy.js/UI-17.png) |
| UI-18 | Lọc yêu cầu của tôi và hủy dialog | USER lọc đang chờ, mở rút yêu cầu rồi Hủy; lọc đã nhận | Hủy không đổi claim; tab đã nhận chỉ có claim ACCEPTED | **PASSED** | [Ảnh 1](screenshots/ui-items-claims.cy.js/UI-18.png) |
| UI-19 | Mobile: đăng tin và gửi claim | Viewport 390×844; tạo tin FOUND; ADMIN khác gửi bằng chứng | Tạo tin và claim thành công qua form mobile | **PASSED** | [Ảnh 1](screenshots/ui-items-claims.cy.js/UI-19.png) |
| UI-20 | Chặn truy cập portal sai vai trò | USER vào staff; MODERATOR vào admin | Cả hai hiện không có quyền, không hiện bảng quản trị | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-20.png) |
| UI-21 | Dashboard admin | Đăng nhập, mở dashboard và chuyển khoảng thống kê | Dashboard hiển thị dữ liệu; không lỗi tải API | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-21.png) |
| UI-22 | Dashboard moderator | Đăng nhập, mở dashboard và chuyển khoảng thống kê | Dashboard hiển thị dữ liệu; không lỗi tải API | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-22.png) |
| UI-23 | Quản lý người dùng: tìm, đổi quyền và khóa | ADMIN tìm claimant, chọn hàng, lưu MODERATOR rồi khóa trong dialog | Role và status lưu trên backend; bảng cập nhật | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-23.png) |
| UI-24 | Danh mục: tạo, sửa và ẩn | ADMIN tạo danh mục; chỉnh tên và tắt hiển thị | Lưu tên mới/isActive=false; public categories không trả danh mục ẩn | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-24.png) |
| UI-25 | Nhật ký: tìm kiếm và lọc hành động | ADMIN lọc HIDE_ITEM và keyword Cypress | Một bản ghi đúng hành động; mở chi tiết được | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-25.png) |
| UI-26 | Kiểm duyệt tin chờ | MOD mở review, chọn Laptop chờ duyệt và duyệt | Tin 5 thành APPROVED và được public đọc | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-26.png) |
| UI-27 | Ẩn tin và bắt buộc nhập lý do | MOD xem tin 1, mở dialog ẩn, submit rỗng rồi nhập lý do | Validation lý do; sau xác nhận tin bị ẩn | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-27.png) |
| UI-28 | Quản lý claim: lọc và từ chối | MOD mở claims, tìm người nhận kiểm thử, chọn claim và từ chối có lý do | Claim 1 thành REJECTED; thông báo thành công | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-28.png) |
| UI-29 | Xác minh ba bước và hoàn tất bàn giao | MOD mở claim 1, thử thiếu checkbox rồi chọn đủ 3 bước và bàn giao | Validation trước; sau đó ACCEPTED/CLOSED, claim còn lại REJECTED | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-29.png) |
| UI-30 | Các alias moderator và item | MOD vào /moderator và /moderator/handover; khách mở /item/1 và /items | Alias render đúng các trang hiện có | **PASSED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI-30.png) |
| UI-31 | Không tự xác nhận các bước đối chiếu khi mở trang | MOD mở bàn giao một claim PENDING, chưa tick checklist | Ba checkbox ban đầu chưa chọn; cán bộ phải chủ động xác nhận | **FAILED** | [Ảnh 1](screenshots/ui-portals.cy.js/UI%20%E2%80%94%20c%E1%BB%95ng%20qu%E1%BA%A3n%20tr%E1%BB%8B%20v%C3%A0%20c%C3%A1n%20b%E1%BB%99%20--%20UI-31%20%E2%80%94%20Kh%C3%B4ng%20t%E1%BB%B1%20x%C3%A1c%20nh%E1%BA%ADn%20c%C3%A1c%20b%C6%B0%E1%BB%9Bc%20%C4%91%E1%BB%91i%20chi%E1%BA%BFu%20khi%20m%E1%BB%9F%20trang%20(failed).png) · [Ảnh 2](screenshots/ui-portals.cy.js/UI-31.png) |
| UI-01 | Trang chủ tải dữ liệu và điều hướng | Mở trang chủ, xem tin gần đây, mở trang tìm đồ | Có tin thật từ seed và liên kết tìm kiếm hoạt động | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-01.png) |
| UI-02 | Đăng nhập, giữ phiên sau reload và đăng xuất | Nhập tài khoản; đăng nhập; reload; đăng xuất | Hiển thị tên user, giữ phiên và xóa token sau logout | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-02.png) |
| UI-03 | Đăng nhập sai hiển thị lỗi | Nhập email đúng và mật khẩu sai | Thông báo lỗi rõ, vẫn ở /login | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-03.png) |
| UI-04 | Đăng ký qua giao diện | Điền họ tên, email, mật khẩu, MSSV và số điện thoại | Tạo USER, chuyển trang chủ, tên người dùng hiển thị | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-04.png) |
| UI-05 | Form đăng nhập bắt buộc nhập dữ liệu | Bấm submit form trống | HTML validation chặn submit; email không hợp lệ | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-05.png) |
| UI-06 | Tìm kiếm và lọc kết hợp | Lọc từ khóa Ví, danh mục ví, khu vực thư viện, loại FOUND | Chỉ một tin ví; bấm mở đúng chi tiết | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-06.png) |
| UI-07 | Không có kết quả và xóa bộ lọc | Tìm từ khóa không tồn tại rồi Xóa lọc | Có trạng thái rỗng, sau reset hiển thị 3 tin | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-07.png) |
| UI-08 | Lọc tin của tôi | USER mở search, chọn Chỉ xem tin của tôi | Có hai tin của user gồm tin ẩn | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-08.png) |
| UI-09 | Chi tiết tin không tồn tại và đường dẫn lạ | Mở /items/99999 rồi đường dẫn không có route | Thông báo lỗi chi tiết; route lạ về trang chủ | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-09-not-found.png) · [Ảnh 2](screenshots/ui-public.cy.js/UI-09.png) |
| UI-10 | Khách bị chặn các trang cần đăng nhập | Mở đăng tin, my-claims và admin | Mỗi trang có hướng dẫn đăng nhập | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-10.png) |
| UI-11 | Lỗi API được hiển thị trên trang tìm đồ | Giả lập duy nhất GET items trả 503 | Hiển thị thông báo lỗi, không render dữ liệu giả | **PASSED** | [Ảnh 1](screenshots/ui-public.cy.js/UI-11.png) |
| UI-12 | Mobile: đăng nhập, tìm và mở chi tiết | Viewport 390×844; đăng nhập; tìm Ví; mở chi tiết | Form và kết quả dùng được; không tràn ngang | **FAILED** | [Ảnh 1](screenshots/ui-public.cy.js/UI%20%E2%80%94%20trang%20c%C3%B4ng%20khai%2C%20x%C3%A1c%20th%E1%BB%B1c%20v%C3%A0%20t%C3%ACm%20ki%E1%BA%BFm%20--%20UI-12%20%E2%80%94%20Mobile%20%C4%91%C4%83ng%20nh%E1%BA%ADp%2C%20t%C3%ACm%20v%C3%A0%20m%E1%BB%9F%20chi%20ti%E1%BA%BFt%20(failed).png) · [Ảnh 2](screenshots/ui-public.cy.js/UI-12.png) |

## 3. Các ca lỗi cần xử lý

### AUTH-11 — Email sai định dạng

- Bước thực hiện: Đăng ký email không có @ qua API
- Kỳ vọng: 400 VALIDATION_ERROR; không tạo tài khoản
- Spec: `cypress/e2e/api-auth.cy.js`

```text
AssertionError: expected 201 to equal 400
    at failure (webpack://web/./cypress/support/cases.js:14:29)
    at Context.eval (webpack://web/./cypress/e2e/api-auth.cy.js:33:120)
    at getRet (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121395:20)
    at tryCatcher (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:1780:23)
    at Promise.attempt.Promise.try (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:4288:29)
    at Context.thenFn (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121406:66)
```

### AUTH-14 — Khóa tài khoản vô hiệu hóa phiên đang dùng

- Bước thực hiện: Đăng nhập USER, ADMIN khóa tài khoản, USER dùng JWT cũ đọc claims/my
- Kỳ vọng: API từ chối 401 hoặc 403
- Spec: `cypress/e2e/api-auth.cy.js`

```text
AssertionError: expected 200 to be one of [ 401, 403 ]
    at Context.eval (webpack://web/./cypress/e2e/api-auth.cy.js:47:90)
    at getRet (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121395:20)
    at tryCatcher (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:1780:23)
    at Promise.attempt.Promise.try (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:4288:29)
    at Context.thenFn (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121406:66)
    at Context.then (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121657:21)
```

### AUTH-15 — Hạ quyền có hiệu lực với JWT cũ

- Bước thực hiện: ADMIN hạ MODERATOR về USER; JWT MOD cũ đọc endpoint quản trị
- Kỳ vọng: 403 sau khi thay đổi quyền
- Spec: `cypress/e2e/api-auth.cy.js`

```text
AssertionError: expected 200 to equal 403
    at failure (webpack://web/./cypress/support/cases.js:14:29)
    at Context.eval (webpack://web/./cypress/e2e/api-auth.cy.js:52:81)
    at getRet (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121395:20)
    at tryCatcher (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:1780:23)
    at Promise.attempt.Promise.try (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:4288:29)
    at Context.thenFn (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121406:66)
```

### FILE-05 — Ảnh PRIVATE bị chặn khi truy cập URL trực tiếp

- Bước thực hiện: Lấy URL PRIVATE bằng chủ tin; khách tải trực tiếp URL không JWT
- Kỳ vọng: 401/403/404; nội dung ảnh riêng không được phục vụ công khai
- Spec: `cypress/e2e/api-uploads.cy.js`

```text
AssertionError: expected 200 to be one of [ 401, 403, 404 ]
    at Context.eval (webpack://web/./cypress/e2e/api-uploads.cy.js:54:52)
    at getRet (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121395:20)
    at tryCatcher (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:1780:23)
    at Promise.attempt.Promise.try (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:4288:29)
    at Context.thenFn (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121406:66)
    at Context.then (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121657:21)
```

### FILE-06 — Ảnh bằng chứng bị chặn khi truy cập URL trực tiếp

- Bước thực hiện: Tạo claim ảnh; khách tải URL proof không JWT
- Kỳ vọng: 401/403/404; ảnh bằng chứng được bảo mật như API proofs
- Spec: `cypress/e2e/api-uploads.cy.js`

```text
AssertionError: expected 200 to be one of [ 401, 403, 404 ]
    at Context.eval (webpack://web/./cypress/e2e/api-uploads.cy.js:65:52)
    at getRet (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121395:20)
    at tryCatcher (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:1780:23)
    at Promise.attempt.Promise.try (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:4288:29)
    at Context.thenFn (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121406:66)
    at Context.then (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121657:21)
```

### UI-31 — Không tự xác nhận các bước đối chiếu khi mở trang

- Bước thực hiện: MOD mở bàn giao một claim PENDING, chưa tick checklist
- Kỳ vọng: Ba checkbox ban đầu chưa chọn; cán bộ phải chủ động xác nhận
- Spec: `cypress/e2e/ui-portals.cy.js`

```text
AssertionError: Timed out retrying after 8000ms: expected '<input.m02-card-checkbox>' not to be 'checked'
    at Context.eval (webpack://web/./cypress/e2e/ui-portals.cy.js:93:108)
    at Context.callback (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121630:26)
    at getRet (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121395:20)
    at tryCatcher (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:1780:23)
    at Promise.attempt.Promise.try (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:4288:29)
    at thenFn (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121406:66)
    at yieldItem (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121638:16)
    at tryCatcher (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:1780:23)
    at Object.gotValue (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:6449:18)
```

### UI-12 — Mobile: đăng nhập, tìm và mở chi tiết

- Bước thực hiện: Viewport 390×844; đăng nhập; tìm Ví; mở chi tiết
- Kỳ vọng: Form và kết quả dùng được; không tràn ngang
- Spec: `cypress/e2e/ui-public.cy.js`

```text
AssertionError: expected 774 to be at most 390
    at Context.eval (webpack://web/./cypress/e2e/ui-public.cy.js:79:79)
    at getRet (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121395:20)
    at tryCatcher (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:1780:23)
    at Promise.attempt.Promise.try (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:4288:29)
    at Context.thenFn (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121406:66)
    at Context.then (http://127.0.0.1:5173/__cypress/runner/cypress_runner.js:121657:21)
```

## 4. Phạm vi và giới hạn

Bộ test bao phủ các nhóm chức năng đang có: xác thực, tin đăng, tìm kiếm, ảnh, claim, quyền đọc bằng chứng, kiểm duyệt, bàn giao, người dùng, danh mục, dashboard và audit. Xem [hướng dẫn và ma trận phạm vi](../../../apps/web/cypress/README.md). Đây là kết quả của các kịch bản liệt kê, không phải chứng minh mọi tổ hợp đầu vào đều đúng.

- Chạy local HTTP, chưa xác nhận Supabase triển khai, HTTPS, cấu hình production, thiết bị thật hoặc trình duyệt khác.
- Chưa chạy UAT với người dùng đại diện, kiểm thử tải, đánh giá accessibility đầy đủ, CI từ máy thứ hai hoặc quyền xem bộ hồ sơ Drive. Các mục TC12/TC14/TC15/TC16 trong LF-17 còn cần bằng chứng riêng.
- Mobile dùng viewport giả lập trong Chrome.
- Trạng thái bàn giao hiện tại của code là `ACCEPTED` / `CLOSED`; LF-17 mô tả `completed` / `returned`, cần thống nhất hợp đồng nghiệm thu.

## 5. Tệp đính kèm

- [Danh sách screenshot](danh-sach-screenshot.md)
- [Kết quả máy đọc được](results.json)
- [Hướng dẫn chạy lại](../../../apps/web/cypress/README.md)
