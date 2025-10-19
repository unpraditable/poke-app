"use client";
import EvolutionList from "@/components/EvolutionChain";
import StatBar from "@/components/StatBar";
import TypeBadge from "@/components/TypeBadge";
import { pokemonTypeColors } from "@/constants/PokemonTypeColors";
import { EvolutionData } from "@/interfaces/EvolutionData";
import PokemonDetail from "@/interfaces/PokemonDetail";
import { useState, useEffect } from "react";

const statNames: { [key: string]: string } = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Att.",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export default function PokemonDetailClient({
  pokemon,
}: {
  pokemon: PokemonDetail & {
    evolutionData?: EvolutionData[];
  };
}) {
  const [selectedTab, setSelectedTab] = useState("about");
  const [evolutionData, setEvolutionData] = useState<EvolutionData[]>([]);
  const [loadingEvolution, setLoadingEvolution] = useState(false);

  const heightMeters = pokemon.height / 10;
  const weightKg = pokemon.weight / 10;

  // Load evolution data when evolution tab is selected
  useEffect(() => {
    const loadEvolutionData = async () => {
      if (
        selectedTab === "evolution" &&
        pokemon.id &&
        evolutionData.length === 0
      ) {
        setLoadingEvolution(true);
        try {
          // Evolution chain exists in species endpoint, so we must call this API
          const speciesResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}/`
          );
          const speciesData = await speciesResponse.json();

          if (speciesData.evolution_chain?.url) {
            // Then get the evolution chain
            const evolutionResponse = await fetch(
              speciesData.evolution_chain.url
            );
            const evolutionChainData = await evolutionResponse.json();

            // Process the evolution chain into a flat array
            // Note: Eevee's evolution is tricky, so it doesn't include all Eevee's cases
            const processChain = (chain: {
              // evolves_to is very tricky because it's recursive, I need to use any for this
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              evolves_to: any;
              evolution_details: {
                trigger: { name: string };
                min_level: number;
                item:
                  | {
                      name: string;
                      url: string;
                    }
                  | undefined;
              }[];
              species: { url: string; name: string; evolves_to: [] };
            }): EvolutionData[] => {
              const evolutions: EvolutionData[] = [];
              let current: {
                // evolves_to is very tricky because it's recursive, I need to use any for this
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                evolves_to: any;
                evolution_details: {
                  trigger: { name: string };
                  min_level: number;
                  item:
                    | {
                        name: string;
                        url: string;
                      }
                    | undefined;
                }[];
                species: { url: string; name: string; evolves_to: [] };
              } = chain;

              while (current) {
                const speciesId = parseInt(
                  current.species.url.split("/").slice(-2, -1)[0]
                );

                evolutions.push({
                  id: speciesId,
                  name: current.species.name,
                  trigger:
                    current.evolution_details?.[0]?.trigger?.name || "base",
                  min_level: current.evolution_details?.[0]?.min_level,
                  item: current.evolution_details?.[0]?.item,
                });

                // Move to next evolution if exists to check its next evolution
                current = current.evolves_to?.[0] || null;
              }

              return evolutions;
            };

            const processedEvolutions = processChain(evolutionChainData.chain);
            setEvolutionData(processedEvolutions);
          }
        } catch (error) {
          console.error("Error loading evolution data:", error);
        } finally {
          setLoadingEvolution(false);
        }
      }
    };

    loadEvolutionData();
  }, [selectedTab, pokemon.id, evolutionData.length]);

  return (
    <main className={`min-h-screen bg-gray-50`}>
      <div
        className={`${
          pokemonTypeColors[pokemon.types[0].type.name]
        } shadow-lg p-8  bg-[url(/pokeball.svg)] bg-size-[auto_200px] lg:bg-size-[auto_400px] bg-no-repeat bg-bottom-right relative`}
      >
        <div className="flex justify-between align-middle">
          <div className="flex flex-col justify-center gap-3">
            <h1 className="text-xl lg:text-4xl font-bold text-white text-shadow-gray-700 capitalize">
              {pokemon.name}
            </h1>

            <div className="flex gap-3">
              {pokemon.types.map((typeInfo) => (
                <TypeBadge
                  key={typeInfo.type.name}
                  type={typeInfo.type.name}
                  mainType={pokemonTypeColors[pokemon.types[0].type.name]}
                />
              ))}
            </div>
          </div>

          <span className="text-white text-xl lg:text-4xl font-bold self-center">
            #{pokemon.id.toString().padStart(3, "0")}
          </span>
        </div>

        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="w-40 h-40 lg:w-80 lg:h-80 mx-auto object-contain drop-shadow-2xl mb-[-80px]"
        />
      </div>

      <div className="bg-white shadow-lg pt-12">
        <div className="flex border-b">
          {["about", "base stats", "evolution", "moves"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`flex-1 py-4 capitalize cursor-pointer text-sm lg:text-md ${
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
            <h3 className="text-gray-800 text-sm lg:text-md font-bold">
              Height
            </h3>
            <p className="text-gray-800 text-sm lg:text-md">{heightMeters}m</p>

            <h3 className="text-gray-800 text-sm lg:text-md font-bold">
              Weight
            </h3>
            <p className="text-gray-800 text-sm lg:text-md">{weightKg} kg</p>

            <h3 className="text-gray-800 text-sm lg:text-md font-bold">
              Abilities
            </h3>
            <div className="flex gap-2">
              {pokemon.abilities.map((abilityInfo) => (
                <span
                  key={abilityInfo.ability.name}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm lg:text-mdfont-medium capitalize"
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

      {selectedTab === "evolution" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loadingEvolution ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-gray-500">Loading evolution data...</span>
            </div>
          ) : (
            <EvolutionList
              evolutions={evolutionData}
              currentPokemonId={pokemon.id}
            />
          )}
        </div>
      )}

      {selectedTab === "moves" && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {pokemon.moves.map((moveItem) => (
              <div
                className="text-gray-800 capitalize bg-gray-50 p-2 rounded-lg text-sm lg:text-md"
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
