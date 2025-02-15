import { select, timeout } from "async";

export class quotes {

    weblocators = {
        quoteRouter: '.main-nav--item-block',
        addNewQuoteButton: '.button--primary',
        quoteRefNoInput: 'input#reference-number.input',
        designationRadioFieldSet: 'fieldset.input-group label:contains("{labelText}") input[type="radio"]',
        dateInput: 'input#ui-date-time-input-date',
        selectForwarder: 'select#forwarder.select.quote-edit__input-select',
        comboboxInput: 'input.combobox--input',
        comboboxToggle: 'button.combobox--toggle',
        listbox: 'ul[role="listbox"]',
        listboxItem: 'li',
        dropoffZipCodeInput: 'input#zip-code-drop-off.input',
        zoneDropOffSelect: 'select#zone-drop-off',
        freightPiecesInput: 'input[name="pieces"]',
        freightWeightInput: 'div.input-group:has(label:contains("Weight (Lbs)"))',
        weightMethodFieldset: 'fieldset.input-group.input-group--horizontal.fieldset input[type="radio"][value="{buttonValue}"]',
        getQuoteButton: '.button--primary',
        quotePriceSpan: 'span.quote-edit__total--amount',
        saveQuoteButton: '.button--primary',
        searchQuoteInput: 'th.data-grid--filter input[placeholder="Search by Id"]'
    }

    randomNumberGenerator(length) {
        const characters = '0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    clickQuotesRouter() {
        cy.get(this.weblocators.quoteRouter).contains('Quotes').click();
        cy.get(this.weblocators.addNewQuoteButton, { timeout: 5000 }).contains('Add New Quote').click({ force: true });
    }

    quoteDetails(designationType, date, forwarder, pickupZipCode, pickupZone) {
        const validDesignationTypes = ['Delivery'];
        if (!validDesignationTypes.includes(designationType)) {
            throw new Error(`Invalid designationType specified: ${designationType}.`);
        }

        const referenceNumber = this.randomNumberGenerator(6);

        cy.get(this.weblocators.quoteRefNoInput)
            .type(referenceNumber)
            .then(() => {
                cy.wrap(referenceNumber).as('ReferenceNumber')
            });
        cy.get('fieldset.input-group')
            .contains('label', designationType) // Find the label that contains the designationType text
            .find('input[type="radio"]') // Find the radio button within that label
            .check();
        cy.get(this.weblocators.dateInput).type(date);
        cy.get(this.weblocators.selectForwarder).wait(20000).select(forwarder, {force: true});
        cy.get(this.weblocators.dropoffZipCodeInput).type(pickupZipCode);
        cy.get(this.weblocators.zoneDropOffSelect, { timeout: 100000 }) // Timeout set to 10 seconds
        .select(pickupZone);
    }

    typeIntoCombobox(expectedOptions, containOptions) {
        expectedOptions.forEach((option, index) => {
            if (!containOptions || containOptions.length <= index) {
                throw new Error(`containOptions array is not properly defined or is missing expected values at index ${index}.`);
            }
            cy.get(this.weblocators.comboboxInput).clear().type(option);
            cy.get(this.weblocators.listbox, { timeout: 10000 }).should('be.visible');

            // Find and click the matching option in the dropdown
            cy.get(this.weblocators.listboxItem)
                .contains(containOptions[index], { timeout: 10000 })
                .click({ force: true })
                .then($item => {
                    if ($item.length === 0) {
                        throw new Error(`Option '${containOptions[index]}' not found in the dropdown.`);
                    }
                });
        });
    }

    freightDetails(freightPieces, freightWeightInLBS, freightWeightMethod) {
        cy.get(this.weblocators.freightPiecesInput).type(freightPieces);
        cy.get(this.weblocators.freightWeightInput).contains('Weight (Lbs)').type(freightWeightInLBS);

        let weightMethodValue;
        if (freightWeightMethod === 'Per Unit') {
            weightMethodValue = 'true'; // Value for 'Per Unit'
        } else if (freightWeightMethod === 'Total Weight') {
            weightMethodValue = 'false'; // Value for 'Total Weight'
        } else {
            throw new Error(`Invalid weight method specified: ${freightWeightMethod}`);
        }

        // Ensure the correct radio button is selected
        cy.get(this.weblocators.weightMethodFieldset.replace('{buttonValue}', weightMethodValue))
            .check({ force: true })
            .should('be.checked'); // Verify it is checked

    }

    getQuotePriceandSave() {
        cy.get(this.weblocators.getQuoteButton).contains('Get Quote').click();
        cy.wait(20000);
        cy.get(this.weblocators.quotePriceSpan)
            .should('exist') // Ensure the element exists in the DOM
            .and(($span) => {
                const text = $span.text().trim(); // Get and trim the text content
                expect(text).to.not.be.empty; // Assert that the text is not empty
            });
        cy.get(this.weblocators.saveQuoteButton).contains('Save').click();
    }

    assertToastNotification() {
        // Check if the toast container is visible
        cy.get('[data-testid="Toastify__toast-container--bottom-left"]', { timeout: 100000 }) // Adjust timeout as needed
            .should('be.visible') // Ensure the container is visible

            // Check if the toast notification contains the correct text
            .find('[data-testid="toast-content"]')
            .should('contain.text', 'Quote was saved.');
    }

    //commenting out as we don't have option to search quote by Reference Number
    // searchQuoteByRefNo() {
    //     cy.wait(5000);
    //     cy.get('@ReferenceNumber').then(ReferenceNumber => {
    //         cy.get(this.weblocators.searchQuoteInput).should('be.visible').type(ReferenceNumber);
    //     });
    // }

}                                                                           