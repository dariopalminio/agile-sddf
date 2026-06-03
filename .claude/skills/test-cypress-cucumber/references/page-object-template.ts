/// <reference types="cypress" />
/**
 * page-object-template.ts — Professional-grade Page Object for Cypress.
 *
 * Principles applied:
 *   - Page Objects export STATIC SELECTOR STRINGS only — no cy.* commands inside.
 *   - Step definitions import selectors and execute cy.* commands themselves.
 *   - Selectors always use data-testid attributes — never CSS classes or element tags.
 *   - Optional: action methods can encapsulate multi-step interactions for reuse.
 *   - Component Page Objects (dialogs, navbars) follow the same pattern, no "Page" suffix.
 */

// ─── Simple Page Object (static selectors only) ────────────────────────────────
// Recommended pattern for this project. Step definitions import and use cy.get().

export class LoginPage {
  static readonly url             = '/login';
  static readonly emailInput      = "[data-testid='email-input']";
  static readonly passwordInput   = "[data-testid='password-input']";
  static readonly submitButton    = "[data-testid='submit-button']";
  static readonly errorMessage    = "[data-testid='error-message']";
  static readonly welcomeMessage  = "[data-testid='welcome-message']";
  static readonly forgotPasswordLink = "[data-testid='forgot-password-link']";
}

// Usage in step definitions:
//
//   import { LoginPage } from '../../pages/LoginPage';
//
//   Given('el usuario está en la página de login', () => {
//     cy.visit(LoginPage.url);
//   });
//
//   When('el usuario completa el login con credenciales válidas', () => {
//     cy.get(LoginPage.emailInput).type('user@test.com');
//     cy.get(LoginPage.passwordInput).type('password123');
//     cy.get(LoginPage.submitButton).click();
//   });
//
//   Then('debería ver el mensaje de bienvenida', () => {
//     cy.get(LoginPage.welcomeMessage).should('be.visible');
//   });


// ─── Extended Page Object (selectors + action methods) ─────────────────────────
// Use when multiple steps share the same multi-command interaction sequence.

export class UsersPage {
  static readonly url             = '/users';
  static readonly createButton    = "[data-testid='create-user-btn']";
  static readonly searchInput     = "[data-testid='search-input']";
  static readonly userTable       = "[data-testid='users-table']";
  static readonly emptyState      = "[data-testid='empty-state']";
  static readonly toast           = "[data-testid='toast']";
  static readonly loadingSpinner  = "[data-testid='loading-spinner']";
  static readonly paginationNext  = "[data-testid='pagination-next']";
  static readonly paginationPrev  = "[data-testid='pagination-prev']";

  // Action method: encapsulates a multi-step interaction
  static searchFor(query: string): void {
    cy.get(UsersPage.searchInput).clear().type(query);
    cy.get(UsersPage.loadingSpinner).should('not.exist');
  }

  // Action method: returns a scoped element (chain-friendly)
  static getUserRow(email: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(UsersPage.userTable).contains('tr', email);
  }

  // Action method: get visible user count (header row excluded)
  static getUserCount(): Cypress.Chainable<number> {
    return cy.get(UsersPage.userTable)
      .find('tr')
      .its('length')
      .then((total: number) => total - 1);
  }
}


// ─── Component Page Object (dialog fragment) ───────────────────────────────────
// Components represent reusable UI pieces — no "Page" suffix.

export class CreateUserDialog {
  static readonly container     = "[data-testid='create-user-dialog']";
  static readonly emailInput    = "[data-testid='dialog-email-input']";
  static readonly nameInput     = "[data-testid='dialog-display-name-input']";
  static readonly roleSelect    = "[data-testid='dialog-role-select']";
  static readonly submitButton  = "[data-testid='dialog-submit-button']";
  static readonly cancelButton  = "[data-testid='dialog-cancel-button']";
  static readonly emailError    = "[data-testid='dialog-email-error']";

  static waitForOpen(): void {
    cy.get(CreateUserDialog.container).should('be.visible');
  }

  static waitForClose(): void {
    cy.get(CreateUserDialog.container).should('not.exist');
  }

  static fill(data: { email: string; name: string; role?: string }): void {
    cy.get(CreateUserDialog.emailInput).type(data.email);
    cy.get(CreateUserDialog.nameInput).type(data.name);
    if (data.role) {
      cy.get(CreateUserDialog.roleSelect).select(data.role);
    }
  }
}


// ─── NavBar Component ──────────────────────────────────────────────────────────

export class NavBar {
  static readonly container    = "[data-testid='navbar']";
  static readonly logo         = "[data-testid='navbar-logo']";
  static readonly userMenu     = "[data-testid='user-menu']";
  static readonly logoutButton = "[data-testid='logout-button']";

  static logout(): void {
    cy.get(NavBar.userMenu).click();
    cy.get(NavBar.logoutButton).click();
  }
}


// ─── Anti-patterns to avoid ────────────────────────────────────────────────────
//
// ✗ cy.get() inside Page Object properties (runs at import time — WRONG):
//   static emailInput = cy.get("[data-testid='email']");  // ← never do this
//
// ✗ Assertions inside Page Object methods:
//   static assertVisible() { cy.get(this.emailInput).should('be.visible'); }  // ← assertions belong in Then steps
//
// ✗ CSS class selectors (brittle):
//   static submitButton = '.submit-btn';  // ← always use data-testid
//
// ✓ Correct: static string selectors only, cy.* commands in step definitions
