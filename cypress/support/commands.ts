import { resourceToMockMap } from "../../src/mocks/handlers";
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
  // TODO: currently intercepting all routes. Should be more specific? Maybe just to localhost/app domain?
  // add header to requests to server for server side api mocking
  cy.intercept({ method: "GET", url: "*" }, (req) => {
    req.headers["x-mock"] = "true";
    req.headers["x-cypress-file"] = Cypress.spec.relative; //'file'
    req.headers["x-cypress-test"] = Cypress.currentTest.titlePath.join(" ");
    req.continue();
  });

  // used for mocking client side api calls
  Object.entries(resourceToMockMap).forEach(([key, value]) => {
    // TODO add http method?
    cy.intercept({ method: "GET", url: value.urlPattern }, (req) => {
      console.log(`intercepted ${key}, returning mocked response`);

      // dont call cy.request cuz you get the promise within a promise thing
      // trace intercept call
      fetch("http://localhost:4000/trace", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "client",
          testFile: Cypress.spec.relative,
          // TODO: clean test title string
          testTitle: Cypress.currentTest.titlePath.join(" "),
          url: req.url,
        }),
      });

      req.reply(value.payload);
    });
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * mock but client and server calls for these tests
       */
      mock(): Chainable;
    }
  }
}

// SMH https://stackoverflow.com/a/59499895
export {};
