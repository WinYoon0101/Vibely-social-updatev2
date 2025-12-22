// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
/// <reference types="cypress" />
import 'cypress-localstorage-commands';
import 'cypress-file-upload';

Cypress.Commands.add('login', () => {
    cy.request({
        method: "POST",
        url: "https://vibely-study-social-web.onrender.com/auth/login",
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            "email": "vonhatphuong.2k4@gmail.com",
            "password": "13032004"
        }
    }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.have.property("token");
        Cypress.env('authToken', response.body.data.token);
    });
});