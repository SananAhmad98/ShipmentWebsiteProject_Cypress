import { createDirectDeliveryShipment } from "../../../pages/shipmentCreation/createDirectDelivery";
import { editDirectDeliveryShipment } from "../../../pages/editShipment/editDirectDeliveryShipment";
import loginData from "../../../fixtures/loginData.json";
import shipmentData from "../../../fixtures/shipmentData.json";
import consigneeData from "../../../fixtures/consigneeData.json";
import providerDetailsData from "../../../fixtures/providerDetailsData.json";
import freightDetailsData from "../../../fixtures/freightItemData.json";
import accessorialData from "../../../fixtures/accessorialData.json";
import editShipmentDetails from "../../../fixtures/editShipmentDetails.json";




const createShipment = new createDirectDeliveryShipment();
const editDDhipment = new editDirectDeliveryShipment();

describe('Shipment Tests', () => {

    before(() => {
        cy.login(loginData.email, loginData.password);
    });

    it('Should Create And Edit A Shipment With Type Direct Delivery', () => {

        createShipment.clickCreateShipment();
        createShipment.clickShipmentType();

        createShipment.selectShipmentStatus(
            shipmentData.directDeliveryShipmentStatus
        );

        createShipment.enterForwarderDetails(
            shipmentData.forwarder,
            shipmentData.forwarderPRONumber
        );

        createShipment.handleShipperContactOption(
            shipmentData.contactOption,
            shipmentData.shipperInformation.searchName,
            shipmentData.shipperInformation.locationName,
            shipmentData.shipperInformation.addressLine1,
            shipmentData.shipperInformation.city,
            shipmentData.shipperInformation.state,
            shipmentData.shipperInformation.zip
        );

        createShipment.handleconsigneeContactOption(
            consigneeData.consigneeOption, 
            consigneeData.consigneeInformation.searchName,
            consigneeData.consigneeInformation.locationName,
            consigneeData.consigneeInformation.addressLine1,
            consigneeData.consigneeInformation.addressLine2,
            consigneeData.consigneeInformation.city,
            consigneeData.consigneeInformation.state,
            consigneeData.consigneeInformation.zip
        );

        createShipment.enterProviderInformation(
            providerDetailsData.readyDate,
            providerDetailsData.readyTime,
            providerDetailsData.pickUpDate,
            providerDetailsData.pickUpTime,
            providerDetailsData.deliveryDate,
            providerDetailsData.deliveryTime
        );

        createShipment.handleProviderOption(
            providerDetailsData.providerOption.toUpperCase()
        );

        createShipment.enterFreightInformation(
            freightDetailsData.freightPieces,
            freightDetailsData.freightType
        );

        createShipment.handleToggleButtons(
            accessorialData.toggleButtonsSet
        );

        createShipment.untoggleCheckbox(
            accessorialData.untoggleButtonsSet
        );

        createShipment.uploadShipmentAttachment(
            shipmentData.filePath1,
            shipmentData.filePath2
        );

        createShipment.fetchAndStoreCudaID();
        editDDhipment.verifyShipmentPopup();
        createShipment.storeAllData();
        editDDhipment.searchShipmentByRefNo();
        editDDhipment.viewShipmentDetails();

        editDDhipment.editForwarderDetails(
            editShipmentDetails.org,
            editShipmentDetails.forwarder
        );

        editDDhipment.handleShipperContactOption(
            editShipmentDetails.shipperOption,
            editShipmentDetails.shipperSearchName
        );

        editDDhipment.handleconsigneeContactOption(
            editShipmentDetails.consigneeOption,
            editShipmentDetails.consigneeSearchName
        );

        editDDhipment.enterProviderInformationUsingCurrDateTime();

        editDDhipment.handleProviderOption(
            editShipmentDetails.providerOption
        );

        editDDhipment.enterFreightInformation(
            editShipmentDetails.freightPieces,
            editShipmentDetails.freightType
        );

        editDDhipment.handleToggleButtons(
            editShipmentDetails.toggleButtonsSet
        );

        editDDhipment.untoggleCheckbox(
            editShipmentDetails.untoggleButtonsSet
        );

        editDDhipment.updateShipment();
        editDDhipment.storeAllData();
        editDDhipment.searchShipmentByUpdatedRefNo();

        editDDhipment.verifyUpdatedShipmentDetails(
            editShipmentDetails.org,
            editShipmentDetails.forwarder,
            shipmentData.forwarderPRONumber,
            editShipmentDetails.shipperSearchName,
            editShipmentDetails.consigneeSearchName,
            providerDetailsData.readyDate,
            providerDetailsData.readyTime,
            providerDetailsData.pickUpDate,
            providerDetailsData.pickUpTime,
            providerDetailsData.deliveryDate,
            providerDetailsData.deliveryTime,
            editShipmentDetails.freightPieces,
            editShipmentDetails.freightType,
            editShipmentDetails.toggleButtonsSet
        );
    });
});
