import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { LoginPage } from '../pages/LoginPage'

const loginPage = new LoginPage()

// ── Given ────────────────────────────────────────────────────────────────────

Given('el usuario está en la página de inicio de sesión', () => {
  cy.visit('/login')
})

// ── When ─────────────────────────────────────────────────────────────────────

When('el usuario ingresa credenciales válidas', () => {
  loginPage.fillEmail(Cypress.env('TEST_USER_EMAIL'))
  loginPage.fillPassword(Cypress.env('TEST_USER_PASSWORD'))
  loginPage.submit()
})

When('el usuario ingresa una contraseña incorrecta', () => {
  loginPage.fillEmail(Cypress.env('TEST_USER_EMAIL'))
  loginPage.fillPassword('contraseña-incorrecta')
  loginPage.submit()
})

When('el usuario envía el formulario con email {string} y contraseña {string}', (email: string, password: string) => {
  loginPage.fillEmail(email)
  loginPage.fillPassword(password)
  loginPage.submit()
})

// ── Then ─────────────────────────────────────────────────────────────────────

Then('debería ser redirigido al panel de control', () => {
  cy.url().should('include', '/dashboard')
})

Then('debería ver su nombre de usuario en el encabezado', () => {
  loginPage.getHeaderUsername().should('be.visible')
})

Then('debería ver el mensaje de error {string}', (message: string) => {
  loginPage.getErrorMessage().should('contain.text', message)
})

Then('debería permanecer en la página de inicio de sesión', () => {
  cy.url().should('include', '/login')
})

Then('debería ver un error de validación para el campo {string}', (field: string) => {
  loginPage.getFieldError(field).should('be.visible')
})
