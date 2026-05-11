import {Given, When, Then} from '@badeball/cypress-cucumber-preprocessor';
import POLogin from '../pageObjects/POLogin.js';

let poLogin = new POLogin();

Given('I visit the login page', () => {
    poLogin.visitLoginPage();
});

When('I fill in the valid username: {string} and password: {string}', (username, password) => {
    poLogin.setUsernameAndPassword(username, password);
});

When('I click the login button', () => {
    poLogin.clickLoginButton();
    
});

When('I fill in the invalid username: {string} and password: {string}', (username, password) => {
    poLogin.setUsernameAndPassword(username, password);
});

When('I leave the username empty and fill the password: {string}', (password) => {
    poLogin.setUsernameAndPassword('', password);
});

When('I fill the username: {string} and leave the password empty', (username) => {
    poLogin.setUsernameAndPassword(username, '');
});

When('I click the register link', () => {
    poLogin.clickRegisterLink();
});

When('I click the logout button', () => {
    poLogin.clickLogoutButton();
});

Then('I should be logged in', () => {
    poLogin.validateLoginSuccess();
});

Then('I should not be logged in', () => {
    poLogin.validateLoginFailure();
});

Then('I should see a login error message', () => {
    poLogin.validateErrorMessage();
});

Then('I should be on the register page', () => {
    cy.url().should('include', '/registro');
});

Then('I should be logged out', () => {
    poLogin.validateLogoutSuccess();
});


