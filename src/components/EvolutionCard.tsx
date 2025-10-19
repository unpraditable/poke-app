import { EvolutionData } from "@/interfaces/EvolutionData";
import Link from "next/link";

export default function EvolutionCard({
  evolution,
  isCurrent,
  index,
}: {
  evolution: EvolutionData;
  isCurrent: boolean;
  index: number;
}) {
  const getTriggerText = (evolution: EvolutionData, index: number) => {
    switch (true) {
      case index === 0:
        return "Base Form";
      case !!evolution.min_level:
        return `Level ${evolution.min_level}`;
      case !!evolution.item:
        return `Use ${evolution.item.name.replace("-", " ")}`;
      case evolution.trigger === "trade":
        return "Trade";
      case evolution.trigger === "use-item":
        return "Use Item";
      default:
        return "Evolves";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Link
        href={`/pokemon/${evolution.name}`}
        className={`block text-center transition-all hover:scale-105 ${
          isCurrent
            ? "ring-4 ring-blue-400 rounded-2xl transform scale-105"
            : ""
        }`}
      >
        <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100 min-w-[140px]">
          <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-b from-gray-50 to-gray-100 rounded-full p-2">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`}
              alt={evolution.name}
              className="w-16 h-16 mx-auto object-contain"
              loading="lazy"
            />
          </div>
          <span className="text-gray-400 text-sm font-bold block">
            #{evolution.id.toString().padStart(3, "0")}
          </span>
          <h3
            className={`font-semibold capitalize ${
              isCurrent ? "text-blue-600" : "text-gray-800"
            }`}
          >
            {evolution.name}
          </h3>
        </div>
      </Link>

      {/* Evolution Trigger */}
      {index > 0 && (
        <div className="mt-2 text-center">
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            {getTriggerText(evolution, index)}
          </span>
        </div>
      )}
    </div>
  );
}
