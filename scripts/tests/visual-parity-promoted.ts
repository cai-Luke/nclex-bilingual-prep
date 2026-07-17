import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Question, QuestionVisual } from "../../src/types";
import {
  buildPromotedVisualRecords,
  type PromotedVisualRecord,
} from "../promoted-visual-parity";
import {
  buildOrdinaryDeltas,
  buildParityState,
  hasActiveBaseline,
  renderStateAtRef,
  serializeSnapshotFiles,
  snapshotRecord,
  stableJson,
  stripReceiptVolatile,
  verifyCommittedPromotedBaseline,
  verifySnapshotParity,
  withTemporaryWorktree,
  type ParityStateRecord,
} from "../visual-parity-baseline";

const pair = (text: string) => ({ en: text, zh: `测试：${text}` });
const rhythm = (): QuestionVisual => ({
  kind: "rhythm_strip",
  rhythm: "sinus",
  rateBpm: 72,
  durationSec: 6,
  seed: 20260717,
});

const optionQuestion = (id: string, withVisuals: boolean = false): Question => ({
  id,
  itemType: "multiple_choice",
  category: "Physiological Adaptation",
  topic: "Cardiac Rhythm Interpretation",
  difficulty: "medium",
  stem: pair("Which finding is present?"),
  rationale: {
    correct: pair("The finding is visible."),
    byChoice: [
      { refId: "A", ...pair("Correct finding.") },
      { refId: "B", ...pair("Incorrect finding.") },
      { refId: "C", ...pair("Another incorrect finding.") },
    ],
    ...(withVisuals ? { visuals: [rhythm()] } : {}),
  },
  testTakingStrategy: pair("Inspect the tracing."),
  glossary: [],
  options: [
    { id: "A", ...pair("Finding A") },
    { id: "B", ...pair("Finding B") },
    { id: "C", ...pair("Finding C") },
  ],
  correct: ["A"],
  ...(withVisuals ? { visual: rhythm() } : {}),
});

const top = optionQuestion("baseline_top", true);
const leaf = optionQuestion("baseline_leaf", true);
const caseQuestion = {
  id: "baseline_case",
  itemType: "case_study",
  category: "Physiological Adaptation",
  topic: "Cardiac Rhythm Interpretation",
  difficulty: "medium",
  stem: pair("Review the case."),
  rationale: { correct: pair("Use the evidence.") },
  testTakingStrategy: pair("Review each exhibit."),
  glossary: [],
  caseStudy: {
    title: pair("Synthetic parity case"),
    exhibits: [{ id: "baseline", title: pair("Baseline"), content: pair("Data"), visual: rhythm() }],
    stages: [{
      id: "stage_1",
      title: pair("Stage 1"),
      exhibits: [{ id: "update", title: pair("Update"), content: pair("Data"), visual: rhythm() }],
    }],
    questions: [leaf, optionQuestion("baseline_control")],
  },
} as unknown as Question;

const fixtureRecords = buildPromotedVisualRecords([{
  bank: "fixture.json",
  raw: { meta: { schemaVersion: "2.0", count: 2 }, questions: [top, caseQuestion] },
}]);
assert.deepEqual(
  fixtureRecords.map((record) => record.ref.location).sort(),
  ["caseExhibit", "caseQuestion", "caseQuestionRationale", "caseStageExhibit", "question", "questionRationale"].sort(),
);
assert.equal(buildParityState(fixtureRecords).length, 6);

assert.throws(
  () => buildPromotedVisualRecords([{
    bank: "invalid.json",
    raw: { meta: { schemaVersion: "2.0", count: 1 }, questions: [] },
  }]),
  /failed validation/,
);
assert.throws(
  () => buildPromotedVisualRecords([
    { bank: "first.json", raw: { meta: { schemaVersion: "2.0", count: 1 }, questions: [top] } },
    { bank: "second.json", raw: { meta: { schemaVersion: "2.0", count: 1 }, questions: [top] } },
  ]),
  /duplicate parityId/,
);

const state = (
  parityId: string,
  options: Partial<ParityStateRecord> = {},
): ParityStateRecord => ({
  parityId,
  kind: "rhythm_strip",
  location: "question",
  bank: "visual-canonical.json",
  parentQuestionId: parityId,
  ownerId: parityId,
  svgHash: "a".repeat(64),
  recognizedProofSurfaces: [],
  selfCheckErrors: [],
  svg: "<svg/>",
  ...options,
});

const one = state("one");
const serializedOnce = serializeSnapshotFiles([one], ["rhythm_strip"]);
const serializedTwice = serializeSnapshotFiles([one], ["rhythm_strip"]);
assert.deepEqual([...serializedOnce], [...serializedTwice], "snapshot regeneration must be byte-idempotent");
assert(stableJson({ z: 1, a: { y: 2, b: 3 } }).indexOf('"a"') < stableJson({ z: 1, a: { y: 2, b: 3 } }).indexOf('"z"'));

const expected = snapshotRecord(one);
verifySnapshotParity([one], ["rhythm_strip"], [expected], ["rhythm_strip"]);
assert.throws(
  () => verifySnapshotParity([one], ["rhythm_strip"], [], ["rhythm_strip"]),
  /missing snapshot record one/,
);
assert.throws(
  () => verifySnapshotParity([], ["rhythm_strip"], [expected], ["rhythm_strip"]),
  /stale snapshot record one/,
);
assert.throws(
  () => verifySnapshotParity([one], ["rhythm_strip"], [{ ...expected, svgHash: "b".repeat(64) }], ["rhythm_strip"]),
  /SVG hash drift for one/,
);

const changed = state("one", { svgHash: "b".repeat(64) });
assert.throws(
  () => buildOrdinaryDeltas([one], [changed], [], ["banks/visual-canonical.json"]),
  /out-of-scope changed/,
);
assert.throws(
  () => buildOrdinaryDeltas([], [one], [], ["banks/visual-canonical.json"]),
  /out-of-scope added/,
);
assert.throws(
  () => buildOrdinaryDeltas([one], [], [], ["banks/visual-canonical.json"]),
  /out-of-scope removed/,
);
assert.throws(
  () => buildOrdinaryDeltas([], [one], ["rhythm_strip"], ["banks/unrelated.json"]),
  /identity drift.*banks\/visual-canonical\.json did not change/,
);
assert.throws(
  () => buildOrdinaryDeltas([one], [], ["rhythm_strip"], ["banks/unrelated.json"]),
  /identity drift.*banks\/visual-canonical\.json did not change/,
);

const contentDelta = buildOrdinaryDeltas(
  [one],
  [changed],
  ["rhythm_strip"],
  ["banks/visual-canonical.json"],
);
assert.equal(contentDelta.changed[0]?.cause, "content");
assert.throws(
  () => buildOrdinaryDeltas(
    [one],
    [changed],
    ["rhythm_strip"],
    ["banks/visual-canonical.json", "src/visuals/kinds/rhythmStrip.ts"],
  ),
  /ambiguous renderer\/content cause/,
);

const keyedBefore = state("keyed", {
  kind: "io_record",
  bank: "io-canonical.json",
  declaredKeyed: { intake_total_ml: 100 },
  recognizedProofSurfaces: ["derived_values_keyed"],
});
const keyedAfter = state("keyed", {
  kind: "io_record",
  bank: "io-canonical.json",
  svgHash: "b".repeat(64),
  declaredKeyed: { intake_total_ml: 200 },
  recognizedProofSurfaces: ["derived_values_keyed"],
});
assert.throws(
  () => buildOrdinaryDeltas([keyedBefore], [keyedAfter], ["io_record"], ["banks/io-canonical.json"]),
  /declaredKeyed changed/,
);

const removal = buildOrdinaryDeltas(
  [keyedBefore],
  [],
  ["io_record"],
  ["banks/io-canonical.json"],
).removed[0];
assert.deepEqual(removal?.priorProofSurface, ["derived_values_keyed"]);
assert.equal(removal?.removalReason, "record removed from banks/io-canonical.json");

assert.deepEqual(
  stripReceiptVolatile({ generatedAt: "first", inputGitSha: "one", stable: true }),
  stripReceiptVolatile({ generatedAt: "second", inputGitSha: "two", stable: true }),
);

const temp = await mkdtemp(join(tmpdir(), "promoted-parity-test-"));
try {
  const snapshots = join(temp, "snapshots");
  await mkdir(snapshots);
  assert.equal(await hasActiveBaseline(snapshots), false);
  await writeFile(join(snapshots, "rhythm_strip.json"), "{}\n", "utf8");
  assert.equal(await hasActiveBaseline(snapshots), true);
} finally {
  await rm(temp, { recursive: true, force: true });
}

const worktreesBefore = execFileSync("git", ["worktree", "list", "--porcelain"], { encoding: "utf8" });
const head = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
await assert.rejects(
  withTemporaryWorktree(head, async () => {
    throw new Error("synthetic callback failure");
  }),
  /synthetic callback failure/,
);
const worktreesAfterFailure = execFileSync("git", ["worktree", "list", "--porcelain"], { encoding: "utf8" });
assert.equal(worktreesAfterFailure, worktreesBefore, "failed callbacks must not leave a registered worktree");

const beforeState = await renderStateAtRef(head);
assert.equal(beforeState.length, 199, "the before-ref worktree must render the old source tree and full bank population");
const worktreesAfterSuccess = execFileSync("git", ["worktree", "list", "--porcelain"], { encoding: "utf8" });
assert.equal(worktreesAfterSuccess, worktreesBefore, "successful renders must not leave a registered worktree");

const liveCount = await verifyCommittedPromotedBaseline();
assert.equal(liveCount, 199);

console.log("promoted visual parity tests passed (199 snapshots, bootstrap/steady-state mechanics, clean before-ref worktree)");
