describe('Corporation API - Backend', () => {
    before(() => {
        cy.loginCorporation()
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

describe('Creating Corporation Active API - Backend', () => {
    before(() => {
        cy.loginCorporation()
        cy.wait(1000)
    })

    it('should create corporation with status active', () => {
        cy.createCorporationActive()
        cy.get('@createCorporationResponse').then((response) => {
            cy.log(`Status: ${response.status}`)
            cy.log(`Response Body: ${JSON.stringify(response.body, null, 2)}`)

            expect(response.status).to.be.oneOf([200, 201])

            const corporationId = Cypress.env('corporationId')
            if (corporationId) {
                cy.log(`Corporation created with ID from env: ${corporationId}`)
                expect(corporationId).to.not.be.undefined
            } else if (response.body && response.body.id) {
                expect(response.body).to.have.property('id')
                expect(response.body.name).to.include('CypressCorp')
                cy.log(`Corporation created with ID: ${response.body.id}`)
            } else {
                throw new Error('Corporation created but no ID found in response or env')
            }
        })
    })
})

describe('Creating Corporation Inactive API - Backend', () => {
    before(() => {
        cy.loginCorporation()
        cy.wait(1000)
    })

    it('should create corporation with status inactive', () => {
        cy.createCorporationInactive()
        cy.get('@createCorporationResponse').then((response) => {
            cy.log(`Status: ${response.status}`)
            cy.log(`Response Body: ${JSON.stringify(response.body, null, 2)}`)

            expect(response.status).to.be.oneOf([200, 201])

            const corporationId = Cypress.env('corporationId')
            if (corporationId) {
                cy.log(`Corporation created with ID from env: ${corporationId}`)
                expect(corporationId).to.not.be.undefined
            } else if (response.body && response.body.id) {
                expect(response.body).to.have.property('id')
                expect(response.body.name).to.include('CypressCorp')
                cy.log(`Corporation created with ID: ${response.body.id}`)
            } else {
                throw new Error('Corporation created but no ID found in response or env')
            }
        })
    })
})

describe('Get Corporation API', () => {
    before(() => {
        cy.loginCorporation()

        cy.getAllCorporations()
        cy.get('@getAllCorporationsResponse').then((response) => {
            const corporations = response.body?.items || []

            if (corporations.length > 0) {
                const firstCorporation = corporations[0]
                const corporationId = firstCorporation.id

                Cypress.env('corporationId', corporationId)

                cy.log(`First corporation found:`)
                cy.log(`   ID: ${corporationId}`)
                cy.log(`   Name: ${firstCorporation.name}`)
                cy.log(`   Status: ${firstCorporation.status}`)
            } else {
                cy.log('No corporation found - creating a new one...')
                cy.createCorporationActive()
            }
        })
    })

    it('should get corporation by id', () => {
        const corporationId = Cypress.env('corporationId')

        if (!corporationId) {
            throw new Error('No corporation ID available - cannot run test')
        }

        cy.log(`Searching for corporation by ID: ${corporationId}`)

        cy.getCorporation(corporationId)
        cy.get('@getCorporationResponse').then((response) => {
            cy.log(`Status: ${response.status}`)
            cy.log(`Corporation found:`)
            cy.log(`   ID: ${response.body.id}`)
            cy.log(`   Name: ${response.body.name}`)
            cy.log(`   Status: ${response.body.status}`)

            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('id')
            expect(response.body.id).to.eq(corporationId)
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('status')

            cy.log(`Test passed! Corporation retrieved successfully: ${response.body.name}`)
        })
    })
})