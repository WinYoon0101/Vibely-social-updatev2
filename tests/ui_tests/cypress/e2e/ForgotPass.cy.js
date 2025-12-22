describe('Test ForgotPass', () => {
  it('ForgotPass', () => {
    cy.visit('http://localhost:3000/user-login');

    cy.contains('a', 'Quên mật khẩu')
      .should('be.visible')
      .click();

    cy.url().should('include', '/forgot-password');
  });
});
