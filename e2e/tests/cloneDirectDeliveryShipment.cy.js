import loginData from "../../fixtures/loginData.json";
import freightDetailsData from "../../fixtures/freightItemData.json";
import { createDeliveryShipment } from "../../pages/shipmentCreation/createDeliveryShipment";
import { clonePickupShipment } from "../../pages/clonePickupShipment";
import { cloneDirectDeliveryShipment } from "../../pages/cloneDirectDeliveryShipment";

const shipmentObj = new createDeliveryShipment();
const clonePickupShipmentObj=new clonePickupShipment();
const cloneDirectDeliveryShipmentObj=new cloneDirectDeliveryShipment();

describe('Shipment Tests', () => {

    before(() => {
        cy.login(loginData.email, loginData.password);
    });
    it('Should Clone a Direct Delivery Type of shipment', () => {
        //No need to navigate to shipment page as default page is shipment page after login

        cloneDirectDeliveryShipmentObj.searchDirectDeliveryShipmentbyType();
        clonePickupShipmentObj.getFirstShipmentData();
        shipmentObj.clickOnEllipsisButtonAtIndex(0);
        clonePickupShipmentObj.clickOnCloneShipment();
        clonePickupShipmentObj.updateShipmentStatus();
        clonePickupShipmentObj.updateRefrenceNumber();
        clonePickupShipmentObj.updateQuantityFreightItems(freightDetailsData.freightPieces);
        clonePickupShipmentObj.clickCreateButtonToClone();
        shipmentObj.verifyShipmentPopup();
        shipmentObj.fetchAndStoreCudaID();
        shipmentObj.searchRecordByCudaID();
        clonePickupShipmentObj.assertPickupClonedShipmentData();
        shipmentObj.clickOnEllipsisButtonAtIndex(0);
        shipmentObj.clickOnDeleteShipment();   
    });
});