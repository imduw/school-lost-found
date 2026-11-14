import { testCase as tc, success, failure, proofPayload } from '../support/cases'

describe('API — yêu cầu nhận đồ và bàn giao', () => {
  tc('CLAIM-01', 'Tạo yêu cầu và đọc lại bằng chứng', 'ADMIN tạo claim trên tin 1; đọc detail/proofs', '201 PENDING, đúng claimant, bằng chứng được lưu', () => {
    cy.loginApi('admin')
    cy.api('POST', '/items/1/claims', proofPayload, 'admin').then(r => {
      success(r, 201); expect(r.body.data.status).to.eq('PENDING')
      cy.api('GET', `/claims/${r.body.data.id}`, undefined, 'admin').then(result => { success(result); expect(result.body.data.claimantId).to.eq(1) })
      cy.api('GET', `/claims/${r.body.data.id}/proofs`, undefined, 'admin').then(result => { success(result); expect(result.body.data[0].proofContent).to.eq(proofPayload.proofContent) })
    })
  })
  for (const [id, title, item, account, status] of [
    ['02', 'Khách gửi claim', 1, null, 401], ['03', 'Tự claim tin của mình', 1, 'owner', 400],
    ['04', 'Gửi trùng claim PENDING', 1, 'claimant', 409], ['05', 'Claim tin LOST', 2, 'other', 400],
    ['06', 'Claim tin đã đóng', 3, 'other', 409], ['07', 'Claim tin ẩn', 4, 'other', 403],
    ['08', 'Claim tin chưa duyệt', 5, 'other', 403], ['09', 'Claim tin không tồn tại', 99999, 'other', 404],
  ]) tc(`CLAIM-${id}`, title, `POST /items/${item}/claims với tài khoản ${account || 'guest'}`, `HTTP ${status}; không thêm claim`, () => {
    if (account) cy.loginApi(account)
    cy.api('POST', `/items/${item}/claims`, proofPayload, account).then(r => failure(r, status))
    cy.task('db:snapshot').then(db => expect(db.claims).to.have.length(3))
  })
  tc('CLAIM-10', 'Thiếu bằng chứng', 'Gửi claim không có mô tả hoặc ảnh', '400 VALIDATION_ERROR', () => {
    cy.loginApi('admin'); cy.api('POST', '/items/1/claims', {}, 'admin').then(r => failure(r, 400))
  })
  tc('CLAIM-11', 'Quyền riêng tư detail và proof', 'Chủ claim/MOD xem; chủ tin/người khác/khách đọc claim 1', 'Chủ claim/MOD 200; người ngoài 403 hoặc 401; không lộ proof', () => {
    for (const account of ['claimant', 'moderator', 'owner', 'other']) cy.loginApi(account)
    for (const route of ['/claims/1', '/claims/1/proofs']) {
      for (const account of ['claimant', 'moderator']) cy.api('GET', route, undefined, account).then(r => success(r))
      for (const account of ['owner', 'other', null]) cy.api('GET', route, undefined, account).then(r => { failure(r, account ? 403 : 401); expect(JSON.stringify(r.body)).not.to.include('BẰNG CHỨNG') })
    }
  })
  tc('CLAIM-12', 'Danh sách của tôi và lọc staff', 'USER lấy my; MOD lọc PENDING, itemId, keyword', 'USER chỉ có claim 1,3; MOD nhận claim phù hợp', () => {
    cy.loginApi('claimant'); cy.loginApi('moderator')
    cy.api('GET', '/claims/my', undefined, 'claimant').then(r => { success(r); expect(r.body.data.map(c => c.id).sort()).to.deep.eq([1, 3]) })
    cy.api('GET', '/claims?status=PENDING&itemId=1&keyword=Ví', undefined, 'moderator').then(r => { success(r); expect(r.body.data).to.have.length(2) })
    cy.api('GET', '/claims', undefined, 'claimant').then(r => failure(r, 403))
  })
  tc('CLAIM-13', 'Rút yêu cầu và cấm rút hộ/lặp', 'Người khác rút claim 1; chủ claim rút 2 lần', '403; WITHDRAWN; lặp 409', () => {
    cy.loginApi('owner'); cy.loginApi('claimant')
    cy.api('POST', '/claims/1/withdraw', {}, 'owner').then(r => failure(r, 403))
    cy.api('POST', '/claims/1/withdraw', {}, 'claimant').then(r => { success(r); expect(r.body.data.status).to.eq('WITHDRAWN') })
    cy.api('POST', '/claims/1/withdraw', {}, 'claimant').then(r => failure(r, 409))
  })
  tc('CLAIM-14', 'Từ chối yêu cầu và cấm thao tác lặp', 'MOD từ chối claim 1 rồi thử lại', 'REJECTED, audit REJECT_CLAIM; lặp 409', () => {
    cy.loginApi('moderator')
    cy.api('POST', '/claims/1/reject', { note: 'Bằng chứng chưa khớp' }, 'moderator').then(r => success(r))
    cy.api('GET', '/claims/1', undefined, 'moderator').then(r => expect(r.body.data.status).to.eq('REJECTED'))
    cy.api('POST', '/claims/1/reject', {}, 'moderator').then(r => failure(r, 409))
    cy.task('db:snapshot').then(db => expect(db.audit_logs.at(-1).action).to.eq('REJECT_CLAIM'))
  })
  tc('CLAIM-15', 'Bàn giao thành công và từ chối claim còn lại', 'MOD bàn giao claim 1; kiểm tra DB; gọi lại', 'ACCEPTED/CLOSED, claim 2 REJECTED, 1 handover cho item 1; lặp 409', () => {
    cy.loginApi('moderator')
    cy.api('POST', '/claims/1/handover', { note: 'Đối chiếu giả lập', handoverAt: '2026-11-14T02:00:00Z' }, 'moderator').then(r => { success(r); expect(r.body.data.autoRejectedClaimsCount).to.eq(1) })
    cy.task('db:snapshot').then(db => {
      expect(db.items.find(i => i.id === '1').business_status).to.eq('CLOSED')
      expect(db.claims.filter(c => c.item_id === '1').map(c => c.status)).to.deep.eq(['ACCEPTED', 'REJECTED'])
      expect(db.handovers.filter(h => h.item_id === '1')).to.have.length(1)
    })
    cy.api('POST', '/claims/1/handover', {}, 'moderator').then(r => failure(r, 409))
  })
  tc('CLAIM-16', 'Chống hai bàn giao đồng thời', 'Gửi đồng thời 2 request bàn giao claim 1 và 2 qua Promise.all; kiểm tra DB', 'Đúng một 200, một 409; một handover; một ACCEPTED và một REJECTED', () => {
    cy.loginApi('moderator').then(({ token }) => {
      cy.task('api:race', { token, ids: [1, 2] }, { log: false }).then(results => {
        cy.get('#evidence').invoke('text', JSON.stringify(results, null, 2))
        expect(results.map(r => r.status).sort()).to.deep.eq([200, 409])
      })
    })
    cy.task('db:snapshot').then(db => {
      expect(db.handovers.filter(h => h.item_id === '1')).to.have.length(1)
      expect(db.claims.filter(c => c.item_id === '1').map(c => c.status).sort()).to.deep.eq(['ACCEPTED', 'REJECTED'])
      expect(db.items[0].business_status).to.eq('CLOSED')
    })
  })
  tc('CLAIM-17', 'USER không được bàn giao hoặc từ chối', 'USER gọi handover và reject; MOD bàn giao ngày sai', '403 cho USER; 400 ngày sai; chưa có handover mới', () => {
    cy.loginApi('claimant'); cy.loginApi('moderator')
    for (const action of ['handover', 'reject']) cy.api('POST', `/claims/1/${action}`, {}, 'claimant').then(r => failure(r, 403))
    cy.api('POST', '/claims/1/handover', { handoverAt: 'invalid' }, 'moderator').then(r => failure(r, 400))
    cy.task('db:snapshot').then(db => expect(db.handovers).to.have.length(1))
  })
  tc('CLAIM-18', 'ID claim và bộ lọc không hợp lệ', 'Gửi ID âm, ID không tồn tại, status/itemId sai', '400 hoặc 404 đúng trường hợp', () => {
    cy.loginApi('moderator')
    cy.api('GET', '/claims/-1', undefined, 'moderator').then(r => failure(r, 400))
    cy.api('GET', '/claims/99999/proofs', undefined, 'moderator').then(r => failure(r, 404))
    for (const query of ['status=INVALID', 'itemId=abc']) cy.api('GET', `/claims?${query}`, undefined, 'moderator').then(r => failure(r, 400))
  })
})
