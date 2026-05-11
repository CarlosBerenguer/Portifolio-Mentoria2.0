const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");

module.exports = defineConfig({
  projectId: "bcpj5j",
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/features/**/*.feature",
    supportFile: "cypress/e2e/support/e2e.js",
    env: {
      stepDefinitions: [
        "cypress/e2e/support/steps/**/*.{js,ts}",
        "QA/Cypress/cypress/e2e/support/steps/**/*.{js,ts}",
      ],
    },
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    },
    
  },
});
