
export class checkMetricConversions {

    weblocators = {
        metricRadioBtn: 'input[type="radio"]#metric',
        freightPiecesInput1: 'input.input[name="shipmentFreightPieces"]',
        freightTypeDropDown: 'select.select[name="shipmentFreightType"]',
        frieghtDescription: 'input[name="shipmentFreightDescription"]',
        frieghtWeightKg: 'input[name="shipmentFreightWeight"]',
        frieghtLengthCM: 'input[name="shipmentFreightLength"]',
        frieghtWidthCM: 'input[name="shipmentFreightWidth"]',
        frieghtHeightCM: 'input[name="shipmentFreightHeight"]',
        shipmentCostingButton: 'a[title="Shipment Costing"]',
        costingList: 'table.shipment-costing__list tbody tr.charge-list-item'
    };
  
    // Method to enter freight information
    enterFreightInformationToCheckMetric(freightPieces, freightType, weight, length, width, height) {
        // Validate that the data is not undefined or empty
        cy.wrap(freightPieces).should('not.be.undefined');
        cy.wrap(freightType).should('not.be.undefined');
        cy.wrap(weight).should('not.be.undefined');
        cy.wrap(length).should('not.be.undefined');
        cy.wrap(width).should('not.be.undefined');
        cy.wrap(height).should('not.be.undefined');
  
        // Enter the values into the form fields
        cy.get(this.weblocators.metricRadioBtn).click();
        cy.get(this.weblocators.freightPiecesInput1).type(freightPieces);
        cy.get(this.weblocators.freightTypeDropDown).select(freightType);
        cy.wait(1000);
        cy.get(this.weblocators.frieghtDescription).type('Checking Metric Conversions');
        cy.get(this.weblocators.frieghtWeightKg).type(weight);  // Ensure weight is not undefined
        cy.get(this.weblocators.frieghtLengthCM).type(length);
        cy.get(this.weblocators.frieghtWidthCM).type(width);
        cy.get(this.weblocators.frieghtHeightCM).type(height);
        cy.wait(1000);  // Wait after entering details
    }
  
    // Method to click on the shipment costing button
    clickOnshipmentCostingButton() {
        cy.wait(1000);  // Optional wait, you may not need it
        cy.get(this.weblocators.shipmentCostingButton).click();
    }
  
    // Method to assert metric conversions
    assertMetricConversions(length, width, height, Weight) {
      // Convert Weight to float for accurate comparison
      Weight = parseFloat(Weight);
  
      // Conversion to inches
      let heightInches = height / 2.54;
      let lengthInches = length / 2.54;
      let widthInches = width / 2.54;
  
      // Step 1: Calculate the DIM weight from length, width, height
      let DIMWeight = (lengthInches * widthInches * heightInches) / 166;  // Calculate dimensional weight
      cy.wrap(DIMWeight).as('DIMWeight');  // Store DIMWeight in an alias
  
      // Step 2: Get the first row of the costing list table and extract the details text
      cy.get(this.weblocators.costingList)
          .first()  // Select the first row in the table
          .within(() => {
              cy.get('td').eq(2)  // Selects the "Details" column (3rd column, index 2)
                  .invoke('text')  // Extracts the text
                  .then((detailsText) => {
                      cy.wrap(detailsText).as('details');  // Store in an alias
                      cy.log(detailsText);  // Logs it to the console
                  });
          });
  
      // Step 3: Extract the weight from the details text and compare
      cy.get('@details').then((detailsText) => {
          const match = detailsText.match(/\((.*?)kg/);  // Regular expression to find text between "(" and "kg"
          if (match) {
              const extractedWeight = parseFloat(match[1].trim());  // Extract and parse the matched value
              cy.wrap(extractedWeight).as('extractedValue');  // Store in an alias
              cy.log(`Extracted weight: ${extractedWeight}`);
  
              // Step 4: Retrieve DIM weight and assert based on comparison with the freight weight
              cy.get('@DIMWeight').then((DIMWeight) => {
                  if (Weight > DIMWeight) {
                      // Assert that extracted weight matches the freight weight when Weight > DIMWeight
                      expect(extractedWeight).to.be.closeTo(Weight, 0.01);
                      cy.log(`Freight weight is greater than DIM weight. Extracted weight is now expected to be: ${Weight}`);
                  } else {
                      // Assert that extracted weight matches DIMWeight when Weight <= DIMWeight
                      expect(extractedWeight).to.be.closeTo(DIMWeight, 0.01);
                      cy.log(`Freight weight is less than or equal to DIM weight. Extracted weight is now expected to be: ${DIMWeight}`);
                  }
              });
          }
      });
    }
  }