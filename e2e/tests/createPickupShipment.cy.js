import { createShipment } from "../../pages/shipmentCreation/createPickupShipment";
import loginData from "../../fixtures/loginData.json";
import shipmentData from "../../fixtures/shipmentData.json";
import dropInformationData from "../../fixtures/dropInformationData.json";
import providerDetailsData from "../../fixtures/providerDetailsData.json";
import freightDetailsData from "../../fixtures/freightItemData.json";
import accessorialData from "../../fixtures/accessorialData.json";


const shipmentObj = new createShipment();

describe('Shipment Tests', () => {

    before(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.reload({ forceReload: true }); // For a full reload from the server
        cy.login(loginData.email, loginData.password);
    });

    it('should create a new shipment', () => {
        //No need to navigate to shipment page as default page is shipment page after login

        //Click on the create shipment button
        shipmentObj.clickCreateShipment();

        //Click on shipment type
        shipmentObj.clickShipmentType();

        shipmentObj.selectShipmentStatus(
            shipmentData.pickupShipmentStatus);

        shipmentObj.enterForwarderDetails(
            shipmentData.forwarder,
            shipmentData.forwarderPRONumber);

        shipmentObj.handleShipperContactOption(
            shipmentData.contactOption,
            shipmentData.shipperInformation.searchName,
            shipmentData.shipperInformation.locationName,
            shipmentData.shipperInformation.addressLine1,
            shipmentData.shipperInformation.city,
            shipmentData.shipperInformation.state,
            shipmentData.shipperInformation.zip);

        shipmentObj.handleDropContactOption(
            dropInformationData.dropOption,
            dropInformationData.dropInformation.searchName,
            dropInformationData.dropInformation.locationName,
            dropInformationData.dropInformation.addressLine1,
            dropInformationData.dropInformation.addressLine2,
            dropInformationData.dropInformation.city,
            dropInformationData.dropInformation.state,
            dropInformationData.dropInformation.zip);

        shipmentObj.enterProviderInformation(
            providerDetailsData.readyDate,
            providerDetailsData.readyTime,
            providerDetailsData.pickUpDate,
            providerDetailsData.pickUpTime,
            providerDetailsData.dropDate,
            providerDetailsData.dropTime);

        shipmentObj.handleProviderOption(
            providerDetailsData.providerOption.toUpperCase());

        shipmentObj.enterFreightInformation(
            freightDetailsData.freightPieces,
            freightDetailsData.freightType);

        shipmentObj.handleToggleButtons(
            accessorialData.toggleButtonsSet);

        shipmentObj.untoggleCheckbox(
            accessorialData.untoggleButtonsSet);

        shipmentObj.uploadShipmentAttachment(
            shipmentData.filePath1,
            shipmentData.filePath2);

        shipmentObj.verifyShipmentPopup

        shipmentObj.fetchAndStoreCudaID();
        shipmentObj.searchRecordByCudaID();
        shipmentObj.clickOnEllipsisButtonAtIndex(0);
        shipmentObj.clickOnDeleteShipment();
    });
});
