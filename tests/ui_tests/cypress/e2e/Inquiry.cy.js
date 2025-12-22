/// <reference types="cypress" />
describe("Test Inquiry", () => {
    before("Create access token", () => {
        cy.login();
    });
    it("Inquiry", () => {
        const token = Cypress.env('authToken');
        cy.setCookie('accessToken', token);

        cy.visit('http://localhost:3000');

        cy.get('body').should('be.visible');

        cy.get('.profile-button')
            .should('be.visible')
            .within(() => {
                cy.get('img[alt]').should('exist');
            })
            .click();

        cy.get('[role="menu"]')
            .should('be.visible')
            .within(() => {
                cy.contains('Hộp thư hỗ trợ').click();
            });

        cy.url().should('include', '/support');
    });
})