# LF-01 — Phạm vi web, phân công và hồ sơ khởi động

**Soạn ngày 03/11/2026. Owner: @doanvanchi3n; reviewer: @phamvietnamson.**
**Issue:** [#1 — LF-01](https://github.com/imduw/school-lost-found/issues/1).
**Trạng thái:** đã chuẩn bị nội dung để nhóm xác nhận; LF-01 chưa đủ bằng chứng để đóng. Đây không phải biên bản một cuộc họp đã diễn ra.

## 1. Nhóm sẽ làm sản phẩm gì?

Đề xuất thực hiện **ứng dụng web responsive quản lý và tìm đồ thất lạc cho phạm vi thử nghiệm một trường**. Người dùng mở đường link HTTPS bằng trình duyệt trên máy tính hoặc điện thoại. Bản bàn giao phải có giao diện, xử lý nghiệp vụ và dữ liệu lưu thật.

Thông báo thầy cho phép **HTTPS hoặc APK**. Nhóm chọn hướng web trong kế hoạch để tập trung một sản phẩm trước hạn; không cần làm thêm app Android/iOS chỉ để có cả “web và app”. Giao diện dùng trên điện thoại không đồng nghĩa đã có APK. Công nghệ cụ thể do @imduw phối hợp @dxhai17 chốt ở [LF-05/#2](https://github.com/imduw/school-lost-found/issues/2) theo thứ nhóm đã biết.

**Mục đích:** tập trung tin mất/nhặt được, giúp tìm tin và gửi yêu cầu nhận đồ, lưu trạng thái xử lý và bàn giao. Việc tin đang phân tán hoặc người dùng gặp khó khăn là giả thuyết cần hỏi người dùng thật; chưa có số liệu khảo sát để khẳng định mức độ hiệu quả.

**Bàn giao:** MVP chạy HTTPS + 5 báo cáo trên Drive, trước thứ Hai **16/11/2026**. Mốc nội bộ đề xuất: **20:00 Chủ nhật 15/11**. Không bổ sung cam kết vận hành cho toàn trường trong đợt này.

## 2. Phạm vi MVP để nhóm xác nhận

| Mã | Chức năng | Kết quả cần có |
|---|---|---|
| R01 | Tài khoản thử; đăng nhập/đăng xuất | User và moderator/admin có quyền khác nhau, kiểm tra quyền phía server |
| R02 | Đăng/xem/sửa tin mất hoặc nhặt được | Tin văn bản có tiêu đề, mô tả, khu vực, ngày và trạng thái; chỉ sửa tin mở của mình |
| R03 | Tìm tin | Tìm theo từ khóa, loại tin và khu vực; có trạng thái không tìm thấy |
| R04 | Yêu cầu nhận đồ | Người dùng gửi thông tin đối chiếu riêng; chỉ người gửi và moderator được xem nội dung đó |
| R05 | Xác nhận bàn giao | Moderator đối chiếu và ghi nhận sau khi đã trao đồ; một tin không thể có hai lần bàn giao thành công; chủ tin báo mất có thể đánh dấu đã tìm thấy |
| R06 | Quản lý nội dung | Moderator ẩn/khôi phục tin, có lý do; giữ đúng trạng thái bàn giao |
| R07 | Chất lượng và bàn giao | HTTPS thật, lưu dữ liệu, test quyền, CI phù hợp, hướng dẫn chạy, 5 báo cáo và evidence |

Luồng demo: **đăng nhập → đăng tin nhặt được → tài khoản khác tìm tin → gửi mô tả nhận đồ → moderator đối chiếu → xác nhận đã bàn giao → kiểm tra tin đã đóng**. Dữ liệu demo phải có nhãn thử nghiệm, không mô tả là đã trả một món đồ thật nếu chỉ đang diễn tập.

Các màn hình tối thiểu: đăng nhập; danh sách/tìm tin; chi tiết tin; tạo/sửa tin; yêu cầu của tôi; màn hình moderator quản lý yêu cầu/tin. Có thể dùng chung trang và form, không cần sáu hệ thống riêng.

**Để sau đợt nộp:** upload ảnh, AI ghép đồ, chat, bản đồ, thông báo email/SMS/push, SSO trường, app native, dashboard nâng cao. Quy tắc chi tiết và test tại [backlog/AC](../03-yeu-cau/backlog-va-nghiem-thu.md); đây vẫn là phạm vi đề xuất cần nhóm và người xác nhận nghiệp vụ thống nhất.

## 3. Phân công theo các issue đã tạo

| Người | Trách nhiệm chính | Việc đầu tiên | Người hỗ trợ / review |
|---|---|---|---|
| **TV1 — @doanvanchi3n** | Phạm vi, điều phối, liên hệ/xác nhận, BC1, BC4 và bộ nộp Drive | [LF-01/#1](https://github.com/imduw/school-lost-found/issues/1) | TV5 kiểm tra LF-01; cả nhóm cung cấp phần việc thật cho BC4 |
| **TV2 — @imduw** | Công nghệ, WBS/BC2, CI, HTTPS, tích hợp và kiểm duyệt tối thiểu | [LF-05/#2](https://github.com/imduw/school-lost-found/issues/2) | TV3 hỗ trợ/review kỹ thuật |
| **TV3 — @dxhai17** | Dữ liệu, auth, API tin/tìm kiếm và nhận/bàn giao đồ | [LF-10/#3](https://github.com/imduw/school-lost-found/issues/3) | TV2 hỗ trợ/review; gửi API cho TV4 |
| **TV4 — @trangniii** | Wireframe, giao diện, nối API và BC5/slide | [LF-13/#4](https://github.com/imduw/school-lost-found/issues/4) | TV1 review wireframe; TV3 hỗ trợ API, TV5 kiểm tra luồng |
| **TV5 — @phamvietnamson** | AC/test, BC3/risk, M3, evidence và tự đánh giá rubric | [LF-17/#5](https://github.com/imduw/school-lost-found/issues/5) | TV3 review test ban đầu; TV1 hỗ trợ hồ sơ, tác giả sửa lỗi |

Danh tính/Assignee đã được xác minh từ [API công khai](../../references/issue-observation-2026-11-03.json) và nhóm trưởng. **Giao task chưa chứng minh thành viên đã đồng ý giờ làm hoặc đủ kỹ năng.** Họ tên, MSSV và lớp vẫn chờ bổ sung; không suy từ username/email.

## 4. Cách hỗ trợ nhau khi chưa rõ thời gian rảnh

Mỗi task có một người chịu trách nhiệm đầu ra; người khác có thể ghép cặp và cùng làm PR. Mỗi tối, từng người cập nhật ngắn: đã làm gì + link; việc tiếp; có giữ được hạn không; cần ai hỗ trợ.

- TV2 và TV3 ghép xử lý dữ liệu/API/deploy khi có vướng mắc; TV4 dựng giao diện theo hợp đồng dữ liệu đã chốt, nối API sớm.
- TV5 kiểm tra từ lúc có bản đầu; người viết chức năng sửa lỗi, TV5 kiểm tra lại. TV1 gom tài liệu và gỡ phụ thuộc để người làm kỹ thuật tập trung.
- Nếu bị chặn quá một buổi hoặc dự kiến trễ, báo trong issue và cho TV1 ngay. TV1 thống nhất chuyển một phần việc cụ thể cho người khác, ghi người làm/reviewer/hạn mới; không để “cả nhóm cùng chịu trách nhiệm” mà thiếu owner.
- Có người nghỉ/không đủ thời gian thì ưu tiên luồng demo, quyền dữ liệu, HTTPS và hồ sơ bắt buộc. Thay đổi scope cần cập nhật M1/backlog và ghi quyết định; mọi người giúp nhau không tự làm tăng tổng năng lực đã được xác nhận.

**Ước lượng hiện có:** TV1 22h; TV2 25h; TV3 24h; TV4 24h; TV5 24h; tổng **119h công việc**, chưa tính phần họp/review/phát sinh. Giả định cũ 30h/người, tổng 150h, chưa được ai cam kết. Từ 03–15/11 có 13 ngày tính cả hai đầu; không tự trừ giờ vì đã trôi qua ngày 02/11 khi chưa biết việc thực sự đã làm.

Nhóm xác nhận số giờ còn có thể dành **hoặc ít nhất các buổi có thể làm, hạn có thể nhận và phần cần hỗ trợ** trong [phiếu kickoff](../../meeting-notes/LF-01-kickoff-cho-xac-nhan.md). Chưa có dữ liệu này thì giữ đánh giá khả thi là “cần kiểm tra”, không cam kết chắc chắn kịp hạn.

## 5. Lịch hành động ngắn

| Mốc nội bộ | Kết quả cần có |
|---|---|
| 03/11 | Họp/nhận vai trò; phạm vi được bàn; Drive được kiểm tra; LF-05 chốt hướng kỹ thuật; bắt đầu liên hệ người xác nhận |
| 04–05/11 | BC2 baseline, wireframe/test plan; auth/model; mục tiêu BC1 có chữ ký |
| 07–08/11 | API/UI đăng và tìm tin chạy HTTPS; review/retro và risk update #1 |
| 09/11 | M3 giữa kỳ dùng kết quả hết 08/11; rà phần còn lại |
| 10–12/11 | Nhận đồ/bàn giao/kiểm duyệt; khóa thêm tính năng hết 12/11 |
| 13–14/11 | UAT, sửa lỗi; BC4 nháp; slide/diễn tập |
| 15/11 | Sáng review S2/risk #2; 16:00 PDF, 18:00 audit; mục tiêu nộp 20:00 |

Đây là kế hoạch, không phải lịch sử đã thực thi. Nếu LF-01 chưa đủ điều kiện cuối ngày 03/11, ghi việc còn thiếu và hạn xử lý thực tế, không đóng để làm đẹp board. Chuẩn bị code/wireframe/test vẫn có thể tiếp tục theo bản scope đang đề xuất trong lúc xử lý xác nhận.

## 6. Admin có thay người xác nhận nghiệp vụ được không?

**Admin/moderator** là vai trò dùng phần mềm: quản lý tin, xem thông tin đối chiếu và ghi nhận bàn giao. **PO/stakeholder** là vai trò trong dự án: xác nhận nhu cầu, quy tắc xử lý, phạm vi và chấp nhận kết quả. Một người có thể đảm nhận cả hai khi có vai trò thực và được chấp nhận, nhưng tạo tài khoản admin cho thành viên nhóm không tự chứng minh đã có người nghiệm thu phù hợp.

[Thông báo thầy](../../references/instructor-supplement-2026-11-02.md) nêu BC1 có chữ ký PO/Stakeholder và GV; [rubric](../../references/instructor/Milestone-Rubric.md) yêu cầu nghiệm thu từ stakeholder thật. Vì nhóm muốn đáp ứng các yêu cầu đó, hồ sơ hiện **giữ mục xác nhận**, chưa đánh dấu được miễn.

Trong demo, bạn hoặc một thành viên có thể sử dụng tài khoản moderator/admin để trình bày chức năng. Quyền phần mềm này vẫn tách khỏi việc ký Charter hoặc xác nhận đã nghiệm thu sản phẩm.

Phương án gọn để nhóm trao đổi với thầy: nhờ một người dùng thực/đại diện CLB, lớp hoặc đơn vị có nhu cầu đồ thất lạc trao đổi ngắn, góp ý quy tắc và thử bản demo; hỏi thầy người đó có phù hợp làm PO/người ký không. Không tự gán một sinh viên bất kỳ là người có quyền đại diện cả trường. Template cũng cho phép nguồn đề tài từ học phần kỹ thuật khác nếu đúng trường hợp; đổi nguồn đề tài không tự miễn yêu cầu chữ ký trong thông báo mới.

Nếu muốn thành viên nhóm kiêm PO, gửi câu hỏi cụ thể cho thầy; chỉ ghi cách đó được chấp nhận khi có phản hồi. Chưa có phản hồi thì vẫn để “PO/người ký chưa xác nhận”, không ký thay. Việc thu chữ ký Charter thuộc **LF-02**, còn LF-01 chuẩn bị nguồn nhu cầu, người liên hệ và lịch xác nhận.

**Mẫu bạn tự gửi thầy — chưa gửi:**

> Thưa thầy, nhóm em có 5 thành viên, làm web quản lý và tìm đồ thất lạc, bàn giao trước 16/11. Nhóm dự kiến thử nghiệm phạm vi nhỏ, chưa triển khai vận hành toàn trường. Với yêu cầu chữ ký PO/Stakeholder, thầy cho nhóm xác nhận người dùng/đại diện nào phù hợp để góp ý nghiệp vụ, ký Charter và nghiệm thu? Nếu một thành viên nhóm kiêm PO thì có được chấp nhận không, và cần thêm bằng chứng người dùng thực nào? Nhóm hiện chưa có xác nhận và sẽ ghi đúng trạng thái trong hồ sơ.

**Mẫu liên hệ người dùng/đại diện — chưa gửi:**

> Nhóm em đang làm web hỗ trợ đăng/tìm tin và nhận lại đồ thất lạc trong trường. Anh/chị/bạn có thể dành khoảng 15–20 phút để góp ý cách tiếp nhận, xác minh và bàn giao đồ không? Nhóm dự kiến mời thử demo ngày 13–14/11. Việc làm người xác nhận phạm vi/ký Charter sẽ chỉ ghi nhận khi anh/chị/bạn đồng ý và phù hợp yêu cầu học phần.

Câu hỏi nghiệp vụ cần ghi: hiện ai tiếp nhận/giữ đồ; ai đối chiếu người nhận; những thông tin nào cần giữ riêng; khi nào đánh dấu đã bàn giao; trường hợp nào cần từ chối/ẩn tin. Dùng câu trả lời thật để chỉnh R04–R06.

## 7. Drive đã có; phần cần kiểm tra

**[Mở Drive nhóm](https://drive.google.com/drive/folders/1P5aijR1ziB6zht_VFqdKc1HxFYgIC1w6?usp=sharing)** — nhóm trưởng cung cấp ngày 03/11. Đã có URL; chưa xác minh danh sách bên trong hoặc quyền xem qua công cụ hiện tại. Lỗi đọc bằng công cụ không đồng nghĩa Drive bị khóa.

Dùng năm thư mục dưới đây; nếu đã tạo thư mục cùng chức năng thì giữ và ánh xạ tên, không tạo trùng:

```text
School-Lost-Found/
├── 00-INDEX (Google Doc hoặc PDF)
├── 01-Project-Charter/
├── 02-WBS-Dictionary/
├── 03-Dynamic-Risk-Register/
├── 04-Final-Report-Evidence/
│   └── evidence/
└── 05-Defense-Rubric/
```

Nội dung để copy vào `00-INDEX` ở [LF-01-drive-index.md](LF-01-drive-index.md). Các thư mục là nơi chứa đầu ra tương lai, không chứng minh 5 báo cáo đã hoàn tất.

TV1 mở **Chia sẻ → Quyền truy cập chung → Bất kỳ ai có đường liên kết → Người xem**. Thành viên cần chỉnh sửa được mời riêng. TV5 dùng cửa sổ riêng tư không đăng nhập để mở thư mục và các file đã có, ghi ngày/người/kết quả vào phiếu kickoff. [Hướng dẫn Google Drive](https://support.google.com/drive/answer/7166529?hl=vi).

## 8. Những gì còn thiếu để đóng LF-01

| Tiêu chí của issue #1 | Bằng chứng hiện có | Còn cần |
|---|---|---|
| Họp, phân vai và thời gian làm | Đã có 5 issue gán đúng tài khoản | Biên bản hoặc phản hồi thực; xác nhận vai trò/khả năng nhận hạn, ghi rõ giờ chưa biết |
| Nhóm đọc và chốt phạm vi | Có bản đề xuất web ở tài liệu này/M1 | Người xác nhận, ngày, phần đồng ý hoặc cần sửa; chưa coi đã duyệt |
| Liên hệ PO/GV và hẹn xác nhận | Có mẫu liên hệ/câu hỏi | Ghi người thực, ngày liên hệ, phản hồi/lịch hẹn; phần chưa được trả lời giữ mở |
| Drive năm thư mục và Viewer | Nhóm trưởng đã tạo và cung cấp URL | Xác minh cấu trúc và cài đặt chia sẻ |
| TV5 thử mở Drive | Chưa có kết quả thử | @phamvietnamson ghi kiểm tra thật |
| Hạn trước 16/11 và vấn đề lịch sử | Hạn đã được nhóm trưởng xác nhận | Ghi nhận trao đổi thực tế với thầy về khoảng trống lịch sử nếu cần |

Các tài liệu mới được soạn trong workspace; chưa được push, gửi tin hoặc đưa lên Drive bởi việc soạn này. TV5 review bản thực tế trước khi đổi Done/đóng issue. Không cần đợi sản phẩm và cả 5 báo cáo xong mới đóng LF-01, nhưng các bằng chứng riêng của LF-01 phải có.

## 9. Nội dung cập nhật vào issue #1

Sau khi bạn đưa các file lên repo/Drive, thay dòng link tài liệu bằng URL thật rồi dùng comment sau. Chưa đưa file lên thì giữ mô tả “đã soạn tại workspace”, không dán đường dẫn máy cá nhân làm link chia sẻ.

```markdown
Cập nhật LF-01 ngày 03/11/2026:
- Đã có 5 issue khởi động gán cho doanvanchi3n, imduw, dxhai17, trangniii, phamvietnamson.
- Đã soạn đề xuất web responsive chạy HTTPS, scope MVP, bảng phân công và cơ chế hỗ trợ nhau; chờ nhóm xác nhận phạm vi và khả năng nhận hạn.
- Nhóm trưởng đã tạo Drive: https://drive.google.com/drive/folders/1P5aijR1ziB6zht_VFqdKc1HxFYgIC1w6?usp=sharing
- Hồ sơ LF-01 đã soạn tại workspace; link chia sẻ tài liệu sẽ bổ sung sau khi đưa lên repo/Drive.
- Chưa ghi hoàn tất: biên bản/đồng ý của thành viên, xác nhận PO/GV và lịch hẹn, kiểm tra cấu trúc/quyền Drive của TV5.
- Tiếp tục thực hiện LF-01; chưa đóng issue.
```
