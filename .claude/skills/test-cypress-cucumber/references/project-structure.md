# Project Structure

Folder layout for `@badeball/cypress-cucumber-preprocessor` + Cypress projects by complexity level.

All BDD test files live under `tests/e2e/` alongside existing app source. `cypress.config.ts` stays at the **project root** (where Cypress looks for it by default). Configure `specPattern` and `supportFile` to point into `tests/e2e/`.

---

## Level 1 — Basic (1–5 feature files, single developer)

```
my-project/
├── cypress.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
│
└── tests/
      └── e2e/
          ├── features/                 ← Archivos .feature (Gherkin / Cucumber)
          │   └── login.feature
          │
          ├── step_definitions/          ← Archivos de pasos de features
          │   └── login.steps.ts
          │
          ├── support/
          │   ├── e2e.ts                 ← Cypress support entry point
          │   └── commands.ts            ← Custom Cypress commands
          │
          └── reports/                   ← gitignored, generated at runtime
```

Best for: prototypes, single feature, learning BDD.

---

## Level 2 — Intermediate (5–15 feature files, Page Objects added)

```
my-project/
├── cypress.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
└── tests/
      └── e2e/
          ├── features/
          │   ├── auth/
          │   │   ├── login.feature
          │   │   └── register.feature
          │   └── checkout/
          │       └── checkout.feature
          │
          ├── step_definitions/
          │   ├── auth/
          │   │   ├── login.steps.ts
          │   │   └── register.steps.ts
          │   ├── checkout/
          │   │   └── checkout.steps.ts
          │   └── shared/
          │       └── common.steps.ts    ← reusable steps (navigation, assertions)
          │
          ├── pages/                     ← Page Objects (see cypress-automation)
          │   ├── auth/
          │   │   ├── LoginPage.ts
          │   │   └── RegisterPage.ts
          │   └── checkout/
          │       └── CheckoutPage.ts
          │
          ├── support/
          │   ├── e2e.ts
          │   └── commands.ts
          │
          └── reports/
```

---

## Level 3 — Advanced (15+ feature files, hooks + config + fixtures)

```
my-project/
├── cypress.config.ts
├── tsconfig.json
├── package.json
├── .gitignore
├── .env.dev
├── .env.qa
├── .env.prod
└── tests/
      └── e2e/
          ├── features/
          │   ├── auth/
          │   ├── catalog/
          │   ├── cart/
          │   └── checkout/
          │
          ├── step_definitions/
          │   ├── auth/
          │   ├── catalog/
          │   ├── cart/
          │   ├── checkout/
          │   └── shared/
          │
          ├── pages/                     ← Page Objects
          │   ├── auth/
          │   ├── catalog/
          │   ├── cart/
          │   └── checkout/
          │
          ├── support/
          │   ├── e2e.ts
          │   ├── commands.ts
          │   └── hooks.ts               ← Before/After hooks (@badeball)
          │
          ├── utils/
          │   ├── config.ts              ← Environment variables via Cypress.env()
          │   └── data-helpers.ts        ← Test data factories
          │
          ├── fixtures/
          │   ├── auth/
          │   │   └── users.json
          │   └── products.json
          │
          └── reports/
```

---

## Level 4 — Enterprise (50+ feature files, multi-team, CI/CD)

```
my-project/
├── cypress.config.ts          ← specPattern + filterSpecs + omitFiltered
├── tsconfig.json
├── package.json
├── .gitignore
├── cucumber-html-report.js    ← multiple-cucumber-html-reporter script
├── .env.dev
├── .env.qa
├── .env.prod
└── tests/
    └── e2e/
        ├── features/
        │   ├── auth/
        │   ├── catalog/
        │   ├── cart/
        │   ├── checkout/
        │   └── admin/
        │
        ├── step_definitions/          ← Mirrors features/ structure
        │   ├── auth/
        │   ├── catalog/
        │   ├── cart/
        │   ├── checkout/
        │   ├── admin/
        │   └── shared/
        │
        ├── pages/                     ← Page Objects (see cypress-automation)
        │   ├── auth/
        │   ├── catalog/
        │   ├── cart/
        │   ├── checkout/
        │   └── admin/
        │
        ├── support/
        │   ├── e2e.ts
        │   ├── commands.ts
        │   └── hooks.ts
        │
        ├── utils/
        │   ├── config.ts
        │   ├── data-helpers.ts
        │   └── api-client.ts          ← Direct API calls for test setup
        │
        ├── fixtures/
        │   ├── auth/
        │   ├── users/
        │   └── products/
        │
        ├── cucumber-json/             ← gitignored, generated at runtime
        │
        └── reports/                   ← gitignored, generated at runtime
            └── cucumber/

.github/
└── workflows/
    └── cypress-cucumber.yml       ← CI pipeline
```

---

## Folder Purpose Reference

| Folder | Contents | Notes |
|--------|----------|-------|
| `tests/e2e/features/` | `.feature` files (Gherkin) | Group by domain |
| `tests/e2e/step_definitions/` | TypeScript step files | Mirror `tests/e2e/features/` structure |
| `tests/e2e/pages/` | Page Object classes | See `cypress-automation` skill |
| `tests/e2e/support/` | `e2e.ts`, `commands.ts`, `hooks.ts` | Cypress support entry point + lifecycle hooks |
| `tests/e2e/utils/` | Config, helpers | Read from `Cypress.env()`, no `cy.*` in config |
| `tests/e2e/fixtures/` | Static JSON test data | Loaded with `cy.fixture()` |
| `tests/e2e/cucumber-json/` | JSON output from preprocessor | Must be gitignored |
| `tests/e2e/reports/` | Generated HTML/JSON reports | Must be gitignored |

---

## cypress.config.ts Root-Level Settings

```typescript
export default defineConfig({
  e2e: {
    specPattern: 'tests/e2e/features/**/*.feature',
    supportFile: 'tests/e2e/support/e2e.ts',
    // ...
  },
})
```

---

## .gitignore

```
# Cypress runtime output
e2e/cucumber-json/
e2e/reports/
cypress/videos/
cypress/screenshots/

# Node
node_modules/
dist/

# Environment
.env
.env.local
cypress.env.json
```

---

## tsconfig.json Path Aliases

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@pages/*":    ["e2e/pages/*"],
      "@utils/*":    ["e2e/utils/*"],
      "@support/*":  ["e2e/support/*"],
      "@fixtures/*": ["e2e/fixtures/*"]
    }
  }
}
```

Import cleanly in step definitions:
```typescript
import { LoginPage } from '@pages/auth/LoginPage';
import { config }    from '@utils/config';
```

---

## Decision Guide

```
1–5 feature files, learning BDD?
  → Level 1: flat structure

5–15 features, need Page Objects?
  → Level 2: feature subfolders + e2e/pages/

15+ features, multiple developers?
  → Level 3: add e2e/support/hooks.ts + e2e/utils/ + e2e/fixtures/

50+ features, multiple teams, CI/CD pipelines?
  → Level 4: full enterprise with reporting + CI workflow
```
