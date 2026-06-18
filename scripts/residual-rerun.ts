import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CANONICAL_TOPIC_LIST,
  CANONICAL_TOPICS,
  SHARED_TOPIC_CATEGORY,
  STRICT_TOPIC_CATEGORY,
  TOPIC_CATEGORY_ORDER,
  TOPICS,
} from "../src/topics";
import type {
  BowtieQuestion,
  Category,
  DropdownClozeQuestion,
  FillInBlankQuestion,
  HighlightQuestion,
  MatrixQuestion,
  OptionQuestion,
  Question,
  StandaloneQuestion,
} from "../src/types";

type SourceTag =
  | "original-unresolved"
  | "original-blocked-cross-category"
  | "reclaim-unresolved"
  | "reclaim-blocked-cross-category"
  | "reclaim-proposed";

type PriorProposal = {
  source: SourceTag;
  status: string;
  category: string | null;
  topic: string | null;
};

type ScopeRow = {
  id: string;
  sourceTags: SourceTag[];
  priorProposals: PriorProposal[];
};

type BankRecord = {
  id: string;
  bankFile: string;
  path: string;
  parentId: string | null;
  parentTitle: string | null;
  parentCategory: Category | null;
  question: StandaloneQuestion;
  recordHash: string;
};

type ScopedContext = {
  stem: string;
  correctAnswerText: string;
  rationale: string;
  parentTitle?: string;
};

type DecisionType = "topic_only" | "category_and_topic" | "vocabulary_gap" | "abstain";
type FinalStatus = "proposed" | "carried-forward" | "unresolved" | "vocabulary_gap" | "not-found" | "ambiguous";

type DecisionRecord = {
  id: string;
  decisionType: DecisionType;
  proposedCategory?: string;
  proposedTopic?: string;
  reason: string;
  vocabularyChange?: string;
};

type DecisionsArtifact = {
  meta?: {
    provider?: string;
    model?: string;
    temperature?: number;
    promptHash?: string;
  };
  records?: unknown[];
};

type ManifestRow = {
  id: string;
  status: FinalStatus;
  decisionType: DecisionType | "not_found" | "ambiguous";
  sourceTags: SourceTag[];
  sourceBank: string | null;
  path: string | null;
  parentId: string | null;
  itemType: string | null;
  currentCategory: string | null;
  currentTopic: string | null;
  proposedCategory: string | null;
  proposedTopic: string | null;
  priorProposals: PriorProposal[];
  candidateSet: string[];
  scopedContextHash: string | null;
  reason: string;
  validationErrors: string[];
  diffPreview: Array<{ path: string; before: string; after: string }>;
};

type Manifest = {
  meta: {
    generatedAt: string;
    runDate: string;
    mode: "dry-run";
    canonicalBankWrites: false;
    topicsWrites: false;
    schemaVersion: "residual-rerun-v1";
    classifier: {
      provider: string;
      model: string;
      temperature: number;
      promptHash: string;
    };
    topicsSourceHash: string;
    banksSourceHash: string;
    inputManifestHashes: Record<string, string>;
    scopeCounts: Record<string, number>;
  };
  records: ManifestRow[];
};

type AdjudicationInput = {
  meta: {
    generatedAt: string;
    runDate: string;
    schemaVersion: "residual-rerun-adjudication-input-v1";
    topicsSourceHash: string;
    banksSourceHash: string;
    inputManifestHashes: Record<string, string>;
    scopeCounts: Record<string, number>;
    instructions: string[];
  };
  records: Array<{
    id: string;
    currentCategory: Category;
    candidateSet: string[];
    fullCanonicalTopics: string[];
    scopedContext: ScopedContext;
    scopedContextHash: string;
    expectedOutput: {
      decisionType: "topic_only | category_and_topic | vocabulary_gap | abstain";
      proposedCategory: "current category for topic_only, corrected category for category_and_topic, omitted otherwise";
      proposedTopic: "canonical topic for topic_only/category_and_topic, omitted otherwise";
      reason: "one concise sentence";
      vocabularyChange: "only for vocabulary_gap";
    };
  }>;
};

const ORIGINAL_MANIFEST = "audit/topic-residual-proposals-2026-06-17.manifest.json";
const RECLAIM_MANIFEST = "audit/residual-reclaim-children-2026-06-17.manifest.json";
const S01_DRY_RUN = "audit/residual-s01-adjudication-2026-06-17.dry-run.json";
const EXECUTION_MANIFEST = "audit/topic-residual-proposals-2026-06-17.execution-manifest.json";

const MONITORED_PATHS = [
  "src/topics.ts",
  "banks/*.json",
  ORIGINAL_MANIFEST,
  RECLAIM_MANIFEST,
  S01_DRY_RUN,
  EXECUTION_MANIFEST,
];

const STATUS_ORDER: Record<FinalStatus, number> = {
  proposed: 0,
  "carried-forward": 1,
  vocabulary_gap: 2,
  unresolved: 3,
  "not-found": 4,
  ambiguous: 5,
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hashText = (text: string): string => createHash("sha256").update(text).digest("hex");
const hashJson = (value: unknown): string => hashText(JSON.stringify(value));

const readText = (path: string): Promise<string> => readFile(path, "utf8");
const readJson = async (path: string): Promise<unknown> => JSON.parse(await readText(path));

const oneLine = (value: string, maxLength = 260): string => {
  const collapsed = value.replace(/\s+/g, " ").trim();
  return collapsed.length <= maxLength ? collapsed : `${collapsed.slice(0, maxLength - 1)}...`;
};

const escapeCell = (value: unknown): string =>
  String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, "<br>");

const isCategory = (value: unknown): value is Category =>
  typeof value === "string" && TOPIC_CATEGORY_ORDER.includes(value as Category);

export const assertCleanMonitoredInputs = (cwd = process.cwd(), paths = MONITORED_PATHS): void => {
  const output = execFileSync(
    "git",
    ["status", "--porcelain", "--untracked-files=all", "--", ...paths],
    { cwd, encoding: "utf8" },
  ).trim();
  if (!output) return;
  throw new Error(
    [
      "Refusing to run residual rerun against dirty monitored inputs.",
      "Clean or reset to the intended post-S01 base before classification.",
      "",
      output,
    ].join("\n"),
  );
};

export const assertPostS01Topics = (): void => {
  const maternal = SHARED_TOPIC_CATEGORY[TOPICS.MATERNAL_NEWBORN] ?? [];
  const oncology = SHARED_TOPIC_CATEGORY[TOPICS.ONCOLOGY_IMMUNOTHERAPY_COMPLICATIONS] ?? [];
  const woundStrict = STRICT_TOPIC_CATEGORY["Basic Care and Comfort"].includes(TOPICS.SKIN_WOUND_CARE);
  const woundShared = Object.hasOwn(SHARED_TOPIC_CATEGORY, TOPICS.SKIN_WOUND_CARE);

  const missing: string[] = [];
  for (const category of [
    "Health Promotion and Maintenance",
    "Reduction of Risk Potential",
    "Physiological Adaptation",
  ] as const) {
    if (!maternal.includes(category)) missing.push(`Maternal-Newborn Care & Teaching lacks ${category}`);
  }
  for (const category of ["Physiological Adaptation", "Reduction of Risk Potential"] as const) {
    if (!oncology.includes(category)) missing.push(`Oncology & Immunotherapy Complications lacks ${category}`);
  }
  if (!CANONICAL_TOPICS.has(TOPICS.SKIN_WOUND_CARE)) missing.push("Skin & Wound Care topic is absent");
  if (!woundStrict || woundShared) missing.push("Skin & Wound Care must be strict-only Basic Care and Comfort");
  if (missing.length > 0) throw new Error(`topics.ts does not satisfy post-S01 preconditions:\n- ${missing.join("\n- ")}`);
};

const candidateSetForCategory = (category: Category): string[] => {
  const shared = Object.entries(SHARED_TOPIC_CATEGORY)
    .filter(([, categories]) => categories.includes(category))
    .map(([topic]) => topic);
  return [...STRICT_TOPIC_CATEGORY[category], ...shared];
};

const optionTextById = (question: OptionQuestion, ids: string[]): string[] => {
  const options = new Map(question.options.map((option) => [option.id, option.en]));
  return ids.map((id) => options.get(id) ?? `[missing option ${id}]`);
};

const correctAnswerText = (question: StandaloneQuestion): string => {
  if (
    question.itemType === "multiple_choice" ||
    question.itemType === "select_all" ||
    question.itemType === "ordered_response"
  ) {
    const text = optionTextById(question, question.correct);
    return question.itemType === "ordered_response"
      ? text.map((entry, index) => `${index + 1}. ${entry}`).join("; ")
      : text.join("; ");
  }
  if (question.itemType === "fill_in_blank") {
    return (question as FillInBlankQuestion).blanks
      .map((blank) => {
        if (blank.numeric) {
          const unit = blank.numeric.unit ? ` ${blank.numeric.unit}` : "";
          return `${blank.id}: ${blank.numeric.value}${unit} (tolerance ${blank.numeric.tolerance})`;
        }
        return `${blank.id}: ${(blank.acceptable ?? []).join(" / ")}`;
      })
      .join("; ");
  }
  if (question.itemType === "matrix") {
    const matrix = question as MatrixQuestion;
    const rows = new Map(matrix.matrix.rows.map((row) => [row.id, row.en]));
    const columns = new Map(matrix.matrix.columns.map((column) => [column.id, column.en]));
    return matrix.correct
      .map((entry) => `${rows.get(entry.rowId) ?? entry.rowId}: ${entry.columnIds.map((id) => columns.get(id) ?? id).join(", ")}`)
      .join("; ");
  }
  if (question.itemType === "dropdown_cloze") {
    return (question as DropdownClozeQuestion).dropdowns
      .map((dropdown) => {
        const option = dropdown.options.find((candidate) => candidate.id === dropdown.correct);
        return `${dropdown.id}: ${option?.en ?? dropdown.correct}`;
      })
      .join("; ");
  }
  if (question.itemType === "highlight") {
    const highlight = question as HighlightQuestion;
    const segments = new Map(highlight.highlight.segments.map((segment) => [segment.id, segment.en]));
    return highlight.highlight.correct.map((id) => segments.get(id) ?? id).join("; ");
  }
  const bowtie = question as BowtieQuestion;
  const tokenText = (zone: keyof BowtieQuestion["bowtie"], ids: string[]) => {
    const tokens = new Map(bowtie.bowtie[zone].tokens.map((token) => [token.id, token.en]));
    return ids.map((id) => tokens.get(id) ?? id).join(", ");
  };
  return [
    `condition: ${tokenText("condition", [bowtie.bowtie.condition.correct])}`,
    `actions: ${tokenText("actions", bowtie.bowtie.actions.correct)}`,
    `parameters: ${tokenText("parameters", bowtie.bowtie.parameters.correct)}`,
  ].join("; ");
};

const scopedContextFor = (record: BankRecord): ScopedContext => ({
  stem: record.question.stem.en,
  correctAnswerText: correctAnswerText(record.question),
  rationale: record.question.rationale.correct.en,
  ...(record.parentTitle ? { parentTitle: record.parentTitle } : {}),
});

const collectCanonicalRecords = async (banksDir: string): Promise<{ recordsById: Map<string, BankRecord[]>; banksSourceHash: string }> => {
  const files = (await readdir(banksDir)).filter((file) => file.endsWith("-canonical.json")).sort();
  const recordsById = new Map<string, BankRecord[]>();
  const hash = createHash("sha256");

  const addRecord = (record: BankRecord) => {
    const existing = recordsById.get(record.id) ?? [];
    existing.push(record);
    recordsById.set(record.id, existing);
  };

  for (const file of files) {
    const path = join(banksDir, file);
    const text = await readText(path);
    hash.update(file).update("\0").update(text).update("\0");
    const bank = JSON.parse(text) as { questions?: Question[] };
    for (const [questionIndex, question] of (bank.questions ?? []).entries()) {
      if (question.itemType === "case_study") {
        const parentTitle = oneLine(question.caseStudy.title.en, 160);
        for (const [childIndex, child] of question.caseStudy.questions.entries()) {
          addRecord({
            id: child.id,
            bankFile: file,
            path: `questions.${questionIndex}.caseStudy.questions.${childIndex}`,
            parentId: question.id,
            parentTitle,
            parentCategory: question.category,
            question: child,
            recordHash: hashJson(child),
          });
        }
      } else {
        addRecord({
          id: question.id,
          bankFile: file,
          path: `questions.${questionIndex}`,
          parentId: null,
          parentTitle: null,
          parentCategory: null,
          question,
          recordHash: hashJson(question),
        });
      }
    }
  }

  return { recordsById, banksSourceHash: hash.digest("hex") };
};

const manifestRecords = (raw: unknown): Record<string, unknown>[] => {
  if (!isObject(raw) || !Array.isArray(raw.records)) throw new Error("Manifest must have records array.");
  return raw.records.filter(isObject);
};

const s01Ids = (raw: unknown): Set<string> => {
  if (!isObject(raw) || !Array.isArray(raw.rows)) throw new Error("S01 dry-run must have rows array.");
  return new Set(raw.rows.filter(isObject).map((row) => row.id).filter((id): id is string => typeof id === "string"));
};

const executionIds = (raw: unknown): Set<string> => {
  if (!isObject(raw) || !Array.isArray(raw.updates)) return new Set();
  return new Set(raw.updates.filter(isObject).map((row) => row.id).filter((id): id is string => typeof id === "string"));
};

const addScopeRow = (rows: Map<string, ScopeRow>, raw: Record<string, unknown>, source: SourceTag) => {
  const id = raw.id;
  if (typeof id !== "string" || id.trim() === "") throw new Error(`Scope source ${source} has a row without id.`);
  const row = rows.get(id) ?? { id, sourceTags: [], priorProposals: [] };
  if (!row.sourceTags.includes(source)) row.sourceTags.push(source);
  row.priorProposals.push({
    source,
    status: typeof raw.status === "string" ? raw.status : "",
    category: typeof raw.canonicalCategory === "string" ? raw.canonicalCategory : null,
    topic: typeof raw.proposedTopic === "string" ? raw.proposedTopic : null,
  });
  rows.set(id, row);
};

export const buildScopeRows = (options: {
  originalManifest: unknown;
  reclaimManifest: unknown;
  s01DryRun: unknown;
  executionManifest: unknown;
}): { rows: ScopeRow[]; counts: Record<string, number> } => {
  const rows = new Map<string, ScopeRow>();
  const settled = new Set([...s01Ids(options.s01DryRun), ...executionIds(options.executionManifest)]);
  const counts: Record<string, number> = {
    original_unresolved_source_rows: 0,
    original_blocked_source_rows: 0,
    reclaim_unresolved_source_rows: 0,
    reclaim_blocked_source_rows: 0,
    reclaim_proposed_source_rows: 0,
    excluded_settled_rows: 0,
  };

  for (const row of manifestRecords(options.originalManifest)) {
    if (row.status === "unresolved") {
      counts.original_unresolved_source_rows += 1;
      if (typeof row.id === "string" && settled.has(row.id)) counts.excluded_settled_rows += 1;
      else addScopeRow(rows, row, "original-unresolved");
    }
    if (row.status === "blocked-cross-category") {
      counts.original_blocked_source_rows += 1;
      if (typeof row.id === "string" && settled.has(row.id)) counts.excluded_settled_rows += 1;
      else addScopeRow(rows, row, "original-blocked-cross-category");
    }
  }

  for (const row of manifestRecords(options.reclaimManifest)) {
    if (row.status === "unresolved") {
      counts.reclaim_unresolved_source_rows += 1;
      if (typeof row.id === "string" && settled.has(row.id)) counts.excluded_settled_rows += 1;
      else addScopeRow(rows, row, "reclaim-unresolved");
    }
    if (row.status === "blocked-cross-category") {
      counts.reclaim_blocked_source_rows += 1;
      if (typeof row.id === "string" && settled.has(row.id)) counts.excluded_settled_rows += 1;
      else addScopeRow(rows, row, "reclaim-blocked-cross-category");
    }
    if (row.status === "proposed") {
      counts.reclaim_proposed_source_rows += 1;
      if (typeof row.id === "string" && settled.has(row.id)) counts.excluded_settled_rows += 1;
      else addScopeRow(rows, row, "reclaim-proposed");
    }
  }

  counts.unique_run_rows = rows.size;
  return { rows: [...rows.values()].sort((left, right) => left.id.localeCompare(right.id)), counts };
};

const parseDecisions = (raw: unknown): {
  provider: string;
  model: string;
  temperature: number;
  promptHash: string;
  records: DecisionRecord[];
} => {
  const artifact = (isObject(raw) ? raw : { records: raw }) as DecisionsArtifact;
  const provider = artifact.meta?.provider;
  const model = artifact.meta?.model;
  const temperature = artifact.meta?.temperature;
  const promptHash = artifact.meta?.promptHash;
  if (typeof provider !== "string" || provider.trim() === "") throw new Error("Decisions require meta.provider.");
  if (typeof model !== "string" || model.trim() === "") throw new Error("Decisions require meta.model.");
  if (/gemini/i.test(`${provider} ${model}`)) throw new Error(`Classifier must be non-Gemini; received ${provider}/${model}.`);
  if (temperature !== 0) throw new Error("Decisions require meta.temperature: 0.");
  if (typeof promptHash !== "string" || promptHash.trim() === "") throw new Error("Decisions require meta.promptHash.");
  if (!Array.isArray(artifact.records)) throw new Error("Decisions require records array.");

  const records = artifact.records.map((entry, index): DecisionRecord => {
    if (!isObject(entry)) throw new Error(`Decision ${index + 1} must be an object.`);
    const { id, decisionType, proposedCategory, proposedTopic, reason, vocabularyChange } = entry;
    if (typeof id !== "string" || id.trim() === "") throw new Error(`Decision ${index + 1} requires id.`);
    if (
      decisionType !== "topic_only" &&
      decisionType !== "category_and_topic" &&
      decisionType !== "vocabulary_gap" &&
      decisionType !== "abstain"
    ) {
      throw new Error(`Decision ${id} has invalid decisionType.`);
    }
    if (typeof reason !== "string" || reason.trim() === "") throw new Error(`Decision ${id} requires reason.`);
    return {
      id,
      decisionType,
      proposedCategory: typeof proposedCategory === "string" ? proposedCategory : undefined,
      proposedTopic: typeof proposedTopic === "string" ? proposedTopic : undefined,
      reason: oneLine(reason),
      vocabularyChange: typeof vocabularyChange === "string" ? oneLine(vocabularyChange, 360) : undefined,
    };
  });
  return { provider, model, temperature, promptHash, records };
};

const validateDecision = (scope: ScopeRow, bankRecord: BankRecord | null, decision: DecisionRecord | null): ManifestRow => {
  if (!bankRecord) {
    return {
      id: scope.id,
      status: "not-found",
      decisionType: "not_found",
      sourceTags: scope.sourceTags,
      sourceBank: null,
      path: null,
      parentId: null,
      itemType: null,
      currentCategory: null,
      currentTopic: null,
      proposedCategory: null,
      proposedTopic: null,
      priorProposals: scope.priorProposals,
      candidateSet: [],
      scopedContextHash: null,
      reason: "id not found in canonical banks",
      validationErrors: [],
      diffPreview: [],
    };
  }

  const currentCategory = bankRecord.question.category;
  const currentTopic = bankRecord.question.topic;
  const currentCandidateSet = candidateSetForCategory(currentCategory);
  const contextHash = hashJson(scopedContextFor(bankRecord));

  const base = {
    id: scope.id,
    sourceTags: scope.sourceTags,
    sourceBank: bankRecord.bankFile,
    path: bankRecord.path,
    parentId: bankRecord.parentId,
    itemType: bankRecord.question.itemType,
    currentCategory,
    currentTopic,
    priorProposals: scope.priorProposals,
    candidateSet: currentCandidateSet,
    scopedContextHash: contextHash,
  };

  if (!decision) {
    return {
      ...base,
      status: "unresolved",
      decisionType: "abstain",
      proposedCategory: null,
      proposedTopic: null,
      reason: "missing decision record",
      validationErrors: ["missing decision record"],
      diffPreview: [],
    };
  }

  const validationErrors: string[] = [];
  const proposedCategory = decision.decisionType === "category_and_topic" ? decision.proposedCategory : currentCategory;
  const proposedTopic = decision.proposedTopic ?? null;

  if (decision.decisionType === "abstain") {
    return {
      ...base,
      status: "unresolved",
      decisionType: "abstain",
      proposedCategory: null,
      proposedTopic: null,
      reason: decision.reason,
      validationErrors,
      diffPreview: [],
    };
  }

  if (decision.decisionType === "vocabulary_gap") {
    if (!decision.vocabularyChange) validationErrors.push("vocabulary_gap requires vocabularyChange");
    return {
      ...base,
      status: "vocabulary_gap",
      decisionType: "vocabulary_gap",
      proposedCategory: null,
      proposedTopic: null,
      reason: decision.vocabularyChange ? `${decision.reason} Proposed vocabulary change: ${decision.vocabularyChange}` : decision.reason,
      validationErrors,
      diffPreview: [],
    };
  }

  if (!proposedTopic) validationErrors.push(`${decision.decisionType} requires proposedTopic`);
  if (decision.decisionType === "topic_only") {
    if (decision.proposedCategory && decision.proposedCategory !== currentCategory) {
      validationErrors.push("topic_only may not change category");
    }
    if (proposedTopic && !currentCandidateSet.includes(proposedTopic)) {
      validationErrors.push("topic_only proposedTopic is not licensed for current category");
    }
  }

  if (decision.decisionType === "category_and_topic") {
    if (!isCategory(proposedCategory)) validationErrors.push("category_and_topic requires canonical proposedCategory");
    if (isCategory(proposedCategory) && proposedTopic && !candidateSetForCategory(proposedCategory).includes(proposedTopic)) {
      validationErrors.push("category_and_topic proposedTopic is not licensed for proposedCategory");
    }
  }

  if (proposedTopic && !CANONICAL_TOPICS.has(proposedTopic)) {
    validationErrors.push("proposedTopic is not canonical");
  }

  if (validationErrors.length > 0) {
    return {
      ...base,
      status: "unresolved",
      decisionType: "abstain",
      proposedCategory: null,
      proposedTopic: null,
      reason: `classifier-output-invalid: ${validationErrors.join("; ")}`,
      validationErrors,
      diffPreview: [],
    };
  }

  const finalCategory = proposedCategory as Category;
  const diffPreview: ManifestRow["diffPreview"] = [];
  if (finalCategory !== currentCategory) {
    diffPreview.push({ path: `banks/${bankRecord.bankFile}:${bankRecord.path}.category`, before: currentCategory, after: finalCategory });
  }
  if (proposedTopic !== currentTopic) {
    diffPreview.push({ path: `banks/${bankRecord.bankFile}:${bankRecord.path}.topic`, before: currentTopic, after: proposedTopic! });
  }

  const carried = scope.priorProposals.some(
    (prior) => prior.topic === proposedTopic && (prior.category === null || prior.category === finalCategory),
  );

  return {
    ...base,
    status: carried ? "carried-forward" : "proposed",
    decisionType: decision.decisionType,
    proposedCategory: finalCategory,
    proposedTopic,
    reason: decision.reason,
    validationErrors,
    diffPreview,
  };
};

const countBy = <T>(items: T[], keyFn: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) counts[keyFn(item)] = (counts[keyFn(item)] ?? 0) + 1;
  return counts;
};

const formatCounts = (counts: Record<string, number>): string[] =>
  Object.entries(counts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([key, count]) => `- ${key}: ${count}`);

const s01ImpactBucket = (row: ManifestRow): string => {
  if (!row.proposedTopic || !row.proposedCategory) return "not applicable";
  if (row.proposedTopic === TOPICS.MATERNAL_NEWBORN) return "maternal shared licensing";
  if (row.proposedTopic === TOPICS.SKIN_WOUND_CARE) return "Skin & Wound Care";
  if (row.proposedTopic === TOPICS.ONCOLOGY_IMMUNOTHERAPY_COMPLICATIONS) return "Oncology & Immunotherapy Complications";
  return "resolved with no S01-dependent change";
};

const formatReport = (manifest: Manifest): string => {
  const records = manifest.records;
  const statusCounts = countBy(records, (record) => record.status);
  const decisionCounts = countBy(records, (record) => record.decisionType);
  const appliedEligible = records.filter((record) => record.status === "proposed" || record.status === "carried-forward");
  const topicCounts = countBy(appliedEligible, (record) => record.proposedTopic ?? "none");
  const woundRecats = appliedEligible.filter(
    (record) =>
      record.proposedTopic === TOPICS.SKIN_WOUND_CARE &&
      record.currentCategory !== "Basic Care and Comfort" &&
      record.proposedCategory === "Basic Care and Comfort",
  );
  const vocabRows = records.filter((record) => record.status === "vocabulary_gap");
  const impactCounts = countBy(appliedEligible, s01ImpactBucket);
  const lines = [
    "# Consolidated Residual Re-Run Dry Run",
    "",
    `Generated: ${manifest.meta.generatedAt}`,
    `Classifier: ${manifest.meta.classifier.provider}/${manifest.meta.classifier.model}`,
    "Mode: dry-run only",
    "Canonical bank writes: none",
    "Topic vocabulary writes: none",
    "",
    "## Vocabulary/Licensing Changes Proposed",
    "",
    ...(vocabRows.length > 0
      ? vocabRows.map((row) => `- \`${row.id}\`: ${row.reason}`)
      : ["- none"]),
    "",
    "## Safety Summary",
    "",
    ...formatCounts(statusCounts),
    "",
    "Decision types:",
    ...formatCounts(decisionCounts),
    "",
  ];

  if ((statusCounts.unresolved ?? 0) === 0) {
    lines.push("**OVERMATCH FAILURE: unresolved == 0. Treat this run as invalid until reviewed.**", "");
  }

  lines.push("## Scope Membership", "", "| Source tag | Rows |", "|---|---:|");
  for (const [key, value] of Object.entries(manifest.meta.scopeCounts).sort()) {
    lines.push(`| ${escapeCell(key)} | ${value} |`);
  }
  lines.push("");

  lines.push("## S01-Impact Table", "", "| Bucket | Rows |", "|---|---:|");
  for (const [bucket, count] of Object.entries(impactCounts).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))) {
    lines.push(`| ${escapeCell(bucket)} | ${count} |`);
  }
  if (Object.keys(impactCounts).length === 0) lines.push("| none | 0 |");
  lines.push("");

  lines.push("## Dominance + Category Integrity", "", "| Proposed topic | Count | Flags |", "|---|---:|---|");
  for (const [topic, count] of Object.entries(topicCounts).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))) {
    const flags: string[] = [];
    if (appliedEligible.length > 0 && count / appliedEligible.length >= 0.2) flags.push("global >=20%");
    for (const category of TOPIC_CATEGORY_ORDER) {
      const categoryRows = appliedEligible.filter((record) => record.proposedCategory === category);
      const categoryCount = categoryRows.filter((record) => record.proposedTopic === topic).length;
      if (categoryRows.length > 0 && categoryCount / categoryRows.length >= 0.35) flags.push(`${category} >=35%`);
    }
    lines.push(`| ${escapeCell(topic)} | ${count} | ${escapeCell(flags.join("; "))} |`);
  }
  if (Object.keys(topicCounts).length === 0) lines.push("| none | 0 | |");
  lines.push("");

  lines.push(
    "## Wound-Licensing Watch",
    "",
    `Wound rows requiring recategorization to Basic Care and Comfort solely to reach Skin & Wound Care: ${woundRecats.length}`,
    woundRecats.length > 0
      ? "If this count is non-trivial, consider sharing Skin & Wound Care across BCC + RRP + Safety before applying category moves."
      : "No wound recategorization pressure detected.",
    "",
  );

  lines.push("## Row Plan", "");
  for (const decisionType of ["topic_only", "category_and_topic", "vocabulary_gap", "abstain", "not_found", "ambiguous"]) {
    const rows = records
      .filter((record) => record.decisionType === decisionType)
      .sort((left, right) =>
        STATUS_ORDER[left.status] - STATUS_ORDER[right.status] ||
        (left.proposedCategory ?? "").localeCompare(right.proposedCategory ?? "") ||
        (left.proposedTopic ?? "").localeCompare(right.proposedTopic ?? "") ||
        (left.currentTopic ?? "").localeCompare(right.currentTopic ?? "") ||
        left.id.localeCompare(right.id),
      );
    if (rows.length === 0) continue;
    lines.push(`### ${decisionType}`, "", "| Status | Current category | Current topic | Proposed category | Proposed topic | Sources | ID | Reason |");
    lines.push("|---|---|---|---|---|---|---|---|");
    for (const row of rows) {
      lines.push(
        `| ${row.status} | ${escapeCell(row.currentCategory)} | ${escapeCell(row.currentTopic)} | ${escapeCell(row.proposedCategory)} | ${escapeCell(row.proposedTopic)} | ${escapeCell(row.sourceTags.join(", "))} | \`${escapeCell(row.id)}\` | ${escapeCell(row.reason)} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Exact Before/After Diff Preview", "");
  for (const row of appliedEligible.filter((record) => record.diffPreview.length > 0).sort((left, right) => left.id.localeCompare(right.id))) {
    lines.push(`### ${row.id}`, "");
    for (const diff of row.diffPreview) lines.push(`- ${diff.path}: \`${escapeCell(diff.before)}\` -> \`${escapeCell(diff.after)}\``);
    lines.push("");
  }
  if (!appliedEligible.some((record) => record.diffPreview.length > 0)) lines.push("No field changes proposed.", "");

  lines.push("## Stop Gate", "", "No changes have been applied. Apply only after Luke approves this exact dry-run.", "");
  return `${lines.join("\n")}\n`;
};

const runDate = (now = new Date()): string => now.toISOString().slice(0, 10);

export const createDryRun = async (options: {
  banksDir: string;
  decisionsFile: string;
  manifestPath: string;
  reportPath: string;
  generatedAt: string;
  runDate: string;
}): Promise<Manifest> => {
  assertCleanMonitoredInputs();
  assertPostS01Topics();

  const [
    originalText,
    reclaimText,
    s01Text,
    executionText,
    topicsText,
    decisionsRaw,
    canonical,
  ] = await Promise.all([
    readText(ORIGINAL_MANIFEST),
    readText(RECLAIM_MANIFEST),
    readText(S01_DRY_RUN),
    readText(EXECUTION_MANIFEST),
    readText("src/topics.ts"),
    readJson(options.decisionsFile),
    collectCanonicalRecords(options.banksDir),
  ]);

  const scope = buildScopeRows({
    originalManifest: JSON.parse(originalText),
    reclaimManifest: JSON.parse(reclaimText),
    s01DryRun: JSON.parse(s01Text),
    executionManifest: JSON.parse(executionText),
  });
  const decisions = parseDecisions(decisionsRaw);
  const decisionById = new Map<string, DecisionRecord>();
  for (const decision of decisions.records) {
    if (decisionById.has(decision.id)) throw new Error(`Duplicate decision for ${decision.id}.`);
    decisionById.set(decision.id, decision);
  }

  const rows = scope.rows.map((scopeRow) => {
    const matches = canonical.recordsById.get(scopeRow.id) ?? [];
    const uniqueRecords = new Map(matches.map((record) => [`${record.bankFile}:${record.path}:${record.recordHash}`, record]));
    if (uniqueRecords.size > 1) {
      return {
        id: scopeRow.id,
        status: "ambiguous" as const,
        decisionType: "ambiguous" as const,
        sourceTags: scopeRow.sourceTags,
        sourceBank: null,
        path: null,
        parentId: null,
        itemType: null,
        currentCategory: null,
        currentTopic: null,
        proposedCategory: null,
        proposedTopic: null,
        priorProposals: scopeRow.priorProposals,
        candidateSet: [],
        scopedContextHash: null,
        reason: "id resolves to multiple canonical records",
        validationErrors: ["ambiguous canonical id"],
        diffPreview: [],
      };
    }
    return validateDecision(scopeRow, matches[0] ?? null, decisionById.get(scopeRow.id) ?? null);
  });

  const ambiguousRows = rows.filter((row) => row.status === "ambiguous");
  if (ambiguousRows.length > 0) {
    throw new Error(
      `True ambiguity: ${ambiguousRows.length} id(s) resolve to multiple canonical records. First: ${ambiguousRows
        .slice(0, 10)
        .map((row) => row.id)
        .join(", ")}`,
    );
  }

  if ((countBy(rows, (row) => row.status).unresolved ?? 0) === 0) {
    throw new Error("Overmatch failure: unresolved == 0. Refusing to write dry-run artifacts.");
  }

  const manifest: Manifest = {
    meta: {
      generatedAt: options.generatedAt,
      runDate: options.runDate,
      mode: "dry-run",
      canonicalBankWrites: false,
      topicsWrites: false,
      schemaVersion: "residual-rerun-v1",
      classifier: {
        provider: decisions.provider,
        model: decisions.model,
        temperature: decisions.temperature,
        promptHash: decisions.promptHash,
      },
      topicsSourceHash: hashText(topicsText),
      banksSourceHash: canonical.banksSourceHash,
      inputManifestHashes: {
        [ORIGINAL_MANIFEST]: hashText(originalText),
        [RECLAIM_MANIFEST]: hashText(reclaimText),
        [S01_DRY_RUN]: hashText(s01Text),
        [EXECUTION_MANIFEST]: hashText(executionText),
      },
      scopeCounts: scope.counts,
    },
    records: rows,
  };

  await mkdir("audit", { recursive: true });
  await writeFile(options.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(options.reportPath, formatReport(manifest));
  return manifest;
};

export const emitAdjudicationInput = async (options: {
  banksDir: string;
  outputPath: string;
  generatedAt: string;
  runDate: string;
}): Promise<AdjudicationInput> => {
  assertCleanMonitoredInputs();
  assertPostS01Topics();

  const [originalText, reclaimText, s01Text, executionText, topicsText, canonical] = await Promise.all([
    readText(ORIGINAL_MANIFEST),
    readText(RECLAIM_MANIFEST),
    readText(S01_DRY_RUN),
    readText(EXECUTION_MANIFEST),
    readText("src/topics.ts"),
    collectCanonicalRecords(options.banksDir),
  ]);
  const scope = buildScopeRows({
    originalManifest: JSON.parse(originalText),
    reclaimManifest: JSON.parse(reclaimText),
    s01DryRun: JSON.parse(s01Text),
    executionManifest: JSON.parse(executionText),
  });

  const records = scope.rows.flatMap((scopeRow) => {
    const matches = canonical.recordsById.get(scopeRow.id) ?? [];
    const uniqueRecords = new Map(matches.map((record) => [`${record.bankFile}:${record.path}:${record.recordHash}`, record]));
    if (uniqueRecords.size !== 1) return [];
    const record = matches[0];
    const scopedContext = scopedContextFor(record);
    return [
      {
        id: scopeRow.id,
        currentCategory: record.question.category,
        candidateSet: candidateSetForCategory(record.question.category),
        fullCanonicalTopics: [...CANONICAL_TOPIC_LIST],
        scopedContext,
        scopedContextHash: hashJson(scopedContext),
        expectedOutput: {
          decisionType: "topic_only | category_and_topic | vocabulary_gap | abstain" as const,
          proposedCategory: "current category for topic_only, corrected category for category_and_topic, omitted otherwise" as const,
          proposedTopic: "canonical topic for topic_only/category_and_topic, omitted otherwise" as const,
          reason: "one concise sentence" as const,
          vocabularyChange: "only for vocabulary_gap" as const,
        },
      },
    ];
  });

  const artifact: AdjudicationInput = {
    meta: {
      generatedAt: options.generatedAt,
      runDate: options.runDate,
      schemaVersion: "residual-rerun-adjudication-input-v1",
      topicsSourceHash: hashText(topicsText),
      banksSourceHash: canonical.banksSourceHash,
      inputManifestHashes: {
        [ORIGINAL_MANIFEST]: hashText(originalText),
        [RECLAIM_MANIFEST]: hashText(reclaimText),
        [S01_DRY_RUN]: hashText(s01Text),
        [EXECUTION_MANIFEST]: hashText(executionText),
      },
      scopeCounts: scope.counts,
      instructions: [
        "Classify each record using only currentCategory, candidateSet, fullCanonicalTopics, and scopedContext.",
        "Do not infer or use any old topic or prior proposal; those are intentionally omitted.",
        "Use topic_only only when a candidateSet topic fits the current category.",
        "Use category_and_topic only when the item is genuinely miscategorized; proposedTopic must be licensed for proposedCategory.",
        "Use vocabulary_gap when no canonical topic fits without a vocabulary/licensing change; do not apply the change.",
        "Use abstain when no fit is defensible.",
      ],
    },
    records,
  };
  await mkdir("audit", { recursive: true });
  await writeFile(options.outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
  return artifact;
};

const parseArgs = () => {
  const [command, ...rest] = process.argv.slice(2);
  const args = new Map<string, string | boolean>();
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = rest[index + 1];
    if (!next || next.startsWith("--")) args.set(key, true);
    else {
      args.set(key, next);
      index += 1;
    }
  }
  return { command, args };
};

const stringArg = (args: Map<string, string | boolean>, key: string, fallback?: string): string => {
  const value = args.get(key);
  if (typeof value === "string") return value;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing --${key}.`);
};

const main = async () => {
  const { command, args } = parseArgs();
  if (command !== "dry-run" && command !== "emit-input") {
    throw new Error(
      "Usage: tsx scripts/residual-rerun.ts emit-input [--date YYYY-MM-DD] OR dry-run --decisions audit/residual-rerun-decisions.json [--date YYYY-MM-DD]",
    );
  }
  const date = stringArg(args, "date", runDate());
  if (command === "emit-input") {
    const outputPath = stringArg(args, "out", `audit/residual-rerun-${date}.input.json`);
    const input = await emitAdjudicationInput({
      banksDir: "banks",
      outputPath,
      generatedAt: new Date().toISOString(),
      runDate: date,
    });
    console.log(`Wrote ${outputPath} with ${input.records.length} record(s).`);
    return;
  }
  const manifestPath = stringArg(args, "manifest-out", `audit/residual-rerun-${date}.manifest.json`);
  const reportPath = stringArg(args, "report-out", `audit/residual-rerun-${date}.dry-run.md`);
  const manifest = await createDryRun({
    banksDir: "banks",
    decisionsFile: stringArg(args, "decisions"),
    manifestPath,
    reportPath,
    generatedAt: new Date().toISOString(),
    runDate: date,
  });
  console.log(`Wrote ${manifestPath} and ${reportPath} with ${manifest.records.length} row(s).`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
