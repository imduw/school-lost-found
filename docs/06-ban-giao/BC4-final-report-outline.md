# BC4 — Khung Final Technical Report & Evidence Package

Phiên bản chuẩn bị v0.3, 02/11/2026. **Chưa phải báo cáo kết quả, chưa xuất PDF, chưa nộp Drive.** TV1 tổng hợp; TV2–TV5 viết phần có trách nhiệm; TV5 đối chiếu evidence.

**Việc trên board:** LF-03, TV1 chịu trách nhiệm. Từ 09/11 dựng bản tổng hợp; nhận phần kỹ thuật từ TV2–TV4 trước 13/11, dữ liệu test từ TV5 theo từng đợt. Nháp đủ bố cục 14/11; sau review Sprint 2 sáng 15/11 cập nhật kết quả cuối, xuất PDF trước 16:00. TV5 audit trước 18:00; TV1 nộp mục tiêu 20:00 ngày 15/11. Đây là giờ nội bộ để đáp ứng hạn trước 16/11, không phải hạn riêng do thầy công bố.

## Quy cách bắt buộc và cách dùng khung

Theo thông báo thầy: **15–25 trang PDF, viết thì quá khứ**, tổng hợp dự án thực tế. Chỉ kể sự kiện đã xảy ra. Hiện chưa có sản phẩm/sprint hoàn tất để viết báo cáo kết quả; khung này chỉ quy định nơi điền dữ liệu sau thực thi. Không đổi câu “sẽ triển khai” thành “đã triển khai” khi chưa có bằng chứng.

## Phân bổ đề xuất: 22 trang

| Phần | Trang | Người viết chính | Nội dung/bằng chứng cần có |
|---|---:|---|---|
| Bìa, thông tin nhóm, mục lục | 2 | TV1 | Đề tài, thành viên thật, phiên bản, link Drive/repo/HTTPS |
| 1. Tổng quan và nhu cầu thực tế | 2 | TV1 | Người dùng đã trao đổi, nhu cầu, phạm vi đã thống nhất, Charter có chữ ký |
| 2. Phương pháp và tổ chức nhóm | 2 | TV1 | Vì sao chọn cách làm, vai trò thực tế, cadence đã thực hiện |
| 3. Kế hoạch và baseline | 3 | TV2 | WBS/Dictionary, ước lượng, lịch, năng lực, thay đổi so với dự kiến |
| 4. Thực thi và sản phẩm | 4 | TV2–TV4 | Kiến trúc thực tế, luồng đã giao, Sprint 1/2, HTTPS, issue/PR/test |
| 5. Rủi ro, chất lượng và thay đổi | 3 | TV5 | Hai risk update, matrix ba bước, sự cố/phản ứng/kết quả, test và CR có thật |
| 6. AI trong quản trị | 2 | Người sử dụng + TV5 | Đầu vào/đầu ra thật, cách kiểm chứng, phần đã sửa/từ chối, tác động có căn cứ |
| 7. Nghiệm thu và bàn giao | 3 | TV1 + TV5 | UAT, acceptance, bản chạy HTTPS, kiểm tra Drive, checklist evidence |
| 8. Bài học và hạn chế | 1 | Cả nhóm | Điều đã học từ sự kiện cụ thể, phần chưa đạt và việc sẽ làm khác |
| **Tổng dự kiến** | **22** | | |

22 trang gồm phần bìa/mục lục theo cách phân bổ này. Không đính thêm phụ lục làm file chính vượt 25 trang; để evidence chi tiết trong thư mục liên kết. Nếu thầy quy định cách đếm trang khác, điều chỉnh bố cục trước xuất. Đếm trang PDF thực tế, không suy từ số dòng Markdown.

## Quy tắc viết kết quả

- Mỗi kết luận quan trọng có ngày, đầu ra, nguồn và giới hạn. Dùng “Nhóm đã …” chỉ khi có issue/PR/test/biên bản xác minh.
- So sánh kế hoạch với thực tế, gồm cả việc trễ/chưa đạt. Không đồng nhất số commit với năng suất hoặc tỷ lệ issue đóng với tỷ lệ sản phẩm hoàn thành.
- Chưa làm được thì ghi “Đến ngày chốt báo cáo, nhóm chưa …”, nguyên nhân và ảnh hưởng; không bỏ khỏi bảng để tạo cảm giác đã hoàn tất.
- Lịch sử commit học kỳ: trình bày mốc thật, không suy ra đủ toàn học kỳ từ một vài commit đầu kỳ và một đợt upload cuối kỳ.
- Link tới Charter đã ký, WBS/Dictionary và BC3 thay vì chép trọn cả ba làm báo cáo dài lặp lại.

## Evidence Package đi kèm

Lấy danh mục từ [evidence index](../05-giam-sat/evidence-index.md), [checklist gốc của thầy](../../references/instructor/Week-14-Evidence-Package-Checklist.md) và [checklist nộp cập nhật](../../SUBMISSION-CHECKLIST.md). Gói tối thiểu gồm:

- Repo/commit/PR history và baseline/snapshot board qua sprint.
- Risk baseline, update #1, update #2, 3-Step Matrix và log xử lý.
- Sprint 1 retro, final retro, scope/change record thực tế.
- AI log có prompt/output và kiểm chứng của nhóm.
- Test report, lỗi/retest, phản hồi người dùng và acceptance.
- HTTPS URL/commit/version và ghi nhận người ngoài nhóm mở/chạy luồng chính.
- BC1 đã ký, WBS đã thống nhất, Drive đã kiểm tra truy cập.

Checklist xuất bản: nội dung đã review → đối chiếu nguồn → xuất PDF → kiểm tra 15–25 trang → mở thử mọi link → đặt đúng thư mục BC4 trong Drive → kiểm tra Viewer không đăng nhập. Ghi phiên bản, ngày chốt và người kiểm tra; chưa thực hiện thì để trống.
