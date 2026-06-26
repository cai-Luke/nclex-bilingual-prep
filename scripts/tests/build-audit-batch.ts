import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildAuditBatch, writeAuditBatch } from "../audit/build-audit-batch";

const expectedCarveoutIds = [
  "claude_moc_assignment_mc_14",
  "claude_moc_deleg_uap_hl_01",
  "claude_moc_lpn_deleg_hl_b01",
  "claude_moc_supervision_hl_b04",
];

const first = await writeAuditBatch();
const firstBytes = await readFile(first.outPath, "utf8");
const second = await writeAuditBatch();
const secondBytes = await readFile(second.outPath, "utf8");
const artifact = await buildAuditBatch();

assert.equal(artifact.unique_item_count, 109);
assert.equal(artifact.candidate_pair_count, 156);
assert.equal(artifact.reviewer_split.claude_pairs, 149);
assert.equal(artifact.reviewer_split.gpt5_pairs, 5);
assert.equal(artifact.reviewer_split.gemini_pairs, 2);
assert.equal(artifact.reviewer_split.needs_provenance_pairs, 0);
assert.deepEqual(artifact.gpt5_carveout_ids.sort(), expectedCarveoutIds);
assert.deepEqual(artifact.needs_provenance_pairs, []);
assert.equal(secondBytes, firstBytes, "slice artifact must be byte-stable");
assert.deepEqual(
  second.artifact,
  first.artifact,
  "batch builder output must be deterministic",
);

console.log("audit batch builder tests passed");
