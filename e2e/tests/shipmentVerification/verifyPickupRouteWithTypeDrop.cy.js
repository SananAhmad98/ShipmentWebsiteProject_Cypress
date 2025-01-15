import { verifyCompletedRoute } from "../../../pages/verifyCompletedRoute";
import loginData from "../../../fixtures/loginData.json";
import accessorialData from "../../../results/accessorialData.json"

const completedRoute = new verifyCompletedRoute();

describe('Shipment Tests', () => {

    before(() => {
        cy.login(loginData.email, loginData.password);
    });

    it('Should Verify A Completed Pickup Route With Status Tendered to Carrier', () => {
        completedRoute.searchShipmentByRefNo();
        completedRoute.verifyShipmentStatus();
        completedRoute.viewShipmentDetails();
        completedRoute.verifyToggleButtons(accessorialData.toggleButtonsSet);
        completedRoute.verifyShipmentAttachments();
    })

});