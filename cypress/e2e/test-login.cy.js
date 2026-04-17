describe('Test Login Only', () => {
    it('should login successfully', () => {
        cy.apiLogin().then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('access_token')
            cy.log('✅ Login successful! Token:', response.body.access_token)
        })
    })
})