import React from "react";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { PokemonDisplay } from "@/components/PokemonDisplay";

/**
 * 
 I want to test client side routing with this component. It's an exact copy of pages/index.ts
 */

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
