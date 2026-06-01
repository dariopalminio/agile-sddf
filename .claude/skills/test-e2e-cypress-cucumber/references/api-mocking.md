# API Mocking in E2E Tests

## When to load
Load when mocking API responses in Cypress tests: route interception with `cy.intercept()`, fixture files, mock data factories.

## cy.intercept() — Interceptar y mockear rutas

```typescript
// Mock a specific API endpoint
it('displays orders from API', () => {
  cy.intercept('GET', '**/api/orders', {
    statusCode: 200,
    body: {
      orders: [
        { id: '1', total: 4999, status: 'completed' },
        { id: '2', total: 1299, status: 'pending' },
      ],
    },
  }).as('getOrders');

  cy.visit('/orders');
  cy.wait('@getOrders');
  cy.contains('$49.99').should('be.visible');
  cy.contains('$12.99').should('be.visible');
});

// Mock error responses
it('shows error state on API failure', () => {
  cy.intercept('GET', '**/api/orders', {
    statusCode: 500,
    body: { error: 'Server error' },
  }).as('getOrdersError');

  cy.visit('/orders');
  cy.wait('@getOrdersError');
  cy.contains('Something went wrong').should('be.visible');
});

// Intercept and modify real responses with a handler function
it('modify real API response', () => {
  cy.intercept('GET', '**/api/user', (req) => {
    req.reply((res) => {
      res.body.featureFlags = { ...res.body.featureFlags, newCheckout: true };
    });
  }).as('getUser');

  cy.visit('/');
  cy.wait('@getUser');
});
```

## Usar fixtures como respuesta

```typescript
// cypress/fixtures/orders.json
// { "orders": [{ "id": "1", "total": 4999, "status": "completed" }] }

it('loads orders from fixture', () => {
  cy.intercept('GET', '**/api/orders', { fixture: 'orders.json' }).as('getOrders');

  cy.visit('/orders');
  cy.wait('@getOrders');
  cy.get('[data-testid="order-list"]').should('exist');
});
```

## Esperar llamadas a la API

```typescript
// Wait for specific request to complete and assert the response
it('submit order', () => {
  cy.visit('/checkout');

  cy.intercept('POST', '**/api/orders').as('placeOrder');

  cy.get('[data-testid="place-order-btn"]').click();

  cy.wait('@placeOrder').then((interception) => {
    expect(interception.response?.statusCode).to.eq(201);
  });

  cy.contains('Order confirmed').should('be.visible');
});
```

## Mock Data Factories

```typescript
// cypress/support/factories.ts
export function buildOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: crypto.randomUUID(),
    userId: 'user-1',
    total: 4999,
    status: 'pending',
    items: [{ name: 'Widget', qty: 1, price: 4999 }],
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// Usage in test
it('shows completed order', () => {
  cy.intercept('GET', '**/api/orders', {
    body: { orders: [buildOrder({ status: 'completed' })] },
  }).as('getOrders');

  cy.visit('/orders');
  cy.wait('@getOrders');
  cy.contains('completed').should('be.visible');
});
```

## Uso en step definitions BDD (Cucumber)

```typescript
// tests/e2e/step_definitions/orders.steps.ts
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('la API de órdenes devuelve datos de prueba', () => {
  cy.intercept('GET', '**/api/orders', {
    statusCode: 200,
    body: { orders: [{ id: '1', total: 4999, status: 'completed' }] },
  }).as('getOrders');
});

When('el usuario visita la página de órdenes', () => {
  cy.visit('/orders');
  cy.wait('@getOrders');
});

Then('debería ver la orden completada', () => {
  cy.contains('$49.99').should('be.visible');
});
```

## Anti-patterns
- Mockear TODAS las APIs → se pierden bugs de integración real; mockear solo lo necesario
- Datos mock hardcodeados inline → usar factories para mantenibilidad
- No testear estados de error → cobertura solo del happy path
- `cy.wait(2000)` en lugar de `cy.wait('@alias')` → tests frágiles
- Olvidar el `.as('alias')` → no se puede esperar ni inspeccionar el intercept

## Quick reference
```
cy.intercept():        interceptar y mockear cualquier petición de red
{ fixture: 'file.json' }: usar fixture como respuesta
req.reply():           modificar la respuesta real antes de devolverla
cy.wait('@alias'):     esperar una petición específica y obtener su interception
Factories:             buildOrder(), buildUser() para datos de test consistentes
Mock errors:           testear estados 400, 401, 403, 404, 500
```
