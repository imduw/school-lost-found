# M1 — Project Charter & Stakeholder Matrix

**Hệ thống quản lý và tìm đồ thất lạc trong trường**  
Phiên bản 0.3.1, lập 01/11, cập nhật tài khoản/Drive ngày 03/11/2026; hạn trước 16/11 giữ nguyên. **Trạng thái: bản nháp đề xuất, chưa ký duyệt.**  
Người điều phối: TV1 / @doanvanchi3n (nhóm trưởng). Mục tiêu bản nội bộ 03/11, chữ ký 05/11; phải nộp đủ hồ sơ/sản phẩm trước 16/11. Scope rút gọn dưới đây là đề xuất cần nhóm và stakeholder xác nhận.

Đây là nguồn cho **Báo cáo 1**. Theo [thông báo mới](../../references/instructor-supplement-2026-11-02.md), bản nộp cần đủ 13 mục và **chữ ký thật của PO/Stakeholder và GV**, cùng phần nhóm trưởng theo template. Bản đã ký phải có trên Google Drive mở Anyone with the link / Viewer; peer approval trên GitHub không thay chữ ký.

Hồ sơ dùng để chốt LF-01: [phạm vi web, phân công, hỗ trợ và phần còn cần xác nhận](LF-01-pham-vi-phan-cong-khoi-dong.md). Năm tài khoản đã có issue được giao; khả năng làm theo hạn và phản hồi của thành viên chưa được cung cấp.

## 1. Thông tin chung

| Mục | Nội dung |
|---|---|
| Tên đề tài | Hệ thống quản lý và tìm đồ thất lạc trong trường |
| Tên ngắn / mã đề xuất | School Lost & Found / SLF |
| Nhóm / lớp / trường | Chưa cung cấp; TV1 bổ sung thông tin thật |
| Số thành viên | 5 |
| Thời gian dự kiến | 02–15/11/2026; hoàn tất trước thứ Hai 16/11, gồm cả 5 báo cáo và bản chạy HTTPS/APK |
| Repo quản trị | <https://github.com/imduw/school-lost-found> |
| Project | <https://github.com/users/imduw/projects/1> — từ ảnh người dùng |
| Drive nhóm | [Thư mục do nhóm trưởng cung cấp](https://drive.google.com/drive/folders/1P5aijR1ziB6zht_VFqdKc1HxFYgIC1w6?usp=sharing); cấu trúc/quyền xem chưa kiểm tra |
| Repo source / demo | Chưa tạo/chưa có URL được xác nhận |
| Giảng viên | Template ghi Dr. Nguyen Thanh Tuan; nhóm xác nhận thông tin lớp trước khi nộp |

## 2. Nguồn đề tài và bối cảnh thực tế

Đề xuất chọn hướng **nhu cầu thực tế trong trường** trong ba hướng của template. Chưa đánh dấu đã xác minh: nhóm cần trao đổi với ít nhất một đại diện phù hợp như bảo vệ, thư viện, phòng công tác sinh viên hoặc người đang phụ trách đồ thất lạc, cùng sinh viên sử dụng dịch vụ. Không mặc định họ đã là nhà tài trợ hay cam kết dùng hệ thống.

TV1 phụ trách liên hệ; TV5 ghi nhận vấn đề, cách xử lý hiện tại, tiêu chí bàn giao và phản hồi. Bằng chứng là biên bản hoặc phản hồi có ngày, vai trò người tham gia và sự đồng ý sử dụng trong báo cáo; thông tin liên lạc riêng không đưa lên repo công khai. Chỉ dùng tên trường chính xác sau khi nhóm xác nhận.

## 3. Mục đích và bài toán

Nhóm muốn xây dựng một nơi tập trung để người mất đồ đăng thông tin cần tìm, người nhặt được thông báo món đồ, và hai bên có thể đối chiếu trước khi bàn giao. Giả thuyết cần kiểm chứng là việc tìm tin rải rác và thiếu cập nhật tình trạng gây khó theo dõi; hiện chưa có khảo sát hoặc số liệu chứng minh mức độ của vấn đề.

Giải pháp đề xuất là web responsive cho một trường, có danh sách tin mất/nhặt được, tìm kiếm, yêu cầu nhận đồ và xác nhận bàn giao. Lợi ích kỳ vọng là dễ tìm thông tin và có dấu vết xử lý rõ ràng. Hệ thống hỗ trợ đối chiếu; phần mềm không thể tự bảo đảm người yêu cầu là chủ sở hữu thật. Chỉ công bố hiệu quả định lượng sau khi có đo lường.

## 4. Mục tiêu SMART đề xuất

| ID | Mục tiêu | Cách kiểm chứng |
|---|---|---|
| O1 | Đến 08/11 có lát cắt demo qua HTTPS: tài khoản thử đăng nhập, đăng một tin hợp lệ và xem lại từ dữ liệu đã lưu | URL công khai, commit, hướng dẫn và kiểm tra ngoài máy tác giả; đây là mục tiêu, chưa đạt |
| O2 | Hết 12/11 khóa chức năng MVP rút gọn R01–R06 trong [backlog](../03-yeu-cau/backlog-va-nghiem-thu.md); R07/UAT/hồ sơ hoàn tất ngày 15/11 | Issue/PR liên kết, test theo tiêu chí từng yêu cầu |
| O3 | Trong 13–14/11 tổ chức thử nghiệm với ít nhất 3 sinh viên và 1 đại diện nghiệp vụ phù hợp, nếu tuyển được | Kịch bản, phản hồi thật, danh sách vấn đề, xác nhận chấp nhận hoặc điều kiện còn thiếu; không tính thành viên nhóm là người dùng ngoài |
| O4 | Đến 15/11 tất cả kịch bản Must-have được chạy và đạt, không còn lỗi nghiêm trọng chặn luồng chính hoặc lộ dữ liệu; mọi PR mới sau khi thiết lập quy trình có peer review và CI phù hợp | Test report có mẫu số, defect list, link PR/Actions; không áp hồi tố lên commit cũ |
| O5 | Trước thứ Hai 16/11, mục tiêu nội bộ 20:00 ngày 15/11, bàn giao bản HTTPS chạy thực tế và đủ BC1–BC5 trên Drive: Charter đã ký, WBS/Dictionary, risk/3-Step Matrix hai đợt, PDF tổng kết 15–25 trang, 8–10 slide và rubric | Link/commit, test ngoài máy tác giả, chữ ký, evidence và kiểm tra Drive ở phiên không đăng nhập |

Nếu không tìm được đại diện nghiệp vụ, TV1 ghi rõ trở ngại và xin thầy xác nhận stakeholder thay thế. Không tự coi việc nhóm tự chấm là nghiệm thu thực tế.

## 5. Phạm vi và ranh giới

### Trong phạm vi MVP đề xuất

- **R01 — Tài khoản và quyền:** tài khoản thử nghiệm được cấp trước; đăng nhập/đăng xuất; vai trò người dùng và người kiểm duyệt. Chưa cam kết tích hợp tài khoản trường.
- **R02 — Tin mất/nhặt được:** tin dạng văn bản gồm loại, tiêu đề, mô tả, khu vực, ngày xảy ra và trạng thái; xem/sửa tin mở của mình. Hoãn upload ảnh trong scope rút gọn để giảm việc lưu trữ và kiểm thử trước hạn.
- **R03 — Tìm kiếm:** từ khóa, loại tin và khu vực; có kết quả rỗng rõ ràng. Hoãn các bộ lọc nâng cao, không có bản đồ.
- **R04 — Yêu cầu nhận đồ:** người dùng gửi mô tả đối chiếu riêng cho tin nhặt được; xem trạng thái yêu cầu của mình. Không hiển thị bằng chứng sở hữu cho toàn bộ người xem.
- **R05 — Xác minh và bàn giao:** moderator được phân quyền đối chiếu thông tin riêng và từ chối hoặc ghi nhận đã bàn giao khi việc bàn giao thực sự xảy ra, rồi đóng tin. Không triển khai bước chấp nhận trung gian/nhiều tầng. Tin báo mất được chủ tin đánh dấu đã tìm thấy. Lưu người thao tác và thời gian; tối đa một lượt bàn giao/tin.
- **R06 — Kiểm duyệt:** người kiểm duyệt ẩn/khôi phục tin không phù hợp, ghi lý do; không cần dashboard thống kê nâng cao.
- **R07 — Chất lượng và bàn giao:** kiểm tra quyền phía server, đầu vào, test, hướng dẫn chạy, dữ liệu demo; **triển khai MVP web qua HTTPS công khai**, hồ sơ BC1–BC5 và bằng chứng quản trị trên Drive mở quyền xem bằng link. APK là phương án thay thế được thầy cho phép, chưa chọn và chưa thêm vào phạm vi web.

Quy tắc nghiệp vụ: chỉ tài khoản đăng nhập được sử dụng bản pilot; người đăng không tự nhận đồ của mình; một món đồ không có hai lượt bàn giao thành công; yêu cầu nhận đồ chỉ áp dụng tin nhặt được còn mở. Ai giữ đồ và ai xác minh cuối cùng cần được đại diện nghiệp vụ xác nhận.

### Ngoài phạm vi bàn giao 15/11

Upload ảnh, bộ lọc nâng cao, phê duyệt nhiều tầng; AI nhận diện hoặc tự ghép ảnh; chat/video thời gian thực; thông báo SMS/email/push; native mobile; thanh toán/phần thưởng; tích hợp SSO/ERP trường; GPS/bản đồ thời gian thực; nhiều trường; quảng bá vận hành toàn trường; dashboard nâng cao. Có thể ghi vào backlog sau MVP, không coi là cam kết.

## 6. Stakeholder Register & Engagement Matrix

Đây là **danh sách vai trò cần xác minh**, chưa phải danh sách người đã đồng ý tham gia.

| ID / đối tượng | Vai trò / kỳ vọng | Quyền lực / quan tâm | Cách phối hợp và thời điểm | Owner / trạng thái |
|---|---|---|---|---|
| ST01 Giảng viên môn học | Xác nhận tiêu chuẩn, ký Charter, chấm checkpoint và demo | Cao / Cao | TV1 đặt lịch ký bản Charter hoàn chỉnh; xác minh hình thức chữ ký và hạn nộp; chuẩn bị đủ 5 báo cáo theo thông báo mới | TV1 / chưa có chữ ký |
| ST02 Đại diện nơi tiếp nhận đồ thất lạc / PO phù hợp | Xác nhận nghiệp vụ, ký Charter và nhận xét đầu ra; chưa mặc định có quyền đại diện cả trường | Cao / Cao nếu được giao thẩm quyền | Trao đổi 02–03/11, mục tiêu ký 05/11, review giữa kỳ 09/11, thử nghiệm/xác nhận đầu ra 13–15/11 | TV1 / chưa xác định người ký |
| ST03 Sinh viên mất đồ | Tìm nhanh, gửi yêu cầu, bảo vệ bằng chứng riêng | Thấp / Cao | Phỏng vấn ngắn tuần đầu; thử prototype và UAT 13–14/11 | TV5 / cần ít nhất 3 người dùng thật |
| ST04 Người nhặt được | Đăng tin, đối chiếu người nhận, đóng tin | Thấp / Cao | Kiểm chứng biểu mẫu và quy trình xác minh cùng ST03 | TV4 + TV5 / chưa phỏng vấn |
| ST05 Năm thành viên | Phạm vi rõ, tải việc hợp lý, review công bằng | Cao / Cao trong nội bộ | Cập nhật issue hằng ngày; họp kickoff, review/retro mỗi tuần | TV1 / đã xác minh 5 GitHub username; họ tên/MSSV và capacity còn chờ |
| ST06 IT/đơn vị quản lý dữ liệu trường nếu có tích hợp | Quyền triển khai, dữ liệu hoặc tên miền của trường | Cao / Thấp, có điều kiện | Chỉ mời khi thực sự cần hạ tầng/dữ liệu trường; MVP demo độc lập chưa giả định có hỗ trợ | TV2 / bên liên quan tiềm năng |

| Power–Interest | Quan tâm cao | Quan tâm thấp |
|---|---|---|
| Quyền lực cao | Phối hợp sát: ST01, ST02 khi xác nhận, ST05 nội bộ | Tham vấn khi cần: ST06 |
| Quyền lực thấp | Cập nhật và lấy phản hồi: ST03, ST04 | Theo dõi: người quan sát chưa tham gia pilot |

Giảng viên đánh giá học phần; người dùng/đại diện nghiệp vụ đánh giá tính phù hợp của sản phẩm. Hai vai trò không tự động thay thế nhau.

## 7. Công cụ quản trị và GitHub

GitHub Issues lưu việc và AC; Projects lưu ưu tiên/trạng thái; PR lưu review; Milestones lưu hạn nội bộ; Actions lưu kiểm tra tự động; Markdown lưu báo cáo. Hướng dẫn chi tiết trong [GitHub setup](../../GITHUB-SETUP.md).

Quy trình đề xuất: `Backlog → Todo → In Progress → In Review → Done` (Todo = Ready). Mỗi issue có một owner, một reviewer, estimate và đầu ra. Mọi thay đổi mới đi qua PR; chỉ Done sau khi đạt AC, được review và đã tích hợp. Giữ quy ước commit đang có: `[Planning] docs: hoan thien pham vi va muc tieu du an`.

## 8. Mốc và lịch

M1 bản nhóm thống nhất 03/11, mục tiêu chữ ký 05/11; M2 baseline 04/11; review/risk update #1 và lát cắt HTTPS 08/11; M3 giữa kỳ 09/11 dùng dữ liệu tới hết 08/11; khóa tính năng 12/11; UAT/slide/BC4 nháp 13–14/11; sáng 15/11 review/risk update #2; chốt và nộp mục tiêu 20:00 ngày 15/11. Hạn trước thứ Hai 16/11 áp dụng cho cả 5 báo cáo và HTTPS/APK theo nhóm trưởng xác nhận. Week 6/11 là chú thích tuần học; ghi ngày cập nhật thật.

## 9. Phương pháp phát triển

Chọn **lặp và tăng dần theo sprint 1 tuần, có các mốc tài liệu**. Nhóm mới bắt đầu và chưa chốt nghiệp vụ/stack, nên cần chạy thử sớm thay vì đợi hoàn tất mọi báo cáo mới làm demo. Mỗi tuần chọn mục tiêu nhỏ, giới hạn một việc chính đang làm/người, demo kết quả và cập nhật risk register.

Daily async trước 21:00 gồm việc xong, link bằng chứng, việc tiếp theo, trở ngại. Một trở ngại trên 24 giờ hoặc nguy cơ trễ phụ thuộc phải báo TV1; nhóm điều chỉnh công khai trong issue và change log.

## 10. Tổ chức 5 thành viên

| Mã | Vai trò đề xuất | Trách nhiệm chính | Tên / MSSV / GitHub |
|---|---|---|---|
| TV1 | Nhóm trưởng / PM / phân tích nghiệp vụ | Phạm vi, stakeholder/chữ ký, phân công, M1/BC1, BC4 và bộ nộp Drive | @doanvanchi3n; họ tên/MSSV chưa cung cấp |
| TV2 | Điều phối kỹ thuật / tích hợp | Chọn stack cùng nhóm, kiến trúc, repo source, CI, tích hợp, chủ trì M2 | @imduw; họ tên/MSSV chưa cung cấp |
| TV3 | Dữ liệu và backend | Mô hình dữ liệu, API, quyền, luồng đăng tin/nhận đồ | @dxhai17; họ tên/MSSV chưa cung cấp |
| TV4 | Giao diện / trải nghiệm | Wireframe, frontend, kết nối API, BC5/slide và demo | @trangniii; họ tên/MSSV chưa cung cấp |
| TV5 | QA / theo dõi bằng chứng | AC/test, kiểm tra demo, metrics/risk, BC3, M3, evidence và tự đánh giá rubric | @phamvietnamson; họ tên/MSSV chưa cung cấp |

Vai trò là điểm chịu trách nhiệm, không phải khu vực chỉ một người được tham gia. TV1 viết phần quản trị nhưng mỗi người chịu trách nhiệm bằng chứng phần mình; TV5 không làm thay mọi việc kiểm thử của tác giả. Nếu chưa có ai đủ backend/frontend, ghép cặp và giảm phạm vi sau cuộc họp đầu.

## 11. Ràng buộc, giả định và rủi ro

Ràng buộc đã biết: 5 người, hạn trước 16/11 cho đủ báo cáo và sản phẩm, chưa có sản phẩm; bản chạy HTTPS/APK, Drive mở Viewer, chữ ký PO/GV và 5 báo cáo theo quy cách là bắt buộc. Nhóm trưởng cho biết chưa rõ giờ rảnh và muốn hỗ trợ nhau; xem cơ chế ghép việc trong LF-01. Giả định cần xác nhận: khoảng 15 giờ/người/tuần trong hai tuần; thiết bị/môi trường triển khai; ngân sách chưa thông báo nên ưu tiên không phát sinh chi phí; tuyển được stakeholder; stack quen hỗ trợ MVP. Chưa cam kết nhà cung cấp/gói miễn phí. Bản 0.3 đề xuất scope rút gọn và 119 giờ việc trên 150 giờ năng lực hai tuần giả định; cần rà estimate/kỹ năng sau spike, không coi chắc chắn kịp hạn. Bản rộng 212 giờ trước đó không được ép nguyên vào hai tuần.

Ba rủi ro ưu tiên: RSK01 chưa có stakeholder xác nhận; RSK02 công nghệ/kỹ năng chưa rõ; RSK03 quá tải hoặc mở rộng phạm vi khi chỉ có hai tuần. Biện pháp: liên hệ sớm, làm thử kỹ thuật nhỏ, giới hạn scope và giữ dự phòng. Xem [risk register có owner, trigger, hạn xử lý](../02-lap-ke-hoach/risk-register.md).

## 12. Tiêu chí thành công và Definition of Done

Thành công: chạy được R01–R07 trên HTTPS công khai; người dùng thật thử và phản hồi; không còn lỗi nghiêm trọng; đủ 5 báo cáo/chữ ký và Drive truy cập được; hồ sơ phản ánh đúng quá trình. Lịch sử commit phải được đối chiếu yêu cầu trải đều học kỳ; hiện chưa đủ căn cứ để chứng nhận gate Pass và không được tạo lịch sử giả.

Một việc Done khi: đạt AC; có file hoặc chức năng kiểm tra được; tác giả tự kiểm tra; có PR và peer review; kiểm tra tự động phù hợp đã qua khi áp dụng; hợp nhất vào nhánh chính; bằng chứng được liên kết; issue đóng đúng lý do. Tài liệu phải hết chỗ “chưa xác nhận” thuộc phạm vi nghiệm thu của issue, hoặc ghi rõ trở ngại và không đóng việc đó. PR chỉ tạo bản nháp không đồng nghĩa milestone đã được phê duyệt.

## 13. Phê duyệt

| Vai trò | Họ tên thực tế | Chữ ký / bản đã ký | Ngày / phiên bản xác nhận |
|---|---|---|---|
| Nhóm trưởng theo template | Chưa bổ sung | Chưa ký | — |
| PO/Stakeholder — bắt buộc | Chưa xác định | Chưa ký, chưa có xác nhận nhu cầu/phạm vi | — |
| Giảng viên — bắt buộc | Cần xác nhận thông tin lớp | Chưa gửi/chưa ký | — |

Trước khi nộp: điền dữ liệu thật; xác nhận phạm vi/stack/capacity; gửi đúng phiên bản để PO/Stakeholder và GV ký, giữ phần nhóm trưởng theo template; lưu bản đã ký lên Drive và kiểm tra quyền xem. Xác minh hình thức chữ ký thầy chấp nhận; tên đánh máy hoặc PR approval không tự đủ thay chữ ký. Không đổi nhãn Approved hoặc tích BC1 chỉ vì đã soạn xong bản nháp.
