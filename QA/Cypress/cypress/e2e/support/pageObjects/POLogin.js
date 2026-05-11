const { POPages } = require("./POPages.js");

export class LoginPage extends POPages {
    constructor() {
        super();

        this.url = '/login';
        this.usernameInput = 'label[for=usuario]';
        this.passwordInput = 'label[for=senha]';
        this.loginButton = '#login-button';
        this.registerLink = 'a[href="#/registro"]';
        this.errorMessage = '#toast-container .red';
        this.logoutButton = '#logout-btn';
    }
    visitLogin() {
        cy.visit(this.url);
    }
    
    setUsernameAndPassword(username, password) {
        if (username) cy.get(this.usernameInput).type(username);
        if (password) cy.get(this.passwordInput).type(password);
    }
    clickLoginButton() {
        cy.get(this.loginButton).click();
    }
    clickRegisterLink() {
        cy.get(this.registerLink).click();
    }
    clickLogoutButton() {
        cy.get(this.logoutButton).click();
    }
    validateLoginSuccess() {
        cy.url().should('include', '/dashboard');
        cy.get('.header').should('contain', 'Dashboard');
        cy.get(this.logoutButton).contains('Sair').should('be.visible');
    }
    validateLoginFailure() {
        cy.url().should('include', '/login');
    }
    validateErrorMessage() {
        cy.get(this.errorMessage).should('be.visible');
    }
    validateLogoutSuccess() {
        cy.url().should('include', '/login');
    }
    login(username, password) {
        this.setUsernameAndPassword(username, password);
        this.clickLoginButton();
    }
}

export default LoginPage;
