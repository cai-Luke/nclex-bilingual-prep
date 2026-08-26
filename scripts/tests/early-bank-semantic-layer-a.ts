import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  DEFAULT_BANKS,
  matchConceptClusters,
  producerFor,
  provenanceTierFor,
  writeSemanticLayerA,
} from "../audit/early-bank-semantic-layer-a";

assert.equal(provenanceTierFor("gemini_jun05_a_mc_01"), "high");
assert.equal(provenanceTierFor("trad_batchB_01"), "high");
assert.equal(provenanceTierFor("gpt_general_01"), "medium");
assert.equal(provenanceTierFor("gpt_case_recent_01"), "low");
assert.equal(provenanceTierFor("opus_recent_01"), "low");
assert.equal(provenanceTierFor("opus3_iv_potassium_safety_case_01_q3"), "low");
assert.equal(provenanceTierFor("opus24_case_elder_neglect_01_q4"), "low");
assert.equal(
  producerFor("hard-cases-canonical.json", "opus3_iv_potassium_safety_case_01_q3"),
  "gpt",
);
assert.equal(
  producerFor("claude-canonical.json", "opus5_case_consent_interpreter_01_q1"),
  "gpt",
);
assert.equal(
  producerFor("claude-canonical.json", "claude_moc_deleg_uap_hl_01"),
  "claude",
);
const authorizedConceptDashCodePoints = [
  { label: "U+002D", value: "\u002D" },
  { label: "U+2010", value: "\u2010" },
  { label: "U+2011", value: "\u2011" },
  { label: "U+2012", value: "\u2012" },
  { label: "U+2013", value: "\u2013" },
  { label: "U+2014", value: "\u2014" },
  { label: "U+2015", value: "\u2015" },
  { label: "U+2212", value: "\u2212" },
  { label: "U+FE58", value: "\uFE58" },
  { label: "U+FE63", value: "\uFE63" },
  { label: "U+FF0D", value: "\uFF0D" },
] as const;
authorizedConceptDashCodePoints.forEach(({ label, value }) => {
  assert(
    matchConceptClusters(`pressure${value}injury`).includes("pressure_injury"),
    `pressure_injury must treat ${label} as a word separator`,
  );
});
assert(
  matchConceptClusters("pressure injury").includes("pressure_injury"),
  "ordinary pressure injury language must still match",
);
assert(
  matchConceptClusters("charge-nurse").includes("delegation_scope"),
  "delegation_scope must treat a hyphen as a word separator",
);
assert(
  matchConceptClusters("negative-pressure").includes("isolation_mode"),
  "existing hyphenated negative-pressure language must still match",
);
assert(
  matchConceptClusters("negative\u2013pressure").includes("isolation_mode"),
  "isolation_mode must treat a non-ASCII authorized dash as a separator",
);
assert(
  !matchConceptClusters("pressure\u00ADinjury").includes("pressure_injury"),
  "U+00AD SOFT HYPHEN must remain outside the normalization set",
);
assert(
  !matchConceptClusters("pressure--injury").includes("pressure_injury"),
  "multiple separators must not be collapsed to one space",
);
assert(
  matchConceptClusters("post-op pressure-injury").includes("pressure_injury"),
  "all authorized dash occurrences must be replaced",
);
assert(
  !matchConceptClusters("Stage II breast cancer staging").includes(
    "pressure_injury",
  ),
  "pressure_injury must not match generic cancer staging language",
);
assert(
  !matchConceptClusters("Stage 3 chronic kidney disease").includes(
    "pressure_injury",
  ),
  "pressure_injury must not match generic CKD staging language",
);
assert(
  matchConceptClusters("Stage III pressure ulcer on the sacrum").includes(
    "pressure_injury",
  ),
  "pressure_injury must still match staged pressure ulcer content",
);
assert(
  matchConceptClusters("Braden scale risk assessment").includes(
    "pressure_injury",
  ),
  "pressure_injury must still match Braden scale content",
);

const tempRoot = await mkdtemp(join(tmpdir(), "project-shrimp-layer-a-"));
try {
  const firstQueuePath = join(tempRoot, "first.queue.jsonl");
  const firstSummaryPath = join(tempRoot, "first.summary.json");
  const secondQueuePath = join(tempRoot, "second.queue.jsonl");
  const secondSummaryPath = join(tempRoot, "second.summary.json");
  const first = await writeSemanticLayerA(
    DEFAULT_BANKS,
    firstQueuePath,
    firstSummaryPath,
  );
  const firstQueue = await readFile(firstQueuePath, "utf8");
  const firstSummary = await readFile(firstSummaryPath, "utf8");
  const second = await writeSemanticLayerA(
    DEFAULT_BANKS,
    secondQueuePath,
    secondSummaryPath,
  );
  const secondQueue = await readFile(secondQueuePath, "utf8");
  const secondSummary = await readFile(secondSummaryPath, "utf8");

  assert.equal(second.inventory.length, first.inventory.length);
  assert.equal(secondQueue, firstQueue, "queue JSONL must be byte-stable");
  assert.equal(secondSummary, firstSummary, "summary JSON must be byte-stable");
  assert.deepEqual(
    second.rows,
    first.rows,
    "Layer A output must be deterministic",
  );

  assert(
    first.rows.some(
      (row) =>
        row.track === "currency" &&
        row.currency_cluster === "immunization_screening",
    ),
    "immunization/screening currency candidates must be emitted",
  );
  assert(
    first.rows.some(
      (row) => row.track === "coherence" && row.pair_with.length > 0,
    ),
    "coherence queue must include deterministic candidate pairs",
  );
  assert(
    first.rows.every((row) =>
      DEFAULT_BANKS.some((bank) => bank.endsWith(row.bank)),
    ),
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
      (row) =>
        row.track === "coherence" && row.normalized_topic === largestTopic,
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
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}

console.log("early-bank semantic Layer A tests passed");
