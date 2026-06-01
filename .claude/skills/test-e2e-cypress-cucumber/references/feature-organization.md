# Feature-Based Organization

## When to Switch from Flat to Feature-Based

Start with a **flat structure** and migrate to **feature-based** when you cross these thresholds:

| Signal | Action |
|--------|--------|
| More than ~15 feature files | Group by feature |
| Multiple teams owning different areas | Group by team/domain |
| Tests for same feature scattered in different files | Consolidate into feature folder |
| `pages/` has 10+ files | Consider feature subfolders |

---

## Level 1: Flat Structure (small projects, < 15 features)

Best for: small apps, single developer, early stage projects.

```
tests/e2e/
  features/
    login.feature
    register.feature
    dashboard.feature
    profile.feature
    settings.feature
  step_definitions/
    login.steps.ts
    register.steps.ts
    dashboard.steps.ts
  pages/
    LoginPage.ts
    RegisterPage.ts
    DashboardPage.ts
  support/
    hooks.ts
    commands.ts
```

Simple, easy to navigate. No nesting required.

---

## Level 2: Feature-Grouped (medium projects, 15–50 features)

Best for: growing teams, clear feature boundaries.

```
tests/e2e/
  features/
    auth/
      login.feature
      register.feature
      password-reset.feature
    dashboard/
      dashboard-overview.feature
      dashboard-widgets.feature
    user-management/
      profile.feature
      settings.feature
      notifications.feature
    orders/
      create-order.feature
      order-history.feature
  step_definitions/
    auth/
      login.steps.ts
      register.steps.ts
    dashboard/
      dashboard.steps.ts
    orders/
      orders.steps.ts
  pages/
    auth/
      LoginPage.ts
      RegisterPage.ts
      PasswordResetPage.ts
    dashboard/
      DashboardPage.ts
    user-management/
      ProfilePage.ts
      SettingsPage.ts
    orders/
      CreateOrderPage.ts
      OrderHistoryPage.ts
  support/
    hooks.ts
    commands.ts
    world.ts        ← optional, only if steps share scenario-scoped data
```

Mirror the feature structure between `features/`, `step_definitions/`, and `pages/`.

---

## Level 3: Domain-Based (large projects, 50+ features, multi-team)

Best for: monorepos, large teams, multiple product areas.

```
tests/e2e/
  features/
    auth/
      login.feature
      sso.feature
    catalog/
      product-search.feature
      product-detail.feature
    cart/
      add-to-cart.feature
      cart-summary.feature
    checkout/
      payment.feature
      confirmation.feature
    a11y/
      homepage-a11y.feature
    visual/
      homepage-visual.feature
  step_definitions/
    auth/
    catalog/
    cart/
    checkout/
    common/          ← shared steps used across domains
  pages/
    auth/
    catalog/
    cart/
    checkout/
  fixtures/          ← cypress/fixtures/ JSON files per domain
    auth/
    catalog/
    checkout/
  support/
    hooks.ts
    commands.ts
    world.ts
  utils/
    builders/
      user-builder.ts
      product-builder.ts
```

---

## Configuring cypress.config.ts for Multiple Test Types

When using Level 3 structure, use `specPattern` and npm scripts to target subsets:

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';

export default defineConfig({
  e2e: {
    // Default: run all feature files
    specPattern: 'tests/e2e/features/**/*.feature',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
      return config;
    },
    env: {
      tags: '@regression',
      filterSpecs: true,
      omitFiltered: true,
    },
  },
});
```

```json
// package.json — scripts for targeting test subsets
{
  "scripts": {
    "test:e2e": "cypress run",
    "test:e2e:auth": "cypress run --spec='tests/e2e/features/auth/**/*.feature'",
    "test:e2e:checkout": "cypress run --spec='tests/e2e/features/checkout/**/*.feature'",
    "test:e2e:a11y": "cypress run --env tags='@a11y'",
    "test:e2e:visual": "cypress run --env tags='@visual'",
    "test:e2e:smoke": "cypress run --env tags='@smoke'",
    "test:e2e:regression": "cypress run --env tags='@smoke or @regression'"
  }
}
```

Run specific groups:

```bash
npm run test:e2e:auth
npm run test:e2e:checkout
npm run test:e2e:a11y
npx cypress run --spec="tests/e2e/features/cart/**"
```

---

## Sharing Fixtures Across Features

Cypress fixtures are JSON files in `cypress/fixtures/`. Load them in steps or hooks:

```typescript
// Load a fixture in a step
Given('the catalog has products', () => {
  cy.fixture('catalog/products.json').as('products');
});

// Intercept and return fixture data
Given('la API de productos devuelve datos de prueba', () => {
  cy.intercept('GET', '**/api/products', { fixture: 'catalog/products.json' }).as('getProducts');
});
```

For shared test data builders, use utility functions:

```typescript
// tests/e2e/utils/builders/user-builder.ts
export function buildUser(overrides = {}) {
  return {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPass123!',
    name: 'Test User',
    ...overrides,
  };
}
```

---

## Decision Guide

```
New project (< 15 features)?
  → Use Level 1: flat structure

Project growing (15–50 features)?
  → Use Level 2: group by feature

Multiple teams or test types (50+ features)?
  → Use Level 3: domain-based with npm scripts per domain

Not sure?
  → Start Level 1, refactor to Level 2 when you feel friction navigating files
```

---

## Anti-Patterns to Avoid

| Anti-pattern | Problem | Fix |
|---|---|---|
| Selectors hardcoded in step definitions | Brittle, hard to maintain | Always use Page Object static selectors |
| Step definitions mixed with feature files | Confusing structure | Keep `features/` and `step_definitions/` as separate sibling folders |
| One giant step definitions file | Hard to find steps | Split by domain matching feature folder structure |
| Feature folder with > 10 feature files | Too large | Add a sub-level: `features/orders/history/`, `features/orders/creation/` |
| `cy.wait(ms)` in step definitions | Flaky tests | Use `cy.wait('@alias')` or rely on Cypress retry-ability |
