import { testCase as tc, success, failure, itemPayload } from '../support/cases'

describe('API — tin đăng và kiểm duyệt', () => {
  tc('ITEM-01', 'Danh mục và danh sách công khai', 'GET categories và items bằng khách', '5 danh mục; chỉ tin 1,2,3 công khai; không có bằng chứng', () => {
    cy.api('GET', '/categories').then(r => { success(r); expect(r.body.data).to.have.length(5) })
    cy.api('GET', '/items').then(r => { success(r); expect(r.body.data.map(i => i.id).sort()).to.deep.eq([1, 2, 3]); expect(JSON.stringify(r.body)).not.to.include('proofContent') })
  })
  tc('ITEM-02', 'Lọc kết hợp và kết quả rỗng', 'Tìm từ khóa + loại + danh mục + khu vực; tìm từ khóa không tồn tại', 'Chỉ tin 1 khớp; từ khóa khác trả []', () => {
    cy.api('GET', '/items?keyword=Ví&type=FOUND&categoryId=1&location=Thư viện&status=OPEN').then(r => { success(r); expect(r.body.data.map(i => i.id)).to.deep.eq([1]) })
    cy.api('GET', '/items?keyword=does-not-exist').then(r => { success(r); expect(r.body.data).to.deep.eq([]) })
  })
  tc('ITEM-03', 'Tin của tôi và tin ẩn', 'Khách gọi mine; chủ tin và staff đọc tin ẩn; khách đọc tin ẩn', 'Khách bị chặn; chủ tin/staff xem được', () => {
    cy.api('GET', '/items?mine=true').then(r => failure(r, 401))
    cy.api('GET', '/items/4').then(r => failure(r, 403))
    cy.loginApi('claimant'); cy.loginApi('moderator')
    cy.api('GET', '/items?mine=true', undefined, 'claimant').then(r => { success(r); expect(r.body.data.map(i => i.id).sort()).to.deep.eq([2, 4]) })
    for (const role of ['claimant', 'moderator']) cy.api('GET', '/items/4', undefined, role).then(r => success(r))
  })
  tc('ITEM-04', 'Chi tiết tin và ID lỗi', 'Đọc tin 1, ID âm, ID không tồn tại', '200 đúng nội dung; 400 và 404 tương ứng', () => {
    cy.api('GET', '/items/1').then(r => { success(r); expect(r.body.data.title).to.eq('Ví da kiểm thử') })
    cy.api('GET', '/items/-1').then(r => failure(r, 400))
    cy.api('GET', '/items/999999').then(r => failure(r, 404))
  })
  for (const [id, type] of [['05', 'LOST'], ['06', 'FOUND']]) {
    tc(`ITEM-${id}`, `Tạo tin ${type} và đọc lại`, 'USER tạo tin hợp lệ rồi GET theo ID', '201, chủ tin đúng, dữ liệu bền vững khi đọc lại', () => {
      cy.loginApi('claimant')
      cy.api('POST', '/items', { ...itemPayload, itemType: type }, 'claimant').then(r => {
        success(r, 201); expect(r.body.data.userId).to.eq(5)
        cy.api('GET', `/items/${r.body.data.id}`, undefined, 'claimant').then(result => { success(result); expect(result.body.data.itemType).to.eq(type); expect(result.body.data.title).to.eq(itemPayload.title) })
      })
    })
  }
  tc('ITEM-07', 'Khách không được đăng tin', 'POST items không JWT', '401 UNAUTHENTICATED', () => cy.api('POST', '/items', itemPayload).then(r => failure(r, 401)))
  for (const [offset, field] of ['itemType', 'categoryId', 'title', 'description', 'approximateLocation', 'occurredAt'].entries()) {
    tc(`ITEM-${String(8 + offset).padStart(2, '0')}`, `Thiếu trường bắt buộc ${field}`, `Tạo tin thiếu ${field}`, '400; số tin trong database giữ nguyên', () => {
      cy.loginApi('claimant')
      const payload = { ...itemPayload }; delete payload[field]
      cy.api('POST', '/items', payload, 'claimant').then(r => failure(r, 400))
      cy.task('db:snapshot').then(db => expect(db.items).to.have.length(6))
    })
  }
  tc('ITEM-14', 'Loại tin, danh mục và ngày sai', 'Tạo tin với itemType lạ, categoryId không tồn tại, ngày sai', '400 cho từng request', () => {
    cy.loginApi('claimant')
    for (const patch of [{ itemType: 'INVALID' }, { categoryId: 99999 }, { occurredAt: 'invalid-date' }]) cy.api('POST', '/items', { ...itemPayload, ...patch }, 'claimant').then(r => failure(r, 400))
  })
  tc('ITEM-15', 'Chủ tin sửa tin mở', 'Chủ tin PUT title và đọc lại', 'Title mới được lưu', () => {
    cy.loginApi('claimant')
    cy.api('PUT', '/items/2', { title: 'Tiêu đề đã sửa' }, 'claimant').then(r => success(r))
    cy.api('GET', '/items/2').then(r => expect(r.body.data.title).to.eq('Tiêu đề đã sửa'))
  })
  tc('ITEM-16', 'Cấm sửa tin người khác và tin đóng', 'USER sửa tin người khác; chủ tin sửa tin CLOSED', '403 và 409; dữ liệu giữ nguyên', () => {
    cy.loginApi('claimant'); cy.loginApi('owner')
    cy.api('PUT', '/items/1', { title: 'Không được lưu' }, 'claimant').then(r => failure(r, 403))
    cy.api('PUT', '/items/3', { title: 'Không được lưu' }, 'owner').then(r => failure(r, 409))
    cy.task('db:snapshot').then(db => expect(db.items.some(i => i.title === 'Không được lưu')).to.eq(false))
  })
  tc('ITEM-17', 'Đánh dấu tìm thấy và cấm thao tác lặp', 'Chủ tin LOST resolve 2 lần; người khác resolve', 'RESOLVED; lặp 409, người khác 403', () => {
    cy.loginApi('claimant'); cy.loginApi('owner')
    cy.api('PATCH', '/items/2/resolve', {}, 'owner').then(r => failure(r, 403))
    cy.api('PATCH', '/items/2/resolve', {}, 'claimant').then(r => { success(r); expect(r.body.data.businessStatus).to.eq('RESOLVED') })
    cy.api('PATCH', '/items/2/resolve', {}, 'claimant').then(r => failure(r, 409))
    cy.api('PATCH', '/items/1/resolve', {}, 'owner').then(r => failure(r, 400))
  })
  tc('ITEM-18', 'Ẩn và khôi phục tin đã bàn giao', 'MOD ẩn tin CLOSED với lý do; khách không xem được; MOD khôi phục', 'CLOSED được giữ; có audit HIDE_ITEM và RESTORE_ITEM', () => {
    cy.loginApi('moderator')
    cy.api('PATCH', '/items/3/visibility', { publicationStatus: 'HIDDEN', reason: 'Cypress hide' }, 'moderator').then(r => success(r))
    cy.api('GET', '/items/3').then(r => failure(r, 403))
    cy.api('PATCH', '/items/3/visibility', { publicationStatus: 'APPROVED' }, 'moderator').then(r => { success(r); expect(r.body.data.businessStatus).to.eq('CLOSED') })
    cy.task('db:snapshot').then(db => expect(db.audit_logs.slice(-2).map(log => log.action)).to.deep.eq(['HIDE_ITEM', 'RESTORE_ITEM']))
  })
  tc('ITEM-19', 'Kiểm duyệt: quyền, lý do và trạng thái', 'USER ẩn tin; MOD ẩn thiếu lý do; MOD gửi trạng thái sai', '403; 400; 400', () => {
    cy.loginApi('claimant'); cy.loginApi('moderator')
    cy.api('PATCH', '/items/1/visibility', { publicationStatus: 'HIDDEN', reason: 'Test' }, 'claimant').then(r => failure(r, 403))
    for (const status of ['HIDDEN', 'INVALID']) cy.api('PATCH', '/items/1/visibility', { publicationStatus: status }, 'moderator').then(r => failure(r, 400))
  })
  tc('ITEM-20', 'Duyệt và từ chối tin chờ', 'MOD duyệt tin 5 và từ chối tin 1 có lý do', 'APPROVED và REJECTED; tin từ chối không xuất hiện công khai', () => {
    cy.loginApi('moderator')
    cy.api('PATCH', '/items/5/visibility', { publicationStatus: 'APPROVED' }, 'moderator').then(r => { success(r); expect(r.body.data.publicationStatus).to.eq('APPROVED') })
    cy.api('PATCH', '/items/1/visibility', { publicationStatus: 'REJECTED', reason: 'Nội dung không phù hợp' }, 'moderator').then(r => success(r))
    cy.api('GET', '/items').then(r => expect(r.body.data.map(i => i.id)).not.to.include(1))
  })
})
