import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_QUEUE,
  type ConceptCluster,
  type SemanticQueueRow,
} from "./early-bank-semantic-layer-a";

const DEFAULT_LABEL = "2026-06-24";
const DEFAULT_CLUSTERS: ConceptCluster[] = [
  "delegation_scope",
  "isolation_mode",
  "potassium_replacement",
  "insulin_hypoglycemia",
];

type Reviewer = "claude" | "gpt-5";

type BuildAuditBatchOptions = {
  queuePath?: string;
  outPath?: string;
  label?: string;
  clusters?: ConceptCluster[];
  max?: number;
};

type SliceItem = {
  id: string;
  bank: string;
  path: string;
  producer: SemanticQueueRow["producer"];
  provenance_tier: SemanticQueueRow["provenance_tier"];
  harm_rank: number;
  pilot_clusters: ConceptCluster[];
  within_cluster_peers: string[];
};

type SlicePair = {
  a: string;
  b: string;
  clusters: ConceptCluster[];
  reviewer: Reviewer;
  a_producer: SemanticQueueRow["producer"];
  b_producer: SemanticQueueRow["producer"];
  a_bank: string;
  b_bank: string;
  a_path: string;
  b_path: string;
};

export type AuditBatchArtifact = {
  generated: string;
  source_queue: string;
  clusters: ConceptCluster[];
  unique_item_count: number;
  candidate_pair_count: number;
  reviewer_split: {
    claude_pairs: number;
    gpt5_pairs: number;
  };
  gpt5_carveout_ids: string[];
  items: SliceItem[];
  pairs: SlicePair[];
};

const parseArgs = (argv: string[]): BuildAuditBatchOptions => {
  const options: BuildAuditBatchOptions = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (!flag.startsWith("--")) continue;
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for ${flag}`);
    }
    index += 1;
    if (flag === "--clusters") {
      options.clusters = value
        .split(",")
        .map((cluster) => cluster.trim())
        .filter(Boolean) as ConceptCluster[];
    } else if (flag === "--max") {
      const max = Number.parseInt(value, 10);
      if (!Number.isInteger(max) || max <= 0) {
        throw new Error(`--max must be a positive integer, got ${value}`);
      }
      options.max = max;
    } else if (flag === "--label") {
      options.label = value;
    } else if (flag === "--out") {
      options.outPath = value;
    } else if (flag === "--queue") {
      options.queuePath = value;
    } else {
      throw new Error(`Unknown flag ${flag}`);
    }
  }
  return options;
};

const readQueue = async (queuePath: string): Promise<SemanticQueueRow[]> => {
  const text = await readFile(queuePath, "utf8");
  return text
    .split(/\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as SemanticQueueRow);
};

const pilotClustersFor = (
  row: SemanticQueueRow,
  clusters: Set<ConceptCluster>,
) =>
  row.routing_reasons
    .filter((reason) => reason.startsWith("concept cluster: "))
    .map((reason) => reason.replace("concept cluster: ", "") as ConceptCluster)
    .filter((cluster) => clusters.has(cluster))
    .sort();

const pairKey = (left: string, right: string) =>
  left < right ? `${left}\0${right}` : `${right}\0${left}`;

const reviewerFor = (
  left: SemanticQueueRow,
  right: SemanticQueueRow,
): Reviewer =>
  left.producer === "claude" ||
  left.producer === "mixed" ||
  right.producer === "claude" ||
  right.producer === "mixed"
    ? "gpt-5"
    : "claude";

export const buildAuditBatch = async (
  options: BuildAuditBatchOptions = {},
): Promise<AuditBatchArtifact> => {
  const label = options.label ?? DEFAULT_LABEL;
  const queuePath = options.queuePath ?? DEFAULT_QUEUE;
  const selectedClusters = [...(options.clusters ?? DEFAULT_CLUSTERS)].sort();
  const selectedClusterSet = new Set(selectedClusters);
  const rows = (await readQueue(queuePath)).filter(
    (row) => row.track === "coherence",
  );

  const seedEntries = rows
    .map((row) => ({
      row,
      pilotClusters: pilotClustersFor(row, selectedClusterSet),
    }))
    .filter((entry) => entry.pilotClusters.length > 0);
  const seeds = new Map(seedEntries.map((entry) => [entry.row.id, entry]));
  const keptIds = new Set(
    options.max
      ? seedEntries
          .sort(
            (left, right) =>
              right.row.harm_rank - left.row.harm_rank ||
              left.row.id.localeCompare(right.row.id),
          )
          .slice(0, options.max)
          .map((entry) => entry.row.id)
      : seedEntries.map((entry) => entry.row.id),
  );

  const pairClusters = new Map<string, Set<ConceptCluster>>();
  seedEntries.forEach(({ row, pilotClusters }) => {
    if (!keptIds.has(row.id)) return;
    pilotClusters.forEach((cluster) => {
      row.pair_with.forEach((peerId) => {
        const peer = seeds.get(peerId);
        if (!peer || !keptIds.has(peerId)) return;
        if (!peer.pilotClusters.includes(cluster)) return;
        const key = pairKey(row.id, peerId);
        pairClusters.set(key, new Set([...(pairClusters.get(key) ?? []), cluster]));
      });
    });
  });

  const pairs = [...pairClusters.entries()].map(([key, clusters]): SlicePair => {
    const [a, b] = key.split("\0");
    const left = seeds.get(a)?.row;
    const right = seeds.get(b)?.row;
    if (!left || !right) {
      throw new Error(`Internal error: pair ${a}/${b} missing seed row`);
    }
    return {
      a,
      b,
      clusters: [...clusters].sort(),
      reviewer: reviewerFor(left, right),
      a_producer: left.producer,
      b_producer: right.producer,
      a_bank: left.bank,
      b_bank: right.bank,
      a_path: left.path,
      b_path: right.path,
    };
  });
  pairs.sort(
    (left, right) =>
      left.reviewer.localeCompare(right.reviewer) ||
      left.clusters.join(",").localeCompare(right.clusters.join(",")) ||
      left.a.localeCompare(right.a) ||
      left.b.localeCompare(right.b),
  );

  const itemPeers = new Map<string, Set<string>>();
  pairs.forEach((pair) => {
    itemPeers.set(pair.a, new Set([...(itemPeers.get(pair.a) ?? []), pair.b]));
    itemPeers.set(pair.b, new Set([...(itemPeers.get(pair.b) ?? []), pair.a]));
  });
  const itemIds = [...itemPeers.keys()].sort();
  const items = itemIds.map((id): SliceItem => {
    const seed = seeds.get(id);
    if (!seed) throw new Error(`Internal error: item ${id} missing seed row`);
    return {
      id,
      bank: seed.row.bank,
      path: seed.row.path,
      producer: seed.row.producer,
      provenance_tier: seed.row.provenance_tier,
      harm_rank: seed.row.harm_rank,
      pilot_clusters: seed.pilotClusters,
      within_cluster_peers: [...(itemPeers.get(id) ?? [])].sort(),
    };
  });

  const gpt5CarveoutIds = [
    ...new Set(
      pairs
        .filter((pair) => pair.reviewer === "gpt-5")
        .flatMap((pair) => [
          pair.a_producer === "claude" || pair.a_producer === "mixed"
            ? pair.a
            : undefined,
          pair.b_producer === "claude" || pair.b_producer === "mixed"
            ? pair.b
            : undefined,
        ])
        .filter((id): id is string => Boolean(id)),
    ),
  ].sort();

  return {
    generated: label,
    source_queue: queuePath,
    clusters: selectedClusters,
    unique_item_count: items.length,
    candidate_pair_count: pairs.length,
    reviewer_split: {
      claude_pairs: pairs.filter((pair) => pair.reviewer === "claude").length,
      gpt5_pairs: pairs.filter((pair) => pair.reviewer === "gpt-5").length,
    },
    gpt5_carveout_ids: gpt5CarveoutIds,
    items,
    pairs,
  };
};

export const writeAuditBatch = async (
  options: BuildAuditBatchOptions = {},
) => {
  const label = options.label ?? DEFAULT_LABEL;
  const outPath =
    options.outPath ??
    `audit/early-bank-semantic/coherence/${label}.slice.json`;
  const artifact = await buildAuditBatch(options);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
  return { artifact, outPath };
};

const runCli = async () => {
  const { artifact, outPath } = await writeAuditBatch(parseArgs(process.argv.slice(2)));
  console.log(
    `Wrote ${artifact.unique_item_count} items / ` +
      `${artifact.candidate_pair_count} pairs to ${outPath} ` +
      `(claude=${artifact.reviewer_split.claude_pairs}, ` +
      `gpt-5=${artifact.reviewer_split.gpt5_pairs}).`,
  );
};

if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  await runCli();
}
