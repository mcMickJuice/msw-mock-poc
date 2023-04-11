describe("template spec", () => {
  it("loads homepage with mock response", () => {
    cy.mock();
    cy.visit("http://localhost:3000");

    // verify pokemon that show up are from mocked data
    function verifyStubbedData() {
      cy.get('[data-test-id="pokemon-display"')
        .should("have.length", 4)
        .then((subject) => {
          cy.wrap(subject[0]).within(() => {
            cy.contains("mike");
            cy.get("img").should(
              "have.attr",
              "src",
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
            );
          });
          cy.wrap(subject[1]).within(() => {
            cy.contains("alex");
            cy.get("img").should(
              "have.attr",
              "src",
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
            );
          });
          cy.wrap(subject[2]).within(() => {
            cy.contains("lily");
            cy.get("img").should(
              "have.attr",
              "src",
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
            );
          });
          cy.wrap(subject[3]).within(() => {
            cy.contains("larry");
            cy.get("img").should(
              "have.attr",
              "src",
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
            );
          });
        });
    }
    verifyStubbedData();

    // how does client side routing affect this?
    // uncomment this to navigate via client side routing
    // TODO - our sw handler is catching the id requests but `x-mock` is not set
    // as the sw is getting the request before cy.intercept
    cy.get("a").click();
    verifyStubbedData();
  });

  it("loads homepage with actual response", () => {
    cy.visit("http://localhost:3000");

    // verify pokemon are from actual request
    function verifyRealData() {
      cy.get('[data-test-id="pokemon-display"')
        .should("have.length", 20)
        .then((subject) => {
          cy.wrap(subject[0]).within(() => {
            cy.contains("bulbasaur");
            cy.get("img").should(
              "have.attr",
              "src",
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"
            );
          });
          cy.wrap(subject[1]).within(() => {
            cy.contains("ivysaur");
            cy.get("img").should(
              "have.attr",
              "src",
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png"
            );
          });
          cy.wrap(subject[2]).within(() => {
            cy.contains("venusaur");
            cy.get("img").should(
              "have.attr",
              "src",
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png"
            );
          });
          cy.wrap(subject[3]).within(() => {
            cy.contains("charmander");
            cy.get("img").should(
              "have.attr",
              "src",
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"
            );
          });
        });
    }
    verifyRealData();
    cy.get("a").click();
    verifyRealData();
  });
});
