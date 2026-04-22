import api from '../support/api-wrapper'

describe('Login API - Backend', () => {
    let environment = Cypress.env('environment') || 'qa'

    before(() => {
        api.load()
    })

    it('Should login successfully via API', () => {
        api.setEnvironment(environment)
        const user = api.getRootUser()
        const apiUrl = api.getApiUrl()
        const loginEndpoint = api.getLoginEndpoint()

        const requestBody = {
            username: user.usernameValid,
            password: user.passwordValid
        }

        cy.log('REQUEST:')
        cy.log(`URL: POST ${apiUrl}${loginEndpoint}`)
        cy.log(`BODY: ${JSON.stringify(requestBody, null, 2)}`)

        cy.request({
            method: 'POST',
            url: `${apiUrl}${loginEndpoint}`,
            body: requestBody,
            failOnStatusCode: false
        }).then((response) => {
            cy.log('RESPONSE:')
            cy.log(`Status: ${response.status}`)
            cy.log(`HEADERS: ${JSON.stringify(response.headers, null, 2)}`)
            cy.log(`BODY: ${JSON.stringify(response.body, null, 2)}`)

            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('access_token')
        })
    })
})