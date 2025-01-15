export class shipmentRouting {

    weblocators = {
        providerReadyDateInput: 'input#ui-date-time-input-ready-date.input.ui-date-time-input',
        providerReadyTimeInput: 'input#ui-date-time-input-ready-time.input.ui-date-time-input',
        providerRadioFieldSet: 'div.range-radio input[type="radio"][name="shipmentExpectedDeliveryRange"][value="{buttonName}"]',
        providerPickupDateInput: 'input#ui-date-time-input-pickup-date',
        providerPickUpTimeInput: 'input#ui-date-time-input-pickup-time',
        providerDropDateInput: 'input#ui-date-time-input-drop-date',
        providerDropTimeInput: 'input#ui-date-time-input-drop-time',

        //naked button
        nakedButton: 'button.button--naked .fa-angle-left',

        //search by shipment reference number
        searchInputByReferenceNumber: 'input[placeholder="Search by Ref Number"]',

        //route to routing page
        routingLinkLocator: 'a[href="/admin/routing"]',

        driverSelectDropdown: 'div.routing-vehicles > div.ui-card.routing-vehicle-card:has(div.detail-block:contains("Truck 01")) select.flat',
        driverSelectDropdown2: 'div.routing-vehicles > div.ui-card.routing-vehicle-card:has(div.detail-block:contains("18-Wheeler")) select.flat',
        firstRoutingVehicleCard: 'div.routing-vehicles > div.ui-card.routing-vehicle-card:has(div.detail-block:contains("Truck 01"))',
        secondRoutingVehicleCard: 'div.routing-vehicles > div.ui-card.routing-vehicle-card:has(div.detail-block:contains("18-Wheeler"))',
        defaultButton: 'button.button.button--default',
        primaryButton: 'button.button.button--primary',
        checkboxInFirstRoutingVehicleCard: 'div.routing-vehicles > div.ui-card.routing-vehicle-card:has(div.detail-block:contains("Truck 01")) input[type="checkbox"]',
        checkboxInSecondRoutingVehicleCard: 'div.routing-vehicles > div.ui-card.routing-vehicle-card:has(div.detail-block:contains("18-Wheeler")) input[type="checkbox"]',
        confirmRouteCompletionButton: 'button.button--select.button.button--primary'
    }


    enterProviderInformation() {
        cy.getCurrentDateTimeInMST().then(({ formattedDate }) => {
            cy.getCurrentDateTimeInMST(1).then(({ formattedTime: futureTime }) => {
                cy.get(this.weblocators.providerReadyDateInput).type(formattedDate, { force: true });
                cy.get(this.weblocators.providerReadyTimeInput).type(futureTime, { force: true });
            });

            cy.getCurrentDateTimeInMST(4).then(({ formattedTime: futureTime }) => {
                cy.get(this.weblocators.providerPickupDateInput).type(formattedDate, { force: true });
                cy.get(this.weblocators.providerPickUpTimeInput).type(futureTime, { force: true });
            });

            cy.getCurrentDateTimeInMST(25).then(({ formattedTime: futureTime }) => {
                cy.get(this.weblocators.providerDropDateInput).type(formattedDate, { force: true });
                cy.get(this.weblocators.providerDropTimeInput).type(futureTime, { force: true });
            });

        });
    }


    enterProviderInformationUsingCurrDateTime() {
        // Get current date and time
        cy.getCurrentDateTimeInPKT().then(({ formattedDate, formattedTime }) => {

            // For providerReadyDateInput, time offset of 1 hour
            cy.getCurrentDateTimeInPKT(1).then(({ formattedDate: readyDate, formattedTime: readyTime }) => {
                cy.get(this.weblocators.providerReadyDateInput).type(readyDate, { force: true });
                cy.get(this.weblocators.providerReadyTimeInput).type(readyTime, { force: true });
            });

            // For providerPickupDateInput, time offset of 4 hours
            cy.getCurrentDateTimeInPKT(4).then(({ formattedDate: pickupDate, formattedTime: pickupTime }) => {
                cy.get(this.weblocators.providerPickupDateInput).type(pickupDate, { force: true });
                cy.get(this.weblocators.providerPickUpTimeInput).type(pickupTime, { force: true });
            });

            // For providerDropDateInput, time offset of 4 hours, plus 1 day offset
            cy.getCurrentDateTimeInPKT(4, 1).then(({ formattedDate: dropDate, formattedTime: dropTime }) => {
                cy.get(this.weblocators.providerDropDateInput).type(dropDate, { force: true });
                cy.get(this.weblocators.providerDropTimeInput).type(dropTime, { force: true });
            });
        });
    }

    searchDragnDropRecordByRefNos(shipments) {
        cy.get('@forwarderReferenceNumber').then(fwdRefNo => {
            // Click the routing link and wait for the page to load
            cy.get(this.weblocators.routingLinkLocator).click().wait(10000);

            // Search for the dynamic reference number
            cy.get(this.weblocators.searchInputByReferenceNumber)
                .scrollIntoView()
                .should('be.visible')
                .type(fwdRefNo, { force: true });
            cy.wait(4000);

            // Iterate through each shipment type
            shipments.forEach((shipment, index) => {
                const { type } = shipment; // Extract type (PICKUP or DROP)

                // Loop through tbody rows to find the one matching the type
                cy.get('tbody tr.shipment-list-item').each(($row) => {
                    const typeText = $row.find('td').eq(8).text().trim(); // "PICKUP" or "DROP"
                    const refNumberText = $row.find('td').eq(1).text().trim(); // Shipment reference number

                    if (typeText.toLowerCase() === type.toLowerCase() && refNumberText.toLowerCase() === fwdRefNo.toLowerCase()) {
                        // Select the checkbox for the matched row
                        cy.wrap($row).find('input[type="checkbox"]').check({ force: true });

                        // Click "Add Route" to create a new route section for each type
                        cy.get('div.routing-details-footer').find('button').contains('Add Route').click();

                        // Perform drag-and-drop
                        cy.get('tr.shipment-list-item.is-selected').first().then($source => {
                            cy.get(`div.route-shipments`).eq(index).then($target => {
                                const dataTransfer = new DataTransfer();
                                cy.wrap($source).trigger('mousedown', { which: 1, button: 0, force: true });
                                cy.wrap($source).trigger('dragstart', { dataTransfer, force: true });
                                cy.wait(2000);
                                cy.wrap($target).trigger('dragover', { dataTransfer, force: true });
                                cy.wait(2000);
                                cy.wrap($target).trigger('drop', { dataTransfer, force: true });
                                cy.wait(2000);

                                // Verify the reference number exists in the corresponding route
                                cy.get(`div.route-shipments`).eq(index).find('div.routing-shipment-card')
                                    .should('contain', fwdRefNo.toUpperCase());
                            });
                        });
                    }
                });
            });
        });
    }





    saveAndDispatchRoute(truckDriver01) {
        cy.get(this.weblocators.driverSelectDropdown).select(truckDriver01);
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
                    cy.wait(10000);
                });
            });
        });
    }

    saveAndDispatchRoute1(truckDriver02) {
        cy.get(this.weblocators.driverSelectDropdown2).select(truckDriver02);
        cy.get('@forwarderReferenceNumber').then(fwdRefNo => {
            cy.get(this.weblocators.secondRoutingVehicleCard).first().then($source => {
                cy.get('div.route-shipments').eq(1).then($target => {
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
                    cy.get(this.weblocators.checkboxInSecondRoutingVehicleCard).check({ force: true });
                    cy.wait(10000);
                });
            });
        });
    }

}