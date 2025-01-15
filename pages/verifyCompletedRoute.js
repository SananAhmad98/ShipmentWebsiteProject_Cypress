export class verifyCompletedRoute {

    weblocators = {
        searchByRefNo: 'input[placeholder="Search by Reference Number CUDA ID Organization Forwarder Consignee Type Or Status"]',
        shipmentLinkLocator: 'a[title="View Shipment"]:first',
        shipmentAccessorialsViewMoreButton: 'button.button--default.see-more-button',
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

    viewShipmentDetails() {
        cy.wait(15000);
        cy.get(this.weblocators.shipmentLinkLocator).click();
    }

    verifyToggleButtons(toggleButtonsSet) {
        cy.wait(15000);  // Wait for the elements to load (may not always be necessary, adjust if needed)
        cy.get(this.weblocators.shipmentAccessorialsViewMoreButton).click();  // Click the "View More" button to expand accessorials

        toggleButtonsSet.forEach(buttonName => {
            // Construct the dynamic selector for the toggle button
            cy.get(this.weblocators.toggleSwitch.replace('{buttonName}', buttonName)).then(($checkbox) => {
                // Check if the checkbox is not checked
                if (!$checkbox.is(':checked')) {
                    cy.log(`${buttonName} toggle button is NOT checked!`);  // Log if the checkbox is not checked
                }
                // Assert the checkbox is checked
                cy.wrap($checkbox).should('be.checked');
            });
        });
    }

    verifyShipmentAttachments() {
        cy.get('.shipment-edit-view__shipment-attachments-area')
            .find('.shipment-edit-view__attachment-item') // Find all attachment items
            .should('exist') // Ensure attachments exist
            .then((attachmentItems) => {
                // Log the number of attachments
                const count = attachmentItems.length;
                cy.log(`Found ${count} shipment attachments.`);

                // Iterate through attachments and log their text
                attachmentItems.each((index, attachment) => {
                    const text = Cypress.$(attachment).text().trim();
                    cy.log(`Attachment ${index + 1}: ${text}`);
                });

                // Ensure at least one attachment is present
                expect(count).to.be.greaterThan(0, 'Attachments are present');
            });
    }

    verifyShipmentStatus() {
        cy.readFile('cypress/results/testData.json').then((data) => {
            // Extract forwardRefNumber from the JSON data
            const forwardRefNumber = data.forwardRefNumber;

            // Ensure the forwardRefNumber exists
            if (forwardRefNumber) {
                // Locate the row using forwardRefNumber
                cy.get('tr.shipment-list-item')
                    .contains('td', forwardRefNumber) // Use forwardRefNumber to locate the row
                    .parent() // Get the parent row
                    .within(() => {
                        // Assert that the status cell contains "Tendered to Carrier"
                        cy.get('td').contains('Tendered to Carrier').should('exist');
                    });
            } else {
                throw new Error('forwardRefNumber not found in the JSON file');
            }
        });
    }

}