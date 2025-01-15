import loginData from "../../fixtures/loginData.json";
import { logout } from "../../pages/logout";
import { rearrangeShipmentPageColumns } from "../../pages/rearrangeShipmentPageColumns";

const reArrangeObj = new rearrangeShipmentPageColumns();
const logoutUsers = new  logout();
describe('Shipment Tests', () => {

    before(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.reload({ forceReload: true }); // For a full reload from the server
        cy.login(loginData.email, loginData.password);
    });

    it('Rearrange Shipment Page Columns', () => {
        //No need to navigate to shipment page as default page is shipment page after login

        reArrangeObj.clickColumnsButton();
        reArrangeObj.clickSortButtons();
        reArrangeObj.uncheckLastTwoColumns();
        reArrangeObj.verifyColumnsOrder();  //verification before logout
        reArrangeObj.verifyUncheckedColumns(); //verification before logout
        logoutUsers.logoutUser();
        cy.login(loginData.email, loginData.password);
        reArrangeObj.verifyColumnsOrder(); //verification after logout
        reArrangeObj.verifyUncheckedColumns(); //verification after logout
    });
});