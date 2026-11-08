# Risk Register — School Lost & Found

**Snapshot LF-17 v0.1 ghi ngày 05/11/2026 (UTC+7), chờ TV3 review.** Giữ 12 mục RSK01–RSK12 và 3-Step Matrix làm baseline đề xuất. Các điểm P×I, trigger và response dưới đây là đánh giá/kế hoạch. Mốc 03–04/11 đã qua tại thời điểm ghi snapshot, cần xác minh thực tế khi rà lại. LF-05 đã đóng trên GitHub, còn cần liên kết quyết định stack và bằng chứng smoke test trước khi đánh giá lại RSK02/RSK08. Xem [kế hoạch kiểm thử LF-17](../03-yeu-cau/LF-17-test-plan.md) để thu evidence theo ca. Kết quả phản ứng và thay đổi điểm sẽ được ghi vào log sau khi có nguồn kiểm chứng.

**Baseline đề xuất:** khởi tạo 01/11, v0.3 cập nhật hạn trước 16/11 ngày 02/11/2026; chưa khóa. **Điều phối:** TV5; TV1 quyết định ảnh hưởng phạm vi/lịch.  
Chưa có Sprint 1 đã thực thi. Bảng đầu là nhận diện ban đầu; không gọi đây là “Risk Update sau Sprint 1”.

Đây là nguồn cho **BC3 — Dynamic Risk Register & 3-Step Matrix**. BC3 cần hai bản cập nhật sau Sprint 1 và Sprint 2 thực tế. Nhóm dự kiến review cuối Sprint 1 ngày 08/11 và review Sprint 2 sáng 15/11; Week 6/11 là chú thích tuần học theo nhóm trưởng, không thay ngày thực thi. M3 giữa kỳ ngày 09/11 dùng số liệu hết 08/11. Chốt BC3 trước 12:00 ngày 15/11 để đưa kết quả vào BC4.

P (xác suất): 1 thấp, 2 trung bình, 3 cao. I (tác động): 1 nhỏ, 2 ảnh hưởng một phần sprint, 3 đe dọa luồng chính/nghiệm thu/hạn trước 16/11. Điểm P×I: 1–2 thấp, 3–4 vừa, 6–9 cao; là đánh giá định tính, không phải xác suất đo được.

## 1. Bản nhận diện ban đầu

| ID | Rủi ro: nguyên nhân → sự kiện → ảnh hưởng | P | I | Điểm | Chiến lược / phòng ngừa | Trigger và phương án khi xảy ra | Owner / hạn rà soát | Trạng thái |
|---|---|---:|---:|---:|---|---|---|---|
| RSK01 | Chưa có đại diện nghiệp vụ → không xác minh nhu cầu/nghiệm thu → thiếu tính xác thực theo rubric | 3 | 3 | 9 | Mitigate: liên hệ đầu tuần, ghi câu hỏi và lời mời, tìm người đang xử lý đồ thật | Tới 04/11 chưa có người đồng ý: TV1 trao đổi với thầy về đối tượng phù hợp; giữ phần approval chưa hoàn tất | TV1 / 04/11 | Open; đã biết thiếu thông tin, chưa kết luận đã thất bại tuyển người |
| RSK02 | Chưa biết kỹ năng/stack → setup và tích hợp kéo dài → demo trễ | 3 | 3 | 9 | Mitigate: khảo sát kỹ năng, spike ngắn và người thứ hai chạy lại; dùng stack quen | Hết 03/11 chưa đọc/ghi được dữ liệu: đổi phương án hoặc giảm lát cắt Sprint 1, ghi quyết định | TV2 / 03/11 | Open; stack chưa quyết định là tình trạng hiện tại |
| RSK03 | Chưa chốt giờ làm và có thêm đầu ra bắt buộc → nhận quá sức → tồn việc trước hạn 16/11 | 3 | 3 | 9 | Avoid/Mitigate: rà 119 giờ việc / 150 giờ năng lực hai tuần giả định; chú ý TV2/TV3 có 16 giờ việc tuần đầu chưa tính họp/review; hoãn ảnh/AI/chat/mobile; ưu tiên gate | Vượt năng lực hoặc chặn >24 giờ: phân lại người, giảm phần không bắt buộc; không tự bỏ HTTPS/chữ ký/báo cáo theo yêu cầu thầy | TV1 / 02–03/11, review 09/11 | Open; ước lượng mới chưa được nhóm chốt |
| RSK04 | Frontend/backend hiểu khác schema → API không khớp → tốn thời gian nối và sửa | 2 | 3 | 6 | Mitigate: chốt request/response và mẫu lỗi trước code; kiểm tra tích hợp sớm | Tới 07/11 form tối thiểu không đọc/ghi API thật: TV2 ghép TV3/TV4 xử lý hợp đồng trước mở thêm feature | TV2 / 07/11 | Open |
| RSK05 | Thiếu kiểm tra quyền → người khác xem proof/sửa tin → mất an toàn và không đạt nghiệm thu | 2 | 3 | 6 | Mitigate: quyền phía server, dữ liệu giả cho demo, test đổi ID và vai trò | Một test quyền Fail: chặn phát hành bản đó, sửa và retest trước demo dữ liệu thật | TV3 / 08/11, 13–14/11 | Open |
| RSK06 | Xử lý claim không nhất quán → hai yêu cầu cùng được ghi nhận bàn giao → sai nghiệp vụ | 2 | 3 | 6 | Mitigate: ràng buộc dữ liệu và thao tác nguyên tử phù hợp stack; test lặp/đồng thời | TC08/TC09 Fail: chưa Done R05, TV3 sửa trước UAT | TV3 / 10/11; retest 13–14/11 | Open |
| RSK07 | Chỉ tổng hợp tài liệu vào ngày nộp → mất lịch sử board/risk/AI → thiếu bằng chứng thực hiện | 3 | 3 | 9 | Mitigate: snapshot theo ngày, link PR, metrics, risk version và AI log có kiểm chứng | Cuối sprint thiếu nguồn số liệu: ghi N/A, truy lại timeline có thật; không điền giả hoặc lùi ngày commit | TV5 / 08/11 rồi hằng tuần | Open |
| RSK08 | Chọn stack/môi trường chưa deploy được → HTTPS chỉ có UI hoặc không lưu dữ liệu → không đạt gate sản phẩm chạy thật | 3 | 3 | 9 | Mitigate: chọn phương án UI/API/CSDL sớm, deploy nền/API ở LF-07, tích hợp UI LF-14, chốt bản MVP ở LF-09, test ngoài máy tác giả | 08/11 chưa có HTTPS chạy được: tạo blocker và ưu tiên deploy; đến bàn giao chưa có thì chưa đạt gate, local/video chỉ dự phòng | TV2 / 07–08/11, 13/11 | Open |
| RSK09 | Chưa có định nghĩa chính thức của 3-Step Matrix/hình thức chữ ký → đóng gói sai → phải sửa hồ sơ | 2 | 3 | 6 | Mitigate: đối chiếu thông báo mới, ghi phần đã rõ; dùng matrix tạm có nhãn; xác minh phần còn thiếu | Trước nộp vẫn chưa rõ: TV1 xác minh cụ thể với thầy; không gán mẫu tự diễn giải là mẫu chính thức | TV1 / 04/11 rồi trước nộp | Open; hạn trước 16/11 cho cả 5 báo cáo và HTTPS/APK đã được xác nhận |
| RSK10 | Drive/tệp con hạn chế quyền → hội đồng không mở được → không đạt điều kiện nộp | 2 | 3 | 6 | Mitigate: Anyone with the link / Viewer; kiểm tra cả thư mục/file từ phiên không đăng nhập | Một link yêu cầu cấp quyền: TV1 sửa chia sẻ theo quyền tài khoản rồi TV5 thử lại trước gửi form | TV1 / 03/11, 15/11 | Open |
| RSK11 | Chưa xác định PO hoặc lịch ký GV → Charter thiếu chữ ký → BC1 chưa hoàn thành | 3 | 3 | 9 | Mitigate: liên hệ/hẹn sớm, gửi đúng phiên bản đủ dữ liệu, theo dõi từng người ký | Tới 05/11 thiếu chữ ký: giữ BC1 mở, ghi blocker và hẹn mới; không dùng tên đánh máy/PR approval thay | TV1 / 03–05/11 | Open |
| RSK12 | Lịch sử hoạt động trước tháng 11 còn ít → không chứng minh commit trải đều học kỳ → chưa đạt authenticity gate | 3 | 3 | 9 | Mitigate: kiểm tra toàn lịch sử thật và thông tin nhóm; trao đổi thầy về khoảng trống; làm/commit đều từ hiện tại | Không có bằng chứng đủ kỳ: báo đúng giới hạn, xin hướng xử lý; không lùi ngày hay tạo commit giả | TV1 / 03/11 và trước nộp | Open; chưa kết luận đạt hoặc được miễn yêu cầu |

## 2. Những vấn đề hiện tại cần xử lý ngay

Risk là điều có thể xảy ra; issue là điều đang tồn tại. Không biến việc thiếu baseline hoặc stack thành một “sự cố Sprint 1” trước khi sprint bắt đầu.

| ID | Vấn đề đã biết ngày 01–02/11 | Nguồn | Hành động / owner |
|---|---|---|---|
| OBS01 | Nhóm chưa có phân vai theo năng lực hoặc stack | Người dùng xác nhận | Kickoff + spike; TV1/TV2 |
| OBS02 | Repo chưa có issue, milestone, Actions; main chưa protected tại lần kiểm tra 01/11 | [Snapshot API 01/11](../../references/repository-observation-2026-11-01.json) | Cấu hình repo/board; LF-05, LF-07 |
| OBS03 | CODEOWNERS có username mẫu | File hiện tại ở commit đã ghi | Thay tên thật sau khi biết danh tính; LF-05 |
| OBS04 | Chưa có phản hồi stakeholder hoặc dữ liệu thực thi được cung cấp | Thông tin hiện có | Liên hệ và ghi chứng cứ từ tuần đầu; LF-01, LF-18 |
| OBS05 | Nhận thông báo bổ sung 5 báo cáo/HTTPS/Drive/chữ ký và làm rõ Week 6/11 là chú thích tuần học | [Trích dẫn ngày 02/11](../../references/instructor-supplement-2026-11-02.md) | Đã tiếp nhận trong dự thảo v0.2; nay v0.3 kế thừa, chưa có nhóm phê duyệt; [REQ-UPDATE-01](../05-giam-sat/change-log.md) |
| OBS06 | Nhóm trưởng xác nhận trước 16/11 phải hoàn tất cả 5 báo cáo và sản phẩm HTTPS/APK | [Xác nhận hạn](../../references/deadline-update-2026-11-02.md) | Soạn lại v0.3, đề xuất scope rút gọn và 21 thẻ LF; TV1/TV2 chốt với nhóm/PO, xem REQ-UPDATE-02 |

**Dữ kiện mới ngày 03/11 (chưa phải Risk Update sau sprint):** đã xác minh năm issue được giao cho năm tài khoản, và nhóm trưởng đã cung cấp link Drive trong [hồ sơ LF-01](../01-khoi-tao/LF-01-pham-vi-phan-cong-khoi-dong.md). OBS01/02 đã được giải quyết một phần về phân công/issue; stack, capacity, quyền Drive và PO còn chưa xác nhận. Chưa tự giảm điểm rủi ro khi chưa có review/căn cứ về hiệu quả xử lý.

## 3. Log cập nhật thực tế — chưa có bản ghi

Tại review 08/11 (Update #1) và sáng 15/11 (Update #2), ghi bản cập nhật thật vào bảng dưới, giữ phiên bản cũ trong Git/PR và bản snapshot trong Drive. Không chỉ đổi ngày baseline. Chuẩn bị bảng này không có nghĩa đã trải qua hai sprint.

| Ngày | Risk ID | Sự kiện/bằng chứng đã quan sát | P/I trước → sau | Phản ứng đã thực hiện | Kết quả / bằng chứng | Trạng thái mới | Việc tiếp / owner / hạn |
|---|---|---|---|---|---|---|---|

Trạng thái: Open → Monitoring / Materialized / Closed. Nếu Materialized, link issue xử lý sự cố. Closed cần bằng chứng đã hết nguyên nhân hoặc đã xử lý; giảm điểm cần giải thích. Nếu không có rủi ro nào xảy ra, ghi đúng kết quả theo dõi và hỏi thầy cách chứng minh; không tạo sự cố giả cho đủ rubric.

## 4. Checklist cho bản Risk Update #1 và #2

- [ ] Có ngày review, người tham gia, commit/PR hoặc bản snapshot.
- [ ] Mô tả việc thực sự xảy ra sau sprint, thời điểm, ảnh hưởng và phản ứng.
- [ ] Ghi cả rủi ro không xảy ra nhưng vẫn cần theo dõi, có căn cứ.
- [ ] Cập nhật P/I/status khi có lý do; giữ history.
- [ ] Thêm rủi ro mới xuất hiện từ thực thi, nếu có.
- [ ] Nếu đổi scope/lịch/nguồn lực, link [change log](../05-giam-sat/change-log.md) và người đồng ý.
- [ ] Không dùng một register giả định giống hệt ở hai lần review làm bằng chứng đã quản lý.

## 5. 3-Step Matrix — cấu trúc làm việc cần đối chiếu mẫu thầy

Thông báo nêu tên “3-Step Matrix” nhưng chưa cung cấp định nghĩa ba bước. Cấu trúc dưới đây là **đề xuất để làm việc**, chưa khẳng định là mẫu chính thức: (1) nhận diện, (2) phân tích/ưu tiên, (3) ứng phó và theo dõi. Điểm P×I chỉ thuộc bước 2, không tự thay toàn bộ matrix.

| Risk ID | Bước 1 — nhận diện: nguyên nhân, sự kiện, ảnh hưởng, nguồn | Bước 2 — phân tích: P/I/điểm, mức ưu tiên và căn cứ | Bước 3 — ứng phó/theo dõi: chiến lược, owner, trigger, hành động, kết quả |
|---|---|---|---|
| RSK01 | Chưa có đại diện nghiệp vụ; nguy cơ thiếu xác nhận/acceptance; nguồn: thông tin nhóm | 3/3/9, cao vì chưa có người nhận vai trò | Mitigate; TV1; tới 04/11 chưa có người: trao đổi thầy, giữ approval mở; kết quả chưa có |
| RSK02 | Chưa chọn stack/kỹ năng; nguy cơ setup trễ; nguồn: xác nhận nhóm trưởng | 3/3/9, cao vì chưa có spike | Mitigate; TV2; hết 03/11 chưa đọc/ghi dữ liệu: đổi phương án/giảm scope có xác nhận; kết quả chưa có |
| RSK03 | Hạn hai tuần, capacity chưa chốt; nguy cơ quá tải; nguồn: deadline và estimate | 3/3/9, cao do chỉ có 31 giờ dự phòng trên giả định 150 giờ | Avoid/Mitigate; TV1; giờ cam kết không đủ hoặc chặn >24 giờ: phân lại việc/giảm scope không bắt buộc; kết quả chưa có |
| RSK04 | API/UI không khớp; nguy cơ tích hợp trễ; nguồn: các vai trò làm song song | 2/3/6, cao do chưa kiểm thử hợp đồng | Mitigate; TV2; 07/11 form chưa đọc/ghi thật: ghép TV3/TV4 xử lý; kết quả chưa có |
| RSK05 | Thiếu kiểm tra quyền; nguy cơ lộ proof/sửa tin trái phép; nguồn: AC quyền riêng | 2/3/6, cao theo tác động dữ liệu | Mitigate; TV3; một test quyền Fail: chặn bản đó, sửa và retest; review 08/11 và 13–14/11; kết quả chưa có |
| RSK06 | Request trùng/đồng thời; nguy cơ bàn giao hai lần; nguồn: nghiệp vụ claim | 2/3/6, cao vì ảnh hưởng tính đúng đắn | Mitigate; TV3; TC08/09 Fail: giữ R05 chưa Done, xử lý nguyên tử/ràng buộc; hạn 10/11, retest 13–14/11; kết quả chưa có |
| RSK07 | Không lưu evidence khi làm; nguy cơ thiếu lịch sử; nguồn: rubric và tình trạng mới bắt đầu | 3/3/9, cao do chưa có dữ liệu thực thi | Mitigate; TV5; mỗi cuối sprint thiếu nguồn: ghi N/A, truy nguồn thật, không tạo giả; kết quả chưa có |
| RSK08 | Chưa thử deploy; nguy cơ thiếu HTTPS chạy thật; nguồn: gate sản phẩm | 3/3/9, cao vì chưa có môi trường | Mitigate; TV2; LF-07 ngày 07/11, full slice 08/11; nếu chưa có lập blocker, ưu tiên deploy; LF-09 ngày 13/11; kết quả chưa có |
| RSK09 | Chưa rõ mẫu matrix/hình thức ký; nguy cơ hồ sơ phải sửa; nguồn: thông báo chưa đủ chi tiết | 2/3/6, cao theo tác động nộp bài | Mitigate; TV1; xác minh trước 04/11 và trước nộp, ghi nhãn cấu trúc làm việc; kết quả chưa có |
| RSK10 | Drive/tệp con khóa quyền; nguy cơ không mở được hồ sơ; nguồn: yêu cầu Viewer | 2/3/6, cao theo tác động gate | Mitigate; TV1, TV5 kiểm tra; ngày 03/11 và 15/11 thử không đăng nhập, link lỗi phải sửa; kết quả chưa có |
| RSK11 | Chưa có PO/lịch ký GV; nguy cơ thiếu chữ ký BC1; nguồn: M1 còn nháp | 3/3/9, cao do phụ thuộc bên ngoài | Mitigate; TV1; 05/11 chưa đủ chữ ký: giữ việc mở, hẹn lại và báo blocker; kết quả chưa có |
| RSK12 | Lịch sử trước tháng 11 còn ít; nguy cơ không đạt commit trải đều học kỳ; nguồn: snapshot repo và xác nhận nhóm | 3/3/9, cao; chưa kiểm chứng toàn bộ lịch sử học kỳ | Mitigate; TV1; rà lịch sử thật/trao đổi thầy 03/11, nêu khoảng trống trước nộp; không tạo lịch sử giả; kết quả chưa có |

Bảng này đã phủ 12 rủi ro ban đầu nhưng **chưa phải kết quả theo dõi thực tế**. Đối chiếu cấu trúc nếu thầy cung cấp mẫu riêng. Mỗi lần review cập nhật cả bước 2 và hành động/kết quả bước 3 bằng nguồn thật.

## 6. Phiên bản phải có trong BC3

| Phiên bản | Ngày kế hoạch / ngày thực tế | Nội dung | Trạng thái |
|---|---|---|---|
| Nhận diện baseline | Khởi tạo 01–02/11; ngày khóa sau khi nhóm chốt | Register, matrix làm việc, owner/trigger/response | Dự thảo, chưa phê duyệt |
| Update #1 sau Sprint 1 (tham chiếu Week 6) | Dự kiến 08/11; ngày thực tế chưa có | Điều xảy ra/không xảy ra, phản ứng, risk mới, score/status và bằng chứng | Chưa thực hiện |
| Update #2 sau Sprint 2 (tham chiếu Week 11) | Dự kiến sáng 15/11; ngày thực tế chưa có | So sánh với lần 1, hiệu quả phản ứng, thay đổi và việc còn lại | Chưa thực hiện |

BC3 chỉ hoàn thành khi các bản cập nhật thực tế và matrix đầy đủ đã có, được review và đưa lên Drive. M3 có thể dẫn link tới chúng nhưng không thay thế các bản này.
