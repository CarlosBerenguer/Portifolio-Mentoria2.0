const { POPages } = require("./POPages.js");

export class RegisterPage extends POPages {
    constructor() {
        super();

        this.url = '/#/registro';
        this.pageTitle = 'Registro';
        this.titleElement = 'h5.center-align';
        this.fullNameInput = 'label[for="nome_completo"]';
        this.cpfInput = 'label[for="cpf"]';
        this.crpInput = 'label[for="crp"]';
        this.birthDateInput = 'label[for="data_nascimento"]';
        this.phoneInput = 'label[for="telefone"]';
        this.emailInput = 'label[for="email"]';
        this.usernameInput = 'label[for="usuario"]';
        this.passwordInput = 'label[for="senha"]';
        this.confirmPasswordInput = 'label[for="confirmar_senha"]';
        this.registerButton = '#registro-button';
        this.errorMessage = '#toast-container .red';
        this.successMessage = '#toast-container .green';
    }
    
    setFullName(fullName) {
        cy.get(this.fullNameInput).type(fullName);
    }
    setCpf(cpf) {
        cy.get(this.cpfInput).type(cpf);    
    }
    setCrp(crp) {
        cy.get(this.crpInput).type(crp);
    }

    setBirthDate(birthDate) {
        cy.get(this.birthDateInput).type(birthDate);
    }
    setPhone(phone) {
        cy.get(this.phoneInput).type(phone);
    }
    setEmail(email) {
        cy.get(this.emailInput).type(email);
    }
    setUsername(username) {
        cy.get(this.usernameInput).type(username);
    }
    setPassword(password) {
        cy.get(this.passwordInput).type(password);   
    }
    setConfirmPassword(confirmPassword) {
        cy.get(this.confirmPasswordInput).type(confirmPassword);
    }
    clickRegisterButton() {
        cy.get(this.registerButton).click();
    }
    validateErrorMessage() {
        cy.get(this.errorMessage).should('be.visible');
    }
    validateSuccessMessage() {
        cy.get(this.successMessage).should('be.visible');
    }
    
    fillUsernameAndPassword(username, password) {
        cy.get(this.usernameInput).type(username);
        cy.get(this.passwordInput).type(password);
    }
    clickLoginButton() {
        cy.get(this.loginButton).click();
    }
    validateLoginSuccess() {
        cy.url().should('include', '/dashboard');
        //cy.get('.header').should('contain', 'Dashboard');
        cy.get('#logout-btn').contains('Sair').should('be.visible');
    }
    validateLoginFailure() {
        cy.url().should('include', '/login');
    }
    login(username, password) {
        this.fillUsernameAndPassword(username, password);
        cy.get(this.loginButton).click();
    }
}

export default RegisterPage;
