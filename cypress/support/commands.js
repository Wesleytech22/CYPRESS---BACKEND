import api from './api-wrapper'
import './corp_global/corp'
import './company_global/company'
import { Headers, Endpoints } from './helper'

Cypress.Commands.add('apiLogin', (environment = null) => {
    // ⭐ Lê o ambiente da linha de comando ou usa padrão 'qa'
    const env = environment || Cypress.env('environment') || 'qa'

    cy.then(() => api.load()).then(() => {
        api.setEnvironment(env)
        const user = api.getRootUser()
        const apiUrl = api.getApiUrl()

        Cypress.env('API_URL', apiUrl)
        Cypress.env('TENANT_CODE', 'portal')
        Cypress.env('environment', env)

        cy.log(`🌍 Environment: ${env}`)
        cy.log(`✅ API_URL set to: ${Cypress.env('API_URL')}`)
        cy.log(`✅ TENANT_CODE set to: ${Cypress.env('TENANT_CODE')}`)

        const requestBody = {
            username: user.usernameValid,
            password: user.passwordValid
        }

        cy.log(`📤 REQUEST: POST ${apiUrl}${Endpoints.auth.login}`)
        cy.log(`📦 BODY: ${JSON.stringify(requestBody, null, 2)}`)

        cy.request({
            method: 'POST',
            url: `${apiUrl}${Endpoints.auth.login}`,
            body: requestBody,
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`📥 RESPONSE: Status ${response.status}`)

            if (response.status === 200) {
                const token = response.body.access_token
                cy.wrap(token).as('authToken')
                Cypress.env('authToken', token)
                cy.log('✅ Login successful')
                cy.log(`🔑 Token: ${token.substring(0, 50)}...`)
                cy.log(`🌍 Connected to: ${env}`)
            } else {
                cy.log('❌ Login failed with status:', response.status)
                cy.log(`📦 Response body: ${JSON.stringify(response.body, null, 2)}`)
            }
        })
    })
})

Cypress.Commands.add('apiRequest', (method, endpoint, options = {}) => {
    return cy.get('@authToken', { timeout: 10000 }).then((token) => {
        if (!token) {
            throw new Error('No authToken found. Please run cy.apiLogin() first.')
        }

        const apiUrl = Cypress.env('API_URL')
        if (!apiUrl) {
            throw new Error('API_URL not set. Please run cy.apiLogin() first.')
        }

        const tenantCode = options.tenantCode || Cypress.env('TENANT_CODE') || 'portal'
        cy.log(`🔧 API_URL from env: ${apiUrl}`)
        cy.log(`🔧 TENANT_CODE: ${tenantCode}`)

        const requestOptions = {
            method,
            url: `${apiUrl}${endpoint}`,
            headers: options.headers || Headers.jsonAuth(token, tenantCode),
            qs: options.params || {},
            body: options.body || null,
            failOnStatusCode: options.failOnStatusCode || false
        }

        cy.log(`📤 REQUEST: ${method} ${requestOptions.url}`)
        cy.log(`📋 HEADERS: ${JSON.stringify(requestOptions.headers, null, 2)}`)
        if (requestOptions.body) {
            cy.log(`📦 BODY: ${JSON.stringify(requestOptions.body, null, 2)}`)
        }
        if (Object.keys(requestOptions.qs).length > 0) {
            cy.log(`🔍 QUERY PARAMS: ${JSON.stringify(requestOptions.qs, null, 2)}`)
        }

        return cy.request(requestOptions).then((response) => {
            cy.log(`📥 RESPONSE: ${method} ${endpoint} - Status: ${response.status}`)
            return response
        })
    })
})

Cypress.Commands.add('apiLogout', () => {
    cy.get('@authToken').then((token) => {
        const apiUrl = Cypress.env('API_URL')
        const tenantCode = Cypress.env('TENANT_CODE') || 'portal'
        if (apiUrl && token) {
            cy.request({
                method: 'POST',
                url: `${apiUrl}${Endpoints.auth.logout}`,
                headers: Headers.authOnly(token, tenantCode),
                failOnStatusCode: false
            }).then((response) => {
                cy.log(`Logout response: ${response.status}`)
            })
        }
    })
    cy.wrap(null).as('authToken')
    Cypress.env('authToken', null)
    cy.log('✅ Logged out and token cleared')
})

Cypress.Commands.add('isLoggedIn', () => {
    return cy.get('@authToken').then((token) => {
        return !!token
    })
})