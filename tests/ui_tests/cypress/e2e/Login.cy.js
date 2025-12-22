describe('Test Login', () => {
  it('Login', () => {
    cy.visit('http://localhost:3000/user-login');

    cy.get('input[name="email"]').type('vonhatphuong.2k4@gmail.com');
    cy.get('input[name="password"]').type('13032004');
    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/user-login');
  });
});
