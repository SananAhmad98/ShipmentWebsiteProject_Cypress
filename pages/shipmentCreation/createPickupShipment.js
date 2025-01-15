import { eq } from "lodash";

export class createShipment {

    weblocators = {
        newShipmentButton: 'a.button.button--primary',
        shipmentType: 'label.toggle-label[for="pickup"]',
        shipmentStatusDropdown: 'select.select[name="shipmentStatus"]',

        // Shipment Forwarder Information
        shipmentForwarderInput: 'input#shipmentForwarder',
        organizationDropdown: 'select[name="shipmentOrganization"]',
        forwarderReferenceNumberInput: 'input[name="shipmentReferenceNumber"][placeholder="Reference Number"]',
        forwarderPRONumberInput: 'input[name="shipmentProNumber"][placeholder="PRO Number"]',
        forwarderMawbInput: 'input[name="shipmentMawb"][placeholder="MAWB"]',

        // Shipper & Drop Information Radio Buttons Web Locators
        shipperInformationFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][name="shipper-information-new-or-existing-contact"][value="{buttonName}"]',
        dropRadioFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][name="drop-information-new-or-existing-contact"][value="{buttonName}"]',

        // Shipper Information Web Locators
        shipperInformationLocationNameInput: 'input[name="shipper-information-location-name"]',
        shipperInformationAddressLine1Input: 'input[name="shipper-information-address-line-1"]',
        shipperInformationCityInput: 'input[name="shipper-information-city"]',
        shipperInformationStateInput: 'input[name="shipper-information-state"]',
        shipperInformationZipInput: 'input[name="shipper-information-zip-code"]',
        shipperSearchInput: 'input#shipper-information-search-name',
        shipperSearchOptions: 'ul.shipment-contact-search__found-contacts li.shipment-contact-search__found-contact',

        // Drop Information Web Locators
        dropInformationLocationNameInput: 'input#drop-information-location-name',
        dropInformationAddressLine1Input: 'input#drop-information-address-line-1',
        dropInformationAddressLine2Input: 'input#drop-information-address-line-2',
        dropInformationCityInput: 'input#drop-information-city',
        dropInformationStateInput: 'input#drop-information-state',
        dropInformationZipInput: 'input#drop-information-zip-code',
        readyDateInput: 'input#ui-date-time-input-ready-date',
        dropSearchInput: 'input#drop-information-search-name',
        dropSearchOptions: 'ul.shipment-contact-search__found-contacts li.shipment-contact-search__found-contact',

        // Provider Information Web Locators
        providerReadyDateInput: 'input#ui-date-time-input-ready-date',
        providerReadyTimeInput: 'input#ui-date-time-input-ready-time',
        providerRadioFieldSet: 'div.range-radio input[type="radio"][name="shipmentExpectedDeliveryRange"][value="{buttonName}"]',
        providerPickupDateInput: 'input#ui-date-time-input-pickup-date',
        providerPickUpTimeInput: 'input#ui-date-time-input-pickup-time',
        providerDropDateInput: 'input#ui-date-time-input-drop-date',
        providerDropTimeInput: 'input#ui-date-time-input-drop-time',

        // Freight Items Web Locators
        freightPiecesInput1: 'input[name="shipmentFreightPieces"]',
        freightTypeDropDown: 'select[name="shipmentFreightType"]',
        addFreightItemButton: 'button.button--default.shipment-edit-view__add-frieght-line-button',
        deleteFreightItemButton: 'button.button--default.delete-freight-button',
        createShipmentButton: 'button.button--primary[type="submit"]',

        // Shipment Attachment Web Locator
        uploadShipmentAttachment: 'input#shipmentAttachment[type="file"]',

        // Shipment Accessorials Web Locator
        shipmentAccessorialsViewMoreButton: 'button.button--default.see-more-button',
        toggleSwitch: 'input.toggleSwitch[name="{buttonName}"]',

        // CudaID Web Locator on success
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

    clickCreateShipment() {
        cy.get(this.weblocators.newShipmentButton).should('be.visible').click({ force: true });
    }

    clickShipmentType() {
        cy.get(this.weblocators.shipmentType).click();
    }

    selectShipmentStatus(status) {
        cy.get(this.weblocators.shipmentStatusDropdown).select(status);
    }

    enterForwarderDetails(forwarder, forwarderPRONumber) {
        cy.wait(6000);
        cy.get(this.weblocators.organizationDropdown).select('Demo Org');
        const forwarderReferenceNumber = this.randomAlphaNumericNumberGenerator(8);
        cy.get(this.weblocators.forwarderReferenceNumberInput).type(forwarderReferenceNumber);
        cy.contains('label', 'Tariff').parent().find('select').select('jimbo');
        cy.wrap(forwarderReferenceNumber).as('forwarderReferenceNumber');
        cy.get(this.weblocators.forwarderPRONumberInput).type(forwarderPRONumber);
        cy.get(this.weblocators.forwarderMawbInput).should('be.visible').clear({ force: true }).type(this.randomAlphaNumericNumberGenerator(5));
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

    handleDropContactOption(dropOption, searchName, dropLocName, dropAddressLine1, dropAddressLine2, city, state, zip) {
        if (dropOption === 'createNew') {
            cy.get(this.weblocators.dropRadioFieldset.replace('{buttonName}', 'false')).should('not.be.checked').check();

            cy.get(this.weblocators.dropInformationLocationNameInput).type(dropLocName);
            cy.get(this.weblocators.dropInformationAddressLine1Input).type(dropAddressLine1);
            cy.get(this.weblocators.dropInformationAddressLine2Input).type(dropAddressLine2);
            cy.get(this.weblocators.dropInformationCityInput).type(city);
            cy.get(this.weblocators.dropInformationStateInput).type(state);
            cy.get(this.weblocators.dropInformationZipInput).type(zip);
        } else if (dropOption === 'useExisting') {
            cy.get(this.weblocators.dropRadioFieldset.replace('{buttonName}', 'true'))
                .click()
                .then(() => {
                    cy.get(this.weblocators.dropSearchInput)
                        .should('be.visible')
                        .type(searchName)
                        .then(() => {
                            cy.get(this.weblocators.dropSearchOptions, { timeout: 10000 })
                                .contains(searchName)
                                .click();
                        });
                });
        } else {
            throw new Error(`Invalid dropOption specified: ${dropOption}`);
        }
    }

    enterProviderInformation(readyDate, readyTime, pickUpDate, pickUpTime, dropDate, dropTime) {
        cy.get(this.weblocators.providerReadyDateInput).type(readyDate);
        cy.get(this.weblocators.providerReadyTimeInput).type(readyTime);
        cy.get(this.weblocators.providerPickupDateInput).type(pickUpDate);
        cy.get(this.weblocators.providerPickUpTimeInput).type(pickUpTime);
        cy.get(this.weblocators.providerDropDateInput).type(dropDate);
        cy.get(this.weblocators.providerDropTimeInput).type(dropTime);
    }

    handleProviderOption(providerOption) {
        if (!['AT', 'BY', 'BETWEEN'].includes(providerOption)) {
            throw new Error(`Invalid providerOption specified: ${providerOption}. Must be 'AT', 'BY', or 'BETWEEN'.`);
        }
        cy.get(this.weblocators.providerRadioFieldSet.replace('{buttonName}', providerOption)).should('not.be.checked').check();
    }

    enterFreightInformation(freightPieces, freightType) {
        cy.get(this.weblocators.freightPiecesInput1).type(freightPieces);
        cy.get(this.weblocators.freightTypeDropDown).select(freightType);
        cy.wait(1000);
        cy.get(this.weblocators.addFreightItemButton).contains('Add Freight Item').click();
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
                const data = {
                    cudaId: cudaId.toUpperCase(),
                    forwardRefNumber: forwardRefNumber.toUpperCase()
                };
                cy.task('writeFile', { fileName: 'cypress/results/testData.json', data });
            });
        });
    }

    searchRecordByCudaID() {
        cy.get('@cudaId').then(cudaId => {
            cy.visit(Cypress.env('shipment_baseURL'), { failOnStatusCode: false }).wait(12000);
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
        cy.get('.shipment-notification').should('exist');
        cy.get('.shipment-notification h1').should('contain.text', "Here's your new shipment!");
    }
}
