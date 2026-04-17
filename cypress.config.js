const { defineConfig } = require('cypress');

module.exports = defineConfig({
    projectId: 'k9qgwp',
    e2e: {
        setupNodeEvents(on, config) {
            on('task', {
                log(message) {
                    console.log(message);
                    return null;
                }
            });
            return config;
        },
        specPattern: 'cypress/e2e/**/*.cy.js',
        supportFile: 'cypress/support/e2e.js',
        experimentalRunAllSpecs: true,
    },
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    video: false,
    screenshotOnRunFailure: false,
});