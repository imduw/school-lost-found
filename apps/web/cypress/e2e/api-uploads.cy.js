import { testCase as tc, success, failure, itemPayload } from '../support/cases'

const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jHcQAAAAASUVORK5CYII='
function upload(account, route, fields = {}, options = {}) {
  return cy.loginApi(account).then(({ token }) => cy.window().then(async win => {
    const form = new win.FormData()
    for (const [key, value] of Object.entries(fields)) form.append(key, String(value))
    for (let i = 0; i < (options.count || 1); i++) {
      const data = options.size ? new Uint8Array(options.size) : Cypress.Buffer.from(png, 'base64')
      form.append(options.field || 'images', new win.Blob([data], { type: options.type || 'image/png' }), options.name || `test-${i}.png`)
    }
    const response = await win.fetch(`/api/v1${route}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })
    return { status: response.status, body: await response.json() }
  })).then(response => {
    cy.get('#evidence').invoke('text', JSON.stringify({ route, ...response }, null, 2))
    return cy.wrap(response, { log: false })
  })
}
describe('API — upload và quyền truy cập ảnh', () => {
  tc('FILE-01', 'Tạo tin multipart có ảnh', 'POST items multipart với ảnh PNG', '201, có ảnh PUBLIC và URL tải được', () => {
    upload('claimant', '/items', itemPayload).then(r => {
      success(r, 201); expect(r.body.data.images).to.have.length(1)
      cy.request(r.body.data.images[0].storageUrl).its('status').should('eq', 200)
    })
  })
  tc('FILE-02', 'Upload thêm và xóa ảnh', 'Chủ tin thêm PNG, xóa ảnh, GET lại URL và metadata', 'Upload 201; xóa 200; metadata rỗng; file 404', () => {
    upload('owner', '/items/1/images').then(r => {
      success(r, 201)
      cy.api('GET', '/items/1').then(detail => {
        const image = detail.body.data.images[0]
        cy.api('DELETE', `/items/1/images/${image.id}`, undefined, 'owner').then(result => success(result))
        cy.request({ url: image.storageUrl, failOnStatusCode: false }).its('status').should('eq', 404)
        cy.api('GET', '/items/1').then(result => expect(result.body.data.images).to.deep.eq([]))
      })
    })
  })
  tc('FILE-03', 'Cấm upload/xóa ảnh tin của người khác', 'USER upload vào tin 1; chủ tin upload rồi USER khác xóa', '403 cho thao tác không có quyền', () => {
    upload('claimant', '/items/1/images').then(r => failure(r, 403))
    upload('owner', '/items/1/images').then(r => {
      success(r, 201)
      cy.api('GET', '/items/1').then(detail => cy.api('DELETE', `/items/1/images/${detail.body.data.images[0].id}`, undefined, 'claimant').then(result => failure(result, 403)))
    })
  })
  tc('FILE-04', 'Ảnh PRIVATE không lộ trong JSON công khai', 'Upload PRIVATE, khách và chủ tin đọc detail', 'Khách images=[]; chủ tin thấy ảnh PRIVATE', () => {
    upload('owner', '/items/1/images', { visibility: 'PRIVATE' }).then(r => success(r, 201))
    cy.api('GET', '/items/1').then(r => expect(r.body.data.images).to.deep.eq([]))
    cy.api('GET', '/items/1', undefined, 'owner').then(r => expect(r.body.data.images[0].visibility).to.eq('PRIVATE'))
  })
  tc('FILE-05', 'Ảnh PRIVATE bị chặn khi truy cập URL trực tiếp', 'Lấy URL PRIVATE bằng chủ tin; khách tải trực tiếp URL không JWT', '401/403/404; nội dung ảnh riêng không được phục vụ công khai', () => {
    upload('owner', '/items/1/images', { visibility: 'PRIVATE' }).then(r => success(r, 201))
    cy.api('GET', '/items/1', undefined, 'owner').then(r => {
      cy.request({ url: r.body.data.images[0].storageUrl, failOnStatusCode: false }).then(response => {
        cy.get('#evidence').invoke('text', `GET private image without JWT: HTTP ${response.status}`)
        cy.then(() => expect(response.status).to.be.oneOf([401, 403, 404]))
      })
    })
  })
  tc('FILE-06', 'Ảnh bằng chứng bị chặn khi truy cập URL trực tiếp', 'Tạo claim ảnh; khách tải URL proof không JWT', '401/403/404; ảnh bằng chứng được bảo mật như API proofs', () => {
    upload('admin', '/items/1/claims', { proofContent: 'Ảnh giả lập Cypress' }, { field: 'proofImages' }).then(r => {
      success(r, 201)
      const proof = r.body.data.proofs.find(p => p.proofType === 'ATTACHMENT_URL')
      expect(proof).to.exist
      cy.request({ url: proof.proofContent, failOnStatusCode: false }).then(response => {
        cy.get('#evidence').invoke('text', `GET proof attachment without JWT: HTTP ${response.status}`)
        cy.then(() => expect(response.status).to.be.oneOf([401, 403, 404]))
      })
    })
  })
  for (const [id, title, options] of [
    ['07', 'Từ chối file không phải ảnh', { type: 'text/plain', name: 'test.txt' }],
    ['08', 'Từ chối ảnh vượt 5MB', { size: 5 * 1024 * 1024 + 1 }],
    ['09', 'Từ chối hơn 5 ảnh mỗi request', { count: 6 }],
  ]) tc(`FILE-${id}`, title, 'Upload dữ liệu vượt quy tắc qua multipart thật', '400 VALIDATION_ERROR', () => upload('owner', '/items/1/images', {}, options).then(r => failure(r, 400)))
  tc('FILE-10', 'Chủ tin không thêm ảnh vào tin CLOSED', 'Upload ảnh vào tin 3 đã bàn giao', '409 STATE_CONFLICT', () => upload('owner', '/items/3/images').then(r => failure(r, 409)))
})
