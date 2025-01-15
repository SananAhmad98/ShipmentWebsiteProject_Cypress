export class createDirectDeliveryShipment {

    weblocators = {
        newShipmentButton: 'a.button.button--primary',
        shipmentType: 'label.toggle-label[for="direct-delivery"]',
        shipmentStatusDropdown: 'select.select[name="shipmentStatus"]',

        //Shipment Forwarder Information
        organizationSelector: 'select[name="shipmentOrganization"]',
        shipmentForwarderInput: 'input#shipmentForwarder',
        forwarderReferenceNumberInput: 'input[name="shipmentReferenceNumber"][placeholder="Reference Number"]',
        forwarderPRONumberInput: 'input[name="shipmentProNumber"][placeholder="PRO Number"]',

        //Shipper & consignee Information Radio Buttons Web Locators
        shipperInformationFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][name="shipper-information-new-or-existing-contact"][value="{buttonName}"]',
        consigneeRadioFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][name="consignee-information-new-or-existing-contact"][value="{buttonName}"',

        //Shipper Information Web Locators
        shipperInformationLocationNameInput: 'input[name="shipper-information-location-name"]',
        shipperInformationAddressLine1Input: 'input[name="shipper-information-address-line-1"]',
        shipperInformationCityInput: 'input[name="shipper-information-city"]',
        shipperInformationStateInput: 'input[name="shipper-information-state"]',
        shipperInformationZipInput: 'input[name="shipper-information-zip-code"]',
        shipperSearchInput: 'input#shipper-information-search-name',
        shipperSearchOptions: 'ul.shipment-contact-search__found-contacts li.shipment-contact-search__found-contact',

        //consignee Information Web Locators
        consigneeInformationLocationNameInput: 'input[name="consignee-information-location-name"]',
        consigneeInformationAddressLine1Input: 'input[name="consignee-information-address-line-1"]',
        consigneeInformationAddressLine2Input: 'input[name="consignee-information-address-line-2"]',
        consigneeInformationCityInput: 'input[name="consignee-information-city"]',
        consigneeInformationStateInput: 'input[name="consignee-information-state"]',
        consigneeInformationZipInput: 'input[name="consignee-information-zip-code"]',
        consigneeSearchInput: 'input#consignee-information-search-name',
        consigneeSearchOptions: 'ul.shipment-contact-search__found-contacts li.shipment-contact-search__found-contact',

        //Provider Information Web Locators
        providerReadyDateInput: 'input#ui-date-time-input-ready-date.input.ui-date-time-input',
        providerReadyTimeInput: 'input#ui-date-time-input-ready-time.input.ui-date-time-input',
        providerRadioFieldSet: 'div.range-radio input[type="radio"][name="shipmentExpectedDeliveryRange"][value="{buttonName}"]',
        providerPickupDateInput: 'input#ui-date-time-input-pickup-date',
        providerPickUpTimeInput: 'input#ui-date-time-input-pickup-time',
        providerDeliveryDateInput: 'input#ui-date-time-input-delivery-date',
        providerDeliveryTimeInput: 'input#ui-date-time-input-delivery-time',


        //Freight Items Web Locators
        freightPiecesInput1: 'input.input[name="shipmentFreightPieces"]',
        freightTypeDropDown: 'select.select[name="shipmentFreightType"]',
        addFreightItemButton: 'button.button--default.shipment-edit-view__add-frieght-line-button',
        deleteFreightItemButton: 'button.button--default.delete-freight-button',
        createShipmentButton: 'button.button--primary[type="submit"]',

        //Shipment Attachment web locator
        uploadShipmentAttachment: 'input#shipmentAttachment[type="file"]',

        //Shipment Accessorials web Locator
        shipmentAccessorialsViewMoreButton: 'button.button--default.see-more-button',
        toggleSwitch: 'input.toggleSwitch[name="{buttonName}"]',

        //CudaID Web Locator on success
        cudaIdSpan: '.generic-modal-inner .shipment-notification a.shipment-link span',
        searchRecordByCudaIDInput: 'input[type="text"][placeholder*="CUDA ID"]',
        ellipsisButton: 'button.button.button--icon',
        deleteShipmentButton: 'button[title="Delete Shipment"]'

    }

    randomAlphaNumericNumberGenerator(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    //No need to navigate to shipments as default dashboard screen after login is shipments

    clickCreateShipment() {
        cy.get(this.weblocators.newShipmentButton).should('be.visible').click({ force: true }); // Use {force: true} cautiously, only if necessary
    }

    clickShipmentType() {
        cy.get(this.weblocators.shipmentType).click();
    }

    selectShipmentStatus(status) {
        cy.get(this.weblocators.shipmentStatusDropdown).select(status);
    }

    enterForwarderDetails(forwarder, forwarderPRONumber) {
        cy.wait(5000);
        cy.get(this.weblocators.organizationSelector).select('Demo Org')
        const forwarderReferenceNumber = this.randomAlphaNumericNumberGenerator(8);
        // Use {force: true} to type into a disabled input otherwise we explicitly need to click that field to make it enabled 
        cy.get(this.weblocators.forwarderReferenceNumberInput).type(forwarderReferenceNumber);
        cy.contains('label', 'Tariff').parent().find('select').then(($select) => {
            if (!$select.is(':disabled')) {
                cy.wrap($select).select('jimbo');
            } else {
                cy.log('Option is auto selected');
            }
        });
        cy.wrap(forwarderReferenceNumber).as('forwarderReferenceNumber');
        cy.get(this.weblocators.forwarderPRONumberInput).type(forwarderPRONumber);
        cy.wait(5000);
        cy.get(this.weblocators.shipmentForwarderInput).wait(5000).scrollIntoView().should('be.visible').type(forwarder);

    }

    handleShipperContactOption(contactOption, searchName, locName, addressLine1, city, state, zip) {
        if (contactOption === 'createNew') {
            cy.get(this.weblocators.shipperInformationFieldset.replace('{buttonName}', 'false')).should('not.be.checked').check();

            cy.get(this.weblocators.shipperInformationLocationNameInput).type(locName);
            cy.get(this.weblocators.shipperInformationAddressLine1Input).type(addressLine1);
            cy.get(this.weblocators.shipperInformationCityInput).type(city);
            cy.get(this.weblocators.shipperInformationStateInput).type(state);
            cy.get(this.weblocators.shipperInformationZipInput).type(zip);

        } else if (contactOption === 'useExisting') {
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

    handleconsigneeContactOption(consigneeOption, searchName, consigneeLocName, consigneeAddressLine1, consigneedropAddressLine2, city, state, zip) {
        if (consigneeOption === 'createNew') {
            cy.get(this.weblocators.consigneeRadioFieldset.replace('{buttonName}', 'false')).should('not.be.checked').check();

            cy.get(this.weblocators.consigneeInformationLocationNameInput).type(consigneeLocName);
            cy.get(this.weblocators.consigneeInformationAddressLine1Input).type(consigneeAddressLine1);
            cy.get(this.weblocators.consigneeInformationAddressLine2Input).type(consigneedropAddressLine2);
            cy.get(this.weblocators.consigneeInformationCityInput).type(city);
            cy.get(this.weblocators.consigneeInformationStateInput).type(state);
            cy.get(this.weblocators.consigneeInformationZipInput).type(zip);

        } else if (consigneeOption === 'useExisting') {
            cy.get(this.weblocators.consigneeRadioFieldset.replace('{buttonName}', 'true'))
                .click()
                .then(() => {
                    cy.get(this.weblocators.consigneeSearchInput)
                        .should('be.visible')
                        .type(searchName)
                        .then(() => {
                            cy.get(this.weblocators.consigneeSearchOptions, { timeout: 10000 })
                                .contains(searchName)
                                .click();
                        });
                });
        } else {
            throw new Error(`Invalid dropOption specified: ${consigneeOption}`);
        }
    }


    enterProviderInformation(readyDate, readyTime, pickUpDate, pickUpTime, deliveryDate, deliveryTime) {
        cy.get(this.weblocators.providerReadyDateInput).type(readyDate);
        cy.get(this.weblocators.providerReadyTimeInput).type(readyTime);
        cy.get(this.weblocators.providerPickupDateInput).type(pickUpDate);
        cy.get(this.weblocators.providerPickUpTimeInput).type(pickUpTime);
        cy.get(this.weblocators.providerDeliveryDateInput).type(deliveryDate);
        cy.get(this.weblocators.providerDeliveryTimeInput).type(deliveryTime);

    }

    handleProviderOption(providerOption) {
        if (!(providerOption === 'AT' || providerOption === 'BY' || providerOption === 'BETWEEN')) {
            throw new Error(`Invalid providerOption specified: ${providerOption}. Must be 'AT', 'BY', or 'BETWEEN'.`);
        }
        cy.get(this.weblocators.providerRadioFieldSet.replace('{buttonName}', providerOption)).should('not.be.checked').check();
    }

    enterFreightInformation(freightPieces, freightType) {

        cy.get(this.weblocators.freightPiecesInput1).type(freightPieces);
        cy.get(this.weblocators.freightTypeDropDown).select(freightType);
        cy.wait(1000);
        cy.get(this.weblocators.addFreightItemButton).click();
        cy.get(this.weblocators.deleteFreightItemButton).click();
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

    uploadShipmentAttachment(filePath1) {
        cy.get(this.weblocators.uploadShipmentAttachment).selectFile(filePath1, { force: true });
        cy.wait(6000);
        cy.get(this.weblocators.createShipmentButton).click();
        cy.wait(10000);
    }

    fetchAndStoreCudaID() {
        cy.get(this.weblocators.cudaIdSpan, { timeout: 100000 }).should('be.visible').invoke('text').then(text => {
            const cudaId = text.replace('Cuda ID:', '').trim();
            cy.wrap(cudaId).as('cudaId');
        });
    }

    storeAllData() {
        cy.get('@cudaId').then(cudaId => {
            cy.get('@forwarderReferenceNumber').then(forwardRefNumber => {
                const data = { cudaId, forwardRefNumber };
                cy.task('writeFile', { fileName: 'cypress/results/directdeliverytest.json', data });
            });
        });
    }

    searchRecordByCudaID() {
        cy.get('@cudaId').then(cudaId => {
            cy.visit(Cypress.env('shipment_baseURL'), { failOnStatusCode: false }).wait(40000);
            cy.get(this.weblocators.searchRecordByCudaIDInput).should('be.visible').type(cudaId);
        });
    }

    clickOnEllipsisButtonAtIndex(index) {
        cy.get(this.weblocators.ellipsisButton).eq(index).click();
    }

    clickOnDeleteShipment() {

        cy.get(this.weblocators.deleteShipmentButton).click();
        cy.wait(10000);
    }

    verifyShipmentPopup() {
        cy.wait(10000);
        // Assert that the shipment notification popup exists
        cy.get('.shipment-notification').should('exist');
        // Assert that the title of the shipment notification is correct
        cy.get('.shipment-notification h1').should('contain.text', "Here's your new shipment!");
    }

}






