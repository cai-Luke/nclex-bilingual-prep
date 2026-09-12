import type { AnswerEvent, QuestionProgress } from "./types";

type LegacyProgress = Partial<QuestionProgress> & {
  questionId: string;
  missed?: boolean;
  correctStreak?: number;
};
export const migrateProgress = (row: LegacyProgress, events: AnswerEvent[]): QuestionProgress => {
  if (typeof row.needsReview === "boolean") return row as QuestionProgress;
  const validCounts =
    [row.seen, row.correct, row.incorrect].every((n) => Number.isInteger(n) && n! >= 0) &&
    row.seen === row.correct! + row.incorrect!;
  const validStreak =
    Number.isInteger(row.correctStreak) &&
    row.correctStreak! >= 0 &&
    row.correctStreak! <= (row.correct ?? -1);
  const coherentLegacyOutcome = row.seen === 0
    ? row.correctStreak === 0 && row.missed === false
    : row.correctStreak === 0
      ? row.missed === true && (row.incorrect ?? 0) > 0
      : row.missed === false || row.correctStreak === 1 && (row.incorrect ?? 0) > 0;
  let needsReview = Boolean(row.missed);
  let migrationDiagnostic: string | undefined;
  if (validCounts && validStreak && typeof row.missed === "boolean" && coherentLegacyOutcome) {
    needsReview = row.correctStreak! >= 1 ? false : row.missed;
  } else {
    const timed = events.filter(
      (e) => e.questionId === row.questionId && Number.isFinite(Date.parse(e.answeredAt)),
    );
    const latestTime = Math.max(...timed.map((e) => Date.parse(e.answeredAt)));
    const latest = timed.filter((e) => Date.parse(e.answeredAt) === latestTime);
    if (
      Number.isFinite(latestTime) &&
      latestTime === Date.parse(row.lastSeenAt ?? "") &&
      latest.length > 0 &&
      latest.every((e) => typeof e.wasCorrect === "boolean" && e.wasCorrect === latest[0].wasCorrect)
    ) {
      needsReview = !latest[0].wasCorrect;
    } else migrationDiagnostic = "Legacy outcome ambiguous; preserved the previous missed boolean.";
  }
  // Retain legacy columns inert in the upgrade transaction. Runtime never consumes them.
  return {
    ...row,
    seen: row.seen ?? 0,
    correct: row.correct ?? 0,
    incorrect: row.incorrect ?? 0,
    needsReview,
    ...(migrationDiagnostic ? { migrationDiagnostic } : {}),
  } as QuestionProgress;
};
