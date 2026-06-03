/// <reference types="cypress" />
/**
 * e2e-test-template.ts — Annotated Cypress E2E test (without Cucumber).
 *
 * Place at: tests/e2e/specs/users/create-user.cy.ts
 *
 * This template demonstrates:
 *   - Using Page Objects (tests never touch selectors directly)
 *   - API-based test data setup (fast) and cleanup (reliable) via cy.request()
 *   - Cypress retry-ability instead of explicit waits
 *   - Testing success paths, error paths, and edge cases
 *   - Auth state reuse via cy.session()
 *
 * Import your Page Object like this in the real file:
 *   import { UsersPage } from '../../pages/UsersPage';
 */

// ─── Inline selectors (replace with Page Object import in real tests) ──────────
const UsersPage = {
  url:              '/users',
  createUserButton: "[data-testid='create-user-btn']",
  searchInput:      "[data-testid='search-input']",
  userTable:        "[data-testid='users-table']",
  emptyState:       "[data-testid='empty-state']",
  toast:            "[data-testid='toast']",
  Dialog: {
    emailInput:       "[data-testid='dialog-email-input']",
    displayNameInput: "[data-testid='dialog-display-name-input']",
    roleSelect:       "[data-testid='dialog-role-select']",
    submitButton:     "[data-testid='dialog-submit-button']",
    cancelButton:     "[data-testid='dialog-cancel-button']",
    emailError:       "[data-testid='dialog-email-error']",
  },
};

// ─── Auth helper — reuse session across tests ──────────────────────────────────

function loginAsAdmin(): void {
  cy.session('admin-auth', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('API_BASE_URL')}/api/auth/login`,
      body: {
        email:    Cypress.env('ADMIN_EMAIL'),
        password: Cypress.env('ADMIN_PASSWORD'),
      },
    }).then((res: Cypress.Response<{ token: string }>) => {
      cy.setCookie('auth_token', res.body.token);
    });
  });
}

// ─── Test Suite: Create User ───────────────────────────────────────────────────

describe('Create User', () => {
  beforeEach(() => {
    loginAsAdmin();
    cy.visit(UsersPage.url);
  });

  // ─── Success Path ─────────────────────────────────
  it('creates a new user with valid data', () => {
    const email = `e2e-create-${Date.now()}@example.com`;

    cy.get(UsersPage.createUserButton).click();
    cy.get(UsersPage.Dialog.emailInput).type(email);
    cy.get(UsersPage.Dialog.displayNameInput).type('E2E Test User');
    cy.get(UsersPage.Dialog.roleSelect).select('member');
    cy.get(UsersPage.Dialog.submitButton).click();

    cy.get(UsersPage.toast).should('contain.text', 'created successfully');
    cy.get(UsersPage.userTable).contains(email).should('be.visible');
  });

  // ─── Validation Error Path ─────────────────────────
  it('shows validation error for invalid email', () => {
    cy.get(UsersPage.createUserButton).click();
    cy.get(UsersPage.Dialog.emailInput).type('not-an-email');
    cy.get(UsersPage.Dialog.displayNameInput).type('Invalid Email User');
    cy.get(UsersPage.Dialog.submitButton).click();

    cy.get(UsersPage.Dialog.emailError).should('contain.text', 'Invalid email');
    cy.get(UsersPage.toast).should('not.exist');
  });

  // ─── Duplicate Error Path ─────────────────────────
  it('shows error when creating user with duplicate email', () => {
    const duplicateEmail = `e2e-dup-${Date.now()}@example.com`;

    // Arrange: create user via API first (fast setup)
    cy.request({
      method: 'POST',
      url:    `${Cypress.env('API_BASE_URL')}/api/users`,
      body:   { email: duplicateEmail, displayName: 'Existing User' },
    }).as('existingUser');

    // Act: try to create duplicate via UI
    cy.get(UsersPage.createUserButton).click();
    cy.get(UsersPage.Dialog.emailInput).type(duplicateEmail);
    cy.get(UsersPage.Dialog.displayNameInput).type('Duplicate User');
    cy.get(UsersPage.Dialog.submitButton).click();

    cy.get(UsersPage.toast).should('contain.text', 'already exists');

    // Cleanup
    cy.get<Cypress.Response<{ id: string }>>('@existingUser').then((res) => {
      cy.request('DELETE', `${Cypress.env('API_BASE_URL')}/api/users/${res.body.id}`);
    });
  });

  // ─── Cancel Flow ──────────────────────────────────
  it('cancelling the dialog does not create a user', () => {
    cy.get(UsersPage.userTable).find('tr').its('length').then((countBefore: number) => {
      cy.get(UsersPage.createUserButton).click();
      cy.get(UsersPage.Dialog.emailInput).type('should-not-exist@example.com');
      cy.get(UsersPage.Dialog.cancelButton).click();

      cy.get(UsersPage.Dialog.emailInput).should('not.exist');
      cy.get(UsersPage.userTable).find('tr').should('have.length', countBefore);
    });
  });
});

// ─── Test Suite: User List ─────────────────────────────────────────────────────

describe('User List', () => {
  before(() => {
    loginAsAdmin();
    Cypress._.times(3, (i: number) => {
      cy.request({
        method: 'POST',
        url:    `${Cypress.env('API_BASE_URL')}/api/users`,
        body:   { email: `e2e-list-${i}-${Date.now()}@example.com`, displayName: `List User ${i}` },
      });
    });
  });

  beforeEach(() => {
    loginAsAdmin();
    cy.visit(UsersPage.url);
  });

  it('displays users in a table', () => {
    cy.get(UsersPage.userTable).find('tr').its('length').should('be.gte', 4);
  });

  it('filters users by search query', () => {
    cy.get(UsersPage.searchInput).type('List User 0');
    cy.get(UsersPage.userTable).contains('List User 0').should('be.visible');
  });

  it('shows empty state for no results', () => {
    cy.get(UsersPage.searchInput).type('nonexistent-user-xyz-999');
    cy.get(UsersPage.emptyState).should('be.visible');
  });
});

// ─── Test Suite: User Edit ─────────────────────────────────────────────────────

describe('Edit User', () => {
  let testUserId: string;

  beforeEach(() => {
    loginAsAdmin();
    cy.request({
      method: 'POST',
      url:    `${Cypress.env('API_BASE_URL')}/api/users`,
      body:   { email: `e2e-edit-${Date.now()}@example.com`, displayName: 'Before Edit' },
    }).then((res: Cypress.Response<{ id: string }>) => {
      testUserId = res.body.id;
    });
    cy.visit(UsersPage.url);
  });

  afterEach(() => {
    cy.request('DELETE', `${Cypress.env('API_BASE_URL')}/api/users/${testUserId}`);
  });

  it('edits user display name', () => {
    cy.contains(UsersPage.userTable, 'Before Edit')
      .closest('tr')
      .find("[data-testid='edit-button']")
      .click();

    cy.url().should('include', '/edit');
    cy.get("[data-testid='display-name-input']").clear().type('After Edit');
    cy.get("[data-testid='save-button']").click();

    cy.url().should('include', '/users');
    cy.get("[role='alert']").should('contain.text', 'updated');
  });
});
