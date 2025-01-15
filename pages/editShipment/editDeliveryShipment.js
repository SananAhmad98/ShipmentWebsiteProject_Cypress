export class editDeliveryShipment {

    weblocators = {
        searchByRefNo: 'input[placeholder="Search by Reference Number CUDA ID Organization Forwarder Consignee Type Or Status"]',
        shipmentLinkLocator: 'a[title="View Shipment"]:first',
        organizationSelector: 'select[name="shipmentOrganization"]',
        forwarderPRONumberInput: 'input[name="shipmentProNumber"][placeholder="PRO Number"]',
        forwarderMawbInput: 'input[name="shipmentMawb"][placeholder="MAWB"]',
        forwarderReferenceNumberInput: 'input[name="shipmentReferenceNumber"][placeholder="Reference Number"]',
        providerReadyDateInput: 'input#ui-date-time-input-ready-date.input.ui-date-time-input',
        deliveryDateInput: 'input#ui-date-time-input-delivery-date',
        providerRadioFieldSet: 'div.range-radio input[type="radio"][name="shipmentExpectedDeliveryRange"][value="{buttonName}"]',
        shipmentForwarderInput: 'input#shipmentForwarder',
        shipmentAccessorialsViewMoreButton: 'button.button--default.see-more-button',
        toggleSwitch: 'input.toggleSwitch[name="{buttonName}"]',
        closeModalButton: 'button[title="Close Modal"] > span.icon.fa-light.fa-xmark',
        RecoveryInformationFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][name="recovery-information-new-or-existing-contact"][value="{buttonName}"]',
        consigneeRadioFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][name="consignee-information-new-or-existing-contact"][value="{buttonName}"',
        recoverySearchInput: 'input#recovery-information-search-name',
        recoverySearchOptions: 'ul.shipment-contact-search__found-contacts li.shipment-contact-search__found-contact',
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
        cy.readFile('cypress/results/deliverytest.json').then((data) => {
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
        const mawb = this.generatePrefixedRandomNumber('MAWB', 6);
        cy.wrap(mawb).as('updatedMAWBNumber');
        cy.get(this.weblocators.forwarderMawbInput).should('be.visible').clear({ force: true }).type(mawb);
    }

    handleRecoveryContactOption(recoveryOption, recoverySearchName) {
        if (recoveryOption === 'useExisting') {
            cy.get(this.weblocators.RecoveryInformationFieldset.replace('{buttonName}', 'true'))
                .click()
                .then(() => {
                    cy.get(this.weblocators.recoverySearchInput)
                        .should('be.visible')
                        .type(recoverySearchName)
                        .then(() => {
                            cy.get(this.weblocators.recoverySearchOptions, { timeout: 10000 })
                                .contains(recoverySearchName)
                                .click();
                        });
                });
        } else {
            throw new Error(`Invalid contactOption specified: ${recoveryOption}`);
        }
    }

    handleconsigneeContactOption(consigneeOption, searchName, consigneeLocName, consigneeAddressLine1, consigneedropAddressLine2, city, state, zip) {
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
        cy.getCurrentDateTimeInPKT().then(({ formattedDate }) => {
            cy.get(this.weblocators.providerReadyDateInput).type(formattedDate, { force: true });
            cy.get(this.weblocators.deliveryDateInput).type(formattedDate, { force: true });
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

    verifyUpdatedShipmentDetails(org, forwarder, forwarderPRONumber, recoverySearchName, consigneeSearchName, readyDate, deliveryDate, freightPieces, freightType, toggleButtonsSet) {
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
        cy.get('@updatedMAWBNumber').then(updatedMAWBNumber => {
            cy.get(this.weblocators.forwarderMawbInput).should('have.value', updatedMAWBNumber)
        });
        cy.get('div.shipment-contact-edit__field').eq(0).should('contain.text', recoverySearchName);
        cy.get('div.shipment-contact-edit__field').eq(2).should('contain.text', consigneeSearchName);
        cy.get(this.weblocators.providerReadyDateInput).should('not.have.value', readyDate);
        cy.get(this.weblocators.deliveryDateInput).should('not.have.value', deliveryDate);
        cy.get(this.weblocators.freightPiecesInput1).should('have.value', freightPieces);
        cy.get(this.weblocators.freightTypeDropDown).find('option').contains(freightType).should('be.selected');
        toggleButtonsSet.forEach(buttonName => {
            cy.get(this.weblocators.toggleSwitch.replace('{buttonName}', buttonName)).should('be.checked');
        });

    }
}