# E2E Testing without Cucumber

Always try to use Cucumber.
If the project doesn't have Cucumber in its installed stack, always try to use the Gherkin format for end-to-end testing.

## E2E Test Strategy When Not Using Cucumber

```typescript
// Critical user paths to test
const criticalPaths = [
  'User registration and login',
  'Core product/service workflow',
  'Payment/checkout flow',
  'Settings and profile management',
];
```

## BDD/Gherkin User Flow Testing (recommended when not using Cucumber)

If acceptance criteria for a story includes Gherkin scenarios, maintain Gherkin nomenclature.
To maintain a Gherkin unified standard (BDD without forcing Cucumber), use:
- `cy.step()` via [`cypress-plugin-steps`](https://github.com/filiphric/cypress-plugin-steps), or structure with `cy.log()` as a lightweight alternative.
- Standardizing the prefixes that appear in the Cypress log: `Given`, `When`, `Then`, and `And`.

```typescript
// With cy.log() (no extra plugin required)
/**
Feature: Successful registration

  Scenario: Successful registration
    Given the user is on register page
    When user completes the form and submits
    Then dashboard appears with welcome

**/
it('complete registration', () => {
  // Given
  cy.log('Given the user is on register page');
  cy.visit('/register');

  // When
  cy.log('When user completes the form and submits');
  cy.get('[data-testid="email-input"]').type('new@example.com');
  cy.get('[data-testid="password-input"]').type('SecurePass123!');
  cy.get('[data-testid="confirm-password-input"]').type('SecurePass123!');
  cy.get('[data-testid="register-button"]').click();

  // Then
  cy.log('Then dashboard appears with welcome');
  cy.url().should('match', /dashboard/);
  cy.get('[data-testid="welcome-message"]').should('be.visible');
});
```

## Classic User Flow Testing (example)

```typescript
// Not recommended for Gherkin scenarios — less legibility in reports.

describe('User Registration Flow', () => {
  it('complete registration', () => {
    cy.visit('/register');

    cy.get('[data-testid="email-input"]').type('new@example.com');
    cy.get('[data-testid="password-input"]').type('SecurePass123!');
    cy.get('[data-testid="confirm-password-input"]').type('SecurePass123!');
    cy.get('[data-testid="register-button"]').click();

    cy.url().should('match', /dashboard/);
    cy.get('[data-testid="welcome-message"]').should('be.visible');
  });

  it('shows validation errors', () => {
    cy.visit('/register');

    cy.get('[data-testid="email-input"]').type('invalid');
    cy.get('[data-testid="register-button"]').click();

    cy.get('[data-testid="email-error"]').should('contain.text', 'Invalid email');
  });
});
```

## BDD/Gherkin Checkout Flow (recommended when not using Cucumber)

```typescript
/**
Feature: Checkout

  Scenario: Complete purchase
    Given a user adds a product to the cart
    When the user proceeds to checkout
    And completes the payment form
    Then the order should be confirmed

**/
describe('Checkout Flow', () => {
  it('complete purchase', () => {

    // Given
    cy.log('Given a user adds a product to the cart');
    cy.visit('/products/123');
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="cart-count"]').should('have.text', '1');

    // When
    cy.log('When the user proceeds to checkout');
    cy.visit('/cart');
    cy.get('[data-testid="checkout-button"]').click();

    // And
    cy.log('And completes the payment form');
    cy.get('[data-testid="card-number-input"]').type('4242424242424242');
    cy.get('[data-testid="expiry-input"]').type('12/25');
    cy.get('[data-testid="cvc-input"]').type('123');
    cy.get('[data-testid="pay-button"]').click();

    // Then
    cy.log('Then the order should be confirmed');
    cy.url().should('match', /order-confirmation/);
    cy.get('[data-testid="confirmation-message"]').should('be.visible');
  });
});
```

## Classic Checkout Flow (example)

```typescript
// Not recommended for Gherkin scenarios.
describe('Checkout Flow', () => {
  it('complete purchase', () => {
    // Add to cart
    cy.visit('/products/123');
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.get('[data-testid="cart-count"]').should('have.text', '1');

    // Checkout
    cy.visit('/cart');
    cy.get('[data-testid="checkout-button"]').click();

    // Payment
    cy.get('[data-testid="card-number-input"]').type('4242424242424242');
    cy.get('[data-testid="expiry-input"]').type('12/25');
    cy.get('[data-testid="cvc-input"]').type('123');
    cy.get('[data-testid="pay-button"]').click();

    // Confirmation
    cy.url().should('match', /order-confirmation/);
    cy.get('[data-testid="confirmation-message"]').should('be.visible');
  });
});
```

## Test Data Management

It is excellent practice to keep data out of scenarios, especially when complex or reused.
Externalize data to `cypress/fixtures/` JSON files and reference them in tests.

```typescript
// cypress/fixtures/testUsers.json
// {
//   "standard": { "email": "standard@test.com", "password": "TestPass123!" },
//   "admin":    { "email": "admin@test.com",    "password": "AdminPass123!" }
// }

describe('Login Flow', () => {
  beforeEach(() => {
    // Seed test data via API before each test
    cy.request('POST', '/api/test/seed');
  });

  afterEach(() => {
    // Clean up
    cy.request('POST', '/api/test/cleanup');
  });

  it('standard user can log in', () => {
    cy.fixture('testUsers').then((users) => {
      cy.visit('/login');
      cy.get('[data-testid="email-input"]').type(users.standard.email);
      cy.get('[data-testid="password-input"]').type(users.standard.password);
      cy.get('[data-testid="login-button"]').click();
      cy.url().should('match', /dashboard/);
    });
  });
});
```

## Cross-Browser Testing

Cypress supports Chrome, Edge, Firefox, and Electron. Configure in `cypress.config.ts`:

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // No browser config in cypress.config.ts — specify at CLI
  },
});
```

```bash
# Run on specific browsers
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge

# Run headed on chrome
npx cypress run --browser chrome --headed
```

> Cypress does not support Safari (WebKit) natively. For cross-browser parity with Safari, consider Playwright for that subset.
