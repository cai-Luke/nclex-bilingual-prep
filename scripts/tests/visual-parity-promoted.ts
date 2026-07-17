import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { Question, QuestionVisual } from "../../src/types";
import {
  buildPromotedVisualRecords,
} from "../promoted-visual-parity";
import {
  assertRecognizedProofSurface,
  assertRemovedDeltaEvidence,
  assertTracingToolsAvailable,
  buildOrdinaryDeltas,
  buildParityState,
  hasActiveBaseline,
  LEGACY_SNAPSHOT_PATH,
  renderStateAtRef,
  resolveBeforeRef,
  selectRebaselineMode,
  serializeSnapshotFiles,
  snapshotRecord,
  stableJson,
  stripReceiptVolatile,
  verifyCommittedPromotedBaseline,
  verifySnapshotParity,
  withTemporaryWorktree,
  writeTracingArtifacts,
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
assert.throws(
  () => assertRecognizedProofSurface("exact", "io_record", [], []),
  /no recognized keyed arithmetic/,
);
assert.doesNotThrow(() =>
  assertRecognizedProofSurface("exact", "io_record", ["derived_values_keyed"], ["intake_total_ml"])
);
assert.throws(
  () => assertRecognizedProofSurface("device", "device_screen", [], []),
  /device_screen.*no recognized proof surface/,
);
assert.doesNotThrow(() =>
  assertRecognizedProofSurface("device", "device_screen", ["keyed_settings"], [])
);
assert.throws(
  () => assertRecognizedProofSurface("trend", "io_trend", [], []),
  /io_trend.*no recognized proof surface/,
);
assert.doesNotThrow(() =>
  assertRecognizedProofSurface("trend", "io_trend", ["expected_trend"], [])
);
assert.throws(
  () => assertRecognizedProofSurface("mar", "mar", [], []),
  /mar.*no recognized proof surface/,
);
assert.doesNotThrow(() =>
  assertRecognizedProofSurface("mar", "mar", ["keyed_cells"], [])
);

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
const rendererDelta = buildOrdinaryDeltas(
  [one],
  [changed],
  ["rhythm_strip"],
  ["src/visuals/kinds/rhythmStrip.ts"],
);
assert.equal(rendererDelta.changed[0]?.cause, "renderer");
const addedDelta = buildOrdinaryDeltas(
  [],
  [one],
  ["rhythm_strip"],
  ["banks/visual-canonical.json"],
);
assert.equal(addedDelta.added[0]?.cause, "content");
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
assert.throws(
  () => assertRemovedDeltaEvidence({ parityId: "removed" }),
  /lacks prior proof or removal reason/,
);

assert.equal(selectRebaselineMode(false, null), "bootstrap");
assert.equal(selectRebaselineMode(true, "initial-receipt.json"), "ordinary");
assert.throws(
  () => selectRebaselineMode(false, "initial-receipt.json"),
  /bootstrap cannot run again/,
);

await assert.rejects(
  assertTracingToolsAvailable(""),
  /missing tracing artifact command\(s\): rsvg-convert, magick.*required only for tracing rebaseline artifacts/,
);
const tracingPreflightRoot = await mkdtemp(join(tmpdir(), "promoted-parity-tracing-preflight-"));
try {
  const receiptDirectory = join(tracingPreflightRoot, "receipt");
  await assert.rejects(
    writeTracingArtifacts(
      receiptDirectory,
      {
        changed: [{
          parityId: "one",
          kind: "rhythm_strip",
          location: "question",
          bank: "visual-canonical.json",
          before: one.svgHash,
          after: changed.svgHash,
          cause: "renderer",
        }],
        added: [],
        removed: [],
      },
      [one],
      [changed],
      "",
    ),
    /missing tracing artifact command\(s\): rsvg-convert, magick.*no receipt or partial evidence was written/,
  );
  await assert.rejects(access(receiptDirectory));
} finally {
  await rm(tracingPreflightRoot, { recursive: true, force: true });
}

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
assert.equal(resolveBeforeRef("HEAD"), head, "before-ref must resolve to an exact commit SHA");
await assert.rejects(
  withTemporaryWorktree(head, async (worktree) => {
    await assert.rejects(access(join(worktree, "node_modules")));
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

const legacySnapshot = JSON.parse(await readFile(LEGACY_SNAPSHOT_PATH, "utf8")) as Record<string, unknown>;
assert.equal(Object.hasOwn(legacySnapshot, "svgHashes"), false);
assert.equal(Array.isArray(legacySnapshot.validationReasons) ? legacySnapshot.validationReasons.length : 0, 11);
const initialReceipt = JSON.parse(
  await readFile("audit/visual-parity-rebaseline-2026-07-17-initial/receipt.json", "utf8"),
) as {
  initialBaseline?: { bootstrap?: boolean };
  u0Migration?: { allEqual?: boolean; allStructurallyEligible?: boolean; migrated?: Array<{ equal?: boolean }> };
};
assert.equal(initialReceipt.initialBaseline?.bootstrap, true);
assert.equal(initialReceipt.u0Migration?.allEqual, true);
assert.equal(initialReceipt.u0Migration?.allStructurallyEligible, true);
assert.equal(initialReceipt.u0Migration?.migrated?.length, 3);
assert(initialReceipt.u0Migration?.migrated?.every((record) => record.equal === true));

console.log("promoted visual parity tests passed (199 snapshots, bootstrap/steady-state mechanics, clean before-ref worktree)");
