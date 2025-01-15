import { createDeliveryShipment } from "../../pages/shipmentCreation/createDeliveryShipment";
import loginData from "../../fixtures/loginData.json";
import shipmentData from "../../fixtures/shipmentData.json";
import consigneeData from "../../fixtures/consigneeData.json";
import providerDetailsData from "../../fixtures/providerDetailsData.json";
import freightDetailsData from "../../fixtures/freightItemData.json";
import accessorialData from "../../fixtures/accessorialData.json";
import { checkImperialConversions } from "../../pages/checkImperialConversions";
import { editShipmentCost } from "../../pages/editShipmentCosting";

const shipmentCostObj = new editShipmentCost();
const checkImperialObj = new checkImperialConversions();
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

        checkImperialObj.enterFreightInformationToCheckMetric(
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

        checkImperialObj.clickOnshipmentCostingButton();
        checkImperialObj.assertMetricConversions(
            freightDetailsData.freightLength,
            freightDetailsData.freightWidth,
            freightDetailsData.freightHeight,
            freightDetailsData.freightWeight
        );

        checkImperialObj.clickShipmentTabOnLeftPanel();

        shipmentObj.searchRecordByCudaID();

        checkImperialObj.clickShipmentEditButton();

        checkImperialObj.editWeight("800");

        checkImperialObj.clickShipmentUpdate();

        checkImperialObj.verifyUpdateShipmentToastMessage();

        checkImperialObj.clickShipmentTabOnLeftPanel();

        shipmentObj.searchRecordByCudaID();

        checkImperialObj.clickOnshipmentCostingButton();

        checkImperialObj.clickRecalculateTariffCharges();

        checkImperialObj.assertConversionAfterUpdate(
            freightDetailsData.freightLength,
            freightDetailsData.freightWidth,
            freightDetailsData.freightHeight,
            "800"
        );
    });
});