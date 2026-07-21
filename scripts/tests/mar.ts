/** Dedicated MAR renderer and shared-table regression contract. */
import { readFileSync } from "node:fs";
import "../../src/visuals/kinds";
import { loadPromotedVisualRecords } from "../promoted-visual-parity";
import {
  buildMarTableModel,
  marCanvasWidth,
  renderMarSvg,
  selfCheckMar,
  validateMar,
  wrapText,
} from "../../src/visuals/kinds/mar/index";
import { measureDocTable, renderDocTable, type DocTableCell } from "../../src/visuals/primitives/table";
import type { MarSpec } from "../../src/visuals/kinds/mar/types";
import type { Question } from "../../src/types";

const assert: (condition: unknown, message: string) => asserts condition = (condition, message) => {
  if (!condition) throw new Error(`[mar test] FAIL: ${message}`);
};

const pass = (message: string): void => console.log(`  ✓ ${message}`);
const compact = (value: string): string => value.replace(/\s/g, "");
const SVG_ROUNDING_TOLERANCE = 0.011;
const nearlyEqual = (left: number, right: number): boolean => Math.abs(left - right) < SVG_ROUNDING_TOLERANCE;
const cellObject = (value: string | DocTableCell | undefined): DocTableCell =>
  typeof value === "string" ? { text: value } : value ?? { text: "" };

const attributes = (tag: string): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const match of tag.matchAll(/([\w:-]+)="([^"]*)"/g)) result[match[1]] = match[2];
  return result;
};

const nestedViewports = (svg: string): Record<string, string>[] =>
  [...svg.matchAll(/<svg\b[^>]*data-table-(?:column|header|row)="[^"]*"[^>]*>/g)]
    .map(match => attributes(match[0]));

const rootDimensions = (svg: string): { width: number; height: number; viewWidth: number; viewHeight: number } => {
  const tag = svg.match(/^<svg\b[^>]*>/)?.[0];
  assert(tag, "root SVG tag must exist");
  const attrs = attributes(tag);
  const viewBox = attrs.viewBox?.split(" ").map(Number);
  assert(viewBox?.length === 4, "root viewBox must contain four numbers");
  return {
    width: Number(attrs.width),
    height: Number(attrs.height),
    viewWidth: viewBox[2],
    viewHeight: viewBox[3],
  };
};

console.log("\n=== Promoted corpus and forcing identity ===");
const allRecords = await loadPromotedVisualRecords();
const marRecords = allRecords.filter(record => record.ref.visual.kind === "mar");
assert(marRecords.length === 11, `expected 11 promoted MAR records, got ${marRecords.length}`);
assert(marRecords.every(record => record.carrierRoute === "top-level-question"), "every promoted MAR must be top-level-question");
const forcingRecord = marRecords.find(record => record.parityId === "gpt_fresh_2026_06_22_vis_06");
assert(forcingRecord, "forcing record must load by exact promoted parity ID");
assert(forcingRecord.carrierQuestionId === "gpt_fresh_2026_06_22_vis_06", "forcing carrier ID must match exactly");
assert(marRecords.every(record => marCanvasWidth((record.ref.visual as MarSpec).timeGrid.length) === 600), "current promoted corpus must remain 600 units wide");
pass("11 promoted top-level MARs found; forcing identity present; all remain 600 units wide");

const forcingSpec = forcingRecord.ref.visual as MarSpec;
const forcingQuestion = forcingRecord.carrierQuestion as unknown as Question;
const forcingModel = buildMarTableModel(forcingSpec);
const forcingSvg = renderMarSvg(forcingSpec);
assert(forcingSvg === renderMarSvg(forcingSpec), "identical input must produce byte-identical SVG");
assert(validateMar(forcingSpec).length === 0, "forcing record must validate");
assert(selfCheckMar(forcingSpec, forcingQuestion).length === 0, "forcing record keyed cells must self-check");

const invalidStatus = structuredClone(forcingSpec);
invalidStatus.medications[0].administrations[0].status = "bad" as never;
assert(validateMar(invalidStatus).some(error => error.code === "invalid_status"), "status validation must reject unknown values");
const brokenQuestion = structuredClone(forcingQuestion) as unknown as Record<string, unknown>;
const brokenMeta = brokenQuestion.meta as Record<string, unknown>;
const keyedCells = structuredClone(brokenMeta.keyed_cells) as Record<string, unknown>[];
keyedCells[0].time = "does-not-exist";
brokenMeta.keyed_cells = keyedCells;
assert(selfCheckMar(forcingSpec, brokenQuestion).some(error => error.code === "self_check_keyed_cell_absent"), "selfCheck must reject an unresolved keyed cell");
pass("validation/selfCheck behavior and deterministic rendering remain load-bearing");

console.log("\n=== Wrapping policy and row/header metrics ===");
const forcingMedIndex = forcingSpec.medications.findIndex(med => med.name === "Heparin Discontinue Order");
assert(forcingMedIndex >= 0, "forcing medication must be present");
const forcingMedCell = cellObject(forcingModel.input.rows[forcingMedIndex].cells.med);
assert((forcingMedCell.displayLines?.length ?? 0) > 1, "forcing medication must render on multiple lines");
assert(compact(forcingMedCell.displayLines!.join("")) === compact(forcingMedCell.text), "forcing medication lines must preserve every authored character");

for (const text of ["hydrocodone-acetaminophen", "trimethoprim-sulfamethoxazole"]) {
  const first = wrapText(text, 80, 12);
  const second = wrapText(text, 80, 12);
  assert(JSON.stringify(first) === JSON.stringify(second), `${text} wrapping must be deterministic`);
  assert(first.length > 1 && first.join("") === text, `${text} must wrap without losing its hyphen`);
}
const longToken = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijkl";
const hardBreak = wrapText(longToken, 40, 12);
assert(hardBreak.length > 1 && hardBreak.join("") === longToken, "unbroken token must hard-break without loss");

const wideStress = "WWWWWWMMMMMM@@@@@@%%%%%%";
const narrowStress = "iiiiiiiiiiiiiiiiiiiiiiii";
const wideLines = wrapText(wideStress, 70, 12);
const narrowLines = wrapText(narrowStress, 70, 12);
assert(wideLines.length > narrowLines.length, `wide ASCII glyphs must wrap more conservatively than narrow glyphs (${wideLines.length} vs ${narrowLines.length})`);
assert(wideLines.join("") === wideStress, "wide-glyph wrapping must preserve every character");
const independentWideEm: Record<string, number> = { W: 0.99, M: 0.92, "@": 1, "%": 0.95 };
for (const line of wideLines) {
  const independentWidth = [...line].reduce((sum, glyph) => sum + independentWideEm[glyph] * 12, 0);
  assert(independentWidth <= 70, `wide-glyph line '${line}' exceeds independent conservative bound: ${independentWidth.toFixed(2)}px > 70px`);
}

const metricSpec: MarSpec = {
  kind: "mar",
  timeGrid: ["0800"],
  medications: [
    { name: "ASA", dose: "81 mg", route: "PO", frequency: "daily", administrations: [] },
    { name: "WWWWWWWWWWWWWWWWWWWW", dose: "1 mg", route: "PO", frequency: "daily", administrations: [] },
    { name: "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW", dose: "1 mg", route: "PO", frequency: "daily", administrations: [] },
  ],
};
const metricModel = buildMarTableModel(metricSpec);
assert(metricModel.input.rows[0].rowHeight === 28, "one-line row must be exactly 28 units high");
assert(metricModel.input.rows[1].rowHeight === 42, `two-line row must be exactly 42 units high, got ${metricModel.input.rows[1].rowHeight}`);
assert(metricModel.input.rows[2].rowHeight === 56, `three-line row must be exactly 56 units high, got ${metricModel.input.rows[2].rowHeight}`);
assert(metricModel.input.headerHeight === 32, "four-digit header must remain exactly 32 units high");

const longHeaderSpec: MarSpec = {
  kind: "mar",
  timeGrid: ["VERY-LONG-HEADER-LABEL"],
  medications: [{ name: "ASA", dose: "81 mg", route: "PO", frequency: "daily", administrations: [] }],
};
const longHeaderModel = buildMarTableModel(longHeaderSpec);
const longHeaderLines = longHeaderModel.input.columnHeaderLines?.[4];
assert(longHeaderLines && longHeaderLines.length > 1, "synthetic long time header must wrap");
assert(longHeaderModel.input.headerHeight === longHeaderLines.length * 13 + 12, "long header height must exactly follow resolved line count");
pass("wide glyphs, hyphens, hard breaks, and exact 28/42/56/header metrics verified");

console.log("\n=== Status, bold, source preservation, and geometry ===");
for (const [medication, time] of [["Heparin Infusion", "0800"], ["Apixaban", "0900"], ["Heparin Discontinue Order", "1000"]] as const) {
  const medIndex = forcingSpec.medications.findIndex(med => med.name === medication);
  const timeIndex = forcingSpec.timeGrid.indexOf(time);
  assert(medIndex >= 0 && timeIndex >= 0, `${medication}/${time} must exist`);
  assert(forcingSpec.medications[medIndex].administrations.some(admin => admin.time === time), `${medication} must align to ${time}`);
  assert(cellObject(forcingModel.input.rows[medIndex].cells[`t_${time}`]).text.length > 0, `${medication}/${time} must have a rendered status glyph`);
}

const flagSpec: MarSpec = {
  kind: "mar",
  timeGrid: ["0800", "1200"],
  medications: [{
    name: "trimethoprim-sulfamethoxazole",
    dose: "160 mg/800 mg",
    route: "PO",
    frequency: "BID",
    administrations: [{ time: "0800", status: "held" }, { time: "1200", status: "given" }],
    isHighAlert: true,
  }],
};
const flagModel = buildMarTableModel(flagSpec);
const flagRowHeight = flagModel.input.rows[0].rowHeight!;
const flagSvg = renderMarSvg(flagSpec);
const headerHeight = flagModel.input.headerHeight!;
const flagRect = [...flagSvg.matchAll(/<rect\b[^>]*fill="#fef9c3"[^>]*\/>/g)].map(match => attributes(match[0]));
assert(flagRect.length === 1, `expected exactly one flagged background, got ${flagRect.length}`);
assert(Number(flagRect[0].y) === headerHeight + 1, "flag background y must match resolved row top + 1");
assert(Number(flagRect[0].height) === flagRowHeight - 2, "flag background height must exactly fill resolved row interior");

const medicationViewport = flagSvg.match(/<svg\b[^>]*data-table-column="med"[^>]*data-table-row="0"[^>]*>(.*?)<\/svg>/)?.[0];
assert(medicationViewport, "high-alert medication viewport must exist");
const medLineCount = cellObject(flagModel.input.rows[0].cells.med).displayLines!.length;
assert((medicationViewport.match(/<text\b/g) ?? []).length === medLineCount, "medication viewport must render every wrapped line");
assert((medicationViewport.match(/font-weight="600"/g) ?? []).length === medLineCount, "every medication-name line must retain bold styling");

const viewports = nestedViewports(forcingSvg);
const columns = forcingModel.input.columns;
const totalFr = columns.reduce((sum, col) => sum + (col.widthFr ?? 1), 0);
const widths = columns.map(col => (col.widthFr ?? 1) / totalFr * forcingModel.width);
const xs: number[] = [];
widths.reduce((x, width) => { xs.push(x); return x + width; }, 0);
const rowYs: number[] = [];
forcingModel.input.rows.reduce((y, row) => { rowYs.push(y); return y + row.rowHeight!; }, forcingModel.input.headerHeight!);
assert(viewports.length === columns.length * (forcingModel.input.rows.length + 1), "every header/body cell, including blanks, must have one contained viewport");
for (const viewport of viewports) {
  const colIndex = columns.findIndex(col => col.key === viewport["data-table-column"]);
  assert(colIndex >= 0, `unknown viewport column ${viewport["data-table-column"]}`);
  const x = Number(viewport.x);
  const y = Number(viewport.y);
  const width = Number(viewport.width);
  const height = Number(viewport.height);
  assert(nearlyEqual(x, xs[colIndex] + 1) && nearlyEqual(width, widths[colIndex] - 2), `viewport ${viewport["data-table-column"]} must match its individual column bounds`);
  assert(x >= xs[colIndex] - SVG_ROUNDING_TOLERANCE && x + width <= xs[colIndex] + widths[colIndex] + SVG_ROUNDING_TOLERANCE, "viewport must not cross its column bounds");
  if (viewport["data-table-header"] === "true") {
    assert(nearlyEqual(y, 1) && nearlyEqual(height, forcingModel.input.headerHeight! - 2), "header viewport must match resolved header bounds");
  } else {
    const rowIndex = Number(viewport["data-table-row"]);
    const rowHeight = forcingModel.input.rows[rowIndex].rowHeight!;
    assert(nearlyEqual(y, rowYs[rowIndex] + 1) && nearlyEqual(height, rowHeight - 2), `row ${rowIndex} viewport must match its individual row bounds`);
    assert(y >= rowYs[rowIndex] - SVG_ROUNDING_TOLERANCE && y + height <= rowYs[rowIndex] + rowHeight + SVG_ROUNDING_TOLERANCE, "viewport must not cross its row bounds");
  }
  assert(viewport.overflow === "hidden", "each nested viewport must explicitly hide overflow");
}
assert(!forcingSvg.includes("<clipPath"), "contained cells must not emit global clip paths");

const root = rootDimensions(forcingSvg);
assert(root.width === forcingModel.width && root.viewWidth === forcingModel.width, "root width/viewBox must equal the table model width");
assert(root.height === forcingModel.height && root.viewHeight === forcingModel.height, "root height/viewBox must equal measureDocTable");
assert(forcingModel.height === measureDocTable(forcingModel.input), "MAR model and shared measurement must agree exactly");
pass("exact flag fill, multiline medication bold, per-cell bounds, and root geometry verified");

console.log("\n=== Width and promoted source-model preservation ===");
assert(marCanvasWidth(5) === 600, "five slots must remain 600 units wide");
assert(marCanvasWidth(6) === 644, "six slots must expand to 644 units");
assert(marCanvasWidth(6) / 11.5 === 56, "six-slot fraction must remain exactly 56 units");

const statusGlyphs: Record<string, string> = { given: "✓", held: "H", due: "—", missed: "×", late: "L", not_given: "NG" };
for (const record of marRecords) {
  const spec = record.ref.visual as MarSpec;
  assert(validateMar(spec).length === 0, `${record.parityId} must validate`);
  assert(selfCheckMar(spec, record.carrierQuestion).length === 0, `${record.parityId} must self-check`);
  const model = buildMarTableModel(spec);
  const svg = renderMarSvg(spec);
  assert(svg === renderMarSvg(spec), `${record.parityId} render must be deterministic`);
  assert(model.width === 600, `${record.parityId} must remain 600 units wide`);
  assert(nestedViewports(svg).length === model.input.columns.length * (model.input.rows.length + 1), `${record.parityId} must contain every cell`);
  spec.timeGrid.forEach((time, index) => {
    assert(compact(model.input.columnHeaderLines?.[index + 4]?.join("") ?? "") === compact(time), `${record.parityId} time label must survive`);
  });
  spec.medications.forEach((med, rowIndex) => {
    const row = model.input.rows[rowIndex];
    for (const [key, source] of [["med", med.name], ["dose", med.dose], ["freq", med.frequency]] as const) {
      const cell = cellObject(row.cells[key]);
      assert(cell.text === source && compact(cell.displayLines?.join("") ?? "") === compact(source), `${record.parityId} ${key} must survive in source/line model`);
    }
    assert(cellObject(row.cells.rte).text === med.route, `${record.parityId} route must survive`);
    for (const admin of med.administrations) {
      assert(cellObject(row.cells[`t_${admin.time}`]).text === statusGlyphs[admin.status], `${record.parityId} ${admin.time} status must survive`);
    }
  });
}
pass("five/six-slot widths and all 11 promoted source/line/status models verified");

console.log("\n=== Shared primitive and CSS non-regression ===");
const legacyInput = {
  columns: [
    { key: "a", label: "ColA", widthFr: 1, align: "left" as const },
    { key: "b", label: "ColB", widthFr: 1, align: "center" as const },
  ],
  rows: [
    { cells: { a: "hello", b: { text: "world", emphasis: "bold" as const } } },
    { cells: { a: { text: "flagged", emphasis: "flag" as const }, b: "plain" } },
  ],
  width: 400,
};
const expectedLegacy = `<g class="doc-table">\n<rect x="0" y="0" width="400" height="88" fill="#ffffff" stroke="#94a3b8" stroke-width="1" rx="2"/>\n<rect x="0" y="0" width="400" height="32" fill="#e2e8f0"/>\n<text x="8" y="20.8" font-family="sans-serif" font-size="11" font-weight="600" fill="#334155" text-anchor="start">ColA</text>\n<text x="300" y="20.8" font-family="sans-serif" font-size="11" font-weight="600" fill="#334155" text-anchor="middle">ColB</text>\n<line x1="0" y1="32" x2="400" y2="32" stroke="#94a3b8" stroke-width="1"/>\n<rect x="0" y="32" width="400" height="28" fill="#ffffff"/>\n<line x1="0" y1="60" x2="400" y2="60" stroke="#e2e8f0" stroke-width="1"/>\n<text x="8" y="50.2" font-family="sans-serif" font-size="12" font-weight="400" fill="#1e293b" text-anchor="start">hello</text>\n<text x="300" y="50.2" font-family="sans-serif" font-size="12" font-weight="600" fill="#1e293b" text-anchor="middle">world</text>\n<rect x="0" y="60" width="400" height="28" fill="#f8fafc"/>\n<line x1="0" y1="88" x2="400" y2="88" stroke="#e2e8f0" stroke-width="1"/>\n<rect x="1" y="61" width="198" height="26" fill="#fef9c3"/>\n<text x="8" y="78.2" font-family="sans-serif" font-size="12" font-weight="400" fill="#1e293b" text-anchor="start">flagged</text>\n<text x="300" y="78.2" font-family="sans-serif" font-size="12" font-weight="400" fill="#1e293b" text-anchor="middle">plain</text>\n<line x1="200" y1="0" x2="200" y2="88" stroke="#e2e8f0" stroke-width="1"/>\n</g>`;
assert(renderDocTable(legacyInput) === expectedLegacy, "legacy table SVG must equal the frozen pre-change bytes exactly");
assert(measureDocTable(legacyInput) === 88, "omitted multiline/containment options must preserve legacy measurement");

const variableRows = {
  columns: [{ key: "x", label: "X" }],
  rows: [{ cells: { x: "a" }, rowHeight: 42 }, { cells: { x: "b" } }, { cells: { x: "c" }, rowHeight: 56 }],
};
assert(measureDocTable(variableRows) === 158, "variable rows must be summed (32+42+28+56)");
assert(renderDocTable(variableRows).includes('height="158"'), "render and measurement must use identical resolved metrics");

const contained = renderDocTable({
  columns: [{ key: "q", label: "Q" }],
  rows: [{ cells: { q: { text: "multi", displayLines: ["line one", "line two", "line three"] } }, rowHeight: 56 }],
  containCells: true,
});
assert(nestedViewports(contained).length === 2, "one-column contained table must emit header and body viewports");
assert(nestedViewports(contained).every(viewport => viewport.overflow === "hidden"), "contained table viewports must hide overflow");
assert(!contained.includes("<clipPath"), "contained table must not emit clip IDs");

const css = readFileSync(new URL("../../src/styles.css", import.meta.url), "utf8");
for (const selector of [".rhythm-strip-svg.vis-mar svg", ".visual-focus-body .rhythm-strip-svg.vis-mar svg"]) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1];
  assert(block, `${selector} CSS block must exist`);
  assert(/width:\s*auto;/.test(block) && /min-width:\s*600px;/.test(block) && /max-width:\s*none;/.test(block), `${selector} must preserve intrinsic MAR width`);
}
assert(css.endsWith("\n"), "styles.css must retain its final newline");
pass("frozen legacy SVG, variable measurement, containment, and ordinary/focus CSS width contracts verified");

console.log("\n✅ All MAR tests passed.\n");
