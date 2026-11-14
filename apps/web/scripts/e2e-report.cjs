const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { stripVTControlCharacters } = require('node:util');
const cell = value => String(value || '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
const link = value => value.split(path.sep).map(encodeURIComponent).join('/');

function writeReport(results, cases, root) {
  const dir = path.join(root, 'docs/05-giam-sat/cypress');
  fs.mkdirSync(dir, { recursive: true });
  const runs = results.runs || [];
  const screenshots = runs.flatMap(run => run.screenshots || []).map(screenshot => ({
    file: path.relative(dir, screenshot.path),
    id: path.basename(screenshot.path).match(/[A-Z]+-\d+/)?.[0] || '',
  }));
  const tests = runs.flatMap(run => (run.tests || []).map(test => {
    const title = test.title.join(' > ');
    const id = title.match(/[A-Z]+-\d+/)?.[0] || title;
    return { ...cases[id], id, title: cases[id]?.title || title, spec: run.spec.relative,
      state: test.state, duration: test.attempts?.reduce((sum, attempt) => sum + (attempt.wallClockDuration || 0), 0) || 0,
      error: stripVTControlCharacters(test.displayError || ''),
      screenshots: screenshots.filter(screenshot => screenshot.id === id).map(screenshot => screenshot.file) };
  }));
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const time = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Asia/Bangkok' }).format(new Date(results.endedTestsAt || Date.now()));
  const summary = { startedAt: results.startedTestsAt, endedAt: results.endedTestsAt, timezone: 'Asia/Bangkok', commit,
    browser: `${results.browserName} ${results.browserVersion}`, cypress: results.cypressVersion, node: process.version,
    total: tests.length, passed: tests.filter(test => test.state === 'passed').length,
    failed: tests.filter(test => test.state === 'failed').length,
    skipped: tests.filter(test => !['passed', 'failed'].includes(test.state)).length,
    screenshotCount: screenshots.length };
  fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify({ summary, tests }, null, 2) + '\n');
  const rows = tests.map(test => `| ${test.id} | ${cell(test.title)} | ${cell(test.steps)} | ${cell(test.expected)} | **${test.state.toUpperCase()}** | ${test.screenshots.map((file, index) => `[Ảnh ${index + 1}](${link(file)})`).join(' · ') || 'Không có'} |`);
  const failures = tests.filter(test => test.state === 'failed').map(test => `### ${test.id} — ${test.title}\n\n- Bước thực hiện: ${test.steps}\n- Kỳ vọng: ${test.expected}\n- Spec: \`${test.spec}\`\n\n\`\`\`text\n${test.error}\n\`\`\`\n`).join('\n');
  fs.writeFileSync(path.join(dir, 'bao-cao-test-case.md'), `# Báo cáo kiểm thử Cypress — School Lost & Found\n\nThời điểm hoàn tất: **${time}**.\n\n## 1. Kết quả thực thi\n\n| Tổng ca | Đạt | Lỗi | Bỏ qua/chưa chạy | Ảnh |\n|---:|---:|---:|---:|---:|\n| ${summary.total} | ${summary.passed} | ${summary.failed} | ${summary.skipped} | ${summary.screenshotCount} |\n\n- Commit ứng dụng: \`${commit}\`; bộ test là thay đổi đang làm trong workspace.\n- Trình duyệt: **${summary.browser}**; Cypress **${summary.cypress}**.\n- Frontend React/Vite: \`http://127.0.0.1:5173\`; Express thật: \`http://127.0.0.1:5000\`.\n- PostgreSQL 16 trong Docker riêng, dùng DDL \`database/schema.sql\`, nạp \`database/seed.sql\` rồi thay dữ liệu cá nhân bằng dữ liệu Cypress; reset trước mỗi ca.\n- Không stub API nghiệp vụ. Chỉ ca giao diện lỗi mạng dùng intercept lỗi có chủ đích; trang evidence API là tài liệu hiển thị request thật.\n- Screenshot chụp sau mỗi ca; ca lỗi có thể có thêm ảnh tự động tại thời điểm thất bại. Trạng thái được lấy từ Cypress, không suy ra từ ảnh.\n\n## 2. Danh sách test case\n\n| Mã | Chức năng | Bước kiểm thử | Kết quả mong đợi | Thực tế | Bằng chứng |\n|---|---|---|---|---|---|\n${rows.join('\n')}\n\n## 3. Các ca lỗi cần xử lý\n\n${failures || 'Không có ca lỗi trong lần chạy này.\n'}\n## 4. Phạm vi và giới hạn\n\nBộ test bao phủ các nhóm chức năng đang có: xác thực, tin đăng, tìm kiếm, ảnh, claim, quyền đọc bằng chứng, kiểm duyệt, bàn giao, người dùng, danh mục, dashboard và audit. Xem [hướng dẫn và ma trận phạm vi](../../../apps/web/cypress/README.md). Đây là kết quả của các kịch bản liệt kê, không phải chứng minh mọi tổ hợp đầu vào đều đúng.\n\n- Chạy local HTTP, chưa xác nhận Supabase triển khai, HTTPS, cấu hình production, thiết bị thật hoặc trình duyệt khác.\n- Chưa chạy UAT với người dùng đại diện, kiểm thử tải, đánh giá accessibility đầy đủ, CI từ máy thứ hai hoặc quyền xem bộ hồ sơ Drive. Các mục TC12/TC14/TC15/TC16 trong LF-17 còn cần bằng chứng riêng.\n- Mobile dùng viewport giả lập trong Chrome.\n- Trạng thái bàn giao hiện tại của code là \`ACCEPTED\` / \`CLOSED\`; LF-17 mô tả \`completed\` / \`returned\`, cần thống nhất hợp đồng nghiệm thu.\n\n## 5. Tệp đính kèm\n\n- [Danh sách screenshot](danh-sach-screenshot.md)\n- [Kết quả máy đọc được](results.json)\n- [Hướng dẫn chạy lại](../../../apps/web/cypress/README.md)\n`);
  fs.writeFileSync(path.join(dir, 'danh-sach-screenshot.md'), `# Danh sách ảnh kiểm thử Cypress\n\nThời điểm: ${time}. Tổng **${screenshots.length} ảnh**. Ảnh API hiển thị phản hồi backend thật; ảnh UI chụp trực tiếp ứng dụng. Dữ liệu trong ảnh là dữ liệu kiểm thử.\n\n| Test case | Kết quả | Ảnh |\n|---|---|---|\n${tests.flatMap(test => test.screenshots.map(file => `| ${test.id} — ${cell(test.title)} | ${test.state.toUpperCase()} | [${cell(path.basename(file))}](${link(file)}) |`)).join('\n')}\n`);
  console.log(`\nReport: ${path.join(dir, 'bao-cao-test-case.md')}\n${summary.passed}/${summary.total} passed; ${summary.failed} failed; ${screenshots.length} screenshots.`);
}
module.exports = { writeReport };
