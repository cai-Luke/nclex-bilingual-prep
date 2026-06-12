import type { BurnPopulation, BurnRegionKey } from "./regions";

export interface BurnMapSpec {
  kind: "burn_map";
  population?: BurnPopulation;
  burns: BurnRegionKey[];
  caption?: { en: string; zh?: string };
}
