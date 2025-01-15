import loginData from "../../fixtures/loginData.json";
import { inactiveUserLogin } from "../../pages/loginWithInactiveUser.js";

const inactiveUserObj = new inactiveUserLogin();


describe('User Related Tests', () => {

    before(() => {
        cy.login(loginData.email, loginData.password);
    });
    it('Inactive User should not be able to login', () => {
        
        inactiveUserObj.navigateToUserCreationPage();
        let randomEmail=inactiveUserObj.generateRandomEmail();
        inactiveUserObj.addNewInactiveUser(randomEmail,loginData.password,loginData.newUserFirst,loginData.newUserLast);
        inactiveUserObj.assertInactiveLoginUser(randomEmail,loginData.password);
    });
});