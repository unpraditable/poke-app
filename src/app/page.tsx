import Link from "next/link";

interface Pokemon {
  name: string;
  url: string;
  id: number;
}

interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

async function getPokemonDetails(url: string): Promise<{ types: string[] }> {
  const res = await fetch(url);
  if (!res.ok) {
    return { types: [] };
  }

  const data = await res.json();
  const types = data.types.map(
    (typeInfo: {
      type: {
        name: string;
      };
    }) => typeInfo.type.name
  );

  return { types };
}

// Extracts Pokémon ID from URL and pokemon type and adds to object
async function processPokemonData(pokemonList: Pokemon[]): Promise<Pokemon[]> {
  return Promise.all(
    pokemonList.map(async (pokemon) => {
      const id = parseInt(pokemon.url.split("/").slice(-2, -1)[0]);
      const details = await getPokemonDetails(pokemon.url);

      return {
        ...pokemon,
        id,
        types: details.types,
      };
    })
  );
}

// Fetches Pokémon data at build time
async function getPokemonData(): Promise<PokemonListResponse> {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=60");

  if (!res.ok) {
    throw new Error("Failed to fetch Pokémon data");
  }

  const data: PokemonListResponse = await res.json();

  const processedResults = await processPokemonData(data.results);

  console.log(data, "data");

  return {
    ...data,
    results: processedResults,
  };
}

export default async function Home() {
  const pokemonData = await getPokemonData();

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Next.js Pokédex
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pokemonData.results.map((pokemon) => (
            <Link
              key={pokemon.name}
              href={`/pokemon/${pokemon.id}`}
              className="block transform transition-transform hover:scale-105"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
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
          ))}
        </div>
      </div>
    </main>
  );
}
