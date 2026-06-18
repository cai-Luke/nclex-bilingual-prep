import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { assertCleanMonitoredInputs, buildScopeRows } from "../residual-rerun";

const tempRoot = await mkdtemp(join(tmpdir(), "residual-rerun-"));

const originalManifest = {
  records: [
    { id: "a", status: "unresolved", canonicalCategory: "Reduction of Risk Potential", proposedTopic: null },
    { id: "b", status: "blocked-cross-category", canonicalCategory: "Reduction of Risk Potential", proposedTopic: "Burn Management" },
    { id: "settled_exec", status: "unresolved", canonicalCategory: "Basic Care and Comfort", proposedTopic: null },
    { id: "ignored_proposed", status: "proposed", canonicalCategory: "Basic Care and Comfort", proposedTopic: "Sleep & Rest" },
  ],
};

const reclaimManifest = {
  records: [
    { id: "a", status: "proposed", canonicalCategory: "Reduction of Risk Potential", proposedTopic: "Laboratory & Diagnostic Tests" },
    { id: "c", status: "unresolved", canonicalCategory: "Management of Care", proposedTopic: null },
    { id: "d", status: "blocked-cross-category", canonicalCategory: "Safety and Infection Control", proposedTopic: "Patient & Environment Safety" },
    { id: "e", status: "proposed", canonicalCategory: "Basic Care and Comfort", proposedTopic: "Skin & Wound Care" },
    { id: "settled_s01", status: "proposed", canonicalCategory: "Reduction of Risk Potential", proposedTopic: "Oncology & Immunotherapy Complications" },
  ],
};

const scope = buildScopeRows({
  originalManifest,
  reclaimManifest,
  s01DryRun: { rows: [{ id: "settled_s01" }] },
  executionManifest: { updates: [{ id: "settled_exec" }] },
});

assert.equal(scope.counts.original_unresolved_source_rows, 2);
assert.equal(scope.counts.original_blocked_source_rows, 1);
assert.equal(scope.counts.reclaim_unresolved_source_rows, 1);
assert.equal(scope.counts.reclaim_blocked_source_rows, 1);
assert.equal(scope.counts.reclaim_proposed_source_rows, 3);
assert.equal(scope.counts.excluded_settled_rows, 2);
assert.equal(scope.counts.unique_run_rows, 5);

const byId = new Map(scope.rows.map((row) => [row.id, row]));
assert.deepEqual(byId.get("a")?.sourceTags, ["original-unresolved", "reclaim-proposed"]);
assert.equal(byId.get("a")?.priorProposals.some((proposal) => proposal.topic === "Laboratory & Diagnostic Tests"), true);
assert.equal(byId.has("settled_exec"), false);
assert.equal(byId.has("settled_s01"), false);
assert.equal(byId.has("ignored_proposed"), false);

execFileSync("git", ["init"], { cwd: tempRoot, stdio: "ignore" });
await mkdir(join(tempRoot, "src"));
await mkdir(join(tempRoot, "banks"));
await mkdir(join(tempRoot, "audit"));
await writeFile(join(tempRoot, "src/topics.ts"), "export const ok = true;\n");
await writeFile(join(tempRoot, "banks/fixture.json"), "{}\n");
await writeFile(join(tempRoot, "audit/input.json"), "{}\n");
execFileSync("git", ["add", "."], { cwd: tempRoot, stdio: "ignore" });
execFileSync(
  "git",
  ["-c", "user.name=Test", "-c", "user.email=test@example.com", "commit", "-m", "fixture"],
  { cwd: tempRoot, stdio: "ignore" },
);

assert.doesNotThrow(() => assertCleanMonitoredInputs(tempRoot, ["src/topics.ts", "banks/*.json", "audit/input.json"]));
await writeFile(join(tempRoot, "banks/fixture.json"), "{\"dirty\":true}\n");
assert.throws(
  () => assertCleanMonitoredInputs(tempRoot, ["src/topics.ts", "banks/*.json", "audit/input.json"]),
  /Refusing to run residual rerun/,
);

console.log("Residual rerun harness tests OK");
