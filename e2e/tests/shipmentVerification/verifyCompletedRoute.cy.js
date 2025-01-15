import { verifyCompletedRoute } from "../../../pages/verifyCompletedRoute";
import loginData from "../../../fixtures/loginData.json";
import accessorialData from "../../../results/accessorialData.json"

const completedRoute = new verifyCompletedRoute();

describe('Shipment Tests', () => {

    before(() => {
        cy.login(loginData.email, loginData.password);
    });

    it('Should Verify A Completed Route', () => {
        completedRoute.searchShipmentByRefNo();
        completedRoute.viewShipmentDetails();
        completedRoute.verifyToggleButtons(accessorialData.toggleButtonsSet);
        completedRoute.verifyShipmentAttachments();
    })

});