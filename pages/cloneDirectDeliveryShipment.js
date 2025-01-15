export class cloneDirectDeliveryShipment{

    weblocators = {
        topSearchbar: 'input[placeholder="Search by Reference Number CUDA ID Organization Forwarder Consignee Type Or Status"]'
    }
  
    searchDirectDeliveryShipmentbyType() {
      cy.get(this.weblocators.topSearchbar).click();
      cy.get(this.weblocators.topSearchbar).type("Direct Delivery");
      // Find a row where the shipment type column (index 7) is "Direct Delivery"
      cy.get('tr.shipment-list-item').filter((index, element) => {
      return Cypress.$(element).find('td').eq(7).text().trim() === 'Direct Delivery';
      }).first().as('DirectDeliveryShipmentRow');
      cy.wait(100);
      // Get the CudaID from the first matching row (assuming it's in column index 1)
      cy.get('@DirectDeliveryShipmentRow').find('td').eq(1).invoke('text').then((cudaId) => {
      // Use the CudaID to search in the top bar
      cy.get(this.weblocators.topSearchbar).clear().type(cudaId);
      cy.wait(6000);
      });
    }
  
  }
  