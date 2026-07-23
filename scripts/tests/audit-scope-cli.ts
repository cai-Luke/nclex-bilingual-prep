import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { createAuditScopeFixtures } from "../test-utils/audit-scope-fixtures";

const fixture = await createAuditScopeFixtures();
const tsxCli = join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs");
const run = (script: string, args: string[]) =>
  spawnSync(process.execPath, [tsxCli, script, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

const wrappers = [
  { name: "validate-bank", script: "scripts/audit/validate-bank.ts", flag: "--file" },
  { name: "audit-references", script: "scripts/audit/audit-references.ts", flag: "--file" },
  { name: "audit-positions", script: "scripts/audit/audit-positions.ts", flag: "--file" },
  { name: "audit-ids", script: "scripts/audit/audit-ids.ts", flag: "--candidate" },
  { name: "audit-topic-license", script: "scripts/audit/audit-topic-license.ts", flag: "--file" },
  { name: "audit-producer-vocabulary", script: "scripts/audit/audit-producer-vocabulary.ts", flag: "--file" },
  {
    name: "audit-authorial-constraint-leakage",
    script: "scripts/audit/audit-authorial-constraint-leakage.ts",
    flag: "--file",
  },
] as const;

try {
  for (const wrapper of wrappers) {
    let child = run(wrapper.script, [wrapper.flag, fixture.malformed]);
    assert.equal(child.status, 1, `${wrapper.name}: malformed selected file must exit 1\n${child.stdout}\n${child.stderr}`);

    child = run(wrapper.script, ["--unknown"]);
    assert.equal(child.status, 1, `${wrapper.name}: unknown flag must exit 1`);
    assert.match(child.stderr, /Unknown argument/);

    child = run(wrapper.script, [wrapper.flag]);
    assert.equal(child.status, 1, `${wrapper.name}: missing flag value must exit 1`);
    assert.match(child.stderr, /requires a path argument/);

    child = run(wrapper.script, [wrapper.flag, " \t "]);
    assert.equal(child.status, 1, `${wrapper.name}: whitespace-only flag value must exit 1`);
    assert.match(child.stderr, /requires a non-empty path argument/);

    child = run(wrapper.script, [wrapper.flag, fixture.validA]);
    assert.equal(child.status, 0, `${wrapper.name}: non-FAIL result must exit 0\n${child.stdout}\n${child.stderr}`);
    assert.match(child.stdout, /^\[(?:PASS|WARN|INSUFFICIENT)\]/m);
  }

  const canonicalOutputOne = join(fixture.directory, "canonical-one.md");
  const canonicalOutputTwo = join(fixture.directory, "canonical-two.md");
  let child = run("scripts/audit/audit-topic-license.ts", [`--output=${canonicalOutputOne}`]);
  assert.equal(child.status, 0);
  child = run("scripts/audit/audit-topic-license.ts", [`--output=${canonicalOutputTwo}`]);
  assert.equal(child.status, 0);
  assert.equal(
    await readFile(canonicalOutputOne, "utf8"),
    await readFile(canonicalOutputTwo, "utf8"),
    "--output= alone must produce a stable canonical report byte-for-byte",
  );
  assert.match(await readFile(canonicalOutputOne, "utf8"), /current canonical banks/);

  const selectedOutput = join(fixture.directory, "selected.md");
  child = run("scripts/audit/audit-topic-license.ts", [
    `--output=${selectedOutput}`,
    "--file",
    fixture.validA,
  ]);
  assert.equal(child.status, 0);
  const selectedReport = await readFile(selectedOutput, "utf8");
  assert.match(selectedReport, /explicitly selected files/);
  assert.match(selectedReport, new RegExp(fixture.validA.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(selectedReport, /current canonical banks/);

  child = run("scripts/audit/audit-topic-license.ts", ["--output="]);
  assert.equal(child.status, 1);
  assert.match(child.stderr, /requires a non-empty path argument/);
} finally {
  await fixture.cleanup();
}

console.log("audit-scope CLI subprocess matrix passed for all seven wrappers");
