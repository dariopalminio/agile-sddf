import { Before, After, BeforeAll, AfterAll } from '@badeball/cypress-cucumber-preprocessor'

// Runs once before all scenarios in the suite — no cy.* commands available here
BeforeAll(() => {
  // Global setup: seed database, set up test users, etc.
})

// Runs before each scenario
Before(() => {
  // Reset app state, clear cookies, etc.
  // Use cy.session() here to cache and restore authentication state
})

// Tagged hook: runs before scenarios tagged with @authenticated
Before({ tags: '@authenticated' }, () => {
  cy.session('auth-user', () => {
    cy.request('POST', '/api/auth/login', {
      email: Cypress.env('TEST_USER_EMAIL'),
      password: Cypress.env('TEST_USER_PASSWORD'),
    }).then((response) => {
      window.localStorage.setItem('auth_token', response.body.token)
    })
  })
})

// Runs after each scenario — screenshot on failure is handled automatically
// by screenshotOnRunFailure: true in cypress.config.ts, but you can add custom logic here
After(function () {
  // Custom teardown per scenario if needed
})

// Runs once after all scenarios in the suite — no cy.* commands available here
AfterAll(() => {
  // Global teardown: clean up test data, etc.
})
