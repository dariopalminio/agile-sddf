# Anti-Patterns

## 1. cy.wait(number) for Synchronization

```typescript
// WRONG — hard wait breaks on slow CI and masks real timing issues
When('the data loads', () => {
  cy.wait(3000)
  dataPage.getTable().should('be.visible')
})

// CORRECT — use retry-ability and should()
When('the data loads', () => {
  dataPage.getTable().should('be.visible')  // retries automatically up to timeout
})

// CORRECT — wait on a network request
When('the user submits the form', () => {
  cy.intercept('POST', '/api/orders').as('createOrder')
  orderPage.submit()
  cy.wait('@createOrder')
})
```

## 2. Assertions in Given or When Steps

```typescript
// WRONG — assertion in a When step
When('the user submits the form', () => {
  loginPage.submit()
  cy.url().should('include', '/dashboard')  // ← assertion belongs in Then
})

// CORRECT — delegated to Then
When('the user submits the form', () => {
  loginPage.submit()
})

Then('the user is on the dashboard', () => {
  cy.url().should('include', '/dashboard')
})
```

## 3. Fragile CSS Selectors

```typescript
// WRONG — breaks when styles or structure change
cy.get('.btn.btn-primary.submit-button').click()
cy.get('form > div:nth-child(2) > input').type('text')

// CORRECT — stable, intent-revealing
cy.get('[data-testid="submit-button"]').click()
cy.get('[data-testid="email-input"]').type('text')
```

## 4. Missing `return config` in setupNodeEvents

```typescript
// WRONG — preprocessor silently stops working
async setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config)
  on('file:preprocessor', createEsbuildPlugin())
  // missing return!
}

// CORRECT
async setupNodeEvents(on, config) {
  await addCucumberPreprocessorPlugin(on, config)
  on('file:preprocessor', createEsbuildPlugin())
  return config
}
```

## 5. Not Configuring filterSpecs + omitFiltered

```typescript
// WRONG — all feature files are compiled even when only @smoke runs
cypress run --env TAGS='@smoke'   // loads 100 feature files

// CORRECT — add to .cypress-cucumber-preprocessorrc.json
{
  "filterSpecs": true,
  "omitFiltered": true
}
// Now only files with @smoke scenarios are compiled and shown
```

## 6. Shared Mutable State Between Tests

```typescript
// WRONG — survives across scenarios, causes order-dependent failures
let userId: string

When('a user is created', () => {
  cy.request('POST', '/api/users', { name: 'Alice' }).then(res => {
    userId = res.body.id  // shared across all scenarios in the suite
  })
})

// CORRECT — use cy.wrap + alias, scoped to current scenario
When('a user is created', () => {
  cy.request('POST', '/api/users', { name: 'Alice' }).its('body.id').as('userId')
})

Then('the user profile is accessible', () => {
  cy.get('@userId').then((id) => {
    cy.visit(`/users/${id}`)
  })
})
```

## 7. Mixing describe/it with .feature Files

```typescript
// WRONG — cypress/e2e/login.cy.ts conflicts with login.feature in the same dir
describe('Login', () => {
  it('should log in', () => { ... })
})
```
Keep `.feature` files and `.cy.ts` files in **separate directories**. If you need both, configure distinct `specPattern` values in `cypress.config.ts`.

## 8. cy.intercept Without .as() When Waiting on the Request

```typescript
// WRONG — no way to wait for the specific request to complete
cy.intercept('POST', '/api/checkout')
checkoutPage.submit()
// next assertion may run before the POST finishes

// CORRECT
cy.intercept('POST', '/api/checkout').as('checkout')
checkoutPage.submit()
cy.wait('@checkout')
orderPage.getConfirmation().should('be.visible')
```

## 9. Assertions Inside Page Objects

```typescript
// WRONG — Page Objects should not contain assertions
class LoginPage {
  assertErrorVisible() {
    cy.get('[data-testid="error"]').should('be.visible')  // ← assertion in POM
  }
}

// CORRECT — Page Object returns chainable, step contains assertion
class LoginPage {
  getErrorMessage() {
    return cy.get('[data-testid="error"]')  // returns Cypress chainable
  }
}

// In step definition:
Then('an error message is displayed', () => {
  loginPage.getErrorMessage().should('be.visible')
})
```

## 10. Not Using cy.session() for Repeated Authentication

```typescript
// WRONG — logs in via UI on every scenario (slow)
Before({ tags: '@authenticated' }, () => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type('user@example.com')
  cy.get('[data-testid="password"]').type('password')
  cy.get('[data-testid="submit"]').click()
})

// CORRECT — cached login, replayed via session restore (fast)
Before({ tags: '@authenticated' }, () => {
  cy.session('user-session', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type(Cypress.env('TEST_USER_EMAIL'))
    cy.get('[data-testid="password"]').type(Cypress.env('TEST_USER_PASSWORD'))
    cy.get('[data-testid="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
})
```
