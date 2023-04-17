async function initMocks() {
  if (typeof window === "undefined") {
    console.log("init mock server");
    const { server } = await import("./server");

    server.listen();
  }
}

initMocks();

export {};
