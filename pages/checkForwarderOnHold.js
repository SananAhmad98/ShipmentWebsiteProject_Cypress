
export class checkForwarderOnHold{

    weblocators = {
        adminButton:'button.main-nav--item-block:contains("Admin")',
        forwarderButton:'.main-nav--item-block-menu--item',
        uploadShipmentAttachment: 'input#shipmentAttachment[type="file"]',
        createShipmentButton: 'button.button--primary[type="submit"]'
        
    };
  
    navigateToForwrderCreationPage()
    {
        cy.wait(5000);
        cy.contains('span.nav-item-label', 'Admin').parent('button').click();
        cy.wait(2000);
        cy.get('span.nav-item-label').contains('Forwarders').filter(':visible').click();
        cy.wait(6000);
        cy.url().should('include', 'admin/forwarders');
    }

    clickNewForwarderBtn()
    {
        cy.contains('a.button.button--primary', 'Add New Forwarder').click();
        cy.wait(3000);
        cy.url().should('include', '/admin/forwarders/add');
    }

    enterForwarderDetails()
    {
        // Fill out each text input field
        cy.wait(5000);
        cy.get('#name').type('forwarderOnCreditHold');
        cy.get('label:contains("Has Credit Hold")').find('input[type="checkbox"]').check({ force: true });
        cy.get('#creditLimit').type('0');
        cy.get('#organization').select('Demo Org'); 
        cy.get('#apEmail').type('ap@example.com');
        cy.get('#opEmail').type('op@example.com');
        cy.get('#paymentTerms').select('NET30'); 
        cy.get('#address1').type('123 Main St');
        cy.get('#address2').type('Suite 100');
        cy.get('#phoneNumber').type('123-456-7890');
        cy.get('#city').type('NY City');
        cy.get('#state').select('CA');   
        cy.get('#zip-code').type('12345');


    }
    clickCreateBtn()
    {
        cy.get('button[type="submit"]').click();
        cy.get('[data-testid="toast-content"]', { timeout: 15000 }).should('be.visible');
        cy.url().should('include', '/admin/forwarders');
        
    }

    navigateToShipments()
    {
        cy.wait(5000);
        cy.get('a.main-nav--item-block[href="/shipments"]').should('be.visible').click();
        cy.wait(5000);
        cy.url().should('include', '/shipments');
    
    }

    uploadShipmentAttachment(filePath1) {
        cy.get(this.weblocators.uploadShipmentAttachment).selectFile(filePath1, { force: true });
        cy.wait(6000);
        cy.get(this.weblocators.createShipmentButton).click();
    }

   assertToast()
   {
    cy.get('[data-testid="toast-content"]')
    .should('be.visible')
    .and('have.text', 'Customer is on credit hold. Please contact your billing administrator.');
   }

   deleteCreatedForwarder()
   {
    cy.get('input[placeholder="Search by Name"]').type('forwarderOnCreditHold', { force: true });
    cy.get('tbody tr.forwarder-list-item').first()
    .find('button[type="button"] .fa-trash').click();

   }
    
  }