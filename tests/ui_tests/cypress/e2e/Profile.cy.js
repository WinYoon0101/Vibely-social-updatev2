describe("Test Profile", () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('onLoad is not a function')) {
            return false;
        }
        return true;
    });

    before("Create access token", () => {
        cy.login();
    });

    beforeEach(() => {
        const token = Cypress.env('authToken');
        cy.setCookie('accessToken', token);

        cy.intercept('GET', '**/user-profile/**').as('profileLoad');
    });

    it("Profile", () => {
        cy.visit('http://localhost:3000/user-profile/67c4fdc08014cf4f8bb70cd4', {
            timeout: 30000
        });

        cy.wait('@profileLoad');
        cy.wait(3000);

        cy.get('body').should('be.visible');

        cy.get('button.edit-bio').click();
        cy.get('textarea.add-bio').type('Võ Nhất Phương sinh viên năm 3 tại trường Đại học Công nghệ thông tin');
        cy.get('button.save-bio').click();
        cy.wait(2000);


        const TabsTriggers = ['Bài viết', 'Hình ảnh', 'Video', 'Bạn bè', 'Tài liệu'];
        const TabsSelectors = ['.post-tab', '.image-tab', '.video-tab', '.friend-tab', '.document-tab'];

        cy.get(TabsSelectors[0]).should('be.visible');

        TabsTriggers.forEach((trigger, index) => {
            cy.get(TabsSelectors[index])
                .should('be.visible')
                .click();
            cy.wait(1000);
        });

        cy.get('button.edit-profile').click();


        cy.url().should('eq', 'http://localhost:3000/help-center');
    });
})