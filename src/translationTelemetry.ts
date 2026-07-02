import type {
  AnswerEvent,
  CaseAnswerPartEvent,
  Category,
  LanguageMode,
  Question,
  RevealBlock,
  SessionMode,
  TranslationRevealEvent,
} from "./types";

export type TranslationTelemetrySummary = {
  totalCount: number;
  sessionCount: number;
  earliest?: string;
  latest?: string;
  byBlock: Array<{ block: RevealBlock; count: number }>;
  byCategory: Array<{ category: Category; count: number; avgElapsedMs?: number; beforeSubmitShare: number }>;
  byTopic: Array<{ topic: string; count: number; avgElapsedMs?: number; beforeSubmitShare: number }>;
};

export type TranslationAttemptItemType = "standalone" | "case_part";
export type TranslationFrictionBucket =
  | "correct_no_reveal"
  | "missed_no_reveal"
  | "correct_after_reveal"
  | "missed_after_reveal";

export type NormalizedAttempt = {
  questionId: string;
  partId?: string;
  itemType: TranslationAttemptItemType;
  wasCorrect: boolean;
  sessionId: string;
  sessionMode: SessionMode;
  languageModeAtAnswer: LanguageMode;
  answeredAt: string;
};

export type TranslationFrictionNormalizationDiagnostics = {
  legacyUnjoinableAttemptCount: number;
  excludedCaseTopLevelAnswerEventCount: number;
};

export type TranslationFrictionNormalizationResult = {
  attempts: NormalizedAttempt[];
  diagnostics: TranslationFrictionNormalizationDiagnostics;
};

export type EnrichedTranslationAttemptRow = NormalizedAttempt & {
  bucket: TranslationFrictionBucket;
  interpretation: string;
  matchingRevealEvents: TranslationRevealEvent[];
  revealBeforeSubmitCount: number;
  hadRevealBeforeSubmit: boolean;
  firstRevealBeforeSubmitAt?: string;
  revealedBlocks: RevealBlock[];
  elapsed_time_ms: number[];
};

export type TranslationAuditCandidate = {
  questionId: string;
  partId?: string;
  itemType: TranslationAttemptItemType;
  category?: Category;
  topic?: string;
  attemptCount: number;
  revealBeforeSubmitCount: number;
  revealBeforeSubmitRate: number;
  correctAfterRevealCount: number;
  missedAfterRevealCount: number;
  incorrectAfterRevealRate: number;
  stem_excerpt: string;
  resolved: boolean;
};

export type TranslationFadeTrendRow = {
  category?: Category;
  topic: string;
  sessionBucketStart: number;
  sessionBucketEnd: number;
  attemptCount: number;
  revealBeforeSubmitCount: number;
  revealBeforeSubmitRate: number | null;
  lowSample: boolean;
};

export type TranslationFrictionDiagnostics = TranslationFrictionNormalizationDiagnostics & {
  revealEventCount: number;
  attemptCount: number;
  joinedEventCount: number;
  unjoinedRevealEventCount: number;
  unjoinedAttemptCount: number;
  unresolvedQuestionCount: number;
  duplicateJoinKeyCount: number;
  attemptSourceBreakdown: {
    standalone: number;
    casePart: number;
  };
  ineligibleAttemptCount: number;
};

export type TranslationFrictionSummary = {
  enrichedRows: EnrichedTranslationAttemptRow[];
  auditCandidates: TranslationAuditCandidate[];
  fadeTrend: TranslationFadeTrendRow[];
  diagnostics: TranslationFrictionDiagnostics;
};

export type SummarizeTranslationFrictionInput = {
  attempts: NormalizedAttempt[];
  events: TranslationRevealEvent[];
  questions: Question[];
  normalizationDiagnostics?: Partial<TranslationFrictionNormalizationDiagnostics>;
  minAuditAttempts?: number;
  topAuditCandidates?: number;
  sessionBucketSize?: number;
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

const REVEAL_BLOCK_ORDER: RevealBlock[] = [
  "stem",
  "choices",
  "exhibit",
  "case_stage",
  "rationale",
  "glossary",
  "other",
];

const UNKNOWN_TOPIC = "Unknown topic";
const UNRESOLVED_STEM_EXCERPT = "[unresolved question in current bank]";

type QuestionLookupInfo = {
  category: Category;
  topic: string;
  stemExcerpt: string;
};

const joinKey = (questionId: string, partId?: string) => `${questionId}\u0000${partId ?? ""}`;

const normalizeTopic = (topic: string | undefined) => topic?.trim() || UNKNOWN_TOPIC;

const stemExcerpt = (stem: string) => {
  const collapsed = stem.replace(/\s+/g, " ").trim();
  if (collapsed.length <= 180) return collapsed;
  return `${collapsed.slice(0, 177).trimEnd()}...`;
};

const buildQuestionLookup = (questions: Question[]) => {
  const resolved = new Map<string, QuestionLookupInfo>();
  const caseStudyIds = new Set<string>();
  for (const question of questions) {
    if (question.itemType === "case_study") {
      caseStudyIds.add(question.id);
      for (const part of question.caseStudy.questions) {
        resolved.set(joinKey(question.id, part.id), {
          category: part.category,
          topic: normalizeTopic(part.topic),
          stemExcerpt: stemExcerpt(part.stem.en),
        });
      }
      continue;
    }
    resolved.set(joinKey(question.id), {
      category: question.category,
      topic: normalizeTopic(question.topic),
      stemExcerpt: stemExcerpt(question.stem.en),
    });
  }
  return { resolved, caseStudyIds };
};

export const normalizeTranslationFrictionAttempts = ({
  answerEvents,
  caseAnswerPartEvents,
  questions,
}: {
  answerEvents: AnswerEvent[];
  caseAnswerPartEvents: CaseAnswerPartEvent[];
  questions: Question[];
}): TranslationFrictionNormalizationResult => {
  const { caseStudyIds } = buildQuestionLookup(questions);
  const diagnostics: TranslationFrictionNormalizationDiagnostics = {
    legacyUnjoinableAttemptCount: 0,
    excludedCaseTopLevelAnswerEventCount: 0,
  };
  const attempts: NormalizedAttempt[] = [];

  for (const event of answerEvents) {
    const { sessionId, sessionMode, languageModeAtAnswer } = event;
    if (!sessionId || !sessionMode || !languageModeAtAnswer) {
      diagnostics.legacyUnjoinableAttemptCount += 1;
      continue;
    }
    if (caseStudyIds.has(event.questionId)) {
      diagnostics.excludedCaseTopLevelAnswerEventCount += 1;
      continue;
    }
    attempts.push({
      questionId: event.questionId,
      itemType: "standalone",
      wasCorrect: event.wasCorrect,
      sessionId,
      sessionMode,
      languageModeAtAnswer,
      answeredAt: event.answeredAt,
    });
  }

  for (const event of caseAnswerPartEvents) {
    attempts.push({
      questionId: event.questionId,
      partId: event.partId,
      itemType: "case_part",
      wasCorrect: event.wasCorrect,
      sessionId: event.sessionId,
      sessionMode: event.sessionMode,
      languageModeAtAnswer: event.languageModeAtAnswer,
      answeredAt: event.answeredAt,
    });
  }

  return { attempts, diagnostics };
};

export const isTranslationRevealEligible = (
  sessionMode: SessionMode,
  languageModeAtAnswer: LanguageMode,
) => sessionMode === "study" && languageModeAtAnswer === "on-tap";

const compareRevealEvents = (left: TranslationRevealEvent, right: TranslationRevealEvent) =>
  left.revealedAt.localeCompare(right.revealedAt) ||
  REVEAL_BLOCK_ORDER.indexOf(left.block) - REVEAL_BLOCK_ORDER.indexOf(right.block) ||
  left.id.localeCompare(right.id);

const interpretationForBucket = (bucket: TranslationFrictionBucket) => {
  if (bucket === "correct_after_reveal") return "correct with pre-submit translation reveal";
  if (bucket === "missed_after_reveal") return "missed with pre-submit translation reveal";
  if (bucket === "correct_no_reveal") return "correct without pre-submit translation reveal";
  return "missed without pre-submit translation reveal";
};

const bucketForAttempt = (wasCorrect: boolean, hadRevealBeforeSubmit: boolean): TranslationFrictionBucket => {
  if (wasCorrect) return hadRevealBeforeSubmit ? "correct_after_reveal" : "correct_no_reveal";
  return hadRevealBeforeSubmit ? "missed_after_reveal" : "missed_no_reveal";
};

type RevealAggregate = {
  matchingRevealEvents: TranslationRevealEvent[];
  revealBeforeSubmitCount: number;
  hadRevealBeforeSubmit: boolean;
  firstRevealBeforeSubmitAt?: string;
  revealedBlocks: RevealBlock[];
  elapsed_time_ms: number[];
};

const aggregateReveals = (events: TranslationRevealEvent[]): RevealAggregate => {
  const matchingRevealEvents = [...events].sort(compareRevealEvents);
  const preSubmitEvents = matchingRevealEvents.filter((event) => event.submittedBeforeReveal === false);
  const firstSeenByBlock = new Map<RevealBlock, TranslationRevealEvent>();
  for (const event of matchingRevealEvents) {
    if (!firstSeenByBlock.has(event.block)) firstSeenByBlock.set(event.block, event);
  }
  const revealedBlocks = [...firstSeenByBlock.entries()]
    .sort(
      (left, right) =>
        compareRevealEvents(left[1], right[1]) ||
        REVEAL_BLOCK_ORDER.indexOf(left[0]) - REVEAL_BLOCK_ORDER.indexOf(right[0]),
    )
    .map(([block]) => block);

  return {
    matchingRevealEvents,
    revealBeforeSubmitCount: preSubmitEvents.length,
    hadRevealBeforeSubmit: preSubmitEvents.length > 0,
    firstRevealBeforeSubmitAt: preSubmitEvents[0]?.revealedAt,
    revealedBlocks,
    elapsed_time_ms: matchingRevealEvents
      .map((event) => event.elapsedMsOnQuestion)
      .filter((value) => Number.isFinite(value)),
  };
};

const resolveAttempt = (
  lookup: Map<string, QuestionLookupInfo>,
  attempt: Pick<NormalizedAttempt, "questionId" | "partId">,
) => lookup.get(joinKey(attempt.questionId, attempt.partId));

export const summarizeTranslationFriction = ({
  attempts,
  events,
  questions,
  normalizationDiagnostics = {},
  minAuditAttempts = 5,
  topAuditCandidates = 20,
  sessionBucketSize = 5,
}: SummarizeTranslationFrictionInput): TranslationFrictionSummary => {
  const { resolved: questionLookup } = buildQuestionLookup(questions);
  const normalizedDiagnostics: TranslationFrictionNormalizationDiagnostics = {
    legacyUnjoinableAttemptCount: normalizationDiagnostics.legacyUnjoinableAttemptCount ?? 0,
    excludedCaseTopLevelAnswerEventCount: normalizationDiagnostics.excludedCaseTopLevelAnswerEventCount ?? 0,
  };

  const eventsByKey = new Map<string, TranslationRevealEvent[]>();
  for (const event of events) {
    const key = joinKey(event.questionId, event.partId);
    const group = eventsByKey.get(key) ?? [];
    group.push(event);
    eventsByKey.set(key, group);
  }

  const attemptKeyCounts = new Map<string, number>();
  for (const attempt of attempts) {
    const key = joinKey(attempt.questionId, attempt.partId);
    attemptKeyCounts.set(key, (attemptKeyCounts.get(key) ?? 0) + 1);
  }

  const validAttemptKeys = new Set(attemptKeyCounts.keys());
  const joinedEventCount = events.filter((event) => validAttemptKeys.has(joinKey(event.questionId, event.partId))).length;
  const unjoinedAttemptCount = attempts.filter(
    (attempt) => (eventsByKey.get(joinKey(attempt.questionId, attempt.partId)) ?? []).length === 0,
  ).length;
  const duplicateJoinKeyCount = [...attemptKeyCounts.values()].reduce(
    (sum, count) => sum + Math.max(0, count - 1),
    0,
  );
  const ineligibleAttemptCount = attempts.filter(
    (attempt) => !isTranslationRevealEligible(attempt.sessionMode, attempt.languageModeAtAnswer),
  ).length;
  const attemptSourceBreakdown = {
    standalone: attempts.filter((attempt) => attempt.itemType === "standalone").length,
    casePart: attempts.filter((attempt) => attempt.itemType === "case_part").length,
  };

  const enrichedRows = attempts
    .filter((attempt) => isTranslationRevealEligible(attempt.sessionMode, attempt.languageModeAtAnswer))
    .map<EnrichedTranslationAttemptRow>((attempt) => {
      const revealAggregate = aggregateReveals(eventsByKey.get(joinKey(attempt.questionId, attempt.partId)) ?? []);
      const bucket = bucketForAttempt(attempt.wasCorrect, revealAggregate.hadRevealBeforeSubmit);
      return {
        ...attempt,
        ...revealAggregate,
        bucket,
        interpretation: interpretationForBucket(bucket),
      };
    });

  type CandidateAccumulator = {
    attemptCount: number;
    revealBeforeSubmitCount: number;
    correctAfterRevealCount: number;
    missedAfterRevealCount: number;
    attempt: NormalizedAttempt;
  };
  const candidateGroups = new Map<string, CandidateAccumulator>();
  for (const row of enrichedRows) {
    const key = joinKey(row.questionId, row.partId);
    const current = candidateGroups.get(key) ?? {
      attemptCount: 0,
      revealBeforeSubmitCount: 0,
      correctAfterRevealCount: 0,
      missedAfterRevealCount: 0,
      attempt: row,
    };
    current.attemptCount += 1;
    if (row.hadRevealBeforeSubmit) current.revealBeforeSubmitCount += 1;
    if (row.bucket === "correct_after_reveal") current.correctAfterRevealCount += 1;
    if (row.bucket === "missed_after_reveal") current.missedAfterRevealCount += 1;
    candidateGroups.set(key, current);
  }

  const auditCandidates = [...candidateGroups.values()]
    .filter((group) => group.attemptCount >= minAuditAttempts)
    .map<TranslationAuditCandidate>((group) => {
      const info = resolveAttempt(questionLookup, group.attempt);
      const revealBeforeSubmitRate = group.revealBeforeSubmitCount / group.attemptCount;
      const incorrectAfterRevealRate =
        group.revealBeforeSubmitCount > 0 ? group.missedAfterRevealCount / group.revealBeforeSubmitCount : 0;
      return {
        questionId: group.attempt.questionId,
        partId: group.attempt.partId,
        itemType: group.attempt.itemType,
        category: info?.category,
        topic: info?.topic,
        attemptCount: group.attemptCount,
        revealBeforeSubmitCount: group.revealBeforeSubmitCount,
        revealBeforeSubmitRate,
        correctAfterRevealCount: group.correctAfterRevealCount,
        missedAfterRevealCount: group.missedAfterRevealCount,
        incorrectAfterRevealRate,
        stem_excerpt: info?.stemExcerpt ?? UNRESOLVED_STEM_EXCERPT,
        resolved: Boolean(info),
      };
    })
    .sort(
      (left, right) =>
        right.revealBeforeSubmitRate - left.revealBeforeSubmitRate ||
        right.revealBeforeSubmitCount - left.revealBeforeSubmitCount ||
        right.incorrectAfterRevealRate - left.incorrectAfterRevealRate ||
        left.questionId.localeCompare(right.questionId) ||
        (left.partId ?? "").localeCompare(right.partId ?? ""),
    )
    .slice(0, topAuditCandidates);

  const earliestBySession = new Map<string, string>();
  for (const attempt of attempts) {
    if (!attempt.sessionId || Number.isNaN(Date.parse(attempt.answeredAt))) continue;
    const current = earliestBySession.get(attempt.sessionId);
    if (!current || attempt.answeredAt < current) earliestBySession.set(attempt.sessionId, attempt.answeredAt);
  }
  const sessionOrdinal = new Map<string, number>();
  [...earliestBySession.entries()]
    .sort((left, right) => left[1].localeCompare(right[1]) || left[0].localeCompare(right[0]))
    .forEach(([sessionId], index) => sessionOrdinal.set(sessionId, index + 1));

  const safeBucketSize = Math.max(1, Math.floor(sessionBucketSize));
  const maxBucketIndex = Math.max(0, ...[...sessionOrdinal.values()].map((ordinal) => Math.floor((ordinal - 1) / safeBucketSize)));
  const comboKeys = new Map<string, { category?: Category; topic: string }>();
  for (const attempt of attempts) {
    const info = resolveAttempt(questionLookup, attempt);
    const category = info?.category;
    const topic = info?.topic ?? UNKNOWN_TOPIC;
    comboKeys.set(`${category ?? ""}\u0000${topic}`, { category, topic });
  }

  const rowKey = (category: Category | undefined, topic: string, bucketIndex: number) =>
    `${category ?? ""}\u0000${topic}\u0000${bucketIndex}`;
  const fadeCounts = new Map<string, { attemptCount: number; revealBeforeSubmitCount: number }>();
  for (const row of enrichedRows) {
    const ordinal = sessionOrdinal.get(row.sessionId);
    if (!ordinal) continue;
    const info = resolveAttempt(questionLookup, row);
    const category = info?.category;
    const topic = info?.topic ?? UNKNOWN_TOPIC;
    const bucketIndex = Math.floor((ordinal - 1) / safeBucketSize);
    const key = rowKey(category, topic, bucketIndex);
    const current = fadeCounts.get(key) ?? { attemptCount: 0, revealBeforeSubmitCount: 0 };
    current.attemptCount += 1;
    if (row.hadRevealBeforeSubmit) current.revealBeforeSubmitCount += 1;
    fadeCounts.set(key, current);
  }

  const fadeTrend: TranslationFadeTrendRow[] = [];
  for (const combo of comboKeys.values()) {
    for (let bucketIndex = 0; bucketIndex <= maxBucketIndex; bucketIndex += 1) {
      const counts = fadeCounts.get(rowKey(combo.category, combo.topic, bucketIndex)) ?? {
        attemptCount: 0,
        revealBeforeSubmitCount: 0,
      };
      fadeTrend.push({
        category: combo.category,
        topic: combo.topic,
        sessionBucketStart: bucketIndex * safeBucketSize + 1,
        sessionBucketEnd: (bucketIndex + 1) * safeBucketSize,
        attemptCount: counts.attemptCount,
        revealBeforeSubmitCount: counts.revealBeforeSubmitCount,
        revealBeforeSubmitRate:
          counts.attemptCount > 0 ? counts.revealBeforeSubmitCount / counts.attemptCount : null,
        lowSample: counts.attemptCount < safeBucketSize,
      });
    }
  }
  fadeTrend.sort(
    (left, right) =>
      left.topic.localeCompare(right.topic) ||
      (left.category ?? "").localeCompare(right.category ?? "") ||
      left.sessionBucketStart - right.sessionBucketStart,
  );

  const unresolvedQuestionCount = new Set(
    [...enrichedRows, ...auditCandidates].flatMap((row) => {
      if (resolveAttempt(questionLookup, row)) return [];
      return [joinKey(row.questionId, row.partId)];
    }),
  ).size;

  return {
    enrichedRows,
    auditCandidates,
    fadeTrend,
    diagnostics: {
      revealEventCount: events.length,
      attemptCount: attempts.length,
      joinedEventCount,
      unjoinedRevealEventCount: events.length - joinedEventCount,
      unjoinedAttemptCount,
      unresolvedQuestionCount,
      duplicateJoinKeyCount,
      attemptSourceBreakdown,
      ineligibleAttemptCount,
      ...normalizedDiagnostics,
    },
  };
};
