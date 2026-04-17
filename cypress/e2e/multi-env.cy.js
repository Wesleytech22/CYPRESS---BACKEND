import api from '../support/api-wrapper'

describe('Multi-Environment Tests', () => {
    before(() => {
        api.load()
    })

    it('Should list all available environments', () => {
        const environments = api.listEnvironments()
        cy.log(`Available environments: ${environments.join(', ')}`)
        expect(environments).to.include('production')
    })

    it('Should get production config directly', () => {
        const prodConfig = api.get('production')
        expect(prodConfig.apiUrl).to.include('gateway')
    })

    it('Should switch between environments', () => {
        api.setEnvironment('hml')
        const hmlUrl = api.getApiUrl()
        cy.log(`HML API URL: ${hmlUrl}`)
        expect(hmlUrl).to.include('hml')

        api.setEnvironment('production')
        const prodUrl = api.getApiUrl()
        cy.log(`Production API URL: ${prodUrl}`)
        expect(prodUrl).to.include('gateway')
    })
})