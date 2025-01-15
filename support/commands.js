// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-drag-drop';

Cypress.Commands.add('login', (email, password) => {
  cy.visit(Cypress.env('URL'), { failOnStatusCode: false });

  console.log('Logging in with:', email);

  cy.get('#email', { timeout: 10000 }).should('be.visible').type(email);

  // Type password after #email is typed
  cy.get('#password').should('be.visible').type(password);

  // Click login button after #password is typed
  cy.get('.button--primary').should('be.visible').click();

  cy.url().then(url => {
    console.log('Current URL after login:', url);
  });

  cy.url({ timeout: 100000 }).should('include', '/shipments?filter=%255B%255D&page=1');
});

// Login Command For Local admin User

Cypress.Commands.add('localAdminLogin', (localAdminEmail, localAdminPassword) => {
  cy.visit(Cypress.env('URL'), { failOnStatusCode: false });

  console.log('Logging in with:', localAdminEmail);

  cy.get('#email', { timeout: 10000 }).should('be.visible').type(localAdminEmail);

  // Type password after #email is typed
  cy.get('#password').should('be.visible').type(localAdminPassword);

  // Click login button after #password is typed
  cy.get('.button--primary').should('be.visible').click();

  cy.url().then(url => {
    console.log('Current URL after login:', url);
  });

  cy.url({ timeout: 100000 }).should('include', '/shipments?filter=%255B%255D&page=1');
});

Cypress.Commands.add('inactiveUserlogin', (email, password) => {
  cy.visit(Cypress.env('URL'), { failOnStatusCode: false });

  console.log('Logging in with:', email);

  cy.get('#email', { timeout: 10000 }).should('be.visible').type(email);

  // Type password after #email is typed
  cy.get('#password').should('be.visible').type(password);

  // Click login button after #password is typed
  cy.get('.button--primary').should('be.visible').click();

  cy.get('[data-testid^="toast-item"]').should('be.visible'); // Check if any toast is visible

    // Check for specific content in the toast
  cy.get('[data-testid^="toast-item"]').contains('User is banned').should('be.visible'); 
  cy.url({ timeout: 1000 }).should('include', '/log-in');
});

Cypress.Commands.add('getCurrentDateTimeInMST', (offsetHours = 0) => {
  const now = new Date();

  // Add the offset in hours to the current time
  now.setHours(now.getHours() + offsetHours);

  // Define the time zone for MST
  const optionsDate = {
    timeZone: 'America/Denver', // MST time zone
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  const optionsTime = {
    timeZone: 'America/Denver',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24-hour format
  };

  // Get date and time in MST
  const formatterDate = new Intl.DateTimeFormat('en-US', optionsDate);
  const formatterTime = new Intl.DateTimeFormat('en-US', optionsTime);

  const dateTimeInMST = {
    date: formatterDate.format(now),
    time: formatterTime.format(now)
  };

  // Format date and time as needed
  const [month, day, year] = dateTimeInMST.date.split('/');
  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = dateTimeInMST.time; // Time in 24-hour format

  return { formattedDate, formattedTime };
});

Cypress.Commands.add('getCurrentDateTimeInPKT', (offsetHours = 0, offsetDays = 0) => {
  const now = new Date();

  // Add offset days to the current date
  now.setDate(now.getDate() + offsetDays);

  // Add offset hours (converted to milliseconds) to the current time
  now.setTime(now.getTime() + offsetHours * 60 * 60 * 1000);

  // Define the time zone for PKT
  const optionsDate = {
    timeZone: 'Asia/Karachi', // PKT time zone
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  const optionsTime = {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24-hour format
  };

  // Get date and time in PKT
  const formatterDate = new Intl.DateTimeFormat('en-US', optionsDate);
  const formatterTime = new Intl.DateTimeFormat('en-US', optionsTime);

  const dateTimeInPKT = {
    date: formatterDate.format(now),
    time: formatterTime.format(now)
  };

  // Format date and time as needed
  const [month, day, year] = dateTimeInPKT.date.split('/');
  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = dateTimeInPKT.time; // Time in 24-hour format

  return { formattedDate, formattedTime };
});