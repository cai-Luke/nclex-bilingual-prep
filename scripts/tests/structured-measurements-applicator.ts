import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import type { StructuredMeasurements } from "../../src/types";

const root = resolve(import.meta.dirname, "../..");
// This test spawns the real applicator CLI against the bundled canonical banks (the applicator has
// no isolated-bank override), so `ref` must name a real exhibit with no structuredMeasurements yet —
// the applicator's double-application guard throws otherwise. If a future promotion targets this
// exact ref, swap in a different currently-unpromoted case_study exhibit.
const ref = "opus_psi_caregiver_2026_06_10_01/ex1";

const runApplicator = async (record: unknown): Promise<StructuredMeasurements> => {
  const dir = await mkdtemp(join(tmpdir(), "structured-applicator-"));
  try {
    const artifact = join(dir, "fixture.json");
    await writeFile(artifact, `${JSON.stringify([record], null, 2)}\n`, "utf8");
    const result = spawnSync(
      "npx",
      ["tsx", "scripts/apply-structured-measurements.ts", "--refs", ref, artifact],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(result.status, 0, `applicator failed:\n${result.stdout}\n${result.stderr}`);
    const prefix = `Canonical preview ${ref}: `;
    const line = result.stdout.split("\n").find((candidate) => candidate.startsWith(prefix));
    assert(line, `missing canonical preview:\n${result.stdout}`);
    return JSON.parse(line.slice(prefix.length)) as StructuredMeasurements;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

const runApplicatorFailure = async (record: unknown): Promise<string> => {
  const dir = await mkdtemp(join(tmpdir(), "structured-applicator-fail-"));
  try {
    const artifact = join(dir, "fixture.json");
    await writeFile(artifact, `${JSON.stringify([record], null, 2)}\n`, "utf8");
    const result = spawnSync(
      "npx",
      ["tsx", "scripts/apply-structured-measurements.ts", "--refs", ref, artifact],
      { cwd: root, encoding: "utf8" },
    );
    assert.notEqual(result.status, 0, "malformed explicit linkage should fail applicator defensively");
    return `${result.stdout}\n${result.stderr}`;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
};

const sourceVitals = "Vital signs: T 36.8 C, HR 92, BP 108/64, RR 16, SpO2 97% on room air.";
const priorLabs = "PACU labs 6 hours earlier: Na 138 mEq/L, glucose 156 mg/dL, phosphorus 2.8 mg/dL.";

const explicit = await runApplicator({
  exhibitRef: ref,
  lane: "extract",
  columns: [
    { id: "pacu_6h_prior", panelKind: "labs", label: { en: "PACU (6 h prior)", zh: "麻醉恢复室（6小时前）" }, evidence: "PACU labs 6 hours earlier" },
    { id: "current", panelKind: "labs", label: { en: "Current", zh: "当前" }, evidence: "Point-of-care glucose 142 mg/dL." },
  ],
  panel: [
    { label: "glucose", value: "156", sourceUnit: "mg/dL", sourceSpan: priorLabs, columnId: "pacu_6h_prior" },
    { label: "phosphate", value: "2.8", sourceUnit: "mg/dL", sourceSpan: priorLabs, columnId: "pacu_6h_prior" },
    { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "Point-of-care glucose 142 mg/dL.", columnId: "current" },
    { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: sourceVitals },
  ],
});

assert.deepEqual(explicit.panels[0].columns, [{ id: "current", label: { en: "Current", zh: "当前" } }]);
assert.deepEqual(explicit.panels[1].columns, [
  { id: "pacu_6h_prior", label: { en: "PACU (6 h prior)", zh: "麻醉恢复室（6小时前）" } },
  { id: "current", label: { en: "Current", zh: "当前" } },
]);
assert.deepEqual(explicit.panels[1].rows.map((row) => [row.key, row.values.map((value) => value.columnId)]), [
  ["glucose", ["pacu_6h_prior", "current"]],
  ["phosphate", ["pacu_6h_prior"]],
]);
assert.equal(JSON.stringify(explicit).includes("evidence"), false, "staging evidence must not reach canonical output");
assert.equal(JSON.stringify(explicit).includes("panelKind"), false, "staging panelKind must not reach canonical output");

const legacy = await runApplicator({
  exhibitRef: ref,
  lane: "extract",
  panel: [
    { label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "Point-of-care glucose 142 mg/dL." },
    { label: "hr", value: "92", sourceUnit: "bpm", sourceSpan: sourceVitals },
  ],
});
assert.deepEqual(legacy, {
  panels: [
    {
      kind: "vitals",
      columns: [{ id: "current", label: { en: "Current", zh: "当前" } }],
      rows: [{ key: "hr", label: { en: "Heart rate", zh: "心率" }, values: [{ columnId: "current", value: "92", unit: "bpm" }] }],
    },
    {
      kind: "labs",
      columns: [{ id: "current", label: { en: "Current", zh: "当前" } }],
      rows: [{ key: "glucose", label: { en: "Glucose", zh: "血糖" }, values: [{ columnId: "current", value: "142", unit: "mg/dL" }] }],
    },
  ],
}, "legacy implicit-column canonical output must remain byte-shape identical");

const freeFloatingColumnError = await runApplicatorFailure({
  exhibitRef: ref,
  lane: "extract",
  panel: [{ label: "glucose", value: "142", sourceUnit: "mg/dL", sourceSpan: "Point-of-care glucose 142 mg/dL.", columnId: "current" }],
});
assert(
  freeFloatingColumnError.includes("explicit columnId entries require declared columns"),
  "applicator should retain its defensive free-floating columnId rejection",
);

console.log("structured measurements applicator tests passed");
