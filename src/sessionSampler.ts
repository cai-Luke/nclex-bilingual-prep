import { isDueForReview } from "./reviewSchedule";
import type { Category, QuestionProgress, QuestionRecord } from "./types";

export const NCLEX_CATEGORY_WEIGHTS: Record<Category, number> = {
  "Management of Care": 0.18,
  "Pharmacological and Parenteral Therapies": 0.16,
  "Physiological Adaptation": 0.14,
  "Safety and Infection Control": 0.13,
  "Reduction of Risk Potential": 0.12,
  "Health Promotion and Maintenance": 0.09,
  "Psychosocial Integrity": 0.09,
  "Basic Care and Comfort": 0.09,
};

const CATEGORY_ORDER = Object.keys(NCLEX_CATEGORY_WEIGHTS) as Category[];

export type SamplerParams = {
  alpha?: number;
  beta?: number;
  floorThreshold?: number;
  floorMinCount?: number;
  now?: Date;
};

export const progressTier = (
  itemProgress: QuestionProgress | undefined,
  now?: Date,
): 0 | 1 | 2 => {
  if ((itemProgress?.seen ?? 0) === 0) return 0;
  if (itemProgress?.missed || (now && isDueForReview(itemProgress, now))) return 1;
  return 2;
};

const shuffleWithRng = <T,>(items: T[], rng: () => number): T[] => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
};

const apportionSeats = (
  capacities: Record<Category, number>,
  seatCount: number,
  rng: () => number,
): Record<Category, number> => {
  const allocations = Object.fromEntries(CATEGORY_ORDER.map((category) => [category, 0])) as Record<Category, number>;
  let remaining = seatCount;

  while (remaining > 0) {
    const active = CATEGORY_ORDER.filter((category) => allocations[category] < capacities[category]);
    if (active.length === 0) break;

    const totalWeight = active.reduce((sum, category) => sum + NCLEX_CATEGORY_WEIGHTS[category], 0);
    const quotas = active.map((category) => ({
      category,
      quota: remaining * (NCLEX_CATEGORY_WEIGHTS[category] / totalWeight),
    }));

    let floorAwards = 0;
    for (const { category, quota } of quotas) {
      const room = capacities[category] - allocations[category];
      const award = Math.min(room, Math.floor(quota));
      allocations[category] += award;
      floorAwards += award;
    }
    remaining -= floorAwards;
    if (remaining === 0) break;

    const remainderGroups = new Map<number, Category[]>();
    for (const { category, quota } of quotas) {
      if (allocations[category] >= capacities[category]) continue;
      const remainder = Math.round((quota - Math.floor(quota)) * 1e12) / 1e12;
      const group = remainderGroups.get(remainder) ?? [];
      group.push(category);
      remainderGroups.set(remainder, group);
    }

    const orderedRemainders = [...remainderGroups.entries()]
      .sort(([left], [right]) => right - left)
      .flatMap(([, categories]) => shuffleWithRng(categories, rng));

    let remainderAwards = 0;
    for (const category of orderedRemainders) {
      if (remaining === 0) break;
      if (allocations[category] >= capacities[category]) continue;
      allocations[category] += 1;
      remaining -= 1;
      remainderAwards += 1;
    }

    if (floorAwards === 0 && remainderAwards === 0) break;
  }

  return allocations;
};

const chooseRandom = <T,>(items: T[], rng: () => number): T | undefined =>
  items.length > 0 ? items[Math.floor(rng() * items.length)] : undefined;

const chooseWeighted = <T,>(items: T[], weights: number[], rng: () => number): T | undefined => {
  if (items.length === 0) return undefined;
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = rng() * total;
  for (let index = 0; index < items.length; index += 1) {
    cursor -= weights[index];
    if (cursor < 0) return items[index];
  }
  return items[items.length - 1];
};

export const buildWeightedSession = (
  pool: QuestionRecord[],
  count: number,
  progress: Record<string, QuestionProgress>,
  rng: () => number,
  params: SamplerParams = {},
): QuestionRecord[] => {
  const eligible = pool.filter((record) => record.question.itemType !== "case_study");
  const targetCount = Math.min(Math.max(0, Math.floor(count)), eligible.length);
  if (targetCount === 0) return [];

  const alpha = Math.max(0, params.alpha ?? 1);
  const beta = Math.max(0, params.beta ?? 1);
  const floorThreshold = Math.max(1, Math.floor(params.floorThreshold ?? 10));
  const floorMinCount = Math.max(1, Math.floor(params.floorMinCount ?? 40));

  const byCategory = Object.fromEntries(
    CATEGORY_ORDER.map((category) => [
      category,
      eligible.filter((record) => record.question.category === category),
    ]),
  ) as Record<Category, QuestionRecord[]>;
  const capacities = Object.fromEntries(
    CATEGORY_ORDER.map((category) => [category, byCategory[category].length]),
  ) as Record<Category, number>;
  const targets = apportionSeats(capacities, targetCount, rng);
  const remainingByCategory = { ...targets };

  const selected: QuestionRecord[] = [];
  const selectedIds = new Set<string>();
  const topicCounts = new Map<string, number>();
  const kindCounts = new Map<string, number>();

  const addSelection = (record: QuestionRecord) => {
    selected.push(record);
    selectedIds.add(record.question.id);
    topicCounts.set(record.question.topic, (topicCounts.get(record.question.topic) ?? 0) + 1);
    const kind = record.question.visual?.kind;
    if (kind) kindCounts.set(kind, (kindCounts.get(kind) ?? 0) + 1);
  };

  if (targetCount >= floorMinCount) {
    const visualCounts = new Map<string, number>();
    for (const record of eligible) {
      const kind = record.question.visual?.kind;
      if (kind) visualCounts.set(kind, (visualCounts.get(kind) ?? 0) + 1);
    }
    const floorKinds = [...visualCounts.entries()]
      .filter(([, visualCount]) => visualCount >= floorThreshold)
      .map(([kind]) => kind)
      .sort();

    for (const kind of floorKinds) {
      const candidates = eligible.filter(
        (record) => record.question.visual?.kind === kind && !selectedIds.has(record.question.id),
      );
      if (candidates.length === 0) continue;
      const bestTier = Math.min(
        ...candidates.map((record) => progressTier(progress[record.question.id], params.now)),
      );
      const candidate = chooseRandom(
        candidates.filter((record) => progressTier(progress[record.question.id], params.now) === bestTier),
        rng,
      );
      if (!candidate) continue;

      const category = candidate.question.category;
      if (remainingByCategory[category] === 0) {
        const donor = CATEGORY_ORDER
          .filter((candidateCategory) => remainingByCategory[candidateCategory] > 0)
          .sort((left, right) => remainingByCategory[right] - remainingByCategory[left])[0];
        if (!donor) continue;
        remainingByCategory[donor] -= 1;
      } else {
        remainingByCategory[category] -= 1;
      }
      addSelection(candidate);
    }
  }

  for (const category of CATEGORY_ORDER) {
    while (remainingByCategory[category] > 0) {
      const candidates = byCategory[category].filter((record) => !selectedIds.has(record.question.id));
      if (candidates.length === 0) break;
      const bestTier = Math.min(
        ...candidates.map((record) => progressTier(progress[record.question.id], params.now)),
      );
      const tierCandidates = candidates.filter(
        (record) => progressTier(progress[record.question.id], params.now) === bestTier,
      );
      const weights = tierCandidates.map((record) => {
        const sameTopicCount = topicCounts.get(record.question.topic) ?? 0;
        const kind = record.question.visual?.kind;
        const sameKindCount = kind ? (kindCounts.get(kind) ?? 0) : 0;
        return 1 / (1 + alpha * sameTopicCount + beta * sameKindCount);
      });
      const candidate = chooseWeighted(tierCandidates, weights, rng);
      if (!candidate) break;
      addSelection(candidate);
      remainingByCategory[category] -= 1;
    }
  }

  return shuffleWithRng(selected, rng);
};
