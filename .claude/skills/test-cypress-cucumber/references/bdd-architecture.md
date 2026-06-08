# BDD Test Architecture with Cypress + Cucumber + POM

## BDD Test Architecture Diagram

The following PlantUML diagram shows the architecture of the main components for IMPLEMENT BDD with Cypress + `@badeball/cypress-cucumber-preprocessor` and Page Object Model, following best practices.

See file: `bdd-architecture.plantuml`

## Key Difference from Playwright Cucumber

In Cypress + `@badeball/cypress-cucumber-preprocessor`, there is **no World class required for browser lifecycle** — Cypress manages the browser automatically. The World is only needed when you want to share custom scenario-scoped data between steps. Hooks handle setup/teardown without browser/context/page instantiation.

## Feature Creation Process

- **Step 1 – Feature file**
`tests/e2e/features/login.feature`
Write the behavior specification in Gherkin. Describe the feature, background (if needed), and scenario(s) using Given/When/Then. Use declarative style and tags like `@smoke` and `@regression`.

- **Step 2 – Page Object**
`tests/e2e/pages/LoginPage.ts`
Create a class that encapsulates **static selector strings** for the page. This is the contract between the test suite and the app's `data-testid` attributes. Never hardcode selectors in step definitions.

- **Step 3 – Step Definitions**
`tests/e2e/step_definitions/login.steps.ts`
Map each Gherkin step to Cypress commands, importing Page Objects for all selectors. Use `Given`, `When`, `Then` from `@badeball/cypress-cucumber-preprocessor`. Keep steps thin.

- **Step 4 – Hooks (setup/teardown)**
`tests/e2e/support/hooks.ts`
Implement `Before`/`After` hooks from `@badeball/cypress-cucumber-preprocessor` for scenario-level setup/teardown (e.g., seeding data via API, clearing cookies). Cypress manages the browser lifecycle automatically.

- **Step 5 – World (optional, for shared scenario data)**
`tests/e2e/support/world.ts`
Define a custom World class only when scenario steps need to pass data between each other (e.g., a created `orderId` used in later steps). Use `this` in step definition `function()` syntax to access World properties.

**Summary:** The first time a feature is created (with its first scenario), steps 1 through 4 are always needed; step 5 is optional. To add more scenarios to the same feature, you only need to: Edit the `.feature` file (step 1). Optionally, extend the Page Object (step 2) and the step definitions (step 3) if the new steps don't already exist.

**Example:** The architecture for a login feature:

1. Feature File:     `tests/e2e/features/auth/login.feature`
2. Page Object:      `tests/e2e/pages/LoginPage.ts`
3. Step Definitions: `tests/e2e/step_definitions/auth/login.steps.ts`
4. Hooks:            `tests/e2e/support/hooks.ts`
5. World (optional): `tests/e2e/support/world.ts`

## Minimal Example

```typescript
// tests/e2e/pages/LoginPage.ts — static selectors only
export class LoginPage {
  static readonly url = '/login';
  static readonly emailInput = "[data-testid='email-input']";
  static readonly passwordInput = "[data-testid='password-input']";
  static readonly submitButton = "[data-testid='submit-button']";
  static readonly errorMessage = "[data-testid='error-message']";
  static readonly welcomeMessage = "[data-testid='welcome-message']";
}
```

```typescript
// tests/e2e/step_definitions/auth/login.steps.ts
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { LoginPage } from '../../pages/LoginPage';

Given('el usuario está en la página de login', () => {
  cy.visit(LoginPage.url);
});

When('el usuario completa el login con credenciales válidas', () => {
  cy.get(LoginPage.emailInput).type('user@test.com');
  cy.get(LoginPage.passwordInput).type('password123');
  cy.get(LoginPage.submitButton).click();
});

Then('debería ver el mensaje de bienvenida', () => {
  cy.get(LoginPage.welcomeMessage).should('be.visible');
});
```

```typescript
// tests/e2e/support/hooks.ts
import { Before, After } from '@badeball/cypress-cucumber-preprocessor';

Before(function() {
  // No browser launch — Cypress manages that automatically
  // Use for: setting cookies, clearing state, seeding test data via cy.request()
});

After(function(scenario) {
  if (scenario.result?.status === 'FAILED') {
    cy.screenshot(`${scenario.pickle.name}-failed`);
  }
});

Before({ tags: '@authenticated' }, function() {
  cy.setCookie('auth_token', Cypress.env('TEST_AUTH_TOKEN') || 'test-token');
});
```
