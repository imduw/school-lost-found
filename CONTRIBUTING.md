# Quy trình làm việc nhóm — School Lost & Found

Team 5 người, repo này chứa **tài liệu quản trị dự án** (WBS, backlog, thiết kế, báo cáo giám sát...), không phải source code sản phẩm. Quy trình dưới đây giúp tránh đè file/commit lên nhau.

## 1. Cài hook (chỉ làm 1 lần sau khi clone)

```bash
git clone <repo-url>
cd school-lost-found
bash setup-hooks.sh
```

Lệnh này bật `.githooks/` cho repo của bạn: mọi commit/push sau đó đều được kiểm tra tự động.

## 2. Quy trình cho mỗi task

1. Vào **GitHub Project** (board) → tạo/chọn card ở cột `Todo`, kéo sang `In Progress`.
2. Tạo nhánh riêng, đặt tên theo mẫu `feature/<mo-ta-ngan>`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/wbs-giai-doan-2
   ```
3. Chỉnh sửa file trong `docs/` hoặc `meeting-notes/`.
4. Commit theo đúng format (hook `commit-msg` sẽ chặn nếu sai):
   ```
   [Planning] docs: bo sung WBS cho giai doan lap ke hoach
   ```
5. Push nhánh và mở Pull Request, điền theo template có sẵn, ghi `Closes #<số issue>`.
6. Một thành viên khác review → merge vào `main`.
7. Issue tự đóng, card trên board tự chuyển sang `Done`.

## 3. Quy ước commit message

```
[GiaiDoan] loai: mo ta (toi thieu 10 ky tu)
```

- **GiaiDoan**: `Init` `Planning` `Requirements` `Design` `Execution` `Monitoring` `Closing`
- **loai**: `feat` (nội dung mới) `docs` (tài liệu) `fix` (sửa lỗi nội dung) `chore` (việc vặt) `refactor` (tổ chức lại) `test` `wip` (đang làm dở)

## 4. Tránh đè file lên nhau

- **Không commit thẳng vào `main`** — hook `pre-commit` sẽ chặn.
- Mỗi người chỉ sửa trong thư mục mình phụ trách (xem `.github/CODEOWNERS`); nếu cần sửa khu vực người khác, tag họ review trong PR.
- Luôn `git pull --rebase origin main` trước khi bắt đầu task mới.
- Hook `pre-push` sẽ chặn push vào `main`/`master` nếu local đang bị lùi so với remote.

## 5. Cấu trúc thư mục

```
docs/
├── 01-khoi-tao/        # Project charter, stakeholder analysis
├── 02-lap-ke-hoach/    # WBS, schedule, risk register
├── 03-yeu-cau/         # Backlog, user stories
├── 04-thiet-ke/        # System design
└── 05-giam-sat/        # Sprint report, tiến độ theo giai đoạn
meeting-notes/          # Biên bản họp, mỗi buổi 1 file
```
