// scripts/scaffold-bdd.mjs
// Cross-platform scaffolding script for @badeball/cypress-cucumber-preprocessor + Cypress projects.
//
// Usage:
//   node scripts/scaffold-bdd.mjs           — Level 3 (default)
//   node scripts/scaffold-bdd.mjs --level 1 — Basic
//   node scripts/scaffold-bdd.mjs --level 2 — Intermediate
//   node scripts/scaffold-bdd.mjs --level 4 — Enterprise

import { mkdirSync, writeFileSync, existsSync, appendFileSync } from 'fs'

const args = process.argv.slice(2)
const levelArg = args.indexOf('--level')
const level = levelArg !== -1 ? Number(args[levelArg + 1]) : 3

if (![1, 2, 3, 4].includes(level)) {
  console.error('Error: --level must be 1, 2, 3, or 4')
  process.exit(1)
}

// ── Directory sets by level ───────────────────────────────────────────────

const level1Dirs = [
  'cypress/e2e/features',
  'cypress/support/step_definitions',
  'cypress/support',
]

const level2Dirs = [
  ...level1Dirs,
  'cypress/e2e/features/auth',
  'cypress/support/step_definitions/auth',
  'cypress/support/step_definitions/shared',
  'cypress/support/pages/auth',
]

const level3Dirs = [
  ...level2Dirs,
  'cypress/e2e/features/checkout',
  'cypress/support/step_definitions/checkout',
  'cypress/support/pages/checkout',
  'cypress/utils',
  'cypress/fixtures/auth',
  'cypress/fixtures/products',
]

const level4Dirs = [
  ...level3Dirs,
  'cypress/e2e/features/catalog',
  'cypress/e2e/features/cart',
  'cypress/e2e/features/admin',
  'cypress/support/step_definitions/catalog',
  'cypress/support/step_definitions/cart',
  'cypress/support/step_definitions/admin',
  'cypress/support/pages/catalog',
  'cypress/support/pages/cart',
  'cypress/support/pages/admin',
  '.github/workflows',
]

const dirSets = { 1: level1Dirs, 2: level2Dirs, 3: level3Dirs, 4: level4Dirs }
const dirs = dirSets[level]

console.log(`\nScaffolding Level ${level} Cypress Cucumber BDD project...\n`)

for (const dir of dirs) {
  mkdirSync(dir, { recursive: true })
  console.log(`  created: ${dir}/`)
}

// ── cypress.config.ts ─────────────────────────────────────────────────────

const filterSpecsConfig =
  level >= 2
    ? `\n    env: {\n      TAGS: '@regression',\n    },`
    : ''

const cypressConfig = `import { defineConfig } from 'cypress'
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor'
import createEsbuildPlugin from '@bahmutov/cypress-esbuild-preprocessor'

export default defineConfig({
  e2e: {
    baseUrl: process.env.VITE_APP_TO_TEST_URI ?? 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    retries: { runMode: 0, openMode: 0 },${filterSpecsConfig}
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      on('file:preprocessor', createEsbuildPlugin())
      return config
    },
  },
})
`

writeFileSync('cypress.config.ts', cypressConfig)
console.log('  created: cypress.config.ts')

// ── .cypress-cucumber-preprocessorrc.json ────────────────────────────────

const preprocessorRc = JSON.stringify(
  {
    stepDefinitions: [
      'cypress/e2e/[filepath]/**/*.{js,ts}',
      'cypress/e2e/[filepath].{js,ts}',
      'cypress/support/step_definitions/**/*.{js,ts}',
    ],
    filterSpecs: true,
    omitFiltered: true,
  },
  null,
  2
)

writeFileSync('.cypress-cucumber-preprocessorrc.json', preprocessorRc + '\n')
console.log('  created: .cypress-cucumber-preprocessorrc.json')

// ── tsconfig.json ─────────────────────────────────────────────────────────

const paths =
  level >= 2
    ? `,\n    "paths": {\n      "@pages/*": ["cypress/support/pages/*"],\n      "@utils/*": ["cypress/utils/*"],\n      "@support/*": ["cypress/support/*"],\n      "@fixtures/*": ["cypress/fixtures/*"]\n    }`
    : ''

const tsconfig = `{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "baseUrl": "."${paths},
    "types": ["cypress"],
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "cypress/**/*.ts", "**/*.feature", "cypress.config.ts"],
  "exclude": ["node_modules", "dist", "reports", "cypress/videos", "cypress/screenshots"]
}
`

writeFileSync('tsconfig.json', tsconfig)
console.log('  created: tsconfig.json')

// ── cypress/support/e2e.ts ────────────────────────────────────────────────

const e2eSupport = level >= 3
  ? `import './commands'\nimport './hooks'\n`
  : `import './commands'\n`

writeFileSync('cypress/support/e2e.ts', e2eSupport)
console.log('  created: cypress/support/e2e.ts')

// ── cypress/support/commands.ts ───────────────────────────────────────────

writeFileSync(
  'cypress/support/commands.ts',
  `Cypress.Commands.add('getByTestId', (id: string) =>
  cy.get(\`[data-testid="\${id}"]\`)
)

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(id: string): Chainable<JQuery<HTMLElement>>
    }
  }
}
`
)
console.log('  created: cypress/support/commands.ts')

// ── cypress/utils/config.ts (Level 3+) ───────────────────────────────────

if (level >= 3) {
  writeFileSync(
    'cypress/utils/config.ts',
    `export const config = {
  baseUrl:          Cypress.env('VITE_APP_TO_TEST_URI') ?? 'http://localhost:5173',
  environment:      Cypress.env('VITE_ENV') ?? 'dev',
  timeout:          Number(Cypress.env('TIMEOUT')) || 10000,
  testUserEmail:    Cypress.env('TEST_USER_EMAIL') ?? 'user@example.com',
  testUserPassword: Cypress.env('TEST_USER_PASSWORD') ?? 'password123',
}
`
  )
  console.log('  created: cypress/utils/config.ts')

  // ── cypress/support/hooks.ts ───────────────────────────────────────────
  writeFileSync(
    'cypress/support/hooks.ts',
    `import { Before, After, BeforeAll, AfterAll } from '@badeball/cypress-cucumber-preprocessor'

BeforeAll(() => {
  // Global setup — no cy.* commands available here
})

Before(() => {
  cy.clearCookies()
  cy.clearLocalStorage()
})

Before({ tags: '@authenticated' }, () => {
  cy.session('auth-user', () => {
    cy.request('POST', '/api/auth/login', {
      email: Cypress.env('TEST_USER_EMAIL'),
      password: Cypress.env('TEST_USER_PASSWORD'),
    }).then((response) => {
      window.localStorage.setItem('auth_token', response.body.token)
    })
  })
})

After(() => {
  // Custom teardown — screenshots handled by screenshotOnRunFailure: true
})

AfterAll(() => {
  // Global teardown — no cy.* commands available here
})
`
  )
  console.log('  created: cypress/support/hooks.ts')
}

// ── .gitignore ────────────────────────────────────────────────────────────

const gitignoreContent = [
  '# Cypress runtime output',
  'cypress/videos/',
  'cypress/screenshots/',
  'cypress/cucumber-json/',
  '',
  '# Test reports',
  'reports/',
  '',
  '# Node',
  'node_modules/',
  'dist/',
  '',
  '# Environment',
  '.env',
  '.env.local',
  'cypress.env.json',
].join('\n')

if (!existsSync('.gitignore')) {
  writeFileSync('.gitignore', gitignoreContent + '\n')
} else {
  appendFileSync('.gitignore', '\n# Cypress BDD\n' + gitignoreContent + '\n')
}
console.log('  updated: .gitignore')

// ── cucumber-html-report.js (Level 4) ────────────────────────────────────

if (level >= 4) {
  writeFileSync(
    'cucumber-html-report.js',
    `import { generate } from 'multiple-cucumber-html-reporter'

generate({
  jsonDir: 'cypress/cucumber-json',
  reportPath: 'reports/cucumber',
  metadata: {
    browser: { name: 'chrome', version: 'latest' },
    device: 'CI/Local',
    platform: { name: process.platform },
  },
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: 'My App' },
      { label: 'Environment', value: process.env.VITE_ENV ?? 'dev' },
    ],
  },
})
`
  )
  console.log('  created: cucumber-html-report.js')

  // ── .github/workflows/cypress-cucumber.yml ─────────────────────────────
  writeFileSync(
    '.github/workflows/cypress-cucumber.yml',
    `name: Cypress Cucumber BDD Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  smoke:
    name: Smoke Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
      - run: npm ci
      - name: Run smoke tests
        run: npm run test:e2e:smoke
      - name: Generate HTML report
        if: always()
        run: node cucumber-html-report.js
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: smoke-report
          path: |
            reports/cucumber/
            cypress/videos/
            cypress/screenshots/
          retention-days: 14

  regression:
    name: Regression Tests
    runs-on: ubuntu-latest
    needs: smoke
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
      - run: npm ci
      - name: Run regression tests
        run: npm run test:e2e:regression
      - name: Generate HTML report
        if: always()
        run: node cucumber-html-report.js
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: regression-report
          path: |
            reports/cucumber/
            cypress/videos/
            cypress/screenshots/
          retention-days: 14
`
  )
  console.log('  created: .github/workflows/cypress-cucumber.yml')
}

// ── package.json scripts hint ─────────────────────────────────────────────

console.log('\nCypress Cucumber BDD project structure created successfully.')
console.log('\nAdd these scripts to your package.json:')
console.log('  "test:e2e":            "cypress run"')
console.log('  "test:e2e:open":       "cypress open"')
console.log('  "test:e2e:smoke":      "cypress run --env TAGS=\'@smoke\'"')
console.log('  "test:e2e:regression": "cypress run --env TAGS=\'@regression\'"')
console.log('  "test:e2e:full":       "cypress run --env TAGS=\'@full\'"')

if (level >= 4) {
  console.log('  "test:e2e:report":     "node cucumber-html-report.js"')
}

console.log('\nNext steps:')
console.log('  1. npm install --save-dev @badeball/cypress-cucumber-preprocessor @bahmutov/cypress-esbuild-preprocessor')
console.log('  2. npm install --save-dev cypress typescript')
console.log('  3. npx cypress install')
console.log('  4. Write your first .feature file in cypress/e2e/features/')
console.log('  5. npm run test:e2e:open   — open the Cypress runner')
console.log('  6. npm run test:e2e:smoke  — run smoke tests headless')
