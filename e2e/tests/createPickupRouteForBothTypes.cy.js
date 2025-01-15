import { createShipment } from "../../pages/shipmentCreation/createPickupShipment";
import { shipmentRouting } from "../../pages/createPickupRouteForBothTypes";
import loginData from "../../fixtures/loginData.json";
import shipmentData from "../../fixtures/shipmentData.json";
import consigneeData from "../../fixtures/consigneeData.json";
import providerDetailsData from "../../fixtures/providerDetailsData.json"
import freightDetailsData from "../../fixtures/freightItemData.json";
import accessorialData from "../../fixtures/accessorialData.json";
import routingData from "../../fixtures/routingData.json"

const ShipmentRouting = new shipmentRouting();
const shipmentObj = new createShipment();

describe('Shipment Tests', () => {

    before(() => {
        cy.login(loginData.email, loginData.password);
    });

    it('Should show newly created shipment under routing screen', () => {

        shipmentObj.clickCreateShipment();
        shipmentObj.clickShipmentType();
        shipmentObj.selectShipmentStatus(
            shipmentData.deliveryShipmentStatus);
        shipmentObj.enterForwarderDetails(
            shipmentData.forwarder,
            shipmentData.forwarderPRONumber);
        shipmentObj.handleShipperContactOption(
            shipmentData.recoveryOption,
            shipmentData.recoverySearchName,
            shipmentData.shipperInformation.locationName,
            shipmentData.shipperInformation.addressLine1,
            shipmentData.shipperInformation.city,
            shipmentData.shipperInformation.state,
            shipmentData.shipperInformation.zip);
        shipmentObj.handleDropContactOption(
            consigneeData.consigneeOption,
            consigneeData.consigneeInformation.searchName,
            consigneeData.consigneeInformation.locationName,
            consigneeData.consigneeInformation.addressLine1,
            consigneeData.consigneeInformation.addressLine2,
            consigneeData.consigneeInformation.city,
            consigneeData.consigneeInformation.state,
            consigneeData.consigneeInformation.zip);
        //ShipmentRouting.enterProviderInformationUsingCurrDateTime();
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
        shipmentObj.verifyShipmentPopup();
        shipmentObj.fetchAndStoreCudaID();
        shipmentObj.storeAllData();
        shipmentObj.searchRecordByCudaID();
        ShipmentRouting.searchDragnDropRecordByRefNos(routingData.shipments);
        ShipmentRouting.saveAndDispatchRoute(routingData.truckDriver01);
        ShipmentRouting.saveAndDispatchRoute1(routingData.truckDriver02);
    });
});