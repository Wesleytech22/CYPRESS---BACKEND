// cypress/support/company_global/company.js
import { Headers, Endpoints } from '../helper'

let companyCounter = 1

Cypress.Commands.add('createCompany', (customPayload = {}) => {
    const corporationId = Cypress.env('corporationId')

    if (!corporationId) {
        throw new Error('No corporationId found. Please create a corporation first.')
    }

    const companyName = `empresateste${String(companyCounter).padStart(2, '0')}`
    companyCounter++

    const defaultPayload = {
        name: companyName,
        status: 1,
        corporationId: corporationId,
        document: "53.228.115/0001-02",
        address: "Rua B",
        city: "Aracaju",
        complement: "casa 3",
        number: "123",
        postalCode: "49066-216",
        uf: "SE"
    }

    const payload = { ...defaultPayload, ...customPayload }

    cy.get('@authToken').then((token) => {
        const apiUrl = Cypress.env('API_URL')
        if (!apiUrl) {
            throw new Error('API_URL not set. Please run cy.apiLogin() first.')
        }

        cy.log(`Creating company: ${companyName}`)
        cy.log(`Using corporationId: ${corporationId}`)
        cy.log(`Payload: ${JSON.stringify(payload, null, 2)}`)

        cy.request({
            method: 'POST',
            url: `${apiUrl}${Endpoints.company.createWithSubsidiary}`,
            headers: Headers.jsonAuth(token),
            body: payload,
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`Response Status: ${response.status}`)
            cy.log(`Response Body: ${JSON.stringify(response.body, null, 2)}`)

            if (response.status === 200 || response.status === 201) {
                cy.log('✅ Company created successfully')
                cy.log(`Company name: ${companyName}`)

                if (response.body && response.body.id) {
                    Cypress.env('companyId', response.body.id)
                    cy.log('✅ Company ID stored:', response.body.id)
                } else if (response.body && response.body.data && response.body.data.id) {
                    Cypress.env('companyId', response.body.data.id)
                    cy.log('✅ Company ID stored:', response.body.data.id)
                }
                cy.wrap(response).as('createCompanyResponse')
            } else {
                cy.log('❌ Failed to create company. Status:', response.status)
                if (response.body?.message) {
                    cy.log('Error message:', response.body.message)
                }
                cy.wrap(response).as('createCompanyResponse')
            }
        })
    })
})

Cypress.Commands.add('getCompany', (companyId) => {
    const id = companyId || Cypress.env('companyId')

    if (!id) {
        cy.log('⚠️ No companyId found, skipping get')
        cy.wrap(null).as('getCompanyResponse')
        return
    }

    cy.get('@authToken').then((token) => {
        const apiUrl = Cypress.env('API_URL')
        if (!apiUrl) {
            throw new Error('API_URL not set. Please run cy.apiLogin() first.')
        }

        cy.log(`Getting company ID: ${id}`)

        cy.request({
            method: 'GET',
            url: `${apiUrl}${Endpoints.company.byId(id)}`,
            headers: Headers.authOnly(token),
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`Response Status: ${response.status}`)
            cy.wrap(response).as('getCompanyResponse')
        })
    })
})

Cypress.Commands.add('getAllCompanies', (corporationId = null) => {
    const corpId = corporationId || Cypress.env('corporationId')

    if (!corpId) {
        throw new Error('No corporationId found. Please create a corporation first.')
    }

    cy.get('@authToken').then((token) => {
        const apiUrl = Cypress.env('API_URL')
        if (!apiUrl) {
            throw new Error('API_URL not set. Please run cy.apiLogin() first.')
        }

        cy.log(`Getting all companies for corporation: ${corpId}`)

        cy.request({
            method: 'GET',
            url: `${apiUrl}${Endpoints.company.byCorporation(corpId)}`,
            headers: Headers.jsonAuthNoCache(token),
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`Response Status: ${response.status}`)
            if (response.status === 200) {
                const items = response.body?.items || response.body?.data || []
                const count = items.length
                cy.log(`✅ Retrieved ${count} companies`)
            }
            cy.wrap(response).as('getAllCompaniesResponse')
        })
    })
})