export class login {

    weblocators = {

        email: '#email',
        password: '#password',
        login: '.button--primary'

    }

    openURL() {
        cy.visit(Cypress.env('URL'), { failOnStatusCode: false })
    }

    enterEmail(usremail) {
        
        cy.get(this.weblocators.email).type(usremail);
    }

    enterPassword(usrpassword) {

        cy.get(this.weblocators.password).type(usrpassword);
    }

    clickLogin() {

        cy.get(this.weblocators.login).click();
    }

}