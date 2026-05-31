# Cucumber + Cypress Setup

## Required Packages

```bash
npm install --save-dev @badeball/cypress-cucumber-preprocessor @bahmutov/cypress-esbuild-preprocessor
npm install --save-dev cypress typescript
```

```json
{
  "devDependencies": {
    "@badeball/cypress-cucumber-preprocessor": "^22.0.0",
    "@bahmutov/cypress-esbuild-preprocessor": "^2.2.0",
    "cypress": "^14.0.0",
    "typescript": "^5.8.0"
  }
}
```

> **Important:** `@badeball/cypress-cucumber-preprocessor` provides `Given`/`When`/`Then` and `Before`/`After` hooks. The Cypress runner is the test executor — **not** `@cucumber/cucumber`'s CLI.

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@pages/*":    ["tests/e2e/pages/*"],
      "@utils/*":    ["tests/e2e/utils/*"],
      "@support/*":  ["tests/e2e/support/*"],
      "@fixtures/*": ["tests/e2e/fixtures/*"]
    },
    "types": ["cypress"],
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "tests/e2e/**/*.ts", "**/*.feature", "cypress.config.ts"],
  "exclude": ["node_modules", "dist", "tests/e2e/reports", "tests/e2e/cucumber-json"]
}
```

---

## cypress.config.ts — Minimal Config

```typescript
// cypress.config.ts (project root)
import { defineConfig } from 'cypress'
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import createEsbuildPlugin from '@bahmutov/cypress-esbuild-preprocessor'

export default defineConfig({
  e2e: {
    baseUrl:     process.env.VITE_APP_TO_TEST_URI ?? 'http://localhost:5173',
    specPattern: "tests/e2e/features/**/*.feature",
    supportFile: "tests/e2e/support/e2e.ts",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    env: {
      TAGS: '@regression',
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      on('file:preprocessor', createEsbuildPlugin())
      return config  // ← do not forget this
    },
  },
})
```

| Key | Purpose |
|-----|---------|
| `specPattern` | Glob to `.feature` files under `e2e/features/` |
| `supportFile` | Cypress support entry point — loads commands and hooks |
| `env.TAGS` | Default tag filter when no `--env TAGS=` is passed |
| `addCucumberPreprocessorPlugin` | Wires feature files to step definitions |
| `createEsbuildPlugin` | Compiles TypeScript step files via ESBuild |
| `return config` | Required — preprocessor modifies config; must be returned |

---

## Step Definition Discovery

The preprocessor auto-discovers step definition files — no explicit registration needed. Configure paths in `.cypress-cucumber-preprocessorrc.json` at the project root:

```json
{
  "stepDefinitions": [
      "tests/e2e/features/[filepath]/**/*.{js,ts}",
      "tests/e2e/features/[filepath].{js,ts}",
      "tests/e2e/step_definitions/**/*.{js,ts}"
  ],
  "filterSpecs": true,
  "omitFiltered": true
}
```

Or inline in `package.json`:

```json
{
  "cypress-cucumber-preprocessor": {
    "stepDefinitions": [
      "tests/e2e/step_definitions/**/*.{js,ts}"
    ],
    "filterSpecs": true,
    "omitFiltered": true
  }
}
```

| Flag | Purpose |
|------|---------|
| `filterSpecs` | Skip `.feature` files that contain no matching scenarios before compiling |
| `omitFiltered` | Hide filtered-out specs from the Cypress runner UI |

---

## tests/e2e/support/e2e.ts

Cypress support entry point — import commands and hooks here:

```typescript
// tests/e2e/support/e2e.ts
import './commands'
import './hooks'
```

---

## tests/e2e/utils/config.ts

Centralize all environment configuration here. Never hardcode URLs or credentials in step files.

```typescript
// tests/e2e/utils/config.ts
export const config = {
  baseUrl:          Cypress.env('VITE_APP_TO_TEST_URI') ?? 'http://localhost:5173',
  environment:      Cypress.env('VITE_ENV') ?? 'dev',
  timeout:          Number(Cypress.env('TIMEOUT')) || 10000,
  testUserEmail:    Cypress.env('TEST_USER_EMAIL') ?? 'user@example.com',
  testUserPassword: Cypress.env('TEST_USER_PASSWORD') ?? 'password123',
}
```

---

## package.json Scripts

```json
{
  "scripts": {
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:e2e:smoke": "cypress run --env tags=@smoke",
    "test:e2e:full": "cypress run",
    "test:e2e:core": "cypress run --env tags=@core",
    "test:e2e:regression": "cypress run --env tags=@regression",
    "test:e2e:tags": "npx cypress run --env TAGS=@regression",
    "test:e2e:report": "node cucumber-html-report.js"
  }
}
```

---

## First Run

```bash
# 1. Install dependencies
npm install

# 2. Install Cypress binary (first time only)
npx cypress install

# 3. Start the app (Terminal 1)
npm run dev

# 4. Run all tests headless (Terminal 2)
npm run test:e2e

# 5. Open interactive runner
npm run test:e2e:open

# 6. Run a single feature file
npx cypress run --spec "tests/e2e/features/auth/login.feature"

# 7. Run by ad-hoc tag
npx cypress run --env TAGS='@smoke and not @wip'

# 8. Generate HTML report
npm run test:e2e:report
```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run test:e2e` | Run default tag filter (from `env.TAGS` in config) |
| `npm run test:e2e:smoke` | Run `@smoke` tagged scenarios |
| `npm run test:e2e:core` | Run `@core` and `@smoke` tagged scenarios |
| `npm run test:e2e:full` | Run all scenarios |
| `npm run test:e2e:open` | Open Cypress interactive runner |
| `npx cypress run --env TAGS='@auth'` | Ad-hoc tag filter |
| `npx cypress run --spec "tests/e2e/features/auth/login.feature"` | Single feature file |
| `npm run test:e2e:report` | Generate HTML report from JSON output |

## More references

To configure cypress.config.ts, it's recommended to review the example that best suits your stack at:
https://github.com/badeball/cypress-cucumber-preprocessor/tree/master/examples
