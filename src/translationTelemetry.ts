import type { Category, RevealBlock, TranslationRevealEvent } from "./types";

export type TranslationTelemetrySummary = {
  totalCount: number;
  sessionCount: number;
  earliest?: string;
  latest?: string;
  byBlock: Array<{ block: RevealBlock; count: number }>;
  byCategory: Array<{ category: Category; count: number; avgElapsedMs?: number; beforeSubmitShare: number }>;
  byTopic: Array<{ topic: string; count: number; avgElapsedMs?: number; beforeSubmitShare: number }>;
};

type Aggregate<TLabel extends string> = {
  label: TLabel;
  count: number;
  elapsedTotal: number;
  elapsedCount: number;
  beforeSubmitCount: number;
};

const compareCountThenLabel = <T extends { count: number }>(
  labelOf: (value: T) => string,
) => (left: T, right: T) => right.count - left.count || labelOf(left).localeCompare(labelOf(right));

const pushAggregate = <TLabel extends string>(
  groups: Map<TLabel, Aggregate<TLabel>>,
  label: TLabel,
  event: TranslationRevealEvent,
) => {
  const current = groups.get(label) ?? {
    label,
    count: 0,
    elapsedTotal: 0,
    elapsedCount: 0,
    beforeSubmitCount: 0,
  };
  current.count += 1;
  if (Number.isFinite(event.elapsedMsOnQuestion)) {
    current.elapsedTotal += event.elapsedMsOnQuestion;
    current.elapsedCount += 1;
  }
  if (event.submittedBeforeReveal === false) current.beforeSubmitCount += 1;
  groups.set(label, current);
};

const averageElapsed = (group: Aggregate<string>) =>
  group.elapsedCount > 0 ? group.elapsedTotal / group.elapsedCount : undefined;

const beforeSubmitShare = (group: Aggregate<string>) =>
  group.count > 0 ? group.beforeSubmitCount / group.count : 0;

export const summarizeTranslationRevealEvents = (
  events: TranslationRevealEvent[],
): TranslationTelemetrySummary => {
  const blockGroups = new Map<RevealBlock, Aggregate<RevealBlock>>();
  const categoryGroups = new Map<Category, Aggregate<Category>>();
  const topicGroups = new Map<string, Aggregate<string>>();
  const sessionIds = new Set<string>();
  let earliest: string | undefined;
  let latest: string | undefined;

  for (const event of events) {
    sessionIds.add(event.sessionId);
    if (!earliest || event.revealedAt < earliest) earliest = event.revealedAt;
    if (!latest || event.revealedAt > latest) latest = event.revealedAt;

    pushAggregate(blockGroups, event.block, event);
    pushAggregate(categoryGroups, event.category, event);
    pushAggregate(topicGroups, event.topic.trim() || "Unknown topic", event);
  }

  const byBlock = [...blockGroups.values()]
    .map((group) => ({ block: group.label, count: group.count }))
    .sort(compareCountThenLabel((row) => row.block));

  const byCategory = [...categoryGroups.values()]
    .map((group) => ({
      category: group.label,
      count: group.count,
      avgElapsedMs: averageElapsed(group),
      beforeSubmitShare: beforeSubmitShare(group),
    }))
    .sort(compareCountThenLabel((row) => row.category));

  const byTopic = [...topicGroups.values()]
    .map((group) => ({
      topic: group.label,
      count: group.count,
      avgElapsedMs: averageElapsed(group),
      beforeSubmitShare: beforeSubmitShare(group),
    }))
    .sort(compareCountThenLabel((row) => row.topic))
    .slice(0, 15);

  return {
    totalCount: events.length,
    sessionCount: sessionIds.size,
    earliest,
    latest,
    byBlock,
    byCategory,
    byTopic,
  };
};
