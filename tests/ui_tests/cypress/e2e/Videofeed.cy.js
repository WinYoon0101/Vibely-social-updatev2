describe("Test Video Feed", () => {
    before("Create access token", () => {
        cy.login();
    });
    it("Video-feed", () => {
        const token = Cypress.env('authToken');
        cy.setCookie('accessToken', token);

        cy.visit('http://localhost:3000/video-feed');
        cy.get('body').should('be.visible');

        cy.url({ timeout: 10000 }).should('eq', 'http://localhost:3000/video-feed');
        cy.scrollTo('bottom', { ensureScrollable: false });
    });
})