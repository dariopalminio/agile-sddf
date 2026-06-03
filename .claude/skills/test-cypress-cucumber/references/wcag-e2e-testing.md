# WCAG E2E Testing with Cypress + cypress-axe

> **Purpose**: Ensure every feature meets WCAG 2.2 A/AA standards as part of your E2E test suite.

## When to Use This Reference

- You are writing a new E2E test for a feature and need to include accessibility checks.
- You want to fail the build if critical WCAG violations are introduced.
- You need to remediate common violations found by automated tools.
- You are setting up accessibility regression testing in CI/CD.

## Core Workflow

1. **Install `cypress-axe`** and inject axe into each page.
2. **Run automated accessibility scan** on the page or component under test.
3. **Filter violations** to a manageable set (e.g., only A/AA, ignore known false positives).
4. **Assert that no violations** of a given severity remain.
5. **Fix violations** using the remediation patterns below.
6. **Re-run** to verify.

## Setup (One-time)

### Install dependencies

```bash
npm install --save-dev cypress-axe axe-core
```

### Register commands

```typescript
// cypress/support/commands.ts
import 'cypress-axe';
```

```typescript
// cypress/support/e2e.ts
import './commands';
```

### TypeScript types (if needed)

```typescript
// cypress/support/index.d.ts
import 'cypress-axe';
```

---

## Write E2E Tests with Accessibility Checks

### Basic test

```typescript
// tests/e2e/specs/a11y/homepage.cy.ts
describe('Accessibility', () => {
  it('homepage has no WCAG violations', () => {
    cy.visit('/');
    cy.injectAxe();
    cy.checkA11y();
  });
});
```

### Test a feature after user interaction

```typescript
it('modal dialog after login is accessible', () => {
  cy.visit('/login');
  cy.get('[data-testid="username-input"]').type('user');
  cy.get('[data-testid="password-input"]').type('pass');
  cy.get('[data-testid="login-button"]').click();
  cy.get('[role="dialog"]').should('be.visible');
  cy.injectAxe();
  cy.checkA11y('[role="dialog"]'); // Check only the dialog
});
```

### Filter by WCAG level (A/AA only)

```typescript
it('page meets WCAG 2.2 AA', () => {
  cy.visit('/dashboard');
  cy.injectAxe();
  cy.checkA11y(null, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
    },
  });
});
```

### Filter known issues (temporary)

```typescript
it('page with known false positives', () => {
  cy.visit('/checkout');
  cy.injectAxe();
  cy.checkA11y(null, {
    rules: {
      'color-contrast': { enabled: false }, // known false positive with this theme
    },
    exclude: ['#third-party-widget'],        // external content outside our control
  });
});
```

### Fail only on critical/serious violations

```typescript
const terminalLog = (violations: Cypress.Violation[]) => {
  violations.forEach((v) => {
    cy.log(`[a11y] ${v.id} (${v.impact}): ${v.description}`);
    v.nodes.forEach((node) => cy.log(`  → ${node.html}`));
  });
};

it('no critical accessibility violations', () => {
  cy.visit('/');
  cy.injectAxe();
  cy.checkA11y(
    null,
    { includedImpacts: ['critical', 'serious'] },
    terminalLog,
  );
});
```

---

## Integrating with Cucumber (BDD)

Feature file:

```gherkin
# language: es
@a11y @regression
Feature: Accesibilidad

  Scenario: El dashboard cumple con WCAG 2.2 AA
    Given el usuario ha iniciado sesión
    When visita el dashboard
    Then la página no debería tener violaciones de accesibilidad
```

Step definitions:

```typescript
// tests/e2e/step_definitions/a11y/accessibility.steps.ts
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('el usuario ha iniciado sesión', () => {
  cy.setCookie('auth_token', Cypress.env('TEST_AUTH_TOKEN'));
});

When('visita el dashboard', () => {
  cy.visit('/dashboard');
});

Then('la página no debería tener violaciones de accesibilidad', () => {
  cy.injectAxe();
  cy.checkA11y(null, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
  });
});
```

---

## Common Violations & Quick Fixes

| Violation ID | Typical Cause | Automated Fix / Check |
|--------------|---------------|------------------------|
| `color-contrast` | Text contrast < 4.5:1 | Use axe result. Fix: adjust CSS colors. |
| `image-alt` | Missing `alt` on `<img>` | Ensure all `<img>` have `alt` (empty string for decorative). |
| `button-name` | Button has no accessible name | Add text content, `aria-label`, or `aria-labelledby`. |
| `link-name` | Link has no text | Add text or `aria-label`. Avoid empty `<a>` tags. |
| `label` | Form input without `<label>` | Add `<label for="id">` or `aria-label`. |
| `aria-required-children` | Missing required ARIA children | Fix ARIA roles structure. |
| `duplicate-id` | Two elements share same `id` | Ensure unique `id` values. |
| `heading-order` | Skipped heading level (h1→h3) | Adjust heading levels consecutively. |
| `meta-viewport` | Zoom disabled | Remove `user-scalable=no` from `<meta name="viewport">`. |

---

## CI/CD Recommendations

- Run accessibility scans on **every pull request** to catch violations early.
- Set threshold: fail only on `impact: 'critical'` or `'serious'` if desired.
- Upload violation screenshots as artifacts for debugging.

```yaml
# GitHub Actions example
- name: Run E2E tests with accessibility checks
  run: npx cypress run --env tags='@a11y'

- name: Upload screenshots on failure
  if: failure()
  uses: actions/upload-artifact@v4
  with:
    name: a11y-failures
    path: cypress/screenshots/
```

---

## Remediation Patterns (for developers)

### Fix missing form labels

```html
<!-- ❌ Bad -->
<input type="email" placeholder="Email" />

<!-- ✅ Good: visible label -->
<label for="email">Email address</label>
<input id="email" type="email" />

<!-- ✅ Good: aria-label -->
<input type="email" aria-label="Email address" />
```

### Fix insufficient color contrast

```css
/* ❌ Bad: 2.5:1 contrast */
.text-muted { color: #aaa; }

/* ✅ Good: 4.5:1 contrast */
.text-muted { color: #595959; }
```

### Fix keyboard trap

```javascript
// Ensure modal can be closed with Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOpen) {
    closeModal();
    e.preventDefault();
  }
});
```

---

## Tools & Resources

- **cypress-axe** — https://github.com/component-driven/cypress-axe
- **axe-core** — https://github.com/dequelabs/axe-core
- **WCAG 2.2 Quick Reference** — https://www.w3.org/WAI/WCAG22/quickref/
- **Deque University** — Free axe rules documentation
