export class openShipmentFromRoutingPage{

    weblocators = {

        routingLinkLocator: 'a[href="/admin/routing"]',
        shipmentList: 'tr.shipment-list-item',
        shipmentRefrenceSpan:'span.view-shipment-item',
        viewShipmentHref:'a[title="View Shipment"]',
        shipmentRefrenceNum:'input[name="shipmentReferenceNumber"]'
    }

    navigateToROutingPage()
    {
        cy.wait(2000);
        cy.get(this.weblocators.routingLinkLocator).click().wait(5000);
    }

    saveFirstRecordRefrenceNumber()
    {
        cy.get(this.weblocators.shipmentList).first().within(() => {
            // Extract the text from the <span> tag and wrap it for later use
            cy.get(this.weblocators.shipmentRefrenceSpan)
              .invoke('text') // Extract the text content of the <span>
              .then((text) => {
                // Wrap the extracted span value for later use in other Cypress commands
                cy.wrap(text.trim()).as('refrenceNumberValue'); // Store the trimmed text as an alias
              });
            });
    }

    clickFirstRecordRefrenceNumber()
    {
        
        cy.get(this.weblocators.shipmentList).first() // Get the first row of the shipment list
        .find(this.weblocators.viewShipmentHref) // Find the "View Shipment" link within that row
        .click();
        cy.wait(5000);
    }

    assertViewShipment()
    {
        cy.get('@refrenceNumberValue').then((value) => {
            let refNumber = value; 
            cy.get(this.weblocators.shipmentRefrenceNum)
              .invoke('val') // Extract the value from the input field
              .then((inputValue) => {
                // Step 3: Compare both values
                expect(inputValue.trim()).to.equal(refNumber); // Perform the comparison
              });
          });
    }

    
}
