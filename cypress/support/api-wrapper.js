// ============================================
// API WRAPPER - SOMENTE BACKEND
// ============================================

class ApiWrapper {
    constructor() {
        this.environments = null
        this.currentEnvironment = null
    }

    // Carregar configurações dos ambientes
    load() {
        return cy.fixture('environments').then((environments) => {
            this.environments = environments
            return this
        })
    }

    // Definir ambiente atual
    setEnvironment(envName) {
        if (!this.environments[envName]) {
            throw new Error(`Ambiente "${envName}" não encontrado. Opções: ${Object.keys(this.environments).join(', ')}`)
        }
        this.currentEnvironment = envName
        Cypress.env('environment', envName)
        cy.log(`🌍 API Ambiente: ${envName}`)
        return this
    }

    // Obter configuração do ambiente atual
    getCurrent() {
        const envName = this.currentEnvironment || Cypress.env('environment') || 'production'
        return this.environments[envName]
    }

    // Obter configuração de um ambiente específico
    get(envName) {
        return this.environments[envName]
    }

    // Obter URL da API
    getApiUrl() {
        return this.getCurrent().apiUrl
    }

    // Obter usuário válido
    getValidUser() {
        return this.getCurrent().users.validUser
    }

    // Obter usuário inválido
    getInvalidUser() {
        return this.getCurrent().users.invalidUser
    }

    // Listar todos ambientes
    listEnvironments() {
        return Object.keys(this.environments)
    }
}

export default new ApiWrapper()