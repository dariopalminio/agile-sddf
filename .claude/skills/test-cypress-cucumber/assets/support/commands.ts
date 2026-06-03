// Custom Cypress commands for BDD step definitions
// Import this file from cypress/support/e2e.ts

Cypress.Commands.add('getByTestId', (id: string) =>
  cy.get(`[data-testid="${id}"]`)
)

Cypress.Commands.add('findByTestId', { prevSubject: 'element' }, (subject, id: string) =>
  cy.wrap(subject).find(`[data-testid="${id}"]`)
)

// TypeScript declarations — add to cypress/support/index.d.ts or global.d.ts
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Get an element by its data-testid attribute.
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(id: string): Chainable<JQuery<HTMLElement>>

      /**
       * Find a child element by its data-testid attribute.
       * @example cy.get('form').findByTestId('error-message')
       */
      findByTestId(id: string): Chainable<JQuery<HTMLElement>>
    }
  }
}
