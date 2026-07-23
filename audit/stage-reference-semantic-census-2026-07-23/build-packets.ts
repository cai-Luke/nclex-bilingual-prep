import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, join, relative, resolve } from "node:path";
import { parseBankText } from "../../src/bankImport";
import { getVisibleCaseStages } from "../../src/examLayout";
import { validateBankObject } from "../../src/schema";
import {
  formatStructuredMeasurementValue,
  serializeStructuredMeasurements,
} from "../../src/structuredMeasurements";
import type {
  BankEnvelope,
  CaseStudyExhibit,
  CaseStudyQuestion,
  CaseStudyStage,
  CaseSubQuestion,
  QuestionVisual,
  StandaloneQuestion,
  StructuredMeasurements,
  TextPair,
} from "../../src/types";
import {
  findStageReferenceFindings,
  type AnchorFieldState,
} from "../../scripts/audit/audit-stage-refs";

const ROOT = resolve(import.meta.dirname, "../..");
const OUT = resolve(import.meta.dirname);
const BANKS = resolve(ROOT, "banks");
const PACKETS = join(OUT, "packets");
const CALIBRATION = join(OUT, "calibration");
const MAX_TARGETS = 20;
const MAX_BYTES = 300_000;
const CALIBRATION_COUNT = 32;

type LoadedBank = {
  bankPath: string;
  filename: string;
  sha256: string;
  bank: BankEnvelope;
};

type PopulationRow = {
  queueIndex: number;
  bankPath: string;
  bankSha256: string;
  parentCaseId: string;
  partId: string;
  casePath: string;
  partPath: string;
  partOrdinal: number;
  casePartCount: number;
  itemType: StandaloneQuestion["itemType"];
  anchorState: {
    answerableAfterStageId: AnchorFieldState;
    stageId: AnchorFieldState;
  };
  declaredStageIds: string[];
  rendererVisibleStageIds: string[];
  packetId: string;
};

type EvidenceSurface =
  | "CASE_CONTEXT"
  | "GLOBAL_EXHIBIT"
  | "STAGE"
  | "PART_STEM"
  | "PART_RESPONSE"
  | "PART_KEY"
  | "PART_RATIONALE"
  | "SIBLING_OUTLINE";

type EvidenceEntry = {
  evidenceId: string;
  parentCaseId: string;
  ownerPartId?: string;
  surface: EvidenceSurface;
  stageId?: string;
  language?: "en" | "zh";
  jsonPath: string;
  text: string;
};

type BuiltCase = {
  bankPath: string;
  bankSha256: string;
  parentCaseId: string;
  casePath: string;
  stem: TextPair;
  title: TextPair;
  summary?: TextPair;
  globalExhibits: unknown[];
  stages: unknown[];
  siblingPartOutlines: unknown[];
  targets: unknown[];
  evidenceIds: string[];
  _evidenceCatalog: EvidenceEntry[];
  _populationRows: Omit<PopulationRow, "queueIndex" | "packetId">[];
};

type Packet = {
  packetVersion: "1.0";
  packetId: string;
  bankSnapshotSha256: string;
  targetCount: number;
  oversizedSingleCase: boolean;
  cases: Array<Omit<BuiltCase, "_evidenceCatalog" | "_populationRows">>;
  evidenceCatalog: EvidenceEntry[];
};

type SelectionIdentity = {
  queueIndex: number;
  packetId: string;
  bankPath: string;
  parentCaseId: string;
  partId: string;
};

type ArchitectSelection = SelectionIdentity & {
  selectionReason: string;
};

type ArchitectSelectionManifest = {
  selectionVersion: "1.1";
  selectionOwner: "architect/checker";
  bankSnapshotSha256: string;
  selectedTargets: ArchitectSelection[];
};

const compact = (value: unknown): string => JSON.stringify(value);
const pretty = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value: string | Buffer): string =>
  createHash("sha256").update(value).digest("hex");
const token = (value: string): string => encodeURIComponent(value).replaceAll(".", "%2E");
const utf8Bytes = (value: unknown): number => Buffer.byteLength(compact(value), "utf8");

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function withoutAuditFields(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) throw new Error("Circular visual payload");
  seen.add(value);
  const projected = Array.isArray(value)
    ? value.map((entry) => withoutAuditFields(entry, seen))
    : Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => key !== "meta" && key !== "selfCheck")
        .map(([key, entry]) => [key, withoutAuditFields(entry, seen)]),
    );
  seen.delete(value);
  return projected;
}

class EvidenceBuilder {
  readonly entries: EvidenceEntry[] = [];
  readonly ids = new Set<string>();

  constructor(
    private readonly parentCaseId: string,
    private readonly base: string,
  ) {}

  add(
    suffix: string,
    surface: EvidenceSurface,
    jsonPath: string,
    text: string,
    extra: Pick<EvidenceEntry, "ownerPartId" | "stageId" | "language"> = {},
  ): string {
    const evidenceId = `${this.base}.${suffix}`;
    assert(!this.ids.has(evidenceId), `Duplicate evidence ID: ${evidenceId}`);
    assert(typeof text === "string", `Non-string evidence text at ${jsonPath}`);
    this.ids.add(evidenceId);
    this.entries.push({
      evidenceId,
      parentCaseId: this.parentCaseId,
      surface,
      ...extra,
      jsonPath,
      text,
    });
    return evidenceId;
  }

  pair(
    suffix: string,
    surface: EvidenceSurface,
    jsonPath: string,
    pair: TextPair,
    extra: Pick<EvidenceEntry, "ownerPartId" | "stageId"> = {},
  ): string[] {
    return (["en", "zh"] as const).map((language) =>
      this.add(
        `${suffix}.${language}`,
        surface,
        `${jsonPath}.${language}`,
        pair[language],
        { ...extra, language },
      ));
  }

  visual(
    suffix: string,
    surface: EvidenceSurface,
    jsonPath: string,
    visual: QuestionVisual,
    extra: Pick<EvidenceEntry, "ownerPartId" | "stageId"> = {},
  ): { projection: unknown; evidenceIds: string[] } {
    const projection = withoutAuditFields(visual);
    const evidenceIds: string[] = [];
    const walk = (value: unknown, pointer: string, path: string): void => {
      if (value !== null && typeof value === "object") {
        if (Array.isArray(value)) {
          value.forEach((entry, index) => walk(entry, `${pointer}/${index}`, `${path}[${index}]`));
        } else {
          Object.keys(value as Record<string, unknown>).sort().forEach((key) => {
            const encoded = key.replaceAll("~", "~0").replaceAll("/", "~1");
            walk(
              (value as Record<string, unknown>)[key],
              `${pointer}/${encoded}`,
              `${path}.${key}`,
            );
          });
        }
        return;
      }
      const stableValue = JSON.stringify(value);
      evidenceIds.push(this.add(
        `${suffix}.visual.${String(evidenceIds.length + 1).padStart(4, "0")}`,
        surface,
        path,
        `${pointer || "/"}=${stableValue}`,
        extra,
      ));
    };
    walk(projection, "", jsonPath);
    return { projection, evidenceIds };
  }
}

function projectStructuredMeasurements(
  measurements: StructuredMeasurements | undefined,
  suffix: string,
  surface: EvidenceSurface,
  jsonPath: string,
  evidence: EvidenceBuilder,
  extra: Pick<EvidenceEntry, "stageId">,
): { source: StructuredMeasurements; serialized: TextPair; evidenceIds: string[] } | undefined {
  if (!measurements) return undefined;
  const serialized = serializeStructuredMeasurements(measurements);
  assert(serialized, `Structured measurements did not serialize at ${jsonPath}`);
  const evidenceIds: string[] = [];
  for (const language of ["en", "zh"] as const) {
    let atomicIndex = 0;
    for (const [panelIndex, panel] of measurements.panels.entries()) {
      for (const [rowIndex, row] of panel.rows.entries()) {
        for (const [valueIndex, value] of row.values.entries()) {
          const column = panel.columns.find(({ id }) => id === value.columnId);
          const label = row.label[language];
          const columnLabel = column?.label?.[language];
          const prefix = columnLabel ? `${label} (${columnLabel})` : label;
          const text = `${prefix}: ${formatStructuredMeasurementValue(row.key, value, language)}`;
          atomicIndex += 1;
          evidenceIds.push(evidence.add(
            `${suffix}.structured.${language}.${atomicIndex}`,
            surface,
            `${jsonPath}.panels[${panelIndex}].rows[${rowIndex}].values[${valueIndex}]`,
            text,
            { ...extra, language },
          ));
        }
      }
    }
  }
  return { source: measurements, serialized, evidenceIds };
}

function projectExhibit(
  exhibit: CaseStudyExhibit,
  suffix: string,
  surface: "GLOBAL_EXHIBIT" | "STAGE",
  jsonPath: string,
  evidence: EvidenceBuilder,
  stageId?: string,
): { projection: unknown; evidenceIds: string[] } {
  const extra = stageId ? { stageId } : {};
  const evidenceIds = [
    ...evidence.pair(`${suffix}.title`, surface, `${jsonPath}.title`, exhibit.title, extra),
    ...evidence.pair(`${suffix}.content`, surface, `${jsonPath}.content`, exhibit.content, extra),
  ];
  const structured = projectStructuredMeasurements(
    exhibit.structuredMeasurements,
    suffix,
    surface,
    `${jsonPath}.structuredMeasurements`,
    evidence,
    extra,
  );
  if (structured) evidenceIds.push(...structured.evidenceIds);
  const visual = exhibit.visual
    ? evidence.visual(`${suffix}`, surface, `${jsonPath}.visual`, exhibit.visual, extra)
    : undefined;
  if (visual) evidenceIds.push(...visual.evidenceIds);
  return {
    projection: {
      id: exhibit.id,
      type: exhibit.type,
      title: exhibit.title,
      content: exhibit.content,
      structuredMeasurements: structured
        ? { source: structured.source, serialized: structured.serialized }
        : undefined,
      visual: visual?.projection,
      evidenceIds,
    },
    evidenceIds,
  };
}

function projectResponse(
  part: CaseSubQuestion,
  partSuffix: string,
  partPath: string,
  evidence: EvidenceBuilder,
): { response: unknown; responseEvidenceIds: string[]; keyEvidenceIds: string[] } {
  const ownerPartId = part.id;
  const responseEvidenceIds: string[] = [];
  const keyEvidenceIds: string[] = [];
  const addPair = (suffix: string, path: string, pair: TextPair) => {
    responseEvidenceIds.push(...evidence.pair(
      `${partSuffix}.response.${suffix}`,
      "PART_RESPONSE",
      path,
      pair,
      { ownerPartId },
    ));
  };
  const addKey = (suffix: string, path: string, value: unknown) => {
    keyEvidenceIds.push(evidence.add(
      `${partSuffix}.key.${suffix}`,
      "PART_KEY",
      path,
      compact(value),
      { ownerPartId },
    ));
  };

  if (
    part.itemType === "multiple_choice" ||
    part.itemType === "select_all" ||
    part.itemType === "ordered_response"
  ) {
    part.options.forEach((option, index) =>
      addPair(`option.${token(option.id)}`, `${partPath}.options[${index}]`, option));
    addKey("correct", `${partPath}.correct`, part.correct);
    return {
      response: { options: part.options, correct: part.correct },
      responseEvidenceIds,
      keyEvidenceIds,
    };
  }
  if (part.itemType === "fill_in_blank") {
    part.blanks.forEach((blank, index) => {
      addPair(`blank.${token(blank.id)}.prompt`, `${partPath}.blanks[${index}].prompt`, blank.prompt);
      addKey(
        `blank.${token(blank.id)}.correct`,
        `${partPath}.blanks[${index}]`,
        { acceptable: blank.acceptable, numeric: blank.numeric },
      );
    });
    return { response: { blanks: part.blanks }, responseEvidenceIds, keyEvidenceIds };
  }
  if (part.itemType === "matrix") {
    part.matrix.rows.forEach((row, index) =>
      addPair(`row.${token(row.id)}`, `${partPath}.matrix.rows[${index}]`, row));
    part.matrix.columns.forEach((column, index) =>
      addPair(`column.${token(column.id)}`, `${partPath}.matrix.columns[${index}]`, column));
    addKey("correct", `${partPath}.correct`, part.correct);
    return {
      response: { matrix: part.matrix, correct: part.correct },
      responseEvidenceIds,
      keyEvidenceIds,
    };
  }
  if (part.itemType === "dropdown_cloze") {
    addPair("clozeStem", `${partPath}.clozeStem`, part.clozeStem);
    part.dropdowns.forEach((dropdown, dropdownIndex) => {
      dropdown.options.forEach((option, optionIndex) =>
        addPair(
          `dropdown.${token(dropdown.id)}.option.${token(option.id)}`,
          `${partPath}.dropdowns[${dropdownIndex}].options[${optionIndex}]`,
          option,
        ));
      addKey(
        `dropdown.${token(dropdown.id)}.correct`,
        `${partPath}.dropdowns[${dropdownIndex}].correct`,
        dropdown.correct,
      );
    });
    return {
      response: { clozeStem: part.clozeStem, dropdowns: part.dropdowns },
      responseEvidenceIds,
      keyEvidenceIds,
    };
  }
  if (part.itemType === "highlight") {
    part.highlight.segments.forEach((segment, index) =>
      addPair(
        `segment.${token(segment.id)}`,
        `${partPath}.highlight.segments[${index}]`,
        segment,
      ));
    addKey("correct", `${partPath}.highlight.correct`, part.highlight.correct);
    return {
      response: { highlight: part.highlight },
      responseEvidenceIds,
      keyEvidenceIds,
    };
  }

  for (const zoneName of ["condition", "actions", "parameters"] as const) {
    const zone = part.bowtie[zoneName];
    if (zone.prompt) addPair(`${zoneName}.prompt`, `${partPath}.bowtie.${zoneName}.prompt`, zone.prompt);
    zone.tokens.forEach((bowtieToken, index) =>
      addPair(
        `${zoneName}.token.${token(bowtieToken.id)}`,
        `${partPath}.bowtie.${zoneName}.tokens[${index}]`,
        bowtieToken,
      ));
    addKey(`${zoneName}.correct`, `${partPath}.bowtie.${zoneName}.correct`, zone.correct);
  }
  return { response: { bowtie: part.bowtie }, responseEvidenceIds, keyEvidenceIds };
}

function buildCase(
  loaded: LoadedBank,
  question: CaseStudyQuestion,
  caseIndex: number,
  targetFindings: Array<Extract<ReturnType<typeof findStageReferenceFindings>[number], { kind: "revealsAllStages" }>>,
): BuiltCase {
  const casePath = `questions[${caseIndex}]`;
  const base = `case.${token(question.id)}`;
  const evidence = new EvidenceBuilder(question.id, base);
  const contextEvidenceIds = [
    ...evidence.pair("context.stem", "CASE_CONTEXT", `${casePath}.stem`, question.stem),
    ...evidence.pair("context.title", "CASE_CONTEXT", `${casePath}.caseStudy.title`, question.caseStudy.title),
  ];
  if (question.caseStudy.summary) {
    contextEvidenceIds.push(
      ...evidence.pair(
        "context.summary",
        "CASE_CONTEXT",
        `${casePath}.caseStudy.summary`,
        question.caseStudy.summary,
      ),
    );
  }

  const globalExhibits = question.caseStudy.exhibits.map((exhibit, exhibitIndex) => {
    const projected = projectExhibit(
      exhibit,
      `globalExhibit.${token(exhibit.id)}`,
      "GLOBAL_EXHIBIT",
      `${casePath}.caseStudy.exhibits[${exhibitIndex}]`,
      evidence,
    );
    contextEvidenceIds.push(...projected.evidenceIds);
    return projected.projection;
  });

  const stages = (question.caseStudy.stages ?? []).map((stage: CaseStudyStage, stageIndex) => {
    const stagePath = `${casePath}.caseStudy.stages[${stageIndex}]`;
    const stageSuffix = `stage.${token(stage.id)}`;
    const evidenceIds = [
      ...evidence.pair(`${stageSuffix}.title`, "STAGE", `${stagePath}.title`, stage.title, { stageId: stage.id }),
    ];
    if (stage.trigger) {
      evidenceIds.push(
        ...evidence.pair(`${stageSuffix}.trigger`, "STAGE", `${stagePath}.trigger`, stage.trigger, { stageId: stage.id }),
      );
    }
    if (stage.narrative) {
      evidenceIds.push(
        ...evidence.pair(`${stageSuffix}.narrative`, "STAGE", `${stagePath}.narrative`, stage.narrative, { stageId: stage.id }),
      );
    }
    if (stage.timeOffset !== undefined) {
      evidenceIds.push(evidence.add(
        `${stageSuffix}.timeOffset`,
        "STAGE",
        `${stagePath}.timeOffset`,
        stage.timeOffset,
        { stageId: stage.id },
      ));
    }
    const exhibits = stage.exhibits.map((exhibit, exhibitIndex) => {
      const projected = projectExhibit(
        exhibit,
        `${stageSuffix}.exhibit.${token(exhibit.id)}`,
        "STAGE",
        `${stagePath}.exhibits[${exhibitIndex}]`,
        evidence,
        stage.id,
      );
      evidenceIds.push(...projected.evidenceIds);
      return projected.projection;
    });
    return {
      id: stage.id,
      title: stage.title,
      trigger: stage.trigger,
      narrative: stage.narrative,
      timeOffset: stage.timeOffset,
      exhibits,
      evidenceIds,
    };
  });

  const siblingPartOutlines = question.caseStudy.questions.map((part, partIndex) => {
    const partPath = `${casePath}.caseStudy.questions[${partIndex}]`;
    const suffix = `sibling.${token(part.id)}`;
    const evidenceIds = evidence.pair(
      `${suffix}.stem`,
      "SIBLING_OUTLINE",
      `${partPath}.stem`,
      part.stem,
      { ownerPartId: part.id },
    );
    evidenceIds.push(evidence.add(
      `${suffix}.anchors`,
      "SIBLING_OUTLINE",
      partPath,
      compact({
        answerableAfterStageId: part.answerableAfterStageId ?? null,
        stageId: part.stageId ?? null,
      }),
      { ownerPartId: part.id },
    ));
    return {
      ordinal: partIndex + 1,
      id: part.id,
      itemType: part.itemType,
      stem: part.stem,
      answerableAfterStageId: part.answerableAfterStageId ?? null,
      stageId: part.stageId ?? null,
      evidenceIds,
    };
  });

  const findingByPartId = new Map(targetFindings.map((finding) => [finding.partId, finding]));
  const targets: unknown[] = [];
  const populationRows: Omit<PopulationRow, "queueIndex" | "packetId">[] = [];
  for (const [partIndex, part] of question.caseStudy.questions.entries()) {
    const finding = findingByPartId.get(part.id);
    if (!finding) continue;
    const partPath = `${casePath}.caseStudy.questions[${partIndex}]`;
    const partSuffix = `part.${token(part.id)}`;
    const stemEvidenceIds = evidence.pair(
      `${partSuffix}.stem`,
      "PART_STEM",
      `${partPath}.stem`,
      part.stem,
      { ownerPartId: part.id },
    );
    const { response, responseEvidenceIds, keyEvidenceIds } =
      projectResponse(part, partSuffix, partPath, evidence);
    const rationaleEvidenceIds = evidence.pair(
      `${partSuffix}.rationale.correct`,
      "PART_RATIONALE",
      `${partPath}.rationale.correct`,
      part.rationale.correct,
      { ownerPartId: part.id },
    );
    for (const [index, choice] of (part.rationale.byChoice ?? []).entries()) {
      rationaleEvidenceIds.push(...evidence.pair(
        `${partSuffix}.rationale.byChoice.${token(choice.refId)}`,
        "PART_RATIONALE",
        `${partPath}.rationale.byChoice[${index}]`,
        choice,
        { ownerPartId: part.id },
      ));
    }
    const strategyEvidenceIds = evidence.pair(
      `${partSuffix}.strategy`,
      "PART_RATIONALE",
      `${partPath}.testTakingStrategy`,
      part.testTakingStrategy,
      { ownerPartId: part.id },
    );
    const visual = part.visual
      ? evidence.visual(
        `${partSuffix}.question`,
        "PART_RESPONSE",
        `${partPath}.visual`,
        part.visual,
        { ownerPartId: part.id },
      )
      : undefined;
    const partEvidenceIds = [
      ...stemEvidenceIds,
      ...responseEvidenceIds,
      ...keyEvidenceIds,
      ...rationaleEvidenceIds,
      ...strategyEvidenceIds,
      ...(visual?.evidenceIds ?? []),
    ];
    targets.push({
      partId: part.id,
      partOrdinal: partIndex + 1,
      itemType: part.itemType,
      stem: part.stem,
      response,
      visual: visual?.projection,
      rationale: part.rationale,
      testTakingStrategy: part.testTakingStrategy,
      anchorState: finding.anchorState,
      declaredStageIds: finding.validStageIds,
      rendererVisibleStageIds: getVisibleCaseStages(question, part).map(({ id }) => id),
      partEvidenceIds,
      stageEvidenceIds: stages.flatMap((stage) => stage.evidenceIds),
      contextEvidenceIds,
    });
    populationRows.push({
      bankPath: loaded.bankPath,
      bankSha256: loaded.sha256,
      parentCaseId: question.id,
      partId: part.id,
      casePath,
      partPath,
      partOrdinal: partIndex + 1,
      casePartCount: question.caseStudy.questions.length,
      itemType: part.itemType,
      anchorState: finding.anchorState,
      declaredStageIds: finding.validStageIds,
      rendererVisibleStageIds: getVisibleCaseStages(question, part).map(({ id }) => id),
    });
  }
  assert(targets.length === targetFindings.length, `Target resolution mismatch for ${question.id}`);

  return {
    bankPath: loaded.bankPath,
    bankSha256: loaded.sha256,
    parentCaseId: question.id,
    casePath,
    stem: question.stem,
    title: question.caseStudy.title,
    summary: question.caseStudy.summary,
    globalExhibits,
    stages,
    siblingPartOutlines,
    targets,
    evidenceIds: evidence.entries.map(({ evidenceId }) => evidenceId),
    _evidenceCatalog: evidence.entries,
    _populationRows: populationRows,
  };
}

async function loadBanks(): Promise<LoadedBank[]> {
  const filenames = (await readdir(BANKS))
    .filter((filename) => filename.endsWith(".json"))
    .sort();
  const loaded: LoadedBank[] = [];
  for (const filename of filenames) {
    const absolute = join(BANKS, filename);
    const text = await readFile(absolute, "utf8");
    const parsed = parseBankText(text);
    const result = validateBankObject(parsed, { rejectUnknownKeys: true });
    if (!result.ok) {
      throw new Error(`BLOCKED_PARSE_OR_SCHEMA_FAILURE ${filename}: ${result.reasons.join("; ")}`);
    }
    loaded.push({
      bankPath: `banks/${filename}`,
      filename,
      sha256: sha256(text),
      bank: result.value,
    });
  }
  return loaded;
}

function snapshotHash(banks: LoadedBank[]): string {
  return sha256(banks.map(({ bankPath, sha256: hash }) => `${bankPath}\0${hash}\n`).join(""));
}

function packetFromCases(
  packetId: string,
  bankSnapshotSha256: string,
  cases: BuiltCase[],
  oversizedSingleCase = false,
): Packet {
  return {
    packetVersion: "1.0",
    packetId,
    bankSnapshotSha256,
    targetCount: cases.reduce((sum, builtCase) => sum + builtCase._populationRows.length, 0),
    oversizedSingleCase,
    cases: cases.map(({ _evidenceCatalog, _populationRows, ...rest }) => rest),
    evidenceCatalog: cases.flatMap(({ _evidenceCatalog }) => _evidenceCatalog),
  };
}

function packCases(cases: BuiltCase[], bankSnapshotSha256: string): Packet[] {
  const grouped: BuiltCase[][] = [];
  let current: BuiltCase[] = [];
  for (const builtCase of cases) {
    const candidate = [...current, builtCase];
    const candidateId = `packet-${String(grouped.length + 1).padStart(3, "0")}`;
    const projected = packetFromCases(candidateId, bankSnapshotSha256, candidate);
    const exceeds = projected.targetCount > MAX_TARGETS || utf8Bytes(projected) > MAX_BYTES;
    if (exceeds && current.length > 0) {
      grouped.push(current);
      current = [builtCase];
    } else {
      current = candidate;
    }
  }
  if (current.length > 0) grouped.push(current);
  return grouped.map((group, index) => {
    const packetId = `packet-${String(index + 1).padStart(3, "0")}`;
    const ordinary = packetFromCases(packetId, bankSnapshotSha256, group);
    const oversizedSingleCase =
      group.length === 1 && (ordinary.targetCount > MAX_TARGETS || utf8Bytes(ordinary) > MAX_BYTES);
    return packetFromCases(packetId, bankSnapshotSha256, group, oversizedSingleCase);
  });
}

function validateArchitectSelection(
  manifest: ArchitectSelectionManifest,
  population: PopulationRow[],
  bankSnapshotSha256: string,
): ArchitectSelection[] {
  assert(manifest.selectionVersion === "1.1", "Calibration selectionVersion must be 1.1");
  assert(
    manifest.selectionOwner === "architect/checker",
    "Calibration selectionOwner must be architect/checker",
  );
  assert(
    manifest.bankSnapshotSha256 === bankSnapshotSha256,
    "BLOCKED_CONCURRENT_BANK_CHANGE selection manifest bank snapshot differs",
  );
  assert(
    Array.isArray(manifest.selectedTargets) &&
      manifest.selectedTargets.length === CALIBRATION_COUNT,
    `Architect selection must contain exactly ${CALIBRATION_COUNT} targets`,
  );
  const populationByQueue = new Map(population.map((row) => [row.queueIndex, row]));
  const seen = new Set<number>();
  const perCase = new Map<string, number>();
  let priorQueueIndex = 0;
  for (const [index, target] of manifest.selectedTargets.entries()) {
    const allowedKeys = new Set([
      "queueIndex",
      "packetId",
      "bankPath",
      "parentCaseId",
      "partId",
      "selectionReason",
    ]);
    assert(
      Object.keys(target).every((key) => allowedKeys.has(key)),
      `Selection target ${index + 1} contains an unauthorized field`,
    );
    assert(
      Number.isInteger(target.queueIndex) && target.queueIndex > priorQueueIndex,
      "Architect selection must be in strictly increasing population queue order",
    );
    assert(!seen.has(target.queueIndex), `Duplicate calibration queue ${target.queueIndex}`);
    const row = populationByQueue.get(target.queueIndex);
    assert(row, `Unknown calibration queue ${target.queueIndex}`);
    for (const field of ["packetId", "bankPath", "parentCaseId", "partId"] as const) {
      assert(
        target[field] === row[field],
        `Calibration queue ${target.queueIndex} identity mismatch for ${field}`,
      );
    }
    assert(
      typeof target.selectionReason === "string" && target.selectionReason.trim().length >= 12,
      `Calibration queue ${target.queueIndex} needs a concise architect selectionReason`,
    );
    seen.add(target.queueIndex);
    priorQueueIndex = target.queueIndex;
    const caseKey = `${target.bankPath}|${target.parentCaseId}`;
    perCase.set(caseKey, (perCase.get(caseKey) ?? 0) + 1);
  }
  assert(perCase.size >= 12,
    "Calibration selection spans fewer than 12 cases");
  assert(
    Math.max(...perCase.values()) <= 4,
    "A parent case contributes more than four calibration targets",
  );
  return manifest.selectedTargets;
}

type CalibrationCaseGroup = {
  assignedTargets: SelectionIdentity[];
  projectedCase: Packet["cases"][number];
  evidenceCatalog: EvidenceEntry[];
};

function projectCalibrationCases(
  selection: ArchitectSelection[],
  packets: Packet[],
): CalibrationCaseGroup[] {
  const packetById = new Map(packets.map((packet) => [packet.packetId, packet]));
  const selectedByCase = new Map<string, ArchitectSelection[]>();
  for (const identity of selection) {
    const key = `${identity.packetId}|${identity.bankPath}|${identity.parentCaseId}`;
    selectedByCase.set(key, [...(selectedByCase.get(key) ?? []), identity]);
  }
  const groups: CalibrationCaseGroup[] = [];
  for (const [key, identities] of selectedByCase) {
    const [packetId, bankPath, parentCaseId] = key.split("|");
    const packet = packetById.get(packetId);
    assert(packet, `Selection references unknown packet ${packetId}`);
    const sourceCase = packet.cases.find((candidate) =>
      candidate.bankPath === bankPath && candidate.parentCaseId === parentCaseId);
    assert(sourceCase, `Selection references unknown case ${key}`);
    const selectedPartIds = new Set(identities.map(({ partId }) => partId));
    const selectedTargets = (sourceCase.targets as Array<{ partId: string }>).filter(({ partId }) =>
      selectedPartIds.has(partId));
    assert(selectedTargets.length === identities.length, `Calibration target mismatch for ${key}`);
    const allowedEvidenceIds = new Set([
      ...(sourceCase.globalExhibits as Array<{ evidenceIds?: string[] }>).flatMap(({ evidenceIds }) => evidenceIds ?? []),
      ...(sourceCase.stages as Array<{ evidenceIds: string[] }>).flatMap(({ evidenceIds }) => evidenceIds),
      ...(sourceCase.siblingPartOutlines as Array<{ evidenceIds: string[] }>).flatMap(({ evidenceIds }) => evidenceIds),
      ...selectedTargets.flatMap((target) => {
        const typed = target as unknown as {
          partEvidenceIds: string[];
          contextEvidenceIds: string[];
          stageEvidenceIds: string[];
        };
        return [...typed.partEvidenceIds, ...typed.contextEvidenceIds, ...typed.stageEvidenceIds];
      }),
    ]);
    const catalog = packet.evidenceCatalog.filter(({ evidenceId, parentCaseId: owner }) =>
      owner === parentCaseId && allowedEvidenceIds.has(evidenceId));
    groups.push({
      assignedTargets: identities.map(({
        selectionReason: _selectionReason,
        ...identity
      }) => identity),
      projectedCase: {
        ...sourceCase,
        targets: selectedTargets,
        evidenceIds: catalog.map(({ evidenceId }) => evidenceId),
      },
      evidenceCatalog: catalog,
    });
  }
  return groups;
}

type CalibrationShard = {
  calibrationShardVersion: "1.0";
  calibrationShardId: string;
  bankSnapshotSha256: string;
  targetCount: number;
  oversizedSingleCase: boolean;
  assignedTargets: SelectionIdentity[];
  cases: Packet["cases"];
  evidenceCatalog: EvidenceEntry[];
};

function calibrationShardFromGroups(
  calibrationShardId: string,
  bankSnapshotSha256: string,
  groups: CalibrationCaseGroup[],
  oversizedSingleCase = false,
): CalibrationShard {
  return {
    calibrationShardVersion: "1.0",
    calibrationShardId,
    bankSnapshotSha256,
    targetCount: groups.reduce((sum, group) => sum + group.assignedTargets.length, 0),
    oversizedSingleCase,
    assignedTargets: groups.flatMap(({ assignedTargets }) => assignedTargets),
    cases: groups.map(({ projectedCase }) => projectedCase),
    evidenceCatalog: groups.flatMap(({ evidenceCatalog }) => evidenceCatalog),
  };
}

function packCalibrationShards(
  groups: CalibrationCaseGroup[],
  bankSnapshotSha256: string,
): CalibrationShard[] {
  const grouped: CalibrationCaseGroup[][] = [];
  let current: CalibrationCaseGroup[] = [];
  for (const group of groups) {
    const candidate = [...current, group];
    const shardId = `calibration-shard-${String(grouped.length + 1).padStart(3, "0")}`;
    const projected = calibrationShardFromGroups(shardId, bankSnapshotSha256, candidate);
    const exceeds = projected.targetCount > MAX_TARGETS || utf8Bytes(projected) > MAX_BYTES;
    if (exceeds && current.length > 0) {
      grouped.push(current);
      current = [group];
    } else {
      current = candidate;
    }
  }
  if (current.length > 0) grouped.push(current);
  return grouped.map((group, index) => {
    const shardId = `calibration-shard-${String(index + 1).padStart(3, "0")}`;
    const ordinary = calibrationShardFromGroups(shardId, bankSnapshotSha256, group);
    const oversizedSingleCase =
      group.length === 1 && (ordinary.targetCount > MAX_TARGETS || utf8Bytes(ordinary) > MAX_BYTES);
    return calibrationShardFromGroups(shardId, bankSnapshotSha256, group, oversizedSingleCase);
  });
}

function selfTestCalibrationLayer(
  population: PopulationRow[],
  packets: Packet[],
  bankSnapshotSha256: string,
): void {
  const seenCases = new Set<string>();
  const selectedTargets: ArchitectSelection[] = [];
  for (const row of population) {
    const caseKey = `${row.bankPath}|${row.parentCaseId}`;
    if (seenCases.has(caseKey)) continue;
    seenCases.add(caseKey);
    selectedTargets.push({
      queueIndex: row.queueIndex,
      packetId: row.packetId,
      bankPath: row.bankPath,
      parentCaseId: row.parentCaseId,
      partId: row.partId,
      selectionReason: `Synthetic calibration-layer test fixture for queue ${row.queueIndex}.`,
    });
    if (selectedTargets.length === CALIBRATION_COUNT) break;
  }
  const manifest: ArchitectSelectionManifest = {
    selectionVersion: "1.1",
    selectionOwner: "architect/checker",
    bankSnapshotSha256,
    selectedTargets,
  };
  const validated = validateArchitectSelection(manifest, population, bankSnapshotSha256);
  const groups = projectCalibrationCases(validated, packets);
  const shards = packCalibrationShards(groups, bankSnapshotSha256);
  assert(
    shards.reduce((sum, shard) => sum + shard.targetCount, 0) === CALIBRATION_COUNT,
    "Synthetic calibration shard target reconciliation failed",
  );
  assert(shards.length > 1, "Synthetic calibration must produce more than one shard");
  for (const shard of shards) {
    assert(
      shard.oversizedSingleCase ||
        (shard.targetCount <= MAX_TARGETS && utf8Bytes(shard) <= MAX_BYTES),
      `Synthetic calibration shard limit failure: ${shard.calibrationShardId}`,
    );
    assert(
      !compact(shard).includes("selectionReason"),
      `Architect selection reason leaked into ${shard.calibrationShardId}`,
    );
  }
  console.log(
    `calibration-layer synthetic materialization passed (${CALIBRATION_COUNT} targets / ${shards.length} shards)`,
  );
}

function markdownCell(value: string): string {
  return value.replaceAll("|", "\\|").replace(/\s+/gu, " ").trim();
}

async function writeCalibrationArtifacts(
  selection: ArchitectSelection[],
  population: PopulationRow[],
  packets: Packet[],
  bankSnapshotSha256: string,
): Promise<{ shardCount: number; calibrationCaseCount: number }> {
  const groups = projectCalibrationCases(selection, packets);
  const shards = packCalibrationShards(groups, bankSnapshotSha256);
  const shardDir = join(CALIBRATION, "shards");
  await rm(shardDir, { recursive: true, force: true });
  await mkdir(shardDir, { recursive: true });
  for (const shard of shards) {
    await writeFile(join(shardDir, `${shard.calibrationShardId}.json`), compact(shard));
  }
  const aggregateInput = {
    calibrationVersion: "1.1",
    bankSnapshotSha256,
    targetCount: selection.length,
    parentCaseCount: groups.length,
    shardCount: shards.length,
    assignedTargets: selection.map(({ selectionReason: _selectionReason, ...identity }) => identity),
    shards: shards.map((shard) => {
      const serialized = compact(shard);
      return {
        calibrationShardId: shard.calibrationShardId,
        path: `shards/${shard.calibrationShardId}.json`,
        targetCount: shard.targetCount,
        parentCaseCount: shard.cases.length,
        utf8Bytes: Buffer.byteLength(serialized, "utf8"),
        sha256: sha256(serialized),
        oversizedSingleCase: shard.oversizedSingleCase,
        queueIndices: shard.assignedTargets.map(({ queueIndex }) => queueIndex),
      };
    }),
  };
  await writeFile(join(CALIBRATION, "calibration-input.json"), pretty(aggregateInput));

  const populationByQueue = new Map(population.map((row) => [row.queueIndex, row]));
  const reviewLines = [
    "# Architect Calibration Selection Review",
    "",
    "This human-readable view is derived from the architect-authored selection manifest.",
    "Selection reasons are not included in any Gemini-facing shard.",
    "",
    "| Queue | Packet | Bank | Parent case | Part | Ordinal / type | Case title (EN) | Part stem (EN) | Architect selection reason |",
    "|---:|---|---|---|---|---|---|---|---|",
  ];
  for (const selected of selection) {
    const row = populationByQueue.get(selected.queueIndex)!;
    const group = groups.find(({ assignedTargets }) =>
      assignedTargets.some(({ queueIndex }) => queueIndex === selected.queueIndex))!;
    const target = (group.projectedCase.targets as Array<{
      partId: string;
      partOrdinal: number;
      itemType: string;
      stem: TextPair;
    }>).find(({ partId }) => partId === selected.partId)!;
    reviewLines.push([
      selected.queueIndex,
      selected.packetId,
      selected.bankPath,
      selected.parentCaseId,
      selected.partId,
      `${row.partOrdinal}/${row.casePartCount} · ${row.itemType}`,
      markdownCell(group.projectedCase.title.en),
      markdownCell(target.stem.en),
      markdownCell(selected.selectionReason),
    ].map((value) => ` ${value} `).join("|").replace(/^/u, "|").replace(/$/u, "|"));
  }
  await writeFile(join(CALIBRATION, "selection-review.md"), `${reviewLines.join("\n")}\n`);
  return { shardCount: shards.length, calibrationCaseCount: groups.length };
}

async function main(): Promise<void> {
  await mkdir(PACKETS, { recursive: true });
  await mkdir(CALIBRATION, { recursive: true });
  const banks = await loadBanks();
  const bankSnapshotSha256 = snapshotHash(banks);
  const auditBanks = banks.map(({ bank, filename }) => ({ bank, file: filename }));
  const findings = findStageReferenceFindings(auditBanks, { strict: true });
  const targetFindings = findings.filter(
    (finding): finding is Extract<typeof finding, { kind: "revealsAllStages" }> =>
      finding.kind === "revealsAllStages",
  );
  const findingKeySet = new Set<string>();
  for (const finding of targetFindings) {
    const key = `${finding.file}|${finding.parentId}|${finding.partId}`;
    assert(!findingKeySet.has(key), `BLOCKED_POPULATION_RECONCILIATION duplicate ${key}`);
    findingKeySet.add(key);
  }

  const cases: BuiltCase[] = [];
  for (const loaded of banks) {
    for (const [caseIndex, question] of loaded.bank.questions.entries()) {
      if (question.itemType !== "case_study") continue;
      const caseFindings = targetFindings.filter(
        ({ file, parentId }) => file === loaded.filename && parentId === question.id,
      );
      if (caseFindings.length > 0) cases.push(buildCase(loaded, question, caseIndex, caseFindings));
    }
  }
  assert(
    cases.reduce((sum, builtCase) => sum + builtCase._populationRows.length, 0) === targetFindings.length,
    "BLOCKED_POPULATION_RECONCILIATION not every finding resolved to one live part",
  );

  const packets = packCases(cases, bankSnapshotSha256);
  const population: PopulationRow[] = [];
  let queueIndex = 1;
  for (const packet of packets) {
    for (const packetCase of packet.cases) {
      const builtCase = cases.find((candidate) =>
        candidate.bankPath === packetCase.bankPath &&
        candidate.parentCaseId === packetCase.parentCaseId);
      assert(builtCase, `BLOCKED_PACKET_RECONCILIATION missing built case ${packetCase.parentCaseId}`);
      for (const row of builtCase._populationRows) {
        population.push({ queueIndex, ...row, packetId: packet.packetId });
        queueIndex += 1;
      }
    }
  }
  assert(population.length === targetFindings.length, "BLOCKED_PACKET_RECONCILIATION target mismatch");
  assert(new Set(population.map(({ queueIndex: index }) => index)).size === population.length,
    "BLOCKED_PACKET_RECONCILIATION duplicate queue index");
  for (const packet of packets) {
    assert(
      packet.oversizedSingleCase || (packet.targetCount <= MAX_TARGETS && utf8Bytes(packet) <= MAX_BYTES),
      `BLOCKED_PACKET_RECONCILIATION packet limit exceeded: ${packet.packetId}`,
    );
    assert(
      new Set(packet.evidenceCatalog.map(({ evidenceId }) => evidenceId)).size === packet.evidenceCatalog.length,
      `BLOCKED_EVIDENCE_PROJECTION_FAILURE duplicate evidence ID in ${packet.packetId}`,
    );
  }
  if (process.argv.includes("--self-test-calibration")) {
    selfTestCalibrationLayer(population, packets, bankSnapshotSha256);
    return;
  }

  const packetManifest = {
    manifestVersion: "1.0",
    bankSnapshotSha256,
    bankFiles: banks.map(({ bankPath, sha256: hash }) => ({ bankPath, sha256: hash })),
    targetCount: population.length,
    parentCaseCount: cases.length,
    packetCount: packets.length,
    limits: { targetParts: MAX_TARGETS, utf8Bytes: MAX_BYTES },
    packets: packets.map((packet) => ({
      packetId: packet.packetId,
      path: `packets/${packet.packetId}.json`,
      targetCount: packet.targetCount,
      parentCaseCount: packet.cases.length,
      utf8Bytes: utf8Bytes(packet),
      sha256: sha256(compact(packet)),
      oversizedSingleCase: packet.oversizedSingleCase,
      queueIndices: population
        .filter(({ packetId }) => packetId === packet.packetId)
        .map(({ queueIndex: index }) => index),
    })),
  };
  const summary = {
    populationVersion: "1.0",
    bankSnapshotSha256,
    targetCount: population.length,
    parentCaseCount: cases.length,
    bankCount: banks.length,
    countsByBank: Object.fromEntries(banks.map(({ bankPath }) => [
      bankPath,
      population.filter((row) => row.bankPath === bankPath).length,
    ])),
    countsByItemType: Object.fromEntries(
      [...new Set(population.map(({ itemType }) => itemType))].sort().map((itemType) => [
        itemType,
        population.filter((row) => row.itemType === itemType).length,
      ]),
    ),
    anchorStateCounts: {
      bothAbsent: population.filter(({ anchorState }) =>
        anchorState.answerableAfterStageId.status === "absent" &&
        anchorState.stageId.status === "absent").length,
      includesUnresolved: population.filter(({ anchorState }) =>
        anchorState.answerableAfterStageId.status === "unresolved" ||
        anchorState.stageId.status === "unresolved").length,
    },
  };

  await writeFile(join(OUT, "population.jsonl"), `${population.map(compact).join("\n")}\n`);
  await writeFile(join(OUT, "population-summary.json"), pretty(summary));
  await writeFile(join(OUT, "packet-manifest.json"), pretty(packetManifest));
  for (const packet of packets) {
    await writeFile(join(PACKETS, `${packet.packetId}.json`), compact(packet));
  }

  const selectionPath = join(CALIBRATION, "selection-manifest.json");
  let selection: ArchitectSelection[] | undefined;
  try {
    const manifest = JSON.parse(await readFile(selectionPath, "utf8")) as ArchitectSelectionManifest;
    selection = validateArchitectSelection(manifest, population, bankSnapshotSha256);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const calibration = selection
    ? await writeCalibrationArtifacts(selection, population, packets, bankSnapshotSha256)
    : undefined;

  console.log(JSON.stringify({
    status: selection
      ? "STAGE_A_ARTIFACTS_AND_CALIBRATION_SHARDS_BUILT"
      : "STAGE_A_PACKETS_BUILT_CALIBRATION_SELECTION_REQUIRED",
    root: relative(ROOT, OUT),
    bankSnapshotSha256,
    targetCount: population.length,
    parentCaseCount: cases.length,
    packetCount: packets.length,
    calibrationTargetCount: selection?.length ?? 0,
    calibrationCaseCount: calibration?.calibrationCaseCount ?? 0,
    calibrationShardCount: calibration?.shardCount ?? 0,
  }, null, 2));
}

await main();
