# Project Structure

Folder layout for `@cucumber/cucumber` + Playwright projects by complexity level.

## Agreements on root e2e testing folder

- E2E / BDD: Centralize in a dedicated top-level tests/e2e/ folder (alternatively, it could be e2e/ folder if the user prefers).
- All BDD test files live under tests/e2e/ alongside existing Playwright specs. 
- `cucumber.js` stays at the **project root** (where the Cucumber CLI looks for it by default).

---

## Level 1 — Basic (1–5 feature files, single developer)

```
my-project/
├── cucumber.js
├── tsconfig.json
├── package.json
├── .gitignore
│
└──tests/
      └── e2e/
          ├── features/
          │   └── login.feature
          │
          ├── step_definitions/
          │   └── login.steps.ts
          │
          └── reports/                   ← gitignored, generated at runtime
              └── cucumber-report.html
```

Best for: prototypes, single feature, learning BDD.

---

## Level 2 — Intermediate (5–15 feature files, Page Objects added)

```
my-project/
├── cucumber.js
├── tsconfig.json
├── package.json
├── .gitignore
│
└──tests/
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
          ├── pages/                     ← Page Objects (see playwright-automation-expert)
          │   ├── auth/
          │   │   ├── LoginPage.ts
          │   │   └── RegisterPage.ts
          │   └── checkout/
          │       └── CheckoutPage.ts
          │
          └── reports/
```

---

## Level 3 — Advanced (15+ feature files, World + hooks + config)

```
my-project/
├── cucumber.js
├── tsconfig.json
├── package.json
├── .gitignore
│
└──tests/
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
          │   ├── world.ts               ← Custom World (browser/context/page)
          │   └── hooks.ts               ← Before/After browser lifecycle
          │
          ├── utils/
          │   ├── config.ts              ← Environment variables
          │   └── data-helpers.ts        ← Test data factories
          │
          ├── test-data/
          │   ├── auth/                  ← *.auth.json files (gitignored)
          │   └── fixtures/              ← Static JSON test data
          │
          └── reports/
```

---

## Level 4 — Enterprise (50+ feature files, multi-team, CI/CD)

```
my-project/
├── cucumber.js                ← Multi-profile config
├── tsconfig.json
├── package.json
├── .gitignore
│
└──tests/
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
          ├── pages/                     ← Page Objects (see playwright-automation-expert)
          │   ├── auth/
          │   ├── catalog/
          │   ├── cart/
          │   ├── checkout/
          │   └── admin/
          │
          ├── support/
          │   ├── world.ts
          │   └── hooks.ts
          │
          ├── utils/
          │   ├── config.ts
          │   ├── data-helpers.ts
          │   └── api-client.ts          ← Direct API calls for test setup
          │
          ├── test-data/
          │   ├── auth/                  ← gitignored *.auth.json
          │   ├── users/
          │   └── products/
          │
          └── reports/                   ← gitignored
              ├── cucumber-report.html
              ├── cucumber-report.json
              └── junit-report.xml

.github/
└── workflows/
    └── cucumber.yml               ← CI pipeline
```

---

## Folder Purpose Reference

| Folder | Contents | Notes |
|--------|----------|-------|
| `tests/e2e/features/` | `.feature` files (Gherkin) | Group by domain |
| `tests/e2e/step_definitions/` | TypeScript step files | Mirror `tests/e2e/features/` structure |
| `tests/e2e/pages/` | Page Object classes | See `playwright-automation-expert` |
| `tests/e2e/support/` | `world.ts`, `hooks.ts` | Browser lifecycle management |
| `tests/e2e/utils/` | Config, helpers | No Playwright `page` in config/helpers |
| `tests/e2e/test-data/auth/` | `*.auth.json` storage state | Must be gitignored |
| `tests/e2e/reports/` | Generated HTML/JSON/XML | Must be gitignored |

---

## .gitignore

```
# Reports
tests/e2e/reports/

# Auth state
tests/e2e/test-data/auth/*.auth.json

# Node
node_modules/
dist/

# Environment
.env
.env.local
```

---

## tsconfig.json Path Aliases

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@pages/*":   ["tests/e2e/pages/*"],
      "@utils/*":   ["tests/e2e/utils/*"],
      "@support/*": ["tests/e2e/support/*"]
    }
  }
}
```

Import cleanly in step definitions:
```typescript
import { LoginPage }       from '@pages/auth/LoginPage';
import { config }          from '@utils/config';
import { PlaywrightWorld } from '@support/world';
```

---

