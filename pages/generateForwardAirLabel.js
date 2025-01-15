export class generateForwardAirLabel{

    weblocators = {

    originInput:'label[for="ORIGIN"]',
    originPlaceholder:'input[placeholder="IATA"]',
    destInput:'label[for="DEST"]',
    destPlaceholder:'input[placeholder="IATA"]',
    totalPiecesInput:'label[for="TOTAL"]',
    totalPiecesPlaceholder:'input[placeholder="TOTAL"]',
    generateBtn:'button.button.button--primary',
    labelImg:'img.label-image[alt="Label Preview"]',
    printPdf:'button.button.button--primary',
    closeModal:'button[title="Close Modal"]'

    }

   generateLabel()
   {
    cy.contains('div', 'Generate Label')
    .should('be.visible')  // Ensure the div is visible
    .click(); 
   }

   enterOrigin()
   {
    cy.wait(1000);
    cy.get(this.weblocators.originInput) // Select the label using its "for" attribute
      .should('contain', 'Origin IATA') // Assert the label contains the correct text
      .then(() => {
        cy.get(this.weblocators.originInput) // Select the label
        .next(this.weblocators.originPlaceholder) // Find the input next to the label
        .should('be.visible') // Ensure the input is visible
        .clear() // Clear any existing value
        .type('LAX');
      });
   }

   enterDestination()
   {
    cy.get(this.weblocators.destInput) // Select the label for Destination
      .should('contain', 'Destination IATA') // Assert the label text
      .then(() => {
        cy.get(this.weblocators.destInput)
        .next(this.weblocators.destPlaceholder) // Use placeholder to locate the input
          .should('be.visible') // Ensure visibility
          .clear() // Clear any existing value
          .type('JFK'); // Enter the Destination IATA code
      });
   }
   
   enterTotalPieces()
   {
    cy.get(this.weblocators.totalPiecesInput) // Select the label for Total Pieces
      .should('contain', 'Total Pieces') // Assert the label text
      .then(() => {
        cy.get(this.weblocators.totalPiecesPlaceholder) // Use placeholder to locate the input
          .should('be.visible') // Ensure visibility
          .clear() // Clear any existing value
          .type('10'); // Enter the total pieces value
      });
   }

   clickGenerateLabelBtn()
   {
    cy.contains(this.weblocators.generateBtn, 'Generate Label')
    .should('be.visible') // Ensure the button is visible
    .click();
    cy.wait(2000);
   }
    
   verifyThelabel()
   {
        cy.get(this.weblocators.labelImg)
        .should('be.visible') // Ensure the image is visible
        .and('have.class', 'label-image') // Confirm the correct class
        .and('have.attr', 'alt', 'Label Preview'); 

        cy.contains(this.weblocators.printPdf, 'Print PDF') // Find the button by class and text
        .should('be.visible')  // Ensure the button is visible
        .and('not.be.disabled')  // Ensure the button is not disabled

   }

   closeLabelPopUp()
   {
    cy.get('.modal').should('be.visible'); // Adjust the modal selector as needed

    // Click the Close Modal button
    cy.get(this.weblocators.closeModal)
      .should('be.visible') // Ensure the button is visible
      .click();
   }
    
}