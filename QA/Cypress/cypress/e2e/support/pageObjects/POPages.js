export class POPages {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
        this.loginPage = '/login';
        this.dashboardPage = '/dashboard';
        this.registerPage = '/#/registro';
        this.ProntuarioPage = '/prontuario';
        this.PacienteDetailPage = '/paciente/detalhe';
    }
    
    visitLoginPage() {
        cy.visit(this.baseUrl + this.loginPage);

    }
    visitDashboardPage() {
        cy.visit(this.baseUrl + this.dashboardPage);
    }       
    visitRegisterPage() {
        cy.visit(this.baseUrl + this.registerPage).wait(1000);
    }
    visitProntuarioPage() {
        cy.visit(this.baseUrl + this.ProntuarioPage);
    }
    visitPacientePage() {
        cy.visit(this.baseUrl + this.PacienteDetailPage);
    }
    waitLoading() {
        return this.waitForElementToBeNotVisible('.circle-clipper');
    }
    waitForElementToBbeVisible(element) {
        cy.get('.preloader-wrapper').wait(1000).should('not.exist');
    }
    waitForElementToExist(element) {
        return cy.get(element).wait(1000).should('exist');
    }
    waitForElementToNotExist(element) {
        return cy.get(element).should('not.exist');
    }
    waitForElementToBeVisible(element) {
        return cy.get(element).should('be.visible');
    }
    waitForElementToBeNotVisible(element) {
        return cy.get(element).wait(1000).should('not.be.visible');
    }
}


