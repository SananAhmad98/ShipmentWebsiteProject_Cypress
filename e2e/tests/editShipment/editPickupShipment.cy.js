import { createShipment } from "../../../pages/shipmentCreation/createPickupShipment";
import { editPickupShipment } from "../../../pages/editShipment/editPickupShipment";
import { editDeliveryShipment } from "../../../pages/editShipment/editDeliveryShipment";
import loginData from "../../../fixtures/loginData.json";
import shipmentData from "../../../fixtures/shipmentData.json";
import dropInformationData from "../../../fixtures/dropInformationData.json";
import providerDetailsData from "../../../fixtures/providerDetailsData.json";
import freightDetailsData from "../../../fixtures/freightItemData.json";
import accessorialData from "../../../fixtures/accessorialData.json";
import editShipmentDetails from "../../../fixtures/editShipmentDetails.json";

const shipmentObj = new createShipment();
const editShipment = new editPickupShipment();
const editShipment2 = new editDeliveryShipment();

describe("Shipment Tests", () => {


    before(() => {
        cy.login(loginData.email, loginData.password);
    });


    it("should edit a shipment with type Pickup", () => {

        shipmentObj.clickCreateShipment();

        shipmentObj.clickShipmentType();

        shipmentObj.selectShipmentStatus(
            shipmentData.pickupShipmentStatus
        );

        shipmentObj.enterForwarderDetails(
            shipmentData.forwarder,
            shipmentData.forwarderPRONumber
        );

        shipmentObj.handleShipperContactOption(

            shipmentData.contactOption,
            shipmentData.shipperInformation.searchName,
            shipmentData.shipperInformation.locationName,
            shipmentData.shipperInformation.addressLine1,
            shipmentData.shipperInformation.city,
            shipmentData.shipperInformation.state,
            shipmentData.shipperInformation.zip

        );

        shipmentObj.handleDropContactOption(

            dropInformationData.dropOption,
            dropInformationData.dropInformation.searchName,
            dropInformationData.dropInformation.locationName,
            dropInformationData.dropInformation.addressLine1,
            dropInformationData.dropInformation.addressLine2,
            dropInformationData.dropInformation.city,
            dropInformationData.dropInformation.state,
            dropInformationData.dropInformation.zip,

        );

        shipmentObj.enterProviderInformation(

            providerDetailsData.readyDate,
            providerDetailsData.readyTime,
            providerDetailsData.pickUpDate,
            providerDetailsData.pickUpTime,
            providerDetailsData.dropDate,
            providerDetailsData.dropTime

        );

        shipmentObj.handleProviderOption(

            providerDetailsData.providerOption

        );

        shipmentObj.enterFreightInformation(

            freightDetailsData.freightPieces,
            freightDetailsData.freightType

        );

        shipmentObj.handleToggleButtons(

            accessorialData.toggleButtonsSet

        ); 

        shipmentObj.untoggleCheckbox(

            accessorialData.untoggleButtonsSet

        );

        shipmentObj.uploadShipmentAttachment(

            shipmentData.filePath1

        );

        shipmentObj.fetchAndStoreCudaID();
        editShipment2.verifyShipmentPopup();

        shipmentObj.storeAllData();
        editShipment.searchShipmentByRefNo();
        editShipment2.viewShipmentDetails();

        editShipment2.editForwarderDetails(
            editShipmentDetails.pickupOrg,
            editShipmentDetails.pickupForwarder
        ); 

        editShipment.handleShipperContactOption(
            editShipmentDetails.shipperOption,
            editShipmentDetails.shipperSearchName
        ); 

        editShipment.handleDropContactOption(
            editShipmentDetails.dropOption,
            editShipmentDetails.dropSearchName
        ); 

        editShipment.enterProviderInformationUsingCurrDateTime();

        editShipment2.handleProviderOption(
            editShipmentDetails.providerOption
        );

        editShipment2.enterFreightInformation(
            editShipmentDetails.freightPieces,
            editShipmentDetails.freightType
        );

        editShipment2.handleToggleButtons(
            editShipmentDetails.toggleButtonsSet
        ); 

        editShipment2.untoggleCheckbox(
            editShipmentDetails.untoggleButtonsSet
        );

        editShipment2.updateShipment();
        editShipment2.storeAllData();
        editShipment2.searchShipmentByUpdatedRefNo(); 

        editShipment.verifyUpdatedShipmentDetails(
            editShipmentDetails.pickupOrg,
            editShipmentDetails.pickupForwarder,
            shipmentData.forwarderPRONumber,
            editShipmentDetails.shipperSearchName,
            editShipmentDetails.dropSearchName,
            providerDetailsData.readyDate,
            providerDetailsData.pickUpDate,
            providerDetailsData.dropDate,
            editShipmentDetails.freightPieces,
            editShipmentDetails.freightType,
            editShipmentDetails.toggleButtonsSet
        );

    })
})