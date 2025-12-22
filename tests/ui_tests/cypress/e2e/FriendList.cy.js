describe("Test Friend List", () => {
    before("Create access token", () => {
        cy.login();
    });
    it("Friend List", () => {
        const token = Cypress.env('authToken');
        cy.setCookie('accessToken', token);

        cy.visit('http://localhost:3000/friends-list');
        cy.get('body').should('be.visible');

        cy.url({ timeout: 10000 }).should('eq', 'http://localhost:3000/friends-list');
        cy.scrollTo('bottom', { ensureScrollable: false });
    });
})