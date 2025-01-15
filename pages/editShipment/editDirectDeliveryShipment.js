export class editDirectDeliveryShipment {

    weblocators = {
        searchByRefNo: 'input[placeholder="Search by Reference Number CUDA ID Organization Forwarder Consignee Type Or Status"]',
        shipmentLinkLocator: 'a[title="View Shipment"]:first',
        organizationSelector: 'select[name="shipmentOrganization"]',
        forwarderPRONumberInput: 'input[name="shipmentProNumber"][placeholder="PRO Number"]',
        forwarderReferenceNumberInput: 'input[name="shipmentReferenceNumber"][placeholder="Reference Number"]',
        providerReadyDateInput: 'input#ui-date-time-input-ready-date.input.ui-date-time-input',
        providerReadyTimeInput: 'input#ui-date-time-input-ready-time.input.ui-date-time-input',
        providerRadioFieldSet: 'div.range-radio input[type="radio"][name="shipmentExpectedDeliveryRange"][value="{buttonName}"]',
        providerPickupDateInput: 'input#ui-date-time-input-pickup-date',
        providerPickUpTimeInput: 'input#ui-date-time-input-pickup-time',
        providerDeliveryDateInput: 'input#ui-date-time-input-delivery-date',
        providerDeliveryTimeInput: 'input#ui-date-time-input-delivery-time',
        shipmentForwarderInput: 'input#shipmentForwarder',
        shipmentAccessorialsViewMoreButton: 'button.button--default.see-more-button',
        toggleSwitch: 'input.toggleSwitch[name="{buttonName}"]',
        closeModalButton: 'button[title="Close Modal"] > span.icon.fa-light.fa-xmark',
        shipperInformationFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][name="shipper-information-new-or-existing-contact"][value="{buttonName}"]',
        consigneeRadioFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][name="consignee-information-new-or-existing-contact"][value="{buttonName}"',
        shipperSearchInput: 'input#shipper-information-search-name',
        shipperSearchOptions: 'ul.shipment-contact-search__found-contacts li.shipment-contact-search__found-contact',
        consigneeSearchInput: 'input#consignee-information-search-name',
        consigneeSearchOptions: 'ul.shipment-contact-search__found-contacts li.shipment-contact-search__found-contact',
        freightPiecesInput1: 'input.input[name="shipmentFreightPieces"]',
        freightTypeDropDown: 'select.select[name="shipmentFreightType"]',
        primaryButton: 'button.button--primary',
    }

    verifyShipmentPopup() {
        cy.wait(7000);
        // Assert that the shipment notification popup exists
        cy.get('.shipment-notification').should('exist');
        // Assert that the title of the shipment notification is correct
        cy.get('.shipment-notification h1').should('contain.text', "Here's your new shipment!");
        cy.get(this.weblocators.closeModalButton).should('be.visible').click();
    }

    searchShipmentByRefNo() {
        // Read the JSON file and extract the forwardRefNumber
        cy.readFile('cypress/results/directdeliverytest.json').then((data) => {
            // Extract forwardRefNumber from the JSON data
            const forwardRefNumber = data.forwardRefNumber;

            // Ensure that the data exists and type it into the search input
            if (forwardRefNumber) {
                cy.get(this.weblocators.searchByRefNo)
                    .type(forwardRefNumber, { force: true });  // Type the extracted forwardRefNumber
            } else {
                throw new Error('forwardRefNumber not found in the JSON file');
            }
        });
    }

    randomAlphaNumericNumberGenerator(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    generatePrefixedRandomNumber(prefix, postfixLength) {
        const characters = '0123456789';
        let postfix = '';
        for (let i = 0; i < postfixLength; i++) {
            postfix += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return `${prefix}${postfix}`;
    }

    viewShipmentDetails() {
        cy.wait(7000);
        cy.get(this.weblocators.shipmentLinkLocator).click();
    }

    editForwarderDetails(org, forwarder) {
        cy.wait(7000);
        cy.get(this.weblocators.organizationSelector).select(org);
        cy.get(this.weblocators.shipmentForwarderInput).wait(10000).scrollIntoView().should('be.visible').type(forwarder);
        const forwarderReferenceNumber = this.generatePrefixedRandomNumber('CUDA', '5');
        // Use {force: true} to type into a disabled input otherwise we explicitly need to click that field to make it enabled 
        cy.get(this.weblocators.forwarderReferenceNumberInput).clear().type(forwarderReferenceNumber);
        cy.contains('label', 'Tariff').parent().find('select').then(($select) => {
            if (!$select.is(':disabled')) {
                cy.wrap($select).select('jimbo');
            } else {
                cy.log('Option is auto selected');
            }
        });
        cy.wrap(forwarderReferenceNumber).as('forwarderReferenceNumber');
        const pro = this.generatePrefixedRandomNumber('PRO', 7);
        cy.get(this.weblocators.forwarderPRONumberInput).clear().type(pro);
    }

    handleShipperContactOption(contactOption, searchName) {
        if (contactOption === 'useExisting') {
            cy.get(this.weblocators.shipperInformationFieldset.replace('{buttonName}', 'true'))
                .click()
                .then(() => {
                    cy.get(this.weblocators.shipperSearchInput)
                        .should('be.visible')
                        .type(searchName)
                        .then(() => {
                            cy.get(this.weblocators.shipperSearchOptions, { timeout: 10000 })
                                .contains(searchName)
                                .click();
                        });
                });
        } else {
            throw new Error(`Invalid contactOption specified: ${contactOption}`);
        }
    }

    handleconsigneeContactOption(consigneeOption, searchName) {
        if (consigneeOption === 'useExisting') {
            cy.get(this.weblocators.consigneeRadioFieldset.replace('{buttonName}', 'true'))
                .click()
                .then(() => {
                    cy.get(this.weblocators.consigneeSearchInput)
                        .should('be.visible')
                        .type(searchName)
                        .then(() => {
                            cy.get(this.weblocators.consigneeSearchOptions, { timeout: 10000 }) // 10 seconds
                                .contains(searchName)
                                .click();
                        });
                });
        } else {
            throw new Error(`Invalid dropOption specified: ${consigneeOption}`);
        }
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
                cy.get(this.weblocators.providerDeliveryDateInput).type(dropDate, { force: true });
                cy.get(this.weblocators.providerDeliveryTimeInput).type(dropTime, { force: true });
            });
        });
    }

    handleProviderOption(providerOption) {
        if (!(providerOption === 'AT' || providerOption === 'BY' || providerOption === 'BETWEEN')) {
            throw new Error(`Invalid providerOption specified: ${providerOption}. Must be 'AT', 'BY', or 'BETWEEN'.`);
        }
        cy.get(this.weblocators.providerRadioFieldSet.replace('{buttonName}', providerOption)).should('not.be.checked').check();
    }

    enterFreightInformation(freightPieces, freightType) {
        cy.get(this.weblocators.freightPiecesInput1).clear().type(freightPieces);
        cy.get(this.weblocators.freightTypeDropDown).select(freightType);
        cy.wait(1000);
    }

    handleToggleButtons(toggleButtonsSet) {
        cy.get(this.weblocators.shipmentAccessorialsViewMoreButton).click();
        toggleButtonsSet.forEach(buttonName => {
            cy.get(this.weblocators.toggleSwitch.replace('{buttonName}', buttonName)).should('not.be.checked').check();
        });
    }

    untoggleCheckbox(untoggleButtonsSet) {
        untoggleButtonsSet.forEach(buttonName => {
            cy.get(this.weblocators.toggleSwitch.replace('{buttonName}', buttonName)).should('be.checked').uncheck();
        });
    }

    updateShipment() {
        cy.get(this.weblocators.primaryButton).contains('Update').click();
        cy.wait(12000);
    }

    storeAllData() {
        cy.get('@forwarderReferenceNumber').then(forwardRefNumber => {
            const data = {
                updatedForwardRefNumber: forwardRefNumber.toUpperCase()
            };
            cy.task('writeFile', { fileName: 'cypress/results/updatedTestData.json', data });
        });
    }

    searchShipmentByUpdatedRefNo() {
        cy.visit(Cypress.env('shipment_baseURL'), { failOnStatusCode: false }).wait(15000);
        // Read the JSON file and extract the forwardRefNumber
        cy.readFile('cypress/results/updatedTestData.json').then((data) => {
            // Extract forwardRefNumber from the JSON data
            const updatedForwardRefNumber = data.updatedForwardRefNumber;

            // Ensure that the data exists and type it into the search input
            if (updatedForwardRefNumber) {
                cy.get(this.weblocators.searchByRefNo)
                    .type(updatedForwardRefNumber, { force: true });  // Type the extracted forwardRefNumber
            } else {
                throw new Error('updatedForwardRefNumber not found in the JSON file');
            }
        });
        cy.wait(7000);
        cy.get(this.weblocators.shipmentLinkLocator).click();
    }

    verifyUpdatedShipmentDetails(org, forwarder, forwarderPRONumber, shipperSearchName, consigneeSearchName, readyDate, 
        readyTime, pickUpDate, pickUpTime, deliveryDate, deliveryTime, freightPieces, freightType, toggleButtonsSet) {
            
        cy.wait(7000);
        cy.get(this.weblocators.organizationSelector).find('option').contains(org).should('be.selected');
        cy.get(this.weblocators.shipmentForwarderInput).should('have.value', forwarder);
        cy.readFile('cypress/results/updatedTestData.json').then((data) => {
            // Extract forwardRefNumber from the JSON data
            const updatedForwardRefNumber = data.updatedForwardRefNumber;

            // Ensure that the data exists and type it into the search input
            if (updatedForwardRefNumber) {
                cy.get(this.weblocators.forwarderReferenceNumberInput).should('have.value', updatedForwardRefNumber);
            } else {
                throw new Error('updatedForwardRefNumber not found in the JSON file');
            }
        });
        cy.get(this.weblocators.forwarderPRONumberInput).should('not.have.value', forwarderPRONumber);
        cy.get('div.shipment-contact-edit__field').eq(0).should('contain.text', shipperSearchName);
        cy.get('div.shipment-contact-edit__field').eq(2).should('contain.text', consigneeSearchName);
        cy.get(this.weblocators.providerReadyDateInput).should('not.have.value', readyDate);
        cy.get(this.weblocators.providerReadyTimeInput).should('not.have.value', readyTime);
        cy.get(this.weblocators.providerPickupDateInput).should('not.have.value', pickUpDate);
        cy.get(this.weblocators.providerPickUpTimeInput).should('not.have.value', pickUpTime);
        cy.get(this.weblocators.providerDeliveryDateInput).should('not.have.value', deliveryDate);
        cy.get(this.weblocators.providerDeliveryTimeInput).should('not.have.value', deliveryTime);
        cy.get(this.weblocators.freightPiecesInput1).should('have.value', freightPieces);
        cy.get(this.weblocators.freightTypeDropDown).find('option').contains(freightType).should('be.selected');
        toggleButtonsSet.forEach(buttonName => {
            cy.get(this.weblocators.toggleSwitch.replace('{buttonName}', buttonName)).should('be.checked');
        });

    }
}