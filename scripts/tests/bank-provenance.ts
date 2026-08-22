import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const generatorPath = join(repositoryRoot, "scripts/bank-provenance.ts");
const tsxPath = join(repositoryRoot, "node_modules/.bin/tsx");
const fixtureRoot = await mkdtemp(join(tmpdir(), "bank-provenance-test-"));

const git = (args: string[], env: NodeJS.ProcessEnv = {}) =>
  execFileSync("git", args, {
    cwd: fixtureRoot,
    encoding: "utf8",
    env: { ...process.env, ...env },
  }).trim();

const writeBank = async (name: string, ids: string[] | string) => {
  const text = typeof ids === "string" ? ids : JSON.stringify({ questions: ids.map((id) => ({ id })) });
  await writeFile(join(fixtureRoot, "banks", name), `${text}\n`, "utf8");
};

const commit = (message: string, date: string) => {
  git(["add", "."]);
  git(["commit", "-m", message, "--date", date], {
    GIT_AUTHOR_DATE: date,
    GIT_COMMITTER_DATE: date,
  });
};

try {
  await mkdir(join(fixtureRoot, "banks"), { recursive: true });
  git(["init", "-q"]);
  git(["config", "user.name", "Preview Lab Test"]);
  git(["config", "user.email", "preview-lab@example.test"]);

  await writeBank("fixture.json", ["older"]);
  commit("old bank", "2026-08-01T12:00:00-04:00");

  await writeBank("fixture.json", ["older", "newer"]);
  commit("add newer question", "2026-08-02T12:00:00-04:00");

  git(["mv", "banks/fixture.json", "banks/renamed.json"]);
  commit("rename bank", "2026-08-03T12:00:00-04:00");

  await writeBank("renamed.json", ["older", "newer", "renamed-addition"]);
  commit("add after rename", "2026-08-04T12:00:00-04:00");

  await writeBank("broken.json", "{ not valid JSON");
  commit("add malformed historical revision", "2026-08-05T12:00:00-04:00");

  await writeBank("broken.json", ["recovered"]);
  commit("repair malformed bank", "2026-08-06T12:00:00-04:00");

  await writeBank("current-only.json", ["undated-current-id"]);

  const output = execFileSync(tsxPath, [generatorPath], { cwd: fixtureRoot, encoding: "utf8" });
  assert.match(output, /Historical parse failures skipped: 1/);

  const manifest = JSON.parse(await readFile(join(fixtureRoot, "banks-provenance.json"), "utf8")) as {
    entries: Array<{ id: string; bankPath: string; firstSeenOrdinal: number }>;
    undated: string[];
  };
  assert.deepEqual(
    manifest.entries.map((entry) => entry.id),
    ["recovered", "renamed-addition", "newer", "older"],
    "newer first-parent additions should sort first",
  );
  assert.equal(
    manifest.entries.find((entry) => entry.id === "renamed-addition")?.bankPath,
    "banks/renamed.json",
    "history traversal should continue across a bank rename",
  );
  assert.equal(
    manifest.entries.find((entry) => entry.id === "recovered")?.firstSeenOrdinal,
    5,
    "a malformed historical revision should be skipped while later history remains usable",
  );
  assert.deepEqual(manifest.undated, ["undated-current-id"]);

  const currentIds = ["older", "newer", "renamed-addition", "recovered", "undated-current-id"];
  const outputIds = [...manifest.entries.map((entry) => entry.id), ...manifest.undated];
  assert.equal(outputIds.length, currentIds.length);
  for (const id of currentIds) assert.equal(outputIds.filter((candidate) => candidate === id).length, 1, id);
  assert.deepEqual([...new Set(outputIds)].sort(), [...currentIds].sort());

  console.log("bank-provenance tests passed");
} finally {
  await rm(fixtureRoot, { recursive: true, force: true });
}
