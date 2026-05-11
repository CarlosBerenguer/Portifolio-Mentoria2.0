import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { RegisterPage } from '../pageObjects/PORegister.js';

let poRegister = new RegisterPage();

Given('I visit the register page', () => {
    poRegister.visitRegisterPage();
});

When('I fill in register fields Random username and password: {string} and confirm password: {string}', (password, confirmPassword) => {
    // Fill in the fields Username e Password with random data
    cy.generateUniqueString(5).then((username) => {
        poRegister.setUsername(username);
    });
    poRegister.setPassword(password);
    poRegister.setConfirmPassword(confirmPassword);
});

When('I fill in register fields invalid Random username and password: {string} and confirm password: {string}', (password, confirmPassword) => {
    // Fill in the fields Username e Password with random data
    cy.generateUniqueString(5).then((username) => {
        poRegister.setUsername(username);
    });
    poRegister.setPassword(password);
    poRegister.setConfirmPassword(confirmPassword);
});

When('I fill in a Random Full Name, Email, Password, Birth Date, Phone Number, CRP, CPF', () => {
    cy.generateUniqueString(5).then((fullName) => {
        poRegister.setFullName(fullName);
    });
    cy.generateRandomCPF().then((cpf) => {
        poRegister.setCpf(cpf);
    });
    //cy.generateRandomBirthDate().then((birthDate) => {
    poRegister.setBirthDate("01/01/1991");
    //});
    cy.generateRandomCRP(7).then((crp) => {
        poRegister.setCrp(crp);
    });
    cy.generateUniqueString(5).then((emailPrefix) => {
        poRegister.setEmail(emailPrefix + '@email.com');
    });
    cy.generateRandomPhoneNumber().then((phone) => {
        poRegister.setPhone(phone);
    });
    cy.generateUniqueString(5).then((username) => {
        poRegister.setUsername(username);
    });
    cy.generateUniqueString(5).then((password) => {
        poRegister.setPassword(password);
        poRegister.setConfirmPassword(password);
    });
});

When('I fill in a Invalid Full Name, Email, Password, Birth Date, Phone Number, CRP, CPF', () => {
    poRegister.setFullName("!@#$%¨&*");
    poRegister.setCpf("10112072658");
    poRegister.setBirthDate("01/13/1991");
    poRegister.setCrp("1234561");
    poRegister.setEmail('fulano@gmail.com');
    poRegister.setPhone("11111111111");
});

When('I click the register button', () => {
    poRegister.clickRegisterButton();
});

Then('I should be registered', () => {
    poRegister.validateSuccessMessage();
});

Then('I should see error message', () => {
    poRegister.validateErrorMessage();
});