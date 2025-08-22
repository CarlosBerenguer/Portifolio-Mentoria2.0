const { POPages } = require("./POPages.js");

export class LoginPage extends POPages {
    constructor() {
        super();

        this.url = '/login';
        this.usernameInput = 'label[for=usuario]';
        this.passwordInput = 'label[for=senha]';
        this.loginButton = '#login-button';
    }
    visitLogin() {
        cy.visit(this.url);
    }
    
    setUsernameAndPassword(username, password) {
        cy.get(this.usernameInput).type(username);
        cy.get(this.passwordInput).type(password);
    }
    clickLoginButton() {
        cy.get(this.loginButton).click();
    }
    validateLoginSuccess() {
        cy.url().should('include', '/dashboard');
        cy.get('.header').should('contain', 'Dashboard');
        cy.get('#logout-btn').contains('Sair').should('be.visible');
    }
    validateLoginFailure() {
        cy.url().should('include', '/login');
    }
    login(username, password) {
        this.setUsernameAndPassword(username, password);
        this.clickLoginButton();
    }
}

export default LoginPage;
