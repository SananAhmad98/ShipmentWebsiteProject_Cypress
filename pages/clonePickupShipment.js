export class clonePickupShipment {

  weblocators = {
      shipmentStatusDropdown: 'select.select[name="shipmentStatus"]',
      forwarderReferenceNumberInput: 'input[name="shipmentReferenceNumber"][placeholder="Reference Number"]',
      freightPiecesInput1: 'input.input[name="shipmentFreightPieces"]',
      createShipmentButton: 'button.button--primary[type="submit"]',
      cloneShipmentButton: 'button[title="Copy Shipment"]',
      topSearchbar: 'input[placeholder="Search by Reference Number CUDA ID Organization Forwarder Consignee Type Or Status"]'
  }

  searchPickupShipmentbyType() {
    cy.get(this.weblocators.topSearchbar).click();
    cy.get(this.weblocators.topSearchbar).type("Pickup");
    // Find a row where the shipment type column (index 7) is "Pickup"
    cy.get('tr.shipment-list-item').filter((index, element) => {
    return Cypress.$(element).find('td').eq(7).text().trim() === 'Pickup';
    }).first().as('pickupShipmentRow');
    cy.wait(100);
    // Get the CudaID from the first matching row (assuming it's in column index 1)
    cy.get('@pickupShipmentRow').find('td').eq(1).invoke('text').then((cudaId) => {
    // Use the CudaID to search in the top bar
    cy.get(this.weblocators.topSearchbar).clear().type(cudaId);
    cy.wait(6000);
    });
}


  getFirstShipmentData() {
      let firstRowshipmentId, firstRowreferenceNumber, firstRowproNumber, firstRowMawbField, firstRoworganization, firstRowconsignee, firstRowforwarder, firstRowshipmentType, firstRowstatus, firstRoworiginAddress, firstRowdestinationAddress, firstRowpickupDate, firstRowdeliveryDate;

      cy.get('tr.shipment-list-item').first().find('td').each(($td, index) => {
          const text = $td.text().trim();

          // Assign the text to the corresponding variable based on the index
          switch (index) {
              case 0:
                  firstRowshipmentId = text;
                  cy.wrap(firstRowshipmentId).as('firstRowshipmentId');
                  break;
              case 1:
                  firstRowreferenceNumber = text;
                  cy.wrap(firstRowreferenceNumber).as('firstRowreferenceNumber');
                  break;
              case 2:
                  firstRowproNumber = text;
                  cy.wrap(firstRowproNumber).as('firstRowproNumber');
                  break;
              case 3:
                  firstRowMawbField = text;
                  cy.wrap(firstRowMawbField).as('firstRowMawbField');
                  break;
              case 4:
                  firstRoworganization = text;
                  cy.wrap(firstRoworganization).as('firstRoworganization');
                  break;
              case 5:
                  firstRowconsignee = text;
                  cy.wrap(firstRowconsignee).as('firstRowconsignee');
                  break;
              case 6:
                  firstRowforwarder = text;
                  cy.wrap(firstRowforwarder).as('firstRowforwarder');
                  break;
              case 7:
                  firstRowshipmentType = text;
                  cy.wrap(firstRowshipmentType).as('firstRowshipmentType');
                  break;
              case 8:
                  firstRowstatus = text;
                  cy.wrap(firstRowstatus).as('firstRowstatus');
                  break;
              case 9:
                  firstRoworiginAddress = text;
                  cy.wrap(firstRoworiginAddress).as('firstRoworiginAddress');
                  break;
              case 10:
                  firstRowdestinationAddress = text;
                  cy.wrap(firstRowdestinationAddress).as('firstRowdestinationAddress');
                  break;
              case 11:
                  firstRowpickupDate = text;
                  cy.wrap(firstRowpickupDate).as('firstRowpickupDate');
                  break;
              case 12:
                  firstRowdeliveryDate = text;
                  cy.wrap(firstRowdeliveryDate).as('firstRowdeliveryDate');
                  break;
              // Add more cases if there are additional <td> elements
              default:
                  break;
          }
      });
  }

  clickOnCloneShipment() {
      cy.get(this.weblocators.cloneShipmentButton).click();
      cy.wait(10000);
  }

  updateShipmentStatus() {
      cy.wait(1000);
      cy.get(this.weblocators.shipmentStatusDropdown).select('Pending');
  }

  updateRefrenceNumber() {
      const forwarderReferenceNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
      // Use {force: true} to type into a disabled input otherwise we explicitly need to click that field to make it enabled 
      cy.get(this.weblocators.forwarderReferenceNumberInput).type(forwarderReferenceNumber);
      cy.wrap(forwarderReferenceNumber).as('forwarderReferenceNumber');
  }

  updateQuantityFreightItems(freightPieces) {
      cy.get(this.weblocators.freightPiecesInput1).type(freightPieces);
  }

  clickCreateButtonToClone() {
      cy.get(this.weblocators.createShipmentButton).click();
      cy.wait(10000);
  }

  assertPickupClonedShipmentData() {
      cy.wait(1000);
      cy.get('tr.shipment-list-item').first().within(() => {
          let shipmentId, referenceNumber, proNumber, MawbField, organization, consignee, forwarder, shipmentType, status, originAddress, destinationAddress, pickupDate, deliveryDate;

          // Get all <td> elements inside this <tr>
          cy.get('td').each(($td, index) => {
              const text = $td.text().trim();

              // Assign the text to the corresponding variable based on the index
              switch (index) {
                  case 0:
                      shipmentId = text;
                      break;
                  case 1:
                      referenceNumber = text;
                      break;
                  case 2:
                      proNumber = text;
                      break;
                  case 3:
                      MawbField = text;
                      break;
                  case 4:
                      organization = text;
                      break;
                  case 5:
                      consignee = text;
                      break;
                  case 6:
                      forwarder = text;
                      break;
                  case 7:
                      shipmentType = text;
                      break;
                  case 8:
                      status = text;
                      break;
                  case 9:
                      originAddress = text;
                      break;
                  case 10:
                      destinationAddress = text;
                      break;
                  case 11:
                      pickupDate = text;
                      break;
                  case 12:
                      deliveryDate = text;
                      break;
                  // Add more cases if there are additional <td> elements
                  default:
                      break;
              }
          }).then(() => {
              // Add assertions to compare extracted values with the expected values
              cy.get('@firstRowproNumber').then(firstRowproNumber => {
                  expect(proNumber).to.equal(firstRowproNumber);
              });
              
              cy.get('@firstRowMawbField').then(firstRowMawbField => {
                  expect(MawbField).to.equal(firstRowMawbField);
              });

              cy.get('@firstRoworganization').then(firstRoworganization => {
                  expect(organization).to.equal(firstRoworganization);
              });

              cy.get('@firstRowconsignee').then(firstRowconsignee => {
                  expect(consignee).to.equal(firstRowconsignee);
              });

              cy.get('@firstRowforwarder').then(firstRowforwarder => {
                  expect(forwarder).to.equal(firstRowforwarder);
              });

              cy.get('@firstRowshipmentType').then(firstRowshipmentType => {
                  expect(shipmentType).to.equal(firstRowshipmentType);
              });

              expect(status).to.equal('Pending'); // Direct assertion without wrapping
              
              cy.get('@firstRoworiginAddress').then(firstRoworiginAddress => {
                  expect(originAddress).to.equal(firstRoworiginAddress);
              });

              cy.get('@firstRowdestinationAddress').then(firstRowdestinationAddress => {
                  expect(destinationAddress).to.equal(firstRowdestinationAddress);
              });

              /*cy.get('@firstRowpickupDate').then(firstRowpickupDate => {
                  expect(pickupDate).to.equal(firstRowpickupDate);
              });

              cy.get('@firstRowdeliveryDate').then(firstRowdeliveryDate => {
                  expect(deliveryDate).to.equal(firstRowdeliveryDate);
              });*/
          });
      });
      cy.wait(3000);
  }
}
