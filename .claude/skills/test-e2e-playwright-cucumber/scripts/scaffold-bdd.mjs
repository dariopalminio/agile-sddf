// scripts/scaffold-bdd.mjs
// Cross-platform scaffolding script for @cucumber/cucumber + Playwright projects.
//
// Usage:
//   node scripts/scaffold-bdd.mjs           — Level 3 (default)
//   node scripts/scaffold-bdd.mjs --level 1 — Basic
//   node scripts/scaffold-bdd.mjs --level 2 — Intermediate
//   node scripts/scaffold-bdd.mjs --level 4 — Enterprise

import { mkdirSync, writeFileSync, existsSync, appendFileSync } from 'fs';

const args = process.argv.slice(2);
const levelArg = args.indexOf('--level');
const level = levelArg !== -1 ? Number(args[levelArg + 1]) : 3;

if (![1, 2, 3, 4].includes(level)) {
  console.error('Error: --level must be 1, 2, 3, or 4');
  process.exit(1);
}

// ── Directory sets by level ───────────────────────────────────────────────

const level1Dirs = [
  'e2e/features',
  'e2e/step_definitions',
  'e2e/reports',
];

const level2Dirs = [
  ...level1Dirs,
  'e2e/features/auth',
  'e2e/step_definitions/auth',
  'e2e/step_definitions/shared',
  'e2e/pages/auth',
];

const level3Dirs = [
  ...level2Dirs,
  'e2e/features/checkout',
  'e2e/step_definitions/checkout',
  'e2e/pages/checkout',
  'e2e/utils',
  'e2e/support',
  'e2e/test-data/auth',
  'e2e/test-data/fixtures',
];

const level4Dirs = [
  ...level3Dirs,
  'e2e/features/catalog',
  'e2e/features/cart',
  'e2e/features/admin',
  'e2e/step_definitions/catalog',
  'e2e/step_definitions/cart',
  'e2e/step_definitions/admin',
  'e2e/pages/catalog',
  'e2e/pages/cart',
  'e2e/pages/admin',
  '.github/workflows',
];

const dirSets = { 1: level1Dirs, 2: level2Dirs, 3: level3Dirs, 4: level4Dirs };
const dirs = dirSets[level];

console.log(`\nScaffolding Level ${level} BDD project...\n`);

for (const dir of dirs) {
  mkdirSync(dir, { recursive: true });
  console.log(`  created: ${dir}/`);
}

// ── cucumber.js ───────────────────────────────────────────────────────────

const requirePaths =
  level >= 3
    ? `['e2e/support/hooks.ts', 'e2e/step_definitions/**/*.ts']`
    : `['e2e/step_definitions/**/*.ts']`;

const profiles =
  level >= 4
    ? `
const common = {
  require: ${requirePaths},
  requireModule: ['ts-node/register'],
  publishQuiet: true,
};

module.exports = {
  default: {
    ...common,
    paths: ['e2e/features/**/*.feature'],
    format: ['progress', 'html:e2e/reports/cucumber-report.html', 'json:e2e/reports/cucumber-report.json'],
  },
  smoke: {
    ...common,
    paths: ['e2e/features/**/*.feature'],
    tags: '@smoke and not @wip',
    format: ['progress', 'html:e2e/reports/smoke-report.html'],
  },
  regression: {
    ...common,
    paths: ['e2e/features/**/*.feature'],
    tags: '@regression and not @wip',
    format: ['progress', 'html:e2e/reports/regression-report.html'],
  },
  ci: {
    ...common,
    paths: ['e2e/features/**/*.feature'],
    tags: 'not @wip',
    format: ['progress', 'html:e2e/reports/cucumber-report.html', 'json:e2e/reports/cucumber-report.json', 'junit:e2e/reports/junit-report.xml'],
  },
};
`
    : `
module.exports = {
  default: {
    require: ${requirePaths},
    requireModule: ['ts-node/register'],
    publishQuiet: true,
    paths: ['e2e/features/**/*.feature'],
    tags: 'not @wip',
    format: ['progress', 'html:e2e/reports/cucumber-report.html'],
  },
};
`;

writeFileSync('cucumber.js', profiles.trimStart());
console.log('  created: cucumber.js');

// ── tsconfig.json ─────────────────────────────────────────────────────────

const paths =
  level >= 2
    ? `,\n    "paths": {\n      "@pages/*": ["e2e/pages/*"],\n      "@utils/*": ["e2e/utils/*"],\n      "@support/*": ["e2e/support/*"]\n    }`
    : '';

const tsconfig = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "dist",
    "rootDir": ".",
    "baseUrl": "."${paths},
    "skipLibCheck": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "e2e/reports"]
}
`;

writeFileSync('tsconfig.json', tsconfig);
console.log('  created: tsconfig.json');

// ── e2e/support/world.ts (Level 3+) ──────────────────────────────────────

if (level >= 3) {
  writeFileSync(
    'e2e/support/world.ts',
    `import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';

export interface CustomWorld extends World {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  authToken?: string;
}

export class PlaywrightWorld extends World implements CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  authToken?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(PlaywrightWorld);
`
  );
  console.log('  created: e2e/support/world.ts');

  // ── e2e/utils/config.ts ──────────────────────────────────────────────────
  writeFileSync(
    'e2e/utils/config.ts',
    `export const config = {
  baseUrl:  process.env.BASE_URL  || 'http://localhost:3000',
  headless: process.env.HEADLESS  !== 'false',
  slowMo:   Number(process.env.SLOWMO) || 0,
  timeout:  Number(process.env.TIMEOUT) || 30000,
};
`
  );
  console.log('  created: e2e/utils/config.ts');

  // ── e2e/support/hooks.ts ─────────────────────────────────────────────────
  writeFileSync(
    'e2e/support/hooks.ts',
    `import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { PlaywrightWorld } from './world';
import { config } from '../utils/config';

BeforeAll(async function () {
  // Global setup — no World instance available here
});

Before(async function (this: PlaywrightWorld) {
  this.browser = await chromium.launch({ headless: config.headless, slowMo: config.slowMo });
  this.context = await this.browser.newContext({ baseURL: config.baseUrl, viewport: { width: 1280, height: 720 } });
  this.page    = await this.context.newPage();
  this.page.setDefaultTimeout(config.timeout);
});

Before({ tags: '@authenticated' }, async function (this: PlaywrightWorld) {
  await this.context.storageState({ path: 'e2e/test-data/auth/user.auth.json' });
});

After(async function (this: PlaywrightWorld, scenario) {
  try {
    if (scenario.result?.status === Status.FAILED) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      this.attach(screenshot, 'image/png');
    }
  } finally {
    await this.page?.close();
    await this.context?.close();
    await this.browser?.close();
  }
});

AfterAll(async function () {
  // Global teardown — no World instance available here
});
`
  );
  console.log('  created: e2e/support/hooks.ts');
}

// ── .gitignore ────────────────────────────────────────────────────────────

const gitignoreContent = [
  '# Reports',
  'e2e/reports/',
  '',
  '# Auth state',
  'e2e/test-data/auth/*.auth.json',
  '',
  '# Node',
  'node_modules/',
  'dist/',
  '',
  '# Environment',
  '.env',
  '.env.local',
].join('\n');

if (!existsSync('.gitignore')) {
  writeFileSync('.gitignore', gitignoreContent + '\n');
} else {
  appendFileSync('.gitignore', '\n# Cucumber BDD\n' + gitignoreContent + '\n');
}
console.log('  updated: .gitignore');

// ── CI workflow (Level 4) ─────────────────────────────────────────────────

if (level >= 4) {
  writeFileSync(
    '.github/workflows/cucumber.yml',
    `name: Cucumber BDD Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

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
      - run: npx playwright install --with-deps chromium
      - run: npx cucumber-js --profile smoke
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: smoke-report
          path: e2e/reports/

  regression:
    name: Regression Tests
    runs-on: ubuntu-latest
    needs: smoke
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx cucumber-js --profile regression
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: regression-report
          path: e2e/reports/
`
  );
  console.log('  created: .github/workflows/cucumber.yml');
}

// ── package.json scripts hint ─────────────────────────────────────────────

console.log('\nBDD project structure created successfully.');
console.log('\nAdd these scripts to your package.json:');

if (level >= 4) {
  console.log('  "test":            "npx cucumber-js"');
  console.log('  "test:smoke":      "npx cucumber-js --profile smoke"');
  console.log('  "test:regression": "npx cucumber-js --profile regression"');
  console.log('  "test:ci":         "npx cucumber-js --profile ci"');
} else {
  console.log('  "test": "npx cucumber-js"');
}

console.log('\nNext steps:');
console.log('  1. npm install @cucumber/cucumber @playwright/test ts-node typescript');
console.log('  2. npx playwright install chromium');
console.log('  3. Write your first .feature file in e2e/features/');
console.log('  4. npx cucumber-js --dry-run   — verify step definitions load');
console.log('  5. npx cucumber-js             — run all tests');
