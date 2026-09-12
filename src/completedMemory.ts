import type { Question, CompletedSet, StoredSessionSnapshot, SubmittedAttempt } from "./types";
import { getInitialAnswer, gradeQuestion, scoreQuestion, type AnswerState } from "./grading";

// Only question-level teaching/metadata is omitted. Visual and exhibit inputs are complete.
const answerSurface = (q: Question): unknown => {
  const {
    rationale: _r,
    testTakingStrategy: _s,
    glossary: _g,
    category: _c,
    topic: _t,
    difficulty: _d,
    ngnSkill: _n,
    ...surface
  } = q;
  if (q.itemType === "case_study")
    return {
      ...surface,
      caseStudy: { ...q.caseStudy, questions: q.caseStudy.questions.map(answerSurface) },
    };
  return surface;
};
const canonical = (value: unknown): unknown => {
  if (typeof value === "string") return value.trim();
  // Preserve response and presentation array order, including ordered-response keys.
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([k, v]) => [k, canonical(v)]),
    );
  return value;
};
export const questionFingerprint = (q: Question): string => {
  const json = JSON.stringify(canonical(answerSurface(q)));
  let hash = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(json))
    hash = BigInt.asUintN(64, (hash ^ BigInt(byte)) * 0x100000001b3n);
  return `fnv1a64-v1:${hash.toString(16).padStart(16, "0")}`;
};
export const submissionIdentity = (sessionId: string, questionId: string) =>
  JSON.stringify([sessionId, questionId]);
export const captureAttempt = (
  session: StoredSessionSnapshot,
  question: Question,
  answer: AnswerState,
): SubmittedAttempt => ({
  submissionId: submissionIdentity(session.id, question.id),
  answer: structuredClone(answer),
  submittedAt: new Date().toISOString(),
  languageMode: session.languageMode,
  result: gradeQuestion(question, answer),
  score: scoreQuestion(question, answer),
  ...(question.itemType === "case_study"
    ? {
        parts: Object.fromEntries(
          question.caseStudy.questions.map((part) => {
            const partAnswer = answer.caseStudy?.[part.id] ?? getInitialAnswer(part);
            return [
              part.id,
              { result: gradeQuestion(part, partAnswer), score: scoreQuestion(part, partAnswer) },
            ];
          }),
        ),
      }
    : {}),
});
export const makeCompletedSet = (
  session: StoredSessionSnapshot,
  endReason: CompletedSet["endReason"],
): CompletedSet => ({
  id: "last",
  version: 1,
  sessionId: session.id,
  startedAt: session.startedAt,
  completedAt: new Date().toISOString(),
  title: session.title,
  endReason,
  languageMode: session.languageMode,
  requestedCount: session.requestedCount ?? session.questionIds.length,
  deliveredCount: session.questionIds.length,
  entries: session.questionIds.map((questionId) => {
    const attempt = session.attempts?.[questionId];
    const legacy = Object.prototype.hasOwnProperty.call(session.results, questionId) && !attempt;
    return {
      questionId,
      fingerprint: session.fingerprints?.[questionId],
      status: attempt
        ? "submitted"
        : legacy
          ? "legacy-unverified"
          : session.skippedQuestionIds?.includes(questionId)
            ? "skipped"
            : "not-submitted",
      ...(attempt
        ? { attempt }
        : legacy
          ? { legacyOutcome: { result: session.results[questionId], score: session.scores?.[questionId] } }
          : { draft: session.answers[questionId] as AnswerState | undefined }),
    };
  }),
});
export const entryCompatibility = (entry: CompletedSet["entries"][number], question?: Question) =>
  !question
    ? "deleted"
    : !entry.fingerprint
      ? "legacy-unverified"
      : entry.fingerprint === questionFingerprint(question)
        ? "match"
        : "changed";

/** Validate identity-bearing draft fields without requiring completeness or grading. */
export const answerFitsQuestion = (q: Question, answer: AnswerState): boolean => {
  if (!answer || typeof answer !== "object" || Array.isArray(answer)) return false;
  const subset = (values: unknown, ids: string[]) =>
    Array.isArray(values) && values.every((v) => typeof v === "string" && ids.includes(v));
  const entries = (value: unknown): [string, unknown][] | null =>
    value && typeof value === "object" && !Array.isArray(value) ? Object.entries(value) : null;
  switch (q.itemType) {
    case "multiple_choice":
    case "select_all":
    case "ordered_response":
      return (
        answer.optionIds === undefined ||
        subset(
          answer.optionIds,
          q.options.map((o) => o.id),
        )
      );
    case "highlight":
      return (
        answer.segments === undefined ||
        subset(
          answer.segments,
          q.highlight.segments.filter((s) => s.selectable).map((s) => s.id),
        )
      );
    case "fill_in_blank":
      return (
        answer.blanks === undefined ||
        Boolean(
          entries(answer.blanks)?.every(
            ([id, v]) => q.blanks.some((b) => b.id === id) && typeof v === "string",
          ),
        )
      );
    case "matrix":
      return (
        answer.matrix === undefined ||
        Boolean(
          entries(answer.matrix)?.every(
            ([id, v]) =>
              q.matrix.rows.some((r) => r.id === id) &&
              subset(
                v,
                q.matrix.columns.map((c) => c.id),
              ),
          ),
        )
      );
    case "dropdown_cloze":
      return (
        answer.dropdowns === undefined ||
        Boolean(
          entries(answer.dropdowns)?.every(([id, v]) =>
            q.dropdowns.some((d) => d.id === id && d.options.some((o) => o.id === v)),
          ),
        )
      );
    case "bowtie":
      return (
        answer.bowtie === undefined ||
        Boolean(
          entries(answer.bowtie)?.every(
            ([zone, v]) =>
              ["condition", "actions", "parameters"].includes(zone) &&
              subset(
                v,
                q.bowtie[zone as keyof typeof q.bowtie].tokens.map((t) => t.id),
              ),
          ),
        )
      );
    case "case_study":
      return (
        answer.caseStudy === undefined ||
        Boolean(
          entries(answer.caseStudy)?.every(([id, v]) => {
            const part = q.caseStudy.questions.find((p) => p.id === id);
            return part && answerFitsQuestion(part, v as AnswerState);
          }),
        )
      );
  }
};
