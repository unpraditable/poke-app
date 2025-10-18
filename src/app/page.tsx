"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PokemonCard from "@/components/PokemonCard";
import Pokemon from "@/interfaces/Pokemon";
import PokemonListResponse from "@/interfaces/PokemonListResponse";

async function getPokemonDetails(url: string): Promise<{ types: string[] }> {
  const res = await fetch(url);
  if (!res.ok) {
    return { types: [] };
  }

  const data = await res.json();
  const types = data.types.map(
    (typeInfo: { type: { name: string } }) => typeInfo.type.name
  );

  return { types };
}

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

export default function Home() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>(
    "https://pokeapi.co/api/v2/pokemon?limit=60"
  );
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=60");

      if (!res.ok) {
        throw new Error("Failed to fetch Pokémon data");
      }

      const data: PokemonListResponse = await res.json();
      const processedResults = await processPokemonData(data.results);

      setPokemon(processedResults);
      setNextUrl(data.next);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Error loading Pokémon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePokemon = useCallback(async () => {
    if (!nextUrl || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const res = await fetch(nextUrl);
      const data: PokemonListResponse = await res.json();

      const processedResults = await processPokemonData(data.results);

      setPokemon((prev) => [...prev, ...processedResults]);
      setNextUrl(data.next);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Error loading more Pokémon:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, nextUrl]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMorePokemon();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoadingMore, loadMorePokemon]);

  useEffect(() => {
    loadInitialData();
  }, []);

  if (isLoading && pokemon.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Next.js Pokédex
          </h1>
          <div className="text-center">
            <p className="text-gray-600">Loading Pokémon...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Next.js Pokédex
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {pokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>

        {/* Observer Target for Scroll */}
        <div ref={observerTarget} className="h-10 flex justify-center">
          {isLoadingMore && (
            <span className="text-gray-500 text-sm">
              Loading more Pokémon...
            </span>
          )}
        </div>

        {/* Manual Load More Button for Fallback */}
        {hasMore && !isLoadingMore && (
          <div className="text-center mt-4">
            <button
              onClick={loadMorePokemon}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-colors"
            >
              Load More Pokémon
            </button>
          </div>
        )}

        {/* End Message */}
        {!hasMore && pokemon.length > 0 && (
          <div className="text-center py-8">
            <div className="bg-green-50 border border-green-200 rounded-2xl py-6 px-8 inline-block">
              <h3 className="text-green-800 font-semibold text-lg mb-2">
                🎉 All Pokémon Loaded!
              </h3>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
