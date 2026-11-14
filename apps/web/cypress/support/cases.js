export function testCase(id, title, steps, expected, run) {
  it(`${id} — ${title}`, () => {
    cy.task('case:record', { id, title, steps, expected }, { log: false })
    run()
  })
}

export function success(response, status = 200) {
  expect(response.status).to.eq(status)
  expect(response.body.success).to.eq(true)
  expect(response.body).to.have.property('data')
}
export function failure(response, status, code) {
  expect(response.status).to.eq(status)
  expect(response.body.success).to.eq(false)
  expect(response.body.error).to.have.keys('code', 'message')
  if (code) expect(response.body.error.code).to.eq(code)
}
export const itemPayload = {
  itemType: 'FOUND', categoryId: 1, title: 'Vật phẩm mới Cypress', description: 'Mô tả vật phẩm kiểm thử',
  approximateLocation: 'Thư viện', occurredAt: '2026-11-13T03:00:00.000Z',
}
export const proofPayload = { proofType: 'DESCRIPTION', proofContent: 'Bằng chứng giả lập Cypress' }
