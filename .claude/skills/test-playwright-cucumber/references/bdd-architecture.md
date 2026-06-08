# BDD Test Architecture with Cucumber + POM


## BDD Test Architecture Diagram

The following PlantUML diagram shows the architecture of five main components (files) for IMPLEMENT BDD with Cucumber and Page Object Model, following best practices.

See file: `\bdd-architecture.plantuml`


## Feature creation process

- **Step 1 – Feature file**
features/login.feature
Write the behavior specification in Gherkin. Describe the feature, background (if needed), and scenario(s) using Given/When/Then. Use declarative style and tags like @happy.

- **Step 2 – Page Object**
pages/LoginPage.ts
Create a class that encapsulates locators and high‑level actions for the page. Methods like goto() and loginWithValidCredentials() hide UI details.

- **Step 3 – Step Definitions**
step_definitions/login.steps.ts
Map each Gherkin step to an action on the Page Object. Keep steps thin – delegate all UI interaction to the Page Object and obtain shared context (e.g., page) from the World.

- **Step 4 – World (shared context)**
support/world.ts
Define a custom World class that holds the browser, page, Page Object instances, and any other data shared across step definitions. Each scenario gets a fresh World.

- **Step 5 – Hooks (setup/teardown)**
support/hooks.ts
Implement Before to initialize the World (launch browser, create page) and After to clean up resources (close browser). This ensures isolation between scenarios.

**Summary:** The first time a feature is created (with its first scenario), steps 1 through 5 are completed (feature, page object, step definitions, world, hooks). To add more scenarios to the same feature, you only need to: Edit the .feature file (step 1). Optionally, extend the Page Object (step 2) and the step definitions (step 3) if the new steps don't already exist.

**Example:** The architecture requires 5 components for a one-button component feature:

1. Feature File:	tests/e2e/features/components/button.feature
2. Page Object:	tests/e2e/pages/ButtonPage.ts
3. Step Definitions:	tests/e2e/step_definitions/components/button.steps.ts
4. World:	tests/e2e/support/world.ts
5. Hooks:	tests/e2e/support/hooks.ts

