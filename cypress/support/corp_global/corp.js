import { Headers, Params, Endpoints } from '../helper'

let corporationCounter = 1

Cypress.Commands.add('createCorporationActive', (customPayload = {}) => {
    const getRandomLetters = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        return alphabet[Math.floor(Math.random() * alphabet.length)] +
            alphabet[Math.floor(Math.random() * alphabet.length)]
    }

    const testName = `cypressteste${getRandomLetters()}${Date.now()}`

    const defaultPayload = {
        name: testName,
        status: 1,
        limitEquipmentsActive: 2,
        integrationContract: ""
    }

    const payload = { ...defaultPayload, ...customPayload }

    cy.get('@authTokenCorporation').then((token) => {
        const apiUrl = Cypress.env('API_URL')

        if (!apiUrl) {
            throw new Error('API_URL not set. Please run cy.loginCorporation() first.')
        }

        cy.log(`Creating corporation: ${testName}`)

        cy.request({
            method: 'POST',
            url: `${apiUrl}${Endpoints.corporation.base}`,
            headers: Headers.jsonAuth(token),
            body: payload,
            failOnStatusCode: false
        }).then((createResponse) => {
            cy.log(`Create Status: ${createResponse.status}`)

            if (createResponse.status !== 201 && createResponse.status !== 200) {
                cy.log('Failed to create corporation')
                cy.wrap(createResponse).as('createCorporationResponse')
                return
            }

            cy.log('Corporation created successfully, searching for ID...')

            const searchAndGetId = (retryCount = 0) => {
                cy.getAllCorporations()
                cy.get('@getAllCorporationsResponse').then((listResponse) => {
                    const found = listResponse.body?.items?.find(
                        item => item.name === testName
                    )

                    if (found) {
                        const corporationId = found.id
                        Cypress.env('corporationId', corporationId)
                        cy.log(`Corporation ID found: ${corporationId}`)
                        cy.log(`Corporation name: ${found.name}`)
                        cy.log(`Corporation status: ${found.status === 1 ? 'Active' : 'Inactive'}`)

                        const responseWithData = {
                            status: createResponse.status,
                            body: found
                        }
                        cy.wrap(responseWithData).as('createCorporationResponse')
                    } else if (retryCount < 3) {
                        cy.log(`Corporation not found yet, retrying... (${retryCount + 1}/3)`)
                        cy.wait(1000)
                        searchAndGetId(retryCount + 1)
                    } else {
                        cy.log('Corporation created but not found after 3 retries')
                        cy.log(`Name searched: ${testName}`)
                        cy.wrap(createResponse).as('createCorporationResponse')
                    }
                })
            }

            searchAndGetId()
        })
    })
})

let corporationinactiveCounter = 1

Cypress.Commands.add('createCorporationInactive', (customPayload = {}) => {
    const randomLetters = () => {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        return letters.charAt(Math.floor(Math.random() * letters.length)) +
            letters.charAt(Math.floor(Math.random() * letters.length))
    }

    const testName = `cypressteste${randomLetters()}${corporationinactiveCounter}`
    corporationinactiveCounter++

    const defaultPayload = {
        name: testName,
        status: 0,
        limitEquipmentsActive: 2,
        integrationContract: ""
    }

    const payload = { ...defaultPayload, ...customPayload }

    cy.get('@authTokenCorporation').then((token) => {
        const apiUrl = Cypress.env('API_URL')
        if (!apiUrl) {
            throw new Error('API_URL not set. Please run cy.loginCorporation() first.')
        }

        cy.log(`Creating corporation: ${testName}`)

        cy.request({
            method: 'POST',
            url: `${apiUrl}${Endpoints.corporation.base}`,
            headers: Headers.jsonAuth(token),
            body: payload,
            failOnStatusCode: false
        }).then((response) => {
            cy.log(`Response Status: ${response.status}`)

            if (response.status === 200 || response.status === 201) {
                cy.log('Corporation created successfully')
                cy.log(`Corporation name: ${testName}`)

                if (response.body?.id) {
                    Cypress.env('corporationId', response.body.id)
                    cy.log(`Corporation ID: ${response.body.id}`)
                }

                cy.wrap(response).as('createCorporationResponse')
            } else if (response.status === 409) {
                cy.log('Name conflict, retrying with new random letters...')
                cy.createCorporationActive(customPayload)
            } else {
                cy.log('Failed to create corporation. Status:', response.status)
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
        cy.log('No corporationId found, skipping get')
        cy.wrap(null).as('getCorporationResponse')
        return
    }

    cy.get('@authTokenCorporation').then((token) => {
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
    cy.get('@authTokenCorporation').then((token) => {
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
                cy.log(`Retrieved ${count} corporations`)
            }
            cy.wrap(response).as('getAllCorporationsResponse')
        })
    })
})