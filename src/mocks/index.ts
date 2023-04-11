import { rest } from "msw";

async function initMocks() {
  if (typeof window === "undefined") {
    console.log("init mock server");
    const { server } = await import("./server");

    server.listen();
  } else {
    console.log("init mock service worker");
    const { worker, rest } = await import("./browser");
    // @ts-expect-error
    window.msw = {
      worker,
      rest,
    };

    worker.start();
  }
}

initMocks();

export {};
