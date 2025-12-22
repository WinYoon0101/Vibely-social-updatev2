/// <reference types="cypress" />
describe("Test Logout", () => {
    before("Create access token", () => {
        cy.login();
    });

    it("Logout", () => {
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
                cy.contains('Đăng xuất').click();
            });

        cy.wait(6000);

        cy.url().should('include', '/user-login');

        cy.get('input[type="email"]').should('be.visible');
        cy.get('input[type="password"]').should('be.visible');
        cy.get('button[type="submit"]').should('be.visible');
    });
});