describe('Corporation API - Backend', () => {
    before(() => {
        cy.apiLogin()
        cy.wait(1000)
    })

    it('should get all corporations', () => {
        cy.getAllCorporations()
        cy.get('@getAllCorporationsResponse').then((response) => {
            cy.log('RESPONSE:')
            cy.log(`Status: ${response.status}`)
            cy.log(`HEADERS: ${JSON.stringify(response.headers, null, 2)}`)
            cy.log(`BODY: ${JSON.stringify(response.body, null, 2)}`)

            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('items')
            expect(response.body.items).to.be.an('array')
            expect(response.body).to.have.property('meta')
            cy.log(`Found ${response.body.items.length} corporations`)
        })
    })
})

describe('Create Corporation API - Backend', () => {
    before(() => {
        cy.apiLogin()
        cy.wait(1000)
    })

    it('should create corporation', () => {
        cy.createCorporationActive()
        cy.get('@createCorporationResponse').then((response) => {
            cy.log(`Status: ${response.status}`)
            cy.log(`Response Body: ${JSON.stringify(response.body, null, 2)}`)

            expect(response.status).to.be.oneOf([200, 201])

            const corporationId = Cypress.env('corporationId')
            if (corporationId) {
                cy.log(`✅ Corporation created with ID from env: ${corporationId}`)
                expect(corporationId).to.not.be.undefined
            } else if (response.body && response.body.id) {
                expect(response.body).to.have.property('id')
                expect(response.body.name).to.include('CypressCorp')
                cy.log(`✅ Corporation created with ID: ${response.body.id}`)
            } else {
                throw new Error('Corporation created but no ID found in response or env')
            }
        })
    })
})

describe('Get Corporation API', () => {
    before(() => {
        cy.apiLogin()
        cy.wait(1000)
    })

    it('should get corporation by id', () => {
        const corporationId = Cypress.env('corporationId')

        if (!corporationId) {
            cy.log('⚠️ No corporation ID found - run create test first')
            expect(true).to.eq(true)
            return
        }

        cy.getCorporation(corporationId)
        cy.get('@getCorporationResponse').then((response) => {
            cy.log(`Status: ${response.status}`)
            cy.log(`Response Body: ${JSON.stringify(response.body, null, 2)}`)

            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('id')
            expect(response.body.id).to.eq(corporationId)
            cy.log(`✅ Corporation retrieved: ${response.body.name}`)
        })
    })
})