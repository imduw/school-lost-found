# Gửi gì cho ai — phân công đến trước 16/11

**Bản làm việc v0.3, ngày 02/11/2026.** Hạn người dùng xác nhận: **trước thứ Hai 16/11**. Chọn mục tiêu nội bộ **20:00 Chủ nhật 15/11 (UTC+7)** để còn dự phòng; đây không phải giờ thầy công bố. Người dùng đã xác nhận hạn này áp dụng cho **cả 5 báo cáo và sản phẩm chạy HTTPS/APK**; kế hoạch hiện chọn hướng web HTTPS.

**Cập nhật 03/11:** đã có năm issue khởi động; tiếp tục [hoàn thiện LF-01](docs/01-khoi-tao/LF-01-pham-vi-phan-cong-khoi-dong.md). Không tạo lại năm thẻ đó. Username đã điền trong các phiếu/CSV; chưa có cam kết giờ làm.

## 1. Bạn gửi đúng 5 phiếu này

Bộ này đang ở máy bạn, chưa có URL chia sẻ. Gửi cả ZIP/thư mục cho nhóm một lần, giữ nguyên cấu trúc để các link tương đối mở được; hoặc đưa tài liệu lên repo qua PR rồi gửi link GitHub tới trang này. Sau đó gửi một tin nhắn chung gồm link tài liệu, repo và Project. Sau đó tag từng người kèm **phiếu của họ**; không cần gửi riêng toàn bộ các file template của thầy. Trong mỗi phiếu đã có link tới tài liệu cần đọc và mã việc cần nhận.

| Người | Phiếu để gửi | Chịu trách nhiệm | Tài liệu đọc trước | Việc phải nộp |
|---|---|---|---|---|
| **TV1 — bạn** | [Phiếu nhóm trưởng](phan-cong/TV1-nhom-truong.md) | Nhu cầu, chữ ký, Drive, tổng hợp và nộp | M1, Submission Checklist, khung BC4 | BC1 đã ký; BC4 PDF; bộ Drive đủ 5 báo cáo |
| **TV2** | [Phiếu kỹ thuật/WBS](phan-cong/TV2-ky-thuat-wbs.md) | WBS, công nghệ, CI/HTTPS, tích hợp | M2, deployment checklist, GitHub setup | BC2; bản HTTPS; kiểm duyệt tối thiểu; runbook |
| **TV3** | [Phiếu backend/dữ liệu](phan-cong/TV3-backend-du-lieu.md) | Dữ liệu, auth, API, nghiệp vụ nhận đồ | Backlog/AC, phạm vi M1, phụ thuộc M2 | API chạy/test được; schema và phần kỹ thuật cho BC4 |
| **TV4** | [Phiếu giao diện/slide](phan-cong/TV4-giao-dien-slide.md) | UI, demo, slide | Backlog/AC, phạm vi M1, khung BC5 | Giao diện nối API; deck 8–10 slide và kịch bản demo |
| **TV5** | [Phiếu QA/rủi ro](phan-cong/TV5-qa-risk-evidence.md) | Test, risk, M3, evidence/rubric | Risk register, M3, evidence index | BC3 hai cập nhật; test/UAT; M3; evidence và self-assessment |

Chọn TV2 là người mạnh nhất về dựng/chạy ứng dụng; TV3 nghiêng dữ liệu/backend; TV4 nghiêng giao diện; TV5 cẩn thận về test/tổng hợp. Chưa biết kỹ năng nên đây là phân vai đề xuất, cần cả nhóm nhận vai trò hôm nay. Không chia mỗi người đúng một báo cáo rồi bỏ trống việc làm sản phẩm.

## 2. Năm thẻ đưa vào Todo ngay hôm nay

[Hướng dẫn bấm New issue, copy nội dung và đưa lên Project](phan-cong/TV1-nhom-truong.md). Bạn tạo việc cho cả nhóm; phần bạn trực tiếp làm là LF-01 đến LF-04.

| Thẻ | Giao cho | Làm ngay | Hạn |
|---|---|---|---|
| **LF-01 — Chốt phạm vi, phân vai, stakeholder và tạo Drive** | TV1 | Họp ngắn, lấy giờ rảnh, liên hệ PO/GV và tạo nơi nộp | 03/11 |
| **LF-05 — Chốt stack, cấu trúc source và quy trình GitHub** | TV2 | Chọn stack quen; gửi hợp đồng API/model và kiểm tra repo/board | 03/11 |
| **LF-10 — Mô hình dữ liệu, seed và đăng nhập tài khoản thử** | TV3 | Phác User/Post/Claim trước; code sau khi TV2 chốt stack | 05/11 |
| **LF-13 — Wireframe và luồng màn hình tối thiểu** | TV4 | Vẽ login, tin, tìm kiếm, nhận đồ và màn hình moderator | 04/11 |
| **LF-17 — Tiêu chí nghiệm thu, test plan và risk baseline** | TV5 | Viết cách kiểm tra và rủi ro từ phạm vi đang đề xuất, rà lại sau kickoff | 04/11 |

**[Toàn bộ 21 thẻ để copy vào GitHub](docs/03-yeu-cau/board-tasks-2026-11-15.md)** đã có đầu ra, AC, reviewer, estimate và phụ thuộc. [CSV](docs/03-yeu-cau/board-tasks-2026-11-15.csv) dùng để lọc theo người; chưa tự tạo issue trên GitHub. LF-xx là mã kế hoạch, không phải số issue.

Giữ `Todo`, thêm `Backlog` và `In Review`: **Backlog → Todo → In Progress → In Review → Done**. Chỉ năm thẻ trên ở Todo trước; những thẻ chưa đủ đầu vào để Backlog. Mỗi người một việc chính đang làm, có đầu ra thì nhờ reviewer; không kéo Done chỉ vì đã gửi tin “xong”.

## 3. Mốc phải giữ

| Mốc nội bộ | Kết quả |
|---|---|
| 03/11 | Phạm vi/stack/vai trò được nhóm chốt, stakeholder đã liên hệ, Drive và GitHub dùng được |
| 04–05/11 | BC2 baseline; mục tiêu BC1 đủ chữ ký, dữ liệu/auth sẵn sàng |
| 07–08/11 | Có HTTPS và luồng tạo/tìm tin; review/retro Sprint 1; risk update #1 |
| 09/11 | M3 giữa kỳ từ số liệu hết 08/11; chốt ưu tiên tuần cuối |
| 10–12/11 | Nhận đồ/bàn giao/kiểm duyệt tối thiểu; hết 12/11 khóa thêm tính năng |
| 13–14/11 | UAT trên HTTPS, sửa lỗi chặn; bản nháp BC4 và slide; diễn tập |
| Sáng 15/11 | Review Sprint 2, risk update #2 và BC3; cập nhật kết quả vào BC4 |
| 16:00 → 18:00 → 20:00 ngày 15/11 | Chốt PDF → audit hồ sơ/link → bàn giao/nộp theo cách thầy yêu cầu |

Chữ ký, stakeholder và hosting có phụ thuộc bên ngoài nên làm sớm, không để đến ngày 15 mới hỏi. Week 6/11 là chú thích tuần học; ngày hai risk update phải là ngày thực tế, không ghi lùi ngày.

## 4. Phạm vi đủ nhỏ để nhóm bàn

Đề xuất MVP web: tài khoản thử; đăng/xem/sửa tin dạng văn bản; tìm theo từ khóa/loại/khu vực; yêu cầu nhận đồ bằng mô tả riêng; moderator đối chiếu rồi ghi nhận đã bàn giao; ẩn/khôi phục tin; HTTPS và test quyền. Hoãn upload ảnh, lọc nâng cao, bước duyệt nhiều tầng, AI/chat/mobile/SSO. Quy tắc nghiệp vụ này cần stakeholder xác nhận khi chốt M1, chưa được coi là họ đã đồng ý.

119 giờ là **ước lượng sơ bộ của phạm vi rút gọn**, không phải lấy 212 giờ kế hoạch cũ rồi ép vào hai tuần. TV1/TV2/TV3/TV4/TV5 lần lượt 22/25/24/24/24 giờ công việc. Nếu mỗi người dành khoảng 15 giờ/tuần thì tổng có 150 giờ, còn 31 giờ cho họp, review, phối hợp và phát sinh. TV2/TV3 có 16 giờ công việc ở tuần đầu, cần sắp giờ hoặc ghép người hỗ trợ. Nếu không đủ năng lực/stack, điều chỉnh scope với nhóm/PO và trao đổi thầy; không hứa chắc kịp bằng bảng ước lượng.

## 5. Tin nhắn bạn có thể gửi vào nhóm

> Nhóm mình phải hoàn tất trước thứ Hai 16/11; mục tiêu nội bộ là 20:00 Chủ nhật 15/11. Mỗi người đọc phiếu được giao, xác nhận vai trò và số giờ có thể làm hôm nay. Mình gửi kèm bảng phân công để đưa lên GitHub Project; mỗi việc có đầu ra, hạn và người review. Bắt đầu bằng một thẻ Todo/người; nộp kết quả bằng link file/PR/test, báo ngay khi bị chặn. Tối 08/11 review tuần đầu; ngày 15/11 chốt bộ nộp. Mỗi người tự lưu bằng chứng phần mình và gửi nội dung thật cho báo cáo tổng kết.

Bạn tự gửi tin này và tag username thật. Bộ tài liệu chưa gửi tin cho thành viên, tạo issue, đổi quyền hay nộp lên Drive/GitHub.
