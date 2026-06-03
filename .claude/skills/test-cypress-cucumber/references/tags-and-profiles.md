# Tags & Profiles

Controlling which scenarios run using Cucumber tags and Cypress tag filtering via `@badeball/cypress-cucumber-preprocessor`.

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
| Run level | `@smoke`, `@sanity`, `@regression` | When the test should run (see strategy below) |
| Status | `@wip`, `@flaky`, `@skip` | Development/stability state |
| Scenario type | `@happy`, `@negative`, `@edge` | Nature of the test case |

> Every scenario should have at least one domain tag and one run-level tag.

---

## Regression Execution Strategy

Three layered levels with **cumulative inclusion** — each level includes all scenarios from the level above:

| Tag | Scope | When to use |
|-----|-------|-------------|
| `@smoke` | ~2–3 per spec | Happy path: component/page renders and responds. Required on every spec. Runs on every deploy gate. |
| `@sanity` | ~4–6 per spec | Basic validations, variations, and some error scenarios. Runs on major deploys. |
| `@regression` | ~4–8 per spec | Variants, state transitions, keyboard interaction. |

**Inclusion rule:**

```
test:e2e:smoke      →  @smoke                         (fast gate, every deploy)
test:e2e:sanity     →  (@smoke or @sanity)            (includes smoke)
test:e2e:regression →  (@smoke or @sanity or @regression) (includes smoke and sanity)
```

**Tagging rule:** every spec file must have at least `@smoke` scenarios. Add `@sanity` and `@regression` for broader coverage.

---

## Tags by Scenario Type

Use the following labels to tag scenarios as appropriate:

- `@happy` – Happy Path (main): Primary flow, no errors or deviations.
- `@critical` – Happy Path (critical): Most important business functionalities (payment, login, registration).
- `@variation` – Variations: Small variations of the happy path.
- `@negative` – Negative: Invalid inputs, incorrect flows, error conditions.
- `@error` – Error handling: Any scenario that triggers a controlled error (validation, timeout, 4xx/5xx).
- `@validation` – Error handling: Form validation errors (empty fields, incorrect format).
- `@api-error` – Error handling: Simulated API errors (500, 404, timeout).
- `@recovery` – Error handling: Ability to recover after an error (e.g., retry payment).
- `@edge` – Edge cases: Extreme or unusual conditions (empty lists, max values, future dates).
- `@boundary` – Edge cases (limits): Boundary values (minimum, maximum, field length).
- `@empty-state` – Edge cases (data): Specific lack of data (empty cart, no results).
- `@cross-browser` – Cross-browser: Tests that must run on multiple browsers.
- `@ui` – User Interface: Any interface aspect (responsive, design, visual elements, layout).
- `@a11y` – Accessibility: Accessibility tests (contrast, ARIA labels, keyboard navigation).
- `@integration` – Integration: Integration points with external APIs.
- `@performance` – Performance: Load times, slow pagination, heavy requests.
- `@slow` – Slow: Tests that take >10s. Excluded from fast regression runs.
- `@setup` – Setup / Teardown: Data preparation or cleanup (should not run as a real test).
- `@security` – Security: Security-related tests (authentication, authorization, injections).

---

## Tags by Regression Type (Run Level Tags)

- **`@smoke`** → Only the most critical tests that verify the system is not "broken" (main happy paths).
- **`@sanity`** → A broader set that includes variations, basic validations, and some errors, but without edge cases or slow tests.
- **`@regression`** → Complete suite covering all functionalities, edge cases, integrations, security, accessibility, etc.

## Regression Scope

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

> `@performance` and `@slow` are often run in separate pipelines due to their duration.
> `@setup` should not be run as a real test and is excluded from all types.

---

## Cypress Tag Configuration

Tags are configured in `cypress.config.ts` and passed via environment variables:

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';

export default defineConfig({
  e2e: {
    specPattern: 'tests/e2e/features/**/*.feature',
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
      return config; // ALWAYS return config
    },
    env: {
      // Default tag — override via CLI with --env tags='@smoke'
      tags: '@regression',
      filterSpecs: true,   // Skip feature files that don't match tags (performance)
      omitFiltered: true,  // Omit filtered scenarios from report
    },
  },
});
```

---

## package.json Scripts (Profiles)

```json
{
  "scripts": {
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:e2e:smoke": "cypress run --env tags='@smoke'",
    "test:e2e:sanity": "cypress run --env tags='@smoke or @sanity'",
    "test:e2e:regression": "cypress run --env tags='@smoke or @regression'",
    "test:e2e:wip": "cypress run --env tags='@wip'",
    "test:e2e:headed": "cypress run --headed",
    "test:e2e:report": "node cucumber-html-report.js"
  }
}
```

---

## Running Profiles

```bash
# Happy-path gate — runs on every deploy (~2–3 scenarios per spec)
npm run test:e2e:smoke

# Sanity — smoke + variants/state
npm run test:e2e:sanity

# Full regression — all non-wip scenarios
npm run test:e2e:regression

# Ad-hoc tag filter from CLI
npx cypress run --env tags='@checkout and not @wip'

# Run against a different environment
CYPRESS_BASE_URL=https://staging.example.com npm run test:e2e:smoke

# Run with browser visible (headed)
npm run test:e2e:headed

# Run a single feature file
npx cypress run --spec="tests/e2e/features/checkout.feature"
```

---

## Tag Expressions (CLI)

Cypress passes tag expressions directly to `@badeball/cypress-cucumber-preprocessor`:

```bash
# AND — must have both tags
npx cypress run --env tags='@checkout and @smoke'

# OR — either tag
npx cypress run --env tags='@smoke or @sanity'

# NOT — exclude a tag
npx cypress run --env tags='not @wip'

# Complex expression
npx cypress run --env tags='(@smoke or @regression) and not @wip'
```

---

## Parallel Execution

Cypress parallelism requires **Cypress Cloud** or running multiple terminal sessions pointing to different spec subsets.

```bash
# Via Cypress Cloud (paid) — distribute specs across CI machines
npx cypress run --record --parallel --ci-build-id $BUILD_ID

# Manual split — two terminals, different tag groups
# Terminal 1:
npx cypress run --env tags='@auth'
# Terminal 2:
npx cypress run --env tags='@checkout'
```

**Parallel gotchas:**

| Issue | Solution |
|-------|---------|
| Shared test state between workers | Each Cypress process is isolated — no shared state |
| `cy.session()` not shared between workers | Re-authenticate per worker; use `cy.session()` to cache per worker |
| Flaky tests amplified by parallelism | Fix flakiness before enabling parallel |
| Report merging | Use `cucumber-json` reporter + merge JSONs before generating HTML |

---

## Quick Reference

| Goal | Command |
|------|---------|
| Happy-path gate | `npm run test:e2e:smoke` — `@smoke` |
| Sanity regression | `npm run test:e2e:sanity` — `@smoke or @sanity` |
| Full regression | `npm run test:e2e:regression` — `@smoke or @regression` |
| Filter by tag (CLI) | `npx cypress run --env tags='@checkout and not @wip'` |
| Exclude a tag | `--env tags='not @wip'` |
| Combine tags (AND) | `--env tags='@sanity and @auth'` |
| Combine tags (OR) | `--env tags='@smoke or @sanity'` |
| Run single feature | `npx cypress run --spec="tests/e2e/features/auth.feature"` |
| Override base URL | `CYPRESS_BASE_URL=https://staging.example.com npm run test:e2e` |
