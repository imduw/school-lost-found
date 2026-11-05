# Todo GitHub — kế hoạch bàn giao trước 16/11/2026

Phiên bản 0.3, ngày 02/11. **21 thẻ trong kế hoạch; ngày 03/11 đã xác minh 5 issue khởi động do nhóm trưởng tạo.** LF-xx là mã kế hoạch, không phải số issue. Dùng danh sách này thay bản S1-xx cũ. Người dùng đã xác nhận hạn áp dụng cho cả 5 báo cáo và sản phẩm HTTPS/APK. Kế hoạch chọn hướng web HTTPS.

Hạn người dùng: trước thứ Hai 16/11. Mục tiêu nội bộ: chốt/nộp **20:00 Chủ nhật 15/11 (UTC+7)**. Sprint 1: 02–08/11; Sprint 2: 09–15/11, chốt dữ liệu thực thi sáng 15/11 để còn thời gian hoàn thiện hồ sơ.

**Giả định năng lực:** 119 giờ công việc chia 22/25/24/24/24 giờ; cần khoảng 15 giờ/người/tuần trong 2 tuần để còn tổng 31 giờ cho họp, review và phát sinh. Chưa biết năng lực thực tế nên đây là estimate để kiểm tra trong kickoff. Nếu nhóm chỉ có 12 giờ/người/tuần, gần như không còn dự phòng; không thể coi kế hoạch là chắc chắn khả thi.

## Cập nhật người và issue ngày 03/11

Tài khoản đã được gán trong GitHub; chưa suy ra thành viên đã nhận hạn hoặc làm xong. Trạng thái ở bảng kế hoạch bên dưới vẫn là **đề xuất khởi tạo**, không phải trạng thái live được đồng bộ.

| Vai trò | GitHub | Issue khởi động đã có |
|---|---|---|
| TV1 | @doanvanchi3n | [LF-01/#1](https://github.com/imduw/school-lost-found/issues/1) |
| TV2 | @imduw | [LF-05/#2](https://github.com/imduw/school-lost-found/issues/2) |
| TV3 | @dxhai17 | [LF-10/#3](https://github.com/imduw/school-lost-found/issues/3) |
| TV4 | @trangniii | [LF-13/#4](https://github.com/imduw/school-lost-found/issues/4) |
| TV5 | @phamvietnamson | [LF-17/#5](https://github.com/imduw/school-lost-found/issues/5) |

Không tạo lại năm issue này. CSV đã điền URL thật cho chúng; 16 thẻ còn lại chưa có URL được xác minh. [Hồ sơ LF-01](../01-khoi-tao/LF-01-pham-vi-phan-cong-khoi-dong.md) là đầu ra đang chuẩn bị cho issue #1.

## Cách tạo board dễ dùng

1. Giữ `Todo`, thêm `Backlog` và `In Review`: Backlog → Todo → In Progress → In Review → Done. Todo có nghĩa đã đủ đầu vào để bắt đầu phần việc được giao.
2. Tạo issue thật bằng tiêu đề và nội dung dưới đây; thay TV1–TV5 bằng tài khoản thật, đặt một Assignee chính, một Reviewer, Due date, Estimate và Sprint. CSV đi kèm để tham khảo/lọc, không tự import vào GitHub.
3. Chỉ đưa LF-01, LF-05, LF-10, LF-13, LF-17 vào Todo trước. LF-10 bắt đầu bằng thiết kế model độc lập; phần code chờ stack LF-05. Những dependency liệt kê là đầu vào cần để hoàn tất/tích hợp, không cấm dựng bản nháp/mock được ghi rõ.
4. Các thẻ còn lại để Backlog. Mỗi người kéo tối đa một việc chính sang In Progress. Có file/code để người khác kiểm tra mới chuyển In Review; đủ AC và review mới Done.
5. Mỗi thẻ có một WBS chính, effort chỉ tính một lần. PR source ở repo khác dùng URL đầy đủ. Thay mã LF phụ thuộc bằng link issue khi đã tạo.
6. Công việc nhiều đầu ra 6–8 giờ có checklist nhỏ; nếu cần tách thành sub-issue thì phân bổ lại estimate, không cộng cả cha lẫn con. Không tạo một thẻ chung “làm backend”.

## Danh sách thẻ

| Mã | Tiêu đề | Owner | Reviewer | Giờ | Hạn | WBS | Trạng thái khởi tạo đề xuất |
|---|---|---|---|---:|---|---|---|
| LF-01 | Chốt phạm vi, phân vai, stakeholder và tạo Drive | TV1 | TV5 | 4 | 03/11 | 1.1 | Todo |
| LF-02 | Hoàn thiện BC1/M1 và thu chữ ký thật | TV1 | TV2 | 6 | 05/11 | 1.1 | Backlog |
| LF-03 | Tổng hợp BC4: PDF 15–25 trang và checklist bằng chứng | TV1 | TV5 | 8 | 15/11 | 5.1 | Backlog |
| LF-04 | Kiểm tra bộ nộp Drive, demo và bàn giao trước hạn | TV1 | TV5 | 4 | 15/11 | 5.3 | Backlog |
| LF-05 | Chốt stack, cấu trúc source và quy trình GitHub | TV2 | TV3 | 5 | 03/11 | 1.2 | Todo |
| LF-06 | Hoàn thiện BC2: WBS, Dictionary và baseline 2 tuần | TV2 | TV1 | 3 | 04/11 | 1.2 | Backlog |
| LF-07 | Thiết lập CI và bản HTTPS đầu tiên | TV2 | TV3 | 8 | 07/11 | 2.2 | Backlog |
| LF-08 | Kiểm duyệt tối thiểu, sửa lỗi và ghi phần kỹ thuật | TV2 | TV3 | 4 | 11/11 | 4.1 | Backlog |
| LF-09 | Chốt bản HTTPS để UAT và hướng dẫn chạy lại | TV2 | TV5 | 5 | 13/11 | 5.3 | Backlog |
| LF-10 | Mô hình dữ liệu, seed và đăng nhập tài khoản thử | TV3 | TV2 | 8 | 05/11 | 2.1 | Todo |
| LF-11 | API đăng tin, xem/sửa tin và tìm kiếm tối thiểu | TV3 | TV2 | 8 | 07/11 | 3.1 | Backlog |
| LF-12 | Yêu cầu nhận đồ và ghi nhận bàn giao tối thiểu | TV3 | TV2 | 8 | 10/11 | 4.1 | Backlog |
| LF-13 | Wireframe và luồng màn hình tối thiểu | TV4 | TV1 | 4 | 04/11 | 3.1 | Todo |
| LF-14 | Giao diện đăng tin/tìm kiếm nối API thật | TV4 | TV5 | 8 | 08/11 | 3.1 | Backlog |
| LF-15 | Giao diện nhận đồ, bàn giao và kiểm duyệt | TV4 | TV5 | 4 | 12/11 | 4.1 | Backlog |
| LF-16 | BC5: 8–10 slide và kịch bản demo | TV4 | TV1 | 8 | 14/11 | 5.2 | Backlog |
| LF-17 | Tiêu chí nghiệm thu, test plan và risk baseline | TV5 | TV3 | 4 | 04/11 | 1.3.1 | Todo |
| LF-18 | Kiểm tra Sprint 1, review/retro và Risk Update #1 | TV5 | TV1 | 8 | 08/11 | 1.3.1 | Backlog |
| LF-19 | M3 Health Check sau tuần đầu | TV5 | TV1 | 2 | 09/11 | 1.3.2 | Backlog |
| LF-20 | UAT, Risk Update #2 và tổng hợp BC3 | TV5 | TV1 | 6 | 15/11 | 1.3.2 | Backlog |
| LF-21 | Audit bằng chứng, tự đánh giá rubric và kiểm tra 5 báo cáo | TV5 | TV2 | 4 | 15/11 | 1.3.2 | Backlog |

## Nội dung để copy vào từng issue

### LF-01 — Chốt phạm vi, phân vai, stakeholder và tạo Drive

- **Owner / reviewer:** TV1 / TV5.
- **Estimate / hạn:** 4 giờ / 2026-11-03 (UTC+7).
- **WBS:** 1.1; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** Không; có thể bắt đầu sau khi nhận vai trò/quyền cần thiết.
- **Đầu ra:** Biên bản kickoff, danh sách thành viên/giờ rảnh, nguồn nhu cầu, thư mục Drive và lịch hẹn PO/GV.

**Tiêu chí hoàn thành:**

- [ ] Nhận vai trò theo kỹ năng thật; cả nhóm đọc phạm vi MVP rút gọn và ghi điểm chưa thống nhất.
- [ ] Có trao đổi/nguồn nhu cầu thực tế; xác định người sẽ ký Charter và đặt lịch, không tự gán người đã đồng ý.
- [ ] Drive chia 5 thư mục báo cáo, Anyone with the link / Viewer; TV5 thử mở không đăng nhập.
- [ ] Ghi giờ rảnh thật và hạn trước 16/11; nói rõ với thầy khoảng trống lịch sử học kỳ nếu chưa đủ bằng chứng.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-02 — Hoàn thiện BC1/M1 và thu chữ ký thật

- **Owner / reviewer:** TV1 / TV2.
- **Estimate / hạn:** 6 giờ / 2026-11-05 (UTC+7).
- **WBS:** 1.1; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** LF-01.
- **Đầu ra:** M1 đủ 13 mục, stakeholder matrix, bản đúng phiên bản có chữ ký PO/Stakeholder và GV trên Drive.

**Tiêu chí hoàn thành:**

- [ ] Điền thông tin thật của nhóm, scope rút gọn và hạn bàn giao 15/11.
- [ ] Reviewer kiểm tra tính khả thi; PO/Stakeholder và GV ký theo hình thức được chấp nhận, nhóm trưởng ký phần template.
- [ ] Thiếu chữ ký thì giữ In Review/blocked và hẹn lại; PR approval không thay chữ ký.
- [ ] Bản đã ký đúng nội dung được chốt, mở được ở thư mục BC1.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-03 — Tổng hợp BC4: PDF 15–25 trang và checklist bằng chứng

- **Owner / reviewer:** TV1 / TV5.
- **Estimate / hạn:** 8 giờ / 2026-11-15 (UTC+7).
- **WBS:** 5.1; **Sprint:** S2 09–15/11.
- **Đầu vào/phụ thuộc:** LF-02, LF-06, LF-20.
- **Đầu ra:** Bản nháp ngày 14/11; PDF cuối 15–25 trang lúc 16:00 ngày 15/11, kèm evidence checklist trên Drive.

**Tiêu chí hoàn thành:**

- [ ] Từ 09/11 dựng bố cục, nhận phần kỹ thuật/kết quả do từng người cung cấp; không đợi toàn bộ dependency hoàn thành mới bắt đầu viết.
- [ ] Kể việc đã diễn ra ở thì quá khứ; có phần chưa đạt, nguồn số liệu, link HTTPS/repo và phản hồi thật.
- [ ] Sau review Sprint 2 sáng 15/11, cập nhật kết quả/risk/acceptance vào bản cuối.
- [ ] PDF thực tế 15–25 trang, liên kết mở được, TV5 review; chưa có kết quả thì không điền giả.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-04 — Kiểm tra bộ nộp Drive, demo và bàn giao trước hạn

- **Owner / reviewer:** TV1 / TV5.
- **Estimate / hạn:** 4 giờ / 2026-11-15 (UTC+7).
- **WBS:** 5.3; **Sprint:** S2 09–15/11.
- **Đầu vào/phụ thuộc:** LF-02, LF-03, LF-06, LF-09, LF-16, LF-20, LF-21.
- **Đầu ra:** Index Drive đủ 5 báo cáo, link HTTPS và ghi nhận kiểm tra/nộp thật; mục tiêu xong 20:00 Chủ nhật 15/11.

**Tiêu chí hoàn thành:**

- [ ] Đủ BC1–BC5 đúng phiên bản và yêu cầu; chỉ tích form cho báo cáo thực sự hoàn tất, đã lên Drive.
- [ ] Mở từ phiên không đăng nhập: thư mục, từng report, evidence và link sản phẩm đều truy cập được.
- [ ] Ghi ai kiểm tra, thời gian, vấn đề còn tồn tại và việc nộp nếu đã thực hiện.
- [ ] 20:00 là giờ nội bộ đề xuất để có dự phòng; hạn người dùng nêu là trước thứ Hai 16/11, không chờ đến thứ Hai mới làm.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-05 — Chốt stack, cấu trúc source và quy trình GitHub

- **Owner / reviewer:** TV2 / TV3.
- **Estimate / hạn:** 5 giờ / 2026-11-03 (UTC+7).
- **WBS:** 1.2; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** Không; có thể bắt đầu sau khi nhận vai trò/quyền cần thiết.
- **Đầu ra:** Quyết định công nghệ ngắn, hợp đồng dữ liệu/API bản đầu, repo/quyền/board sẵn sàng.

**Tiêu chí hoàn thành:**

- [ ] Chọn stack nhóm từng dùng; thử đọc/ghi dữ liệu và ghi cách chạy; không dành nhiều ngày học framework mới.
- [ ] Chốt cấu trúc dữ liệu/endpoint đủ để TV3/TV4 làm song song; gửi hợp đồng trước khi kết thúc ngày 03/11.
- [ ] Repo và Project cấp đúng quyền; CODEOWNERS thay tên mẫu; PR có người khác review.
- [ ] Board dùng Backlog / Todo / In Progress / In Review / Done; chỉ đưa 5 việc khởi động vào Todo, đặt owner/reviewer/hạn.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-06 — Hoàn thiện BC2: WBS, Dictionary và baseline 2 tuần

- **Owner / reviewer:** TV2 / TV1.
- **Estimate / hạn:** 3 giờ / 2026-11-04 (UTC+7).
- **WBS:** 1.2; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** LF-01, LF-05, LF-17.
- **Đầu ra:** M2/WBS được nhóm review, toàn bộ việc nối WBS, snapshot board/baseline đúng ngày.

**Tiêu chí hoàn thành:**

- [ ] WBS bao phủ MVP và đủ 5 báo cáo, deployment/Drive/chữ ký; work package 1–2 tuần.
- [ ] Tổng giờ từ issue khớp dictionary, có owner/dependency/AC, không cộng trùng.
- [ ] Điều chỉnh estimate theo kỹ năng thật sau spike; không xem 119 giờ đề xuất là cam kết trước khi nhóm xác nhận.
- [ ] Lưu baseline đúng thời điểm, cập nhật M1/backlog nếu scope khác; chữ ký Charter thiếu vẫn được ghi rõ.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-07 — Thiết lập CI và bản HTTPS đầu tiên

- **Owner / reviewer:** TV2 / TV3.
- **Estimate / hạn:** 8 giờ / 2026-11-07 (UTC+7).
- **WBS:** 2.2; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** LF-05, LF-10, LF-11.
- **Đầu ra:** URL HTTPS thật, CI trên PR, cấu hình môi trường, bản app/API/CSDL đầu tiên.

**Tiêu chí hoàn thành:**

- [ ] Lệnh CI phù hợp stack thực sự chạy; không dùng test giả luôn pass.
- [ ] Ngày 07/11 deploy app nền/API và dữ liệu; phối hợp TV4 dùng UI tối thiểu đang làm ở LF-14, kiểm tra luồng đủ ở LF-18 ngày 08/11.
- [ ] HTTPS truy cập từ ngoài máy tác giả, dữ liệu tồn tại sau tải lại; không trỏ API về localhost.
- [ ] README/env example không secret, có log/run/commit; nếu deploy thất bại giữ blocker, không tuyên bố gate đạt.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-08 — Kiểm duyệt tối thiểu, sửa lỗi và ghi phần kỹ thuật

- **Owner / reviewer:** TV2 / TV3.
- **Estimate / hạn:** 4 giờ / 2026-11-11 (UTC+7).
- **WBS:** 4.1; **Sprint:** S2 09–15/11.
- **Đầu vào/phụ thuộc:** LF-11, LF-12.
- **Đầu ra:** API ẩn/khôi phục tin theo quyền, ghi chú kỹ thuật cho BC4 và lỗi đã sửa được retest.

**Tiêu chí hoàn thành:**

- [ ] Chỉ moderator được ẩn/khôi phục, lưu lý do và thời gian; user thường không gọi được endpoint.
- [ ] Tin ẩn không lộ qua list/search/detail của người không có quyền; không làm mất trạng thái đã trả.
- [ ] TV4 có hợp đồng endpoint cho màn hình ở LF-15.
- [ ] Gửi mô tả kiến trúc/triển khai và link PR thật cho TV1 trước 13/11; ghi rõ phần chưa xong.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-09 — Chốt bản HTTPS để UAT và hướng dẫn chạy lại

- **Owner / reviewer:** TV2 / TV5.
- **Estimate / hạn:** 5 giờ / 2026-11-13 (UTC+7).
- **WBS:** 5.3; **Sprint:** S2 09–15/11.
- **Đầu vào/phụ thuộc:** LF-07, LF-08, LF-15.
- **Đầu ra:** Bản online đủ MVP ngày 13/11, runbook, commit/version và cách dùng tài khoản demo.

**Tiêu chí hoàn thành:**

- [ ] Tích hợp đủ chức năng đã chốt, khóa thêm tính năng từ hết 12/11; ưu tiên lỗi chặn và quyền dữ liệu.
- [ ] Người khác thử luồng đầy đủ trên HTTPS, tài khoản demo quyền thấp và dữ liệu thử có nhãn.
- [ ] Có hướng dẫn deploy/run/seed và cách giữ bản ổn định cho nộp/bảo vệ.
- [ ] LF-20 kiểm thử/UAT trên bản này; nếu sửa sau đó phải ghi commit mới và retest trước bàn giao.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-10 — Mô hình dữ liệu, seed và đăng nhập tài khoản thử

- **Owner / reviewer:** TV3 / TV2.
- **Estimate / hạn:** 8 giờ / 2026-11-05 (UTC+7).
- **WBS:** 2.1; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** LF-05.
- **Đầu ra:** Schema/migration, seed, đăng nhập/đăng xuất và kiểm tra quyền server.

**Tiêu chí hoàn thành:**

- [x] Bắt đầu ngay ngày 02/11 bằng model User/Post/Claim trên giấy; code theo stack sau LF-05, không cần ngồi chờ.
- [x] Có tài khoản user và moderator thử; đăng nhập đúng/sai, đăng xuất, gọi API không có quyền được kiểm tra.
- [x] Không tự xây cơ chế mật khẩu thiếu an toàn; dùng cơ chế/thư viện phù hợp stack.
- [x] Người khác khởi tạo dữ liệu thử theo hướng dẫn; PR nối với test/requirement.

**Evidence:** Đã hoàn thành hồ sơ thiết kế đặc tả kỹ thuật, schema DDL, seed data fixture và tài liệu tự kiểm thử tại [LF-10-mo-hinh-du-lieu-seed-auth.md](../04-thiet-ke/LF-10-mo-hinh-du-lieu-seed-auth.md), [schema.sql](../04-thiet-ke/sql/schema.sql), [seed.sql](../04-thiet-ke/sql/seed.sql). Sẵn sàng In Review cho TV2 (@imduw).

### LF-11 — API đăng tin, xem/sửa tin và tìm kiếm tối thiểu

- **Owner / reviewer:** TV3 / TV2.
- **Estimate / hạn:** 8 giờ / 2026-11-07 (UTC+7).
- **WBS:** 3.1; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** LF-10, LF-17.
- **Đầu ra:** API tạo/xem/sửa tin và tìm kiếm từ khóa + loại tin + khu vực, có dữ liệu lưu.

**Tiêu chí hoàn thành:**

- [ ] Tin dùng loại lost/found, tiêu đề, mô tả, khu vực, ngày và trạng thái; MVP rút gọn không có upload ảnh.
- [ ] Tạo hợp lệ đọc lại được; thiếu trường bắt buộc bị từ chối; chỉ sửa tin mở của mình.
- [ ] Bộ lọc trả đúng dữ liệu, có kết quả rỗng; TV4 nhận request/response và lỗi mẫu.
- [ ] Có test server cho dữ liệu/quyền; gửi schema/API và kết quả thật cho TV1 dùng trong BC4.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-12 — Yêu cầu nhận đồ và ghi nhận bàn giao tối thiểu

- **Owner / reviewer:** TV3 / TV2.
- **Estimate / hạn:** 8 giờ / 2026-11-10 (UTC+7).
- **WBS:** 4.1; **Sprint:** S2 09–15/11.
- **Đầu vào/phụ thuộc:** LF-11.
- **Đầu ra:** Claim bằng mô tả riêng, moderator từ chối hoặc xác nhận đã bàn giao, lưu dấu vết.

**Tiêu chí hoàn thành:**

- [ ] Chỉ claim tin nhặt được đang mở; không tự claim, không gửi trùng yêu cầu đang chờ.
- [ ] Chỉ người gửi xem claim của mình và moderator xem để đối chiếu; user khác không đọc được proof bằng cách đổi ID.
- [ ] Sau khi đối chiếu và thực sự bàn giao, moderator xác nhận completed và đóng tin; chưa bàn giao thì còn pending, không tự ghi đã trả.
- [ ] Tối đa một bàn giao thành công/tin kể cả request lặp/đồng thời; claim còn lại không nhận được nữa; tin mất được chủ tin đánh dấu đã tìm thấy.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-13 — Wireframe và luồng màn hình tối thiểu

- **Owner / reviewer:** TV4 / TV1.
- **Estimate / hạn:** 4 giờ / 2026-11-04 (UTC+7).
- **WBS:** 3.1; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** Không; có thể bắt đầu sau khi nhận vai trò/quyền cần thiết.
- **Đầu ra:** Wireframe login, list/search, detail, create/edit, claim và màn hình moderator đơn giản.

**Tiêu chí hoàn thành:**

- [ ] Đọc scope M1 trước, đánh dấu màn hình Sprint 1 và phần Sprint 2.
- [ ] Không thêm chat, AI, bản đồ, upload ảnh hay dashboard nâng cao.
- [ ] Nêu trạng thái lỗi/rỗng/chờ xử lý và thông tin đối chiếu riêng.
- [ ] TV1/TV3 review theo nghiệp vụ và model; gửi link/ảnh cho cả nhóm.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-14 — Giao diện đăng tin/tìm kiếm nối API thật

- **Owner / reviewer:** TV4 / TV5.
- **Estimate / hạn:** 8 giờ / 2026-11-08 (UTC+7).
- **WBS:** 3.1; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** LF-11, LF-13.
- **Đầu ra:** UI login, tạo/sửa/xem tin và tìm kiếm từ dữ liệu thật; bản tối thiểu hỗ trợ deploy ngày 07/11.

**Tiêu chí hoàn thành:**

- [ ] Dựng UI bằng hợp đồng/mock từ 04/11; mock ghi rõ và phải thay bằng API thật trước nghiệm thu.
- [ ] Luồng login → tạo tin → tải lại → tìm/xem tin chạy được trên bản HTTPS của LF-07.
- [ ] Hiển thị validation/loading/empty/error; người thường không có nút/thao tác quản trị, server vẫn kiểm tra quyền.
- [ ] Kiểm tra desktop và mobile giả lập; gửi ảnh/luồng UI cùng link PR cho BC4.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-15 — Giao diện nhận đồ, bàn giao và kiểm duyệt

- **Owner / reviewer:** TV4 / TV5.
- **Estimate / hạn:** 4 giờ / 2026-11-12 (UTC+7).
- **WBS:** 4.1; **Sprint:** S2 09–15/11.
- **Đầu vào/phụ thuộc:** LF-08, LF-12, LF-14.
- **Đầu ra:** Form claim, trạng thái yêu cầu, màn hình moderator xác nhận đã trả/ẩn tin.

**Tiêu chí hoàn thành:**

- [ ] Chỉ hiện proof cho người có quyền; dùng đúng endpoint và trạng thái đã chốt.
- [ ] Moderator phân biệt yêu cầu chờ xử lý, từ chối và đã bàn giao; không gắn nhãn đã trả trước hành động thật.
- [ ] Trạng thái tin cập nhật đúng; xử lý request lỗi/trùng rõ ràng.
- [ ] Tích hợp để khóa tính năng ngày 12/11, không nhận thêm tính năng ngoài scope.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-16 — BC5: 8–10 slide và kịch bản demo

- **Owner / reviewer:** TV4 / TV1.
- **Estimate / hạn:** 8 giờ / 2026-11-14 (UTC+7).
- **WBS:** 5.2; **Sprint:** S2 09–15/11.
- **Đầu vào/phụ thuộc:** LF-09, LF-19.
- **Đầu ra:** Deck 8–10 slide, kịch bản demo và buổi diễn tập; cập nhật kết luận cuối nếu cần ngày 15/11.

**Tiêu chí hoàn thành:**

- [ ] Dùng khung BC5, mỗi thành viên cung cấp bằng chứng phần mình; không thiết kế slide cho chức năng chưa có.
- [ ] Demo đi theo luồng đã chạy, có HTTPS URL/commit và video dự phòng đúng bản.
- [ ] Ngày 14/11, TV5 cung cấp tự đánh giá sơ bộ từ evidence đã có để diễn tập; slide 10 ghi rõ cutoff. LF-16 không chờ LF-21 mới hoàn tất bản diễn tập; LF-21 ngày 15/11 chốt rubric, TV4 cập nhật slide cuối trước audit.
- [ ] Deck đúng số slide, cả nhóm diễn tập; phản hồi và lỗi link được sửa trước đưa bản cuối vào Drive.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-17 — Tiêu chí nghiệm thu, test plan và risk baseline

- **Owner / reviewer:** TV5 / TV3.
- **Estimate / hạn:** 4 giờ / 2026-11-04 (UTC+7).
- **WBS:** 1.3.1; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** Không; có thể bắt đầu sau khi nhận vai trò/quyền cần thiết.
- **Đầu ra:** AC/test theo MVP rút gọn, risk register và 3-Step Matrix ban đầu đầy đủ.

**Tiêu chí hoàn thành:**

- [ ] Bắt đầu đọc M1/backlog ngay, rà lại sau quyết định scope/stack 03/11.
- [ ] Có test dương/âm về auth, quyền, tin, claim/trả và HTTPS/Drive; chưa chạy thì Not run.
- [ ] Register có owner/trigger/response và matrix; phân biệt dự kiến với kết quả đã thực hiện.
- [ ] Lưu baseline đúng ngày; bố trí thu evidence từ bây giờ, không đợi cuối kỳ.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-18 — Kiểm tra Sprint 1, review/retro và Risk Update #1

- **Owner / reviewer:** TV5 / TV1.
- **Estimate / hạn:** 8 giờ / 2026-11-08 (UTC+7).
- **WBS:** 1.3.1; **Sprint:** S1 02–08/11.
- **Đầu vào/phụ thuộc:** LF-07, LF-14, LF-17.
- **Đầu ra:** Test report, snapshot board, retro và risk update #1 sau Sprint 1 ngày 08/11.

**Tiêu chí hoàn thành:**

- [ ] Thử tạo/tìm tin và quyền trên HTTPS, ghi commit/môi trường/kết quả; nếu build chưa có thì ghi Blocked chứ không Pass.
- [ ] Ghi lỗi với bước tái hiện và owner; lỗi sản phẩm do TV2/TV3/TV4 sửa, TV5 retest.
- [ ] Review vẫn diễn ra nếu sprint chưa đạt; chỉ rõ việc dở, phụ thuộc và điều chỉnh Sprint 2.
- [ ] Risk update phản ánh quan sát thật; lưu phiên bản 1 và evidence, không chỉ đổi ngày baseline.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-19 — M3 Health Check sau tuần đầu

- **Owner / reviewer:** TV5 / TV1.
- **Estimate / hạn:** 2 giờ / 2026-11-09 (UTC+7).
- **WBS:** 1.3.2; **Sprint:** S2 09–15/11.
- **Đầu vào/phụ thuộc:** LF-18.
- **Đầu ra:** M3 dùng cutoff hết 08/11, review 09/11, quyết định ưu tiên tuần cuối.

**Tiêu chí hoàn thành:**

- [ ] So sánh baseline và kết quả Sprint 1 bằng link thật; không suy completion từ số commit.
- [ ] Nêu khả năng đạt 15/11 theo effort/phụ thuộc còn lại và người phụ trách.
- [ ] Health Check giữa kỳ dùng cập nhật risk #1; BC3 cuối kỳ còn cần update #2 ngày 15/11.
- [ ] Không điền giả số liệu thiếu hoặc coi có khung báo cáo là đã đạt milestone.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-20 — UAT, Risk Update #2 và tổng hợp BC3

- **Owner / reviewer:** TV5 / TV1.
- **Estimate / hạn:** 6 giờ / 2026-11-15 (UTC+7).
- **WBS:** 1.3.2; **Sprint:** S2 09–15/11.
- **Đầu vào/phụ thuộc:** LF-09, LF-18, LF-19.
- **Đầu ra:** Test/UAT ngày 13–14/11; review Sprint 2/final retro và BC3 đủ hai lần cập nhật trước 12:00 ngày 15/11.

**Tiêu chí hoàn thành:**

- [ ] Người dùng thật thử luồng chính; ghi phản hồi và xác nhận chấp nhận/điều kiện còn thiếu, không tự ký thay.
- [ ] Retest lỗi chặn/quyền trên đúng bản online; gửi kết quả cho TV1 viết BC4.
- [ ] Sáng 15/11 review Sprint 2 và final retrospective toàn dự án; so sánh hai risk update, hoàn tất matrix, ghi bài học cụ thể và acceptance thật.
- [ ] Giữ ngày review thật, ghi rõ Week 6/11 là chú thích tuần học; bản BC3 lên Drive trước khi chốt BC4 cuối.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.

### LF-21 — Audit bằng chứng, tự đánh giá rubric và kiểm tra 5 báo cáo

- **Owner / reviewer:** TV5 / TV2.
- **Estimate / hạn:** 4 giờ / 2026-11-15 (UTC+7).
- **WBS:** 1.3.2; **Sprint:** S2 09–15/11.
- **Đầu vào/phụ thuộc:** LF-03, LF-16, LF-20.
- **Đầu ra:** Evidence index, rubric có căn cứ, kết quả kiểm tra Drive/HTTPS trước 18:00 ngày 15/11.

**Tiêu chí hoàn thành:**

- [ ] Đủ liên kết repo/board/risk/retro/change/AI/acceptance; ghi thiếu sót thật.
- [ ] Rubric tự đánh giá theo nguồn, gate đánh giá riêng; không khẳng định đạt lịch sử cả học kỳ khi chưa đủ căn cứ.
- [ ] BC1 có chữ ký, BC2 có dictionary, BC3 hai cập nhật, BC4 PDF 15–25 trang, BC5 8–10 slide/rubric.
- [ ] Mở Drive và từng file/link bằng phiên không đăng nhập; gửi checklist đạt/chưa đạt để TV1 làm LF-04.

**Evidence:** chưa có; khi làm bổ sung PR/file/test/biên bản/URL, ngày và người review. Chưa đạt AC giữ mở hoặc ghi blocker; không đóng chỉ vì đã soạn mô tả.
