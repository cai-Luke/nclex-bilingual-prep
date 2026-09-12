import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  captureAttempt,
  questionFingerprint,
  entryCompatibility,
  answerFitsQuestion,
  makeCompletedSet,
} from "../../src/completedMemory";
import { migrateProgress } from "../../src/progressMigration";
import { getCorrectAnswer, getInitialAnswer } from "../../src/grading";
import type { Question, StoredSessionSnapshot, AnswerEvent } from "../../src/types";
const bank = JSON.parse(readFileSync("banks/gemini-canonical.json", "utf8")).questions as Question[];
const q = bank.find((q) => q.itemType === "ordered_response")!;
const snapshot: StoredSessionSnapshot = {
  id: "s",
  mode: "study",
  questionIds: [q.id],
  poolIds: [q.id],
  index: 0,
  answers: {},
  results: {},
  scores: {},
  languageMode: "on-tap",
  startedAt: "2026-09-12",
  updatedAt: "2026-09-12",
  title: "Test",
  launchIntent: "ordinary",
  fingerprints: { [q.id]: questionFingerprint(q) },
};
const initial = getInitialAnswer(q);
const attempt = captureAttempt(snapshot, q, initial);
initial.optionIds?.reverse();
assert.notDeepEqual(
  initial,
  attempt.answer,
  "submission captures initialized answer, detached from draft edits",
);
const completed = makeCompletedSet(
  {
    ...snapshot,
    attempts: { [q.id]: attempt },
    results: { [q.id]: attempt.result },
    scores: { [q.id]: attempt.score },
  },
  "finished",
);
assert.deepEqual(completed.entries[0].attempt?.answer, attempt.answer);
assert.equal(entryCompatibility(completed.entries[0], q), "match");
assert.equal(entryCompatibility(completed.entries[0]), "deleted");
const teaching = structuredClone(q);
teaching.rationale.correct.en += " editorial";
teaching.testTakingStrategy.zh += "教学";
teaching.glossary = [];
teaching.topic = "Changed";
assert.equal(questionFingerprint(q), questionFingerprint(teaching), "teaching and metadata excluded");
const trimmed = structuredClone(q);
trimmed.stem.en = `  ${trimmed.stem.en}  `;
assert.equal(questionFingerprint(q), questionFingerprint(trimmed));
const mutations: ((q: any) => void)[] = [
  (q) => (q.stem.zh += "字"),
  (q) => (q.options[0].en += " answer"),
  (q) => q.options.reverse(),
  (q) => q.correct.reverse(),
  (q) => (q.options[0].id = "changed"),
  (q) => (q.visual = { kind: "test", seed: 3 }),
];
for (const mutate of mutations) {
  const changed = structuredClone(q);
  mutate(changed);
  assert.notEqual(questionFingerprint(q), questionFingerprint(changed));
  assert.equal(entryCompatibility(completed.entries[0], changed), "changed");
}
for (const type of [
  "case_study",
  "matrix",
  "highlight",
  "dropdown_cloze",
  "bowtie",
  "fill_in_blank",
] as const) {
  const question = bank.find((q) => q.itemType === type)!;
  assert.ok(question);
  assert.equal(answerFitsQuestion(question, getCorrectAnswer(question)), true);
  const changed = structuredClone(question);
  if (changed.itemType === "case_study") changed.caseStudy.questions[0].stem.zh += "changed";
  else changed.stem.en += "changed";
  assert.notEqual(questionFingerprint(question), questionFingerprint(changed));
}
assert.equal(answerFitsQuestion(q, { optionIds: ["missing-id"] }), false);
const row = {
  questionId: "legacy",
  seen: 2,
  correct: 1,
  incorrect: 1,
  missed: true,
  correctStreak: 1,
  lastSeenAt: "2026-09-12T00:00:00Z",
};
assert.equal(migrateProgress(row, []).needsReview, false, "one-correct legacy row clears");
assert.equal(migrateProgress({ ...row, correctStreak: 0 }, []).needsReview, true);
assert.equal(
  migrateProgress({ ...row, missed: false, correctStreak: 0 }, []).needsReview,
  false,
  "lifetime misses never resurrect clear state",
);
const ambiguous = { ...row, correctStreak: undefined };
assert.ok(migrateProgress(ambiguous, []).migrationDiagnostic);
const event: AnswerEvent = {
  id: "e",
  questionId: row.questionId,
  answeredAt: row.lastSeenAt,
  wasCorrect: true,
};
assert.equal(migrateProgress(ambiguous, [event]).needsReview, false);
assert.equal(
  migrateProgress(ambiguous, [event, { ...event, id: "conflict", wasCorrect: false }]).needsReview,
  true,
  "ambiguous ties preserve old truth",
);
assert.ok(
  migrateProgress(ambiguous, [{ ...event, answeredAt: "2020-01-01" }]).migrationDiagnostic,
  "stale event cannot establish last outcome",
);
assert.equal(migrateProgress(migrateProgress(row, []), []).needsReview, false, "idempotent migration");
assert.equal(
  completed.entries[0].attempt?.score.earned,
  attempt.score.earned,
  "history preserves original score",
);
console.log(
  "completed memory: captured payload, all fingerprint branches, draft identity, migration ambiguity passed",
);

assert.ok(migrateProgress({...row,seen:3,correct:2,incorrect:1,correctStreak:2},[]).migrationDiagnostic,'two-success residual missed is contradictory, not a valid legacy row');
assert.equal(migrateProgress({...row,seen:3,correct:2,incorrect:1,correctStreak:2},[event]).needsReview,false,'timed top-level event resolves contradictory legacy fields');
