import { createDeliveryShipment } from "../../pages/shipmentCreation/createDeliveryShipment";
import loginData from "../../fixtures/loginData.json";
import shipmentData from "../../fixtures/shipmentData.json";
import consigneeData from "../../fixtures/consigneeData.json";
import providerDetailsData from "../../fixtures/providerDetailsData.json";
import freightDetailsData from "../../fixtures/freightItemData.json";
import accessorialData from "../../fixtures/accessorialData.json";
import { checkMetricConversions } from "../../pages/checkMetricConversions";
import { checkForwarderOnHold } from "../../pages/checkForwarderOnHold";

const checkForwarderOnHoldObj=new checkForwarderOnHold();
const checkMetricObj = new checkMetricConversions();
const shipmentObj = new createDeliveryShipment();

describe('Shipment Tests', () => {

    before(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.reload({ forceReload: true }); // For a full reload from the server
        cy.login(loginData.email, loginData.password);
    });

    it('Check Forwarder on Credit Hold', () => {
        // No need to navigate to shipment page as default page is shipment page after login

        checkForwarderOnHoldObj.navigateToForwrderCreationPage();
        checkForwarderOnHoldObj.clickNewForwarderBtn();
        checkForwarderOnHoldObj.enterForwarderDetails();
        checkForwarderOnHoldObj.clickCreateBtn();
        checkForwarderOnHoldObj.navigateToShipments();

        // Click on the create shipment button
        shipmentObj.clickCreateShipment();

        // Click on shipment type
        shipmentObj.clickShipmentType();

        shipmentObj.selectShipmentStatus(shipmentData.deliveryShipmentStatus);
        shipmentObj.selectOrganization(shipmentData.org);

        shipmentObj.enterForwarderDetails(
            shipmentData.forwarderOnCredit,
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
            freightDetailsData.freightType);

        shipmentObj.handleToggleButtons(accessorialData.toggleButtonsSet);

        shipmentObj.untoggleCheckbox(accessorialData.untoggleButtonsSet);

        checkForwarderOnHoldObj.uploadShipmentAttachment(
            shipmentData.filePath1,
            shipmentData.filePath2
        );
        
        checkForwarderOnHoldObj.assertToast();

        
    });
});