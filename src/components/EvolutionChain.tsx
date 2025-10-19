import { EvolutionData } from "@/interfaces/EvolutionData";
import EvolutionCard from "./EvolutionCard";

export default function EvolutionChain({
  evolutions,
  currentPokemonId,
}: {
  evolutions: EvolutionData[];
  currentPokemonId: number;
}) {
  if (evolutions.length <= 1) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">
          This Pokémon does not have evolution.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4 py-6 flex-wrap">
        {evolutions.map((evolution, index) => {
          const isCurrent = evolution.id === currentPokemonId;

          return (
            <EvolutionCard
              key={evolution.id}
              evolution={evolution}
              index={index}
              isCurrent={isCurrent}
            />
          );
        })}
      </div>
    </div>
  );
}
