import { createDeliveryShipment } from "../../pages/shipmentCreation/createDeliveryShipment";
import loginData from "../../fixtures/loginData.json";
import shipmentData from "../../fixtures/shipmentData.json";
import consigneeData from "../../fixtures/consigneeData.json";
import providerDetailsData from "../../fixtures/providerDetailsData.json";
import freightDetailsData from "../../fixtures/freightItemData.json";
import accessorialData from "../../fixtures/accessorialData.json";
import { checkMetricConversions } from "../../pages/checkMetricConversions";
import { editShipmentCost } from "../../pages/editShipmentCosting";

const shipmentCostObj = new editShipmentCost();
const checkMetricObj = new checkMetricConversions();
const shipmentObj = new createDeliveryShipment();

describe('Shipment Tests', () => {

    before(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.reload({ forceReload: true }); // For a full reload from the server
        cy.login(loginData.email, loginData.password);
    });

    it('Check Metric Conversions', () => {
        // No need to navigate to shipment page as default page is shipment page after login

        // Click on the create shipment button
        shipmentObj.clickCreateShipment();

        // Click on shipment type
        shipmentObj.clickShipmentType();

        shipmentObj.selectShipmentStatus(shipmentData.deliveryShipmentStatus);
        shipmentObj.selectOrganization();
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

        checkMetricObj.enterFreightInformationToCheckMetric(
            freightDetailsData.freightPieces,
            freightDetailsData.freightType,
            freightDetailsData.freightWeight,
            freightDetailsData.freightLength,
            freightDetailsData.freightWidth,
            freightDetailsData.freightHeight
        );

        shipmentObj.handleToggleButtons(accessorialData.toggleButtonsSet);

        shipmentObj.untoggleCheckbox(accessorialData.untoggleButtonsSet);

        shipmentObj.uploadShipmentAttachment(
            shipmentData.filePath1,
            shipmentData.filePath2
        );
        
        shipmentObj.verifyShipmentPopup();

        shipmentObj.fetchAndStoreCudaID();
        shipmentObj.searchRecordByCudaID();

        checkMetricObj.clickOnshipmentCostingButton();
        checkMetricObj.assertMetricConversions(
            freightDetailsData.freightLength,
            freightDetailsData.freightWidth,
            freightDetailsData.freightHeight,
            freightDetailsData.freightWeight
        );
        
    });
});