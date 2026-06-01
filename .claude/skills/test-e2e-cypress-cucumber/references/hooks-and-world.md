# Hooks & World

Managing scenario lifecycle, shared scenario context, and setup/teardown with `@badeball/cypress-cucumber-preprocessor`.

---

## Key Difference from Playwright Cucumber

In Cypress, **there is no browser lifecycle to manage in hooks**. Cypress launches and manages the browser automatically. Hooks are only needed for:
- Seeding/cleaning test data via `cy.request()`
- Setting cookies or local storage before a scenario
- Taking screenshots on failure
- Running tagged setup (e.g., authenticate before `@authenticated` scenarios)

---

## Hooks

```typescript
// tests/e2e/support/hooks.ts
import { Before, After, BeforeAll, AfterAll } from '@badeball/cypress-cucumber-preprocessor';

// ── Global setup (runs once before ALL scenarios in a spec file) ───────────
BeforeAll(function () {
  // WARNING: cy.* commands are NOT available here
  // Use for: any pure JS setup that doesn't need Cypress commands
  // Note: in Cypress, BeforeAll runs once per spec file, not globally across files
});

// ── Per-scenario setup (runs before EACH scenario) ─────────────────────────
Before(function () {
  // cy.* commands ARE available here
  // Use for: clearing cookies, resetting app state, seeding data via cy.request()
  cy.clearCookies();
  cy.clearLocalStorage();
});

// ── Tagged hook — only runs before @authenticated scenarios ────────────────
Before({ tags: '@authenticated' }, function () {
  cy.setCookie('auth_token', Cypress.env('TEST_AUTH_TOKEN') || 'test-token');
  // Or use cy.session() for more complete auth state reuse:
  // cy.session('auth', () => {
  //   cy.request('POST', '/api/auth/login', { email: '...', password: '...' })
  //     .then((res) => cy.setCookie('auth_token', res.body.token));
  // });
});

// ── Tagged hook — seed data before @with-products scenarios ───────────────
Before({ tags: '@with-products' }, function () {
  cy.request('POST', `${Cypress.env('API_BASE_URL')}/api/test/seed/products`);
});

// ── Per-scenario teardown (runs after EACH scenario) ───────────────────────
After(function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    // Cypress automatically takes a screenshot; this adds a named one
    cy.screenshot(`${scenario.pickle.name} - FAILED`);
  }
});

// ── Global teardown (runs once after ALL scenarios in a spec file) ─────────
AfterAll(function () {
  // WARNING: cy.* commands are NOT available here
  // Use for: pure JS cleanup after all scenarios in the spec
});
```

---

## Hook Order and Priority

When multiple `Before` hooks apply to the same scenario, use `order` to control execution sequence:

```typescript
Before({ order: 1 }, function () {
  // Runs first — clear state
  cy.clearCookies();
  cy.clearLocalStorage();
});

Before({ order: 2, tags: '@authenticated' }, function () {
  // Runs second — only for @authenticated scenarios
  cy.setCookie('auth_token', Cypress.env('TEST_AUTH_TOKEN'));
});
```

`After` hooks run in **reverse** order of definition (last defined runs first).

---

## World Class (Optional)

The `World` is a per-scenario shared state object. Use it only when step definitions need to pass data between each other (e.g., an `orderId` created in a `Given` step must be used in a `Then` step).

**Use `function()` syntax (not arrow functions) in step definitions to access `this`.**

```typescript
// tests/e2e/support/world.ts
import {
  setWorldConstructor,
  World,
  IWorldOptions,
} from '@badeball/cypress-cucumber-preprocessor';

export interface CustomWorld extends World {
  // Scenario-scoped data — no browser/page/context (Cypress manages those)
  authToken?: string;
  userId?: string;
  orderId?: string;
  createdResourceId?: string;
}

export class CypressWorld extends World implements CustomWorld {
  authToken?: string;
  userId?: string;
  orderId?: string;
  createdResourceId?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CypressWorld);
```

Usage in step definitions (requires `function()` syntax, not arrow functions):

```typescript
// tests/e2e/step_definitions/orders/orders.steps.ts
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CypressWorld } from '../../support/world';

Given('el usuario crea una orden', function (this: CypressWorld) {
  cy.request('POST', `${Cypress.env('API_BASE_URL')}/api/orders`, {
    productId: 'prod-1',
    quantity: 1,
  }).then((res) => {
    this.orderId = res.body.id; // Store for use in later steps
  });
});

Then('la orden debería aparecer en el historial', function (this: CypressWorld) {
  cy.visit('/orders');
  cy.contains(this.orderId!).should('be.visible');
});
```

---

## cy.session() — Reusing Auth State

For expensive authentication flows, use `cy.session()` to cache and restore auth state across tests:

```typescript
// tests/e2e/support/hooks.ts
Before({ tags: '@authenticated' }, function () {
  cy.session(
    'user-auth',
    () => {
      // This runs once; subsequent calls restore the cached session
      cy.request({
        method: 'POST',
        url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
        body: {
          email: Cypress.env('TEST_USER_EMAIL'),
          password: Cypress.env('TEST_USER_PASSWORD'),
        },
      }).then((res) => {
        cy.setCookie('auth_token', res.body.token);
      });
    },
    {
      validate() {
        // Re-authenticate if session is invalid
        cy.getCookie('auth_token').should('exist');
      },
    },
  );
});
```

---

## BeforeAll / AfterAll Limitations

| Feature | `Before`/`After` | `BeforeAll`/`AfterAll` |
|---------|-----------------|----------------------|
| Access to `cy.*` commands | Yes | **No** |
| Runs per | Scenario | Once per spec file |
| Parallel note | Each spec file has its own lifecycle | Runs per spec file, not globally |

> For true global setup across all spec files, use `cypress/support/e2e.ts` or a `setupNodeEvents` task in `cypress.config.ts`.

---

## Quick Reference

| Hook | When | `cy.*` available? |
|------|------|-----------------|
| `BeforeAll` | Once before all scenarios in spec | No |
| `Before` | Before each scenario | Yes |
| `Before({ tags })` | Before matching scenarios only | Yes |
| `After` | After each scenario | Yes |
| `After({ tags })` | After matching scenarios only | Yes |
| `AfterAll` | Once after all scenarios in spec | No |
| `cy.session()` | Cache + restore auth state per test | Yes (inside session setup) |
