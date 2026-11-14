const password = 'Test@123456'
let tokens = {}
let apiEvidence = []

beforeEach(() => {
  tokens = {}
  apiEvidence = []
  cy.task('db:reset', null, { log: false })
  if (Cypress.spec.name.startsWith('api-')) {
    cy.intercept('GET', '/__cypress-evidence', {
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: '<html lang="vi"><head><meta charset="utf-8"><title>Cypress API evidence</title></head><body style="font:16px system-ui;background:#f3f7f4;padding:32px;color:#19352a"><h1>School Lost & Found — Cypress API</h1><p>Bằng chứng request thật tới Express + PostgreSQL riêng. Token và nội dung đối chiếu đã được che.</p><h2 id="case"></h2><pre id="evidence" style="background:white;padding:24px;white-space:pre-wrap;word-break:break-word"></pre></body></html>',
    })
    cy.visit('/__cypress-evidence')
    cy.get('#case').invoke('text', Cypress.currentTest.title)
  }
})

afterEach(function () {
  const id = this.currentTest.title.match(/^[A-Z]+-\d+/)?.[0] || 'test'
  cy.screenshot(id, { capture: 'fullPage', scale: true, overwrite: true, blackout: ['input[type=password]'] })
})

function redact(value) {
  return JSON.parse(JSON.stringify(value, (key, content) =>
    /token|password|proofContent/i.test(key) ? '[REDACTED]' : content))
}

Cypress.Commands.add('api', (method, url, body, account) => {
  return cy.request({ method, url: `/api/v1${url}`, body,
    headers: account ? { Authorization: `Bearer ${tokens[account]}` } : {},
    failOnStatusCode: false, log: false }).then(response => {
    apiEvidence.push({ method, url, account: account || 'guest', status: response.status, body: redact(response.body) })
    if (Cypress.spec.name.startsWith('api-')) {
      cy.get('#evidence', { log: false }).invoke('text', JSON.stringify(apiEvidence, null, 2))
    }
    return cy.wrap(response, { log: false })
  })
})

Cypress.Commands.add('loginApi', (account = 'claimant') => {
  return cy.api('POST', '/auth/login', { email: `${account}@slf.test`, password }).then(response => {
    expect(response.status, `login ${account}`).to.eq(200)
    tokens[account] = response.body.data.token
    return cy.wrap(response.body.data, { log: false })
  })
})

Cypress.Commands.add('loginAs', (account = 'claimant', route = '/') => {
  cy.loginApi(account).then(({ token }) => {
    cy.visit(route, { onBeforeLoad(win) { win.localStorage.setItem('slf_access_token', token) } })
  })
})

Cypress.Commands.add('field', label => cy.contains('label', label).parent().find('input:not([type=file]), textarea, select').first())
