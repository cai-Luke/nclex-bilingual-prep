import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { routeCanonical } from "../../lib/canonical-routing";
import { serializeBank } from "../../lib/presentation-normalization";
import { consolidateInto } from "../consolidate";
import type { BankEnvelope, Question, SchemaVersion, StandaloneQuestion } from "../../src/types";

const text = { en: "Fixture.", zh: "\u6d4b\u8bd5\u3002" };

const question = (id: string): StandaloneQuestion => ({
  id,
  itemType: "fill_in_blank",
  category: "Management of Care",
  topic: "fixture",
  difficulty: "medium",
  stem: text,
  blanks: [{ id: "b1", prompt: text, acceptable: ["1"] }],
  rationale: { correct: text },
  testTakingStrategy: text,
  glossary: [],
});

const caseStudy = (id: string, leafIds: [string, string]): Question => ({
  id,
  itemType: "case_study",
  category: "Management of Care",
  topic: "fixture",
  difficulty: "medium",
  stem: text,
  rationale: { correct: text },
  testTakingStrategy: text,
  glossary: [],
  caseStudy: {
    title: text,
    exhibits: [{ id: "ex1", title: text, content: text }],
    questions: leafIds.map(question),
  },
});

const bank = (questions: Question[], schemaVersion: SchemaVersion = "1.1"): BankEnvelope => ({
  meta: { schemaVersion, exam: "NCLEX-RN", topic: "fixture", count: questions.length },
  questions,
});

async function withDirs<T>(fn: (dirs: { stagingDir: string; canonicalDir: string }) => Promise<T>): Promise<T> {
  const root = await mkdtemp(join(tmpdir(), "shrimp-consolidate-"));
  const dirs = { stagingDir: join(root, "staging"), canonicalDir: join(root, "canonical") };
  await Promise.all([
    mkdir(dirs.stagingDir, { recursive: true }),
    mkdir(dirs.canonicalDir, { recursive: true }),
  ]);
  try {
    return await fn(dirs);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

async function writeBank(path: string, envelope: BankEnvelope): Promise<void> {
  await writeFile(path, serializeBank(envelope), "utf8");
}

assert.equal(routeCanonical("gemini-fixture.json"), "gemini-canonical.json");
assert.equal(routeCanonical("lab-fixture.json"), "lab-canonical.json");

await withDirs(async (dirs) => {
  await writeBank(join(dirs.stagingDir, "zzz-foo.json"), bank([question("new")]));
  const result = await consolidateInto(dirs, "zzz-foo.json");
  assert.equal(result.ok, false);
  assert.match(result.reason, /Unknown canonical route/);
});

await withDirs(async (dirs) => {
  await writeBank(join(dirs.canonicalDir, "gemini-canonical.json"), bank([question("dup")]));
  await writeBank(join(dirs.stagingDir, "gemini-new.json"), bank([question("dup")]));
  const result = await consolidateInto(dirs, "gemini-new.json");
  assert.equal(result.ok, false);
  assert.match(result.reason, /duplicate ID/);
  assert(result.details?.some((detail) => detail.includes("dup")));
});

await withDirs(async (dirs) => {
  await writeBank(join(dirs.canonicalDir, "gemini-canonical.json"), bank([caseStudy("case_a", ["dup_leaf", "leaf_a"])]));
  await writeBank(join(dirs.stagingDir, "gemini-new.json"), bank([caseStudy("case_b", ["dup_leaf", "leaf_b"])]));
  const result = await consolidateInto(dirs, "gemini-new.json");
  assert.equal(result.ok, false);
  assert(result.details?.some((detail) => detail.includes("dup_leaf")));
});

await withDirs(async (dirs) => {
  await writeBank(join(dirs.canonicalDir, "gemini-canonical.json"), bank([question("cross_dup")]));
  await writeBank(join(dirs.stagingDir, "gemini-new.json"), bank([caseStudy("case_b", ["cross_dup", "leaf_b"])]));
  const result = await consolidateInto(dirs, "gemini-new.json");
  assert.equal(result.ok, false);
  assert(result.details?.some((detail) => detail.includes("cross_dup")));
});

await withDirs(async (dirs) => {
  await writeBank(join(dirs.canonicalDir, "gemini-canonical.json"), bank([question("existing")]));
  await writeBank(join(dirs.stagingDir, "gemini-new.json"), bank([question("added")]));
  const result = await consolidateInto(dirs, "gemini-new.json");
  assert.equal(result.ok, true);
  assert.equal(result.mergedCount, 2);
  const merged = JSON.parse(await readFile(join(dirs.canonicalDir, "gemini-canonical.json"), "utf8")) as BankEnvelope;
  assert.equal(merged.meta?.count, merged.questions.length);
});

await withDirs(async (dirs) => {
  await writeBank(join(dirs.stagingDir, "lab-new.json"), bank([question("new_lab")], "1.0"));
  const result = await consolidateInto(dirs, "lab-new.json");
  assert.equal(result.ok, true);
  assert.deepEqual((await readdir(dirs.canonicalDir)).sort(), ["lab-canonical.json"]);
  assert.deepEqual(await readdir(dirs.stagingDir), []);
});

await withDirs(async (dirs) => {
  await writeBank(join(dirs.canonicalDir, "gpt-canonical.json"), bank([question("existing")], "1.0"));
  await writeBank(join(dirs.stagingDir, "gpt-new.json"), bank([question("added")], "1.5"));
  const result = await consolidateInto(dirs, "gpt-new.json");
  assert.equal(result.ok, false);
  assert.match(result.reason, /higher than/);
});

console.log("consolidate tests passed");
