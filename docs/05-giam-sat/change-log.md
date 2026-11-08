# Change Log — thay đổi phạm vi, lịch hoặc nguồn lực

Khởi tạo 01/11, cập nhật 02/11/2026. **Đã ghi nhận thông báo bổ sung yêu cầu và hạn nộp thực tế; chưa có quyết định phê duyệt baseline của nhóm được cung cấp.** Bản đề xuất ban đầu chưa được thống nhất không phải baseline đã thay đổi.

## Quy trình

1. Người đề xuất tạo issue mô tả vấn đề thật, thay đổi mong muốn và lý do.
2. Owner kỹ thuật/QA đánh giá ảnh hưởng tới AC, WBS, effort, thời gian, dữ liệu và test.
3. TV1 quyết định trong phạm vi được nhóm giao; thay đổi ảnh hưởng nhu cầu/acceptance cần ý kiến stakeholder; quy định học phần cần thầy xác nhận khi liên quan.
4. Ghi chấp nhận/từ chối/hoãn cùng ngày và bằng chứng. Chỉ triển khai scope mới sau quyết định.
5. Cập nhật baseline mới, giữ bản cũ; liên kết M1/M2/backlog/test/risk/issue có liên quan.

## Register

Các mốc/estimate ở REQ-UPDATE-01 là **lịch sử đề xuất v0.2 đã được thay thế**, không dùng để giao việc hiện tại. Bản áp dụng để nhóm bàn là v0.3 và LF-01…LF-21 theo REQ-UPDATE-02.

| CR ID | Ngày / người đề xuất | Vấn đề và nguồn | Trước → sau | Ảnh hưởng scope/giờ/lịch/test | Quyết định / người xác nhận / ngày | Tài liệu/issue cập nhật | Kết quả |
|---|---|---|---|---|---|---|---|
| REQ-UPDATE-01 | 02/11/2026; thông báo thầy do nhóm trưởng trích dẫn | [Nguồn bổ sung](../../references/instructor-supplement-2026-11-02.md): 5 báo cáo, HTTPS/APK, Drive Viewer, chữ ký, quy cách PDF/slide | Bản kế hoạch ban đầu còn để mở hình thức deploy/nộp → v0.2 đưa HTTPS và Drive/chữ ký/BC4–BC5 vào tiêu chí bàn giao; giữ phạm vi chức năng MVP | Estimate dự thảo tháng 180 → 212h, tuần 45 → 48h; đề xuất thêm S1-16/17, WBS 2.2/6.3/6.4, TC15/16; mốc 30/11 chưa đổi nhưng dự phòng giảm | Đã nhận thông tin và soạn điều chỉnh; **chưa có xác nhận chốt kế hoạch của nhóm/PO** | README, M1, M2, risk register, backlog, weekly/issues, checklist nộp, M3/evidence | Bản đề xuất v0.2 đã được thay thế bởi v0.3; chưa có bằng chứng thực thi hoặc nộp đầu ra |
| REQ-UPDATE-02 | 02/11/2026; nhóm trưởng thông báo hạn và xác nhận phạm vi nộp | [Nguồn hạn mới](../../references/deadline-update-2026-11-02.md): trước thứ Hai 16/11 cho cả 5 báo cáo và HTTPS/APK | Lịch dự kiến cuối tháng → Sprint 1 02–08/11, Sprint 2 09–15/11; mục tiêu nội bộ nộp 20:00 ngày 15/11; đề xuất hoãn upload ảnh/lọc nâng cao/duyệt nhiều tầng | Scope rút gọn 119 giờ việc trên 150 giờ năng lực giả định, 21 thẻ LF; M3 09/11, risk update 08/11 và sáng 15/11; TC04 ảnh hoãn rõ, giữ test quyền/HTTPS/Drive | **Hạn/phạm vi nộp đã được nhóm trưởng xác nhận**; phân vai/estimate/scope rút gọn còn cần nhóm và PO chốt, chưa có chữ ký/approval được cung cấp | M1/M2/M3, backlog, risk, weekly, 21 thẻ/CSV, 5 phiếu, GitHub setup, checklist/evidence và khung BC4/BC5 | Bộ phân công v0.3 được soạn tại máy; chưa tạo issue, deploy, nộp hoặc xác nhận báo cáo hoàn tất |

Đây là bằng chứng tiếp nhận/phân tích yêu cầu mới có thật. Trước khi khóa baseline, TV1 cần ghi quyết định nhóm, người xác nhận và ngày; khi đã thực thi ghi kết quả và nguồn. Không tự gọi đây là scope change sau baseline hay khẳng định đã đạt checkpoint thay đổi thực tế của thầy. Các chi tiết được thầy làm rõ có thể là ràng buộc cũ chưa được nhóm biết, không nhất thiết là thầy thay đổi scope.

Template/Checklist của thầy yêu cầu minh chứng scope change thực tế. Theo dõi thay đổi phát sinh tự nhiên; nếu không có, báo đúng và hỏi thầy cách minh chứng thay thế. Không dựng một thay đổi giả, sự cố giả hoặc ngày phê duyệt lùi về quá khứ.
