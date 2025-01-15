import loginData from "../../fixtures/loginData.json";
import shipmentData from "../../fixtures/shipmentData.json";
import freightDetailsData from "../../fixtures/freightItemData.json";
import { createDeliveryShipment } from "../../pages/shipmentCreation/createDeliveryShipment";
import { clonePickupShipment } from "../../pages/clonePickupShipment";
const shipmentObj = new createDeliveryShipment();
const clonePickupShipmentObj=new clonePickupShipment();

describe('Shipment Tests', () => {

    before(() => {
        cy.login(loginData.email, loginData.password);
    });
    it('Should Clone a Pickup Type of shipment', () => {
        //No need to navigate to shipment page as default page is shipment page after login

        clonePickupShipmentObj.searchPickupShipmentbyType();
        clonePickupShipmentObj.getFirstShipmentData(shipmentData);
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