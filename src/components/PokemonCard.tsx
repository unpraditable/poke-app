import { pokemonTypeColors } from "@/constants/PokemonTypeColors";
import Pokemon from "@/interfaces/Pokemon";
import Link from "next/link";
import React from "react";
import TypeBadge from "./TypeBadge";

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <Link
      href={`/pokemon/${pokemon.id}`}
      className="block transform transition-transform hover:scale-105"
    >
      <div
        className={`${
          pokemonTypeColors[pokemon.types[0]]
        } rounded-lg shadow-lg p-2 text-center flex justify-between bg-[url(/pokeball.svg)] bg-size-[auto_100px] md:bg-size-[auto_100px] bg-no-repeat bg-bottom-right min-h-[150px]`}
      >
        <div className="">
          <div className="flex flex-col gap-3 mb-6">
            <h2 className="text-sm sm:text-lg md:text-2xl font-semibold text-white capitalize">
              {pokemon.name}
            </h2>
            {pokemon.types.map((type) => (
              <TypeBadge
                key={type}
                type={type}
                mainType={pokemonTypeColors[pokemon.types[0]]}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between text-right">
          <span className="text-white text-sm sm:text-lg md:text-2xl font-bold">
            #{pokemon.id.toString().padStart(3, "0")}
          </span>

          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            alt={pokemon.name}
            className="w-24 h-auto md:w-36 lg:w-48 object-contain text-right"
          />
        </div>
      </div>
    </Link>
  );
}
