import { testCase as tc, success } from '../support/cases'

describe('UI — đăng tin, ảnh và yêu cầu nhận đồ', () => {
  for (const [id, type] of [['13', 'LOST'], ['14', 'FOUND']]) {
    tc(`UI-${id}`, `Đăng tin ${type} kèm ảnh`, 'USER điền form, chọn ảnh thật và đăng; reload chi tiết', 'Tin và ảnh được lưu, đọc lại sau reload', () => {
      cy.loginAs('claimant', `/items/new?type=${type}`)
      cy.field('Tiêu đề tin đăng').type(`Tin ${type} Cypress`)
      cy.field('Mô tả công khai').type('Mô tả qua giao diện Cypress')
      cy.field('Khu vực mất').type('Thư viện Cypress')
      cy.get('input[type=file]').selectFile('src/assets/explore/item-wallet.png', { force: true })
      cy.get('button[type=submit]').click()
      cy.location('pathname').should('match', /^\/items\/\d+$/)
      cy.contains('h1', `Tin ${type} Cypress`).should('be.visible')
      cy.get('img[src*="/uploads/items/"]').first().should('be.visible').and(image => expect(image[0].naturalWidth).to.be.greaterThan(0))
      cy.reload(); cy.contains('h1', `Tin ${type} Cypress`).should('be.visible')
    })
  }
  tc('UI-15', 'Sửa tin và đánh dấu đã tìm thấy', 'Chủ tin 2 sửa tiêu đề rồi đánh dấu tìm thấy', 'Title mới lưu; businessStatus RESOLVED; không còn nút sửa', () => {
    cy.loginAs('claimant', '/items/2'); cy.contains('button', 'Sửa tin của tôi').click()
    cy.field('Tiêu đề').clear().type('Thẻ đã tìm lại Cypress'); cy.contains('button', 'Lưu thay đổi').click()
    cy.contains('h1', 'Thẻ đã tìm lại Cypress').should('be.visible')
    cy.contains('button', 'Đánh dấu đã tìm thấy').click()
    cy.api('GET', '/items/2').then(r => expect(r.body.data.businessStatus).to.eq('RESOLVED'))
    cy.contains('button', 'Sửa tin của tôi').should('not.exist')
  })
  tc('UI-16', 'Upload thêm ảnh và xóa ảnh', 'Chủ tin upload ảnh từ trang detail rồi xóa', 'Ảnh xuất hiện; bấm xóa làm ảnh biến mất và API images rỗng', () => {
    cy.loginAs('owner', '/items/1')
    cy.get('input[type=file]').first().selectFile('src/assets/explore/item-wallet.png', { force: true })
    cy.get('img[src*="/uploads/items/"]').should('exist')
    cy.get('button[title*="Xóa"], button[aria-label*="Xóa"]').first().click()
    cy.get('img[src*="/uploads/items/"]').should('not.exist')
    cy.api('GET', '/items/1').then(r => expect(r.body.data.images).to.have.length(0))
  })
  tc('UI-17', 'Gửi claim kèm ảnh và rút yêu cầu', 'ADMIN gửi claim từ chi tiết tin 1; mở my-claims; rút trong dialog', 'Claim PENDING có ảnh; rút thành WITHDRAWN', () => {
    cy.loginAs('admin', '/items/1')
    cy.contains('button', 'Gửi yêu cầu nhận đồ').click()
    cy.get('#claim-proof-content').type('Mô tả giả lập Cypress')
    cy.get('.p03-cta-card input[type=file]').selectFile('src/assets/claims/evidence-wallet-1.png', { force: true })
    cy.contains('button', 'Gửi bằng chứng').click()
    cy.contains('PENDING').should('be.visible')
    cy.visit('/my-claims'); cy.contains('button', 'Rút yêu cầu').click()
    cy.get('dialog[open]').contains('button', 'Rút').click()
    cy.contains('Đã tự rút yêu cầu').should('be.visible')
    cy.api('GET', '/claims/my', undefined, 'admin').then(r => { success(r); expect(r.body.data[0].status).to.eq('WITHDRAWN') })
  })
  tc('UI-18', 'Lọc yêu cầu của tôi và hủy dialog', 'USER lọc đang chờ, mở rút yêu cầu rồi Hủy; lọc đã nhận', 'Hủy không đổi claim; tab đã nhận chỉ có claim ACCEPTED', () => {
    cy.loginAs('claimant', '/my-claims'); cy.contains('button', 'Đang chờ (').click()
    cy.get('article').should('have.length', 1); cy.contains('button', 'Rút yêu cầu').click()
    cy.get('dialog[open]').contains('button', 'Hủy').click(); cy.get('dialog[open]').should('not.exist')
    cy.contains('button', 'Đã nhận đồ (').click(); cy.get('article').should('have.length', 1).and('contain', 'Tai nghe đã bàn giao')
  })
  tc('UI-19', 'Mobile: đăng tin và gửi claim', 'Viewport 390×844; tạo tin FOUND; ADMIN khác gửi bằng chứng', 'Tạo tin và claim thành công qua form mobile', () => {
    cy.viewport(390, 844); cy.loginAs('owner', '/items/new?type=FOUND')
    cy.field('Tiêu đề tin đăng').type('Tin mobile Cypress'); cy.field('Mô tả công khai').type('Mô tả mobile')
    cy.field('Khu vực mất').type('Sân trường'); cy.get('button[type=submit]').click()
    cy.location('pathname').should('match', /^\/items\/\d+$/).then(route => {
      cy.loginAs('admin', route); cy.contains('button', 'Gửi yêu cầu nhận đồ').click()
      cy.get('#claim-proof-content').type('Bằng chứng mobile giả lập'); cy.contains('button', 'Gửi bằng chứng').click()
      cy.contains('PENDING').should('be.visible')
    })
  })
})
