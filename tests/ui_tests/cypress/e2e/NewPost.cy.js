import 'cypress-file-upload';
describe("Test NewPost", () => {
    before("Create access token", () => {
        cy.login();
    });

    it("New Post", () => {
        const token = Cypress.env('authToken');
        cy.setCookie('accessToken', token);

        cy.visit('http://localhost:3000');
        cy.get('body').should('be.visible');

        cy.get('input.new-post-input').click();
        cy.get('textarea.textarea-input-post').type('Học bài');

        cy.get('.input-new-file').attachFile('study.jpg');
        cy.wait(3000);
        cy.get('button').contains('Đăng').click();

    });
});
