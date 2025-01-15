export class createDeliveryShipment {

    weblocators = {
        newShipmentButton: 'a.button.button--primary',
        shipmentType: 'label.toggle-label[for="delivery"]',
        shipmentStatusDropdown: 'select.select[name="shipmentStatus"]',

        //Shipment Forwarder Information
        organizationSelector: 'select[name="shipmentOrganization"]',
        shipmentForwarderInput: 'input#shipmentForwarder',
        forwarderReferenceNumberInput: 'input[name="shipmentReferenceNumber"][placeholder="Reference Number"]',
        forwarderPRONumberInput: 'input[name="shipmentProNumber"][placeholder="PRO Number"]',
        forwarderMawbInput: 'input[name="shipmentMawb"][placeholder="MAWB"]',

        //Recovery & consignee Information Radio Buttons Web Locators
        RecoveryInformationFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][name="recovery-information-new-or-existing-contact"][value="{buttonName}"]',
        consigneeRadioFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][name="consignee-information-new-or-existing-contact"][value="{buttonName}"',

        //Recovery Information Web Locators
        recoveryInformationLocationNameInput: 'input[name="recovery-information-location-name"]',
        recoveryInformationAddressLine1Input: 'input[name="recovery-information-address-line-1"]',
        recoveryInformationCityInput: 'input[name="recovery-information-city"]',
        recoveryInformationStateInput: 'input[name="recovery-information-state"]',
        recoveryInformationZipInput: 'input[name="recovery-information-zip-code"]',
        recoverySearchInput: 'input#recovery-information-search-name',
        recoverySearchOptions: 'ul.shipment-contact-search__found-contacts li.shipment-contact-search__found-contact',

        //Consignee Information Web Locators
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
        deliveryDateInput: 'input#ui-date-time-input-delivery-date',
        deliveryTimeInput: 'input#ui-date-time-input-delivery-time',

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
        deleteShipmentButton: 'button[title="Delete Shipment"]',
        deleteShipmentToast:'[data-testid="Toastify__toast-container--bottom-left"]',
        deleteShipmentToastBody:'[data-testid="toast-body"]',
        deleteShipmentToastText:'[data-testid="toast-content"]'
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

    selectOrganization()
    {
        cy.wait(1000);
        cy.get('select[name="shipmentOrganization"]').select('Demo Org');
    }

    enterForwarderDetails(forwarder, forwarderPRONumber) {
        cy.wait(5000);
        cy.get(this.weblocators.organizationSelector).select('Demo Org')
        cy.get(this.weblocators.shipmentForwarderInput).wait(19000).scrollIntoView().should('be.visible').type(forwarder);
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
        cy.get(this.weblocators.forwarderMawbInput).should('be.visible').clear({ force: true }).type(this.randomAlphaNumericNumberGenerator(5));

    }

    handleRecoveryContactOption(recoveryOption, recoverySearchName, locName, addressLine1, city, state, zip) {
        if (recoveryOption === 'createNew') {
            cy.get(this.weblocators.RecoveryInformationFieldset.replace('{buttonName}', 'false')).should('not.be.checked').check();

            cy.get(this.weblocators.recoveryInformationLocationNameInput).type(locName);
            cy.get(this.weblocators.recoveryInformationAddressLine1Input).type(addressLine1);
            cy.get(this.weblocators.recoveryInformationCityInput).type(city);
            cy.get(this.weblocators.recoveryInformationStateInput).type(state);
            cy.get(this.weblocators.recoveryInformationZipInput).type(zip);

        } else if (recoveryOption === 'useExisting') {
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
                            cy.get(this.weblocators.consigneeSearchOptions, { timeout: 10000 }) // 10 seconds
                            .contains(searchName)
                            .click();
                        });
                });
        } else {
            throw new Error(`Invalid dropOption specified: ${consigneeOption}`);
        }
    }

    enterProviderInformation(readyDate, readyTime, deliveryDate, deliveryTime) {
        cy.get(this.weblocators.providerReadyDateInput).type(readyDate, { force: true });
        cy.get(this.weblocators.providerReadyTimeInput).type(readyTime, { force: true });
        cy.get(this.weblocators.deliveryDateInput).type(deliveryDate, { force: true });
        cy.get(this.weblocators.deliveryTimeInput).type(deliveryTime, { force: true });

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

    searchRecordByCudaID() {
        cy.get('@cudaId').then(cudaId => {
            cy.visit(Cypress.env('shipment_baseURL'), { failOnStatusCode: false }).wait(20000);
            cy.get(this.weblocators.searchRecordByCudaIDInput).should('be.visible').type(cudaId);
        });
    }

    storeAllData() {
        cy.get('@cudaId').then(cudaId => {
            cy.get('@forwarderReferenceNumber').then(forwardRefNumber => {
                const data = {
                    cudaId: cudaId.toUpperCase(),
                    forwardRefNumber: forwardRefNumber.toUpperCase()
                };
                cy.task('writeFile', { fileName: 'cypress/results/deliverytest.json', data });
            });
        });
    }
    

    clickOnEllipsisButtonAtIndex(index) {
        cy.wait(5000);
        cy.get(this.weblocators.ellipsisButton).eq(index).click();
    }

    clickOnDeleteShipment(){

        cy.get(this.weblocators.deleteShipmentButton).click();
        cy.wait(3000);
        
    }

    verifyDeleteShipmentToast(){

              cy.get(this.weblocators.deleteShipmentToast).should('be.visible');
              // Then, assert the toast body inside the container
              cy.get(this.weblocators.deleteShipmentToastBody).should('be.visible')
                .within(() => {
                  // Assert the message content inside the toast body
                  cy.get(this.weblocators.deleteShipmentToastText)
                    .should('be.visible').and('contain', 'Shipment deleted');
                });

    }

    verifyShipmentPopup() {
        cy.wait(15000); 
        // Assert that the shipment notification popup exists
        cy.get('.shipment-notification').should('exist');    
        // Assert that the title of the shipment notification is correct
        cy.get('.shipment-notification h1').should('contain.text', "Here's your new shipment!");
      }
}






