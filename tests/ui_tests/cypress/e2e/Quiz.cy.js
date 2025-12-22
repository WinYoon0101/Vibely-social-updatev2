describe("Test Quiz", () => {
    before("Create access token", () => {
        cy.login();
    });
    it("Quiz", () => {
        const token = Cypress.env('authToken');
        cy.setCookie('accessToken', token);

        cy.visit('http://localhost:3000/quiz');
        cy.get('body').should('be.visible');

        cy.url({ timeout: 10000 }).should('eq', 'http://localhost:3000/quiz');
    });
})