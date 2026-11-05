# LF-17 — Tiêu chí nghiệm thu và kế hoạch kiểm thử MVP

Baseline v0.1 ghi ngày **05/11/2026 (UTC+7)**, hạn giao 04/11. WBS 1.3.1, Sprint 1 (02–08/11). Owner TV5 (@phamvietnamson), reviewer TV3. Theo dõi tại [issue #5](https://github.com/imduw/school-lost-found/issues/5).

Đối chiếu [M1](../01-khoi-tao/M1-project-charter-stakeholder.md), [hồ sơ phạm vi 03/11](../01-khoi-tao/LF-01-pham-vi-phan-cong-khoi-dong.md) và [backlog R01–R07](backlog-va-nghiem-thu.md). Phạm vi làm việc là web responsive qua HTTPS, tin văn bản và bàn giao do moderator xác nhận. TC04 về upload ảnh giữ trạng thái ngoài phạm vi. M1 vẫn chờ phê duyệt. [LF-05](https://github.com/imduw/school-lost-found/issues/2) đã đóng, tài liệu thiết kế trên nhánh gốc vẫn ghi stack đề xuất. TV2/TV3 cần cung cấp link quyết định stack, hợp đồng API, seed và hướng dẫn chạy để gắn endpoint và thực thi các ca API.

## Điều kiện chạy

Dùng hai user A/B, một moderator M và một phiên chưa đăng nhập. Seed dữ liệu giả gồm tin lost và found của cả A/B, tin mở, ẩn, đã trả, đã giải quyết và tin found có hai claim pending từ hai người khác chủ tin. Dùng môi trường test có thể reset, ghi commit, URL, bản seed và trình duyệt. Kiểm tra quyền bằng request trực tiếp bên cạnh UI. Với ca âm, kiểm tra phản hồi bị từ chối, dữ liệu giữ nguyên và nội dung riêng không xuất hiện trong phản hồi.

## Ca kiểm thử và kết quả mong đợi

| Ca / yêu cầu | Thao tác và tiêu chí đạt | Trạng thái |
|---|---|---|
| TC01 / R01 | Đăng nhập đúng thì truy cập API cần phiên. Sai mật khẩu, thiếu phiên hoặc dùng lại phiên sau logout thì API từ chối. User gọi chức năng moderator bị từ chối. | Not run |
| TC02 / R02 | Tạo tin lost và found với trường hợp lệ, tải lại xác nhận dữ liệu đã lưu. Bỏ lần lượt trường bắt buộc hoặc gửi loại/ngày sai qua API thì không tạo tin. | Not run |
| TC03 / R02 | A sửa tin mở của A và đọc lại giá trị mới. Đổi ID sang tin B hoặc sửa tin đã đóng thì bị từ chối. | Not run |
| TC05 / R03 | Tìm từ khóa, kết hợp loại/khu vực, bỏ lọc và tìm từ khóa không khớp. Kết quả khớp seed, có trạng thái rỗng, tin ẩn vắng ở cả list và detail của người ngoài quyền. | Not run |
| TC06 / R04 | A gửi mô tả đối chiếu riêng cho tin found đang mở của B, tạo đúng một claim pending. Tự claim, gửi trùng pending, claim tin lost, đã đóng hoặc tin ẩn ngoài quyền đều bị từ chối. | Not run |
| TC07 / R04 | Claimant và moderator đọc được mô tả đối chiếu. Chủ tin nếu không phải claimant, user khác và khách đều không đọc được, kể cả đổi ID. List/detail công khai không trả proof. | Not run |
| TC08 / R05 | Trên một tin riêng, M từ chối một claim và kiểm tra trạng thái rejected. Với ca bàn giao, dùng tin found đang mở có hai claim pending. Sau đối chiếu và bàn giao mô phỏng, M hoàn tất một trong hai claim. Tin thành returned, có người/thời gian, các claim pending còn lại bị rejected. User thường, request lặp và thao tác trên claim đã kết thúc không tạo lượt bàn giao mới. | Not run |
| TC09 / R05 | Dùng tin khác hoặc reset seed trước khi chạy. Xác nhận tin found đang mở, có đúng hai claim pending và chưa có bản ghi bàn giao. Gửi đồng thời hai request, mỗi request hoàn tất một claim khác nhau trên cùng tin. Chỉ một claim completed, tin returned và chỉ một bản ghi bàn giao thành công. | Not run |
| TC10 / R06 | M hide/restore có lý do. Chủ tin và M xem được trong phần quản lý, người ngoài quyền không thấy tin ẩn. User thường gọi trực tiếp bị từ chối. Restore tin đã trả giữ trạng thái returned. | Not run |
| TC11 / R05 | Chủ tin lost mở đánh dấu resolved thành công. Người khác đổi ID bị từ chối, thao tác lặp không mở lại tin. | Not run |
| TC12 / R07 | Người thứ hai dùng README, seed và commit chỉ định để chạy lát cắt và kiểm tra CI của commit. Ghi bước lỗi nếu thiếu cấu hình hoặc phụ thuộc. | Not run |
| TC13 / R07 | Trên desktop và mobile giả lập, chạy đăng nhập, đăng/tìm tin và luồng claim theo vai trò. Các nút và form dùng được, lỗi hiển thị rõ. | Not run |
| TC14 / R07 | Người dùng đại diện chạy kịch bản tìm đồ và người giữ đồ xác nhận quy trình trả. Lưu phản hồi, người duyệt và ngày, tách lỗi mở khỏi phần đã chấp nhận. | Not run |
| TC15 / R07 | Từ thiết bị/mạng ngoài máy tác giả, mở HTTPS có chứng chỉ hợp lệ, tạo tin rồi tải lại từ phiên khác. UI gọi API triển khai và đọc lại dữ liệu thật. URL lỗi, gọi localhost/mock hoặc mất dữ liệu thì Fail. | Not run |
| TC16 / R07 | Dùng cửa sổ riêng tư chưa đăng nhập mở thư mục và từng file qua link Viewer. Đối chiếu BC1 chữ ký, BC2 WBS/Dictionary, BC3 register/matrix và hai cập nhật, BC4 PDF 15–25 trang, BC5 8–10 slide và rubric. Link đòi quyền, thiếu file hoặc sai quy cách thì Fail. | Not run |

## Thu bằng chứng và review

- TV5 tạo bản ghi theo từng lần chạy trong [evidence index](../05-giam-sat/evidence-index.md) hoặc liên kết từ đó. Mỗi bản ghi gồm mã ca, ngày giờ UTC+7, người chạy/review, issue/commit, môi trường và seed, kỳ vọng, thực tế, trạng thái Pass/Fail/Blocked/Not run và link log/ảnh đã che token, proof và dữ liệu cá nhân.
- 05–08/11 dự kiến thu bằng chứng auth, quyền sửa tin, tìm kiếm, CI và lát cắt HTTPS. 10–12/11 thu bằng chứng claim, bàn giao, kiểm duyệt. 13–15/11 thu retest, UAT và Drive. Cập nhật theo ngày chạy thực tế.
- TV3 rà bước chạy và điều kiện đạt. TV5 ghi blocker khi thiếu endpoint, seed, URL hay quyền. Ca Fail có issue lỗi, owner và lịch retest. Gate quyền, bàn giao, HTTPS và Drive cần kết quả thực tế trước nghiệm thu sản phẩm.
- Evidence hiện có là bản kế hoạch này và [risk baseline](../02-lap-ke-hoach/risk-register.md). Chưa có log thực thi hay review TV3. Giữ LF-17 mở để TV3 đối chiếu nguồn scope/stack và duyệt đầu ra.
