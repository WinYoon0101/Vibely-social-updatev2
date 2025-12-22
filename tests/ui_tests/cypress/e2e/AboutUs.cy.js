/// <reference types="cypress" />
describe("Test AboutUs", () => {
    before("Create access token", () => {
        cy.login();
    });
    it("AboutUs", () => {
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
                cy.contains('Về chúng tôi').click();
            });

        cy.wait(10000);

        cy.url().should('include', '/about-us');
        cy.scrollTo('bottom', { ensureScrollable: false });

    });
})