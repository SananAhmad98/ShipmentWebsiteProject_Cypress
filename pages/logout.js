export class logout {

    logoutUser() {

        cy.get('.is-sticky-top > :nth-child(1)').click();
        cy.contains('button', 'Logout').click();
    }

}