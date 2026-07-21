import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  buildLabTrendPresentationModel,
  buildLabTrendTableModel,
  renderLabTrendPresentationSvg,
  renderLabTrendSvg,
  selfCheckLabTrend,
  validateLabTrend,
} from "../../src/visuals/kinds/lab_trend";
import {
  EMPTY_LAB_TREND_INTERACTION,
  opacityForLabAnalyte,
  resolveActiveLabTimepoint,
  transitionLabTrendInteraction,
} from "../../src/visuals/kinds/lab_trend/interaction";
import type { LabTrendSpec } from "../../src/visuals/kinds/lab_trend/types";
import { loadPromotedVisualRecords, type PromotedVisualRecord } from "../promoted-visual-parity";
import "../../src/visuals/kinds";

type SnapshotRecord = {
  questionId: string;
  visualObjectPath: string;
  modelSha256: string;
  svgSha256: string;
};

const canonicalize = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => [key, canonicalize(entry)]),
  );
};
const stableJson = (value: unknown): string => `${JSON.stringify(canonicalize(value), null, 2)}\n`;
const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");

const visualObjectPath = (record: PromotedVisualRecord): string => {
  const ref = record.ref;
  switch (ref.location) {
    case "question": return "question.visual";
    case "questionRationale": return `question.rationale.visuals[${ref.locationIndex}]`;
    case "caseExhibit": return `caseStudy.exhibits[${ref.locationIndex}].visual`;
    case "caseStageExhibit": return `caseStudy.stages[${ref.stageIndex}].exhibits[${ref.locationIndex}].visual`;
    case "caseQuestion": return `caseStudy.questions[id=${ref.ownerId}].visual`;
    case "caseQuestionRationale": return `caseStudy.questions[id=${ref.ownerId}].rationale.visuals[${ref.locationIndex}]`;
  }
};

const synthetic: LabTrendSpec = {
  kind: "lab_trend",
  time: { unit: "hr", values: [0, 4, 8] },
  series: [
    { analyte: "creatinine", values: [1, 1.5, 2] },
    { analyte: "bun", values: [20, 15, 10] },
  ],
};
const model = buildLabTrendPresentationModel(synthetic);
assert.equal(model.mode, "normalized");
if (model.mode !== "normalized") throw new Error("synthetic model must normalize");
assert.deepEqual(
  model.series.map((series) => series.points.map((point) => point.normalizedChangePct)),
  [[0, 50, 100], [0, -25, -50]],
  "each series must use percent change from its own nonzero baseline",
);
assert(model.series.every((series) => series.points[0].normalizedChangePct === 0), "every baseline must be exactly 0%");
assert(model.yAxis.min < 0 && model.yAxis.max > 0, "opposite trajectories must share one fitted scale around zero");
assert(model.yAxis.ticks.includes(0), "fitted percentage ticks must include the baseline");
assert.equal(model.readoutByTimepoint[1].rows[0].valueText, "1.5 mg/dL");
assert.equal(model.readoutByTimepoint[1].rows[1].valueText, "15 mg/dL");
assert.deepEqual(model.tableModel, buildLabTrendTableModel(synthetic), "readout and graph must share the table model");

const presentationSvg = renderLabTrendPresentationSvg(synthetic, model);
assert.equal(presentationSvg, renderLabTrendPresentationSvg(synthetic, model), "normalized SVG must be byte-deterministic");
assert(presentationSvg.includes('data-variant="normalized"'));
assert(presentationSvg.includes("Change from baseline"));
assert(presentationSvg.includes('data-baseline-line="true"'));
assert.equal((presentationSvg.match(/data-timepoint-index=/g) ?? []).length, 3);
assert.equal((presentationSvg.match(/data-guide-line="true"/g) ?? []).length, 1);
assert(!presentationSvg.includes("reference-band"), "normalized graph must not render original-unit reference bands");

const zeroBaseline: LabTrendSpec = {
  kind: "lab_trend",
  time: { unit: "min", values: [0, 30, 60] },
  series: [
    { analyte: "troponin_t", values: [0, 0.01, 0.02] },
    { analyte: "bnp", values: [80, 100, 120] },
  ],
};
const fallback = buildLabTrendPresentationModel(zeroBaseline);
assert.deepEqual(
  { mode: fallback.mode, reason: fallback.mode === "legacy_fallback" ? fallback.reason : undefined },
  { mode: "legacy_fallback", reason: "zero_baseline" },
);
assert.deepEqual(fallback.tableModel, buildLabTrendTableModel(zeroBaseline), "fallback must retain the exact table");
const fallbackSvg = renderLabTrendPresentationSvg(zeroBaseline, fallback);
assert.equal(fallbackSvg, renderLabTrendSvg(zeroBaseline), "fallback must use the registered legacy graph");
assert(!/Infinity|NaN/.test(stableJson(fallback) + fallbackSvg), "fallback must not emit invalid numeric output");

const authoredUnits: LabTrendSpec = {
  kind: "lab_trend",
  time: { unit: "day", values: [1, 2, 3] },
  series: [
    { analyte: "hemoglobin", unit: "g/L", values: [12, 11, 10] },
    { analyte: "hematocrit", values: [36, 33, 30] },
  ],
};
const authoredTable = buildLabTrendTableModel(authoredUnits);
assert.deepEqual(authoredTable.columns.map((column) => column.label), ["Laboratory test", "Day 1", "Day 2", "Day 3"]);
assert.deepEqual(authoredTable.rows.map((row) => [row.key, row.unit, row.values]), [
  ["hemoglobin", "g/L", ["12", "11", "10"]],
  ["hematocrit", "%", ["36", "33", "30"]],
]);
assert(!/"(?:flags?|normal|referenceBand)"\s*:/i.test(stableJson(authoredTable)), "table model must remain values-only");

const pediatric: LabTrendSpec = {
  kind: "lab_trend",
  population: "peds_child",
  time: { unit: "hr", values: [0, 12, 24] },
  series: [
    { analyte: "lactate", values: [4.2, 2.8, 1.9], showReferenceBand: false },
    { analyte: "wbc", values: [18, 14, 10], showReferenceBand: false },
  ],
};
assert(
  !/"(?:flags?|normal|referenceBand)"\s*:/i.test(stableJson(buildLabTrendPresentationModel(pediatric))),
  "pediatric model must invent no interpretation",
);

const identical: LabTrendSpec = {
  kind: "lab_trend",
  time: { unit: "hr", values: [0, 1, 2] },
  series: [
    { analyte: "hemoglobin", values: [10, 9, 8] },
    { analyte: "hematocrit", values: [30, 27, 24] },
  ],
};
const identicalModel = buildLabTrendPresentationModel(identical);
assert.equal(identicalModel.mode, "normalized");
if (identicalModel.mode !== "normalized") throw new Error("identical fixture must normalize");
assert.deepEqual(
  identicalModel.series[0].points.map((point) => point.normalizedChangePct),
  identicalModel.series[1].points.map((point) => point.normalizedChangePct),
  "identical relative trajectories must keep identical geometry",
);
assert.notEqual(identicalModel.legend[0].key, identicalModel.legend[1].key, "identical geometry must retain distinct identities");
assert.equal(opacityForLabAnalyte("hemoglobin", "hemoglobin"), 1);
assert.equal(opacityForLabAnalyte("hematocrit", "hemoglobin"), 0.18);

let interaction = transitionLabTrendInteraction(EMPTY_LAB_TREND_INTERACTION, { type: "timepoint-enter", index: 1 });
assert.equal(resolveActiveLabTimepoint(interaction), 1);
interaction = transitionLabTrendInteraction(interaction, { type: "timepoint-activate", index: 1 });
interaction = transitionLabTrendInteraction(interaction, { type: "timepoint-leave", index: 1 });
assert.equal(resolveActiveLabTimepoint(interaction), 1, "pinned timepoint must survive pointer leave");
interaction = transitionLabTrendInteraction(interaction, { type: "timepoint-activate", index: 1 });
assert.equal(resolveActiveLabTimepoint(interaction), null, "second activation must clear the pin");

const allPromoted = await loadPromotedVisualRecords();
const promotedLabs = allPromoted.filter((record) => record.ref.visual.kind === "lab_trend");
const oneSeries = promotedLabs.filter((record) => record.ref.visual.kind === "lab_trend" && record.ref.visual.series.length === 1);
const twoSeries = promotedLabs.filter((record) => record.ref.visual.kind === "lab_trend" && record.ref.visual.series.length === 2);
assert.deepEqual({ total: promotedLabs.length, one: oneSeries.length, two: twoSeries.length }, { total: 20, one: 11, two: 9 });

for (const record of promotedLabs) {
  if (record.ref.visual.kind !== "lab_trend") continue;
  assert.deepEqual(validateLabTrend(record.ref.visual), [], `${record.parityId} validation must remain unchanged`);
  assert.deepEqual(selfCheckLabTrend(record.ref.visual, record.carrierQuestion), [], `${record.parityId} selfCheck must remain unchanged`);
}
for (const record of twoSeries) {
  if (record.ref.visual.kind !== "lab_trend") continue;
  assert.equal(buildLabTrendPresentationModel(record.ref.visual).mode, "normalized", `${record.parityId} must use normalized presentation`);
}

const registeredSnapshot = JSON.parse(
  await readFile(new URL("./__snapshots__/visual-parity-promoted/lab_trend.json", import.meta.url), "utf8"),
) as { records: Array<{ parityId: string; svgHash: string }> };
const registeredById = new Map(registeredSnapshot.records.map((record) => [record.parityId, record.svgHash]));
for (const record of promotedLabs) {
  if (record.ref.visual.kind !== "lab_trend") continue;
  assert.equal(sha256(renderLabTrendSvg(record.ref.visual)), registeredById.get(record.parityId), `${record.parityId} registered SVG parity must not move`);
}

const actualPresentationSnapshot: SnapshotRecord[] = twoSeries.map((record) => {
  if (record.ref.visual.kind !== "lab_trend") throw new Error("unreachable non-lab record");
  const presentationModel = buildLabTrendPresentationModel(record.ref.visual);
  return {
    questionId: record.ref.ownerId,
    visualObjectPath: visualObjectPath(record),
    modelSha256: sha256(stableJson(presentationModel)),
    svgSha256: sha256(renderLabTrendPresentationSvg(record.ref.visual, presentationModel)),
  };
}).sort((left, right) =>
  left.questionId.localeCompare(right.questionId) || left.visualObjectPath.localeCompare(right.visualObjectPath)
);
const expectedPresentationSnapshot = JSON.parse(
  await readFile(new URL("./__snapshots__/lab-trend-dual-series.json", import.meta.url), "utf8"),
) as SnapshotRecord[];
assert.deepEqual(actualPresentationSnapshot, expectedPresentationSnapshot, "all nine dual-series presentation hashes must match the fixed snapshot");

const styles = await readFile(new URL("../../src/styles.css", import.meta.url), "utf8");
const printRules = styles.slice(styles.indexOf("@media print"), styles.indexOf(".speak-button"));
assert(printRules.includes(".lab-trend-epic-controls") && printRules.includes(".lab-trend-epic-readout"));
assert(printRules.includes("display: none"), "print must hide transient lab controls and readout");
assert(printRules.includes(".lab-trend-epic-table") && printRules.includes("min-width: 0"));
assert(printRules.includes(".lab-trend-epic-table th:first-child") && printRules.includes("position: static"));

console.log("lab trend dual-series presentation tests passed");
