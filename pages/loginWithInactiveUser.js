export class inactiveUserLogin{

    weblocators = {
      settingButton:'button.main-nav--item-block:contains("Settings")',
      userButton:'a.main-nav--item-block-menu--item',
      addUserButton:'a.button--primary',
      emailInput:'input#email',
      passwordInput:'input#password',
      firstNameInput:'input#firstName',
      lastNameInput:'input#lastName',
      comboBoxButton:'button#headlessui-combobox-button-4',
      statusOptionInput:'input[role="combobox"]',
      statusOptionSelection:'headlessui-combobox-options-22',
      orgToggle:'button.combobox--toggle',
      orgInputPlaceHolder:'input[placeholder="Select one or more organizations..."]',
      orgRoleInput:'input[placeholder="Select a role..."]',
      orgRoleSelection:'ul.selection-list li .combobox',
      orgRoleList:'ul[role="listbox"] li',
      createButton:'button.button--primary',
      ToastBody:'[data-testid="toast-body"]'

    }

    navigateToUserCreationPage()
    {
       cy.wait(5000);
        cy.get(this.weblocators.settingButton).click();
        cy.wait(2000);
        cy.get(this.weblocators.userButton).should('be.visible');
        cy.get(this.weblocators.userButton).contains('Users').click();
        cy.wait(6000);
        cy.url().should('include', '/admin/users');
    }

    generateRandomEmail() {
        const randomString = Math.random().toString(36).substring(2, 10); // Generates a random string
        return `${randomString}@test.com`; // Combines with a domain to create an email
      }
    addNewInactiveUser(email,password,first,last)
    {
        // Click the Add user button on the Users page
        cy.wait(5000);
        cy.get(this.weblocators.addUserButton).should('be.visible');    
        cy.get(this.weblocators.addUserButton).contains('Add user').click().wait(4000);
        cy.url().should('include', '/admin/users/add');
        cy.get(this.weblocators.emailInput).type(email);
        cy.get(this.weblocators.passwordInput).type(password);
        cy.get(this.weblocators.firstNameInput).type(first);
        cy.get(this.weblocators.lastNameInput).type(last);
        cy.wait(4000);
        //select Status
        cy.get('.combobox', { timeout: 10000 }) 
        .should('be.visible') .first().find(this.weblocators.statusOptionInput)
        .clear().type('Inactive') .should('have.value', 'Inactive'); 
         
         // Select the dropdown options container
        cy.get('.combobox--options', { timeout: 10000 })
        .should('be.visible').find('li').should('have.length.greaterThan', 0) .eq(0).click();
        
        //Org Set
        cy.get('.input-group')
        .contains('label', 'Organizations')
        .parent() 
        .within(() => {
        // Find and click the button to open the dropdown if necessary
        cy.get(this.weblocators.orgToggle)
          .should('be.visible')
          .click(); // Open dropdown

        // Now locate the input by its placeholder, increasing timeout to ensure visibility
        cy.get(this.weblocators.orgInputPlaceHolder, { timeout: 10000 })
          .should('be.visible').click().type('Demo'); // Optional: verify input value
      });

      cy.get('.combobox--options', { timeout: 10000 })
        .should('be.visible').find('li').should('have.length.greaterThan', 0) .eq(0).click();

      // Target the combobox input field using a combination of selectors
        cy.get(this.weblocators.orgRoleSelection) 
        .within(() => {
        // Type "Admin" into the input field
        cy.get(this.weblocators.orgRoleInput).clear().type('Admin', { force: true }); 
        cy.get(this.weblocators.orgRoleList).contains('Admin')  .click({ force: true }); 
        });
        cy.get(this.weblocators.createButton).contains('+ Create').click().wait(3000);

        // Assert that the toast message text is as expected
        cy.get('.Toastify__toast-container').should('be.visible')
        .within(() => {
         cy.get(this.weblocators.ToastBody)
      .should('contain.text', 'Contact Successfully Updated');
  });


    }

    assertInactiveLoginUser(email,password)
    {
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.reload({ forceReload: true }); // For a full reload from the server
        cy.inactiveUserlogin(email,password);
    }

    
}
