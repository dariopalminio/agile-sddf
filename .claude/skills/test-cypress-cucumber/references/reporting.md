# Reporting

## JSON Output from Preprocessor

The `@badeball/cypress-cucumber-preprocessor` can emit JSON results after each run. Configure output path in `package.json`:

```json
{
  "cypress-cucumber-preprocessor": {
    "json": {
      "enabled": true,
      "output": "cypress/cucumber-json/cucumber-report.json"
    }
  }
}
```

JSON files accumulate in `cypress/cucumber-json/` — add this directory to `.gitignore`.

## HTML Report with multiple-cucumber-html-reporter

```bash
npm install --save-dev multiple-cucumber-html-reporter
```

`cucumber-html-report.js` (project root):

```javascript
import { generate } from 'multiple-cucumber-html-reporter'

generate({
  jsonDir: 'cypress/cucumber-json',
  reportPath: 'reports/cucumber',
  metadata: {
    browser: { name: 'chrome', version: 'latest' },
    device: 'Local test run',
    platform: { name: process.platform },
  },
  customData: {
    title: 'Run Info',
    data: [
      { label: 'Project', value: 'My App' },
      { label: 'Release', value: process.env.npm_package_version ?? '0.0.0' },
      { label: 'Environment', value: process.env.VITE_ENV ?? 'dev' },
    ],
  },
})
```

Run: `node cucumber-html-report.js`

## Screenshots

Screenshots on failure are captured automatically when `screenshotOnRunFailure: true` is set in `cypress.config.ts`. They land in `cypress/screenshots/` and are embedded in the Cypress run summary.

For custom screenshot attachment in hooks:

```typescript
After(function () {
  if (this.currentTest?.state === 'failed') {
    const title = this.currentTest.title.replace(/\s+/g, '-')
    cy.screenshot(`failure-${title}`)
  }
})
```

## Video Recording

Videos of full runs land in `cypress/videos/` when `video: true`. Add to `.gitignore`:

```
cypress/videos/
cypress/screenshots/
cypress/cucumber-json/
reports/
```

## GitHub Actions — Artifacts

```yaml
- name: Run Cypress Cucumber tests
  run: npm run test:e2e:regression

- name: Generate HTML report
  if: always()
  run: node cucumber-html-report.js

- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: cucumber-report
    path: |
      reports/cucumber/
      cypress/videos/
      cypress/screenshots/
    retention-days: 14
```
