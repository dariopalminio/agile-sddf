# Naming Conventions

## Feature Files

| Pattern | Example |
|---------|---------|
| `<feature>.feature` | `login.feature` |
| `<feature>-<variant>.feature` | `login-oauth.feature` |
| `<page>-<action>.feature` | `checkout-payment.feature` |

Rules:
- Use `.feature` extension — always
- Use **kebab-case** for file names
- Name after the **feature or user flow**, not the technical component
- Group related features in a subfolder: `features/checkout/` not loose files

```
tests/e2e/features/
  auth/
    login.feature              ✓
    login-social.feature       ✓
    logout.feature             ✓
  checkout/
    checkout-flow.feature      ✓
    checkout-payment.feature   ✓
login_page.feature             ✗  (underscore)
LoginFeature.feature           ✗  (PascalCase)
test-login.feature             ✗  (prefixed with "test-")
```

---

## Cypress Spec Files (without Cucumber)

When writing Cypress tests without `.feature` files:

| Pattern | Example |
|---------|---------|
| `<feature>.cy.ts` | `login.cy.ts` |
| `<feature>-<scenario>.cy.ts` | `login-oauth.cy.ts` |
| `<page>-<action>.cy.ts` | `checkout-payment.cy.ts` |

Rules:
- Use `.cy.ts` extension for Cypress specs (also accepts `.spec.ts`)
- Use **kebab-case** for file names
- Name after the **feature or user flow**
- API specs go in `tests/e2e/api/` — they use `cy.request()` and test REST endpoints

```
tests/e2e/specs/
  auth/
    login.cy.ts                ✓
    login-social.cy.ts         ✓
    logout.cy.ts               ✓
  checkout/
    checkout-flow.cy.ts        ✓
    checkout-payment.cy.ts     ✓
  api/
    auth.cy.ts                 ✓  (API test, cy.request() only)
    users.cy.ts                ✓
login_page.cy.ts               ✗  (underscore)
LoginSpec.ts                   ✗  (PascalCase, missing .cy)
test-login.ts                  ✗  (missing .cy, prefixed with "test-")
```

---

## Step Definition Files

| Pattern | Example |
|---------|---------|
| `<feature>.steps.ts` | `login.steps.ts` |
| `<feature>-<variant>.steps.ts` | `checkout-payment.steps.ts` |

Rules:
- Always suffix with `.steps.ts`
- Mirror the feature folder structure under `step_definitions/`
- One steps file per feature file (co-locate or mirror structure)

```
tests/e2e/step_definitions/
  auth/
    login.steps.ts             ✓
  checkout/
    checkout.steps.ts          ✓
  common/
    navigation.steps.ts        ✓  (shared steps)
```

---

## Page Object Files and Classes

| File name pattern | Class name pattern | Example |
|-------------------|--------------------|---------|
| `<Name>Page.ts` | `<Name>Page` | `LoginPage.ts` → `class LoginPage` |
| `<Name>Page.ts` | `<Name>Page` | `CheckoutPage.ts` → `class CheckoutPage` |

Rules:
- File name and class name **must match exactly**
- Use **PascalCase** for both file and class
- Always suffix with `Page`
- One class per file
- Export only **static selector strings** — no Cypress commands in Page Objects

```typescript
// pages/LoginPage.ts
export class LoginPage { ... }       ✓

// pages/login.ts
export class Login { ... }           ✗  (no Page suffix, no PascalCase file)

// pages/LoginPageHelper.ts
export class LoginPageHelper { ... } ✗  (redundant suffix)
```

---

## Component Page Object Files and Classes

| File name pattern | Class name | Example |
|-------------------|------------|---------|
| `<Name>.ts` | `<Name>` | `NavBar.ts` → `class NavBar` |
| `<Name>Component.ts` | `<Name>Component` | `DatePickerComponent.ts` → `class DatePickerComponent` |

Rules:
- Components **do not** need the `Page` suffix — they represent UI components, not full pages
- Use PascalCase
- Prefer the plain name when the component name is unambiguous (`NavBar`, `Modal`, `DataTable`)
- Add `Component` suffix only when the name alone is too generic (e.g., `InputComponent`)

---

## Cypress Fixtures

Cypress fixtures are JSON (or other static) files stored in `cypress/fixtures/`:

| File name pattern | Example |
|-------------------|---------|
| `<entity>.json` | `users.json`, `products.json` |
| `<domain>/<entity>.json` | `catalog/products.json` |
| `<entity>-<scenario>.json` | `orders-empty-response.json` |

Rules:
- Use **kebab-case** for all fixture files
- Group by domain in subfolders: `cypress/fixtures/auth/`, `cypress/fixtures/catalog/`
- Load in tests or hooks: `cy.fixture('catalog/products.json')` or `{ fixture: 'auth/user.json' }` in `cy.intercept()`

```typescript
// Loading a fixture in a step
cy.fixture('users.json').then((users) => {
  cy.get('[data-testid="email-input"]').type(users.standard.email);
});

// Using fixture as intercept response
cy.intercept('GET', '**/api/products', { fixture: 'catalog/products.json' });
```

---

## Utility / Helper Files

| File name pattern | Export style | Example |
|-------------------|--------------|---------|
| `<domain>-helpers.ts` | Named exports | `date-helpers.ts` |
| `<entity>-builder.ts` | Named exports | `user-builder.ts` |
| `<domain>-api.ts` | Named exports | `orders-api.ts` |

Rules:
- Use **kebab-case** with a descriptive suffix (`-helpers`, `-builder`, `-api`, `-utils`)
- Prefer named exports over default exports in utils
- No Cypress `cy.*` dependencies in `utils/` — keep them framework-agnostic where possible

```typescript
// tests/e2e/utils/user-builder.ts
export function buildUser(overrides = {}) { ... }     ✓
export function randomEmail() { ... }                  ✓

// tests/e2e/utils/helpers.ts  ✗  (too generic)
// tests/e2e/utils/UserBuilder.ts  ✗  (PascalCase for non-class file)
```

---

## Test Data Files

| Type | Pattern | Example |
|------|---------|---------|
| JSON datasets | `<entity>.json` | `users.json`, `products.json` |
| CSV files | `<entity>.csv` | `orders.csv` |
| Images | `<description>.<ext>` | `test-avatar.png`, `large-upload.pdf` |

Rules:
- Use **kebab-case** for all test data files
- Group by type in subfolders: `cypress/fixtures/images/`, `cypress/fixtures/auth/`

---

## Custom Commands

| Pattern | Example |
|---------|---------|
| `cy.<domain><Action>()` | `cy.loginAs()`, `cy.seedOrders()` |

Rules:
- Declared in `cypress/support/commands.ts`
- Types declared in `cypress/support/index.d.ts`
- Use camelCase for command names
- Prefix with domain when commands are domain-specific

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('loginAs', (role: 'admin' | 'user') => {
  cy.request('POST', '/api/auth/login', { ...credentials[role] })
    .then((res) => cy.setCookie('auth_token', res.body.token));
});
```

---

## Summary Table

| Type | File naming | Class/export naming |
|------|-------------|---------------------|
| Feature file | `feature-name.feature` | — |
| Step definitions | `feature-name.steps.ts` | named exports |
| Cypress spec | `feature-name.cy.ts` | — |
| Page Object | `LoginPage.ts` | `class LoginPage` (static selectors) |
| Component PO | `NavBar.ts` | `class NavBar` |
| Fixture (JSON) | `cypress/fixtures/entity.json` | — |
| Utility helper | `date-helpers.ts` | named exports |
| Data builder | `user-builder.ts` | named exports |
| Custom command | declared in `commands.ts` | `cy.commandName()` |
| Test data | `entity.json` | — |
