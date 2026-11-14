# Danh sách ảnh kiểm thử Cypress

Thời điểm: lúc 10:01:03 GMT+7 Thứ Bảy, 14 tháng 11, 2026. Tổng **114 ảnh**. Ảnh API hiển thị phản hồi backend thật; ảnh UI chụp trực tiếp ứng dụng. Dữ liệu trong ảnh là dữ liệu kiểm thử.

| Test case | Kết quả | Ảnh |
|---|---|---|
| ADMIN-01 — Dashboard theo vai trò | PASSED | [ADMIN-01.png](screenshots/api-admin.cy.js/ADMIN-01.png) |
| ADMIN-02 — Danh sách và tìm kiếm người dùng | PASSED | [ADMIN-02.png](screenshots/api-admin.cy.js/ADMIN-02.png) |
| ADMIN-03 — Chặn MOD và USER quản lý tài khoản | PASSED | [ADMIN-03.png](screenshots/api-admin.cy.js/ADMIN-03.png) |
| ADMIN-04 — Đổi vai trò và đọc lại | PASSED | [ADMIN-04.png](screenshots/api-admin.cy.js/ADMIN-04.png) |
| ADMIN-05 — Khóa và mở khóa tài khoản | PASSED | [ADMIN-05.png](screenshots/api-admin.cy.js/ADMIN-05.png) |
| ADMIN-06 — Cấm tự hạ quyền hoặc tự khóa ADMIN | PASSED | [ADMIN-06.png](screenshots/api-admin.cy.js/ADMIN-06.png) |
| ADMIN-07 — Validation quản lý người dùng | PASSED | [ADMIN-07.png](screenshots/api-admin.cy.js/ADMIN-07.png) |
| ADMIN-08 — Tạo và cập nhật danh mục | PASSED | [ADMIN-08.png](screenshots/api-admin.cy.js/ADMIN-08.png) |
| ADMIN-09 — Ẩn danh mục khỏi form tạo tin | PASSED | [ADMIN-09.png](screenshots/api-admin.cy.js/ADMIN-09.png) |
| ADMIN-10 — Danh mục trùng và thiếu tên | PASSED | [ADMIN-10.png](screenshots/api-admin.cy.js/ADMIN-10.png) |
| ADMIN-11 — MOD chỉ được đọc danh mục quản trị | PASSED | [ADMIN-11.png](screenshots/api-admin.cy.js/ADMIN-11.png) |
| ADMIN-12 — Audit tìm kiếm, lọc và quyền | PASSED | [ADMIN-12.png](screenshots/api-admin.cy.js/ADMIN-12.png) |
| AUTH-01 — Health và envelope 404 | PASSED | [AUTH-01.png](screenshots/api-auth.cy.js/AUTH-01.png) |
| AUTH-02 — Đăng nhập vai trò ADMIN | PASSED | [AUTH-02.png](screenshots/api-auth.cy.js/AUTH-02.png) |
| AUTH-03 — Đăng nhập vai trò MODERATOR | PASSED | [AUTH-03.png](screenshots/api-auth.cy.js/AUTH-03.png) |
| AUTH-04 — Đăng nhập vai trò USER | PASSED | [AUTH-04.png](screenshots/api-auth.cy.js/AUTH-04.png) |
| AUTH-05 — Thiếu thông tin đăng nhập | PASSED | [AUTH-05.png](screenshots/api-auth.cy.js/AUTH-05.png) |
| AUTH-06 — Sai mật khẩu | PASSED | [AUTH-06.png](screenshots/api-auth.cy.js/AUTH-06.png) |
| AUTH-07 — Tài khoản không tồn tại | PASSED | [AUTH-07.png](screenshots/api-auth.cy.js/AUTH-07.png) |
| AUTH-08 — Tài khoản bị khóa | PASSED | [AUTH-08.png](screenshots/api-auth.cy.js/AUTH-08.png) |
| AUTH-09 — Đăng ký và chống tự cấp quyền ADMIN | PASSED | [AUTH-09.png](screenshots/api-auth.cy.js/AUTH-09.png) |
| AUTH-10 — Validation đăng ký | PASSED | [AUTH-10.png](screenshots/api-auth.cy.js/AUTH-10.png) |
| AUTH-11 — Email sai định dạng | FAILED | [API — xác thực và phân quyền -- AUTH-11 — Email sai định dạng (failed).png](screenshots/api-auth.cy.js/API%20%E2%80%94%20x%C3%A1c%20th%E1%BB%B1c%20v%C3%A0%20ph%C3%A2n%20quy%E1%BB%81n%20--%20AUTH-11%20%E2%80%94%20Email%20sai%20%C4%91%E1%BB%8Bnh%20d%E1%BA%A1ng%20(failed).png) |
| AUTH-11 — Email sai định dạng | FAILED | [AUTH-11.png](screenshots/api-auth.cy.js/AUTH-11.png) |
| AUTH-12 — Thiếu JWT và JWT giả | PASSED | [AUTH-12.png](screenshots/api-auth.cy.js/AUTH-12.png) |
| AUTH-13 — Đăng xuất thu hồi phiên | PASSED | [AUTH-13.png](screenshots/api-auth.cy.js/AUTH-13.png) |
| AUTH-14 — Khóa tài khoản vô hiệu hóa phiên đang dùng | FAILED | [API — xác thực và phân quyền -- AUTH-14 — Khóa tài khoản vô hiệu hóa phiên đang dùng (failed).png](screenshots/api-auth.cy.js/API%20%E2%80%94%20x%C3%A1c%20th%E1%BB%B1c%20v%C3%A0%20ph%C3%A2n%20quy%E1%BB%81n%20--%20AUTH-14%20%E2%80%94%20Kh%C3%B3a%20t%C3%A0i%20kho%E1%BA%A3n%20v%C3%B4%20hi%E1%BB%87u%20h%C3%B3a%20phi%C3%AAn%20%C4%91ang%20d%C3%B9ng%20(failed).png) |
| AUTH-14 — Khóa tài khoản vô hiệu hóa phiên đang dùng | FAILED | [AUTH-14.png](screenshots/api-auth.cy.js/AUTH-14.png) |
| AUTH-15 — Hạ quyền có hiệu lực với JWT cũ | FAILED | [API — xác thực và phân quyền -- AUTH-15 — Hạ quyền có hiệu lực với JWT cũ (failed).png](screenshots/api-auth.cy.js/API%20%E2%80%94%20x%C3%A1c%20th%E1%BB%B1c%20v%C3%A0%20ph%C3%A2n%20quy%E1%BB%81n%20--%20AUTH-15%20%E2%80%94%20H%E1%BA%A1%20quy%E1%BB%81n%20c%C3%B3%20hi%E1%BB%87u%20l%E1%BB%B1c%20v%E1%BB%9Bi%20JWT%20c%C5%A9%20(failed).png) |
| AUTH-15 — Hạ quyền có hiệu lực với JWT cũ | FAILED | [AUTH-15.png](screenshots/api-auth.cy.js/AUTH-15.png) |
| CLAIM-01 — Tạo yêu cầu và đọc lại bằng chứng | PASSED | [CLAIM-01.png](screenshots/api-claims.cy.js/CLAIM-01.png) |
| CLAIM-02 — Khách gửi claim | PASSED | [CLAIM-02.png](screenshots/api-claims.cy.js/CLAIM-02.png) |
| CLAIM-03 — Tự claim tin của mình | PASSED | [CLAIM-03.png](screenshots/api-claims.cy.js/CLAIM-03.png) |
| CLAIM-04 — Gửi trùng claim PENDING | PASSED | [CLAIM-04.png](screenshots/api-claims.cy.js/CLAIM-04.png) |
| CLAIM-05 — Claim tin LOST | PASSED | [CLAIM-05.png](screenshots/api-claims.cy.js/CLAIM-05.png) |
| CLAIM-06 — Claim tin đã đóng | PASSED | [CLAIM-06.png](screenshots/api-claims.cy.js/CLAIM-06.png) |
| CLAIM-07 — Claim tin ẩn | PASSED | [CLAIM-07.png](screenshots/api-claims.cy.js/CLAIM-07.png) |
| CLAIM-08 — Claim tin chưa duyệt | PASSED | [CLAIM-08.png](screenshots/api-claims.cy.js/CLAIM-08.png) |
| CLAIM-09 — Claim tin không tồn tại | PASSED | [CLAIM-09.png](screenshots/api-claims.cy.js/CLAIM-09.png) |
| CLAIM-10 — Thiếu bằng chứng | PASSED | [CLAIM-10.png](screenshots/api-claims.cy.js/CLAIM-10.png) |
| CLAIM-11 — Quyền riêng tư detail và proof | PASSED | [CLAIM-11.png](screenshots/api-claims.cy.js/CLAIM-11.png) |
| CLAIM-12 — Danh sách của tôi và lọc staff | PASSED | [CLAIM-12.png](screenshots/api-claims.cy.js/CLAIM-12.png) |
| CLAIM-13 — Rút yêu cầu và cấm rút hộ/lặp | PASSED | [CLAIM-13.png](screenshots/api-claims.cy.js/CLAIM-13.png) |
| CLAIM-14 — Từ chối yêu cầu và cấm thao tác lặp | PASSED | [CLAIM-14.png](screenshots/api-claims.cy.js/CLAIM-14.png) |
| CLAIM-15 — Bàn giao thành công và từ chối claim còn lại | PASSED | [CLAIM-15.png](screenshots/api-claims.cy.js/CLAIM-15.png) |
| CLAIM-16 — Chống hai bàn giao đồng thời | PASSED | [CLAIM-16.png](screenshots/api-claims.cy.js/CLAIM-16.png) |
| CLAIM-17 — USER không được bàn giao hoặc từ chối | PASSED | [CLAIM-17.png](screenshots/api-claims.cy.js/CLAIM-17.png) |
| CLAIM-18 — ID claim và bộ lọc không hợp lệ | PASSED | [CLAIM-18.png](screenshots/api-claims.cy.js/CLAIM-18.png) |
| ITEM-01 — Danh mục và danh sách công khai | PASSED | [ITEM-01.png](screenshots/api-items.cy.js/ITEM-01.png) |
| ITEM-02 — Lọc kết hợp và kết quả rỗng | PASSED | [ITEM-02.png](screenshots/api-items.cy.js/ITEM-02.png) |
| ITEM-03 — Tin của tôi và tin ẩn | PASSED | [ITEM-03.png](screenshots/api-items.cy.js/ITEM-03.png) |
| ITEM-04 — Chi tiết tin và ID lỗi | PASSED | [ITEM-04.png](screenshots/api-items.cy.js/ITEM-04.png) |
| ITEM-05 — Tạo tin LOST và đọc lại | PASSED | [ITEM-05.png](screenshots/api-items.cy.js/ITEM-05.png) |
| ITEM-06 — Tạo tin FOUND và đọc lại | PASSED | [ITEM-06.png](screenshots/api-items.cy.js/ITEM-06.png) |
| ITEM-07 — Khách không được đăng tin | PASSED | [ITEM-07.png](screenshots/api-items.cy.js/ITEM-07.png) |
| ITEM-08 — Thiếu trường bắt buộc itemType | PASSED | [ITEM-08.png](screenshots/api-items.cy.js/ITEM-08.png) |
| ITEM-09 — Thiếu trường bắt buộc categoryId | PASSED | [ITEM-09.png](screenshots/api-items.cy.js/ITEM-09.png) |
| ITEM-10 — Thiếu trường bắt buộc title | PASSED | [ITEM-10.png](screenshots/api-items.cy.js/ITEM-10.png) |
| ITEM-11 — Thiếu trường bắt buộc description | PASSED | [ITEM-11.png](screenshots/api-items.cy.js/ITEM-11.png) |
| ITEM-12 — Thiếu trường bắt buộc approximateLocation | PASSED | [ITEM-12.png](screenshots/api-items.cy.js/ITEM-12.png) |
| ITEM-13 — Thiếu trường bắt buộc occurredAt | PASSED | [ITEM-13.png](screenshots/api-items.cy.js/ITEM-13.png) |
| ITEM-14 — Loại tin, danh mục và ngày sai | PASSED | [ITEM-14.png](screenshots/api-items.cy.js/ITEM-14.png) |
| ITEM-15 — Chủ tin sửa tin mở | PASSED | [ITEM-15.png](screenshots/api-items.cy.js/ITEM-15.png) |
| ITEM-16 — Cấm sửa tin người khác và tin đóng | PASSED | [ITEM-16.png](screenshots/api-items.cy.js/ITEM-16.png) |
| ITEM-17 — Đánh dấu tìm thấy và cấm thao tác lặp | PASSED | [ITEM-17.png](screenshots/api-items.cy.js/ITEM-17.png) |
| ITEM-18 — Ẩn và khôi phục tin đã bàn giao | PASSED | [ITEM-18.png](screenshots/api-items.cy.js/ITEM-18.png) |
| ITEM-19 — Kiểm duyệt: quyền, lý do và trạng thái | PASSED | [ITEM-19.png](screenshots/api-items.cy.js/ITEM-19.png) |
| ITEM-20 — Duyệt và từ chối tin chờ | PASSED | [ITEM-20.png](screenshots/api-items.cy.js/ITEM-20.png) |
| FILE-01 — Tạo tin multipart có ảnh | PASSED | [FILE-01.png](screenshots/api-uploads.cy.js/FILE-01.png) |
| FILE-02 — Upload thêm và xóa ảnh | PASSED | [FILE-02.png](screenshots/api-uploads.cy.js/FILE-02.png) |
| FILE-03 — Cấm upload/xóa ảnh tin của người khác | PASSED | [FILE-03.png](screenshots/api-uploads.cy.js/FILE-03.png) |
| FILE-04 — Ảnh PRIVATE không lộ trong JSON công khai | PASSED | [FILE-04.png](screenshots/api-uploads.cy.js/FILE-04.png) |
| FILE-05 — Ảnh PRIVATE bị chặn khi truy cập URL trực tiếp | FAILED | [API — upload và quyền truy cập ảnh -- FILE-05 — Ảnh PRIVATE bị chặn khi truy cập URL trực tiếp (failed).png](screenshots/api-uploads.cy.js/API%20%E2%80%94%20upload%20v%C3%A0%20quy%E1%BB%81n%20truy%20c%E1%BA%ADp%20%E1%BA%A3nh%20--%20FILE-05%20%E2%80%94%20%E1%BA%A2nh%20PRIVATE%20b%E1%BB%8B%20ch%E1%BA%B7n%20khi%20truy%20c%E1%BA%ADp%20URL%20tr%E1%BB%B1c%20ti%E1%BA%BFp%20(failed).png) |
| FILE-05 — Ảnh PRIVATE bị chặn khi truy cập URL trực tiếp | FAILED | [FILE-05.png](screenshots/api-uploads.cy.js/FILE-05.png) |
| FILE-06 — Ảnh bằng chứng bị chặn khi truy cập URL trực tiếp | FAILED | [API — upload và quyền truy cập ảnh -- FILE-06 — Ảnh bằng chứng bị chặn khi truy cập URL trực tiếp (failed).png](screenshots/api-uploads.cy.js/API%20%E2%80%94%20upload%20v%C3%A0%20quy%E1%BB%81n%20truy%20c%E1%BA%ADp%20%E1%BA%A3nh%20--%20FILE-06%20%E2%80%94%20%E1%BA%A2nh%20b%E1%BA%B1ng%20ch%E1%BB%A9ng%20b%E1%BB%8B%20ch%E1%BA%B7n%20khi%20truy%20c%E1%BA%ADp%20URL%20tr%E1%BB%B1c%20ti%E1%BA%BFp%20(failed).png) |
| FILE-06 — Ảnh bằng chứng bị chặn khi truy cập URL trực tiếp | FAILED | [FILE-06.png](screenshots/api-uploads.cy.js/FILE-06.png) |
| FILE-07 — Từ chối file không phải ảnh | PASSED | [FILE-07.png](screenshots/api-uploads.cy.js/FILE-07.png) |
| FILE-08 — Từ chối ảnh vượt 5MB | PASSED | [FILE-08.png](screenshots/api-uploads.cy.js/FILE-08.png) |
| FILE-09 — Từ chối hơn 5 ảnh mỗi request | PASSED | [FILE-09.png](screenshots/api-uploads.cy.js/FILE-09.png) |
| FILE-10 — Chủ tin không thêm ảnh vào tin CLOSED | PASSED | [FILE-10.png](screenshots/api-uploads.cy.js/FILE-10.png) |
| UI-13 — Đăng tin LOST kèm ảnh | PASSED | [UI-13.png](screenshots/ui-items-claims.cy.js/UI-13.png) |
| UI-14 — Đăng tin FOUND kèm ảnh | PASSED | [UI-14.png](screenshots/ui-items-claims.cy.js/UI-14.png) |
| UI-15 — Sửa tin và đánh dấu đã tìm thấy | PASSED | [UI-15.png](screenshots/ui-items-claims.cy.js/UI-15.png) |
| UI-16 — Upload thêm ảnh và xóa ảnh | PASSED | [UI-16.png](screenshots/ui-items-claims.cy.js/UI-16.png) |
| UI-17 — Gửi claim kèm ảnh và rút yêu cầu | PASSED | [UI-17.png](screenshots/ui-items-claims.cy.js/UI-17.png) |
| UI-18 — Lọc yêu cầu của tôi và hủy dialog | PASSED | [UI-18.png](screenshots/ui-items-claims.cy.js/UI-18.png) |
| UI-19 — Mobile: đăng tin và gửi claim | PASSED | [UI-19.png](screenshots/ui-items-claims.cy.js/UI-19.png) |
| UI-20 — Chặn truy cập portal sai vai trò | PASSED | [UI-20.png](screenshots/ui-portals.cy.js/UI-20.png) |
| UI-21 — Dashboard admin | PASSED | [UI-21.png](screenshots/ui-portals.cy.js/UI-21.png) |
| UI-22 — Dashboard moderator | PASSED | [UI-22.png](screenshots/ui-portals.cy.js/UI-22.png) |
| UI-23 — Quản lý người dùng: tìm, đổi quyền và khóa | PASSED | [UI-23.png](screenshots/ui-portals.cy.js/UI-23.png) |
| UI-24 — Danh mục: tạo, sửa và ẩn | PASSED | [UI-24.png](screenshots/ui-portals.cy.js/UI-24.png) |
| UI-25 — Nhật ký: tìm kiếm và lọc hành động | PASSED | [UI-25.png](screenshots/ui-portals.cy.js/UI-25.png) |
| UI-26 — Kiểm duyệt tin chờ | PASSED | [UI-26.png](screenshots/ui-portals.cy.js/UI-26.png) |
| UI-27 — Ẩn tin và bắt buộc nhập lý do | PASSED | [UI-27.png](screenshots/ui-portals.cy.js/UI-27.png) |
| UI-28 — Quản lý claim: lọc và từ chối | PASSED | [UI-28.png](screenshots/ui-portals.cy.js/UI-28.png) |
| UI-29 — Xác minh ba bước và hoàn tất bàn giao | PASSED | [UI-29.png](screenshots/ui-portals.cy.js/UI-29.png) |
| UI-30 — Các alias moderator và item | PASSED | [UI-30.png](screenshots/ui-portals.cy.js/UI-30.png) |
| UI-31 — Không tự xác nhận các bước đối chiếu khi mở trang | FAILED | [UI — cổng quản trị và cán bộ -- UI-31 — Không tự xác nhận các bước đối chiếu khi mở trang (failed).png](screenshots/ui-portals.cy.js/UI%20%E2%80%94%20c%E1%BB%95ng%20qu%E1%BA%A3n%20tr%E1%BB%8B%20v%C3%A0%20c%C3%A1n%20b%E1%BB%99%20--%20UI-31%20%E2%80%94%20Kh%C3%B4ng%20t%E1%BB%B1%20x%C3%A1c%20nh%E1%BA%ADn%20c%C3%A1c%20b%C6%B0%E1%BB%9Bc%20%C4%91%E1%BB%91i%20chi%E1%BA%BFu%20khi%20m%E1%BB%9F%20trang%20(failed).png) |
| UI-31 — Không tự xác nhận các bước đối chiếu khi mở trang | FAILED | [UI-31.png](screenshots/ui-portals.cy.js/UI-31.png) |
| UI-01 — Trang chủ tải dữ liệu và điều hướng | PASSED | [UI-01.png](screenshots/ui-public.cy.js/UI-01.png) |
| UI-02 — Đăng nhập, giữ phiên sau reload và đăng xuất | PASSED | [UI-02.png](screenshots/ui-public.cy.js/UI-02.png) |
| UI-03 — Đăng nhập sai hiển thị lỗi | PASSED | [UI-03.png](screenshots/ui-public.cy.js/UI-03.png) |
| UI-04 — Đăng ký qua giao diện | PASSED | [UI-04.png](screenshots/ui-public.cy.js/UI-04.png) |
| UI-05 — Form đăng nhập bắt buộc nhập dữ liệu | PASSED | [UI-05.png](screenshots/ui-public.cy.js/UI-05.png) |
| UI-06 — Tìm kiếm và lọc kết hợp | PASSED | [UI-06.png](screenshots/ui-public.cy.js/UI-06.png) |
| UI-07 — Không có kết quả và xóa bộ lọc | PASSED | [UI-07.png](screenshots/ui-public.cy.js/UI-07.png) |
| UI-08 — Lọc tin của tôi | PASSED | [UI-08.png](screenshots/ui-public.cy.js/UI-08.png) |
| UI-09 — Chi tiết tin không tồn tại và đường dẫn lạ | PASSED | [UI-09-not-found.png](screenshots/ui-public.cy.js/UI-09-not-found.png) |
| UI-09 — Chi tiết tin không tồn tại và đường dẫn lạ | PASSED | [UI-09.png](screenshots/ui-public.cy.js/UI-09.png) |
| UI-10 — Khách bị chặn các trang cần đăng nhập | PASSED | [UI-10.png](screenshots/ui-public.cy.js/UI-10.png) |
| UI-11 — Lỗi API được hiển thị trên trang tìm đồ | PASSED | [UI-11.png](screenshots/ui-public.cy.js/UI-11.png) |
| UI-12 — Mobile: đăng nhập, tìm và mở chi tiết | FAILED | [UI — trang công khai, xác thực và tìm kiếm -- UI-12 — Mobile đăng nhập, tìm và mở chi tiết (failed).png](screenshots/ui-public.cy.js/UI%20%E2%80%94%20trang%20c%C3%B4ng%20khai%2C%20x%C3%A1c%20th%E1%BB%B1c%20v%C3%A0%20t%C3%ACm%20ki%E1%BA%BFm%20--%20UI-12%20%E2%80%94%20Mobile%20%C4%91%C4%83ng%20nh%E1%BA%ADp%2C%20t%C3%ACm%20v%C3%A0%20m%E1%BB%9F%20chi%20ti%E1%BA%BFt%20(failed).png) |
| UI-12 — Mobile: đăng nhập, tìm và mở chi tiết | FAILED | [UI-12.png](screenshots/ui-public.cy.js/UI-12.png) |
