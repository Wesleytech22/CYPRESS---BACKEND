import api from './api-wrapper'

Cypress.Commands.add('apiLogin', (environment = 'dev') => {
    return api.load().then(() => {
        api.setEnvironment(environment)
        const user = api.getRootUser()
        const apiUrl = api.getApiUrl()
        const loginEndpoint = api.getLoginEndpoint()

        const requestBody = {
            username: user.usernameValid,
            password: user.passwordValid
        }

        cy.log(`REQUEST: POST ${apiUrl}${loginEndpoint}`)
        cy.log(`BODY: ${JSON.stringify(requestBody, null, 2)}`)

        return cy.request({
            method: 'POST',
            url: `${apiUrl}${loginEndpoint}`,
            body: requestBody,
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`RESPONSE: Status ${response.status}`)
            cy.log(`BODY: ${JSON.stringify(response.body, null, 2)}`)

            if (response.status === 200) {
                cy.wrap(response.body.access_token).as('authToken')
            }
            return response
        })
    })
})

Cypress.Commands.add('apiRequest', (method, endpoint, body = null) => {
    cy.get('@authToken').then((token) => {
        return api.load().then(() => {
            const apiUrl = api.getApiUrl()

            const options = {
                method,
                url: `${apiUrl}${endpoint}`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                failOnStatusCode: false
            }

            if (body) {
                options.body = body
            }

            return cy.request(options)
        })
    })
})