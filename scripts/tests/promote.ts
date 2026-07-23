import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = resolve(import.meta.dirname, "../..");
const tsx = resolve(repoRoot, "node_modules/.bin/tsx");
const promoteScript = resolve(repoRoot, "scripts/promote.ts");

const text = { en: "Fixture.", zh: "测试。" };
const question = (id: string) => ({
  id,
  itemType: "fill_in_blank",
  category: "Management of Care",
  topic: "Prioritization & Delegation",
  difficulty: "medium",
  stem: text,
  blanks: [{ id: "b1", prompt: text, acceptable: ["1"] }],
  rationale: { correct: text },
  testTakingStrategy: text,
  glossary: [],
});

const draftBank = {
  meta: { schemaVersion: "1.0", count: 1 },
  questions: [question("draft_question")],
};

const runPromote = (cwd: string) => spawnSync(tsx, [promoteScript], {
  cwd,
  encoding: "utf8",
});

const withRoot = async (run: (root: string) => Promise<void>) => {
  const root = await mkdtemp(join(tmpdir(), "shrimp-promote-"));
  await Promise.all([
    mkdir(join(root, "banks/banks-raw"), { recursive: true }),
    mkdir(join(root, "banks/_promoted"), { recursive: true }),
  ]);
  try {
    await writeFile(join(root, "banks/banks-raw/gemini-fixture.json"), JSON.stringify(draftBank), "utf8");
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
};

await withRoot(async (root) => {
  const result = runPromote(root);
  assert.equal(result.status, 0, `absent canonical should be allowed:\n${result.stderr}`);
  assert(existsSync(join(root, "banks/_promoted/gemini-fixture.json")));
});

await withRoot(async (root) => {
  await writeFile(
    join(root, "banks/banks-raw/gemini-fixture.json"),
    JSON.stringify([question("bare_array_question")]),
    "utf8",
  );
  const result = runPromote(root);
  assert.notEqual(result.status, 0, "promote must reject a bare-array draft at the repository boundary");
  assert.match(`${result.stdout}\n${result.stderr}`, /normalize bare arrays to a bank envelope/);
});

await withRoot(async (root) => {
  await writeFile(
    join(root, "banks/gemini-canonical.json"),
    JSON.stringify({ questions: [question("canonical_question")] }),
    "utf8",
  );
  const result = runPromote(root);
  assert.notEqual(result.status, 0, "canonical without metadata must fail promotion");
  assert.match(`${result.stdout}\n${result.stderr}`, /meta with schemaVersion is required/);
});

await withRoot(async (root) => {
  await writeFile(
    join(root, "banks/gemini-canonical.json"),
    JSON.stringify({
      meta: { schemaVersion: "2.1", count: 1 },
      questions: [question("canonical_question")],
    }),
    "utf8",
  );
  const result = runPromote(root);
  assert.notEqual(result.status, 0, "canonical with an unknown schema version must fail promotion");
  assert.match(`${result.stdout}\n${result.stderr}`, /meta\.schemaVersion must be one of/);
});

console.log("promote tests passed");
