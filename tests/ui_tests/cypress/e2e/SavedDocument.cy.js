describe("Test Saved Document", () => {
    before("Create access token", () => {
        cy.login();
    });
    it("Saved Document", () => {
        const token = Cypress.env('authToken');
        cy.setCookie('accessToken', token);

        cy.visit('http://localhost:3000/saved');
        cy.get('body').should('be.visible');

        cy.url({ timeout: 10000 }).should('eq', 'http://localhost:3000/saved');
    });
})