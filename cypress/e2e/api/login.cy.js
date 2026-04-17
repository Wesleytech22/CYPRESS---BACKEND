import api from '../../support/api-wrapper'

describe('Login API - Backend', () => {
    before(() => {
        // Carrega o wrapper antes dos testes
        api.load()
    })

    it('Should login successfully via API', () => {
        // Usa o wrapper para pegar o ambiente e usuário
        const environment = Cypress.env('environment') || 'production'
        api.setEnvironment(environment)

        const config = api.getCurrent()
        const user = api.getValidUser()

        cy.request({
            method: 'POST',
            url: `${config.apiUrl}${config.loginEndpoint}`,
            body: {
                username: user.usernameValid,
                password: user.passwordValid
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('access_token')
        })
    })
})