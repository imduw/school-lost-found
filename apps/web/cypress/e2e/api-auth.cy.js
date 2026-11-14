import { testCase as tc, success, failure } from '../support/cases'

describe('API — xác thực và phân quyền', () => {
  tc('AUTH-01', 'Health và envelope 404', 'GET health và route không tồn tại', 'Database CONNECTED; route lạ trả 404 ROUTE_NOT_FOUND', () => {
    cy.api('GET', '/health').then(r => { success(r); expect(r.body.data.database).to.eq('CONNECTED') })
    cy.api('GET', '/not-a-route').then(r => failure(r, 404, 'ROUTE_NOT_FOUND'))
  })
  for (const [index, account, role] of [[2, 'admin', 'ADMIN'], [3, 'moderator', 'MODERATOR'], [4, 'claimant', 'USER']]) {
    tc(`AUTH-0${index}`, `Đăng nhập vai trò ${role}`, 'POST login rồi GET me và admin-check bằng JWT', 'Thông tin tài khoản đúng, không trả password; USER bị chặn admin-check', () => {
      cy.loginApi(account)
      cy.api('GET', '/auth/me', undefined, account).then(r => { success(r); expect(r.body.data.role).to.eq(role); expect(JSON.stringify(r.body)).not.to.match(/password/i) })
      cy.api('GET', '/auth/admin-check', undefined, account).then(r => role === 'USER' ? failure(r, 403) : success(r))
    })
  }
  for (const [id, title, body, status] of [
    ['05', 'Thiếu thông tin đăng nhập', {}, 400],
    ['06', 'Sai mật khẩu', { email: 'claimant@slf.test', password: 'wrong123' }, 401],
    ['07', 'Tài khoản không tồn tại', { email: 'missing@slf.test', password: 'Test@123456' }, 401],
    ['08', 'Tài khoản bị khóa', { email: 'suspended@slf.test', password: 'Test@123456' }, 403],
  ]) tc(`AUTH-${id}`, title, 'POST /auth/login với dữ liệu không hợp lệ', `HTTP ${status}, envelope lỗi`, () => cy.api('POST', '/auth/login', body).then(r => failure(r, status)))

  tc('AUTH-09', 'Đăng ký và chống tự cấp quyền ADMIN', 'Đăng ký role ADMIN, đọc me và thử đăng ký email trùng', '201 với role USER; email trùng 409', () => {
    const body = { fullName: 'Sinh viên mới', email: 'NEW@slf.test', password: 'Test@123456', role: 'ADMIN' }
    cy.api('POST', '/auth/register', body).then(r => { success(r, 201); expect(r.body.data.user.role).to.eq('USER'); expect(r.body.data.user.email).to.eq('new@slf.test') })
    cy.api('POST', '/auth/register', body).then(r => failure(r, 409, 'EMAIL_EXISTS'))
  })
  tc('AUTH-10', 'Validation đăng ký', 'Gửi thiếu họ tên, mật khẩu ngắn và email rỗng', 'Các request đều 400, không tạo user', () => {
    for (const body of [{}, { fullName: 'Test', email: 'a@slf.test', password: '123' }, { fullName: 'Test', email: ' ', password: '123456' }]) {
      cy.api('POST', '/auth/register', body).then(r => failure(r, 400))
    }
  })
  tc('AUTH-11', 'Email sai định dạng', 'Đăng ký email không có @ qua API', '400 VALIDATION_ERROR; không tạo tài khoản', () => {
    cy.api('POST', '/auth/register', { fullName: 'Test', email: 'not-an-email', password: '123456' }).then(r => failure(r, 400))
  })
  tc('AUTH-12', 'Thiếu JWT và JWT giả', 'GET me không token và gửi Bearer không hợp lệ', 'Cả hai request trả 401', () => {
    cy.api('GET', '/auth/me').then(r => failure(r, 401))
    cy.request({ url: '/api/v1/auth/me', headers: { Authorization: 'Bearer invalid-test-token' }, failOnStatusCode: false }).then(r => failure(r, 401))
  })
  tc('AUTH-13', 'Đăng xuất thu hồi phiên', 'Đăng nhập, logout rồi dùng lại JWT gọi me', 'Logout 200; JWT cũ nhận 401', () => {
    cy.loginApi('other')
    cy.api('POST', '/auth/logout', {}, 'other').then(r => success(r))
    cy.api('GET', '/auth/me', undefined, 'other').then(r => failure(r, 401))
  })
  tc('AUTH-14', 'Khóa tài khoản vô hiệu hóa phiên đang dùng', 'Đăng nhập USER, ADMIN khóa tài khoản, USER dùng JWT cũ đọc claims/my', 'API từ chối 401 hoặc 403', () => {
    cy.loginApi('claimant'); cy.loginApi('admin')
    cy.api('PATCH', '/admin/users/5/status', { status: 'SUSPENDED' }, 'admin').then(r => success(r))
    cy.api('GET', '/claims/my', undefined, 'claimant').then(r => { expect(r.status).to.be.oneOf([401, 403]); expect(r.body.success).to.eq(false) })
  })
  tc('AUTH-15', 'Hạ quyền có hiệu lực với JWT cũ', 'ADMIN hạ MODERATOR về USER; JWT MOD cũ đọc endpoint quản trị', '403 sau khi thay đổi quyền', () => {
    cy.loginApi('moderator'); cy.loginApi('admin')
    cy.api('PATCH', '/admin/users/3/role', { role: 'USER' }, 'admin').then(r => success(r))
    cy.api('GET', '/auth/admin-check', undefined, 'moderator').then(r => failure(r, 403))
  })
})
