export class shipmentRouting {

    weblocators = {
        providerReadyDateInput: 'input#ui-date-time-input-ready-date.input.ui-date-time-input',
        providerReadyTimeInput: 'input#ui-date-time-input-ready-time.input.ui-date-time-input',
        providerRadioFieldSet: 'div.range-radio input[type="radio"][name="shipmentExpectedDeliveryRange"][value="{buttonName}"]',
        deliveryDateInput: 'input#ui-date-time-input-delivery-date',
        deliveryTimeInput: 'input#ui-date-time-input-delivery-time',
        serviceDateInput: '.belt input[type="date"]:nth-of-type(1)',

        //naked button
        nakedButton: 'button.button--naked .fa-angle-left',

        //search by shipment reference number
        searchInputByReferenceNumber: 'input[placeholder="Search by Ref Number"]',

        //route to routing page
        routingLinkLocator: 'a[href="/admin/routing"]',

        driverSelectDropdown: 'div.routing-vehicles > div.ui-card.routing-vehicle-card:has(div.detail-block:contains("Clunker")) select.flat',
        firstRoutingVehicleCard: 'div.routing-vehicles > div.ui-card.routing-vehicle-card:has(div.detail-block:contains("Clunker"))',
        defaultButton: 'button.button.button--default',
        primaryButton: 'button.button.button--primary',
        checkboxInFirstRoutingVehicleCard: 'div.routing-vehicles > div.ui-card.routing-vehicle-card:has(div.detail-block:contains("Clunker")) input[type="checkbox"]',
        confirmRouteCompletionButton: 'button.button--select.button.button--primary'
    }


    enterProviderInformation() {
        cy.getCurrentDateTimeInMST().then(({ formattedDate }) => {
            cy.getCurrentDateTimeInMST(1).then(({ formattedTime: futureTime }) => {
                cy.get(this.weblocators.providerReadyDateInput).type(formattedDate, { force: true });
                cy.get(this.weblocators.providerReadyTimeInput).type(futureTime, { force: true });
            });

            cy.getCurrentDateTimeInMST(4).then(({ formattedTime: futureTime }) => {
                cy.get(this.weblocators.deliveryDateInput).type(formattedDate, { force: true });
                cy.get(this.weblocators.deliveryTimeInput).type(futureTime, { force: true });
            });

        });
    }


    enterProviderInformationUsingCurrDateTime() {
        cy.getCurrentDateTimeInPKT().then(({ formattedDate }) => {
            cy.get(this.weblocators.providerReadyDateInput).type(formattedDate, { force: true });
            cy.get(this.weblocators.deliveryDateInput).type(formattedDate, { force: true });
        });
    }

    searchDragnDropRecordByRefNo() {
        cy.get('@forwarderReferenceNumber').then(fwdRefNo => {
            // Click the routing link and wait for the page to load
            cy.get(this.weblocators.routingLinkLocator).click().wait(10000);
            //cy.get(this.weblocators.nakedButton).click();

            cy.getCurrentDateTimeInPKT(0, -1).then(({ formattedDate }) => {
                cy.get(this.weblocators.serviceDateInput).type(formattedDate, { force: true });
            });

            // Search for the reference number and wait for the results
            cy.get(this.weblocators.searchInputByReferenceNumber).scrollIntoView().should('be.visible').type(fwdRefNo, { force: true });
            cy.wait(4000);

            // Check the checkbox for the relevant shipment
            cy.get('tr.shipment-list-item').contains('td', fwdRefNo.toUpperCase()).parent('tr').find('input[type="checkbox"]').check({ force: true });

            // Click the "Add Route" button
            cy.get('div.routing-details-footer').find('button').contains('Add Route').click();

            // Perform drag-and-drop
            cy.get('tr.shipment-list-item.is-selected').first().then($source => {
                cy.get('div.route-shipments').first().then($target => {
                    const dataTransfer = new DataTransfer();
                    cy.wrap($source).trigger('mousedown', { which: 1, button: 0, force: true });
                    cy.wrap($source).trigger('dragstart', { dataTransfer, force: true });
                    cy.wait(2000);
                    cy.wrap($target).trigger('dragover', { dataTransfer, force: true });
                    cy.wait(2000);
                    cy.wrap($target).trigger('drop', { dataTransfer, force: true });
                    cy.wait(2000);
                    cy.get('div.route-shipments').find('div.routing-shipment-card').should('contain', fwdRefNo.toUpperCase());
                });
            });
        });
    }


    saveAndDispatchRoute(driver1) {
        cy.get(this.weblocators.driverSelectDropdown).select(driver1);
        cy.get('@forwarderReferenceNumber').then(fwdRefNo => {
            cy.get(this.weblocators.firstRoutingVehicleCard).first().then($source => {
                cy.get('div.route-shipments').first().then($target => {
                    const dataTransfer = new DataTransfer();
                    cy.wrap($source).trigger('mousedown', { which: 1, button: 0, force: true });
                    cy.wrap($source).trigger('dragstart', { dataTransfer, force: true });
                    cy.wait(2000);
                    cy.wrap($target).trigger('dragover', { dataTransfer, force: true });
                    cy.wait(2000);
                    cy.wrap($target).trigger('drop', { dataTransfer, force: true });
                    cy.wait(2000);
                    cy.get(this.weblocators.defaultButton).contains(' Save Routes ').click();
                    cy.wait(2000);
                    cy.get(this.weblocators.checkboxInFirstRoutingVehicleCard).check({ force: true });
                    cy.get(this.weblocators.primaryButton).contains('Dispatch Route').click();
                    cy.wait(10000);
                });
            });
        });
    }
}