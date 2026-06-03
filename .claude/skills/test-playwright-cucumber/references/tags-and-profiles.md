# Tags & Profiles

Controlling which scenarios run and how, using Cucumber tags and `cucumber.js` profiles.

---

## Tags in Feature Files

Tags are applied with `@` prefix. They cascade from Feature to all its Scenarios.

```gherkin
@checkout @regression          ← inherited by ALL scenarios in this feature
Feature: Checkout Flow

  @smoke                       ← this scenario also gets @checkout and @regression
  Scenario: Complete checkout with credit card
    Given the user has items in the cart
    When the user completes the checkout with a valid credit card
    Then the order confirmation page should be displayed

  @wip                         ← work in progress — excluded from CI
  Scenario: Checkout with PayPal
    ...

  @negative @edge-case
  Scenario: Checkout fails with expired card
    ...
```

**Recommended tag taxonomy:**

| Category | Tags | Purpose |
|----------|------|---------|
| Domain | `@auth`, `@checkout`, `@catalog`, `@profile`, `@orders` | What area the test covers |
| Run level | `@smoke`, `@regression` | When the test should run (see strategy below) |
| Status | `@wip`, `@flaky`, `@skip` | Development/stability state |
| Scenario type | `@happy`, `@negative`, `@edge` | Nature of the test case |

> Every scenario should have at least one domain tag and one run-level tag.

---

## Regression Execution Strategy

Three layered levels with **cumulative inclusion** — each level includes all scenarios from the level above:

| Tag | Scope | When to use |
|-----|-------|-------------|
| `@smoke` | ~2–3 per spec | Happy path: component/page renders and responds. Required on every spec. Runs on every deploy gate. |
| `@regression` | ~4–8 per spec | Variants, state transitions, keyboard interaction. |


**Inclusion rule:**

```
test:e2e:smoke  →  @smoke                    (fast gate, every deploy, cucumber and Playwright)
test:e2e:regression   →  (@smoke or @regression)   (includes smoke, cucumber and Playwright)
```

**Tagging rule:** every spec file must have at least `@smoke` scenarios. Add `@regression` for state/variant coverage.
---

## Tag Expressions

Used in `cucumber.js` profiles and CLI to filter scenarios:



A continuación tienes una propuesta de **listado estandarizado de tipos de escenarios de prueba**, pensado para ser usado como **etiquetas (tags)** en herramientas como Playwright, Cucumber, Cypress, etc. Está organizado por categorías y priorizado según la frecuencia de uso en regresiones completas (etiqueta `@regression`) y rápidas (`@smoke`).

---

## 🏷️ Tags by scenario type

Use the following labels to tag scenarios as appropriate:

- `@happy` – Happy Path (main): Primary flow, no errors or deviations. The "happy path".
- `@critical` – Happy Path (critical): Most important business functionalities (payment, login, registration).
- `@variation` – Variations: Small variations of the happy path (e.g., different payment method, field order).
- `@negative` – Negative: Invalid inputs, incorrect flows, error conditions. A group of tests that verify that the system responds correctly to invalid inputs, prohibited actions, or expected errors. Although it partially overlaps with @validation and @error, @negative is a broader and more industry-standard term.
- `@error` – Error handling: Any scenario that triggers a controlled error (validation, timeout, 4xx/5xx).
- `@validation` – Error handling: Form validation errors (empty fields, incorrect format).
- `@api-error` – Error handling: Simulated API errors (500, 404, timeout).
- `@recovery` – Error handling: Ability to recover after an error (e.g., retry payment).
- `@edge` – Edge cases: Extreme or unusual conditions (empty lists, max values, future dates).
- `@boundary` – Edge cases (limits): Boundary values (minimum, maximum, field length).
- `@empty-state` – Edge cases (data): Specific lack of data (empty cart, no results).
- `@cross-browser` – Cross‑browser: Tests that must run on multiple browsers (Chrome, Firefox, Safari).
- `@ui` – User Interface: Any interface aspect (responsive, design, visual elements, layout). Includes mobile-specific tests (responsive design, gestures).
- `@a11y` – Accessibility: Accessibility tests (contrast, ARIA labels, keyboard navigation).
- `@integration` – Integration: Integration points with external APIs, databases, queues.
- `@performance` – Performance: Load times, slow pagination, heavy requests.
- `@slow` – Slow: Tests that take >10s. Excluded from fast regression runs.
- `@setup` – Setup / Teardown: Data preparation or cleanup (should not run as a real test).
- `@security` – Security: Security-related tests (authentication, authorization, injections, etc.).

---

## Tags by Regression Types (Run level Tags)

- **`@smoke`** → Only the most critical tests that verify the system is not "broken" (main happy paths).
- **`@sanity`** → A broader set that includes variations, basic validations, and some errors, but without reaching edge cases or slow tests.
- **`@regression`** → Complete suite covering all functionalities, edge cases, integrations, security, accessibility, etc.

## Regression Scope

The following table indicates, for each type of regression execution (`@smoke`, `@sanity`, `@regression`), which tags are recommended to run. The decision is aligned with common industry practices:

| Tag | `@smoke` | `@sanity` | `@regression` |
|----------|:--------:|:---------:|:-------------:|
| `@happy` | ✅ | ✅ | ✅ |
| `@critical` | ✅ | ✅ | ✅ |
| `@variation` | ❌ | ✅ | ✅ |
| `@negative` | ❌ | ✅ | ✅ |
| `@validation` | ❌ | ✅ | ✅ |
| `@error` | ❌ | ✅ | ✅ |
| `@api-error` | ❌ | ❌ | ✅ |
| `@recovery` | ❌ | ❌ | ✅ |
| `@edge` | ❌ | ❌ | ✅ |
| `@boundary` | ❌ | ❌ | ✅ |
| `@empty-state` | ❌ | ❌ | ✅ |
| `@cross-browser` | ❌ | ❌ | ✅ |
| `@ui` | ❌ | ❌ | ✅ |
| `@a11y` | ❌ | ❌ | ✅ |
| `@integration` | ❌ | ❌ | ✅ |
| `@performance` | ❌ | ❌ | ✅* |
| `@slow` | ❌ | ❌ | ✅* |
| `@security` | ❌ | ❌ | ✅ |
| `@setup` | ❌ | ❌ | ❌ |

> **Notes:**  
> - `@performance` and `@slow` are often run in separate pipelines (not in the daily regression) due to their duration. They are indicated here as part of `@regression` but can be adjusted according to each team's strategy.  
> - `@setup` should not be run as a real test, so it is excluded from all types.  


## cucumber.js — Multi-Profile Configuration

```javascript
// cucumber.cjs (use .cjs when package.json has "type": "module")
// Uses --loader ts-node/esm for ESM-native TypeScript support
const common = {
  import:       ['tests/e2e/support/hooks.ts', 'tests/e2e/step_definitions/**/*.ts'],
  loader:       ['ts-node/esm'],
  publishQuiet: true,
};

module.exports = {
  // Default — runs everything except @wip
  default: {
    ...common,
    paths:  ['tests/e2e/features/**/*.feature'],
    tags:   'not @wip',
    format: [
      'progress',
      'html:tests/e2e/reports/cucumber-report.html',
      'json:tests/e2e/reports/cucumber-report.json',
    ],
  },

  // Smoke — fast happy-path gate, runs on every deploy
  smoke: {
    ...common,
    paths:  ['tests/e2e/features/**/*.feature'],
    tags:   '@smoke and not @wip',
    format: [
      'progress',
      'html:tests/e2e/reports/smoke-report.html',
      'json:tests/e2e/reports/smoke-report.json',
    ],
  },

  // Core — smoke + variants/state/interaction (@smoke or @sanity)
  core: {
    ...common,
    paths:  ['tests/e2e/features/**/*.feature'],
    tags:   '(@smoke or @sanity) and not @wip',
    format: [
      'progress',
      'html:tests/e2e/reports/core-report.html',
      'json:tests/e2e/reports/core-report.json',
    ],
  },

  // Full — complete regression, all non-wip scenarios
  full: {
    ...common,
    paths:  ['tests/e2e/features/**/*.feature'],
    tags:   'not @wip',
    format: [
      'progress',
      'html:tests/e2e/reports/full-report.html',
      'json:tests/e2e/reports/full-report.json',
    ],
  },

  // CI — all non-wip with JUnit XML for GitHub Actions
  ci: {
    ...common,
    paths:  ['tests/e2e/features/**/*.feature'],
    tags:   'not @wip',
    format: [
      'progress',
      'html:tests/e2e/reports/cucumber-report.html',
      'json:tests/e2e/reports/cucumber-report.json',
      'junit:tests/e2e/reports/junit-report.xml',
    ],
  },
};
```

---

## Running Profiles

```bash
# Happy-path gate — runs on every deploy (~2–3 scenarios per spec)
pnpm test:e2e:smoke

# Core regression — smoke + variants/state (~4–8 per spec, includes smoke)
pnpm test:e2e:sanity

# Full regression — all non-wip scenarios (accessibility + edge cases)
pnpm test:e2e:regression

# Default profile (equivalent to full, uses default report paths)
pnpm test:e2e

# Ad-hoc tag filter from CLI
npx cucumber-js --tags "@button and not @wip"

# Run against a different environment
BASE_URL=https://staging.example.com pnpm test:bdd:smoke

# Run with browser visible (headed)
pnpm test:e2e:headed

# Run in debug mode (headed + slowMo)
pnpm test:e2e:debug
```

---

## Parallel Execution

Add `parallel` to any profile in `cucumber.js`:

```javascript
regression: {
  ...common,
  parallel: 4,   // 4 worker processes
  // ...
}
```

Or via CLI:
```bash
npx cucumber-js --parallel 4
```

**How it works:** Each worker is a separate Node.js process. Scenarios (not steps) are distributed across workers. Each worker has its own `World` instance — there is no shared state between workers.

**Parallel gotchas:**

| Issue | Solution |
|-------|---------|
| `BeforeAll`/`AfterAll` run once **per worker**, not globally | Use external resource (DB/API) for true global setup |
| Port conflicts if your app starts per-worker | Use a shared running test server |
| Flaky tests amplified by parallelism | Fix flakiness before enabling parallel |
| File system write conflicts | Each profile writes to a distinct report file |

---

## Quick Reference

| Goal | Config / Command |
|------|-----------------|
| Happy-path gate | `pnpm test:e2e:smoke` — `@smoke and not @wip` |
| Core regression | `pnpm test:e2e:sanity` — `(@smoke and @sanity) and not @wip` |
| Full regression | `pnpm test:e2e:regression` — `not @wip` |
| Run a profile | `npx cucumber-js --profile <name>` |
| Filter by tag (CLI) | `npx cucumber-js --tags "@button and not @wip"` |
| Exclude a tag | `tags: 'not @wip'` |
| Combine tags (AND) | `tags: '@sanity and @auth'` |
| Combine tags (OR) | `tags: '(@smoke or @sanity) and not @wip'` |
| Parallel workers | `parallel: 4` in profile or `--parallel 4` CLI |
| Override base URL | `BASE_URL=https://staging.example.com pnpm test:e2e:smoke` |
