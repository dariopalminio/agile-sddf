# Hooks and Custom Commands

## Hooks (from @badeball/cypress-cucumber-preprocessor)

Import hooks from the preprocessor package — **not** from `cypress/support/e2e.ts` global hooks:

```typescript
import { Before, After, BeforeAll, AfterAll } from '@badeball/cypress-cucumber-preprocessor'
```

### Hook Execution Order

| Hook | Runs | cy.* available | World |
|---|---|---|---|
| `BeforeAll` | Once before all scenarios | No | No |
| `Before` | Before each scenario | Yes | No |
| `After` | After each scenario | Yes | No |
| `AfterAll` | Once after all scenarios | No | No |

### Before / After

```typescript
Before(() => {
  // Runs before every scenario
  // Good place for: clear storage, reset state, log scenario name
  cy.clearCookies()
  cy.clearLocalStorage()
})

After(() => {
  // Custom teardown per scenario
  // screenshotOnRunFailure in cypress.config.ts handles screenshots automatically
})
```

### Tagged Hooks

```typescript
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

Before({ tags: '@admin' }, () => {
  cy.session('admin-user', () => {
    cy.request('POST', '/api/auth/login', {
      email: Cypress.env('ADMIN_USER_EMAIL'),
      password: Cypress.env('ADMIN_USER_PASSWORD'),
    })
  })
})
```

### BeforeAll / AfterAll Limitations

These hooks run **outside** the Cypress browser context:
- No `cy.*` commands allowed
- No DOM access
- Use only for: calling external APIs via `cy.task()` equivalents if placed in plugins, or skip them unless necessary

## Custom Commands

Custom commands reduce repetition in step definitions. Define in `cypress/support/commands.ts`, import in `cypress/support/e2e.ts`.

### getByTestId

```typescript
Cypress.Commands.add('getByTestId', (id: string) =>
  cy.get(`[data-testid="${id}"]`)
)

// Usage in step definitions (via Page Objects):
// cy.getByTestId('submit-button').click()
```

### cy.session() for Authentication

`cy.session()` caches and restores browser session state, preventing login on every scenario:

```typescript
Before({ tags: '@authenticated' }, () => {
  cy.session(
    'user-session',
    () => {
      cy.visit('/login')
      cy.get('[data-testid="email"]').type(Cypress.env('TEST_USER_EMAIL'))
      cy.get('[data-testid="password"]').type(Cypress.env('TEST_USER_PASSWORD'))
      cy.get('[data-testid="submit"]').click()
      cy.url().should('include', '/dashboard')
    },
    {
      validate: () => {
        cy.request('/api/me').its('status').should('eq', 200)
      },
    }
  )
})
```

### Custom Commands vs Page Objects

| Use Case | Correct Abstraction |
|---|---|
| Repeatable UI interactions tied to a feature (login, add to cart) | Page Object method |
| Cross-cutting Cypress utilities (`getByTestId`, `login`, `interceptApi`) | Custom Command |
| One-off assertions in a single step | Inline `cy.get().should()` in the step |
