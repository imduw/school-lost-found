# GitHub Board — cấu hình để giao việc tới 15/11

**v0.3, 02/11/2026.** Repo quản trị: <https://github.com/imduw/school-lost-found>. Project từ ảnh: <https://github.com/users/imduw/projects/1>. Chưa tạo issue hay sửa setting thay nhóm. Dùng [một trang phân công](BAT-DAU-TU-DAY.md) trước; phần dưới là cách cấu hình.

**Nếu chưa rõ phải tạo task nào:** mở [hướng dẫn ngay trong phiếu nhóm trưởng](phan-cong/TV1-nhom-truong.md). Bắt đầu bằng LF-01/05/10/13/17; mỗi thẻ là một GitHub Issue.

## 1. Năm cột đủ dùng

**Backlog → Todo → In Progress → In Review → Done.** Giữ tên Todo đang có; Todo tương đương Ready, tức đủ thông tin để bắt đầu phần việc giao.

- Backlog: chưa đến lượt hoặc chờ đầu vào.
- Todo: owner hiểu đầu ra, AC, hạn, reviewer và phần có thể bắt đầu.
- In Progress: mỗi người tối đa một việc chính.
- In Review: có file/PR/test để người khác kiểm tra.
- Done: đạt AC/DoD và review, có evidence; không chỉ nhắn “xong”.

## 2. Tạo việc từ bộ LF

Tạo issue thật trong repo từ [21 thẻ LF](docs/03-yeu-cau/board-tasks-2026-11-15.md), thêm vào Project. LF là mã kế hoạch, không phải số issue; sau khi tạo dùng URL thật để tham chiếu. CSV để đọc/lọc, chưa có cơ chế tự import được chạy.

Đưa **LF-01, LF-05, LF-10, LF-13, LF-17** vào Todo trước, các thẻ khác Backlog. LF-10 bắt đầu model trên giấy rồi code sau quyết định stack. Nếu đã tạo S1-xx trước đây, giữ URL/history và cập nhật, không nhân đôi effort hoặc xóa dấu thực thi.

| Field | Cách dùng |
|---|---|
| Assignees | Một người chịu trách nhiệm chính; thay TV bằng username thật |
| Status | Năm trạng thái trên |
| Due date | Hạn trong bảng LF, tất cả không muộn hơn 15/11 |
| Estimate (h) | Giờ công dự kiến; baseline lưu bản gốc khi chốt |
| Sprint | Iteration: S1 02–08/11, S2 09–15/11 |
| WBS | Text, một mã lá chính |
| Reviewer | Text/ghi trong issue; khi có PR mới yêu cầu review qua trường Reviewers |
| Priority | P0 chặn mục tiêu, P1 công việc kế hoạch |

Trong issue body đã có đầu ra, AC, phụ thuộc, evidence. Labels tối thiểu: docs, feature, test, infra, bug, risk, change, blocked. Milestone dùng cho báo cáo/sản phẩm, không cần tạo một milestone cho mỗi người. Iteration là khoảng lặp có ngày/độ dài; xem [tài liệu GitHub](https://docs.github.com/en/issues/planning-and-tracking-with-projects/understanding-fields/about-iteration-fields).

## 3. Milestones đề xuất

| Milestone | Hạn nội bộ | Nội dung |
|---|---|---|
| BC1: Charter ký xác nhận | 05/11 | M1 đủ 13 mục và chữ ký PO/GV |
| BC2: WBS & Dictionary | 04/11 | WBS, scope, estimate và baseline |
| S1: Lát cắt HTTPS | 08/11 | Sản phẩm/test/review tuần đầu |
| M3: Health Check | 09/11 | Số liệu hết 08/11 và ưu tiên tuần cuối |
| BC3: Dynamic Risk Register | 15/11 | Hai cập nhật 08/11 và sáng 15/11, matrix |
| BC4/BC5 & Bàn giao | 15/11 | PDF, slides/rubric, HTTPS cuối và Drive |

Milestone là tài nguyên từng repo; một issue có một milestone. Nếu dùng repo source riêng, đưa issue/PR vào cùng Project, tham chiếu đầy đủ URL và chỉ tính effort một lần. Board có view theo Status và một table theo Assignee để bạn kiểm tra tải việc.

## 4. Quyền truy cập và review

Mời đủ thành viên vào repo và **riêng Project**; mỗi người kiểm tra tự sửa card và mở PR. Quyền Project không tự cấp quyền repo. [GitHub về project access](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-your-project/managing-access-to-your-projects).

Snapshot 01/11 cho thấy repo đã có hooks/template/CODEOWNERS, nhưng còn username mẫu, chưa có workflow/milestone/issue tại thời điểm đó và main chưa protected. Giữ cấu trúc docs, xác minh tên thật và cập nhật CODEOWNERS qua PR; không tự gán chủ repo là một thành viên cụ thể.

Cấu hình main yêu cầu PR và ít nhất một peer approval, giải quyết review conversations, tránh force-push/xóa nhánh. Sau khi CI đã chạy thật mới chọn đúng required checks. Repo public có protected branches trên GitHub Free. [Tài liệu branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).

Giữ hook/quy ước hiện có: nhánh `feature/<mo-ta>` và commit `[GiaiDoan] loai: mo ta`; ví dụ `[Planning] docs: cap nhat WBS theo han nop moi`. Mỗi người chạy `bash setup-hooks.sh` sau clone. Hook máy cá nhân không thay quy tắc phía GitHub. Không tạo commit giả/lùi ngày để bù lịch sử học kỳ.

## 5. Automation vừa đủ

Có thể auto-add issue mới vào Project, mặc định Backlog. Auto-add không tự nhập toàn bộ issue cũ khi bật; thêm thủ công lần đầu. Gói Free giới hạn số workflow auto-add nên nếu có hai repo, kiểm tra gói hoặc thêm repo còn lại thủ công. [GitHub auto-add](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically).

Chỉ bật issue closed → Done khi nhóm phân biệt hoàn thành và hủy/Not planned; ban đầu cập nhật Done thủ công sau kiểm tra cũng đủ. PR chỉ dùng `Closes` nếu hoàn thành toàn bộ AC, nếu còn việc dùng `Refs` và link issue. [Built-in automation](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations).

## 6. Nơi lưu và bằng chứng

GitHub giữ Markdown, source/PR/test và lịch sử; **Drive là nơi nộp đủ 5 báo cáo** theo [checklist](SUBMISSION-CHECKLIST.md), mở Anyone with the link / Viewer. Repo hiện tại là quản trị; đề xuất source riêng sau chọn stack, liên kết README/Project; chưa tạo repo mới. Không thay dữ liệu bằng template hoặc coi upload cuối kỳ là lịch sử.

CI theo stack thật: lint/test/build có ý nghĩa; tài liệu kiểm tra link/nội dung. [Deployment checklist](docs/04-thiet-ke/deployment-checklist.md) nêu mốc HTTPS; local/video không thay gate. Giữ snapshot baseline 04/11, Sprint 1 ngày 08/11 và Sprint 2 sáng 15/11.

GitHub xuất view thành TSV qua View → Export view data; mỗi export là snapshot, cần chuỗi snapshot cùng issue/PR timeline để thể hiện quá trình. [Export view data](https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-your-project/exporting-your-projects-data).

Các mẫu mở rộng ở [task](github-templates/ISSUE_TEMPLATE/task.md), [bug](github-templates/ISSUE_TEMPLATE/bug.md), [risk/change](github-templates/ISSUE_TEMPLATE/risk-change.md) và [PR](github-templates/pull_request_template.md); nhóm chọn đưa vào `.github/` qua PR. Chưa có cấu hình nào được áp dụng bởi việc tạo bộ tài liệu này.
