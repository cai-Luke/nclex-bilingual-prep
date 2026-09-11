import { isDueForReview } from "./reviewSchedule";

export type FlashcardPassFilters = {
  scope: "rescue" | "all";
  category: string;
  topic: string;
  readyNow: boolean;
  rescueIds: ReadonlySet<string>;
};

export type FlashcardPass = {
  key: string;
  passCardIds: readonly string[];
  passIndex: number;
};

type PassInputs = {
  deck: readonly { id: string; categories: readonly string[]; topics: readonly string[] }[];
  progress: Readonly<Record<string, { srsDueAt?: string }>>;
  filters: FlashcardPassFilters;
  shuffle: (ids: string[]) => string[];
  now?: Date;
};

export const flashcardPassKey = (filters: FlashcardPassFilters): string => JSON.stringify([
  filters.scope,
  filters.category,
  filters.topic,
  filters.readyNow,
  filters.scope === "rescue" ? [...filters.rescueIds].sort() : null,
]);

export const createFlashcardPass = ({ deck, progress, filters, shuffle, now = new Date() }: PassInputs): FlashcardPass => {
  const eligibleIds = deck.filter(term => {
    if (filters.scope === "rescue" && !filters.rescueIds.has(term.id)) return false;
    if (filters.category !== "all" && !term.categories.includes(filters.category)) return false;
    if (filters.topic !== "all" && !term.topics.includes(filters.topic)) return false;
    if (filters.readyNow && progress[term.id] && !isDueForReview(progress[term.id], now)) return false;
    return true;
  }).map(term => term.id);
  return {
    key: flashcardPassKey(filters),
    passCardIds: Object.freeze(shuffle(eligibleIds)),
    passIndex: 0,
  };
};

/** Progress/catalog writes cannot redefine a pass with the same deliberate deck key. */
export const reconcileFlashcardPass = (current: FlashcardPass | null, inputs: PassInputs): FlashcardPass =>
  current?.key === flashcardPassKey(inputs.filters) ? current : createFlashcardPass(inputs);

export const isFlashcardPassComplete = (pass: FlashcardPass): boolean =>
  pass.passCardIds.length > 0 && pass.passIndex >= pass.passCardIds.length;

export const currentFlashcardId = (pass: FlashcardPass): string | undefined =>
  pass.passIndex < pass.passCardIds.length ? pass.passCardIds[pass.passIndex] : undefined;

export const advanceFlashcardPass = (pass: FlashcardPass): FlashcardPass =>
  pass.passIndex < pass.passCardIds.length ? { ...pass, passIndex: pass.passIndex + 1 } : pass;
