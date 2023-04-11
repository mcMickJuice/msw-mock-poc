describe("template spec", () => {
  it("passes", () => {
    // stub server side request. call this before the app loads to capture server side calls
    cy.visit("http://localhost:3000");
    cy.request("http://localhost:3000/api/mock", {
      url: "https://pokeapi.co/api/v2/pokemon",
      data: [],
    });

    // call this for client calls as mws is not on window yet
    cy.window().then((window: any) => {
      const { rest, worker } = window.msw;
      worker.use(
        rest.get(
          "https://pokeapi.co/api/v2/pokemon/3",
          async (req: any, res: any, ctx: any) => {
            return res(
              ctx.status(200),
              ctx.json({
                sprites: {
                  front_default:
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
                },
              })
            );
          }
        )
      );
    });

    cy.get("a").contains("Go to Pokemon").click();
  });
});
