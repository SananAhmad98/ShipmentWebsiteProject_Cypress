import { quotes } from "../../pages/deliveryQuotes";
import { pickupQuote } from "../../pages/pickupQuote";
import { directDeliveryQuote } from "../../pages/directDeliveryQuote";
import loginData from "../../fixtures/loginData.json";
import quoteData from "../../fixtures/quoteData.json"

const quoteObj = new quotes()
const pickupQuoteObj = new pickupQuote()
const directDeliveryQuoteObj = new directDeliveryQuote()

describe('Create Quote Tests', () => {

    beforeEach(() => {
        cy.clearLocalStorage();
        //cy.clearSessionStorage();
        cy.clearCookies();
        cy.reload({ forceReload: true }); // For a full reload from the server
        cy.login(loginData.email, loginData.password);
    });

    it('Should create a new quote with type Delivery', { tags: ['Delivery'] }, () => {
        quoteObj.clickQuotesRouter();

        quoteObj.quoteDetails(
            quoteData.deliveryQuote.designationType,
            quoteData.deliveryQuote.date,
            quoteData.deliveryQuote.forwarder,
            quoteData.deliveryQuote.dropOffZipCode,
            quoteData.deliveryQuote.dropoffZone);

        quoteObj.typeIntoCombobox(
            quoteData.deliveryQuote.expectedOptions,
            quoteData.deliveryQuote.containOptions);

        quoteObj.freightDetails(
            quoteData.deliveryQuote.freightPieces,
            quoteData.deliveryQuote.freightWeightInLBS,
            quoteData.deliveryQuote.freightWeightMethod);

        quoteObj.getQuotePriceandSave();
        quoteObj.assertToastNotification();
        //quoteObj.searchQuoteByRefNo();
    });

    it('Should create a new quote with type Pickup', { tags: ['Pickup'] }, () => {
        pickupQuoteObj.clickQuotesRouter();

        pickupQuoteObj.quoteDetails(
            quoteData.pickupQuote.designationType,
            quoteData.pickupQuote.date,
            quoteData.pickupQuote.forwarder,
            quoteData.pickupQuote.pickupZipCode,
            quoteData.pickupQuote.pickupZone);

        pickupQuoteObj.typeIntoCombobox(
            quoteData.pickupQuote.expectedOptions,
            quoteData.pickupQuote.containOptions);

        pickupQuoteObj.freightDetails(
            quoteData.pickupQuote.freightPieces,
            quoteData.pickupQuote.freightWeightInLBS,
            quoteData.pickupQuote.freightWeightMethod);

        pickupQuoteObj.getQuotePriceandSave();
        pickupQuoteObj.assertToastNotification();
        //pickupQuoteObj.searchQuoteByRefNo();
    });

    it('Should create a new quote with type Direct Delivery', { tags: ['DirectDelivery'] }, () => {
        directDeliveryQuoteObj.clickQuotesRouter();

        directDeliveryQuoteObj.quoteDetails(
            quoteData.directDeliveryQuote.designationType,
            quoteData.directDeliveryQuote.date,
            quoteData.directDeliveryQuote.forwarder,
            quoteData.directDeliveryQuote.pickupZipCode,
            quoteData.directDeliveryQuote.pickupZone, 
            quoteData.directDeliveryQuote.dropOffZipCode,
            quoteData.directDeliveryQuote.dropoffZone);

        directDeliveryQuoteObj.typeIntoCombobox(
            quoteData.directDeliveryQuote.expectedOptions,
            quoteData.directDeliveryQuote.containOptions);

        directDeliveryQuoteObj.freightDetails(
            quoteData.directDeliveryQuote.freightPieces,
            quoteData.directDeliveryQuote.freightWeightInLBS,
            quoteData.directDeliveryQuote.freightWeightMethod);

        directDeliveryQuoteObj.getQuotePriceandSave();
        directDeliveryQuoteObj.assertToastNotification();
        //pickupQuoteObj.searchQuoteByRefNo();
    });
});
