# AGENTS.md

Hướng dẫn cho AI agent (Claude Code, Gemini CLI, Cursor, Copilot...) khi làm việc trong repo này.

## Bối cảnh dự án

Đây là repo cho môn **Quản trị dự án phần mềm**, đề tài **"School Lost & Found"** (tìm kiếm đồ thất lạc trong trường học). Repo này **không chứa source code sản phẩm hoàn chỉnh** — nội dung chính là tài liệu quản trị dự án: project charter, WBS, backlog, thiết kế, báo cáo giám sát theo từng giai đoạn. Không tự ý khởi tạo source code ứng dụng (React/Node/...) trừ khi được yêu cầu rõ ràng.

## Cấu trúc thư mục

```
docs/01-khoi-tao/      Project charter, stakeholder analysis
docs/02-lap-ke-hoach/  WBS, schedule, risk register
docs/03-yeu-cau/       Backlog, user stories
docs/04-thiet-ke/      System design
docs/05-giam-sat/      Báo cáo tiến độ theo sprint/giai đoạn
meeting-notes/         Biên bản họp (mỗi buổi 1 file, đặt tên YYYY-MM-DD-chu-de.md)
.githooks/             Git hooks dùng chung cho team (commit-msg, pre-commit, pre-push)
```

## Quy ước commit (bắt buộc — có hook chặn)

```
[GiaiDoan] loai: mo ta (toi thieu 10 ky tu)
```
- GiaiDoan: `Init | Planning | Requirements | Design | Execution | Monitoring | Closing`
- loai: `feat | docs | fix | chore | refactor | test | wip`

Khi agent tạo commit hộ người dùng, LUÔN theo đúng format trên, không tự ý rút gọn.

## Quy tắc khi chỉnh sửa

- Không commit thẳng vào `main`/`master` — tạo nhánh `feature/<mo-ta>` trước.
- Không sửa file ngoài phạm vi được giao (xem `.github/CODEOWNERS`) trừ khi được yêu cầu.
- Không xoá/đổi format hook trong `.githooks/` trừ khi người dùng yêu cầu rõ ràng.
- Khi tạo tài liệu mới, bám theo cấu trúc và văn phong các file hiện có trong cùng thư mục `docs/`.
- Ưu tiên nhiều commit nhỏ theo tiến trình (draft → revise → final) hơn 1 commit lớn gộp hết.

## Ngôn ngữ

Tài liệu và commit message trong repo này chủ yếu viết bằng tiếng Việt. Agent nên trả lời và soạn nội dung bằng tiếng Việt trừ khi người dùng yêu cầu khác.
