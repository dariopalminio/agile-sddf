# Selectors & Locators

## Selector Priority (Best to Worst)

```typescript
// 1. data-testid (BEST — stable, explicit contract between app and tests)
cy.get("[data-testid='submit-button']")
cy.get("[data-testid='user-avatar']")

// 2. Accessible queries via @testing-library/cypress (optional plugin)
cy.findByRole('button', { name: 'Submit' })
cy.findByLabelText('Email address')
cy.findByPlaceholderText('Enter your email')

// 3. Text content
cy.contains('Welcome back')
cy.contains('button', 'Submit')          // Scoped to element type

// 4. ARIA attributes (good for accessible elements without data-testid)
cy.get('[aria-label="Close dialog"]')
cy.get('[role="dialog"]')

// 5. CSS class / ID (AVOID — brittle, couples tests to implementation)
cy.get('#email-input')                   // Last resort: IDs
cy.get('.submit-btn')                    // Avoid: CSS classes change
```

## data-testid Selectors (Preferred)

This project uses `data-testid` as the **exclusive selector strategy** for Page Objects.

```html
<!-- Add in HTML/JSX -->
<button data-testid="submit-button">Submit</button>
<input data-testid="email-input" type="email" />
<div data-testid="error-message">Invalid email</div>
```

```typescript
// In Page Objects — always static strings
export class LoginPage {
  static readonly emailInput    = "[data-testid='email-input']";
  static readonly passwordInput = "[data-testid='password-input']";
  static readonly submitButton  = "[data-testid='submit-button']";
  static readonly errorMessage  = "[data-testid='error-message']";
}

// In step definitions — use Page Object selectors, never hardcode
cy.get(LoginPage.emailInput).type('user@test.com');
cy.get(LoginPage.submitButton).click();
cy.get(LoginPage.errorMessage).should('be.visible');
```

## Scoped Selectors (cy.within)

Use `cy.within()` to scope commands to a container, reducing selector noise:

```typescript
// Scope all commands to a specific section
cy.get("[data-testid='user-card']").within(() => {
  cy.get("[data-testid='user-name']").should('have.text', 'John Doe');
  cy.get("[data-testid='edit-button']").click();
});

// Find within a table row
cy.get("[data-testid='orders-table']").within(() => {
  cy.contains('tr', 'Order #123').within(() => {
    cy.get("[data-testid='delete-button']").click();
  });
});
```

## Chained Selectors

```typescript
// Find child within parent
cy.get("[data-testid='product-card']").find("[data-testid='buy-button']").click();

// Find by text within a scoped element
cy.get("[data-testid='order-list']").contains('Order #123');

// Combine: find parent that contains specific child
cy.get("[data-testid='order-item']").filter(':contains("Order #123")').click();
```

## Handling Multiple Elements

> **Caution:** Avoid `.eq()`, `.first()`, and `.last()` unless the position is semantically meaningful and documented. These selectors break silently when the DOM order changes. Prefer `cy.contains()` with a unique value or a unique `data-testid` to target a specific element.

```typescript
// Get nth element (0-indexed) — use only when position is semantically meaningful
cy.get("[data-testid='list-item']").eq(0);
cy.get("[data-testid='list-item']").first();
cy.get("[data-testid='list-item']").last();

// Count elements
cy.get("[data-testid='list-item']").should('have.length', 3);
cy.get("[data-testid='list-item']").its('length').should('be.gte', 1);

// Iterate — use .each()
cy.get("[data-testid='list-item']").each(($el) => {
  cy.wrap($el).should('be.visible');
});
```

## Aliases

Use `.as()` to name elements and network intercepts for later reuse:

```typescript
// Element alias
cy.get("[data-testid='submit-button']").as('submitBtn');
cy.get('@submitBtn').click();
cy.get('@submitBtn').should('be.disabled');

// Network intercept alias
cy.intercept('GET', '**/api/orders').as('getOrders');
cy.visit('/orders');
cy.wait('@getOrders');

// Fixture alias
cy.fixture('users.json').as('users');
cy.get('@users').then((users) => {
  cy.get("[data-testid='email-input']").type(users.standard.email);
});
```

## Waiting for Elements

Cypress retries automatically — never use `cy.wait(ms)` to wait for DOM changes.

```typescript
// ✓ Let Cypress retry until the assertion passes
cy.get("[data-testid='success-message']").should('be.visible');
cy.get("[data-testid='loading-spinner']").should('not.exist');
cy.get("[data-testid='result-count']").should('have.text', '5 results');

// ✓ Wait for a network request (always via alias)
cy.wait('@getOrders');

// ✗ Never use arbitrary waits
cy.wait(2000); // Flaky — don't do this
```

## @testing-library/cypress (Optional)

For accessible role-based queries similar to Playwright's `getByRole`:

```bash
npm install --save-dev @testing-library/cypress
```

```typescript
// cypress/support/commands.ts
import '@testing-library/cypress/add-commands';
```

```typescript
// Usage in tests
cy.findByRole('button', { name: 'Submit' }).click();
cy.findByLabelText('Email address').type('user@test.com');
cy.findByText('Welcome back').should('be.visible');
cy.findByPlaceholderText('Search...').type('product');
```

## Quick Reference

| Goal | Cypress Command |
|------|----------------|
| By `data-testid` | `cy.get("[data-testid='name']")` |
| By text | `cy.contains('text')` or `cy.contains('tag', 'text')` |
| By ARIA role (with plugin) | `cy.findByRole('button', { name: 'Submit' })` |
| By label (with plugin) | `cy.findByLabelText('Email')` |
| Scoped to parent | `cy.get('[data-testid="parent"]').within(() => { ... })` |
| Find child | `cy.get('[data-testid="parent"]').find('[data-testid="child"]')` |
| Count | `.should('have.length', N)` |
| Nth element | `.eq(N)` — use only when position is meaningful |
| Assert visible | `.should('be.visible')` |
| Assert text | `.should('have.text', 'exact')` or `.should('contain.text', 'partial')` |
| Assert not exist | `.should('not.exist')` |
| Reuse as alias | `.as('name')` then `cy.get('@name')` |
