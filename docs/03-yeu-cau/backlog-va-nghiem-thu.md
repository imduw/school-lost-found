# Backlog và nghiệm thu — MVP rút gọn trước 16/11

**v0.3, 02/11/2026 — đề xuất cần nhóm/PO chốt.** Người dùng xác nhận hạn áp dụng cho 5 báo cáo và HTTPS/APK. Chưa có sản phẩm/test/approval được xác nhận. Scope rút gọn này thay scope v0.2 để nhóm ước lượng cho hai tuần; không tự ghi đã được stakeholder phê duyệt.

## 1. Yêu cầu MVP và AC

| ID / WBS | Đầu ra | Tiêu chí nghiệm thu | Owner / mục tiêu |
|---|---|---|---|
| R01 / 2.1 | Tài khoản thử và quyền user/moderator | Đăng nhập đúng/sai, đăng xuất; API cần đăng nhập bị từ chối nếu thiếu phiên; user không có quyền moderator; dùng cơ chế auth phù hợp stack | TV3, TV2 review / 05/11 |
| R02 / 3.1 | Tạo/xem/sửa tin văn bản | Loại lost/found, tiêu đề, mô tả, khu vực, ngày, trạng thái; kiểm tra trường bắt buộc phía server; lưu/đọc lại được; chỉ sửa tin mở của mình | TV3 API / TV4 UI / 07–08/11 |
| R03 / 3.1 | Tìm theo từ khóa, loại tin và khu vực | Bộ dữ liệu thử có kết quả mong đợi; lọc kết hợp/xóa lọc/empty state đúng; không lộ tin ẩn cho người ngoài quyền | TV3/TV4 / 08/11 |
| R04 / 4.1 | Yêu cầu nhận đồ với mô tả đối chiếu riêng | Chỉ tin nhặt được còn mở; không tự claim/không gửi trùng pending; người gửi xem claim của mình, moderator xem để xử lý; user khác đổi ID vẫn bị từ chối | TV3 API 10/11, TV4 UI 12/11 |
| R05 / 4.1 | Ghi nhận bàn giao tối thiểu | Moderator đối chiếu thật, từ chối hoặc xác nhận completed **sau khi đã bàn giao**; cập nhật tin returned, lưu người/thời gian; tối đa một bàn giao thành công/tin kể cả request lặp/đồng thời; chủ tin mất đánh dấu resolved | TV3/TV4 / 10–12/11 |
| R06 / 4.1 | Kiểm duyệt hide/restore | Chỉ moderator có quyền, lưu lý do; tin ẩn không hiện với người thường, chủ tin và moderator xem ở nơi quản lý; khôi phục không mở lại tin đã trả | TV2 API 11/11, TV4 UI 12/11 |
| R07 / 2.2, 1.3.x, 5.1–5.3 | HTTPS, kiểm chứng và 5 báo cáo trên Drive | UI/API/CSDL thực chạy ngoài máy tác giả; test quyền, runbook, CI thật, UAT/acceptance; BC1 ký thật, BC2 dictionary, BC3 hai update/matrix, BC4 PDF 15–25 trang, BC5 8–10/rubric; Drive Viewer bằng link | TV2/TV5 kỹ thuật, TV1 hồ sơ / 13–15/11 |

**Hoãn khỏi scope trước hạn:** upload ảnh/tệp, lọc danh mục/trạng thái nâng cao, quy trình claim nhiều tầng, AI matching, chat, bản đồ, mobile native, SSO, notification, dashboard thống kê. Không thêm APK vào scope web chỉ để làm cả hai; thầy cho phép HTTPS **hoặc** APK. Nếu stakeholder cần một phần bị hoãn, ghi thay đổi và ước lượng lại, không âm thầm thêm.

## 2. Quy tắc nghiệp vụ để xác nhận với stakeholder

- Tin found: `open → returned`; chỉ moderator ghi đã bàn giao sau đối chiếu và việc trao thực tế. Claim: `pending → rejected` hoặc `pending → completed`; không có trạng thái accepted trung gian trong MVP rút gọn.
- Một tin tối đa một claim completed. Khi hoàn tất bàn giao, các claim pending còn lại bị đóng/rejected với lý do đồ đã được trả. Cập nhật phải tránh hai bàn giao thành công khi request lặp/đồng thời.
- Tin lost: chủ tin đánh dấu `open → resolved` khi tìm lại được; không mở lại tin đã kết thúc trong MVP.
- Hiển thị `visible/hidden` tách khỏi trạng thái nghiệp vụ; hide/restore không làm mất dấu vết hoặc mở lại món đã trả.
- Chỉ claimant và moderator đọc bằng chứng đối chiếu; không công khai proof, liên hệ riêng hoặc log chứa proof lên trang/tài liệu công khai.

Ai giữ đồ và ai được cấp vai trò moderator cần người dùng/PO xác nhận ở LF-01/02. Bản này chưa chứng nhận quy trình đã được trường đồng ý.

## 3. Model tối thiểu

`User` (id, vai trò, auth theo thư viện); `Post` (chủ, loại, tiêu đề, mô tả, khu vực, ngày, trạng thái nghiệp vụ, hiển thị); `Claim` (tin, người yêu cầu, proof văn bản riêng, trạng thái); dấu vết bàn giao/kiểm duyệt (người, thời gian, lý do phù hợp). Chọn bảng riêng hay trường/audit record sau quyết định stack; không cần thêm hệ thống lớn.

Seed là dữ liệu thử có nhãn, tài khoản được cấp trước; không thu giấy tờ định danh thật để demo. Không có upload ảnh nên không cần storage ảnh cho MVP. TV2 gửi hợp đồng API, TV3/TV4 phối hợp trên hợp đồng đó.

## 4. Test ưu tiên

| ID | Yêu cầu | Cần kiểm tra | Trạng thái |
|---|---|---|---|
| TC01 | R01 | Login đúng/sai, logout, API thiếu phiên/quyền | Chưa chạy |
| TC02 | R02 | Tạo tin, tải lại vẫn có; thiếu trường bị từ chối | Chưa chạy |
| TC03 | R02 | Sửa tin mình, đổi ID sửa tin người khác bị từ chối phía server | Chưa chạy |
| TC04 | Scope cũ | Test upload ảnh được hoãn cùng chức năng, không tính Pass | Không áp dụng cho v0.3 |
| TC05 | R03 | Từ khóa + loại + khu vực, xóa lọc và kết quả rỗng | Chưa chạy |
| TC06 | R04 | Claim hợp lệ; tự claim/trùng pending/tin mất hoặc đã đóng bị từ chối | Chưa chạy |
| TC07 | R04 | User khác đổi ID không đọc được proof | Chưa chạy |
| TC08 | R05 | Moderator ghi bàn giao, đóng tin; gọi lại không sinh lượt thứ hai | Chưa chạy |
| TC09 | R05 | Hai request đồng thời chỉ một bàn giao thành công | Chưa chạy |
| TC10 | R06 | Hide/restore theo quyền, list/detail đúng, không mở lại tin đã trả | Chưa chạy |
| TC11 | R05 | Chủ tin mất tự đóng resolved; người khác bị từ chối | Chưa chạy |
| TC12 | R07 | Người khác cài/chạy từ README/seed/commit chỉ định | Chưa chạy |
| TC13 | R07 | Màn hình chính desktop và mobile giả lập | Chưa chạy |
| TC14 | R07 | Người dùng thật thử và phản hồi/acceptance | Chưa chạy |
| TC15 | R07 | HTTPS ngoài máy tác giả; UI/API không localhost/mock; dữ liệu lưu thật | Chưa chạy |
| TC16 | R07 | Drive không đăng nhập, 5 báo cáo đúng chữ ký/trang/slide và các link | Chưa chạy |

Khi chạy ghi test ID, ngày, người, commit/môi trường, expected/actual và Pass/Fail/Blocked/Not run. Không tính test hoãn/Not run/Blocked là Pass. Dữ liệu TC04 giữ để truy vết scope cũ, không che việc đã hoãn.

Chuỗi truy vết: `R02 → WBS 3.1 → LF-11/LF-14 → URL issue/PR → TC02/TC03 → evidence`. Issue count/commit count không tự đo tỷ lệ sản phẩm hoàn thành.
