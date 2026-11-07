# Prompt tạo UI/UX web — School Lost & Found

**07/11/2026 — Đầu vào thiết kế đầy đủ, không phải xác nhận sản phẩm đã triển khai.**

Đọc/đính kèm [đặc tả trang và flow](UI-UX-web-chuc-nang-va-luong.md). Copy khối bên dưới vào công cụ AI thiết kế bạn chọn. Nếu công cụ không nhận file, khối này vẫn có thông tin chính để bắt đầu. Bộ thiết kế đầy đủ có cả phần mở rộng; không tự coi toàn bộ là phạm vi code đã chốt trước hạn.

## Prompt chính — copy từ đây

```text
Bạn là product designer thiết kế một web responsive tiếng Việt cho sinh viên:
“School Lost & Found — Hệ thống quản lý và tìm đồ thất lạc trong trường”.

MỤC TIÊU
Tạo trải nghiệm đầy đủ có sitemap, user flow, design system, các màn hình và prototype liên kết được. Người mất đồ tìm tin hoặc đăng tin mất; người nhặt được đăng tin; người kiểm duyệt xác minh người nhận và ghi nhận bàn giao. Trình bày rõ trạng thái, quyền và việc tiếp theo ở mỗi màn hình.
Đây là thiết kế sản phẩm đầy đủ theo đề tài, có chức năng mở rộng; không tự tuyên bố backend đã tồn tại hoặc tất cả chức năng đã được nhóm duyệt để triển khai. Chỉ làm web; không tạo thêm app Android/iOS.

NHẬN DIỆN
- Tên School Lost & Found, thông điệp thân thiện “Cùng đưa đồ thất lạc về đúng chủ”.
- Phong cách dễ thương, ấm áp, gọn gàng dành cho sinh viên, đủ rõ ràng cho tác vụ quản trị.
- Nền kem #FFF9F2, thẻ trắng #FFFFFF, màu chính tím #6D4AFF với chữ trắng.
- Điểm nhấn mint #DDF5E8, lavender #EEE8FF, peach #FFE4D6. Chữ chính #243247, phụ #566274.
- Font hỗ trợ tiếng Việt: Be Vietnam Pro hoặc Nunito, có fallback sans-serif.
- Thẻ bo 16–20px, nút/input bo 10–12px, bóng nhẹ, khoảng cách theo 4/8px.
- Mascot gốc “Miu Tìm Đồ”: mèo kem tròn, túi chéo mint, thẻ kính lúp tím, nét 2D đơn giản. 4 pose: chào, tìm kiếm, ôm hộp đồ, vui nhẹ sau bàn giao. Nhất quán khuôn mặt/tỷ lệ ở mọi trang.
- Mascot ở home/login/empty/success, không che nội dung, không nhảy liên tục. Không dùng nhân vật có sẵn của thương hiệu khác.
- Không dựng dashboard tối màu dày đặc, không trang trí mỗi thẻ bằng mascot, không bịa số lượt trả đồ hoặc logo trường.

VAI TRÒ
1. Khách: xem home, hướng dẫn, danh sách/chi tiết tin đã duyệt theo phương án thiết kế đầy đủ; đăng nhập/đăng ký.
2. Người dùng: đăng/sửa tin của mình, tìm tin, gửi claim, theo dõi yêu cầu, báo vi phạm, tài khoản và thông báo.
3. Người kiểm duyệt: duyệt/ẩn/khôi phục tin, xem proof, xử lý claim và bàn giao, xử lý báo cáo vi phạm.
4. Admin: quyền kiểm duyệt + quản lý tài khoản, danh mục/khu vực, nhật ký.
Người mất và người nhặt là hai tình huống của cùng vai trò người dùng. Không cho chọn vai trò admin trong đăng ký. UI đổi theo quyền; prototype đổi vai trò chỉ là công cụ demo tách khỏi luồng đăng nhập sản phẩm.

24 MẪU MÀN HÌNH
P01 / Trang chủ: hai CTA “Tôi mất đồ” và “Tôi nhặt được đồ”, giới thiệu ngắn, cách dùng ba bước, tin mới đã duyệt.
P02 /items Tìm đồ: keyword, loại Lost/Found, khu vực; mở rộng danh mục/ngày/sắp xếp; xóa lọc, card, phân trang, no results.
P03 /items/:id Chi tiết tin: nội dung công khai, ảnh, vị trí tương đối, ngày giờ, trạng thái, CTA theo quyền, báo vi phạm, gợi ý tin liên quan.
P04 /login Đăng nhập: email/password, hiện mật khẩu, lỗi/loading, link đăng ký/quên mật khẩu, quay lại trang đang dở khi thành công.
P05 /register Đăng ký: tên, email, mật khẩu/xác nhận, validation; tài khoản thường, không nâng quyền.
P06 /forgot-password và /reset-password: cùng mẫu hai bước, trạng thái gửi yêu cầu, link hết hạn, đặt mật khẩu mới; chỉ thông báo chung không tiết lộ email tồn tại.
P07 /help Hướng dẫn, FAQ, quyền riêng tư; anchor /help#privacy; thông tin đơn vị phụ trách chỉ khi được cung cấp.
U01 /items/new và /items/:id/edit: form tạo/sửa dùng chung, loại tin, tiêu đề, danh mục, mô tả công khai, khu vực, ngày giờ, ảnh; preview, validation, gửi duyệt/hủy, xem lý do khóa sửa.
U02 /me/items Tin của tôi: trạng thái duyệt và trạng thái món đồ tách riêng, sửa, gửi lại sau từ chối, xem lý do ẩn; LOST của mình đánh dấu đã tìm thấy.
U03 /items/:id/claim Gửi yêu cầu: tin đích chỉ đọc, proof riêng dạng mô tả, ảnh bằng chứng nếu có; giải thích ai xem được; gửi/xác nhận thành công.
U04 /me/claims Yêu cầu của tôi: chỉ claim của mình, trạng thái và ngày, lọc, mở chi tiết.
U05 /me/claims/:id Chi tiết yêu cầu: proof, timeline, phản hồi, bổ sung nếu được yêu cầu, rút/hủy hợp lệ; thông tin hẹn/nơi bàn giao riêng và kết quả nhận đồ.
U06 /notifications Thông báo: đọc/chưa đọc, đánh dấu đọc, deep link đúng tin/claim, không chứa proof trong nội dung xem trước.
U07 /account Tài khoản: thông tin cá nhân/liên hệ riêng, đổi mật khẩu, vai trò chỉ đọc, đăng xuất.
A01 /admin Tổng quan: thẻ số lượng thật hoặc ghi rõ dữ liệu mẫu; dẫn tới hàng đợi tin, claim, bàn giao, vi phạm.
A02 /admin/items Danh sách kiểm duyệt: tìm/lọc, tab chờ duyệt/hiển thị/ẩn/từ chối; vào chi tiết.
A03 /admin/items/:id Chi tiết kiểm duyệt: duyệt/từ chối/ẩn/khôi phục có lý do, lịch sử; đây là duyệt nội dung, không phải duyệt người nhận.
A04 /admin/claims Hàng đợi claim: nhóm/lọc theo tin, người và trạng thái; xử lý từng claim.
A05 /admin/claims/:id Chi tiết xác minh: tin + proof riêng + lịch sử; cần bổ sung/chấp thuận/từ chối; chấp thuận chưa phải bàn giao.
A06 /admin/handovers Bàn giao: danh sách + drawer, nơi/hẹn nếu có, người nhận, người thực hiện; chỉ xác nhận sau khi đã trao đồ thực tế.
A07 /admin/reports Báo cáo vi phạm: danh sách + drawer, lý do, xử lý/không vi phạm; ẩn tin là hành động riêng có lý do.
A08 /admin/users Tài khoản: danh sách + drawer, khóa/mở có lý do, quản lý quyền được phép; chỉ admin.
A09 /admin/reference-data Danh mục và khu vực: hai tab, thêm/sửa/vô hiệu hóa; không xóa mất dữ liệu cũ.
A10 /admin/audit Nhật ký: chỉ đọc, lọc người/thời gian/hành động; không hiển thị proof, token hoặc mật khẩu.

ĐIỀU HƯỚNG
Desktop user: Tìm đồ | Tin của tôi | Yêu cầu của tôi | CTA Đăng tin | chuông | avatar.
Mobile user: bottom nav Tìm đồ | Đăng tin | Tin của tôi | Yêu cầu; chuông/avatar ở header.
Admin: sidebar theo quyền, hàng đợi là trọng tâm; link trở về giao diện người dùng.
Giữ bộ lọc/scroll khi quay lại danh sách. Khách bấm hành động cần tài khoản → login → trở về đúng hành động. Không lặp thêm trang có chức năng giống nhau.

FLOW CHÍNH
F01 Home → Login/Register → Tìm đồ; có login sai, tài khoản khóa và session hết hạn.
F02 “Tôi mất đồ” → tìm FOUND → chi tiết → gửi claim → theo dõi. Không thấy tin thì đề nghị đăng LOST.
F03 “Tôi nhặt được đồ” → tạo FOUND → Tin của tôi/Chờ duyệt → moderator duyệt → tin hiển thị.
F04 Tạo LOST → duyệt → chủ tin tự tìm lại được → xác nhận Đã tìm thấy.
F05 Gửi claim → Chờ xác minh → moderator yêu cầu bổ sung hoặc chấp thuận/từ chối → người gửi theo dõi cùng một yêu cầu.
F06 Chấp thuận claim → giữ món đồ/Chờ bàn giao → trao đồ thực tế → moderator ghi nhận → tin Đã trả, claim Đã nhận đồ.
F07 Người dùng rút claim trước chấp thuận hoặc hủy hợp lệ trước bàn giao → cập nhật; hủy giữ đồ thì cho phép tiếp tục xét claim khác.
F08 Báo vi phạm → moderator xem → xử lý/ẩn tin có lý do → người đăng thấy lý do; khôi phục không mở lại món đã trả.
F09 Thông báo → đúng chi tiết; avatar → tài khoản/hướng dẫn/đăng xuất.
F10 Admin quản lý tài khoản/danh mục/nhật ký; người không có quyền bị chặn.

QUY TẮC KHÔNG ĐƯỢC THIẾT KẾ SAI
- Trong prototype đầy đủ này, dùng duyệt trước khi hiển thị; không lẫn với bản đăng trực tiếp.
- Tách “hiển thị tin” và “trạng thái món đồ”. Một tin có thể Bị ẩn và Đã trả đồng thời.
- Chỉ claim tin FOUND đang mở, đã duyệt, không phải của mình. Không claim LOST, tin ẩn, đã đóng hoặc đang giữ cho claim khác; không gửi trùng đang chờ.
- Proof riêng chỉ claimant và kiểm duyệt/admin đúng quyền được xem. Người đăng tin không tự có quyền xem proof.
- Không đưa email/điện thoại/proof ra card, trang chi tiết công khai, notification preview hay log. Không yêu cầu giấy tờ định danh thật trong demo.
- Chấp thuận claim chỉ chuyển món đồ sang Chờ bàn giao. Chỉ ghi nhận trao đồ thực tế mới thành Đã trả/Đã nhận đồ.
- Tối đa một claim nhận thành công/tin. Khi một claim được chấp thuận, claim khác chờ; sau bàn giao hoàn tất, các claim còn chờ bị kết thúc/từ chối với lý do phù hợp. Khi hủy giữ đồ hợp lệ, chúng có thể được xét tiếp.
- LOST chỉ chủ tin đánh dấu Đã tìm thấy. Không tự phát sinh biên bản bàn giao cho thao tác này.
- Khi tin bị ẩn, claimant vẫn có thể xem claim riêng nhưng không được đọc lại toàn bộ tin ẩn nếu không có quyền.
- Matching là gợi ý theo dữ liệu công khai và quy tắc, không phải nhận diện AI hay bằng chứng sở hữu. Đặt module trong chi tiết tin, không cần trang riêng.
- Các nút đổi trạng thái chỉ cập nhật sau kết quả thành công; xử lý xung đột khi người khác đã xử lý trước.
- Không dựng thêm chat thời gian thực, thanh toán, phần thưởng, GPS trực tiếp, SSO trường hoặc app native.

TRẠNG THÁI UX
Tin hiển thị: Chờ duyệt / Đang hiển thị / Bị từ chối / Bị ẩn.
FOUND: Đang tìm chủ / Chờ bàn giao / Đã trả.
LOST: Đang tìm đồ / Đã tìm thấy.
Claim: Chờ xác minh / Đang xác minh / Được chấp thuận / Bị từ chối / Đã nhận đồ / Đã rút / Đã hủy.
Bàn giao: Chờ bàn giao / Đã bàn giao / Đã hủy.
Đây là nhãn UX đề xuất; không tự tạo enum API mới và không mặc định ACCEPTED nghĩa là đã trao đồ.

TRẠNG THÁI VÀ HỘP THOẠI CHUNG
Loading/skeleton; empty; no results/xóa lọc; validation; đang gửi/khóa nút lặp; success; lỗi mạng/retry; hết phiên; 403; 404; dữ liệu vừa đổi/409; ảnh không hợp lệ; tin đã đóng/ẩn/khóa sửa.
Dialogs: bỏ form; đánh dấu đã tìm thấy; rút/hủy claim; từ chối có lý do; duyệt/từ chối/ẩn/khôi phục tin; xác nhận đã bàn giao; báo vi phạm; khóa/mở tài khoản; đổi quyền; vô hiệu hóa danh mục.
Giữ nội dung form khi lỗi, không tự bịa thông báo thành công. Không lưu proof/token trong URL hoặc kho dữ liệu công khai của prototype.

RESPONSIVE VÀ ACCESSIBILITY
Desktop 1440px, mobile 390px; không vỡ ở 360px. Thẻ danh sách 3/2/1 cột theo không gian, filter drawer trên mobile, bảng admin chuyển card khi hẹp.
Form có label, lỗi theo trường, focus rõ, thao tác được bằng bàn phím; modal giữ/trả focus; badge có chữ; chữ thường tương phản mục tiêu 4.5:1; vùng bấm mục tiêu 44px. Reduced motion; mascot có alt phù hợp hoặc là trang trí.

DỮ LIỆU MẪU VÀ TÍNH NHẤT QUÁN
Dùng dữ liệu giả có nhãn demo: người nhặt B, người yêu cầu A/C, moderator M, admin; ví đen, bình nước, tai nghe, chìa khóa. Khu vực thư viện/căn tin/bãi xe, không dùng địa chỉ thành phố lạc đề.
Có FOUND mở với hai claim cạnh tranh, LOST mở, tin ẩn, tin đã trả, tin chờ duyệt, tin bị từ chối. Không dùng tài khoản, số điện thoại hoặc giấy tờ thật.
Khi xác nhận bàn giao trong prototype, cả danh sách tin, chi tiết, claim, notification và admin queue cập nhật nhất quán; không để hai người cùng nhận thành công.

ĐẦU RA THEO ĐỢT
1. Trước tiên đưa sitemap, flow, design tokens/components và danh sách frame đủ 24 mẫu; chỉ rõ các quyết định UX.
2. Thiết kế P01–P07 + U01–U02, desktop và mobile.
3. Thiết kế U03–U07 + A04–A06, nối từ claim đến bàn giao.
4. Thiết kế A01–A03 + A07–A10, nối kiểm duyệt/quản trị.
5. Bổ sung mọi trạng thái/hộp thoại và kiểm tra luồng đầu-cuối theo từng vai trò.
Mỗi đợt dùng lại cùng component/tên route/state. Không chỉ tạo trang landing đẹp; phải có màn hình thao tác và trạng thái kết thúc.
Nếu công cụ tạo code, chỉ dựng prototype UI trong workspace sản phẩm được chỉ định, không tự dựng backend hay thêm source app vào repo quản trị tài liệu. Mock phải được ghi là demo; không tuyên bố production-ready hoặc đã deploy.
```

## Prompt gọi tiếp theo từng đợt

- **Đợt 1:** “Dựa trên brief trên, chỉ tạo sitemap, flow, design system và inventory 24 mẫu màn hình. Giải thích rõ khác nhau giữa duyệt tin, chấp thuận claim và hoàn tất bàn giao.”
- **Đợt 2:** “Dùng đúng hệ thiết kế đã chọn để dựng P01–P07 và U01–U02; liên kết luồng khách → đăng nhập → đăng/tìm tin. Bổ sung mobile và trạng thái form.”
- **Đợt 3:** “Dựng U03–U07 và A04–A06; nối toàn bộ claim → xác minh → bàn giao; kiểm tra proof riêng và hai claim cạnh tranh.”
- **Đợt 4:** “Dựng A01–A03 và A07–A10; phân biệt admin và moderator; nối với tin/thông báo hiện có, không tạo dữ liệu trạng thái riêng mâu thuẫn.”
- **Đợt 5:** “Chạy walkthrough F01–F10 cho từng vai trò, liệt kê link/nút chưa có đích, màn hình thiếu, dữ liệu riêng bị lộ và trạng thái chưa nhất quán; sửa chúng, rồi xuất bản prototype để review.”

## Khi dùng cho bản MVP trước hạn

Brief trên là bản web đầy đủ mà nhóm trưởng yêu cầu để gen UI/UX. Nếu nhóm quyết định chỉ code MVP R01–R07, dùng lại component và các trang cốt lõi, bỏ các module chưa chốt, đồng thời rút gọn **cả flow và trạng thái** theo [backlog](../03-yeu-cau/backlog-va-nghiem-thu.md). Không giữ các nút upload/duyệt/matching/thông báo không hoạt động rồi coi đó là chức năng đã triển khai.
