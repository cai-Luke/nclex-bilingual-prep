import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import assert from "node:assert/strict";
import { emitQueue, ingestResults } from "../topic-residual-proposals";

const writeJson = (path: string, value: unknown) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`);

const tempRoot = await mkdtemp(join(tmpdir(), "topic-residual-proposals-"));

const banksDir = join(tempRoot, "banks");
await mkdir(banksDir);
const inputFile = join(tempRoot, "residual.json");
const geminiFile = join(tempRoot, "proposal_manifest_gemini.json");
const queueFile = join(tempRoot, "queue.json");
const resultsFile = join(tempRoot, "results.json");
const manifestFile = join(tempRoot, "manifest.json");
const reportFile = join(tempRoot, "report.md");

const baseQuestion = {
  itemType: "multiple_choice",
  difficulty: "medium",
  stem: { en: "Which action protects the client's legal right?", zh: "zh" },
  rationale: { correct: { en: "The correct answer protects the client's legal right.", zh: "zh" } },
  testTakingStrategy: { en: "Use client rights principles.", zh: "zh" },
  glossary: [],
  options: [
    { id: "A", en: "Respect the client's informed refusal.", zh: "zh" },
    { id: "B", en: "Tell the family to decide.", zh: "zh" },
  ],
  correct: ["A"],
};

await writeJson(join(banksDir, "fixture-canonical.json"), {
  meta: { schemaVersion: "1.5", count: 3 },
  questions: [
    {
      ...baseQuestion,
      id: "q_queued",
      category: "Management of Care",
      topic: "client rights",
    },
    {
      ...baseQuestion,
      id: "q_already",
      category: "Safety and Infection Control",
      topic: "Patient & Environment Safety",
    },
    {
      id: "case_parent",
      itemType: "case_study",
      category: "Psychosocial Integrity",
      topic: "family coping",
      difficulty: "hard",
      stem: { en: "Read the case.", zh: "zh" },
      rationale: { correct: { en: "Parent rationale.", zh: "zh" } },
      testTakingStrategy: { en: "Follow the case.", zh: "zh" },
      glossary: [],
      caseStudy: {
        title: { en: "Caregiver conflict case", zh: "zh" },
        exhibits: [],
        questions: [
          {
            ...baseQuestion,
            id: "q_conflict",
            category: "Management of Care",
            topic: "handoff",
          },
        ],
      },
    },
  ],
});

await writeJson(inputFile, [
  { id: "q_queued", category: "Management of Care", oldTopic: "client rights", context: { stem: "stale", correctOptionText: "", rationale: "", parentContext: "" } },
  { id: "q_already", category: "Safety and Infection Control", oldTopic: "patient & environment safety", context: { stem: "stale", correctOptionText: "", rationale: "", parentContext: "" } },
  { id: "q_conflict", category: "Management of Care", oldTopic: "handoff", context: { stem: "stale", correctOptionText: "", rationale: "", parentContext: "stale" } },
  { id: "q_missing", category: "Management of Care", oldTopic: "unknown", context: { stem: "bare stem", correctOptionText: "", rationale: "", parentContext: "" } },
]);
await writeJson(geminiFile, { 0: { id: "gemini_only" } });

const queue = await emitQueue({
  inputFile,
  geminiManifestFile: geminiFile,
  banksDir,
  outputPath: queueFile,
  generatedAt: "2026-06-17T00:00:00.000Z",
});

assert.equal(queue.records.length, 1);
assert.equal(queue.records[0].id, "q_queued");
assert.equal(JSON.stringify(queue.records).includes("oldTopic"), false, "queue must not expose oldTopic");
assert.match(queue.DO_NOT_CLASSIFY_WITH_GEMINI, /DO NOT CLASSIFY/i);

await writeJson(resultsFile, {
  meta: { classifier: "gpt-fixture", temperature: 0 },
  records: [
    {
      id: "q_queued",
      decision: "propose",
      topic: "Legal & Ethical Principles",
      reason: "The item tests respect for client legal rights.",
    },
  ],
});

const manifest = await ingestResults({
  inputFile,
  geminiManifestFile: geminiFile,
  banksDir,
  resultsFile,
  manifestPath: manifestFile,
  reportPath: reportFile,
  generatedAt: "2026-06-17T00:00:00.000Z",
});

const statusById = new Map(manifest.records.map((record) => [record.id, record.status]));
assert.equal(statusById.get("q_queued"), "proposed");
assert.equal(statusById.get("q_already"), "already-canonical");
assert.equal(statusById.get("q_conflict"), "category-untrusted");
assert.equal(statusById.get("q_missing"), "context-incomplete");
assert.equal(manifest.records.find((record) => record.id === "q_queued")?.proposedTopic, "Legal & Ethical Principles");
assert.match(await readFile(reportFile, "utf8"), /Category Integrity/);

await writeJson(geminiFile, [{ id: "q_queued" }]);
await assert.rejects(
  emitQueue({
    inputFile,
    geminiManifestFile: geminiFile,
    banksDir,
    outputPath: queueFile,
    generatedAt: "2026-06-17T00:00:00.000Z",
  }),
  /Scope boundary breach/,
);

await writeJson(geminiFile, []);
await writeJson(resultsFile, {
  meta: { classifier: "gemini-fixture", temperature: 0 },
  records: [{ id: "q_queued", decision: "abstain", topic: null, reason: "No fit." }],
});
await assert.rejects(
  ingestResults({
    inputFile,
    geminiManifestFile: geminiFile,
    banksDir,
    resultsFile,
    manifestPath: manifestFile,
    reportPath: reportFile,
    generatedAt: "2026-06-17T00:00:00.000Z",
  }),
  /non-Gemini/,
);

await writeJson(resultsFile, {
  meta: { classifier: "gpt-fixture", temperature: 0 },
  records: [{ id: "q_queued", decision: "invent_topic", topic: "Legal & Ethical Principles", reason: "Bad enum." }],
});
const malformedManifest = await ingestResults({
  inputFile,
  geminiManifestFile: geminiFile,
  banksDir,
  resultsFile,
  manifestPath: manifestFile,
  reportPath: reportFile,
  generatedAt: "2026-06-17T00:00:00.000Z",
});
const malformedRow = malformedManifest.records.find((record) => record.id === "q_queued");
assert.equal(malformedRow?.status, "unresolved");
assert.match(malformedRow?.reason ?? "", /classifier-output-invalid/);

await rm(tempRoot, { recursive: true, force: true });
console.log("Topic residual proposal harness tests OK");
