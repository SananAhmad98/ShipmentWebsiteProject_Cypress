export class updateShipmentProNumber{

    weblocators = {
        shipmentForwarderInput: 'input#shipmentForwarder',
        forwarderReferenceNumberInput: 'input[name="shipmentReferenceNumber"][placeholder="Reference Number"]',
        forwarderPRONumberInput: 'input[name="shipmentProNumber"][placeholder="PRO Number"]',
        forwarderMawbInput: 'input[name="shipmentMawb"][placeholder="MAWB"]',
        forwarderSpan:'span.proNumberField.prompt',
        forwarderSpanInput:'input.proNumberInput',
        forwarderInputAccept:'.edit_button_accept',
        forwarderSpanAssert:'span.proNumberField'


    }

    enterForwarderDetailsExceptProNo(forwarder) {
        cy.wait(3000);
        cy.get(this.weblocators.shipmentForwarderInput).wait(10000).scrollIntoView().should('be.visible').type(forwarder);
        const forwarderReferenceNumber = Math.floor(1000 + Math.random() * 9000).toString();
        const forwarderMAWBInput = Math.floor(1000 + Math.random() * 9000).toString();
        // Use {force: true} to type into a disabled input otherwise we explicitly need to click that field to make it enabled 
        cy.get(this.weblocators.forwarderReferenceNumberInput).type(forwarderReferenceNumber);
        cy.contains('label', 'Tariff').parent().find('select').select('jimbo');
        cy.wrap(forwarderReferenceNumber).as('forwarderReferenceNumber');
        cy.get(this.weblocators.forwarderMawbInput).should('be.visible').clear({ force: true }).type(forwarderMAWBInput);

    }

    enterProNumber(proNumber)
    {
            cy.wait(4000);
              // Double-click on the cell to activate editing
              cy.get(this.weblocators.forwarderSpan)
                .should('contain', 'Double Click to add PRO#') // Assert the initial state
                .dblclick();
          
                cy.get(this.weblocators.forwarderSpanInput)
                .should('be.visible') // Ensure the input is visible
                .clear() // Clear any existing value
                .type(proNumber);
          
              // Click the edit (accept) button
              cy.get(this.weblocators.forwarderInputAccept)
                .should('be.visible') // Ensure the button is visible
                .click();
          
              // Assert that the newly entered number is displayed in the cell
              cy.get(this.weblocators.forwarderSpanAssert)
                .should('contain', proNumber);
        
          
    }

   
    
    
}