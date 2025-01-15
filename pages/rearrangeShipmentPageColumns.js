export class rearrangeShipmentPageColumns{

    webLocators = {
        
        columnButton : 'button.button--outline',
        dropDownDiv:'div.table-filter-dropdown',
        recordSorting:'button[button-icon] .fa-chevron-down.icon-slate',
        tableHeader:'thead.table-head tr th'

        }

        clickColumnsButton()
        {
            cy.contains(this.webLocators.columnButton, 'Column').click();
        }
        
        clickSortButtons()
        {
            cy.get(this.webLocators.dropDownDiv).should('be.visible');
            cy.get(this.webLocators.recordSorting).eq(0).click();
            cy.get(this.webLocators.recordSorting).eq(2).click();

        }
        
        uncheckLastTwoColumns()
        {
            cy.contains('label', 'Ready Date')
            .parent()
            .find('input.table-filter-checkbox')
            .uncheck({ force: true });

            cy.contains('label', 'Service Date')
            .parent()
            .find('input.table-filter-checkbox')
            .uncheck({ force: true });
        }

        verifyColumnsOrder()
        {
            cy.contains('a','Quotes').click()
            cy.wait(2000);
            cy.url().should('include','/admin/quotes')
            cy.contains('a', 'Shipments').click();
            cy.wait(2000);
            cy.url().should('include', '/shipments');
            cy.get(this.webLocators.tableHeader).then((headers) => {
                // Check that the first header is "CUDA ID"
                cy.wrap(headers).eq(0).should('contain.text', 'CUDA ID');
                // Check that the second header is "Ref Number"
                cy.wrap(headers).eq(1).should('contain.text', 'Ref Number');
                // Check that the third header is "MAWB"
                cy.wrap(headers).eq(2).should('contain.text', 'MAWB');
                // Check that the fourth header is "PRO #"
                cy.wrap(headers).eq(3).should('contain.text', 'PRO #');  
        }
    )}
        verifyUncheckedColumns()
        {
        
         // Target <thead> and check that "Ready Date" and "Service Date" are not visible within it
         cy.get('thead.table-head').within(() => {
             cy.contains('span', 'Ready Date').should('not.be.visible');
             cy.contains('span', 'Service Date').should('not.be.visible');
         });                        
    }
}