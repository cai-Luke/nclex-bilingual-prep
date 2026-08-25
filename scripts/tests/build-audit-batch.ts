import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildAuditBatch,
  writeAuditBatch,
  type AuditBatchArtifact,
  type ExclusionReason,
} from "../audit/build-audit-batch";
import type {
  ConceptCluster,
  SemanticQueueRow,
} from "../audit/early-bank-semantic-layer-a";

const DEFAULT_SLICE =
  "audit/early-bank-semantic/coherence/2026-06-24.slice.json";
const PHASE_B_SLICE =
  "audit/early-bank-semantic/coherence/2026-06-25-phaseB.slice.json";
const DEFAULT_QUEUE = "audit/early-bank-semantic/layer-a-queue.jsonl";
const PAIR_40_CHILD_KEY = pairKey(
  "gemini_b9_05",
  "gpt_gap_2026_06_12_nonmcq_balanced_case_pressure_injury_nutrition_03_q1",
);

const expectedCarveoutIds = [
  "claude_moc_assignment_mc_14",
  "claude_moc_deleg_uap_hl_01",
  "claude_moc_lpn_deleg_hl_b01",
  "claude_moc_supervision_hl_b04",
];

const addedArtifactFields = [
  "source_queue_sha256",
  "max",
  "coherence_row_count",
  "selected_seed_count",
  "kept_seed_count",
  "considered_pair_count",
  "excluded_pair_count",
  "zero_survivor_seed_count",
  "excluded_pairs",
  "zero_survivor_seed_ids",
] as const;

function pairKey(left: string, right: string) {
  return left < right ? `${left}\0${right}` : `${right}\0${left}`;
}

const sha256 = (bytes: Buffer | string) =>
  createHash("sha256").update(bytes).digest("hex");

const legacyProjection = (artifact: AuditBatchArtifact) => {
  const projection: Record<string, unknown> = { ...artifact };
  addedArtifactFields.forEach((field) => delete projection[field]);
  return projection;
};

const pairKeys = (pairs: Array<{ a: string; b: string }>) =>
  pairs.map((pair) => pairKey(pair.a, pair.b)).sort();

const reasonCounts = (artifact: AuditBatchArtifact) => {
  const counts: Partial<Record<ExclusionReason, number>> = {};
  artifact.excluded_pairs.forEach((pair) => {
    pair.reasons.forEach((reason) => {
      counts[reason] = (counts[reason] ?? 0) + 1;
    });
  });
  return counts;
};

const assertP26Partition = (artifact: AuditBatchArtifact) => {
  assert.equal(
    artifact.candidate_pair_count + artifact.excluded_pair_count,
    artifact.considered_pair_count,
  );
  const emitted = new Set(pairKeys(artifact.pairs));
  const excluded = pairKeys(artifact.excluded_pairs);
  assert.equal(
    excluded.filter((key) => emitted.has(key)).length,
    0,
    "emitted and excluded unordered pair sets must be disjoint",
  );
};

const fixtureRow = (
  id: string,
  options: {
    clusters?: ConceptCluster[];
    pairWith?: string[];
    harmRank?: number;
  } = {},
): SemanticQueueRow => ({
  id,
  bank: "fixture.json",
  path: `questions[${id}]`,
  producer: "gpt",
  provenance_tier: "high",
  topic: "Fixture",
  normalized_topic: "fixture",
  item_type: "multiple_choice",
  currency_clusters: [],
  concept_clusters: options.clusters ?? [],
  track: "coherence",
  pair_with: options.pairWith ?? [],
  routing_reasons:
    (options.clusters ?? []).length > 0
      ? (options.clusters ?? []).map(
          (cluster) => `concept cluster: ${cluster}`,
        )
      : ["topic/answer similarity pair"],
  harm_rank: options.harmRank ?? 1,
});

const defaultSliceBytesBefore = await readFile(DEFAULT_SLICE, "utf8");
const phaseBSliceBytesBefore = await readFile(PHASE_B_SLICE, "utf8");
const defaultOracle = JSON.parse(defaultSliceBytesBefore) as Record<
  string,
  unknown
>;
const phaseBOracle = JSON.parse(phaseBSliceBytesBefore) as {
  clusters: ConceptCluster[];
  items: Array<{ id: string }>;
  pairs: Array<{ a: string; b: string }>;
};
const queueBytes = await readFile(DEFAULT_QUEUE);
const independentlyHashedQueue = sha256(queueBytes);
const independentlyCountedCoherenceRows = queueBytes
  .toString("utf8")
  .split(/\n/)
  .filter((line) => line.trim().length > 0)
  .map((line) => JSON.parse(line) as SemanticQueueRow)
  .filter((row) => row.track === "coherence").length;

const tempRoot = await mkdtemp(join(tmpdir(), "project-shrimp-p26-batch-"));
try {
  const artifact = await buildAuditBatch();
  assert.deepEqual(
    legacyProjection(artifact),
    defaultOracle,
    "default pre-existing fields must match the committed June-24 slice",
  );
  assert.equal(artifact.unique_item_count, 109);
  assert.equal(artifact.candidate_pair_count, 156);
  assert.equal(artifact.reviewer_split.claude_pairs, 149);
  assert.equal(artifact.reviewer_split.gpt5_pairs, 5);
  assert.equal(artifact.reviewer_split.gemini_pairs, 2);
  assert.equal(artifact.reviewer_split.needs_provenance_pairs, 0);
  assert.deepEqual(artifact.gpt5_carveout_ids, expectedCarveoutIds);
  assert.deepEqual(artifact.needs_provenance_pairs, []);
  assert.equal(artifact.coherence_row_count, independentlyCountedCoherenceRows);
  assert.equal(artifact.selected_seed_count, 109);
  assert.equal(artifact.kept_seed_count, 109);
  assert.equal(artifact.considered_pair_count, 204);
  assert.equal(artifact.excluded_pair_count, 48);
  assert.equal(artifact.zero_survivor_seed_count, 0);
  assert.deepEqual(artifact.zero_survivor_seed_ids, []);
  assert.equal(artifact.max, null);
  assert.equal(artifact.source_queue_sha256, independentlyHashedQueue);
  assert.deepEqual(reasonCounts(artifact), {
    peer_has_no_selected_pilot_cluster: 48,
  });
  assertP26Partition(artifact);

  const tempOutput = join(tempRoot, "default.slice.json");
  const first = await writeAuditBatch({ outPath: tempOutput });
  const firstBytes = await readFile(tempOutput, "utf8");
  const second = await writeAuditBatch({ outPath: tempOutput });
  const secondBytes = await readFile(tempOutput, "utf8");
  assert.equal(secondBytes, firstBytes, "slice artifact must be byte-stable");
  assert.deepEqual(
    second.artifact,
    first.artifact,
    "batch builder output must be deterministic",
  );

  const phaseB = await buildAuditBatch({ clusters: phaseBOracle.clusters });
  assert.equal(phaseB.selected_seed_count, 93);
  assert.equal(phaseB.kept_seed_count, 93);
  assert.equal(phaseB.considered_pair_count, 133);
  assert.equal(phaseB.candidate_pair_count, 104);
  assert.equal(phaseB.excluded_pair_count, 29);
  assert.equal(phaseB.zero_survivor_seed_count, 0);
  assert.deepEqual(phaseB.zero_survivor_seed_ids, []);
  assert.deepEqual(
    phaseB.items.map((item) => item.id).sort(),
    phaseBOracle.items.map((item) => item.id).sort(),
    "Phase-B item IDs must match the committed slice",
  );
  assert.deepEqual(
    pairKeys(phaseB.pairs),
    pairKeys(phaseBOracle.pairs),
    "Phase-B emitted pair keys must match the committed slice",
  );
  assert.deepEqual(reasonCounts(phaseB), {
    peer_has_no_selected_pilot_cluster: 29,
  });
  assertP26Partition(phaseB);
  const phaseBEmitted = new Set(pairKeys(phaseB.pairs));
  const phaseBExcluded = new Set(pairKeys(phaseB.excluded_pairs));
  assert.equal(phaseBEmitted.has(PAIR_40_CHILD_KEY), false);
  assert.equal(phaseBExcluded.has(PAIR_40_CHILD_KEY), false);

  const fixtureRows = [
    fixtureRow("a_shared", {
      clusters: ["delegation_scope"],
      pairWith: ["b_shared"],
      harmRank: 100,
    }),
    fixtureRow("b_shared", {
      clusters: ["delegation_scope"],
      pairWith: ["a_shared"],
      harmRank: 90,
    }),
    fixtureRow("c_zero_unselected", {
      clusters: ["isolation_mode"],
      pairWith: ["d_unselected"],
      harmRank: 80,
    }),
    fixtureRow("d_unselected", {
      pairWith: ["c_zero_unselected"],
      harmRank: 70,
    }),
    fixtureRow("e_no_shared", {
      clusters: ["delegation_scope"],
      pairWith: ["f_no_shared"],
      harmRank: 60,
    }),
    fixtureRow("f_no_shared", {
      clusters: ["isolation_mode"],
      pairWith: ["e_no_shared"],
      harmRank: 50,
    }),
  ];
  const fixtureBytes = `${fixtureRows
    .map((row) => JSON.stringify(row))
    .join("\n")}\n`;
  const fixturePath = join(tempRoot, "fixture-queue.jsonl");
  await writeFile(fixturePath, fixtureBytes, "utf8");

  const fixture = await buildAuditBatch({ queuePath: fixturePath });
  assert.equal(fixture.source_queue_sha256, sha256(fixtureBytes));
  assert.equal(fixture.coherence_row_count, 6);
  assert.equal(fixture.selected_seed_count, 5);
  assert.equal(fixture.kept_seed_count, 5);
  assert.equal(fixture.considered_pair_count, 3);
  assert.equal(fixture.candidate_pair_count, 1);
  assert.equal(fixture.excluded_pair_count, 2);
  assert.equal(fixture.zero_survivor_seed_count, 3);
  assert.deepEqual(pairKeys(fixture.pairs), [pairKey("a_shared", "b_shared")]);
  assert.deepEqual(fixture.zero_survivor_seed_ids, [
    "c_zero_unselected",
    "e_no_shared",
    "f_no_shared",
  ]);
  assert.deepEqual(reasonCounts(fixture), {
    no_shared_selected_pilot_cluster: 1,
    peer_has_no_selected_pilot_cluster: 1,
  });
  const fixtureExcludedKeys = fixture.excluded_pairs.map((pair) =>
    pairKey(pair.a, pair.b),
  );
  assert.deepEqual(fixtureExcludedKeys, [...fixtureExcludedKeys].sort());
  fixture.excluded_pairs.forEach((pair) => {
    assert.deepEqual(pair.reasons, [...pair.reasons].sort());
    assert.deepEqual(
      pair.a_pilot_clusters,
      [...pair.a_pilot_clusters].sort(),
    );
    assert.deepEqual(
      pair.b_pilot_clusters,
      [...pair.b_pilot_clusters].sort(),
    );
  });
  assertP26Partition(fixture);

  const cappedFixture = await buildAuditBatch({
    queuePath: fixturePath,
    max: 1,
  });
  assert.equal(cappedFixture.max, 1);
  assert.equal(cappedFixture.selected_seed_count, 5);
  assert.equal(cappedFixture.kept_seed_count, 1);
  assert.equal(cappedFixture.considered_pair_count, 0);
  assert.equal(cappedFixture.excluded_pair_count, 0);
  assert.deepEqual(cappedFixture.excluded_pairs, []);
  assert.deepEqual(cappedFixture.zero_survivor_seed_ids, ["a_shared"]);

  assert.equal(await readFile(DEFAULT_SLICE, "utf8"), defaultSliceBytesBefore);
  assert.equal(await readFile(PHASE_B_SLICE, "utf8"), phaseBSliceBytesBefore);
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}

console.log("audit batch builder tests passed");
