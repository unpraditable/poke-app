export interface EvolutionData {
  id: number;
  name: string;
  trigger: string;
  min_level?: number;
  item?: {
    name: string;
    url: string;
  };
}

// I don't know why this type declaration does not work for evolution
export interface EvolutionChain {
  evolves_to: {
    evolution_details: EvolutionDetail;
    species: EvolutionSpecies;
  };
  evolution_details: EvolutionDetail;
  species: EvolutionSpecies;
}

export interface EvolutionDetail {
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
}

export interface EvolutionSpecies {
  species: { url: string; name: string; evolves_to: [] };
}
