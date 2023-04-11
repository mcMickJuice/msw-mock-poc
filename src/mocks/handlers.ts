import { rest } from "msw";

export const handlers = [
  // // Uncomment to see requests mock at a global level
  rest.get("https://pokeapi.co/api/v2/pokemon", async (req, res, ctx) => {
    // console.log("get all pokemon", req.url);

    const mockHeader = req.headers.get("x-mock-header");

    if (mockHeader) {
      console.log("mocking https://pokeapi.co/api/v2/pokemon");
      return res(
        ctx.status(200),
        ctx.json({
          count: 1279,
          next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
          previous: null,
          results: [
            { name: "mike", url: "https://pokeapi.co/api/v2/pokemon/1/" },
            { name: "alex", url: "https://pokeapi.co/api/v2/pokemon/2/" },
            { name: "lily", url: "https://pokeapi.co/api/v2/pokemon/3/" },
            { name: "larry", url: "https://pokeapi.co/api/v2/pokemon/4/" },
          ],
        })
      );
    }

    console.log("passthrough on list call");
    return req.passthrough();
  }),
  rest.get("https://pokeapi.co/api/v2/pokemon/:id/", (req, res, ctx) => {
    // console.log("get specific pokemon");
    // console.log("header", req.headers.get("X-mock-header"));
    const mockHeader = req.headers.get("x-mock-header");

    if (mockHeader) {
      console.log(
        "mocking https://pokeapi.co/api/v2/pokemon/:id/",
        req.params.id
      );
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

    console.log("passthrough on id call");
    return req.passthrough();
  }),
];
