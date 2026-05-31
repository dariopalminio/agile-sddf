# Tags and Tag Filtering

## Tag Expressions via CLI

```bash
# Run only @smoke tests
cypress run --env TAGS='@smoke'

# Run @smoke AND @auth
cypress run --env TAGS='@smoke and @auth'

# Run @smoke OR @sanity
cypress run --env TAGS='@smoke or @sanity'

# Exclude @wip from any run
cypress run --env TAGS='not @wip'

# Complex expression
cypress run --env TAGS='(@smoke or @regression) and not @wip'
```

## Default Tag in cypress.config.ts

Set a default tag so a bare `cypress run` uses a sensible filter:

```typescript
export default defineConfig({
  e2e: {
    env: {
      TAGS: '@regression',
    },
    // ...
  },
})
```

Override at runtime: `cypress run --env TAGS='@smoke'`

## Performance: filterSpecs + omitFiltered

Without these flags, Cypress loads **all** `.feature` files even when only a subset matches the tag. For large suites this significantly increases startup time.

```json
// .cypress-cucumber-preprocessorrc.json
{
  "filterSpecs": true,
  "omitFiltered": true
}
```

- `filterSpecs: true` — skip feature files that contain no matching scenarios before running
- `omitFiltered: true` — don't show filtered-out specs in the Cypress runner UI

## Recommended Tag Taxonomy

### 3-Tier Execution Strategy

| Tag | Coverage | Scenarios per spec | Gate |
|---|---|---|---|
| `@smoke` | Happy path only | 1–2 | Every PR |
| `@regression` | Happy path + variants + negative | 3–8 | Every merge to main |
| `@full` | Edge cases + accessibility + slow flows | 1–3 | Nightly / release |

Inclusion rule: `@smoke` ⊂ `@regression` ⊂ `@full`. A `@full` run does not need `@regression` re-tagged — run all three tiers cumulatively.

### Status Tags

| Tag | Meaning |
|---|---|
| `@wip` | Work in progress — always excluded from all runs |
| `@flaky` | Known intermittent failures — tracked but not blocking |
| `@skip` | Intentionally disabled — requires comment explaining why |

### Domain Tags

Use to filter by application area independent of execution tier:

```
@auth, @checkout, @catalog, @cart, @admin, @profile, @search
```

Example: run only auth-related smoke tests: `--env TAGS='@auth and @smoke'`

## package.json Scripts

```json
{
  "scripts": {
    "test:e2e":            "cypress run",
    "test:e2e:open":       "cypress open",
    "test:e2e:smoke":      "cypress run --env TAGS='@smoke'",
    "test:e2e:core":       "cypress run --env TAGS='@core'",
    "test:e2e:full":       "cypress run --env TAGS='@full'",
    "test:e2e:regression": "cypress run --env TAGS='@regression'",
    "test:e2e:full":       "cypress run --env TAGS='@full'",
    "test:e2e:auth":       "cypress run --env TAGS='@auth'",
    "test:e2e:report":     "node cucumber-html-report.js"
  }
}
```

## Tag Cascading

Tags on a `Feature` or `Rule` block apply to **all** scenarios within it:

```gherkin
@auth @regression          ← applies to both scenarios below
Feature: Login

  @smoke                   ← this scenario also gets @auth @regression
  Scenario: Successful login
    ...

  Scenario: Failed login   ← gets @auth @regression only
    ...
```
