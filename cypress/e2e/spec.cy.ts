describe("template spec", () => {
  it("loads homepage", () => {
    cy.visit("http://localhost:3000");
  });

  it("navigates to other page", () => {
    cy.visit("http://localhost:3000");

    cy.get("a").contains("Go to Pokemon").click();
  });
});
