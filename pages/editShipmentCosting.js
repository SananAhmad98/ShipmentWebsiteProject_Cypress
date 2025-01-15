import { timeout } from "async";

export class editShipmentCost {

    weblocators = {
        //Shipment Costing Button
        shipmentCostingButton: 'a[title="Shipment Costing"]',
        primaryButton: 'button.button.button--primary',
        chargeCodeSelectionButton: 'select#charge-code',
        chargeDetailsInput: 'input#new-charge-details',
        updatechargeDetailsInput: 'span.charge-list-item__input input.input',
        totalChargeAmount: '.shipment-costing__charge-total--amount',
        amountInput: 'input[id^="ui-currency-"][type="number"]',
        customerChargeListItems: '.charge-list-item',
        comboboxToggleButton: '.combobox--toggle',
        comboboxOptions: '.combobox--options',
        comboboxInput: '.combobox--input',
        deleteChargeButton: 'button[title="Delete Charge"]',
        chargeList: 'table.shipment-costing__list tbody',
        editChargeButton: 'button[title="Edit Cost"]',
        unlockChargeButton: 'button[title="Unlock Charge"]',
        saveButton: 'button[title="Save"]',
        addAttachmentLabel: 'label[for="attachment"]',
        fileInput: 'input[type="file"]',
        defaultButton: 'button.button.button--default',
        podNameInput: 'input#pod-name.input',
        approveChargesButton: 'button.button--select.button.button--primary',
        pillButtons: 'button.pill--button',
        searchRecordByCudaIDInput: 'input[type="text"][placeholder*="CUDA ID"]',
        pullFromUnderReviewButton: 'button[title="Pull From Under Review"]',
        ellipsisButton: 'button.button.button--icon'
    }

    clickOnshipmentCostingButton(index) {
        cy.get(this.weblocators.shipmentCostingButton).eq(index).click();
    }

    addChargesAndVerify(chargeCodes, descriptions, costs) {
        cy.wait(20000);
        cy.get(this.weblocators.totalChargeAmount).should('be.visible').invoke('text').then(totalChargeText => {
            const totalChargeAmount = totalChargeText.replace(/[^\d.-]/g, '').trim();
            const initialAmount = parseFloat(totalChargeAmount);
            cy.wrap(initialAmount).as('initialAmount');
        })

        cy.get('@initialAmount').then(Amount => {
            const amount = parseFloat(Amount);
            const totalCostSum = costs.reduce((acc, cost) => acc + cost, 0);
            const finalAmount = amount + totalCostSum;
            cy.log(finalAmount);
        })

        for (let i = 0; i < chargeCodes.length; i++) {
            const chargeCode = chargeCodes[i];
            const description = descriptions[i];
            const cost = costs[i];

            cy.get(this.weblocators.primaryButton, { timeout: 100000 }).should('not.be.disabled').contains('Add Charge').click({ force: true });
            cy.get(this.weblocators.chargeCodeSelectionButton).select(chargeCode);
            cy.get(this.weblocators.chargeDetailsInput).type(description);
            cy.get(this.weblocators.amountInput).clear().type(cost.toString());
            cy.get(this.weblocators.primaryButton).contains(' Save ').click();
            cy.wait(5000);
        };

        cy.get(this.weblocators.totalChargeAmount).should('be.visible').invoke('text').then(totalChargeText => {
            const totalChargeAmount = totalChargeText.replace(/[^\d.-]/g, '').trim();
            const finalChargeAmount = parseFloat(totalChargeAmount);
            cy.wrap(finalChargeAmount).as('finalChargeAmount');
        });

        cy.get('@initialAmount').then(initialAmount => {
            const totalCostSum = costs.reduce((acc, cost) => acc + cost, 0);
            const expectedFinalAmount = initialAmount + totalCostSum;

            cy.get('@finalChargeAmount').should('exist').then(finalChargeAmount => {
                // Ensure the finalChargeAmount is a number
                cy.log(expectedFinalAmount);
                const finalChargeAmountValue = parseFloat(finalChargeAmount);
                expect(finalChargeAmountValue).to.eq(expectedFinalAmount);
            });
        });
    }

    editSpecificCharge(index, newDescription) {
            cy.wait(20000);
            cy.get(this.weblocators.chargeList, { timeout: 10000 })
                .find('tr.charge-list-item') 
                .eq(index)
                .find(this.weblocators.editChargeButton)
                .click();
        
            // Clear and type in the new description, then save
            cy.get(this.weblocators.updatechargeDetailsInput, { timeout: 10000 })
                .clear()
                .type(newDescription);
            cy.get(this.weblocators.saveButton).click();
        
            // Wait for the page or list to reload and reflect the changes
            cy.get(this.weblocators.chargeList, { timeout: 10000 }) // Adjust timeout as needed
                .find('tr') 
                .eq(index)
                .within(() => {
                    cy.get('td', { timeout: 10000 }) // Wait for the cells to appear
                        .contains(newDescription, { timeout: 10000 }) // Adjust timeout for content appearance
                        .should('be.visible'); // Ensure the content is visible
                });
    }

    deleteSpecificCharge(index) {
        cy.wait(20000);
        cy.get(this.weblocators.chargeList)
            .find('tr.charge-list-item') 
            .eq(index) 
            .find(this.weblocators.deleteChargeButton) 
            .click(); 

        
        cy.wait(20000); 

        cy.get(this.weblocators.chargeList)
            .find('tr.charge-list-item') 
            .should('have.length.lessThan', 8); 
    }

    uploadFile(filePath) {
        cy.get(this.weblocators.addAttachmentLabel).click();

        cy.get(this.weblocators.fileInput).then(subject => {
            cy.wrap(subject).selectFile(filePath, { force: true });
            cy.get('[data-testid="Toastify__toast-container--bottom-left"]', { timeout: 100000 }) 
                .should('be.visible') 
                .find('[data-testid="toast-content"]')
                .should('contain.text', 'Attachment was added.');
        });
    }
    
    editInfoAndApprove(podName, refineSearchOption) {
        cy.wait(4000);
        cy.get(this.weblocators.defaultButton).contains(' Edit Info ').click({ force: true });
        cy.get(this.weblocators.podNameInput).scrollIntoView().should('be.visible').type(podName);
        cy.get(this.weblocators.primaryButton).contains(' Save Info ').click();
        cy.wait(12000);
        cy.get(this.weblocators.defaultButton).contains(' Approve Shipment Charges ').click({ force: true });
        cy.get(this.weblocators.approveChargesButton).contains(' Approve Charges ').click({ force: true });
        cy.wait(25000);
        cy.get(this.weblocators.pillButtons).contains(refineSearchOption).click();
        cy.wait(7000);

        cy.get('@cudaId').then(cudaId => {
            cy.get(this.weblocators.searchRecordByCudaIDInput).should('be.visible').type(cudaId, { force: true });
            cy.wait(5000);

            cy.get('tr.shipment-list-item').should('exist').within(() => {
                cy.get('td').eq(1).find('span').contains(cudaId).should('exist');
            });
        });
    }

    unlockChargeAndRecalculate(newDescription) {
        cy.wait(10000);
        cy.get(this.weblocators.chargeList).find('tr.charge-list-item').contains(newDescription).parents('tr').then(row => {
            cy.wrap(row).find('td').eq(4).find('span.charge-list-item__input').invoke('text').then(amountText => {
                const amount = amountText.replace(/[^\d.-]/g, '').trim();
                const amountNumber = parseFloat(amount);
                cy.wrap(amountNumber).as('rowAmount');
            });

            cy.wrap(row).find(this.weblocators.unlockChargeButton).click();
        });

        cy.wait(2000);

        cy.get(this.weblocators.defaultButton).contains(' Recalculate Tariff Charges ').click();
        cy.wait(12000);
        cy.reload();
        cy.wait(30000);

        cy.get(this.weblocators.totalChargeAmount).scrollIntoView().should('be.visible').invoke('text').then(totalChargeText => {
            const totalChargeAmount = totalChargeText.replace(/[^\d.-]/g, '').trim();
            const recalculatedAmount = parseFloat(totalChargeAmount);
            cy.wrap(recalculatedAmount).as('recalculatedAmount');
        });

        cy.get('@rowAmount').then(rowAmount => {
            cy.get('@finalChargeAmount').then(finalChargeAmount => {
                const expectedFinalAmount = finalChargeAmount - rowAmount;

                cy.get('@recalculatedAmount').then(recalculatedAmount => {
                    // Assert that the recalculated amount is equal to the expected final amount
                    expect(recalculatedAmount).to.eq(expectedFinalAmount);
                });
            });
        });

        cy.wait(5000);

    }
}