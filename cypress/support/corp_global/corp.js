import { Headers, Params, Endpoints } from '../helper'

let corporationCounter = 1

Cypress.Commands.add('createCorporationActive', (customPayload = {}) => {
    const testName = `cypressteste${String(corporationCounter).padStart(2, '0')}`
    corporationCounter++

    const defaultPayload = {
        name: testName,
        status: 1,
        limitEquipmentsActive: 2,
        integrationContract: ""
    }

    const payload = { ...defaultPayload, ...customPayload }

    cy.get('@authToken').then((token) => {
        const apiUrl = Cypress.env('API_URL')
        if (!apiUrl) {
            throw new Error('API_URL not set. Please run cy.apiLogin() first.')
        }

        cy.log(`Creating corporation: ${testName}`)
        cy.log(`Payload: ${JSON.stringify(payload, null, 2)}`)

        cy.request({
            method: 'POST',
            url: `${apiUrl}${Endpoints.corporation.base}`,
            headers: Headers.jsonAuth(token),
            body: payload,
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`Response Status: ${response.status}`)
            cy.log(`Response Body: ${JSON.stringify(response.body, null, 2)}`)

            if (response.status === 200 || response.status === 201) {
                cy.log('✅ Corporation created successfully')
                cy.log(`Corporation name: ${testName}`)

                cy.wait(1000)

                cy.getAllCorporations().then(() => {
                    cy.get('@getAllCorporationsResponse').then((listResponse) => {
                        const found = listResponse.body?.items?.find(item => item.name === testName)
                        if (found) {
                            Cypress.env('corporationId', found.id)
                            cy.log('✅ Corporation ID found:', found.id)
                            cy.wrap({ ...response, body: found }).as('createCorporationResponse')
                        } else {
                            cy.log('⚠️ Corporation created but ID not found in list')
                            cy.wrap(response).as('createCorporationResponse')
                        }
                    })
                })
            } else {
                cy.log('❌ Failed to create corporation. Status:', response.status)
                if (response.body?.message) {
                    cy.log('Error message:', response.body.message)
                }
                cy.wrap(response).as('createCorporationResponse')
            }
        })
    })
})

Cypress.Commands.add('getCorporation', (corporationId) => {
    const id = corporationId || Cypress.env('corporationId')

    if (!id) {
        cy.log('⚠️ No corporationId found, skipping get')
        cy.wrap(null).as('getCorporationResponse')
        return
    }

    cy.get('@authToken').then((token) => {
        const apiUrl = Cypress.env('API_URL')
        if (!apiUrl) {
            throw new Error('API_URL not set. Please run cy.apiLogin() first.')
        }

        cy.log(`Getting corporation ID: ${id}`)

        cy.request({
            method: 'GET',
            url: `${apiUrl}${Endpoints.corporation.byId(id)}`,
            headers: Headers.authOnly(token),
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`Response Status: ${response.status}`)
            cy.wrap(response).as('getCorporationResponse')
        })
    })
})

Cypress.Commands.add('getAllCorporations', (options = {}) => {
    cy.get('@authToken').then((token) => {
        const apiUrl = Cypress.env('API_URL')
        if (!apiUrl) {
            throw new Error('API_URL not set. Please run cy.apiLogin() first.')
        }

        const params = {
            ...Params.listCorporations(),
            ...options
        }

        cy.log(`Getting all corporations from: ${apiUrl}${Endpoints.corporation.base}`)

        cy.request({
            method: 'GET',
            url: `${apiUrl}${Endpoints.corporation.base}`,
            headers: Headers.jsonAuthNoCache(token),
            qs: params,
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`Response Status: ${response.status}`)
            if (response.status === 200) {
                const count = response.body?.items?.length || 0
                cy.log(`✅ Retrieved ${count} corporations`)
            }
            cy.wrap(response).as('getAllCorporationsResponse')
        })
    })
})