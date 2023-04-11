describe("template spec", () => {
  it("loads homepage with mock response", () => {
    // intercept is only caught if service worker doesn't get the request
    // first, i.e. service-worker -> intercept -> server
    // currently intercepting all routes. Should be more specific?
    // TODO: turn this into a cypress command for better ergonomics
    cy.intercept({ method: "GET", url: "*" }, (req) => {
      console.log("cypress intercepted", req.url);
      req.headers["x-mock"] = "true";
      req.continue();
    });
    cy.visit("http://localhost:3000");

    // verify pokemon that show up are from mocked data
    cy.get('[data-test-id="pokemon-display"')
      .should("have.length", 4)
      .then((subject) => {
        cy.wrap(subject[0]).within(() => {
          cy.contains("mike");
        });
        cy.wrap(subject[1]).within(() => {
          cy.contains("alex");
        });
        cy.wrap(subject[2]).within(() => {
          cy.contains("lily");
        });
        cy.wrap(subject[3]).within(() => {
          cy.contains("larry");
        });
      });

    // how does client side routing affect this?
    // uncomment this to navigate via client side routing
    // TODO - our sw handler is catching the id requests but `x-mock` is not set
    // as the sw is getting the request before cy.intercept
    // cy.get("a").click();
  });

  it("loads homepage with actual response", () => {
    cy.visit("http://localhost:3000");

    // verify pokemon are from actual request
    cy.get('[data-test-id="pokemon-display"')
      .should("have.length", 20)
      .then((subject) => {
        cy.wrap(subject[0]).within(() => {
          cy.contains("bulbasaur");
        });
        cy.wrap(subject[1]).within(() => {
          cy.contains("ivysaur");
        });
        cy.wrap(subject[2]).within(() => {
          cy.contains("venusaur");
        });
        cy.wrap(subject[3]).within(() => {
          cy.contains("charmander");
        });
      });
  });
});
