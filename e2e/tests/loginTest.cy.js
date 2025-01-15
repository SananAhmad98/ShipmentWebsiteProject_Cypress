import { login } from "../../pages/login"

const loginObj = new login()

import loginData from "../../fixtures/loginData.json"

describe('test automation', () => {

    it('login flow', () => {

        //assertion for email check 
        expect(loginData.email).to.match(/^[a-zA-Z0-9.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        loginObj.openURL()
        loginObj.enterEmail(loginData.email)
        loginObj.enterPassword(loginData.password)
        loginObj.clickLogin()
        //assertion for dashboard screen 
        Cypress.Commands.add('waitForAdminShipmentsPage', () => {
          return cy.url().should('include', '/shipments?filter=%255B%255D&page=1');
        });

    })

})