import { defineConfig } from 'cypress'
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
    retries: { runMode: 0, openMode: 0 },
    env: {
      TAGS: '@regression',
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config)
      on('file:preprocessor', createEsbuildPlugin())
      return config  // CRITICAL: must return config or preprocessor silently breaks
    },
  },
})
