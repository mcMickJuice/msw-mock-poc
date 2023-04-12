import { rest } from "msw";

export const resourceToMockMap = {
  POKE_LIST: {
    // msw specific pattern
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
  rest.get(resourceToMockMap["POKE_LIST"].url, async (req, res, ctx) => {
    const mockHeader = req.headers.get("x-mock");

    if (mockHeader) {
      console.log(`mocking ${resourceToMockMap["POKE_LIST"].url}`);
      return res(
        ctx.status(200),
        ctx.json(resourceToMockMap["POKE_LIST"].payload)
      );
    }

    console.log("passthrough on list call");
    //mswjs.io/docs/api/request/passthrough
    https: return req.passthrough();
  }),
  rest.get(resourceToMockMap["POKE_BY_ID"].url, (req, res, ctx) => {
    const mockHeader = req.headers.get("x-mock");

    if (mockHeader) {
      console.log(
        `mocking ${resourceToMockMap["POKE_BY_ID"].url}`,
        req.params.id
      );
      return res(
        ctx.status(200),
        ctx.json(resourceToMockMap["POKE_BY_ID"].payload)
      );
    }

    console.log("passthrough on id call");
    return req.passthrough();
  }),
];
