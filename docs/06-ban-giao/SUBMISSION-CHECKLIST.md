# Danh mục nộp Google Drive — 5 báo cáo và điều kiện tiên quyết

**Cập nhật 02/11/2026 theo [thông tin mới từ thầy](references/instructor-supplement-2026-11-02.md).** **Hạn đã xác nhận: trước thứ Hai 16/11 cho cả 5 báo cáo và sản phẩm HTTPS/APK; mục tiêu nội bộ 20:00 Chủ nhật 15/11.** Đây là checklist chuẩn bị; nhóm trưởng đã cung cấp [URL Drive](https://drive.google.com/drive/folders/1P5aijR1ziB6zht_VFqdKc1HxFYgIC1w6?usp=sharing) ngày 03/11, chưa xác minh cấu trúc/quyền; chưa có bản triển khai HTTPS, chữ ký hoặc bộ báo cáo nộp được xác nhận. File Markdown trong workspace không đồng nghĩa đã có bài hoàn chỉnh trên Drive.

## 1. M1–M3 nội bộ và Báo cáo 1–5 phải nộp

| Mục nộp | Nguồn trong bộ hiện tại | Cần có để đánh dấu hoàn thành | Owner / reviewer | Trạng thái hiện biết |
|---|---|---|---|---|
| **BC1 — Project Charter** | [M1](docs/01-khoi-tao/M1-project-charter-stakeholder.md) | Đủ 13 mục, dữ liệu thật; **chữ ký PO/Stakeholder và GV**, phần nhóm trưởng theo template; bản đã ký mở được trên Drive | TV1 / TV2 kiểm tra nội dung; người ký xác nhận thật | Draft, chưa ký, chưa xác nhận đã lên Drive |
| **BC2 — WBS & Dictionary** | [M2](docs/02-lap-ke-hoach/M2-wbs-sprint-1.md) | Cây sản phẩm, 100% scope, mọi work package 1–2 tuần; dictionary có owner, estimate, phụ thuộc, nghiệm thu; bản nhóm thống nhất trên Drive | TV2 / TV1 | Draft, chưa khóa baseline |
| **BC3 — Dynamic Risk Register & 3-Step Matrix** | [Risk register](docs/02-lap-ke-hoach/risk-register.md); M3 hỗ trợ tổng hợp | Baseline và **hai đợt cập nhật thực tế sau Sprint 1/Sprint 2**, matrix ba bước, diễn biến và evidence; bản tổng hợp cùng snapshot trên Drive | TV5 / TV1 | Chỉ có baseline nhận diện và khung, chưa có hai đợt thực thi |
| **BC4 — Final Report & Evidence Package** | [Khung BC4](docs/06-ban-giao/BC4-final-report-outline.md), [evidence index](docs/05-giam-sat/evidence-index.md) | PDF **15–25 trang**, kể lại việc đã làm ở thì quá khứ, có kết quả/hạn chế thật; checklist và liên kết bằng chứng kiểm toán | TV1 tổng hợp; mỗi người viết phần mình / TV5 đối chiếu | Khung chuẩn bị, chưa phải PDF cuối kỳ |
| **BC5 — Defense Slides & Rubric** | [Khung BC5](docs/06-ban-giao/BC5-defense-slides-rubric.md) | **8–10 slides**, bản tự đánh giá theo rubric có dẫn chứng, link demo thực tế; mở được trong Drive | TV4 biên tập, cả nhóm thuyết trình / TV1, TV5 | Khung 10 slide, chưa có deck hoàn chỉnh hoặc điểm tự đánh giá |

**M3 Health Check không tự thay thế BC3**: BC3 lấy risk register động, ba bước và hai lần cập nhật làm trọng tâm. M3 là báo cáo nội bộ về sức khỏe dự án, có thể trích vào BC4. Khi nộp, dùng tên BC1–BC5 để khớp danh mục thầy, giữ tên M1–M3 cho quản trị nội bộ nếu thuận tiện.

## 2. Authenticity gate — phải kiểm tra riêng

| Điều kiện | Bằng chứng cần có | Tình trạng hiện biết / việc cần làm |
|---|---|---|
| Dự án phần mềm thật, repo thật | Repo source và quản trị, stakeholder, sản phẩm chạy, commit/PR theo tiến trình | Repo quản trị có thật; sản phẩm và stakeholder chưa được xác minh đầy đủ |
| Commit trải đều học kỳ; không dump cuối kỳ | Lịch sử Git thật qua thời gian, PR/issue/board liên quan | Có 5 commit quan sát ngày 01/11, **chưa đủ để kết luận đạt yêu cầu trải đều học kỳ**; giữ lịch sử và làm/commit thật từ hiện tại |
| Bản chạy thực tế HTTPS **hoặc** APK | Link HTTPS hoạt động cho người ngoài nhóm, cả UI/API/dữ liệu; hoặc APK tải/cài/chạy được nếu chọn hướng đó | MVP web chọn hướng HTTPS; **local, ảnh, video hoặc mock đơn thuần không thay thế điều kiện này** |
| Drive Anyone with the link can view | Link thư mục và file mở bằng phiên không đăng nhập/tài khoản ngoài nhóm | Đã có URL do TV1 cung cấp ngày 03/11; chưa kiểm tra quyền/các file, TV5 xác minh |

Lịch tháng 11 không tự bù được lịch sử cả học kỳ. Không đổi ngày commit, làm giả hoạt động trước đây hoặc chia một đợt upload thành nhiều commit nhằm giả lịch sử. TV1 cần trình bày tiến độ thực tế với thầy và xin hướng xử lý khoảng trống; chưa được tự ghi gate Pass.

Một ứng dụng HTTPS có đăng nhập nghiệp vụ vẫn có thể là sản phẩm công khai truy cập được: cung cấp cách dùng tài khoản demo quyền thấp để hội đồng thử. Đừng để cổng hạ tầng yêu cầu tài khoản nhà cung cấp của nhóm mới mở được ứng dụng. Không mở công khai dữ liệu cá nhân thật để chứng minh “public”.

## 3. Cấu trúc Drive đề xuất

```text
School-Lost-Found_TenNhom/
├── 00-INDEX.pdf hoặc Google Doc          # link repo, Project, HTTPS, 5 báo cáo
├── 01-Project-Charter/
│   └── BC1-Charter-Signed-vX.pdf
├── 02-WBS-Dictionary/
│   └── BC2-WBS-Dictionary-vX.pdf
├── 03-Dynamic-Risk-Register/
│   ├── BC3-Risk-Register-3Step-vX.pdf
│   ├── risk-baseline-NGAYTHAT.pdf
│   ├── risk-update-1-NGAYTHAT.pdf
│   └── risk-update-2-NGAYTHAT.pdf
├── 04-Final-Report-Evidence/
│   ├── BC4-Final-Report-vX.pdf           # 15–25 trang
│   ├── Evidence-Checklist-vX.pdf
│   └── evidence/                       # snapshots, test, retro, change, AI, acceptance
└── 05-Defense-Rubric/
    ├── BC5-Defense-vX.pdf               # 8–10 slide, có thể kèm bản Slides/PPTX
    └── BC5-Self-Assessment-vX.pdf
```

Đây là tên dự kiến, chưa có các file đã ký hoặc bản PDF nộp. Google Sheet có thể dùng để xem risk register động; vẫn giữ snapshot theo ngày và liên kết phiên bản trên GitHub. Thông báo chỉ bắt buộc BC4 là PDF, nên PDF ở các mục khác là cách đóng gói đề xuất, không gán thành quy định mới của thầy.

GitHub là nơi nguồn tài liệu, source và lịch sử review; **Drive là nơi nộp bắt buộc**. GitHub Release có thể lưu thêm bản phát hành, không thay thế Drive. Tránh nộp một ZIP duy nhất khiến thầy phải giải nén mới thấy đủ năm báo cáo.

## 4. Mở quyền và kiểm tra

TV1 chọn thư mục → Share/Chia sẻ → General access/Quyền truy cập chung → **Anyone with the link** → **Viewer/Người xem**, lưu và copy link. Mời thành viên chỉnh sửa riêng bằng tài khoản cụ thể. Tài khoản trường có thể bị quản trị viên hạn chế chia sẻ ngoài trường; nếu không chọn được, cần dùng phương án tài khoản/quyền được cho phép và bảo đảm người ngoài vẫn mở được. [Hướng dẫn Google Drive](https://support.google.com/drive/answer/7166529?hl=en).

TV5 mở link trong cửa sổ riêng tư không đăng nhập, mở từng BC1–BC5 và các evidence liên kết. Ghi ngày/người kiểm tra/kết quả; chụp cấu hình quyền và lần mở thử nếu hữu ích. Thư mục mở được nhưng một file con/link ngoài bị khóa thì chưa đạt kiểm tra truy cập đầu cuối.

Trong gói nộp chỉ để thông tin cần thiết; chữ ký cần thiết theo yêu cầu thầy phải là chữ ký thật theo hình thức được chấp nhận. Không tự tạo chữ ký, không công khai tài liệu định danh/thông tin liên lạc riêng không phục vụ việc nộp.

## 5. Lịch nội bộ và người chịu trách nhiệm

| Ngày dự kiến | Việc | Owner |
|---|---|---|
| 02–03/11 | Tạo Drive, phân thư mục/quyền; xác định PO/Stakeholder và đặt lịch ký Charter với PO/GV | TV1; TV5 kiểm tra quyền |
| 04–05/11 | BC2 baseline 04/11; mục tiêu BC1 đủ chữ ký 05/11 | TV1/TV2 |
| 08/11 | Risk Update #1 sau Sprint 1 nội bộ; thử lát cắt chạy qua HTTPS | TV5 / TV2 |
| 09/11 | M3 giữa kỳ dùng số liệu hết 08/11; ưu tiên tuần cuối | TV5 |
| Hết 12/11 | Khóa thêm tính năng, chuyển sang sửa lỗi/nghiệm thu | Cả nhóm |
| 13–14/11 | UAT, nghiệm thu, BC4 nháp 15–25 trang, slide 8–10 và diễn tập | Cả nhóm |
| Sáng 15/11 | Risk Update #2 sau Sprint 2, đối chiếu lần 1; chốt BC3 và dữ liệu cho BC4 | TV5 / cả nhóm |
| 15/11 | 16:00 PDF cuối, 18:00 audit, mục tiêu nộp 20:00; không để sang 16/11 | TV1/TV5, cả nhóm hỗ trợ |

Week 6/11 là chú thích tuần học theo người dùng xác nhận; 08/11 và 15/11 là **ngày nhóm đề xuất**, không phải hạn thầy mới công bố. Lưu đúng ngày hai sprint thực tế diễn ra; nếu lịch thay đổi thì cập nhật, không ghi lùi ngày.

## 6. Trước khi tích mục 16 trong biểu mẫu

- [ ] BC1 đủ 13 mục và chữ ký bắt buộc, file đúng phiên bản đã có trên Drive.
- [ ] BC2 có WBS/Dictionary, 100% Rule và work package 1–2 tuần, file đã có trên Drive.
- [ ] BC3 có matrix và **hai đợt cập nhật thật**, file/snapshot đã có trên Drive.
- [ ] BC4 là PDF 15–25 trang mô tả thực tế đã làm và có evidence checklist trên Drive.
- [ ] BC5 là deck 8–10 slide cùng tự đánh giá rubric có căn cứ trên Drive.
- [ ] Drive và các file mở được ở chế độ không đăng nhập.
- [ ] Sản phẩm HTTPS hoặc APK chạy được ngoài môi trường máy tác giả.
- [ ] Lịch sử thực thi được kiểm tra; thiếu sót được báo đúng, không tự chứng nhận đã đạt gate.

Chỉ chọn những báo cáo **đã hoàn thành và đã đưa vào Drive**. Không tích tất cả vì đã có khung Markdown. Nếu form yêu cầu đủ mới nộp, hoàn thiện điều kiện trước khi gửi; không đánh dấu sai trạng thái.
