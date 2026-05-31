// cucumber.js — profile configuration for @cucumber/cucumber
// Usage:
//   npx cucumber-js                          (default profile)
//   npx cucumber-js --profile smoke          (smoke profile)
//   npx cucumber-js --profile regression     (regression profile)
//   npx cucumber-js --profile ci             (CI profile)

const common = {
  require: ['e2e/support/hooks.ts', 'e2e/step_definitions/**/*.ts'],
  requireModule: ['ts-node/register'],
  publishQuiet: true,
};

module.exports = {
  // ── Default: run all scenarios except @wip ──────────────────────────────
  default: {
    ...common,
    paths: ['e2e/features/**/*.feature'],
    tags: 'not @wip',
    format: [
      'progress',
      'html:e2e/reports/cucumber-report.html',
      'json:e2e/reports/cucumber-report.json',
    ],
  },

  // ── Smoke: fast sanity check — @smoke tagged scenarios only ─────────────
  smoke: {
    ...common,
    paths: ['e2e/features/**/*.feature'],
    tags: '@smoke and not @wip',
    format: [
      'progress',
      'html:e2e/reports/smoke-report.html',
      'json:e2e/reports/smoke-report.json',
    ],
  },

  // ── Regression: full suite — @regression tagged scenarios ───────────────
  regression: {
    ...common,
    paths: ['e2e/features/**/*.feature'],
    tags: '@regression and not @wip',
    format: [
      'progress',
      'html:e2e/reports/regression-report.html',
      'json:e2e/reports/regression-report.json',
    ],
  },

  // ── CI: all non-wip with JUnit XML for GitHub Actions ───────────────────
  ci: {
    ...common,
    paths: ['e2e/features/**/*.feature'],
    tags: 'not @wip',
    format: [
      'progress',
      'html:e2e/reports/cucumber-report.html',
      'json:e2e/reports/cucumber-report.json',
      'junit:e2e/reports/junit-report.xml',
    ],
  },
};
