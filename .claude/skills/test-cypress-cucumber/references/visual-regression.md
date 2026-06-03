# Visual Regression Testing

## When to load
Load when setting up screenshot comparison, visual diffs, or pixel-level UI verification with Cypress.

## Setup

### Option A — cypress-image-snapshot (local snapshots, git-tracked)

```bash
npm install --save-dev cypress-image-snapshot
```

```typescript
// cypress/support/commands.ts
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
addMatchImageSnapshotCommand({
  failureThreshold: 0.01,       // 1% pixel difference allowed
  failureThresholdType: 'percent',
  customSnapshotsDir: 'cypress/snapshots',
  customDiffDir: 'cypress/snapshots/__diff__',
});
```

```typescript
// cypress/support/index.ts
import './commands';
```

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from 'cypress-image-snapshot/plugin';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      addMatchImageSnapshotPlugin(on, config);
      return config;
    },
  },
});
```

### Option B — @percy/cypress (cloud-based visual review)

```bash
npm install --save-dev @percy/cypress @percy/cli
```

```typescript
// cypress/support/commands.ts
import '@percy/cypress';
```

---

## Basic Screenshot Comparison

```typescript
// Basic page snapshot
it('homepage matches snapshot', () => {
  cy.visit('/');
  cy.matchImageSnapshot('homepage');
});

// Element-level snapshot
it('order card renders correctly', () => {
  cy.visit('/orders');
  cy.get('[data-testid="order-card"]').first().matchImageSnapshot('order-card');
});

// Full page snapshot
it('full page layout', () => {
  cy.visit('/dashboard');
  cy.matchImageSnapshot('dashboard-full', {
    capture: 'fullPage',
  });
});
```

---

## Handling Dynamic Content

```typescript
// Black out elements that change between runs (equivalent to Playwright's mask)
it('page with dynamic content matches snapshot', () => {
  cy.visit('/dashboard');
  cy.matchImageSnapshot('dashboard', {
    blackout: [
      '[data-testid="current-time"]',
      '[data-testid="avatar"]',
      '.ad-banner',
    ],
  });
});

// Disable animations before screenshot
it('no animation flicker', () => {
  cy.visit('/');
  cy.document().then((doc) => {
    const style = doc.createElement('style');
    style.textContent = '*, *::before, *::after { animation: none !important; transition: none !important; }';
    doc.head.appendChild(style);
  });
  cy.matchImageSnapshot('homepage-no-anim');
});

// Wait for images and fonts to load
it('fully loaded page', () => {
  cy.visit('/');
  cy.get('[data-testid="hero-image"]').should('be.visible');
  cy.matchImageSnapshot('homepage-loaded');
});
```

---

## Uso en step definitions BDD (Cucumber)

```typescript
// tests/e2e/step_definitions/visual.steps.ts
import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('la página debería coincidir con el snapshot {string}', (snapshotName: string) => {
  cy.matchImageSnapshot(snapshotName);
});

Then('el componente {string} debería coincidir con el snapshot {string}', (testId: string, snapshotName: string) => {
  cy.get(`[data-testid="${testId}"]`).matchImageSnapshot(snapshotName);
});
```

```gherkin
@visual @regression
Scenario: La página de inicio mantiene su apariencia
  Given el usuario visita la página de inicio
  Then la página debería coincidir con el snapshot "homepage"
```

---

## CI Integration

```yaml
# .github/workflows/visual-tests.yml
jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run dev &
      - run: npx cypress run --env tags='@visual'
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: visual-diffs
          path: cypress/snapshots/__diff__/

# Update snapshots: npx cypress run --env updateSnapshots=true
# Store snapshots in git for PR review
# Different OS = different rendering → use Docker or pin runner OS for consistency
```

---

## Anti-patterns
- Running visual tests on different OS than when snapshots were taken → different font/antialiasing rendering
- No `blackout` of dynamic content → false failures every run
- Snapshot of entire page when only testing a component → noisy diffs
- Threshold too tight (0%) → every anti-aliasing change fails
- Not waiting for lazy-loaded images → blank areas in snapshots

## Quick reference
```
failureThreshold: 0.01 (1%) for full pages, 0.05 for components
capture: 'fullPage' for layout regression
blackout: string[] — CSS selectors for dynamic elements to black out
Update snapshots: npx cypress run --env updateSnapshots=true
Store snapshots in git for PR review
CI: pin runner OS (ubuntu-latest) for consistent rendering
```
