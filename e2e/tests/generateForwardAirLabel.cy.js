import loginData from "../../fixtures/loginData.json";
import freightDetailsData from "../../fixtures/freightItemData.json";
import shipmentData from"../../fixtures/shipmentData.json"
import consigneeData from"../../fixtures/consigneeData.json"
import providerDetailsData from"../../fixtures/providerDetailsData.json"
import accessorialData from"../../fixtures/accessorialData.json"
import { createDeliveryShipment } from "../../pages/shipmentCreation/createDeliveryShipment";
import { generateForwardAirLabel } from "../../pages/generateForwardAirLabel"; 

const shipmentObj = new createDeliveryShipment();
const   generateForwardAirLabelObj=new generateForwardAirLabel();

describe('Shipment Tests', () => {

    before(() => {
        cy.login(loginData.email, loginData.password);
    });
    it('Generate Forward Air label', () => {
        //No need to navigate to shipment page as default page is shipment page after login
         //Click on the create shipment button
         shipmentObj.clickCreateShipment();
         //Click on shipment type
         shipmentObj.clickShipmentType();
 
         shipmentObj.selectShipmentStatus(
             shipmentData.deliveryShipmentStatus);
         shipmentObj.selectOrganization();
         shipmentObj.enterForwarderDetails(
             shipmentData.forwarder,shipmentData.forwarderPRONumber);
 
         shipmentObj.handleRecoveryContactOption(
             shipmentData.recoveryOption,
             shipmentData.recoverySearchName,
             shipmentData.shipperInformation.locationName,
             shipmentData.shipperInformation.addressLine1,
             shipmentData.shipperInformation.city,
             shipmentData.shipperInformation.state,
             shipmentData.shipperInformation.zip);
 
         shipmentObj.handleconsigneeContactOption(
             consigneeData.consigneeOption, 
             consigneeData.consigneeInformation.searchName,
             consigneeData.consigneeInformation.locationName,
             consigneeData.consigneeInformation.addressLine1,
             consigneeData.consigneeInformation.addressLine2,
             consigneeData.consigneeInformation.city,
             consigneeData.consigneeInformation.state,
             consigneeData.consigneeInformation.zip);
 
         shipmentObj.enterProviderInformation(
             providerDetailsData.readyDate,
             providerDetailsData.readyTime,
             providerDetailsData.deliveryDate,
             providerDetailsData.deliveryTime);
 
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
         generateForwardAirLabelObj.generateLabel();
         generateForwardAirLabelObj.enterOrigin();
         generateForwardAirLabelObj.enterDestination();
         generateForwardAirLabelObj.enterTotalPieces();
         generateForwardAirLabelObj.clickGenerateLabelBtn();
         generateForwardAirLabelObj.verifyThelabel();
         generateForwardAirLabelObj.closeLabelPopUp();
         shipmentObj.clickOnEllipsisButtonAtIndex(0);
         shipmentObj.clickOnDeleteShipment();
    
    });
});