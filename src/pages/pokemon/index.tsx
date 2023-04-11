import React from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Script from "next/script";
import { GetServerSidePropsContext } from "next";

const inter = Inter({ subsets: ["latin"] });

// if we navigate to this page from another page, this should be mocked
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // FIXME Was getting "unable to verify the first certificate" when passing these headers through and
  // the actual request was being made.
  const customHeaders = context.req.headers["x-mock"]
    ? { headers: context.req.headers as any }
    : {};
  const data = await fetch(
    "https://pokeapi.co/api/v2/pokemon",
    customHeaders
  ).then((res) => res.json());
  return {
    props: {
      pokemon: data,
    },
  };
}

const PokemonDisplay = ({ name, url }: { name: string; url: string }) => {
  const [fetchState, setFetchState] = React.useState<
    { type: "loading" } | { type: "fetched"; data: any } | { type: "error" }
  >({ type: "loading" });

  React.useEffect(() => {
    // had to add delay to prove mock from cypress test was actually working

    fetch(url, {
      // setting this proves that, in the client, service worker gets a request before cypress.intercept
      // uncommenting this will result in id handler ins handlers returns mock
      // headers: {
      //   "x-mock": "true",
      // },
    })
      .then((res) => res.json())
      .then((data) => {
        setFetchState({ type: "fetched", data });
      })
      .catch((err) => {
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

export default function Home({ pokemon }: any) {
  return (
    <>
      <Head>
        <title>Root Page</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {pokemon.results.map((r: { name: string; url: string }) => (
          <PokemonDisplay key={r.url} name={r.name} url={r.url} />
        ))}
      </main>
    </>
  );
}
