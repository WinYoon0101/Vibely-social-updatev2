describe("Test Homepage", () => {
    before("Create access token", () => {
        cy.login();
    });
    it("Homepage", () => {
        const token = Cypress.env('authToken');
        cy.setCookie('accessToken', token);

        cy.visit('http://localhost:3000');
        cy.get('body').should('be.visible');

        cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000');
        cy.scrollTo('bottom', { ensureScrollable: false });
    });
})