// cypress/support/api-wrapper.js
class ApiWrapper {
    constructor() {
        this.environments = null
        this.currentEnvironment = null
    }

    load() {
        return cy.fixture('environments').then((environments) => {
            this.environments = environments
            return this
        })
    }

    setEnvironment(envName) {
        if (!this.environments[envName]) {
            throw new Error(`Environment "${envName}" not found. Options: ${Object.keys(this.environments).join(', ')}`)
        }
        this.currentEnvironment = envName
        Cypress.env('environment', envName)
        cy.log(`API Environment: ${envName}`)
        return this
    }

    getCurrent() {
        const envName = this.currentEnvironment || Cypress.env('environment') || 'qa'
        return this.environments[envName]
    }

    get(envName) {
        return this.environments[envName]
    }

    getApiUrl() {
        return this.getCurrent().apiUrl
    }

    getLoginEndpoint() {
        return '/api-acl/authentication/login'
    }

    getCorporationEndpoint() {
        return '/api-acl/corporation'
    }

    getValidUser() {
        return this.getCurrent().users.validUser
    }

    getInvalidUser() {
        return this.getCurrent().users.invalidUser
    }

    getRootUser() {
        return this.getCurrent().users.rootUser
    }

    listEnvironments() {
        return Object.keys(this.environments)
    }
}

export default new ApiWrapper()