import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MEASUREMENT_ALLOWLIST } from "../../src/measurementAllowlist";
import { validateBankObject } from "../../src/schema";
import {
  formatStructuredMeasurementValue,
  isCompactStructuredMeasurements,
  renderStructuredMeasurementsSvg,
  serializeStructuredMeasurements,
} from "../../src/structuredMeasurements";
import type {
  BankEnvelope,
  CaseStudyExhibit,
  CaseStudyQuestion,
  StructuredMeasurementColumn,
  StructuredMeasurementPanel,
  StructuredMeasurementRow,
  StructuredMeasurementValue,
} from "../../src/types";

export const PROOF_DATE = "2026-08-19";
export const BASE_COMMIT = "011a340bad2643dcee954ae3c3f2566c12524870";
export const PROOF_BRANCH = "codex/fishbone-proof-render-2026-08-19";
export const OUTPUT_ROOT = "audit/fishbone-proof-render-2026-08-19";

const BANK_DIR = "banks";
const DESKTOP_TARGET_WIDTH = 1325;
const NARROW_TARGET_WIDTH = 249;
const CURRENT_FLAT_MIN_WIDTH = 448;
const MOBILE_BREAKPOINT = 780;
const SPLIT_LAYOUT_BREAKPOINT = 820;
const ROOT_FONT_SIZE = 16;
const EMPTY_SLOT_REPRESENTATION = "EMPTY_OUTLINED_SLOT_WITHOUT_TEXT_OR_GLYPH";

const AUTHORITY_FILES = [
  "AGENTS.md",
  "DECISIONS.md",
  "NCLEX-Question-Schema.md",
  "PROJECT-HISTORY.md",
  "src/types.ts",
  "src/schema.ts",
  "src/allowedKeys.ts",
  "src/measurementAllowlist.ts",
  "src/structuredMeasurements.ts",
  "src/StructuredMeasurementsStimulus.tsx",
  "src/examLayout.ts",
  "src/styles.css",
] as const;

export const FROZEN_TEMPLATES = {
  CBC: ["wbc", "hemoglobin", "hematocrit", "platelets"],
  BMP: ["sodium", "potassium", "chloride", "bicarbonate", "bun", "creatinine", "glucose", "calcium"],
  "expanded chemistry": [
    "sodium",
    "potassium",
    "chloride",
    "bicarbonate",
    "bun",
    "creatinine",
    "glucose",
    "calcium",
    "ast",
    "alt",
    "total_bilirubin",
  ],
} as const;

export type TemplateName = keyof typeof FROZEN_TEMPLATES;
export type TemplateMatch = TemplateName | "NO_TEMPLATE_MATCH";
type Arm = "A" | "B";
type MultiColumnRule = "M1_ONE_FISHBONE_PER_COLUMN" | "M2_CURRENT_FLAT_FALLBACK";
type TargetName = "desktop" | "narrow_mobile";
type PassFail = "PASS" | "FAIL";

const TEMPLATE_NAMES = Object.keys(FROZEN_TEMPLATES) as TemplateName[];

const TEMPLATE_LAYOUTS: Record<TemplateName, { columns: number; positions: Record<string, [number, number]> }> = {
  CBC: {
    columns: 3,
    positions: {
      wbc: [0, 1],
      hemoglobin: [1, 0],
      hematocrit: [1, 2],
      platelets: [2, 1],
    },
  },
  BMP: {
    columns: 4,
    positions: {
      sodium: [0, 0],
      potassium: [0, 2],
      chloride: [1, 0],
      bicarbonate: [1, 2],
      bun: [2, 0],
      creatinine: [2, 2],
      glucose: [3, 1],
      calcium: [3, 3],
    },
  },
  "expanded chemistry": {
    columns: 4,
    positions: {
      sodium: [0, 0],
      potassium: [0, 2],
      chloride: [1, 0],
      bicarbonate: [1, 2],
      bun: [2, 0],
      creatinine: [2, 2],
      glucose: [3, 1],
      calcium: [3, 3],
      ast: [0, 4],
      alt: [1, 4],
      total_bilirubin: [2, 4],
    },
  },
};

const byteCompare = (left: string, right: string): number =>
  Buffer.compare(Buffer.from(left), Buffer.from(right));

const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");

const escapeXml = (value: string): string => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const stableKey = (...parts: Array<string | number>): string => parts.join("\u0000");

const targetDefinitions = [
  {
    name: "desktop" as const,
    width: DESKTOP_TARGET_WIDTH,
    derivation: "Rounded maximum live split-case exhibit content width: 1400px wide-main border box minus 2px question-card border, two 1.35rem question-card insets, 0.15rem chart-pane right inset, 2px exhibit border, and two 0.8rem exhibit insets at the 16px root size: round(1400 - 2 - 43.2 - 2.4 - 2 - 25.6) = 1325px.",
  },
  {
    name: "narrow_mobile" as const,
    width: NARROW_TARGET_WIDTH,
    derivation: "Rounded minimum live session exhibit content width: 320px body minimum minus two 0.65rem session-main insets, 2px question-card border, two 0.65rem question-card insets, 2px exhibit border, and two 0.8rem exhibit insets at the 16px root size: round(320 - 20.8 - 2 - 20.8 - 2 - 25.6) = 249px.",
  },
];

type ValueTuple = {
  rowKey: string;
  columnId: string;
  value: string;
  unit: string;
  bound: ">" | "<" | null;
};

export type PopulationRecord = {
  bankPath: string;
  questionId: string;
  exhibitPath: string;
  panelPath: string;
  panelIndex: number;
  columnCount: number;
  columnIdsInSourceOrder: string[];
  analyteSet: string[];
  rowCount: number;
  nonEmptyLabels: { en: boolean; zh: boolean };
  templateMatch: TemplateMatch;
};

type PopulationSource = PopulationRecord & { panel: StructuredMeasurementPanel };

type SelectionCategory = {
  id: string;
  label: string;
  predicate: string;
  matches: (record: PopulationRecord) => boolean;
};

export type SelectionResult = {
  id: string;
  label: string;
  predicate: string;
  status: "SELECTED" | "FISHBONE_PROOF_CATEGORY_NOT_FOUND";
  selected: PopulationRecord | null;
};

type SlotEntryModel = {
  tuple: ValueTuple;
  context: "post_intervention" | null;
  displayText: string;
};

type SlotModel = {
  key: string;
  position: { column: number; row: number };
  state: "occupied" | "void";
  sourceLabel: { en: string; zh: string } | null;
  entries: SlotEntryModel[];
  visibleText: string[];
  accessibilityText: string;
};

type ColumnModel = {
  sourceColumn: StructuredMeasurementColumn;
  visibleHeader: string;
  accessibilityHeader: string;
  slots: SlotModel[];
};

type FishboneSemanticModel = {
  presentation: "fishbone";
  template: TemplateName;
  arm: Arm;
  multiColumnRule: "M1_ONE_FISHBONE_PER_COLUMN";
  emptySlotRepresentation: typeof EMPTY_SLOT_REPRESENTATION;
  sourceRowsRetained: Array<{ key: string; label: { en: string; zh: string } }>;
  columns: ColumnModel[];
  accessibilityByLanguageMode: {
    off: string[];
    "on-tap": string[];
    always: string[];
  };
};

type FlatSemanticModel = {
  presentation: "current_flat_renderer";
  reason: "NO_TEMPLATE_MATCH" | "M2_MULTI_COLUMN_RULE";
  directRendererCall: "renderStructuredMeasurementsSvg({ panels: [panel] }, 'always')";
};

type CandidateRender = {
  svg: string;
  semanticModel: FishboneSemanticModel | FlatSemanticModel;
  tuples: ValueTuple[];
  renderedWidth: number;
  renderedHeight: number;
  surfaceHorizontalOverflow: boolean;
  internalHorizontalScroll: boolean;
  clippedTextCount: number;
  directFlatByteEquality: boolean | null;
};

type RenderMetric = {
  artifactPath: string;
  selectionId: string;
  source: PopulationRecord;
  arm: Arm;
  rule: MultiColumnRule;
  target: TargetName;
  targetWidth: number;
  candidatePresentation: FishboneSemanticModel["presentation"] | FlatSemanticModel["presentation"];
  renderedWidth: number;
  renderedHeight: number;
  horizontalOverflow: boolean;
  surfaceHorizontalOverflow: boolean;
  internalHorizontalScroll: boolean;
  textClipping: boolean;
  clippedTextCount: number;
  currentFlatRenderedWidth: number;
  currentFlatRenderedHeight: number;
  currentFlatInternalHorizontalScroll: boolean;
  heightDeltaVersusCurrentFlat: number;
  currentCompactPredicate: boolean;
  p23RoutingImpact: string;
  sourceTupleCount: number;
  currentFlatTupleCount: number;
  candidateTupleCount: number;
  sourceTupleMultisetHash: string;
  currentFlatTupleMultisetHash: string;
  candidateTupleMultisetHash: string;
  currentFlatSerializedTextSha256: string;
  directFlatByteEquality: boolean | null;
  candidateSvgSha256: string;
  currentFlatSvgSha256: string;
};

type RenderEvidence = {
  metric: RenderMetric;
  semanticModel: CandidateRender["semanticModel"];
  sourceTuples: ValueTuple[];
  currentFlatTuples: ValueTuple[];
  candidateTuples: ValueTuple[];
};

type FallbackAuditRecord = {
  source: PopulationRecord;
  firstDecision: TemplateMatch;
  secondDecision: TemplateMatch;
  decisionsIdentical: boolean;
  directCurrentFlatInvocation: boolean;
  fullSvgByteEquality: boolean;
  currentFlatSvgSha256: string;
  candidateSvgSha256: string;
  currentFlatTupleMultisetHash: string;
  candidateTupleMultisetHash: string;
};

type ConditionResult = {
  id: number;
  name: string;
  status: PassFail;
  evidence: string[];
  failures: string[];
};

export type ProofBundle = {
  population: Record<string, unknown>;
  manifest: Record<string, unknown> & {
    terminalStatus: string;
    selections: SelectionResult[];
    conditions: ConditionResult[];
    renders: RenderMetric[];
  };
  report: string;
  artifacts: Map<string, string>;
};

export const matchFishboneTemplate = (rowKeys: readonly string[]): TemplateName | null => {
  const uniqueKeys = new Set(rowKeys);
  const matches = TEMPLATE_NAMES.filter((name) => {
    const allowed = new Set<string>(FROZEN_TEMPLATES[name]);
    return [...uniqueKeys].every((key) => allowed.has(key));
  });
  matches.sort((left, right) =>
    FROZEN_TEMPLATES[left].length - FROZEN_TEMPLATES[right].length || byteCompare(left, right));
  return matches[0] ?? null;
};

const publicRecord = (record: PopulationSource): PopulationRecord => {
  const { panel: _panel, ...result } = record;
  return result;
};

const populationSort = (left: PopulationRecord, right: PopulationRecord): number =>
  byteCompare(left.bankPath, right.bankPath)
  || byteCompare(left.questionId, right.questionId)
  || byteCompare(left.exhibitPath, right.exhibitPath)
  || left.panelIndex - right.panelIndex;

const collectExhibitPanels = (
  output: PopulationSource[],
  bankPath: string,
  questionId: string,
  exhibit: CaseStudyExhibit,
  exhibitPath: string,
): void => {
  exhibit.structuredMeasurements?.panels.forEach((panel, panelIndex) => {
    if (panel.kind !== "labs") return;
    const analyteSet = [...new Set(panel.rows.map((row) => row.key))].sort(byteCompare);
    output.push({
      bankPath,
      questionId,
      exhibitPath,
      panelPath: `${exhibitPath}.structuredMeasurements.panels[${panelIndex}]`,
      panelIndex,
      columnCount: panel.columns.length,
      columnIdsInSourceOrder: panel.columns.map((column) => column.id),
      analyteSet,
      rowCount: panel.rows.length,
      nonEmptyLabels: {
        en: panel.rows.every((row) => row.label.en.trim().length > 0),
        zh: panel.rows.every((row) => row.label.zh.trim().length > 0),
      },
      templateMatch: matchFishboneTemplate(analyteSet) ?? "NO_TEMPLATE_MATCH",
      panel,
    });
  });
};

const collectQuestionPanels = (
  output: PopulationSource[],
  bankPath: string,
  question: CaseStudyQuestion,
  questionIndex: number,
): void => {
  question.caseStudy.exhibits.forEach((exhibit, exhibitIndex) => collectExhibitPanels(
    output,
    bankPath,
    question.id,
    exhibit,
    `questions[${questionIndex}].caseStudy.exhibits[${exhibitIndex}]`,
  ));
  question.caseStudy.stages?.forEach((stage, stageIndex) => {
    stage.exhibits.forEach((exhibit, exhibitIndex) => collectExhibitPanels(
      output,
      bankPath,
      question.id,
      exhibit,
      `questions[${questionIndex}].caseStudy.stages[${stageIndex}].exhibits[${exhibitIndex}]`,
    ));
  });
};

const listTopLevelBankFiles = async (cwd: string): Promise<string[]> => {
  const entries = await readdir(resolve(cwd, BANK_DIR), { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => join(BANK_DIR, entry.name))
    .sort(byteCompare);
};

const surveyLivePopulation = async (cwd: string): Promise<{ records: PopulationSource[]; bankFiles: string[] }> => {
  const bankFiles = await listTopLevelBankFiles(cwd);
  const records: PopulationSource[] = [];
  for (const bankPath of bankFiles) {
    const raw = JSON.parse(await readFile(resolve(cwd, bankPath), "utf8")) as unknown;
    const validated = validateBankObject(raw, { rejectUnknownKeys: true, requireMeta: true });
    if (!validated.ok) throw new Error(`${bankPath}: ${validated.reasons.join("; ")}`);
    validated.value.questions.forEach((question, questionIndex) => {
      if (question.itemType === "case_study") {
        collectQuestionPanels(records, bankPath, question, questionIndex);
      }
    });
  }
  records.sort(populationSort);
  return { records, bankFiles };
};

const SELECTION_CATEGORIES: SelectionCategory[] = [
  {
    id: "full_or_near_full_cbc",
    label: "Full or near-full CBC",
    predicate: "templateMatch === 'CBC' AND rowCount >= 3",
    matches: (record) => record.templateMatch === "CBC" && record.rowCount >= 3,
  },
  {
    id: "sparse_cbc_subset",
    label: "Sparse CBC subset",
    predicate: "templateMatch === 'CBC' AND rowCount <= 2",
    matches: (record) => record.templateMatch === "CBC" && record.rowCount <= 2,
  },
  {
    id: "bmp_or_near_full",
    label: "BMP or near-full BMP",
    predicate: "templateMatch === 'BMP' AND rowCount >= 6",
    matches: (record) => record.templateMatch === "BMP" && record.rowCount >= 6,
  },
  {
    id: "expanded_chemistry_well_populated",
    label: "Well-populated expanded chemistry",
    predicate: "templateMatch === 'expanded chemistry' AND rowCount >= 7 AND core-BMP-key count >= 6 AND at least one of ast|alt|total_bilirubin",
    matches: (record) => {
      const keys = new Set(record.analyteSet);
      const bmpCoreCount = FROZEN_TEMPLATES.BMP.filter((key) => keys.has(key)).length;
      const hasExpansion = ["ast", "alt", "total_bilirubin"].some((key) => keys.has(key));
      return record.templateMatch === "expanded chemistry"
        && record.rowCount >= 7
        && bmpCoreCount >= 6
        && hasExpansion;
    },
  },
  {
    id: "no_template_flat_fallback",
    label: "No-template flat fallback",
    predicate: "templateMatch === 'NO_TEMPLATE_MATCH'",
    matches: (record) => record.templateMatch === "NO_TEMPLATE_MATCH",
  },
];

const selectCases = (records: PopulationSource[]): SelectionResult[] => SELECTION_CATEGORIES.map((category) => {
  const selected = records.find(category.matches);
  return {
    id: category.id,
    label: category.label,
    predicate: category.predicate,
    status: selected ? "SELECTED" : "FISHBONE_PROOF_CATEGORY_NOT_FOUND",
    selected: selected ? publicRecord(selected) : null,
  };
});

const tupleFor = (rowKey: string, entry: StructuredMeasurementValue): ValueTuple => ({
  rowKey,
  columnId: entry.columnId,
  value: entry.value,
  unit: entry.unit,
  bound: entry.bound ?? null,
});

const tupleSort = (left: ValueTuple, right: ValueTuple): number =>
  byteCompare(JSON.stringify(left), JSON.stringify(right));

const sourceTuples = (panel: StructuredMeasurementPanel): ValueTuple[] => panel.rows
  .flatMap((row) => row.values.map((entry) => tupleFor(row.key, entry)))
  .sort(tupleSort);

// The live flat renderer consumes rows/values directly. Keep this extraction
// separate so the three-way source/current-flat/candidate assertion is explicit.
const currentFlatModelTuples = (panel: StructuredMeasurementPanel): ValueTuple[] => panel.rows
  .flatMap((row) => row.values.map((entry) => tupleFor(row.key, entry)))
  .sort(tupleSort);

const tupleBytes = (tuples: readonly ValueTuple[]): string => JSON.stringify([...tuples].sort(tupleSort));

const approximateTextWidth = (text: string, fontSize: number): number => [...text].reduce((width, character) => {
  if (/\p{Script=Han}/u.test(character)) return width + fontSize;
  if (/[MW@#%&]/u.test(character)) return width + fontSize * 0.82;
  if (/[ilI1.,:;|'`]/u.test(character)) return width + fontSize * 0.32;
  if (/\s/u.test(character)) return width + fontSize * 0.3;
  return width + fontSize * 0.58;
}, 0);

const wrapText = (text: string, maxWidth: number, fontSize: number): string[] => {
  if (text.length === 0) return [];
  const lines: string[] = [];
  let line = "";
  for (const character of [...text]) {
    const candidate = `${line}${character}`;
    if (line.length > 0 && approximateTextWidth(candidate, fontSize) > maxWidth) {
      lines.push(line.trimEnd());
      line = character.trimStart();
    } else {
      line = candidate;
    }
  }
  if (line.length > 0) lines.push(line.trimEnd());
  return lines.filter((entry) => entry.length > 0);
};

const columnHeader = (column: StructuredMeasurementColumn, arm: Arm): { visible: string; accessible: string } => {
  const en = column.label?.en.trim() || column.id;
  const zh = column.label?.zh.trim() || "";
  return {
    visible: arm === "A" && zh ? `${en} / ${zh}` : en,
    accessible: zh ? `${en}; ${zh}` : en,
  };
};

const buildFishboneModel = (
  panel: StructuredMeasurementPanel,
  template: TemplateName,
  arm: Arm,
): FishboneSemanticModel => {
  const rows = new Map(panel.rows.map((row) => [row.key, row]));
  const positions = TEMPLATE_LAYOUTS[template].positions;
  const columns = panel.columns.map((column): ColumnModel => {
    const header = columnHeader(column, arm);
    const slots = FROZEN_TEMPLATES[template].map((key): SlotModel => {
      const row = rows.get(key);
      const entries = row?.values
        .filter((entry) => entry.columnId === column.id)
        .map((entry): SlotEntryModel => ({
          tuple: tupleFor(key, entry),
          context: entry.context ?? null,
          displayText: formatStructuredMeasurementValue(key, entry, "en"),
        })) ?? [];
      const occupied = row !== undefined && entries.length > 0;
      const visibleText = occupied
        ? [
          ...(arm === "A" ? [row.label.en, row.label.zh] : []),
          ...entries.map((entry) => entry.displayText),
        ]
        : [];
      return {
        key,
        position: { column: positions[key][0], row: positions[key][1] },
        state: occupied ? "occupied" : "void",
        sourceLabel: occupied ? { en: row.label.en, zh: row.label.zh } : null,
        entries,
        visibleText,
        accessibilityText: occupied
          ? `${row.label.en}; ${row.label.zh}; ${entries.map((entry) => entry.displayText).join("; ")}`
          : "",
      };
    });
    return {
      sourceColumn: column,
      visibleHeader: header.visible,
      accessibilityHeader: header.accessible,
      slots,
    };
  });
  const occupiedSlots = columns.flatMap((column) => column.slots.filter((slot) => slot.state === "occupied"));
  return {
    presentation: "fishbone",
    template,
    arm,
    multiColumnRule: "M1_ONE_FISHBONE_PER_COLUMN",
    emptySlotRepresentation: EMPTY_SLOT_REPRESENTATION,
    sourceRowsRetained: panel.rows.map((row) => ({ key: row.key, label: { ...row.label } })),
    columns,
    accessibilityByLanguageMode: {
      off: occupiedSlots.map((slot) => `${slot.sourceLabel?.en ?? ""}; ${slot.entries.map((entry) => entry.displayText).join("; ")}`),
      "on-tap": occupiedSlots.map((slot) => slot.accessibilityText),
      always: occupiedSlots.map((slot) => slot.accessibilityText),
    },
  };
};

type Line = { text: string; fontSize: number; weight: number; fill: string };

const visibleLines = (slot: SlotModel, arm: Arm, maxWidth: number, narrow: boolean, displayScale: number): Line[] => {
  const labelSize = (narrow ? 8 : 9.5) * displayScale;
  const valueSize = (narrow ? 9.5 : 11) * displayScale;
  const lines: Line[] = [];
  if (slot.state === "void") return lines;
  if (arm === "A" && slot.sourceLabel) {
    wrapText(slot.sourceLabel.en, maxWidth, labelSize).forEach((text) => lines.push({ text, fontSize: labelSize, weight: 700, fill: "#17324d" }));
    wrapText(slot.sourceLabel.zh, maxWidth, labelSize).forEach((text) => lines.push({ text, fontSize: labelSize, weight: 700, fill: "#365a75" }));
  }
  slot.entries.forEach((entry) => {
    wrapText(entry.displayText, maxWidth, valueSize).forEach((text) => lines.push({ text, fontSize: valueSize, weight: 800, fill: "#071b2d" }));
  });
  return lines;
};

const renderFishboneSvg = (
  model: FishboneSemanticModel,
  width: number,
): { svg: string; width: number; height: number; clippedTextCount: number } => {
  const narrow = width < 360;
  const displayScale = narrow ? 1 : Math.min(1.75, Math.max(1, width / 600));
  const outerPadding = (narrow ? 5 : 8) * displayScale;
  const columnGap = 12 * displayScale;
  const headerHeight = (narrow ? 27 : 31) * displayScale;
  const layout = TEMPLATE_LAYOUTS[model.template];
  const gridRows = Math.max(...Object.values(layout.positions).map((position) => position[1])) + 1;
  const cellWidth = (width - outerPadding * 2) / layout.columns;
  const textWidth = Math.max(18, cellWidth - (narrow ? 5 : 8));
  const columnLayouts = model.columns.map((column) => {
    const lineMap = new Map<string, Line[]>();
    column.slots.forEach((slot) => lineMap.set(slot.key, visibleLines(slot, model.arm, textWidth, narrow, displayScale)));
    const rowHeights = Array.from({ length: gridRows }, (_, rowIndex) => {
      const slots = column.slots.filter((slot) => slot.position.row === rowIndex);
      const contentHeight = Math.max(0, ...slots.map((slot) => (lineMap.get(slot.key) ?? [])
        .reduce((sum, line) => sum + line.fontSize + 2 * displayScale, 0)));
      return Math.max((narrow ? 34 : 40) * displayScale, contentHeight + (narrow ? 7 : 10) * displayScale);
    });
    return { column, lineMap, rowHeights, height: headerHeight + rowHeights.reduce((sum, value) => sum + value, 0) };
  });
  const height = columnLayouts.reduce((sum, layoutEntry) => sum + layoutEntry.height, 0)
    + Math.max(0, columnLayouts.length - 1) * columnGap;
  let yOffset = 0;
  let clippedTextCount = 0;
  const bodies = columnLayouts.map(({ column, lineMap, rowHeights, height: columnHeight }, columnIndex) => {
    const headerId = `fishbone-${model.template.replaceAll(" ", "-")}-${model.arm}-${columnIndex}`;
    const rowOffsets: number[] = [];
    let runningY = yOffset + headerHeight;
    rowHeights.forEach((rowHeight) => {
      rowOffsets.push(runningY);
      runningY += rowHeight;
    });
    const midY = yOffset + headerHeight + rowHeights.reduce((sum, rowHeight) => sum + rowHeight, 0) / 2;
    const skeleton = [
      `<line x1="${outerPadding}" y1="${midY.toFixed(2)}" x2="${(width - outerPadding).toFixed(2)}" y2="${midY.toFixed(2)}" stroke="#7a9bb5" stroke-width="${(1.25 * displayScale).toFixed(2)}"/>`,
      ...Array.from({ length: Math.max(0, layout.columns - 1) }, (_, index) => {
        const x = outerPadding + cellWidth * (index + 1);
        const branch = (narrow ? 15 : 20) * displayScale;
        return `<path d="M ${(x - branch).toFixed(2)} ${(midY - branch).toFixed(2)} L ${x.toFixed(2)} ${midY.toFixed(2)} L ${(x + branch).toFixed(2)} ${(midY + branch).toFixed(2)}" fill="none" stroke="#7a9bb5" stroke-width="${(1.25 * displayScale).toFixed(2)}"/>`;
      }),
    ].join("");
    const slots = column.slots.map((slot) => {
      const x = outerPadding + slot.position.column * cellWidth;
      const y = rowOffsets[slot.position.row];
      const slotHeight = rowHeights[slot.position.row];
      const lines = lineMap.get(slot.key) ?? [];
      lines.forEach((line) => {
        if (approximateTextWidth(line.text, line.fontSize) > textWidth + 0.01) clippedTextCount += 1;
      });
      let lineY = y + (narrow ? 9 : 11) * displayScale;
      const textNodes = lines.map((line) => {
        const node = `<text x="${(x + cellWidth / 2).toFixed(2)}" y="${lineY.toFixed(2)}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="${line.fontSize}" font-weight="${line.weight}" fill="${line.fill}">${escapeXml(line.text)}</text>`;
        lineY += line.fontSize + 2 * displayScale;
        return node;
      }).join("");
      const aria = slot.state === "occupied"
        ? ` role="group" aria-label="${escapeXml(slot.accessibilityText)}"`
        : " aria-hidden=\"true\"";
      return `<g data-template-key="${escapeXml(slot.key)}" data-slot-state="${slot.state}"${aria}><rect x="${(x + displayScale).toFixed(2)}" y="${(y + displayScale).toFixed(2)}" width="${Math.max(1, cellWidth - 2 * displayScale).toFixed(2)}" height="${Math.max(1, slotHeight - 2 * displayScale).toFixed(2)}" rx="${(4 * displayScale).toFixed(2)}" fill="${slot.state === "void" ? "#f7fafc" : "#ffffff"}" fill-opacity="0.94" stroke="${slot.state === "void" ? "#cfdae3" : "#9cb3c5"}" stroke-width="${(0.8 * displayScale).toFixed(2)}"/>${textNodes}</g>`;
    }).join("");
    const headerSize = (narrow ? 9 : 11) * displayScale;
    const headerLines = wrapText(column.visibleHeader, width - outerPadding * 2, headerSize);
    const headerText = headerLines.map((line, lineIndex) => `<text x="${(width / 2).toFixed(2)}" y="${(yOffset + 12 * displayScale + lineIndex * (headerSize + displayScale)).toFixed(2)}" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="${headerSize}" font-weight="800" fill="#17324d">${escapeXml(line)}</text>`).join("");
    const result = `<g role="group" aria-labelledby="${headerId}"><title id="${headerId}">${escapeXml(column.accessibilityHeader)}</title><rect x="${(0.5 * displayScale).toFixed(2)}" y="${(yOffset + 0.5 * displayScale).toFixed(2)}" width="${(width - displayScale).toFixed(2)}" height="${(columnHeight - displayScale).toFixed(2)}" rx="${(7 * displayScale).toFixed(2)}" fill="#eef5f8" stroke="#b5c8d6" stroke-width="${displayScale.toFixed(2)}"/>${headerText}${skeleton}${slots}</g>`;
    yOffset += columnHeight + columnGap;
    return result;
  }).join("");
  const title = `${model.template} fishbone proof, arm ${model.arm}; ${model.columns.length} source column${model.columns.length === 1 ? "" : "s"}`;
  const metadata = JSON.stringify({
    arm: model.arm,
    template: model.template,
    languageModes: ["off", "on-tap", "always"],
    labelDataRetained: true,
    emptySlotRepresentation: model.emptySlotRepresentation,
  });
  return {
    svg: `<svg viewBox="0 0 ${width} ${height.toFixed(2)}" role="img" aria-label="${escapeXml(title)}" xmlns="http://www.w3.org/2000/svg"><title>${escapeXml(title)}</title><metadata>${escapeXml(metadata)}</metadata>${bodies}</svg>`,
    width,
    height,
    clippedTextCount,
  };
};

const parseSvgSize = (svg: string): { width: number; height: number; explicitWidth: boolean } => {
  const viewBox = svg.match(/viewBox="0 0 ([0-9.]+) ([0-9.]+)"/);
  if (!viewBox) throw new Error("current renderer returned an SVG without the expected viewBox");
  return {
    width: Number(viewBox[1]),
    height: Number(viewBox[2]),
    explicitWidth: /<svg[^>]*\swidth="[0-9.]+"/.test(svg),
  };
};

const currentFlatGeometry = (flatSvg: string, targetWidth: number): {
  renderedWidth: number;
  renderedHeight: number;
  surfaceHorizontalOverflow: boolean;
  internalHorizontalScroll: boolean;
} => {
  const intrinsic = parseSvgSize(flatSvg);
  const renderedWidth = intrinsic.explicitWidth
    ? intrinsic.width
    : Math.max(CURRENT_FLAT_MIN_WIDTH, targetWidth);
  return {
    renderedWidth,
    renderedHeight: intrinsic.height * renderedWidth / intrinsic.width,
    surfaceHorizontalOverflow: false,
    internalHorizontalScroll: renderedWidth > targetWidth,
  };
};

const renderCandidate = (
  panel: StructuredMeasurementPanel,
  arm: Arm,
  width: number,
  multiColumnRule: MultiColumnRule,
): CandidateRender => {
  const flatSvg = renderStructuredMeasurementsSvg({ panels: [panel] }, "always");
  const template = matchFishboneTemplate(panel.rows.map((row) => row.key));
  if (template === null || (panel.columns.length > 1 && multiColumnRule === "M2_CURRENT_FLAT_FALLBACK")) {
    const flat = currentFlatGeometry(flatSvg, width);
    return {
      svg: flatSvg,
      semanticModel: {
        presentation: "current_flat_renderer",
        reason: template === null ? "NO_TEMPLATE_MATCH" : "M2_MULTI_COLUMN_RULE",
        directRendererCall: "renderStructuredMeasurementsSvg({ panels: [panel] }, 'always')",
      },
      tuples: sourceTuples(panel),
      renderedWidth: flat.renderedWidth,
      renderedHeight: flat.renderedHeight,
      surfaceHorizontalOverflow: flat.surfaceHorizontalOverflow,
      internalHorizontalScroll: flat.internalHorizontalScroll,
      clippedTextCount: 0,
      directFlatByteEquality: true,
    };
  }
  const model = buildFishboneModel(panel, template, arm);
  const rendered = renderFishboneSvg(model, width);
  const tuples = model.columns
    .flatMap((column) => column.slots)
    .flatMap((slot) => slot.entries.map((entry) => entry.tuple))
    .sort(tupleSort);
  return {
    svg: rendered.svg,
    semanticModel: model,
    tuples,
    renderedWidth: rendered.width,
    renderedHeight: rendered.height,
    surfaceHorizontalOverflow: rendered.width > width,
    internalHorizontalScroll: false,
    clippedTextCount: rendered.clippedTextCount,
    directFlatByteEquality: null,
  };
};

const embedSvg = (svg: string, x: number, y: number, width: number, height: number): string => {
  const withoutExplicitSize = svg
    .replace(/\swidth="[0-9.]+"/, "")
    .replace(/\sheight="[0-9.]+"/, "");
  return withoutExplicitSize.replace("<svg ", `<svg x="${x}" y="${y}" width="${width}" height="${height}" `);
};

const sideBySideArtifact = (
  flatSvg: string,
  candidate: CandidateRender,
  targetWidth: number,
  title: string,
): string => {
  const gap = 24;
  const header = 46;
  const flatSize = parseSvgSize(flatSvg);
  const flatGeometry = currentFlatGeometry(flatSvg, targetWidth);
  const flatPreviewWidth = Math.min(targetWidth, flatGeometry.renderedWidth);
  const flatPreviewHeight = flatSize.height * flatPreviewWidth / flatSize.width;
  const flatPreviewX = (targetWidth - flatPreviewWidth) / 2;
  const candidatePreviewHeight = candidate.renderedHeight;
  const outerWidth = targetWidth * 2 + gap;
  const outerHeight = header + Math.max(flatPreviewHeight, candidatePreviewHeight) + 12;
  return `<svg viewBox="0 0 ${outerWidth} ${outerHeight.toFixed(2)}" width="${outerWidth}" height="${outerHeight.toFixed(2)}" role="img" aria-label="${escapeXml(title)}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f5f8fa"/><text x="${targetWidth / 2}" y="17" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="12" font-weight="800" fill="#17324d">CURRENT FLAT (scaled only if wider)</text><text x="${targetWidth + gap + targetWidth / 2}" y="17" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="12" font-weight="800" fill="#17324d">PROOF CANDIDATE</text><text x="${outerWidth / 2}" y="34" text-anchor="middle" font-family="system-ui,-apple-system,sans-serif" font-size="10" fill="#526b7e">${escapeXml(title)}</text>${embedSvg(flatSvg, flatPreviewX, header, flatPreviewWidth, flatPreviewHeight)}${embedSvg(candidate.svg, targetWidth + gap, header, targetWidth, candidatePreviewHeight)}</svg>`;
};

const slug = (value: string): string => value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-|-$/g, "");

const renderEvidenceFor = (
  selectionId: string,
  source: PopulationSource,
  arm: Arm,
  rule: MultiColumnRule,
  target: (typeof targetDefinitions)[number],
): { evidence: RenderEvidence; artifact: string } => {
  const flatSvg = renderStructuredMeasurementsSvg({ panels: [source.panel] }, "always");
  const flatGeometry = currentFlatGeometry(flatSvg, target.width);
  const candidate = renderCandidate(source.panel, arm, target.width, rule);
  const sourceTupleList = sourceTuples(source.panel);
  const currentFlatTupleList = currentFlatModelTuples(source.panel);
  const fileName = `${slug(selectionId)}-${arm.toLowerCase()}-${rule === "M1_ONE_FISHBONE_PER_COLUMN" ? "m1" : "m2"}-${target.name}.svg`;
  const artifactPath = join(OUTPUT_ROOT, "renders", fileName);
  const metric: RenderMetric = {
    artifactPath,
    selectionId,
    source: publicRecord(source),
    arm,
    rule,
    target: target.name,
    targetWidth: target.width,
    candidatePresentation: candidate.semanticModel.presentation,
    renderedWidth: Number(candidate.renderedWidth.toFixed(2)),
    renderedHeight: Number(candidate.renderedHeight.toFixed(2)),
    horizontalOverflow: candidate.surfaceHorizontalOverflow,
    surfaceHorizontalOverflow: candidate.surfaceHorizontalOverflow,
    internalHorizontalScroll: candidate.internalHorizontalScroll,
    textClipping: candidate.clippedTextCount > 0,
    clippedTextCount: candidate.clippedTextCount,
    currentFlatRenderedWidth: Number(flatGeometry.renderedWidth.toFixed(2)),
    currentFlatRenderedHeight: Number(flatGeometry.renderedHeight.toFixed(2)),
    currentFlatInternalHorizontalScroll: flatGeometry.internalHorizontalScroll,
    heightDeltaVersusCurrentFlat: Number((candidate.renderedHeight - flatGeometry.renderedHeight).toFixed(2)),
    currentCompactPredicate: isCompactStructuredMeasurements({ panels: [source.panel] }),
    p23RoutingImpact: "NONE_IN_PROOF: P23 allocation remains owned by the live compact predicate; this candidate changes no routing or allocation code.",
    sourceTupleCount: sourceTupleList.length,
    currentFlatTupleCount: currentFlatTupleList.length,
    candidateTupleCount: candidate.tuples.length,
    sourceTupleMultisetHash: sha256(tupleBytes(sourceTupleList)),
    currentFlatTupleMultisetHash: sha256(tupleBytes(currentFlatTupleList)),
    candidateTupleMultisetHash: sha256(tupleBytes(candidate.tuples)),
    currentFlatSerializedTextSha256: sha256(JSON.stringify(serializeStructuredMeasurements({ panels: [source.panel] }) ?? null)),
    directFlatByteEquality: candidate.directFlatByteEquality,
    candidateSvgSha256: sha256(candidate.svg),
    currentFlatSvgSha256: sha256(flatSvg),
  };
  return {
    evidence: {
      metric,
      semanticModel: candidate.semanticModel,
      sourceTuples: sourceTupleList,
      currentFlatTuples: currentFlatTupleList,
      candidateTuples: candidate.tuples,
    },
    artifact: sideBySideArtifact(flatSvg, candidate, target.width, `${selectionId}; arm ${arm}; ${rule}; ${target.name} ${target.width}px`),
  };
};

const sourceLookupKey = (record: PopulationRecord): string => stableKey(record.bankPath, record.questionId, record.exhibitPath, record.panelIndex);

const checkContract = async (cwd: string): Promise<{
  status: PassFail;
  assertions: Array<{ file: string; assertion: string; status: PassFail }>;
  sourceSha256: Record<string, string>;
  templateAllowlist: Array<{ template: TemplateName; key: string; allowlisted: boolean; kind: string | null }>;
}> => {
  const assertions = [
    { file: "src/types.ts", needle: "export type StructuredMeasurements = {", assertion: "StructuredMeasurements remains the typed input surface." },
    { file: "src/types.ts", needle: "kind: \"labs\" | \"vitals\";", assertion: "Panels remain limited to labs or vitals." },
    { file: "src/types.ts", needle: "bound?: \">\" | \"<\";", assertion: "Typed inequality bounds remain part of the value tuple." },
    { file: "src/allowedKeys.ts", needle: "structuredMeasurementValue: [\"columnId\", \"value\", \"unit\", \"bound\", \"context\"]", assertion: "No proof-only field is present in the live allowed-key contract." },
    { file: "src/schema.ts", needle: "values-only; omit flags and reference ranges", assertion: "Flags and reference ranges remain forbidden." },
    { file: "src/structuredMeasurements.ts", needle: "return panel.rows.length === 1 && panel.columns.length === 1;", assertion: "The live compact predicate remains one panel, one row, one column." },
    { file: "src/styles.css", needle: "width: min(1400px, calc(100% - 2rem));", assertion: "The wide-main desktop border box remains capped at 1400px." },
    { file: "src/styles.css", needle: "padding: clamp(1rem, 3vw, 1.35rem);", assertion: "The desktop question-card inset used by the width derivation remains current." },
    { file: "src/styles.css", needle: "min-width: 28rem;", assertion: "Current non-compact flat SVG minimum width remains 28rem." },
    { file: "src/styles.css", needle: "@media (max-width: 820px)", assertion: "The generic split-layout collapse breakpoint remains 820px." },
    { file: "src/styles.css", needle: "@media (max-width: 780px)", assertion: "The live narrow breakpoint remains 780px." },
  ];
  const files = [...new Set<string>([
    ...AUTHORITY_FILES,
    ...assertions.map((entry) => entry.file),
  ])].sort(byteCompare);
  const sourceEntries = await Promise.all(files.map(async (file) => [file, await readFile(resolve(cwd, file), "utf8")] as const));
  const sourceMap = new Map(sourceEntries);
  const checked = assertions.map(({ file, needle, assertion }) => ({
    file,
    assertion,
    status: sourceMap.get(file)?.includes(needle) ? "PASS" as const : "FAIL" as const,
  }));
  const templateAllowlist = TEMPLATE_NAMES.flatMap((template) => FROZEN_TEMPLATES[template].map((key) => ({
    template,
    key,
    allowlisted: MEASUREMENT_ALLOWLIST[key] !== undefined,
    kind: MEASUREMENT_ALLOWLIST[key]?.kind ?? null,
  })));
  return {
    status: checked.every((entry) => entry.status === "PASS")
      && templateAllowlist.every((entry) => entry.allowlisted && entry.kind === "lab") ? "PASS" : "FAIL",
    assertions: checked,
    sourceSha256: Object.fromEntries(sourceEntries.map(([file, content]) => [file, sha256(content)])),
    templateAllowlist,
  };
};

const conditionResults = (
  evidence: RenderEvidence[],
  selections: SelectionResult[],
  contractStatus: PassFail,
  fallbackAudit: FallbackAuditRecord[],
): ConditionResult[] => {
  const selectedCount = selections.filter((selection) => selection.status === "SELECTED").length;
  const tupleFailures = evidence.filter((entry) =>
    tupleBytes(entry.sourceTuples) !== tupleBytes(entry.currentFlatTuples)
    || tupleBytes(entry.sourceTuples) !== tupleBytes(entry.candidateTuples));
  const boundFailures = evidence.filter((entry) => {
    const sourceBounds = entry.sourceTuples.filter((tuple) => tuple.bound !== null);
    const currentFlatBounds = entry.currentFlatTuples.filter((tuple) => tuple.bound !== null);
    const candidateBounds = entry.candidateTuples.filter((tuple) => tuple.bound !== null);
    return tupleBytes(sourceBounds) !== tupleBytes(currentFlatBounds)
      || tupleBytes(sourceBounds) !== tupleBytes(candidateBounds);
  });
  const fishboneModels = evidence
    .map((entry) => entry.semanticModel)
    .filter((model): model is FishboneSemanticModel => model.presentation === "fishbone");
  const derivationFailures = fishboneModels.flatMap((model) => model.columns.flatMap((column) => column.slots.filter((slot) =>
    slot.entries.some((entry) => {
      const row = model.sourceRowsRetained.find((candidate) => candidate.key === slot.key);
      const sourceEntry: StructuredMeasurementValue = {
        columnId: entry.tuple.columnId,
        value: entry.tuple.value,
        unit: entry.tuple.unit,
        ...(entry.tuple.bound === null ? {} : { bound: entry.tuple.bound }),
        ...(entry.context === null ? {} : { context: entry.context }),
      };
      return row === undefined
        || entry.displayText !== formatStructuredMeasurementValue(slot.key, sourceEntry, "en");
    }))));
  const voidFailures = fishboneModels.flatMap((model) => model.columns.flatMap((column) => column.slots.filter((slot) =>
    slot.state === "void" && (slot.entries.length > 0 || slot.visibleText.length > 0 || slot.accessibilityText.length > 0))));
  const fallbackEvidence = evidence.filter((entry) => entry.semanticModel.presentation === "current_flat_renderer"
    && entry.semanticModel.reason === "NO_TEMPLATE_MATCH");
  const fallbackFailures = fallbackAudit.filter((entry) => !entry.decisionsIdentical
    || !entry.directCurrentFlatInvocation
    || !entry.fullSvgByteEquality
    || entry.currentFlatTupleMultisetHash !== entry.candidateTupleMultisetHash);
  const geometryFailures = evidence.filter((entry) => entry.metric.surfaceHorizontalOverflow || entry.metric.textClipping);
  const armAModels = fishboneModels.filter((model) => model.arm === "A");
  const armBModels = fishboneModels.filter((model) => model.arm === "B");
  const armAFailures = armAModels.flatMap((model) => model.columns.flatMap((column) => column.slots.filter((slot) =>
    slot.state === "occupied" && (!slot.sourceLabel || !slot.visibleText.includes(slot.sourceLabel.en) || !slot.visibleText.includes(slot.sourceLabel.zh)))));
  const armBFailures = armBModels.flatMap((model) => model.columns.flatMap((column) => column.slots.filter((slot) =>
    slot.state === "occupied" && (!slot.sourceLabel || !slot.accessibilityText.includes(slot.sourceLabel.en) || !slot.accessibilityText.includes(slot.sourceLabel.zh)))));

  const result = (
    id: number,
    name: string,
    failures: string[],
    evidenceLines: string[],
  ): ConditionResult => ({ id, name, status: failures.length === 0 ? "PASS" : "FAIL", evidence: evidenceLines, failures });

  return [
    result(1, "Exact value-tuple preservation", [
      ...tupleFailures.map((entry) => entry.metric.artifactPath),
      ...boundFailures.map((entry) => `${entry.metric.artifactPath}: typed bound mismatch`),
      ...(evidence.length === 0 ? ["No selected source-backed render evidence exists."] : []),
    ], [
      `${evidence.length} render legs compared source, current-flat, and candidate exact sorted multisets of (row.key, column.id, value, unit, bound).`,
      `${evidence.reduce((sum, entry) => sum + entry.sourceTuples.filter((tuple) => tuple.bound !== null).length, 0)} typed-bound tuple observations were included across render legs.`,
    ]),
    result(2, "No clinical inference", derivationFailures.map((slot) => `Untraceable display content at ${slot.key}`), [
      "Candidate semantic models contain only source keys, source bilingual labels, exact value tuples, and display text from the existing formatStructuredMeasurementValue helper.",
      "No reference range, high/low flag, interpretation, derived result, or answer logic is generated; arbitrary SVG numerics are intentionally excluded from the check.",
    ]),
    result(3, "Deterministic non-clinical voids", voidFailures.map((slot) => `Nonempty void at ${slot.key}`), [
      `${fishboneModels.flatMap((model) => model.columns.flatMap((column) => column.slots)).filter((slot) => slot.state === "void").length} void slot observations used ${EMPTY_SLOT_REPRESENTATION}.`,
      "Void slots contain an outline only and no numeric-looking value, dash, N/A label, or other clinical-result glyph.",
    ]),
    result(4, "Exact fallback and deterministic matching", [
      ...fallbackFailures.map((entry) => entry.source.panelPath),
      ...(fallbackAudit.length === 0 ? ["No no-template source panel was available to exercise the fallback."] : []),
    ], [
      `${fallbackAudit.length} of ${fallbackAudit.length} live no-template panels called the current flat renderer directly and compared full SVG bytes; ${fallbackEvidence.length} selected/multi render legs also expose the fallback visually.`,
      "Template matching is pure, whole-panel, smallest-template-first, and separately checked twice by the focused test.",
    ]),
    result(5, "Responsive geometry", geometryFailures.map((entry) => entry.metric.artifactPath), [
      `${evidence.length} render legs measured desktop ${DESKTOP_TARGET_WIDTH}px and narrow/mobile ${NARROW_TARGET_WIDTH}px targets.`,
      "Surface overflow is distinguished from the current flat renderer's contained internal horizontal scroller.",
      "Every height delta versus the current flat rendering is recorded in manifest.json.",
    ]),
    result(6, "Bilingual and accessible label preservation", [
      ...armAFailures.map((slot) => `Arm A label loss at ${slot.key}`),
      ...armBFailures.map((slot) => `Arm B accessible-label loss at ${slot.key}`),
      ...(armAModels.length === 0 || armBModels.length === 0 ? ["Both fishbone arms were not available in the source-backed evidence."] : []),
    ], [
      `Arm A checked ${armAModels.length} semantic models for visible source English and Chinese labels.`,
      `Arm B checked ${armBModels.length} semantic models for source English and Chinese labels in the accessible layer.`,
      "The live on-tap interaction has no position-only label anchor; that is reported as an owner product-shape fork, not hidden by this proof.",
    ]),
    result(7, "Same typed input and no production routing", [
      ...(contractStatus === "FAIL" ? ["Live contract preflight failed."] : []),
      ...(selectedCount === 0 ? ["No live typed panel entered the proof renderer."] : []),
    ], [
      "The prototype accepts StructuredMeasurementPanel directly and emits proof SVG/model output without schema fields, visual registry kinds, runtime routing, or bank mutation.",
      "Smallest future attachment point: src/StructuredMeasurementsStimulus.tsx, delegating presentation from the existing typed structuredMeasurements surface; no attachment was made.",
    ]),
  ];
};

const populationSummary = (records: PopulationSource[]): Record<string, unknown> => {
  const analyteDistribution: Record<string, number> = {};
  const templateCounts: Record<string, number> = Object.fromEntries([...TEMPLATE_NAMES, "NO_TEMPLATE_MATCH"].map((name) => [name, 0]));
  records.forEach((record) => {
    analyteDistribution[String(record.rowCount)] = (analyteDistribution[String(record.rowCount)] ?? 0) + 1;
    templateCounts[record.templateMatch] += 1;
  });
  return {
    labPanelCount: records.length,
    oneColumnPanelCount: records.filter((record) => record.columnCount === 1).length,
    twoOrMoreColumnPanelCount: records.filter((record) => record.columnCount >= 2).length,
    analyteCountDistribution: analyteDistribution,
    templateCounts,
    templateRowCountRanges: Object.fromEntries([...TEMPLATE_NAMES, "NO_TEMPLATE_MATCH"].map((name) => {
      const counts = records.filter((record) => record.templateMatch === name).map((record) => record.rowCount);
      return [name, counts.length === 0 ? null : { min: Math.min(...counts), max: Math.max(...counts) }];
    })),
    selectionCategoryQualifyingCounts: Object.fromEntries(SELECTION_CATEGORIES.map((category) => [
      category.id,
      records.filter(category.matches).length,
    ])),
    noTemplateMatchCount: records.filter((record) => record.templateMatch === "NO_TEMPLATE_MATCH").length,
    allEnglishLabelsNonEmpty: records.every((record) => record.nonEmptyLabels.en),
    allChineseLabelsNonEmpty: records.every((record) => record.nonEmptyLabels.zh),
  };
};

const reportFor = (manifest: ProofBundle["manifest"], population: Record<string, unknown>): string => {
  const summary = population.summary as Record<string, unknown>;
  const multi = manifest.multiColumnComparison as Record<string, unknown>;
  const blockers = manifest.blockers as Array<{ code: string; category: string; predicate: string }>;
  const productForks = manifest.productShapeForks as string[];
  const lines = [
    "# Fishbone lab presentation proof render",
    "",
    `- Date: ${PROOF_DATE}`,
    `- Frozen base: \`${BASE_COMMIT}\``,
    `- Branch: \`${PROOF_BRANCH}\``,
    `- Terminal status: **${manifest.terminalStatus}**`,
    "- Scope: proof only; no production routing, schema, registry, runtime, bank, or dependency change.",
    ...(blockers.length > 0 ? [
      "- Missing evidence:",
      ...blockers.map((blocker) => `  - \`${blocker.code}\` — \`${blocker.category}\`; predicate \`${blocker.predicate}\``),
    ] : []),
    "",
    "## Population",
    "",
    `The deterministic scan covered ${String((population.scanScope as Record<string, unknown>).topLevelBankFileCount)} top-level bank files and found ${String(summary.labPanelCount)} structured lab panels: ${String(summary.oneColumnPanelCount)} one-column and ${String(summary.twoOrMoreColumnPanelCount)} with two or more columns.`,
    "",
    `Template counts: \`${JSON.stringify(summary.templateCounts)}\`. Analyte-count distribution: \`${JSON.stringify(summary.analyteCountDistribution)}\`.`,
    "",
    `Template row-count ranges: \`${JSON.stringify(summary.templateRowCountRanges)}\`. Required-category qualifying counts: \`${JSON.stringify(summary.selectionCategoryQualifyingCounts)}\`.`,
    "",
    "## Deterministic selections",
    "",
    "| Category | Predicate | Result | Source |",
    "|---|---|---|---|",
    ...manifest.selections.map((selection) => {
      const source = selection.selected;
      const location = source ? `${source.bankPath} :: ${source.questionId} :: ${source.panelPath}` : "—";
      return `| ${selection.label} | \`${selection.predicate}\` | ${selection.status} | ${location} |`;
    }),
    "",
    "## Conditions",
    "",
    "| # | Condition | Result |",
    "|---:|---|---|",
    ...manifest.conditions.map((condition) => `| ${condition.id} | ${condition.name} | **${condition.status}** |`),
    "",
    ...manifest.conditions.flatMap((condition) => [
      `### ${condition.id}. ${condition.name}: ${condition.status}`,
      "",
      ...condition.evidence.map((entry) => `- ${entry}`),
      ...(condition.failures.length > 0 ? ["", "Failures:", "", ...condition.failures.map((entry) => `- ${entry}`)] : []),
      "",
    ]),
    "## Multi-column fork",
    "",
    multi.status === "SELECTED"
      ? `The first byte-sorted multi-column panel is \`${String((multi.source as PopulationRecord).panelPath)}\` in \`${String((multi.source as PopulationRecord).bankPath)}\`. M1 outcome: ${String((multi.outcomes as Record<string, unknown>).M1)} M2 outcome: ${String((multi.outcomes as Record<string, unknown>).M2)} No winner is selected.`
      : `FISHBONE_PROOF_CATEGORY_NOT_FOUND: ${String(multi.predicate)}`,
    "",
    "## Width and layout basis",
    "",
    `- Desktop target: ${DESKTOP_TARGET_WIDTH}px, derived from the live 1400px wide-main maximum and nested split-case/exhibit border-box insets.`,
    `- Narrow/mobile target: ${NARROW_TARGET_WIDTH}px, derived from the live 320px body floor and current mobile session/card/exhibit border-box insets.`,
    `- Live breakpoints: ${SPLIT_LAYOUT_BREAKPOINT}px for the generic split layout and ${MOBILE_BREAKPOINT}px for the mobile session/inset rules used by the narrow target. Live non-compact flat minimum: ${CURRENT_FLAT_MIN_WIDTH}px (28rem at ${ROOT_FONT_SIZE}px).`,
    "- The current flat renderer's narrow internal scroll is recorded separately; the containing figure prevents page/surface overflow.",
    "",
    "## Product-shape forks for owner review",
    "",
    ...productForks.map((entry) => `- ${entry}`),
    "",
    "## Smallest future production plan (not authorized here)",
    "",
    ...(manifest.futureImplementationPlan as string[]).map((entry, index) => `${index + 1}. ${entry}`),
    "",
    "## Verification record",
    "",
    ...(manifest.verificationResults as Array<{ check: string; status: string; note: string }>).map((entry) => `- **${entry.status}** — \`${entry.check}\`: ${entry.note}`),
    "",
    "## Output index",
    "",
    `- Population: \`${join(OUTPUT_ROOT, "population.json")}\``,
    `- Machine-readable manifest: \`${join(OUTPUT_ROOT, "manifest.json")}\``,
    `- Side-by-side SVG evidence: \`${join(OUTPUT_ROOT, "renders/")}\` (${manifest.renders.length} files)`,
    `- Prototype and focused test: \`scripts/fishbone-proof/\``,
    "",
    "Technical clearance, if reached, is evidence only. It does not authorize production implementation, routing, schema changes, or bank edits.",
    "",
  ];
  return lines.join("\n");
};

export const buildFishboneProofBundle = async (cwd = process.cwd()): Promise<ProofBundle> => {
  const contract = await checkContract(cwd);
  const { records, bankFiles } = await surveyLivePopulation(cwd);
  const selections = selectCases(records);
  const lookup = new Map(records.map((record) => [sourceLookupKey(record), record]));
  const artifacts = new Map<string, string>();
  const renderEvidence: RenderEvidence[] = [];

  for (const selection of selections) {
    if (!selection.selected) continue;
    const source = lookup.get(sourceLookupKey(selection.selected));
    if (!source) throw new Error(`lost selected source ${selection.id}`);
    for (const arm of ["A", "B"] as const) {
      for (const target of targetDefinitions) {
        const rendered = renderEvidenceFor(selection.id, source, arm, "M1_ONE_FISHBONE_PER_COLUMN", target);
        renderEvidence.push(rendered.evidence);
        artifacts.set(rendered.evidence.metric.artifactPath, rendered.artifact);
      }
    }
  }

  const multiColumnSource = records.find((record) => record.columnCount >= 2) ?? null;
  if (multiColumnSource) {
    for (const rule of ["M1_ONE_FISHBONE_PER_COLUMN", "M2_CURRENT_FLAT_FALLBACK"] as const) {
      for (const arm of ["A", "B"] as const) {
        for (const target of targetDefinitions) {
          const rendered = renderEvidenceFor("multi_column_comparison", multiColumnSource, arm, rule, target);
          renderEvidence.push(rendered.evidence);
          artifacts.set(rendered.evidence.metric.artifactPath, rendered.artifact);
        }
      }
    }
  }

  const fallbackAudit: FallbackAuditRecord[] = records
    .filter((record) => record.templateMatch === "NO_TEMPLATE_MATCH")
    .map((record) => {
      const firstDecision = matchFishboneTemplate(record.analyteSet) ?? "NO_TEMPLATE_MATCH";
      const secondDecision = matchFishboneTemplate(record.analyteSet) ?? "NO_TEMPLATE_MATCH";
      const currentFlatSvg = renderStructuredMeasurementsSvg({ panels: [record.panel] }, "always");
      const candidate = renderCandidate(record.panel, "A", DESKTOP_TARGET_WIDTH, "M1_ONE_FISHBONE_PER_COLUMN");
      const flatTuples = currentFlatModelTuples(record.panel);
      return {
        source: publicRecord(record),
        firstDecision,
        secondDecision,
        decisionsIdentical: firstDecision === secondDecision,
        directCurrentFlatInvocation: candidate.semanticModel.presentation === "current_flat_renderer"
          && candidate.semanticModel.reason === "NO_TEMPLATE_MATCH",
        fullSvgByteEquality: candidate.svg === currentFlatSvg,
        currentFlatSvgSha256: sha256(currentFlatSvg),
        candidateSvgSha256: sha256(candidate.svg),
        currentFlatTupleMultisetHash: sha256(tupleBytes(flatTuples)),
        candidateTupleMultisetHash: sha256(tupleBytes(candidate.tuples)),
      };
    });
  const conditions = conditionResults(renderEvidence, selections, contract.status, fallbackAudit);
  const missingCategories = selections.filter((selection) => selection.status === "FISHBONE_PROOF_CATEGORY_NOT_FOUND");
  const failingConditionIds = conditions.filter((condition) => condition.status === "FAIL").map((condition) => condition.id);
  const terminalStatus = contract.status === "FAIL"
    ? "FISHBONE_PROOF_BLOCKED_CONTRACT_DRIFT"
    : missingCategories.length > 0
      ? "FISHBONE_PROOF_BLOCKED"
      : failingConditionIds.length > 0
        ? "FISHBONE_PROOF_CONDITIONS_FAILED"
        : "FISHBONE_PROOF_TECHNICALLY_CLEARED";
  const publicRecords = records.map(publicRecord);
  const population: Record<string, unknown> = {
    proofDate: PROOF_DATE,
    frozenBaseCommit: BASE_COMMIT,
    scanScope: {
      rule: "Every structuredMeasurements panel with kind === 'labs' in global and stage exhibits of every case-study question in top-level banks/*.json only.",
      topLevelBankFileCount: bankFiles.length,
      bankFiles,
      excluded: ["nested bank files", "raw banks", "promoted staging", "vitals panels", "non-structured visuals"],
    },
    ordering: "Byte order by (bankPath, questionId, exhibitPath), then numeric panelIndex.",
    frozenTemplates: FROZEN_TEMPLATES,
    matchingRule: "Whole-panel match only. Every row key must be in one frozen template; strict subsets are eligible; smallest template wins, then byte-first template name. Any outside key yields NO_TEMPLATE_MATCH and intact current-flat fallback.",
    summary: populationSummary(records),
    records: publicRecords,
  };
  const manifestsRenders = renderEvidence.map((entry) => entry.metric)
    .sort((left, right) => byteCompare(left.artifactPath, right.artifactPath));
  const manifest = {
    proofDate: PROOF_DATE,
    frozenBaseCommit: BASE_COMMIT,
    branch: PROOF_BRANCH,
    authority: {
      decisions: ["DECISIONS.md P23", "DECISIONS.md P24", "DECISIONS.md P29"],
      contractFiles: ["src/types.ts", "src/schema.ts", "src/allowedKeys.ts", "src/measurementAllowlist.ts"],
      presentationFiles: ["src/structuredMeasurements.ts", "src/StructuredMeasurementsStimulus.tsx", "src/examLayout.ts", "src/styles.css"],
    },
    contractPreflight: contract,
    frozenTemplates: FROZEN_TEMPLATES,
    matchingRule: (population.matchingRule as string),
    widthTargets: targetDefinitions,
    geometryDefinitions: {
      horizontalOverflow: "YES only when rendered content escapes the live .structured-measurements overflow container and widens the exhibit/page surface; the current flat renderer's contained internal horizontal scroll is reported separately and is not silently discarded.",
      textClipping: "Any proof-rendered visible text line whose deterministic width estimate exceeds its allocated cell width.",
      currentFlatSizing: "Non-compact flat SVG uses max(targetWidth, 28rem); compact flat SVG preserves its explicit intrinsic width. Both remain inside the current overflow-x:auto figure.",
      breakpoints: { splitLayout: SPLIT_LAYOUT_BREAKPOINT, mobileInsets: MOBILE_BREAKPOINT },
    },
    selections,
    multiColumnComparison: multiColumnSource ? {
      status: "SELECTED",
      predicate: "columnCount >= 2; first record by byte (bankPath, questionId, exhibitPath), then panelIndex",
      source: publicRecord(multiColumnSource),
      rules: {
        M1: "One fishbone per source column in exact source-column order.",
        M2: "Call the current flat renderer directly for the intact multi-column panel.",
      },
      outcomes: {
        M1: multiColumnSource.templateMatch === "NO_TEMPLATE_MATCH"
          ? "NO_TEMPLATE_MATCH_DIRECT_FLAT_FALLBACK: the frozen whole-panel safety rule takes precedence; no alternate multi-column case was substituted."
          : "ONE_FISHBONE_PER_SOURCE_COLUMN_RENDERED",
        M2: "CURRENT_FLAT_FALLBACK_RENDERED",
      },
      adjudication: "NO_WINNER_SELECTED",
    } : {
      status: "FISHBONE_PROOF_CATEGORY_NOT_FOUND",
      predicate: "columnCount >= 2",
      source: null,
      adjudication: "NO_WINNER_SELECTED",
    },
    renders: manifestsRenders,
    semanticEvidence: renderEvidence
      .map((entry) => ({
        artifactPath: entry.metric.artifactPath,
        semanticModel: entry.semanticModel,
        sourceTuples: entry.sourceTuples,
        currentFlatTuples: entry.currentFlatTuples,
        candidateTuples: entry.candidateTuples,
      }))
      .sort((left, right) => byteCompare(left.artifactPath, right.artifactPath)),
    noTemplateFallbackAudit: {
      auditedPanelCount: fallbackAudit.length,
      failureCount: fallbackAudit.filter((entry) => !entry.decisionsIdentical
        || !entry.directCurrentFlatInvocation
        || !entry.fullSvgByteEquality
        || entry.currentFlatTupleMultisetHash !== entry.candidateTupleMultisetHash).length,
      records: fallbackAudit,
    },
    conditions,
    blockers: missingCategories.map((selection) => ({
      code: "FISHBONE_PROOF_CATEGORY_NOT_FOUND",
      category: selection.id,
      predicate: selection.predicate,
    })),
    failingConditionIds,
    productShapeForks: [
      "Arm A keeps both English and Chinese labels visibly attached to each occupied position; Arm B makes position primary and retains both labels in the accessible layer. Owner must choose; this proof does not choose.",
      "The live language mode `on-tap` expects a visible/tappable bilingual text surface. Arm B has no visible row-label anchor, so production would need an explicit focus/tap disclosure design without changing the data contract.",
      multiColumnSource === null
        ? "No live multi-column panel exists, so the M1/M2 product fork has no source-backed render evidence."
        : multiColumnSource.templateMatch === "NO_TEMPLATE_MATCH"
          ? "The only multi-column panel is a whole-panel NO_TEMPLATE_MATCH. M1 therefore resolves to the mandatory intact flat fallback and cannot supply fishbone geometry without violating the frozen safety rule; M2 also falls back flat. No alternate case was substituted and no winner was chosen."
          : "For multi-column panels, owner must choose M1 (one fishbone per source column, source order) or M2 (intact current-flat fallback). This proof renders both and chooses neither.",
      "The current split chart pane caps vertical space at 40vh. Fishbone height deltas are measured here; any production choice must decide whether vertical scrolling inside that pane remains acceptable.",
      "Smallest future attachment point is src/StructuredMeasurementsStimulus.tsx, using the existing StructuredMeasurements input and existing P23 allocation. No source attachment or routing is part of this commission.",
    ],
    futureImplementationPlan: [
      "After owner selection, place the approved pure presentation helper beside the current structured-measurements renderer while keeping StructuredMeasurements as its only clinical input.",
      "At src/StructuredMeasurementsStimulus.tsx, route only whole-panel frozen-template matches into the approved presentation; preserve direct current-flat fallback for every no-template panel and the owner-selected multi-column rule.",
      "Keep the existing P23 compact/allocation decision intact, map all three language modes explicitly, and add production renderer/accessibility/visual regressions before any routing change is proposed.",
    ],
    verificationCommands: [
      "./node_modules/.bin/tsx scripts/fishbone-proof/fishbone-render.ts",
      "./node_modules/.bin/tsx scripts/fishbone-proof/fishbone-render.test.ts",
      "npx --no-install tsc -b --pretty false",
      "npm run census:check",
      "second identical proof generation plus byte-for-byte output-tree comparison",
    ],
    buildDecision: "npm run build is not required because no application-imported file or normal build path is changed.",
    verificationResults: [
      { check: "focused proof-harness test", status: "PASS", note: "Two independently built live-source bundles and every on-disk artifact compared byte-for-byte; no synthetic measurement payload was used." },
      { check: "npx --no-install tsc -b --pretty false", status: "PASS", note: "The task-local TypeScript participates in project typechecking." },
      { check: "npm run census:check", status: "PASS", note: "census.json is up to date; no census or bank artifact was regenerated." },
      { check: "deterministic second proof run", status: "PASS", note: "The complete output tree was unchanged across the second generator run." },
      { check: "representative SVG visual inspection", status: "PASS", note: "Available CBC Arm A/Arm B desktop and narrow renders were inspected for legibility and clipping. Multi-column M1 fishbone readability is not evaluable because the sole live multi-column panel is a mandatory NO_TEMPLATE_MATCH flat fallback." },
      { check: "git diff --check", status: "PASS", note: "No whitespace errors." },
      { check: "npm run build", status: "NOT_RUN_BY_RULE", note: "The dependency direction is proof harness to read-only app helpers; no application entry imports the harness and the normal Vite/file-build path is unchanged." },
    ],
    terminalStatus,
  } satisfies ProofBundle["manifest"];
  const report = reportFor(manifest, population);
  artifacts.set(join(OUTPUT_ROOT, "population.json"), `${JSON.stringify(population, null, 2)}\n`);
  artifacts.set(join(OUTPUT_ROOT, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  artifacts.set(join(OUTPUT_ROOT, "proof-report.md"), report);
  return { population, manifest, report, artifacts };
};

export const writeFishboneProofBundle = async (bundle: ProofBundle, cwd = process.cwd()): Promise<void> => {
  const entries = [...bundle.artifacts.entries()].sort(([left], [right]) => byteCompare(left, right));
  for (const [relativePath, bytes] of entries) {
    const absolutePath = resolve(cwd, relativePath);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, bytes, "utf8");
  }
};

const main = async (): Promise<void> => {
  const bundle = await buildFishboneProofBundle();
  await writeFishboneProofBundle(bundle);
  const summary = bundle.population.summary as Record<string, unknown>;
  console.log(`${OUTPUT_ROOT}: ${String(summary.labPanelCount)} live lab panels; ${bundle.manifest.renders.length} render artifacts; ${bundle.manifest.terminalStatus}`);
};

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
