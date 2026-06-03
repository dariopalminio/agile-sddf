# WCAG E2E Testing with Playwright + axe-core

> **Purpose**: Ensure every feature meets WCAG 2.2 A/AA standards as part of your E2E test suite.

## When to Use This Skill

- You are writing a new E2E test for a feature and need to include accessibility checks.
- You want to fail the build if critical WCAG violations are introduced.
- You need to remediate common violations found by automated tools.
- You are setting up accessibility regression testing in CI/CD.

## Core Workflow

1. **Run automated accessibility scan** on the page or component under test.
2. **Filter violations** to a manageable set (e.g., only A/AA, ignore known false positives).
3. **Assert that no violations** of a given severity remain.
4. **Fix violations** using the remediation patterns below.
5. **Re-run** to verify.

## Setup (One-time)

### Install dependencies

```bash
pnpm add -D @axe-core/playwright playwright
```

### Create reusable fixture (Playwright)

```typescript
// fixtures/accessibility.ts
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export const test = base.extend({
  makeAxeBuilder: async ({ page }, use) => {
    const builder = new AxeBuilder({ page }).withTags([
      'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'
    ]);
    await use(builder);
  },
});

export { expect };
```

## Write E2E Tests with Accessibility Checks

### Basic test

```typescript
import { test, expect } from './fixtures/accessibility';

test('homepage has no WCAG violations', async ({ page, makeAxeBuilder }) => {
  await page.goto('/');
  const results = await makeAxeBuilder.analyze();
  expect(results.violations).toEqual([]);
});
```

### Test a feature after user interaction

```typescript
test('modal dialog after login is accessible', async ({ page, makeAxeBuilder }) => {
  await page.goto('/login');
  await page.fill('#username', 'user');
  await page.fill('#password', 'pass');
  await page.click('button:has-text("Login")');
  await page.waitForSelector('[role="dialog"]');
  const results = await makeAxeBuilder.analyze();
  expect(results.violations).toEqual([]);
});
```

### Filter known issues (temporary)

```typescript
const results = await makeAxeBuilder
  .disableRules(['color-contrast']) // known false positive
  .exclude('#third-party-widget')    // external content
  .analyze();
```

## Common Violations & Quick Fixes (E2E Context)

| Violation ID | Typical Cause | Automated Fix / Check |
|--------------|---------------|------------------------|
| `color-contrast` | Text contrast < 4.5:1 | Use Playwright to compute contrast ratio (advanced) or rely on axe. Fix: adjust CSS colors. |
| `image-alt` | Missing `alt` on `<img>` | Ensure all `<img>` have `alt` attribute (empty string for decorative). |
| `button-name` | Button has no accessible name | Add text content, `aria-label`, or `aria-labelledby`. |
| `link-name` | Link has no text | Add text or `aria-label`. Avoid empty `<a>` tags. |
| `label` | Form input without `<label>` | Add `<label for="id">` or `aria-label`. |
| `aria-required-children` | Missing required ARIA children | Fix ARIA roles structure (e.g., `combobox` needs child `listbox`). |
| `duplicate-id` | Two elements share same `id` | Ensure unique `id` values. |
| `heading-order` | Skipped heading level (e.g., h1→h3) | Adjust heading levels consecutively. |
| `focus-order-semantics` | Focus order not logical | Use correct HTML structure, avoid tabindex >0. |
| `meta-viewport` | Zoom disabled | Ensure `<meta name="viewport">` does not contain `user-scalable=no` or `maximum-scale=1.0`. |

## Integrating with Cucumber (BDD)

Create a step definition that runs accessibility check:

```gherkin
Feature: Accessibility
  Scenario: Dashboard meets WCAG
    Given I am logged in as a user
    When I visit the dashboard
    Then the page should have no accessibility violations
```

Implementation:

```typescript
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

Then('the page should have no accessibility violations', async function () {
  const axeBuilder = new AxeBuilder({ page: this.page }).withTags(['wcag2aa']);
  const results = await axeBuilder.analyze();
  expect(results.violations).toEqual([]);
});
```

## CI/CD Recommendations

- Run accessibility scans on **every pull request** to catch violations early.
- Set threshold: fail only on `impact: 'critical'` or `'serious'` if desired.
- Use `--max-warnings` in your test runner to allow temporary known issues.

```yaml
# GitHub Actions example
- name: Run E2E tests with accessibility
  run: pnpm test:e2e --grep @accessibility
```

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

## Tools & Resources

- **axe-core Playwright** – https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright
- **WCAG 2.2 Quick Reference** – https://www.w3.org/WAI/WCAG22/quickref/
- **Deque University** – Free axe rules documentation

---
