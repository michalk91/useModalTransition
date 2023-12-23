/// <reference types="cypress" />
///
// ***********************************************
// This example commands.ts shows you how to
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
//
Cypress.Commands.add("getDimensions", (elemID) => {
  cy.get(elemID).then(($el) => {
    const rect = $el[0].getBoundingClientRect();
    const elHeight = rect.height;
    const elWidth = rect.width;

    return { elHeight, elWidth };
  });
});

Cypress.Commands.add("imgLoaded", (elemID) => {
  cy.get(elemID)
    .should("be.visible")
    .and("have.prop", "naturalWidth")
    .should("be.greaterThan", 0);
});

declare global {
  namespace Cypress {
    interface Chainable {
      getDimensions(elemID: string): Promise<any>;
      imgLoaded(elemID: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
export {};
