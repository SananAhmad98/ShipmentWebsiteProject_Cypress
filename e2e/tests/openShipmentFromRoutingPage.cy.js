import loginData from "../../fixtures/loginData.json";
import { openShipmentFromRoutingPage } from "../../pages/openShipmentFromRoutingPage";

const openShipObj = new openShipmentFromRoutingPage();


describe('Shipment Tests', () => {

    before(() => {
        cy.login(loginData.email, loginData.password);
    });
    it('Should Open Shipment From Routing page by Clicking Refrence Number', () => {
        
        openShipObj.navigateToROutingPage();
        openShipObj.saveFirstRecordRefrenceNumber();
        openShipObj.clickFirstRecordRefrenceNumber();
        openShipObj.assertViewShipment();
    });
});