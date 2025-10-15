import PokemonDetailClient from "./PokemonDetailClient";
import { notFound } from "next/navigation";

async function getPokemonData(id: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) notFound();
  return res.json();
}

export default async function PokemonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pokemon = await getPokemonData(id);

  return <PokemonDetailClient pokemon={pokemon} />;
}
