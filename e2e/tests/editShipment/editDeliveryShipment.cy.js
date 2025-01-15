import { createDeliveryShipment } from "../../../pages/shipmentCreation/createDeliveryShipment";
import { editDeliveryShipment } from "../../../pages/editShipment/editDeliveryShipment";
import loginData from "../../../fixtures/loginData.json";
import shipmentData from "../../../fixtures/shipmentData.json";
import consigneeData from "../../../fixtures/consigneeData.json";
import providerDetailsData from "../../../fixtures/providerDetailsData.json";
import freightDetailsData from "../../../fixtures/freightItemData.json";
import accessorialData from "../../../fixtures/accessorialData.json";
import editShipmentDetails from "../../../fixtures/editShipmentDetails.json";




const shipmentObj = new createDeliveryShipment();
const editShipment = new editDeliveryShipment();

describe('Shipment Tests', () => {

    before(() => {
        cy.login(loginData.email, loginData.password);
    });

    it('Should edit a shipment with type delivery', () => {
        shipmentObj.clickCreateShipment();

        shipmentObj.clickShipmentType();

        shipmentObj.selectShipmentStatus(
            shipmentData.deliveryShipmentStatus
        );

        shipmentObj.enterForwarderDetails(
            shipmentData.forwarder,
            shipmentData.forwarderPRONumber
        );

        shipmentObj.handleRecoveryContactOption(
            shipmentData.recoveryOption,
            shipmentData.recoverySearchName,
            shipmentData.shipperInformation.locationName,
            shipmentData.shipperInformation.addressLine1,
            shipmentData.shipperInformation.city,
            shipmentData.shipperInformation.state,
            shipmentData.shipperInformation.zip
        );

        shipmentObj.handleconsigneeContactOption(
            consigneeData.consigneeOption,
            consigneeData.consigneeInformation.searchName,
            consigneeData.consigneeInformation.locationName,
            consigneeData.consigneeInformation.addressLine1,
            consigneeData.consigneeInformation.addressLine2,
            consigneeData.consigneeInformation.city,
            consigneeData.consigneeInformation.state,
            consigneeData.consigneeInformation.zip
        );

        shipmentObj.enterProviderInformation(
            providerDetailsData.readyDate,
            providerDetailsData.readyTime,
            providerDetailsData.deliveryDate,
            providerDetailsData.deliveryTime
        );

        shipmentObj.handleProviderOption(
            providerDetailsData.providerOption.toUpperCase()
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
        editShipment.verifyShipmentPopup();

        shipmentObj.storeAllData();
        editShipment.searchShipmentByRefNo();
        editShipment.viewShipmentDetails();

        editShipment.editForwarderDetails(
            editShipmentDetails.org,
            editShipmentDetails.forwarder
        );

        editShipment.handleRecoveryContactOption(
            editShipmentDetails.recoveryOption,
            editShipmentDetails.recoverySearchName
        );

        editShipment.handleconsigneeContactOption(
            editShipmentDetails.consigneeOption,
            editShipmentDetails.consigneeSearchName
        );

        editShipment.enterProviderInformationUsingCurrDateTime();

        editShipment.handleProviderOption(
            editShipmentDetails.providerOption
        );

        editShipment.enterFreightInformation(
            editShipmentDetails.freightPieces,
            editShipmentDetails.freightType
        );

        editShipment.handleToggleButtons(
            editShipmentDetails.toggleButtonsSet
        );

        editShipment.untoggleCheckbox(
            editShipmentDetails.untoggleButtonsSet
        );

        editShipment.updateShipment();
        editShipment.storeAllData();
        editShipment.searchShipmentByUpdatedRefNo();

        editShipment.verifyUpdatedShipmentDetails(
            editShipmentDetails.org,
            editShipmentDetails.forwarder,
            shipmentData.forwarderPRONumber,
            editShipmentDetails.recoverySearchName,
            editShipmentDetails.consigneeSearchName,
            providerDetailsData.readyDate,
            providerDetailsData.deliveryDate,
            editShipmentDetails.freightPieces,
            editShipmentDetails.freightType,
            editShipmentDetails.toggleButtonsSet
        );
    });
});
