"use client";
import { pokemonTypeColors } from "@/constants/PokemonTypeColors";
import PokemonDetail from "@/interfaces/PokemonDetail";
import { useState } from "react";

const statNames: { [key: string]: string } = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Att.",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

function TypeBadge({
  type,
  pokemon,
}: {
  type: string;
  pokemon: PokemonDetail;
}) {
  return (
    <span
      className={`${
        pokemonTypeColors[pokemon.types[0].type.name]
      } brightness-110 text-gray-700 text-md font-bold px-3 py-1 rounded-lg capitalize`}
    >
      {type}
    </span>
  );
}

function StatBar({
  statName,
  value,
  max = 255,
}: {
  statName: string;
  value: number;
  max?: number;
}) {
  const percentage = (value / max) * 100;
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-gray-600 font-medium w-20 text-md">{statName}</span>
      <span className="text-gray-800 font-bold w-8 text-md">{value}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            value > 59 ? "bg-green-500" : "bg-red-500"
          } transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default function PokemonDetailClient({
  pokemon,
}: {
  pokemon: PokemonDetail;
}) {
  const [selectedTab, setSelectedTab] = useState("about");

  const heightMeters = pokemon.height / 10;
  const weightKg = pokemon.weight / 10;

  return (
    <main className={`min-h-screen bg-gray-50`}>
      {/* <Link
          href="/"
          className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Pokédex
        </Link> */}

      <div
        className={`${
          pokemonTypeColors[pokemon.types[0].type.name]
        } shadow-lg p-8`}
      >
        <div className="flex justify-between align-middle">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white text-shadow-gray-700 capitalize mb-3">
              {pokemon.name}
            </h1>

            <div className="flex gap-3 mb-6">
              {pokemon.types.map((typeInfo) => (
                <TypeBadge
                  key={typeInfo.type.name}
                  type={typeInfo.type.name}
                  pokemon={pokemon}
                />
              ))}
            </div>
          </div>

          <span className="text-white text-4xl font-bold">
            #{pokemon.id.toString().padStart(3, "0")}
          </span>
        </div>

        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="w-80 h-80 mx-auto object-contain drop-shadow-2xl mb-[-80px]"
        />
      </div>

      <div className="bg-white shadow-lg pt-12">
        <div className="flex border-b">
          {["about", "base stats", "moves"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-4 capitalize cursor-pointer ${
                selectedTab === tab
                  ? "text-blue-600 font-bold border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {selectedTab === "about" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-[70px_1fr] gap-2">
            <h3 className="text-gray-800 text-md font-bold">Height</h3>
            <p className="text-gray-800 text-md">{heightMeters}m</p>

            <h3 className="text-gray-800 text-md font-bold">Weight</h3>
            <p className="text-gray-800 text-md">{weightKg} kg</p>

            <h3 className="text-gray-800 text-md font-bold">Abilities</h3>
            <div className="flex gap-2">
              {pokemon.abilities.map((abilityInfo) => (
                <span
                  key={abilityInfo.ability.name}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm font-medium capitalize"
                >
                  {abilityInfo.ability.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === "base stats" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="space-y-3">
            {pokemon.stats.map((statInfo) => (
              <StatBar
                key={statInfo.stat.name}
                statName={statNames[statInfo.stat.name] || statInfo.stat.name}
                value={statInfo.base_stat}
              />
            ))}
          </div>
        </div>
      )}

      {selectedTab === "moves" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {pokemon.moves.map((moveItem) => (
              <div
                className="text-gray-800 capitalize bg-gray-50 p-2 rounded-lg text-md"
                key={moveItem?.move?.url}
              >
                {moveItem?.move?.name.replace("-", " ")}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
