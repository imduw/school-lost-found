# M3 — Midterm Health Check & Risk Update

**Phiên bản:** 0.3 — cập nhật hạn trước 16/11 ngày 02/11; chưa phải báo cáo giữa kỳ hoàn tất.  
**Người tổng hợp:** TV5; TV1 quyết định điều chỉnh; mỗi owner cung cấp bằng chứng.  
**Ngày soạn khung:** 01/11/2026. **Cutoff giữa kỳ đề xuất:** hết 08/11/2026 UTC+7. **Review nội bộ:** 09/11. BC3 có thêm risk update #2 sáng 15/11 trước nộp.  
**Ngày review thực tế / người tham gia / commit báo cáo:** chưa có.

**Phân biệt với BC3:** M3 là Health Check nội bộ. Báo cáo 3 thầy yêu cầu nộp là [Dynamic Risk Register & 3-Step Matrix](../02-lap-ke-hoach/risk-register.md), có hai lần cập nhật thật sau Sprint 1/Sprint 2. M3 dẫn các bản đó và cung cấp nội dung cho BC4, không tự thay BC3.

## 1. Mục đích và giới hạn hiện tại

M3 đánh giá tiến độ, phạm vi, chất lượng, nguồn lực và rủi ro dựa trên thực thi so với M1/M2. Tại ngày 01/11, người dùng xác nhận nhóm mới có repo/board, chưa làm sản phẩm và chưa chọn stack. Vì vậy chưa có kết quả sprint, tỷ lệ hoàn thành, test pass, vận tốc hoặc sự cố thực thi để kết luận giữa kỳ.

Nhóm có thể chuẩn bị M3 ngay; muốn hoàn thành M3 đúng nghĩa phải thực hiện công việc và cập nhật các phần dưới bằng bằng chứng thật. Nếu thầy yêu cầu nộp sớm, gọi bản này là “Initial Health Check / kế hoạch thu thập số liệu” và xác nhận cách dùng với thầy, không đổi tên dữ liệu dự kiến thành kết quả giữa kỳ.

## 2. Tóm tắt tại cutoff — cần cập nhật ngày 09/11

| Nội dung | Kết quả thực tế | Bằng chứng |
|---|---|---|
| Mục tiêu sprint đã đạt | Chưa có số liệu tại thời điểm soạn | Cần link demo/PR và Sprint Goal |
| Phần chưa hoàn thành | Chưa đối chiếu baseline thực thi | Cần issue chưa xong, phụ thuộc và ảnh hưởng |
| Chênh lệch quan trọng | Chưa đo | Baseline + snapshot cutoff |
| Quyết định cần nhóm trưởng/stakeholder | Chưa phát sinh quyết định giữa kỳ được ghi nhận | Biên bản/change log nếu có |
| Dự báo có thể bàn giao trước 16/11 | Chưa đủ dữ liệu để kết luận | Việc còn lại, năng lực thực tế, rủi ro/phụ thuộc |
| Gate HTTPS, lịch sử commit và Drive | Chưa xác minh đạt | URL bản chạy, lịch sử học kỳ, kiểm tra Drive từ phiên ngoài nhóm |
| BC1–BC5 và chữ ký | Chưa hoàn tất | [Checklist nộp](../../SUBMISSION-CHECKLIST.md), version đã ký/nộp |

## 3. Health dashboard

Chỉ dùng Xanh/Vàng/Đỏ khi đã có bằng chứng. **N/A/Chưa đo** không tương đương Xanh. Ngưỡng bên dưới là quy tắc nội bộ đề xuất, không phải rubric chấm điểm của thầy.

| Chiều đánh giá | Cách đánh giá | Trạng thái giữa kỳ | Nguồn phải có |
|---|---|---|---|
| Phạm vi | Xanh: scope rõ, thay đổi được xử lý; Vàng: có đề nghị chưa quyết; Đỏ: phát triển ngoài baseline gây ảnh hưởng mục tiêu | Chưa đánh giá | M1, RTM, change log |
| Tiến độ | Xanh: mục tiêu tuần đạt và phần còn lại vừa năng lực; Vàng: còn mục tiêu dở nhưng có đường phục hồi; Đỏ: phụ thuộc chính chặn, chưa có cách kịp hạn | Chưa đánh giá | Sprint plan, issue/PR, demo, forecast |
| Chất lượng | Xanh: AC của phần công bố hoàn thành đã qua; Vàng: lỗi có owner/hạn; Đỏ: lỗi nghiêm trọng về quyền hoặc chặn luồng chính | Chưa đánh giá | Test report, CI, defect list |
| Nguồn lực | Xanh: có owner/capacity; Vàng: thiếu người hoặc phụ thuộc một người; Đỏ: nhiệm vụ cốt lõi không có người có thể thực hiện | Chưa đánh giá | Capacity và ghi nhận trở ngại |
| Stakeholder | Xanh: có phản hồi thực tế; Vàng: đã liên hệ đang chờ; Đỏ: chưa có cách xác minh/nhận nghiệm thu trước hạn | Chưa đánh giá | Biên bản/phản hồi |
| Bằng chứng | Xanh: issue–PR–test–report nối được; Vàng: thiếu link có thể bổ sung; Đỏ: mất dấu quá trình, kết luận không kiểm chứng được | Chưa đánh giá | Evidence index, board snapshots |
| Điều kiện bàn giao | Theo dõi từng gate riêng; thiếu HTTPS hoặc Drive/chữ ký không được che bởi tỷ lệ tiến độ cao | Chưa đánh giá | Deployment checklist, hồ sơ ký, BC1–BC5 và lịch sử học kỳ |

## 4. Số liệu thực thi

| Chỉ số | Định nghĩa | Giá trị tại cutoff |
|---|---|---|
| Phạm vi baseline Sprint 1 | Danh sách issue và tổng estimate đã khóa, có thời điểm | Chưa khóa; v0.3 đề xuất 11 thẻ có hạn trong Sprint 1 / 66 giờ; toàn kế hoạch 21 thẻ / 119 giờ, không phải số thực tế |
| Scope thêm/bớt | Công việc thay đổi sau baseline, ghi estimate và ngày | Chưa đo |
| Hoàn thành baseline | Tổng estimate ban đầu của **issue baseline đã đạt toàn bộ DoD** / tổng estimate baseline | Chưa đo; mẫu số 0 thì N/A |
| Hoàn thành scope hiện tại | Done estimate của tập hiện tại / tổng estimate hiện tại; báo riêng scope thêm/bớt | Chưa đo |
| Việc bị chặn | Số issue và tổng thời gian bị chặn, nguyên nhân | Chưa đo |
| Test pass rate | Số Pass / (Pass + Fail) trên tập đã chạy; ghi riêng Blocked, Not run, tổng planned | Chưa chạy; không báo 100% |
| Defect còn mở | Theo mức nghiêm trọng, gắn ảnh hưởng luồng chính/quyền dữ liệu | Chưa đo |
| Khối lượng còn lại | Ước lượng lại effort thực tế còn cần, không chỉ đếm số issue | Chưa đo |
| Năng lực còn lại | Tổng giờ thành viên thực sự cam kết đến ngày 15/11, trừ thời gian review/họp/dự phòng | Chưa xác nhận |

Issue count không đo được phần trăm sản phẩm; commit count không đo năng suất. Không gọi tỷ lệ giờ ước lượng này là EVM/SPI/CPI. Không tính credit hoàn thành một nửa issue trong chỉ số “Done”, nhưng vẫn ghi remaining effort để dự báo. Việc hủy không được tính Done, cha/con không cộng trùng.

Ghi dữ liệu tại [daily-metrics.csv](daily-metrics.csv). `baseline_effort_h` giữ nguyên sau khóa; `added_effort_h` và `removed_effort_h` là tổng lũy kế so với baseline, có ID issue giải thích. Scope hiện tại = baseline + added − removed; remaining estimate là đánh giá giờ thực tế còn phải làm, không bắt buộc bằng scope − done vì có ước lượng lại. Mỗi sprint có baseline riêng.

CSV chỉ có header vì chưa có đo lường. Không backfill ngày 02–03/11 bằng số liệu tưởng tượng khi đến 04/11 mới bắt đầu lưu. Có thể dựng biểu đồ burndown từ dữ liệu thật theo ngày; giữ đường scope để nhìn thấy việc thêm/bớt. Không cần dựng EVM khi chưa có baseline chi phí/effort phù hợp.

## 5. So sánh kế hoạch và đầu ra

| Đầu ra dự kiến tới cutoff 08/11 | Kết quả thực tế / mức nghiệm thu | Issue/PR/test/demo | Chênh lệch và nguyên nhân |
|---|---|---|---|
| M1/M2 được nhóm thống nhất, còn approval nào ghi rõ | Chưa cập nhật | Chưa có | Chưa có |
| R01 đăng nhập và quyền cơ bản | Chưa cập nhật | Chưa có | Chưa có |
| R02 tạo/sửa/xem tin văn bản | Chưa cập nhật | Chưa có | Chưa có |
| R03 tìm kiếm/lọc | Chưa cập nhật | Chưa có | Chưa có |
| Review Sprint 1, risk update và hành động Sprint 2 | Chưa cập nhật | Chưa có | Chưa có |
| HTTPS cho lát cắt/R01–R03 và risk update #1 ngày 08/11 | Chưa cập nhật | Chưa có | Chưa có |

R04–R06 dự kiến triển khai 09–12/11 nên chưa xong tại cutoff 08/11 chưa tự động là trễ. M3 phải kiểm tra khả năng hoàn tất chúng và UAT trước 15/11. Đối chiếu baseline đã khóa, không tự đổi lịch sử để che chênh lệch.

## 6. Risk Update

Liên kết [risk register](../02-lap-ke-hoach/risk-register.md), 3-Step Matrix và PR/version review 08/11 cho M3 giữa kỳ. Lần review 15/11 là cập nhật #2 của BC3 cuối kỳ, chỉ bổ sung sau khi đã diễn ra. Week 6/11 là nhãn tuần học, ngày cập nhật phải là ngày thật. Với mỗi rủi ro thực sự xảy ra, ghi:

| Risk / sự cố | Dấu hiệu và thời điểm | Ảnh hưởng thật | Đã làm gì / ai | Kết quả quan sát | Việc còn lại |
|---|---|---|---|---|---|

Bảng này đang trống vì chưa có sự kiện thực thi. Không sao chép nguyên baseline giả định và gọi là cập nhật. Nếu rủi ro chưa xảy ra, có thể ghi kết quả theo dõi có nguồn, giữ Open/Monitoring và nêu phần chưa biết.

## 7. Retrospective và thay đổi

Đính kèm retro Sprint 1 và review Sprint 2: điều hiệu quả, trở ngại cụ thể, nguyên nhân kiểm chứng được, một hành động cải thiện có owner/hạn, kết quả sau áp dụng. [Change log](change-log.md) đã ghi REQ-UPDATE-01 (bổ sung điều kiện nộp) và REQ-UPDATE-02 (nhóm trưởng xác nhận hạn trước 16/11 cho cả 5 báo cáo và sản phẩm), dẫn tới dự thảo v0.3. Hạn đã rõ; scope rút gọn/estimate/phân vai còn chờ nhóm/PO chốt. Đây là cập nhật yêu cầu thật, chưa tự chứng minh một thay đổi baseline đã được phê duyệt hoặc đã đáp ứng đầy đủ tiêu chí scope change của thầy.

## 8. Kế hoạch phục hồi / dự báo tới hạn 15/11

| Hành động sau health check | Owner | Hạn | Kết quả cần đạt | Nguồn quyết định |
|---|---|---|---|---|

Sau khi có dữ liệu: cộng effort còn lại theo người/phụ thuộc; so với năng lực thực tế còn lại 09–15/11, gồm thời gian hoàn thiện hồ sơ và nộp trong ngày 15/11. Chỉ nói “khả thi theo ước lượng hiện tại” khi các việc chặn có cách xử lý. Nếu vượt khả năng, giảm phạm vi có xác nhận hoặc điều chỉnh lịch; ghi tác động lên M1, WBS, backlog và test.

Bản v0.3 đề xuất scope rút gọn 119 giờ việc trong hai tuần, trên giả định năng lực tổng 150 giờ; chưa dùng con số này làm effort đã thực hiện. Xem lại phần việc còn lại theo từng người và thời gian họp/review/phát sinh. Không giảm bằng cách bỏ đầu ra bắt buộc như HTTPS, chữ ký hoặc 5 báo cáo mà không có xác nhận từ thầy.

## 9. Điều kiện M3 đủ để review/nộp

- [ ] Có ngày cutoff, người thực hiện và baseline dùng để so sánh.
- [ ] Mỗi kết luận có issue/PR/test/demo hoặc biên bản tương ứng.
- [ ] Dashboard không biến dữ liệu thiếu thành Xanh hoặc 0.
- [ ] Có số liệu thực thi và diễn giải chênh lệch.
- [ ] Risk update phản ánh những gì đã thực sự quan sát sau sprint.
- [ ] Có retro và hành động cải thiện; change record nếu đã xảy ra thay đổi.
- [ ] Có forecast/plan tiếp theo và người chịu trách nhiệm.
- [ ] TV1 cùng ít nhất một reviewer khác xác nhận; ghi rõ approval nào còn chờ.
