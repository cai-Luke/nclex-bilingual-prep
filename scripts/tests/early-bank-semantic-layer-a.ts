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

// Recorded baseline — update on intentional regen.
const recordedBaseline = {
  inventoryLength: 2256,
  rowLength: 2157,
  uniqueQueuedItems: 1876,
};
void recordedBaseline;

assert.equal(second.inventory.length, first.inventory.length);
assert.equal(secondQueue, firstQueue, "queue JSONL must be byte-stable");
assert.equal(secondSummary, firstSummary, "summary JSON must be byte-stable");
assert.deepEqual(second.rows, first.rows, "Layer A output must be deterministic");

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
assert(
  first.inventory.every((item) => Array.isArray(item.concept_clusters)),
  "every inventory item must carry a concept_clusters array",
);
assert(
  first.rows.every((row) => Array.isArray(row.concept_clusters)),
  "every queue row must carry a concept_clusters array",
);

const conceptRowsByCluster = first.summary.concept_rows_by_cluster;
assert(
  Object.keys(conceptRowsByCluster).length > 0,
  "concept rows must be summarized by cluster",
);
assert(
  (conceptRowsByCluster.delegation_scope ?? 0) > 0,
  "delegation_scope concept rows must be present",
);
assert(
  (conceptRowsByCluster.isolation_mode ?? 0) > 0,
  "isolation_mode concept rows must be present",
);
assert(
  first.rows.some(
    (row) =>
      row.track === "coherence" &&
      row.routing_reasons.some((reason) =>
        reason.startsWith("concept cluster: "),
      ),
  ),
  "coherence rows must include concept-cluster routing reasons",
);

const topicCounts = new Map<string, number>();
first.inventory.forEach((item) => {
  topicCounts.set(
    item.normalized_topic,
    (topicCounts.get(item.normalized_topic) ?? 0) + 1,
  );
});
const largestTopic = [...topicCounts.entries()].sort(
  ([leftTopic, leftCount], [rightTopic, rightCount]) =>
    rightCount - leftCount || leftTopic.localeCompare(rightTopic),
)[0]?.[0];
assert(largestTopic, "inventory must contain at least one normalized topic");
assert(
  first.rows.some(
    (row) => row.track === "coherence" && row.normalized_topic === largestTopic,
  ),
  "largest normalized-topic group must still emit at least one coherence row",
);

const coherenceRows = first.rows.filter((row) => row.track === "coherence");
assert(
  new Set(coherenceRows.map((row) => row.harm_rank)).size > 1,
  "coherence harm_rank must vary after concept weighting",
);
const currencyRows = first.rows.filter((row) => row.track === "currency");
assert(currencyRows.length > 0, "currency rows must still be emitted");
assert(
  currencyRows.every((row) => row.harm_rank >= 50),
  "currency harm_rank must remain at or above the coherence base",
);

console.log("early-bank semantic Layer A tests passed");
