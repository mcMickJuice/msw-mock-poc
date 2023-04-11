import { mockMap } from "../../src/mocks/handlers";
// / <reference types="cypress" />
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
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

// intercept is only caught if service worker doesn't get the request
// first, i.e. service-worker -> intercept -> server
Cypress.Commands.add("mock", () => {
  // TODO: currently intercepting all routes. Should be more specific?
  cy.intercept({ method: "GET", url: "*" }, (req) => {
    req.headers["x-mock"] = "true";
    req.continue();
  });

  Object.entries(mockMap).forEach(([key, value]) => {
    // TODO add method?
    cy.intercept({ method: "GET", url: value.urlPattern }, (req) => {
      console.log(`intercepted ${key}, returning mocked response`);

      req.reply(value.payload);
    });
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      // login(email: string, password: string): Chainable<void>
      mock(): Chainable;
      // dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      // visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}

// SMH https://stackoverflow.com/a/59499895
export {};
