describe("Test Calendar", () => {
    before("Create access token", () => {
        cy.login();
    });
    it("Calendar", () => {
        const token = Cypress.env('authToken');
        cy.setCookie('accessToken', token);

        cy.visit('http://localhost:3000/calendar');
        cy.get('body').should('be.visible');

        cy.url({ timeout: 10000 }).should('eq', 'http://localhost:3000/calendar');
    });
})