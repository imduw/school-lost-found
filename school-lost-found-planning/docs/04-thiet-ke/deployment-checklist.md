# Deployment checklist — HTTPS trước 16/11

**v0.3, 02/11/2026.** Chưa có stack/provider/URL được xác nhận. TV2 chủ trì, TV3 dữ liệu/API, TV4 UI, TV5 kiểm tra từ môi trường khác. Hạn đã xác nhận gồm cả 5 báo cáo và sản phẩm HTTPS/APK; MVP hiện chọn web HTTPS.

## Mốc công việc

- LF-05, 03/11: chọn stack quen, phương án UI/API/CSDL công khai, chi phí/giới hạn và người quản trị. Không mặc định một gói luôn miễn phí.
- LF-07, 07/11: HTTPS nền/API/dữ liệu với UI tối thiểu đang phát triển; phối hợp LF-14/18 để kiểm tra full slice tạo/tìm tin ngày 08/11.
- LF-09, 13/11: bản đủ MVP phục vụ UAT; tính năng đã khóa từ cuối 12/11.
- 13–15/11: retest sau sửa lỗi, chốt URL/commit/runbook; kiểm tra lần cuối trước nộp mục tiêu 20:00 ngày 15/11.

## Điều kiện nghiệm thu

- [ ] HTTPS mở từ mạng/máy ngoài tác giả, chứng chỉ hợp lệ; không cần tài khoản hạ tầng của nhóm mới mở được trang.
- [ ] Người thử có cách đăng nhập tài khoản demo quyền thấp; không chia sẻ tài khoản quản trị hạ tầng.
- [ ] UI/API/CSDL thật hoạt động, không trỏ về localhost hoặc chỉ trả mock; tạo/tải lại/đọc được tin văn bản.
- [ ] Claim/bàn giao/kiểm duyệt tuân quyền server; proof riêng không bị công khai.
- [ ] Env/secrets ngoài Git; có migration/seed, lệnh chạy/deploy, phiên bản và cách quay lại bản ổn định.
- [ ] Ghi URL, commit, ngày/người kiểm tra và test report; link report/Drive/slide cùng trỏ đúng bản.
- [ ] Duy trì truy cập trong giai đoạn nộp/bảo vệ theo yêu cầu thầy; video/local chỉ là dự phòng.

CI kiểm tra PR; deployment tạo bản chạy. Charter Template có yêu cầu CI, thông báo mới có gate HTTPS/APK; không dùng một dấu CI xanh thay cho kiểm tra bản online. Việc tự động hóa mọi bước deploy chưa được xác định riêng, nên ưu tiên cách triển khai thật có thể lặp lại phù hợp stack.
