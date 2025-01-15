export class editPickupShipment{

weblocators = {

    searchByRefNo: 'input[placeholder="Search by Reference Number CUDA ID Organization Forwarder Consignee Type Or Status"]',
    shipperSearchInput: 'input#shipper-information-search-name',
    shipperSearchOptions: 'ul.shipment-contact-search__found-contacts li.shipment-contact-search__found-contact',
    dropSearchInput: 'input#drop-information-search-name',
    dropSearchOptions: 'ul.shipment-contact-search__found-contacts li.shipment-contact-search__found-contact',
    providerReadyDateInput: 'input#ui-date-time-input-ready-date.input.ui-date-time-input',
    providerPickupDateInput: 'input#ui-date-time-input-pickup-date',
    providerDropDateInput: 'input#ui-date-time-input-drop-date',
    organizationSelector: 'select[name="shipmentOrganization"]',
    shipmentForwarderInput: 'input#shipmentForwarder',
    forwarderReferenceNumberInput: 'input[name="shipmentReferenceNumber"][placeholder="Reference Number"]',
    forwarderPRONumberInput: 'input[name="shipmentProNumber"][placeholder="PRO Number"]',
    forwarderMawbInput: 'input[name="shipmentMawb"][placeholder="MAWB"]',
    freightPiecesInput1: 'input.input[name="shipmentFreightPieces"]',
    freightTypeDropDown: 'select.select[name="shipmentFreightType"]',
    toggleSwitch: 'input.toggleSwitch[name="{buttonName}"]'

}

searchShipmentByRefNo() {
    // Read the JSON file and extract the forwardRefNumber
    cy.readFile('cypress/results/testData.json').then((data) => {
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

handleShipperContactOption(shipperOption,shipperSearchName){

    if (shipperOption === 'useExisting') {

                cy.get(this.weblocators.shipperSearchInput)
                    .should('be.visible')
                    .type(shipperSearchName)
                    .then(() => {
                        cy.get(this.weblocators.shipperSearchOptions, { timeout: 10000 })
                            .contains(shipperSearchName)
                            .click();
                    });

    }
}

handleDropContactOption(dropOption,dropSearchName){

    if (dropOption === 'useExisting') {

        cy.get(this.weblocators.dropSearchInput)
            .should('be.visible')
            .type(dropSearchName)
            .then(() => {
                cy.get(this.weblocators.dropSearchOptions, { timeout: 10000 })
                    .contains(dropSearchName)
                    .click();
            });

}
}

enterProviderInformationUsingCurrDateTime() {
    
    cy.getCurrentDateTimeInPKT().then(({ formattedDate }) => {

        cy.get(this.weblocators.providerReadyDateInput).type(formattedDate, { force: true });
        cy.get(this.weblocators.providerPickupDateInput).type(formattedDate, { force: true });
        cy.get(this.weblocators.providerDropDateInput).type(formattedDate, { force: true });
    
    });
}

verifyUpdatedShipmentDetails(org, forwarder, forwarderPRONumber, shipperSearchName, dropSearchName, readyDate, pickUpDate, dropDate, freightPieces, freightType, toggleButtonsSet) {
    cy.wait(10000);
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
    cy.get('div.shipment-contact-edit__field').eq(0).should('contain.text', shipperSearchName);
    cy.get('div.shipment-contact-edit__field').eq(5).should('contain.text', dropSearchName);
    cy.get(this.weblocators.providerReadyDateInput).should('not.have.value', readyDate);
    cy.get(this.weblocators.providerPickupDateInput).should('not.have.value', pickUpDate);
    cy.get(this.weblocators.providerDropDateInput).should('not.have.value', dropDate);
    cy.get(this.weblocators.freightPiecesInput1).should('have.value', freightPieces);
    cy.get(this.weblocators.freightTypeDropDown).find('option').contains(freightType).should('be.selected');
    toggleButtonsSet.forEach(buttonName => {
        cy.get(this.weblocators.toggleSwitch.replace('{buttonName}', buttonName)).should('be.checked');
    });

}



}