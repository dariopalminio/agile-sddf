# Step Definitions

## Basic Structure

```typescript
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor'
import { LoginPage } from '../pages/LoginPage'

const loginPage = new LoginPage()

Given('the user is on the login page', () => {
  cy.visit('/login')
})

When('the user enters valid credentials', () => {
  loginPage.fillEmail(Cypress.env('TEST_USER_EMAIL'))
  loginPage.fillPassword(Cypress.env('TEST_USER_PASSWORD'))
  loginPage.submit()
})

Then('the user is redirected to the dashboard', () => {
  cy.url().should('include', '/dashboard')
})
```

Arrow functions are **fine** in Cypress Cucumber — there is no `this`-based World to bind to.

## Parameter Expressions

```typescript
// {string} — quoted string from Gherkin
When('the user searches for {string}', (query: string) => {
  searchPage.search(query)
})

// {int} — integer
Then('the cart should contain {int} items', (count: int) => {
  cartPage.getItemCount().should('eq', count)
})

// {float} — decimal number
Then('the total should be {float}', (amount: float) => {
  cartPage.getTotal().should('eq', amount)
})

// Regex — when expressions don't fit
Given(/^the user (?:is|has been) logged in$/, () => {
  cy.session('login', () => { /* ... */ })
})
```

## Sharing State Between Steps in a Scenario

Prefer closures over module-level variables. Use `cy.wrap()` or `Cypress.env()` for values that need to cross step boundaries:

```typescript
// Option 1: closure variable (reset per test file load — safe within one feature)
let createdOrderId: string

When('the user places an order', () => {
  orderPage.placeOrder().then((id) => {
    createdOrderId = id
  })
})

Then('the order confirmation shows the order number', () => {
  cy.wrap(createdOrderId).should('not.be.undefined')
  confirmationPage.getOrderId().should('eq', createdOrderId)
})

// Option 2: cy.wrap with alias
When('the user places an order', () => {
  orderPage.placeOrder().as('orderId')
})

Then('the order confirmation shows the order number', () => {
  cy.get('@orderId').then((id) => {
    confirmationPage.getOrderId().should('eq', id)
  })
})
```

**Never** use module-level variables that accumulate state across multiple test runs.

## DataTable Handling

```typescript
import { DataTable } from '@badeball/cypress-cucumber-preprocessor'

// hashes() — array of objects keyed by header row
Given('the following products exist:', (table: DataTable) => {
  table.hashes().forEach(row => {
    // row = { name: 'Widget', price: '9.99', category: 'tools' }
    adminPage.createProduct(row)
  })
})

// rows() — array of arrays (no header)
When('the user selects the following options:', (table: DataTable) => {
  table.rows().forEach(([option]) => {
    filterPage.select(option)
  })
})

// rowsHash() — two-column table as key/value map
Given('the user profile has:', (table: DataTable) => {
  const data = table.rowsHash()
  // data = { name: 'Alice', role: 'admin' }
  profilePage.fill(data)
})
```

## Step Reuse Across Features

Place shared steps in `cypress/support/step_definitions/shared/`:

```typescript
// cypress/support/step_definitions/shared/navigation.steps.ts
import { Given } from '@badeball/cypress-cucumber-preprocessor'

Given('the user navigates to {string}', (path: string) => {
  cy.visit(path)
})

Given('the page has loaded', () => {
  cy.get('body').should('be.visible')
})
```

These are automatically discovered and available in all feature files.
