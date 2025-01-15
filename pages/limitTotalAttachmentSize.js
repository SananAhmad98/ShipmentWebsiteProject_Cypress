export class limitTotalAttachmentSize{

    weblocators = {
       
        uploadShipmentAttachment: 'input#shipmentAttachment[type="file"]',
        createShipmentButton: 'button.button--primary[type="submit"]',
        errorToast:'[data-testid="toast-content"]'
        }

        attachFilestoHitLimit(filePath)
        {
            cy.contains('div', 'Attachments').scrollIntoView().should('be.visible');
            for (let i = 0; i < 5; i++) {
                cy.wait(6000);
                cy.get(this.weblocators.uploadShipmentAttachment).selectFile(filePath, { force: true });
                
            }            
            
            cy.get(this.weblocators.errorToast).should('be.visible')
            .and('contain', 'Unable to upload attachment. Total attachment size is over 23MB limit');
            
        }
    
  
   

    
}






