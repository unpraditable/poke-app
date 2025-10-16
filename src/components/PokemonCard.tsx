import { pokemonTypeColors } from "@/constants/PokemonTypeColors";
import Pokemon from "@/interfaces/Pokemon";
import Link from "next/link";
import React from "react";

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className="block transform transition-transform hover:scale-105"
    >
      <div
        className={`${
          pokemonTypeColors[pokemon.types[0]]
        } rounded-lg shadow-lg p-6 text-center`}
      >
        <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            alt={pokemon.name}
            className="w-28 h-28"
          />
        </div>
        <span className="text-gray-600 text-sm">
          #{pokemon.id.toString().padStart(3, "0")}
        </span>
        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          {pokemon.name}
        </h2>
      </div>
    </Link>
  );
}
