# Evidence Index — mục lục bằng chứng

v0.3, cập nhật 02/11/2026 theo hạn trước 16/11. Owner: TV5; mỗi thành viên nộp bằng chứng phần việc của mình qua issue/PR. **Danh sách cần thu thập không đồng nghĩa đã có bằng chứng.**

## 1. Bằng chứng nền hiện có

| ID | Nội dung | Nguồn / thời điểm | Giới hạn |
|---|---|---|---|
| EV-BASE-01 | Repo, cấu trúc, commit, issue/milestone/workflow/branch công khai | [Bản quan sát 01/11](../../references/repository-observation-2026-11-01.json), [repo ở commit đối chiếu](https://github.com/imduw/school-lost-found/tree/18c4718b6ab3125702e3d74f0b37257a4f099a24) | Không phải audit quyền riêng tư hoặc live board |
| EV-BASE-02 | Screenshot board có ba cột, mỗi cột hiển thị 0 item | Ảnh người dùng gửi ngày 01/11, tên `Screenshot from 2026-11-01 21-39-12.png` | Ảnh gốc ở máy người dùng, chưa chép vào gói này; chỉ phản ánh view trong ảnh |
| EV-BASE-03 | Xác nhận ban đầu chưa chọn stack/chưa làm sản phẩm; lúc đó chưa có hạn M1–M3 | Trao đổi của nhóm trưởng ngày 01/11 | Chưa thay biên bản kickoff; thông tin chưa có hạn đã được thay bằng EV-BASE-06 |
| EV-BASE-04 | Sáu template/rubric thầy gửi | [Danh mục nguồn](../../README.md), bản gốc trong `references/instructor/` | Chưa có slide/syllabus nằm ngoài sáu file; link tương đối tới slide gốc có thể không mở trong gói này |
| EV-BASE-05 | Bổ sung danh mục 5 báo cáo và gate; Week 6/11 là tuần học | [Trích dẫn 02/11](../../references/instructor-supplement-2026-11-02.md) | Chưa cung cấp định nghĩa chính thức của 3-Step Matrix |
| EV-BASE-06 | Hạn trước 16/11 áp dụng cho cả 5 báo cáo và sản phẩm HTTPS/APK | [Xác nhận của nhóm trưởng](../../references/deadline-update-2026-11-02.md) | 20:00 ngày 15/11 là mục tiêu nội bộ, chưa phải giờ thầy công bố |

**Cập nhật 03/11:** [snapshot 5 issue/assignee](../../references/issue-observation-2026-11-03.json) và [dữ kiện nhóm trưởng cung cấp](../../references/lf01-facts-2026-11-03.md) là bằng chứng mới. Chúng chưa thay biên bản/approval/kiểm tra Drive.

## 2. Bằng chứng cần thu trong quá trình

| ID | Đầu ra | Owner | Mốc nội bộ | Trạng thái / nơi cần liên kết |
|---|---|---|---|---|
| EV01 | Danh tính/vai trò/capacity, biên bản kickoff | TV1 | 02–03/11 | Đã có 5 username/issue gán và link Drive; [LF-01](../01-khoi-tao/LF-01-pham-vi-phan-cong-khoi-dong.md) đã soạn; capacity, biên bản, xác nhận và thử quyền còn chờ |
| EV02 | Phỏng vấn và xác nhận nhu cầu từ người thật | TV1 + TV5 | 02–04/11 | Chưa có; biên bản đã lược dữ liệu riêng |
| EV03 | M1 đủ 13 mục, stakeholder và chữ ký thật | TV1 | Mục tiêu đủ chữ ký 05/11 | Hiện có bản nháp; cần PR, reviewer, bản PO/GV/nhóm trưởng đã ký đúng phiên bản |
| EV04 | WBS/backlog/estimate baseline và snapshot Project | TV2 + TV1 | 04/11 | Chưa khóa; lưu TSV/ảnh, PR và danh sách issue |
| EV05 | Quyết định stack, spike và người thứ hai chạy lại | TV2 | 03/11 | Chưa có; ADR, log/lệnh/commit |
| EV06 | Issue–PR–CI–test cho lát cắt đầu tiên | TV3 + TV4 | 08/11 | Chưa có; source repo và test results |
| EV07 | Sprint 1 review/retro và Risk Update #1 | TV5 | 08/11 | Chưa có; meeting note, snapshot risk/PR |
| EV08 | Số liệu hết Sprint 1, cutoff M3 và quyết định tuần cuối | TV5 + TV4 | 09/11, cutoff hết 08/11 | Chưa có; metrics/TSV, PR, test và M3 |
| EV09 | Risk Update #2, diễn biến so với lần trước và BC3/matrix | TV5 | Sáng 15/11; chốt trước 12:00 | Chưa có; risk log và phiên bản trước/sau |
| EV10 | Scope change thực tế được xử lý | TV1 | Khi thực sự phát sinh | Đã ghi tiếp nhận thông báo/hạn mới trong change log; chưa có bằng chứng nhóm phê duyệt thay đổi baseline sau khi khóa |
| EV11 | AI trong quản trị, kiểm chứng đầu ra | Người sử dụng + TV5 | Trong quá trình | Cuộc trao đổi này là nguồn thực tế có thể lưu; chưa có log được nhóm xác nhận |
| EV12 | Test/UAT và phản hồi từ người dùng thật | TV5 | 13–14/11 | Chưa có; test report, bug, phản hồi |
| EV13 | Acceptance và final retrospective | TV1 | 14–15/11 | Chưa có; phản hồi/điều kiện nghiệm thu, biên bản |
| EV14 | Release, bản nộp, runbook, video/demo và evidence package | TV2 + TV1 | Bản UAT 13/11; bộ nộp 15/11 | Chưa có; link/commit và quyền truy cập |

## 3. Quy tắc lưu

- Tên file có ngày thật; commit/PR giữ lịch sử sửa. Không giả ngày, viết giả phản hồi hoặc gom xong rồi mô tả như đã cập nhật hằng tuần.
- Ghi nguồn đủ để kiểm chứng: URL issue/PR/run, commit, môi trường và người thực hiện. Ảnh có ngữ cảnh, không chỉ một dấu xanh cắt rời.
- Snapshot board là thời điểm; giữ bản baseline và bản đóng sprint, cộng issue/PR timeline. Export TSV không tự chứa toàn bộ lịch sử trạng thái.
- Risk update phải thể hiện sự thay đổi/quan sát thật; một bảng generic lưu hai tên file chưa chứng minh đã quản trị.
- Một video demo ghi lại đúng bản chạy là evidence của bản đó; không chứng minh mọi yêu cầu đã nghiệm thu.
- Thông tin cá nhân/secret/proof riêng cần lược bỏ trước khi đưa lên repo public; giữ bản nội bộ đúng người được quyền nếu cần.

## 4. Nhật ký AI — mẫu chưa điền

Rubric có thành phần AI trong quản trị với bằng chứng cụ thể. Có thể ghi chính lần nhờ AI đọc template, đề xuất WBS và phân công này; ghi trung thực phần nhóm đã kiểm tra, sửa hoặc chưa chấp nhận.

| Ngày | Người dùng / công cụ | Bài toán quản trị và đầu vào | Đầu ra/link prompt | Cách nhóm kiểm chứng | Đã sửa/từ chối gì | PR/tài liệu áp dụng |
|---|---|---|---|---|---|---|

Không ghi “AI giúp nhóm tăng năng suất X%” nếu chưa đo. Không ghi đã có review của thành viên chỉ vì AI tự kiểm tra file. Người dùng quyết định lưu đoạn trao đổi nào; không cần công khai toàn bộ cuộc trò chuyện hoặc dữ liệu cá nhân.

## 5. Kiểm tra theo checklist của thầy trước bàn giao

- [ ] Final report tổng hợp thực tế, không chỉ sao chép kế hoạch.
- [ ] Repo có quá trình commit/PR thực.
- [ ] Board có baseline và lịch sử Sprint 1, Sprint 2.
- [ ] Risk register có ít nhất hai lần review thực tế và diễn biến rõ.
- [ ] Sprint 1 retro và final retro có nội dung cụ thể.
- [ ] Scope change thực tế có ghi nhận; nếu chưa có, khai báo và hỏi thầy cách xử lý yêu cầu.
- [ ] AI evidence có đầu vào/đầu ra/kiểm chứng của nhóm.
- [ ] Có acceptance từ stakeholder thật, hoặc ghi rõ phần chưa được chấp nhận.
- [ ] Link, file và quyền truy cập đã được người khác thử mở.
