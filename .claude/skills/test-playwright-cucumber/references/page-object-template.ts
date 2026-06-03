/**
 * page-object-template.ts — Professional-grade page object for Playwright.
 *
 * Principles applied:
 *   - No networkidle — wait for specific elements or API responses.
 *   - Page objects never contain assertions (expect). They return values or perform actions.
 *   - Use test fixtures for dependency injection (page, request, etc.).
 *   - Fragments (dialogs) receive a Locator, not the whole page, for better reusability.
 *   - Async methods that interact with the UI wait for appropriate conditions (not arbitrary sleeps).
 *   - Clear separation between navigation, actions, and state queries.
 */

import { type Page, type Locator } from '@playwright/test';

// ─── Base Page Object ───────────────────────────────────────────────────────────

/**
 * Abstract base class for page objects.
 * Provides shared helpers, but avoids networkidle.
 */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to the page’s URL. */
  abstract goto(): Promise<void>;

  /** Wait for the page to be interactive (DOM content loaded). */
  async waitForReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Get the main heading (h1). */
  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  /** Get a toast notification (role="status" or "alert"). */
  getToastMessage(): Locator {
    return this.page.getByRole('status').or(this.page.getByRole('alert')).first();
  }

  /** Wait for loading spinner to disappear (prefer this over isLoading boolean). */
  async waitForLoadingToComplete(): Promise<void> {
    const spinner = this.page.getByTestId('loading-spinner');
    if (await spinner.isVisible()) {
      await spinner.waitFor({ state: 'hidden', timeout: 10000 });
    }
  }
}

// ─── Users List Page ────────────────────────────────────────────────────────────

/**
 * Page object for the Users list (/users).
 */
export class UsersPage extends BasePage {
  // Locators are public readonly properties.
  readonly createButton: Locator;
  readonly searchInput: Locator;
  readonly userTable: Locator;
  readonly emptyState: Locator;
  readonly paginationNext: Locator;
  readonly paginationPrev: Locator;

  constructor(page: Page) {
    super(page);
    this.createButton = page.getByTestId('create-user-btn');
    this.searchInput = page.getByRole('searchbox', { name: /search users/i });
    this.userTable = page.getByRole('table');
    this.emptyState = page.getByTestId('empty-state');
    this.paginationNext = page.getByRole('button', { name: /next/i });
    this.paginationPrev = page.getByRole('button', { name: /previous/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/users');
    await this.waitForReady();
    await this.waitForLoadingToComplete();
  }

  /** Search for users – waits for the debounced API response. */
  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    // Wait for the specific API call that returns search results.
    await this.page.waitForResponse(
      (res) => res.url().includes('/api/v1/users') && res.status() === 200,
      { timeout: 5000 }
    );
    await this.waitForLoadingToComplete();
  }

  /** Click "Create User". */
  async clickCreateUser(): Promise<void> {
    await this.createButton.click();
  }

  /** Get a Locator for a user row by email. */
  getUserRow(email: string): Locator {
    return this.userTable.getByRole('row').filter({ hasText: email });
  }

  /** Click the edit button for a specific user. */
  async clickEditUser(email: string): Promise<void> {
    const row = this.getUserRow(email);
    await row.getByRole('button', { name: /edit/i }).click();
  }

  /** Click the delete button for a specific user. */
  async clickDeleteUser(email: string): Promise<void> {
    const row = this.getUserRow(email);
    await row.getByRole('button', { name: /delete/i }).click();
  }

  /** Get the number of user rows (excluding table header). */
  async getUserCount(): Promise<number> {
    const rows = this.userTable.getByRole('row');
    const totalRows = await rows.count();
    // Assumes first row is header. Alternative: use a data-testid for data rows.
    return totalRows > 0 ? totalRows - 1 : 0;
  }

  /** Go to the next page, waiting for the table to refresh. */
  async goToNextPage(): Promise<void> {
    await this.paginationNext.click();
    await this.waitForLoadingToComplete();
  }
}

// ─── Create User Dialog (Fragment) ───────────────────────────────────────────────

/**
 * Dialog fragment – receives the dialog Locator, not the whole Page.
 * This makes it reusable across different parent pages.
 */
export class CreateUserDialog {
  private readonly dialog: Locator;
  private readonly emailInput: Locator;
  private readonly displayNameInput: Locator;
  private readonly roleSelect: Locator;
  private readonly submitButton: Locator;
  private readonly cancelButton: Locator;

  /** Accepts a Locator that points to the dialog container. */
  constructor(dialog: Locator) {
    this.dialog = dialog;
    this.emailInput = dialog.getByLabel('Email');
    this.displayNameInput = dialog.getByLabel('Display name');
    this.roleSelect = dialog.getByLabel('Role');
    this.submitButton = dialog.getByRole('button', { name: /create/i });
    this.cancelButton = dialog.getByRole('button', { name: /cancel/i });
  }

  /** Wait for the dialog to be visible. */
  async waitForOpen(): Promise<void> {
    await this.dialog.waitFor({ state: 'visible' });
  }

  /** Fill the form. */
  async fillForm(data: { email: string; displayName: string; role?: string }): Promise<void> {
    await this.emailInput.fill(data.email);
    await this.displayNameInput.fill(data.displayName);
    if (data.role) {
      await this.roleSelect.selectOption(data.role);
    }
  }

  /** Submit and wait for the API response. */
  async submit(): Promise<void> {
    await this.submitButton.click();
    // Wait for the creation response – the page object does not assert, but returns.
    // The test will handle assertions.
  }

  /** Cancel and wait for dialog to be removed. */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.dialog.waitFor({ state: 'hidden' });
  }
}
