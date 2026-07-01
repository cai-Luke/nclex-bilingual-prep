import { isDueForReview } from "./reviewSchedule";
import { NCLEX_CATEGORY_WEIGHTS } from "./schema";
import type {
  Category,
  ItemType,
  NgnSkill,
  Question,
  QuestionFlag,
  QuestionProgress,
  QuestionRecord,
} from "./types";

export { NCLEX_CATEGORY_WEIGHTS };

const CATEGORY_ORDER = Object.keys(NCLEX_CATEGORY_WEIGHTS) as Category[];

// Curated product decision: the visual literacies worth guaranteeing practice on.
// List order is reservation priority; this is not derived from generation counts.
export const DEFAULT_FLOOR_KIND_PRIORITY = ["rhythm_strip", "lab_trend", "vitals_trend"];

export type SamplerParams = {
  alpha?: number;
  beta?: number;
  floorThreshold?: number;
  floorMinCount?: number;
  floorKindPriority?: string[];
  now?: Date;
};

export type CompletedSessionSignal = {
  questions: Question[];
  results: Record<string, boolean>;
};

export type TargetedReviewSignals = {
  missedTopics: Set<string>;
  missedCategories: Set<Category>;
  missedItemTypes: Set<ItemType>;
  missedNgnSkills: Set<NgnSkill>;
};

export const seedFromString = (value: string): number => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
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
  if (total <= 0) return chooseRandom(items, rng);
  let cursor = rng() * total;
  for (let index = 0; index < items.length; index += 1) {
    cursor -= weights[index];
    if (cursor < 0) return items[index];
  }
  return items[items.length - 1];
};

const extractTargetedReviewSignals = (session: CompletedSessionSignal): TargetedReviewSignals => {
  const missedTopics = new Set<string>();
  const missedCategories = new Set<Category>();
  const missedItemTypes = new Set<ItemType>();
  const missedNgnSkills = new Set<NgnSkill>();

  for (const question of session.questions) {
    if (session.results[question.id] !== false) continue;
    missedTopics.add(question.topic);
    missedCategories.add(question.category);
    missedItemTypes.add(question.itemType);
    if (question.ngnSkill) missedNgnSkills.add(question.ngnSkill);
  }

  return { missedTopics, missedCategories, missedItemTypes, missedNgnSkills };
};

export const scoreTargetedReviewCandidate = (
  record: QuestionRecord,
  signals: TargetedReviewSignals,
  progress: Record<string, QuestionProgress>,
  flags: Record<string, QuestionFlag>,
): number => {
  const { question } = record;
  const itemProgress = progress[question.id];
  let score = 0;
  if (signals.missedTopics.has(question.topic)) score += 6;
  if (signals.missedCategories.has(question.category)) score += 4;
  if (signals.missedItemTypes.has(question.itemType)) score += 3;
  if (question.ngnSkill && signals.missedNgnSkills.has(question.ngnSkill)) score += 3;
  if (flags[question.id]?.flagged) score += 5;
  if ((itemProgress?.incorrect ?? 0) > 0) score += 4;
  if ((itemProgress?.seen ?? 0) === 0) score += 2;
  if ((itemProgress?.correctStreak ?? 0) >= 2) score -= 3;
  return score;
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
  const floorKindPriority = [...new Set(params.floorKindPriority ?? DEFAULT_FLOOR_KIND_PRIORITY)];

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
    const floorKinds = floorKindPriority.filter((kind) => (visualCounts.get(kind) ?? 0) >= floorThreshold);

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

export const buildTargetedReviewPool = (
  records: QuestionRecord[],
  session: CompletedSessionSignal,
  progress: Record<string, QuestionProgress>,
  flags: Record<string, QuestionFlag>,
  count: number,
  rng: () => number,
): QuestionRecord[] => {
  const signals = extractTargetedReviewSignals(session);
  if (signals.missedTopics.size === 0) return [];

  const eligible = records.filter((record) => record.question.itemType !== "case_study");
  const uniqueEligibleCount = new Set(eligible.map((record) => record.question.id)).size;
  const targetCount = Math.min(Math.max(0, Math.floor(count)), uniqueEligibleCount);
  if (targetCount === 0) return [];

  const alpha = 1;
  const beta = 1;
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

  const diversityWeight = (record: QuestionRecord, baseWeight: number) => {
    const sameTopicCount = topicCounts.get(record.question.topic) ?? 0;
    const kind = record.question.visual?.kind;
    const sameKindCount = kind ? (kindCounts.get(kind) ?? 0) : 0;
    return baseWeight / (1 + alpha * sameTopicCount + beta * sameKindCount);
  };

  const drawWeighted = (
    candidates: QuestionRecord[],
    baseWeightFor: (record: QuestionRecord) => number,
    limit: number,
  ) => {
    while (selected.length < targetCount && limit > 0) {
      const available = candidates.filter((record) => {
        if (selectedIds.has(record.question.id)) return false;
        return baseWeightFor(record) > 0;
      });
      if (available.length === 0) break;

      const weights = available.map((record) => diversityWeight(record, baseWeightFor(record)));
      const candidate = chooseWeighted(available, weights, rng);
      if (!candidate) break;
      addSelection(candidate);
      limit -= 1;
    }
  };

  const scoredCandidates = eligible.map((record) => ({
    record,
    score: scoreTargetedReviewCandidate(record, signals, progress, flags),
  }));
  const strongCandidates = scoredCandidates
    .filter(({ score }) => score > 0)
    .map(({ record }) => record);

  drawWeighted(
    strongCandidates,
    (record) => scoreTargetedReviewCandidate(record, signals, progress, flags),
    strongCandidates.length >= targetCount ? targetCount : strongCandidates.length,
  );

  for (const tier of [0, 1, 2] as const) {
    if (selected.length >= targetCount) break;
    const tierCandidates = eligible.filter((record) => progressTier(progress[record.question.id]) === tier);
    drawWeighted(tierCandidates, () => 1, tierCandidates.length);
  }

  return shuffleWithRng(selected, rng);
};
