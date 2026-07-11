export const POPULATIONS = ["adult", "peds_child", "peds_infant"] as const;

export type Population = typeof POPULATIONS[number];

const POPULATION_SET: ReadonlySet<string> = new Set(POPULATIONS);

export const isPopulation = (value: unknown): value is Population =>
  typeof value === "string" && POPULATION_SET.has(value);
