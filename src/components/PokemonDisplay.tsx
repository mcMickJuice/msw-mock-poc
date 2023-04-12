import React from "react";

export const PokemonDisplay = ({
  name,
  url,
}: {
  name: string;
  url: string;
}) => {
  const [fetchState, setFetchState] = React.useState<
    { type: "loading" } | { type: "fetched"; data: any } | { type: "error" }
  >({ type: "loading" });

  React.useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setFetchState({ type: "fetched", data });
      })
      .catch(() => {
        setFetchState({ type: "error" });
      });
  }, []);

  return (
    <div
      data-test-id="pokemon-display"
      style={{ padding: "8px", border: "1px solid white" }}
    >
      <div>{name}</div>
      {fetchState.type === "fetched" && (
        <img src={fetchState.data.sprites.front_default} />
      )}
      {fetchState.type === "error" && <div>An Error Occurred</div>}
    </div>
  );
};
