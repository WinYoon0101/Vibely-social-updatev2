/// <reference types="cypress" />
describe("Test HelpCenter", () => {
    before("Create access token", () => {
        cy.login();
    });
    it("HelpCenter", () => {
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
                cy.contains('Trung tâm trợ giúp').click();
            });

        cy.url().should('include', '/help-center');

        cy.contains('Cách tạo tài khoản').click({ force: true });
        cy.wait(1500);
        cy.contains('Tạo tài khoản Vibely?').click({ force: true });
        cy.wait(1500);
        cy.contains('Tại sao lại yêu cầu tôi thêm email của mình?').click({ force: true });
        cy.wait(1500);
        cy.contains('Hoàn tất quá trình tạo tài khoản Vibely và xác nhận email').click({ force: true });
        cy.wait(1500);
        cy.contains('Tìm email xác nhận đăng ký Vibely').click({ force: true });
        cy.wait(1500);

        cy.contains('Kết bạn').click({ force: true });
        cy.wait(1500);
        cy.contains('Tìm và thêm bạn bè trên Vibely').click({ force: true });
        cy.wait(1500);

        cy.contains('Đăng nhập và mật khẩu').click({ force: true });
        cy.wait(1500);
        cy.contains('Đăng nhập tài khoản Vibely?').click({ force: true });
        cy.wait(1500);
        cy.contains('Đăng xuất khỏi Vibely?').click({ force: true });
        cy.wait(1500);
        cy.contains('Đổi mật khẩu Vibely').click({ force: true });
    });
})