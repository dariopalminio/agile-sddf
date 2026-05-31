# E2E Testing without Cucumber

Always try to use Cucumber.
If the project doesn't have Cucumber in its installed stack, always try to use the Gherkin format for end-to-end testing.

## E2E test strategy when not using cucumber

```typescript
// Critical user paths to test
const criticalPaths = [
  'User registration and login',
  'Core product/service workflow',
  'Payment/checkout flow',
  'Settings and profile management',
];
```

## BDD/Gherkin User Flow Testing (recommended example for Gherkin scenarios)

If acceptance criteria for a story that includes gherkin scenarios are automated, maintain gherkin nomenclature.
To maintain a Gherkin unified standard (BDD without forcing Cucumber), I recommend:
- Using `test.step()` as a mandatory practice for all tests that follow a user flow logic.
- Standardizing the prefixes that will appear in the report: `Given`, `When`, `Then`, and `And` (read as `Gherkin`).

```typescript
import { test, expect } from '@playwright/test';
/**
Feature: Successful registration

  Scenario: Successful registration
    Given the user is on register page
    When user completes the form and submits
    Then dashboard appears with welcome

**/
test('complete registration', async ({ page }) => {
  //Given
  await test.step('Given the user is on register page', async () => {
    await page.goto('/register');
  });

  //When
  await test.step('When user completes the form and submits', async () => {
    await page.getByLabel('Email').fill('new@example.com');
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.getByLabel('Confirm Password').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Register' }).click();
  });

  //Then
  await test.step('Then dashboard appears with welcome', async () => {
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Welcome')).toBeVisible();
  });
});
```

## Classic User Flow Testing (example)

```typescript

import { test, expect } from '@playwright/test';

//Not recommended for Gherkin scenarios, due to difficulty in identifying what failed and less legibility.

test.describe('User Registration Flow', () => {
  test('complete registration', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('Email').fill('new@example.com');
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.getByLabel('Confirm Password').fill('SecurePass123!');
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page).toHaveURL(/dashboard/);
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  test('shows validation errors', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('Email').fill('invalid');
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page.getByText('Invalid email')).toBeVisible();
  });
});
```

## BDD/Gherkin Checkout Flow (recommended example for Gherkin scenarios)

If acceptance criteria for a story that includes gherkin scenarios are automated, maintain gherkin nomenclature. 
To maintain a Gherkin unified standard (BDD without forcing Cucumber), I recommend:
- Using `test.step()` as a mandatory practice for all tests that follow a user flow logic.
- Standardizing the prefixes that will appear in the report: `Given`, `When`, `Then`, and `And` (read as `Gherkin`).

```typescript
import { test, expect } from '@playwright/test';
/**
Feature: Checkout

  Scenario: Complete purchase
    Given a user adds a product to the cart
    When the user proceeds to checkout
    And completes the payment form
    Then the order should be confirmed

**/
test.describe('Checkout Flow', () => {
  test('complete purchase', async ({ page }) => {

    //Given
    await test.step('Given a user adds a product to the cart', async () => {
      await page.goto('/products/123');
      await page.getByRole('button', { name: 'Add to Cart' }).click();
      await expect(page.getByTestId('cart-count')).toHaveText('1');
    });

    //When
    await test.step('When the user proceeds to checkout', async () => {
      await test.step('Navigate to cart', async () => {
        await page.goto('/cart');
      });
      await test.step('Initiate checkout', async () => {
        await page.getByRole('button', { name: 'Checkout' }).click();
      });
    });

    await test.step('And completes the payment form', async () => {
      await page.getByLabel('Card Number').fill('4242424242424242');
      await page.getByLabel('Expiry').fill('12/25');
      await page.getByLabel('CVC').fill('123');
      await page.getByRole('button', { name: 'Pay' }).click();
    });

    //Then
    await test.step('Then the order should be confirmed', async () => {
      await expect(page).toHaveURL(/order-confirmation/);
      await expect(page.getByText('Order Confirmed')).toBeVisible();
    });
  });
});
```

## Classic Checkout Flow (example)

```typescript
//Not recommended for Gherkin scenarios, due to difficulty in identifying what failed and less legibility.
test.describe('Checkout Flow', () => {
  test('complete purchase', async ({ page }) => {
    // Add to cart
    await page.goto('/products/123');
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.getByTestId('cart-count')).toHaveText('1');

    // Checkout
    await page.goto('/cart');
    await page.getByRole('button', { name: 'Checkout' }).click();

    // Payment
    await page.getByLabel('Card Number').fill('4242424242424242');
    await page.getByLabel('Expiry').fill('12/25');
    await page.getByLabel('CVC').fill('123');
    await page.getByRole('button', { name: 'Pay' }).click();

    // Confirmation
    await expect(page).toHaveURL(/order-confirmation/);
    await expect(page.getByText('Order Confirmed')).toBeVisible();
  });
});
```

## Test Data Management

It is excellent practice to keep data out of scenarios, especially when it is complex or reused.
Externalize the data to fixtures or static data files, and reference them in the test using a name or a key.

```typescript
// fixtures/testData.ts
export const testUsers = {
  standard: {
    email: 'standard@test.com',
    password: 'TestPass123!',
  },
  admin: {
    email: 'admin@test.com',
    password: 'AdminPass123!',
  },
};

// Test setup
test.beforeEach(async ({ page }) => {
  // Seed test data
  await page.request.post('/api/test/seed');
});

test.afterEach(async ({ page }) => {
  // Clean up
  await page.request.post('/api/test/cleanup');
});
```

## Cross-Browser Testing

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
});
```

