import { rest } from "msw";

// TODO NAME???!?!?
export const mockMap = {
  POKE_LIST: {
    url: "https://pokeapi.co/api/v2/pokemon",
    // cypress url pattern
    urlPattern: "https://pokeapi.co/api/v2/pokemon",
    payload: {
      count: 1279,
      next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
      previous: null,
      results: [
        { name: "mike", url: "https://pokeapi.co/api/v2/pokemon/1/" },
        { name: "alex", url: "https://pokeapi.co/api/v2/pokemon/2/" },
        { name: "lily", url: "https://pokeapi.co/api/v2/pokemon/3/" },
        { name: "larry", url: "https://pokeapi.co/api/v2/pokemon/4/" },
      ],
    },
  },
  POKE_BY_ID: {
    // prob won't work with cypress intercept
    url: "https://pokeapi.co/api/v2/pokemon/:id/",
    urlPattern: "https://pokeapi.co/api/v2/pokemon/*",
    payload: {
      sprites: {
        front_default:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      },
    },
  },
} as const;

export const handlers = [
  // // Uncomment to see requests mock at a global level
  rest.get(mockMap["POKE_LIST"].url, async (req, res, ctx) => {
    // console.log("get all pokemon", req.url);

    const mockHeader = req.headers.get("x-mock");

    if (mockHeader) {
      console.log("mocking https://pokeapi.co/api/v2/pokemon");
      return res(ctx.status(200), ctx.json(mockMap["POKE_LIST"].payload));
    }

    console.log("passthrough on list call");
    //mswjs.io/docs/api/request/passthrough
    https: return req.passthrough();
  }),
  rest.get(mockMap["POKE_BY_ID"].url, (req, res, ctx) => {
    // console.log("get specific pokemon");
    // console.log("header", req.headers.get("x-mock"));
    const mockHeader = req.headers.get("x-mock");

    if (mockHeader) {
      console.log(
        "mocking https://pokeapi.co/api/v2/pokemon/:id/",
        req.params.id
      );
      return res(ctx.status(200), ctx.json(mockMap["POKE_BY_ID"].payload));
    }

    console.log("passthrough on id call");
    return req.passthrough();
  }),
];
