# Cucumber Setup

## Required Packages

```bash
npm install --save-dev @cucumber/cucumber @playwright/test playwright ts-node typescript
npx playwright install chromium
```

```json
{
  "devDependencies": {
    "@cucumber/cucumber": "^10.0.0",
    "@playwright/test": "^1.44.0",
    "playwright": "^1.44.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.4.0"
  }
}
```

> **Important:** `@playwright/test` provides `chromium`, `expect`, and browser types.
> The Cucumber CLI (`cucumber-js`) is the test runner — **not** `@playwright/test`'s `test()`.

---

## tsconfig.json

`"module": "commonjs"` is non-negotiable. Cucumber's `require` loader does not support ESM.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "dist",
    "baseUrl": ".",
    "paths": {
      "@pages/*":   ["tests/e2e/pages/*"],
      "@utils/*":   ["tests/e2e/utils/*"],
      "@support/*": ["tests/e2e/support/*"]
    }
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "tests/e2e/reports"]
}
```

### tsconfig.json (modern ES modules + ts-node/esm)

The tsconfig.json file following is configured for a project that uses modern ES modules (with "type": "module" in its package.json), Node.js-style module resolution, and ts-node support for running TypeScript code directly in ESM environments.

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@tatians-react-ui-lib/ui": ["../../packages/ui/src"],
      "@ui-button": ["../../packages/cli/src/templates/button"],
      "@/*": ["./*"]
    },
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "esModuleInterop": true,
    "allowImportingTsExtensions": false
  },
  "ts-node": {
    "esm": true,
    "experimentalSpecifierResolution": "node"
  },
  "include": ["src", "tests/e2e"]
}
```

---

## cucumber.js — Minimal Config

```javascript
// cucumber.js (project root)
module.exports = {
  default: {
    require:       ['tests/e2e/support/hooks.ts', 'tests/e2e/step_definitions/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: [
      'progress',
      'html:tests/e2e/reports/cucumber-report.html',
    ],
    paths:        ['tests/e2e/features/**/*.feature'],
    publishQuiet: true,
  },
};
```

| Key | Purpose |
|-----|---------|
| `require` | Files loaded before tests — hooks first, then steps |
| `requireModule` | `['ts-node/register']` enables TypeScript |
| `format` | Output formatters (console + file) |
| `paths` | Glob to `.feature` files |
| `publishQuiet` | Suppresses Cucumber Cloud publishing prompt |

### cucumber.cjs — Big Config example (modern ES modules + ts-node/esm)

The cucumber.cjs file following is configured for a project that uses modern ES modules (with "type": "module" in its package.json), Node.js-style module resolution, and ts-node support for running TypeScript code directly in ESM environments.


```cjs
// cucumber.cjs — profile configuration for @cucumber/cucumber
// NOTE: Using .cjs extension because apps/demo has "type": "module" in package.json.
// Using --import with ts-node/esm loader (ESM-native TypeScript support).
//
// Usage:
//   npx cucumber-js --config cucumber.cjs                  (default profile — all non-wip)
//   npx cucumber-js --config cucumber.cjs --profile smoke  (smoke: happy path only)
//   npx cucumber-js --config cucumber.cjs --profile core   (core: smoke + variants/state)
//   npx cucumber-js --config cucumber.cjs --profile full   (full: all scenarios)
//   npx cucumber-js --config cucumber.cjs --profile ci     (CI: all + JUnit XML)

// TS_NODE_PROJECT must be set in the environment before running cucumber-js
// so that ts-node/esm picks up tsconfig.cucumber.json instead of tsconfig.json.
// The npm scripts set this via cross-env.
const common = {
  import: ['tests/e2e/support/hooks.ts', 'tests/e2e/step_definitions/**/*.ts'],
  loader: ['ts-node/esm'],
  publishQuiet: true,
};

module.exports = {

  // ── Default: run all scenarios except @wip ──────────────────────────────
  default: {
    ...common,
    paths: ['tests/e2e/features/**/*.feature'],
    tags: 'not @wip',
    format: [
      'progress',
      'html:tests/e2e/reports/cucumber-report.html',
      'json:tests/e2e/reports/cucumber-report.json',
    ],
  },

  // ── Smoke: fast sanity check — @smoke tagged scenarios only ─────────────
  smoke: {
    ...common,
    paths: ['tests/e2e/features/**/*.feature'],
    tags: '@smoke and not @wip',
    format: [
      'progress',
      'html:tests/e2e/reports/smoke-report.html',
      'json:tests/e2e/reports/smoke-report.json',
    ],
  },

  // ── Sanity: smoke + variants/state — @smoke or @sanity ─────────────────────
  sanity: {
    ...common,
    paths: ['tests/e2e/features/**/*.feature'],
    tags: '(@smoke or @sanity) and not @wip',
    format: [
      'progress',
      'html:tests/e2e/reports/sanity-report.html',
      'json:tests/e2e/reports/sanity-report.json',
    ],
  },

  // ── Regression: complete regression — all non-wip scenarios ───────────────────
  regression: {
    ...common,
    paths: ['tests/e2e/features/**/*.feature'],
    tags: 'not @wip',
    format: [
      'progress',
      'html:tests/e2e/reports/regression-report.html',
      'json:tests/e2e/reports/regression-report.json',
    ],
  },

  // ── CI: all non-wip with JUnit XML for GitHub Actions ───────────────────
  ci: {
    ...common,
    paths: ['tests/e2e/features/**/*.feature'],
    tags: 'not @wip',
    format: [
      'progress',
      'html:tests/e2e/reports/cucumber-report.html',
      'json:tests/e2e/reports/cucumber-report.json',
      'junit:tests/e2e/reports/junit-report.xml',
    ],
  },

  single: {
    ...common,
    paths: [],                         // vacío para no interferir
    // sin paths fijos, se usará el argumento de CLI
    format: ['progress'],             // opcional, puedes personalizar
  },

};

```
---

## package.json Scripts

```json
{
  "scripts": {
    "test":            "cucumber-js",
    "test:smoke":      "cucumber-js --profile smoke",
    "test:regression": "cucumber-js --profile regression",
    "test:headed":     "HEADLESS=false cucumber-js",
    "test:debug":      "HEADLESS=false SLOWMO=500 cucumber-js"
  }
}
```

### package.json Scripts
The package.json scripts following are configured for a project that uses modern ES modules (with "type": "module" in its package.json), Node.js-style module resolution, and ts-node support for running TypeScript code directly in ESM environments. The scripts set the TS_NODE_PROJECT environment variable to ensure that ts-node uses the correct tsconfig file for Cucumber tests.

```json
{
  "scripts": {
    "test:e2e": "cross-env TS_NODE_PROJECT=tsconfig.cucumber.json cucumber-js --config cucumber.cjs",
    "test:e2e:visual": "cd apps/storybook && pnpm run test:visual",
    "test:e2e:smoke": "cross-env TS_NODE_PROJECT=tsconfig.cucumber.json cucumber-js --config cucumber.cjs --profile smoke",
    "test:e2e:sanity": "cross-env TS_NODE_PROJECT=tsconfig.cucumber.json cucumber-js --config cucumber.cjs --profile sanity",
    "test:e2e:regression": "cross-env TS_NODE_PROJECT=tsconfig.cucumber.json cucumber-js --config cucumber.cjs --profile regression",
    "test:e2e:headed": "cross-env TS_NODE_PROJECT=tsconfig.cucumber.json HEADLESS=false cucumber-js --config cucumber.cjs",
    "test:e2e:debug": "cross-env TS_NODE_PROJECT=tsconfig.cucumber.json HEADLESS=false SLOWMO=500 cucumber-js --config cucumber.cjs",
    "lint:e2e": "eslint tests/e2e",
    "typecheck:e2e": "tsc --noEmit --project tsconfig.cucumber.json && echo \"Typecheck passed\""
}
```

---

## e2e/utils/config.ts

Centralize all environment configuration here. Never hardcode URLs or credentials in steps.

```typescript
// e2e/utils/config.ts
export const config = {
  baseUrl:  process.env.BASE_URL  || 'http://localhost:3000',
  headless: process.env.HEADLESS  !== 'false',
  slowMo:   Number(process.env.SLOWMO) || 0,
  timeout:  Number(process.env.TIMEOUT) || 30000,
};
```

---

## First Run

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install chromium

# 3. Run all tests
npm test

# 4. Run smoke tests only
npm run test:smoke

# 5. Run a single feature file
npx cucumber-js tests/e2e/features/auth/login.feature

# 6. Run by ad-hoc tag
npx cucumber-js --tags "@login and not @wip"

# 7. Run headed (visible browser) for debugging
npm run test:headed

# 8. Run a single feature file with Cucumber and pnpm, using cucumber.cjs — Big Config example
pnpm exec cucumber-js --profile single tests/e2e/features/auth/login.feature

# 9. Run smoke tests only with pnpm
pnpm run test:smoke

```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm test` | Run default profile |
| `npm run test:smoke` | Run `@smoke` tagged scenarios |
| `npm run test:regression` | Run `@regression` (excluding `@wip`) |
| `npx cucumber-js --tags "@tag"` | Ad-hoc tag filter |
| `npx cucumber-js tests/e2e/features/auth/login.feature` | Single feature file |
| `HEADLESS=false npm test` | Visible browser |
