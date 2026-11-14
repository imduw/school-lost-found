import { testCase as tc, success, failure, itemPayload } from '../support/cases'

describe('API — quản trị hệ thống', () => {
  tc('ADMIN-01', 'Dashboard theo vai trò', 'ADMIN/MOD/USER gọi stats', 'ADMIN/MOD có thống kê; USER 403', () => {
    for (const account of ['admin', 'moderator', 'claimant']) {
      cy.loginApi(account)
      cy.api('GET', '/admin/stats', undefined, account).then(r => account === 'claimant' ? failure(r, 403) : success(r))
    }
  })
  tc('ADMIN-02', 'Danh sách và tìm kiếm người dùng', 'ADMIN tìm keyword + role + status', 'Chỉ tài khoản phù hợp, không có password_hash', () => {
    cy.loginApi('admin')
    cy.api('GET', '/admin/users?keyword=claimant&role=USER&status=ACTIVE', undefined, 'admin').then(r => {
      success(r); expect(r.body.data).to.have.length(1); expect(r.body.data[0].id).to.eq(5); expect(JSON.stringify(r.body)).not.to.match(/password/i)
    })
  })
  tc('ADMIN-03', 'Chặn MOD và USER quản lý tài khoản', 'MOD/USER gọi danh sách, đổi role và khóa user', 'Tất cả trả 403', () => {
    for (const account of ['moderator', 'claimant']) {
      cy.loginApi(account)
      cy.api('GET', '/admin/users', undefined, account).then(r => failure(r, 403))
      cy.api('PATCH', '/admin/users/5/role', { role: 'ADMIN' }, account).then(r => failure(r, 403))
      cy.api('PATCH', '/admin/users/5/status', { status: 'SUSPENDED' }, account).then(r => failure(r, 403))
    }
  })
  tc('ADMIN-04', 'Đổi vai trò và đọc lại', 'ADMIN nâng USER lên MODERATOR; đăng nhập lại user', 'Role MODERATOR được lưu và JWT mới có quyền staff', () => {
    cy.loginApi('admin')
    cy.api('PATCH', '/admin/users/5/role', { role: 'MODERATOR' }, 'admin').then(r => success(r))
    cy.loginApi('claimant').then(data => expect(data.user.role).to.eq('MODERATOR'))
    cy.api('GET', '/auth/admin-check', undefined, 'claimant').then(r => success(r))
  })
  tc('ADMIN-05', 'Khóa và mở khóa tài khoản', 'ADMIN khóa USER, thử login; mở khóa, login lại', 'Khóa chặn login 403; mở khóa login 200', () => {
    cy.loginApi('admin')
    cy.api('PATCH', '/admin/users/5/status', { status: 'SUSPENDED' }, 'admin').then(r => success(r))
    cy.api('POST', '/auth/login', { email: 'claimant@slf.test', password: 'Test@123456' }).then(r => failure(r, 403))
    cy.api('PATCH', '/admin/users/5/status', { status: 'ACTIVE' }, 'admin').then(r => success(r))
    cy.loginApi('claimant')
  })
  tc('ADMIN-06', 'Cấm tự hạ quyền hoặc tự khóa ADMIN', 'ADMIN đổi role bản thân sang USER và khóa chính mình', '400 cho cả hai', () => {
    cy.loginApi('admin')
    cy.api('PATCH', '/admin/users/1/role', { role: 'USER' }, 'admin').then(r => failure(r, 400))
    cy.api('PATCH', '/admin/users/1/status', { status: 'SUSPENDED' }, 'admin').then(r => failure(r, 400))
  })
  tc('ADMIN-07', 'Validation quản lý người dùng', 'ID sai/không tồn tại, role sai, status sai', '400/404; không cập nhật user', () => {
    cy.loginApi('admin')
    for (const [route, body, status] of [['/users/-1/role', { role: 'USER' }, 400], ['/users/99999/status', { status: 'ACTIVE' }, 404], ['/users/5/role', { role: 'ROOT' }, 400], ['/users/5/status', { status: 'INVALID' }, 400]]) {
      cy.api('PATCH', `/admin${route}`, body, 'admin').then(r => failure(r, status))
    }
  })
  tc('ADMIN-08', 'Tạo và cập nhật danh mục', 'ADMIN tạo danh mục tiếng Việt rồi đổi tên/mô tả', '201 có slug; cập nhật lưu đúng', () => {
    cy.loginApi('admin')
    cy.api('POST', '/admin/categories', { name: 'Đồ dùng Cypress' }, 'admin').then(r => {
      success(r, 201); expect(r.body.data.slug).to.be.a('string').and.not.empty
      cy.api('PUT', `/admin/categories/${r.body.data.id}`, { name: 'Danh mục đã sửa', description: 'Mô tả mới' }, 'admin').then(result => { success(result); expect(result.body.data.name).to.eq('Danh mục đã sửa') })
    })
  })
  tc('ADMIN-09', 'Ẩn danh mục khỏi form tạo tin', 'ADMIN ẩn category 1; public categories và tạo tin dùng category ẩn', 'Danh mục ẩn không ở public list; tạo tin bị 400; tin cũ còn xem được', () => {
    cy.loginApi('admin'); cy.loginApi('claimant')
    cy.api('PUT', '/admin/categories/1', { isActive: false }, 'admin').then(r => success(r))
    cy.api('GET', '/categories').then(r => expect(r.body.data.map(c => c.id)).not.to.include(1))
    cy.api('POST', '/items', itemPayload, 'claimant').then(r => failure(r, 400))
    cy.api('GET', '/items/1').then(r => success(r))
  })
  tc('ADMIN-10', 'Danh mục trùng và thiếu tên', 'Tạo tên/slug trùng, tên trống; sửa ID không tồn tại', '409; 400; 404', () => {
    cy.loginApi('admin')
    cy.api('POST', '/admin/categories', { name: 'Ví tiền & Bóp' }, 'admin').then(r => failure(r, 409))
    cy.api('POST', '/admin/categories', { name: ' ' }, 'admin').then(r => failure(r, 400))
    cy.api('PUT', '/admin/categories/99999', { name: 'Test' }, 'admin').then(r => failure(r, 404))
  })
  tc('ADMIN-11', 'MOD chỉ được đọc danh mục quản trị', 'MOD GET/POST/PUT danh mục', 'GET 200; POST và PUT 403', () => {
    cy.loginApi('moderator')
    cy.api('GET', '/admin/categories', undefined, 'moderator').then(r => success(r))
    cy.api('POST', '/admin/categories', { name: 'Test' }, 'moderator').then(r => failure(r, 403))
    cy.api('PUT', '/admin/categories/1', { name: 'Test' }, 'moderator').then(r => failure(r, 403))
  })
  tc('ADMIN-12', 'Audit tìm kiếm, lọc và quyền', 'ADMIN/MOD đọc audit lọc HIDE_ITEM; USER đọc audit', 'Đúng action và keyword; USER bị 403', () => {
    for (const account of ['admin', 'moderator', 'claimant']) {
      cy.loginApi(account)
      cy.api('GET', '/admin/audit-logs?action=HIDE_ITEM&keyword=Cypress', undefined, account).then(r => {
        if (account === 'claimant') failure(r, 403)
        else { success(r); expect(r.body.data).to.have.length(1); expect(r.body.data[0].action).to.eq('HIDE_ITEM') }
      })
    }
  })
})
