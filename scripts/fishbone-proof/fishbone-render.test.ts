import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import {
  FROZEN_TEMPLATES,
  OUTPUT_ROOT,
  buildFishboneProofBundle,
  matchFishboneTemplate,
  type PopulationRecord,
} from "./fishbone-render";

const byteCompare = (left: string, right: string): number =>
  Buffer.compare(Buffer.from(left), Buffer.from(right));

const listFiles = async (directory: string): Promise<string[]> => {
  const output: string[] = [];
  const visit = async (current: string): Promise<void> => {
    const entries = await readdir(current, { withFileTypes: true });
    entries.sort((left, right) => byteCompare(left.name, right.name));
    for (const entry of entries) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile()) output.push(path);
    }
  };
  await visit(directory);
  return output;
};

const serializeArtifacts = (artifacts: Map<string, string>): string => JSON.stringify(
  [...artifacts.entries()].sort(([left], [right]) => byteCompare(left, right)),
);

const recordOrderKey = (record: PopulationRecord): string =>
  `${record.bankPath}\u0000${record.questionId}\u0000${record.exhibitPath}\u0000${String(record.panelIndex).padStart(6, "0")}`;

const main = async (): Promise<void> => {
  const cwd = process.cwd();
  const first = await buildFishboneProofBundle(cwd);
  const second = await buildFishboneProofBundle(cwd);

  assert.equal(
    serializeArtifacts(first.artifacts),
    serializeArtifacts(second.artifacts),
    "two complete live-source generations must be byte-identical",
  );

  const records = first.population.records as PopulationRecord[];
  const summary = first.population.summary as Record<string, unknown>;
  assert.equal(summary.labPanelCount, 126, "frozen-base live lab-panel population changed");
  assert.equal(summary.oneColumnPanelCount, 125, "frozen-base one-column population changed");
  assert.equal(summary.twoOrMoreColumnPanelCount, 1, "frozen-base multi-column population changed");
  assert.equal(records.length, 126);
  assert.deepEqual(
    records.map(recordOrderKey),
    records.map(recordOrderKey).sort(byteCompare),
    "population records must remain in the frozen byte order",
  );

  for (const record of records) {
    const firstMatch = matchFishboneTemplate(record.analyteSet);
    const secondMatch = matchFishboneTemplate(record.analyteSet);
    assert.equal(firstMatch, secondMatch, `${record.panelPath}: template matching is not deterministic`);
    assert.equal(firstMatch ?? "NO_TEMPLATE_MATCH", record.templateMatch, `${record.panelPath}: stored match differs from a fresh match`);
  }

  const expectedTemplates = {
    CBC: ["wbc", "hemoglobin", "hematocrit", "platelets"],
    BMP: ["sodium", "potassium", "chloride", "bicarbonate", "bun", "creatinine", "glucose", "calcium"],
    "expanded chemistry": [
      "sodium", "potassium", "chloride", "bicarbonate", "bun", "creatinine", "glucose", "calcium", "ast", "alt", "total_bilirubin",
    ],
  };
  assert.deepEqual(FROZEN_TEMPLATES, expectedTemplates, "frozen template membership changed");

  const contract = first.manifest.contractPreflight as {
    status: string;
    assertions: Array<{ status: string }>;
    templateAllowlist: Array<{ key: string; allowlisted: boolean; kind: string | null }>;
  };
  assert.equal(contract.status, "PASS");
  assert.ok(contract.assertions.every((entry) => entry.status === "PASS"));
  assert.ok(contract.templateAllowlist.every((entry) => entry.allowlisted && entry.kind === "lab"));

  const selectionStatus = Object.fromEntries(first.manifest.selections.map((selection) => [selection.id, selection.status]));
  assert.equal(selectionStatus.full_or_near_full_cbc, "SELECTED");
  assert.equal(selectionStatus.sparse_cbc_subset, "SELECTED");
  assert.equal(selectionStatus.no_template_flat_fallback, "SELECTED");
  assert.equal(selectionStatus.bmp_or_near_full, "FISHBONE_PROOF_CATEGORY_NOT_FOUND");
  assert.equal(selectionStatus.expanded_chemistry_well_populated, "FISHBONE_PROOF_CATEGORY_NOT_FOUND");

  assert.equal(first.manifest.renders.length, 20, "available categories plus the multi-column fork require 20 render artifacts");
  assert.ok(first.manifest.renders.every((entry) =>
    entry.sourceTupleMultisetHash === entry.currentFlatTupleMultisetHash
    && entry.sourceTupleMultisetHash === entry.candidateTupleMultisetHash));
  assert.ok(first.manifest.renders.every((entry) => !entry.surfaceHorizontalOverflow && !entry.textClipping));
  assert.deepEqual(
    [...new Set(first.manifest.renders.map((entry) => entry.targetWidth))].sort((left, right) => left - right),
    [249, 1325],
  );
  const exactFallbacks = first.manifest.renders.filter((entry) => entry.directFlatByteEquality === true);
  assert.ok(exactFallbacks.length > 0, "current-flat fallback was not exercised");
  assert.ok(exactFallbacks.every((entry) => entry.candidateSvgSha256 === entry.currentFlatSvgSha256));
  assert.ok(first.manifest.conditions.every((condition) => condition.status === "PASS"));
  assert.equal(
    first.manifest.terminalStatus,
    "FISHBONE_PROOF_BLOCKED",
  );

  const multi = first.manifest.multiColumnComparison as {
    status: string;
    source: PopulationRecord;
    outcomes: { M1: string; M2: string };
    adjudication: string;
  };
  assert.equal(multi.status, "SELECTED");
  assert.equal(multi.source.columnCount, 2);
  assert.equal(multi.source.templateMatch, "NO_TEMPLATE_MATCH");
  assert.match(multi.outcomes.M1, /^NO_TEMPLATE_MATCH_DIRECT_FLAT_FALLBACK:/);
  assert.equal(multi.outcomes.M2, "CURRENT_FLAT_FALLBACK_RENDERED");
  assert.equal(multi.adjudication, "NO_WINNER_SELECTED");

  const fallbackAudit = first.manifest.noTemplateFallbackAudit as {
    auditedPanelCount: number;
    failureCount: number;
    records: Array<{ decisionsIdentical: boolean; directCurrentFlatInvocation: boolean; fullSvgByteEquality: boolean }>;
  };
  assert.equal(fallbackAudit.auditedPanelCount, 102);
  assert.equal(fallbackAudit.failureCount, 0);
  assert.ok(fallbackAudit.records.every((entry) =>
    entry.decisionsIdentical && entry.directCurrentFlatInvocation && entry.fullSvgByteEquality));

  const expectedFiles = [...first.artifacts.keys()].sort(byteCompare);
  for (const [path, expectedBytes] of first.artifacts) {
    const committedBytes = await readFile(resolve(cwd, path), "utf8");
    assert.equal(committedBytes, expectedBytes, `${path}: generated bytes differ from disk`);
  }
  const actualFiles = (await listFiles(resolve(cwd, OUTPUT_ROOT)))
    .map((path) => relative(cwd, path))
    .sort(byteCompare);
  assert.deepEqual(actualFiles, expectedFiles, "proof output tree has missing or stale files");
  assert.ok(expectedFiles.every((path) => path.startsWith(`${OUTPUT_ROOT}/`)));

  console.log(`fishbone proof: ${records.length} panels, ${first.manifest.renders.length} SVGs, seven conditions PASS; terminal evidence status remains category-blocked`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
