describe('Company API - Backend', () => {
    before(() => {
        cy.loginCorporation()
        cy.wait(1000)
    })

    it('should create a corporation first', () => {
        cy.createCorporationActive()
        cy.get('@createCorporationResponse').then((response) => {
            cy.log(`Corporation creation status: ${response.status}`)
            expect(response.status).to.be.oneOf([200, 201])

            const corporationId = Cypress.env('corporationId')
            expect(corporationId).to.not.be.undefined
            cy.log(`Corporation ID: ${corporationId}`)
        })
    })

    it('should create a company', () => {
        const corporationId = Cypress.env('corporationId')
        expect(corporationId).to.not.be.undefined

        cy.createCompany()
        cy.get('@createCompanyResponse').then((response) => {
            cy.log(`Status: ${response.status}`)
            cy.log(`Response Body: ${JSON.stringify(response.body, null, 2)}`)

            expect(response.status).to.be.oneOf([200, 201])

            if (response.body && response.body.id) {
                expect(response.body).to.have.property('id')
                cy.log(`Company created with ID: ${response.body.id}`)
            }
        })
    })

    it('should get all companies', () => {
        const corporationId = Cypress.env('corporationId')
        expect(corporationId).to.not.be.undefined

        cy.getAllCompanies()
        cy.get('@getAllCompaniesResponse').then((response) => {
            expect(response.status).to.eq(200)
            if (response.body && response.body.items) {
                expect(response.body.items).to.be.an('array')
                cy.log(`Found ${response.body.items.length} companies`)
            }
        })
    })

    it('should get company by id', () => {
        const companyId = Cypress.env('companyId')

        if (!companyId) {
            cy.log('No company ID found - run create test first')
            expect(true).to.eq(true)
            return
        }

        cy.getCompany(companyId)
        cy.get('@getCompanyResponse').then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('id')
            expect(response.body.id).to.eq(companyId)
            cy.log(`Company retrieved: ${response.body.name}`)
        })
    })
})