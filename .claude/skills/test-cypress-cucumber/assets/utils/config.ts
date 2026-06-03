// Centralized test configuration — read from Cypress.env() with safe defaults.
// Set values via cypress.env.json, cypress.config.ts env block, or --env CLI flag.
export const config = {
  baseUrl:           Cypress.env('VITE_APP_TO_TEST_URI') ?? 'http://localhost:5173',
  environment:       Cypress.env('VITE_ENV') ?? 'dev',
  timeout:           Number(Cypress.env('TIMEOUT'))    || 10000,
  testUserEmail:     Cypress.env('TEST_USER_EMAIL')    ?? 'user@example.com',
  testUserPassword:  Cypress.env('TEST_USER_PASSWORD') ?? 'password123',
}
