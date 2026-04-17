import api from './api-wrapper'

// Comando de login usando o wrapper
Cypress.Commands.add('apiLogin', (environment = 'production') => {
    // Carrega o wrapper e define o ambiente
    return api.load().then(() => {
        api.setEnvironment(environment)
        const user = api.getValidUser()
        const apiUrl = api.getApiUrl()

        return cy.request({
            method: 'POST',
            url: `${apiUrl}/api-acl/authentication/login`,
            body: {
                username: user.usernameValid,
                password: user.passwordValid
            },
            failOnStatusCode: false
        }).then((response) => {
            if (response.status === 200) {
                cy.wrap(response.body.access_token).as('authToken')
            }
            return response
        })
    })
})