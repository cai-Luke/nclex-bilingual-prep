import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  DEFAULT_BANKS,
  DEFAULT_QUEUE,
  DEFAULT_SUMMARY,
  provenanceTierFor,
  writeSemanticLayerA,
} from "../audit/early-bank-semantic-layer-a";

assert.equal(provenanceTierFor("gemini_jun05_a_mc_01"), "high");
assert.equal(provenanceTierFor("trad_batchB_01"), "high");
assert.equal(provenanceTierFor("gpt_general_01"), "medium");
assert.equal(provenanceTierFor("gpt_case_recent_01"), "low");
assert.equal(provenanceTierFor("opus_recent_01"), "low");

const first = await writeSemanticLayerA();
const firstQueue = await readFile(DEFAULT_QUEUE, "utf8");
const firstSummary = await readFile(DEFAULT_SUMMARY, "utf8");
const second = await writeSemanticLayerA();
const secondQueue = await readFile(DEFAULT_QUEUE, "utf8");
const secondSummary = await readFile(DEFAULT_SUMMARY, "utf8");

assert.equal(
  first.inventory.length,
  1692,
  "current text-bank inventory contains 1,692 top-level and embedded records",
);
assert.equal(second.inventory.length, first.inventory.length);
assert.equal(secondQueue, firstQueue, "queue JSONL must be byte-stable");
assert.equal(secondSummary, firstSummary, "summary JSON must be byte-stable");
assert.deepEqual(second.rows, first.rows, "Layer A output must be deterministic");
assert.equal(first.rows.length, 1312);
assert.equal(first.summary.unique_queued_items, 1136);
assert.deepEqual(first.summary.rows_by_track, {
  currency: 273,
  coherence: 1039,
});
assert.deepEqual(first.summary.currency_rows_by_cluster, {
  immunization_screening: 66,
  isolation_precautions: 63,
  anticoagulation: 50,
  dka_insulin: 27,
  sepsis: 19,
  stroke: 23,
  burn_parkland: 17,
  bp_targets: 5,
  acls: 3,
});

assert(
  first.rows.some(
    (row) =>
      row.track === "currency" &&
      row.currency_cluster === "immunization_screening",
  ),
  "immunization/screening currency candidates must be emitted",
);
assert(
  first.rows.some((row) => row.track === "coherence" && row.pair_with.length > 0),
  "coherence queue must include deterministic candidate pairs",
);
assert(
  first.rows.every((row) => DEFAULT_BANKS.some((bank) => bank.endsWith(row.bank))),
  "queue rows must point to an in-scope bank",
);
assert(
  first.rows.every((row) => row.routing_reasons.length > 0),
  "every queue row must explain its deterministic routing signal",
);

console.log("early-bank semantic Layer A tests passed");
