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

Then('I should be logged in', () => {
    poLogin.validateLoginSuccess();
});

Then('I should not be logged in', () => {
    poLogin.validateLoginFailure();
});


