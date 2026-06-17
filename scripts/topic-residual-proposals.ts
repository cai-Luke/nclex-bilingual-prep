import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CANONICAL_TOPIC_LIST,
  CANONICAL_TOPICS,
  STRICT_TOPIC_CATEGORY,
  SHARED_TOPIC_CATEGORY,
  TOPIC_CATEGORY_ORDER,
  normalizeTopicKey,
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

type ResidualRow = {
  id: string;
  category?: string;
  oldTopic: string;
  context?: {
    stem?: string;
    correctOptionText?: string;
    rationale?: string;
    parentContext?: string;
  };
};

type HydratedContext = {
  sourceBank: string;
  parentId: string | null;
  itemType: StandaloneQuestion["itemType"];
  stem: string;
  correctAnswerText: string;
  rationale: string;
  parentTitle: string;
  canonicalCategory: string;
  parentCategory: string | null;
};

type DeterministicStatus =
  | "context-incomplete"
  | "category-untrusted"
  | "already-canonical"
  | "queued";

type ClassifiedStatus = "proposed" | "unresolved" | "blocked-cross-category";
type ManifestStatus = Exclude<DeterministicStatus, "queued"> | ClassifiedStatus;
type ClassifierDecision = "propose" | "abstain" | "out_of_category";

type CoreRecord = {
  id: string;
  category: string;
  oldTopic: string;
  candidateSet: string[];
  decision: ClassifierDecision | "skip";
  proposedTopic: string | null;
  status: DeterministicStatus;
  reason: string;
  scopedContextHash: string | null;
  itemType: string | null;
  canonicalCategory: string | null;
  parentId: string | null;
  sourceBank: string | null;
  categoryIntegrity: string[];
  scopedContext?: ScopedContext;
};

type ManifestRecord = Omit<CoreRecord, "status" | "scopedContext"> & {
  status: ManifestStatus;
};

type ScopedContext = {
  stem: string;
  correctAnswerText: string;
  rationale: string;
  parentTitle?: string;
};

type QueueRecord = {
  id: string;
  category: string;
  canonicalCategory: string;
  candidateSet: string[];
  scopedContext: ScopedContext;
  scopedContextHash: string;
  expectedOutput: {
    decision: "propose | abstain | out_of_category";
    topic: "canonical topic or null";
    reason: "one short sentence";
  };
};

type QueueArtifact = {
  DO_NOT_CLASSIFY_WITH_GEMINI: string;
  meta: {
    generatedAt: string;
    inputFile: string;
    inputCount: number;
    topicsSourceHash: string;
    banksSourceHash: string;
    temperature: 0;
    schemaVersion: "topic-residual-proposal-queue-v1";
  };
  instructions: string[];
  fullCanonicalTopics: string[];
  records: QueueRecord[];
};

type ClassifierResult = {
  id: string;
  decision: ClassifierDecision;
  topic: string | null;
  reason: string;
};

type ResultsArtifact = {
  meta?: {
    classifier?: string;
    temperature?: number;
  };
  records?: unknown[];
};

type Manifest = {
  meta: {
    generatedAt: string;
    inputFile: string;
    inputCount: number;
    topicsSourceHash: string;
    banksSourceHash: string;
    classifier: string;
    temperature: 0;
    schemaVersion: "topic-residual-proposal-v1";
  };
  records: ManifestRecord[];
};

const DEFAULT_INPUT = "audit/unresolved_gpt_claude.json";
const DEFAULT_GEMINI_MANIFEST = "audit/proposal_manifest_gemini.json";
const DEFAULT_RESULTS = "audit/topic-residual-proposals-results.json";

const STATUS_ORDER: Record<ManifestStatus, number> = {
  proposed: 0,
  "already-canonical": 1,
  unresolved: 2,
  "blocked-cross-category": 3,
  "category-untrusted": 4,
  "context-incomplete": 5,
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hashText = (text: string): string => createHash("sha256").update(text).digest("hex");
const hashJson = (value: unknown): string => hashText(JSON.stringify(value));

const oneLine = (value: string, maxLength = 240): string => {
  const collapsed = value.replace(/\s+/g, " ").trim();
  return collapsed.length <= maxLength ? collapsed : `${collapsed.slice(0, maxLength - 1)}…`;
};

const escapeCell = (value: unknown): string =>
  String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n/g, "<br>");

const parseArgs = () => {
  const [command, ...rest] = process.argv.slice(2);
  const args = new Map<string, string | boolean>();
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = rest[index + 1];
    if (!next || next.startsWith("--")) {
      args.set(key, true);
    } else {
      args.set(key, next);
      index += 1;
    }
  }
  return { command, args };
};

const stringArg = (args: Map<string, string | boolean>, key: string, fallback: string): string => {
  const value = args.get(key);
  return typeof value === "string" ? value : fallback;
};

const runDate = (args: Map<string, string | boolean>, now = new Date()): string => {
  const supplied = args.get("date");
  if (typeof supplied === "string") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(supplied)) throw new Error("--date must be YYYY-MM-DD.");
    return supplied;
  }
  return now.toISOString().slice(0, 10);
};

const defaultPath = (date: string, suffix: "queue.json" | "manifest.json" | "report.md"): string =>
  `audit/topic-residual-proposals-${date}.${suffix}`;

const readJson = async (path: string): Promise<unknown> => JSON.parse(await readFile(path, "utf8"));

const validateResidualRows = (raw: unknown): ResidualRow[] => {
  if (!Array.isArray(raw)) throw new Error("Residual input must be an array.");
  return raw.map((entry, index) => {
    if (!isObject(entry)) throw new Error(`Residual row ${index + 1} must be an object.`);
    if (typeof entry.id !== "string" || entry.id.trim() === "") {
      throw new Error(`Residual row ${index + 1} requires id.`);
    }
    if (typeof entry.oldTopic !== "string") throw new Error(`Residual row ${index + 1} requires oldTopic.`);
    return entry as ResidualRow;
  });
};

const extractGeminiIds = (raw: unknown): Set<string> => {
  const values = Array.isArray(raw) ? raw : isObject(raw) ? Object.values(raw) : [];
  return new Set(
    values
      .filter(isObject)
      .map((entry) => entry.id)
      .filter((id): id is string => typeof id === "string" && id.trim() !== ""),
  );
};

const assertScope = (residualRows: ResidualRow[], geminiIds: Set<string>): void => {
  const overlaps = residualRows.map((row) => row.id).filter((id) => geminiIds.has(id));
  if (overlaps.length > 0) {
    throw new Error(`Scope boundary breach: ${overlaps.length} residual id(s) overlap Gemini manifest: ${overlaps.slice(0, 10).join(", ")}`);
  }
};

const canonicalForNormalized = (topic: string): string | undefined => {
  const key = normalizeTopicKey(topic);
  return CANONICAL_TOPIC_LIST.find((candidate) => normalizeTopicKey(candidate) === key);
};

const isCategory = (value: string): value is Category =>
  TOPIC_CATEGORY_ORDER.includes(value as Category);

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
    question.itemType === "select_all"
  ) {
    return optionTextById(question, question.correct).join("; ");
  }
  if (question.itemType === "ordered_response") {
    return optionTextById(question, question.correct).map((text, index) => `${index + 1}. ${text}`).join("; ");
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
  if (question.itemType === "bowtie") {
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
  }
  const exhaustive: never = question;
  return exhaustive;
};

const collectHydratedContexts = async (banksDir: string): Promise<{ contexts: Map<string, HydratedContext>; banksSourceHash: string }> => {
  const files = (await readdir(banksDir)).filter((file) => file.endsWith("-canonical.json")).sort();
  const contexts = new Map<string, HydratedContext>();
  const hash = createHash("sha256");

  for (const file of files) {
    const path = join(banksDir, file);
    const text = await readFile(path, "utf8");
    hash.update(file).update("\0").update(text).update("\0");
    const bank = JSON.parse(text) as { questions?: Question[] };
    for (const question of bank.questions ?? []) {
      if (question.itemType === "case_study") {
        const parentTitle = oneLine(question.caseStudy.title.en, 160);
        for (const child of question.caseStudy.questions) {
          contexts.set(child.id, {
            sourceBank: file,
            parentId: question.id,
            itemType: child.itemType,
            stem: child.stem.en,
            correctAnswerText: correctAnswerText(child),
            rationale: child.rationale.correct.en,
            parentTitle,
            canonicalCategory: child.category,
            parentCategory: question.category,
          });
        }
      } else {
        contexts.set(question.id, {
          sourceBank: file,
          parentId: null,
          itemType: question.itemType,
          stem: question.stem.en,
          correctAnswerText: correctAnswerText(question),
          rationale: question.rationale.correct.en,
          parentTitle: "",
          canonicalCategory: question.category,
          parentCategory: null,
        });
      }
    }
  }

  return { contexts, banksSourceHash: hash.digest("hex") };
};

const topicsSourceHash = async (): Promise<string> => hashText(await readFile("src/topics.ts", "utf8"));

const buildCoreRecords = async (
  residualRows: ResidualRow[],
  banksDir: string,
): Promise<{ records: CoreRecord[]; banksSourceHash: string; hydrationByType: Map<string, { found: number; missing: number }> }> => {
  const { contexts, banksSourceHash } = await collectHydratedContexts(banksDir);
  const hydrationByType = new Map<string, { found: number; missing: number }>();
  const bumpHydration = (itemType: string, key: "found" | "missing") => {
    const entry = hydrationByType.get(itemType) ?? { found: 0, missing: 0 };
    entry[key] += 1;
    hydrationByType.set(itemType, entry);
  };

  const records = residualRows.map((row): CoreRecord => {
    const hydrated = contexts.get(row.id);
    if (!hydrated) {
      bumpHydration("unknown", "missing");
      return {
        id: row.id,
        category: row.category ?? "",
        oldTopic: row.oldTopic,
        candidateSet: [],
        decision: "skip",
        proposedTopic: null,
        status: "context-incomplete",
        reason: "id not found in canonical banks; classification skipped",
        scopedContextHash: null,
        itemType: null,
        canonicalCategory: null,
        parentId: null,
        sourceBank: null,
        categoryIntegrity: [],
      };
    }

    bumpHydration(hydrated.itemType, "found");
    const integrity: string[] = [];
    const residualCategory = row.category ?? "";
    if (!isCategory(residualCategory)) {
      integrity.push("residual category missing or noncanonical");
    } else if (residualCategory !== hydrated.canonicalCategory) {
      integrity.push(`residual category (${residualCategory}) differs from canonical category (${hydrated.canonicalCategory})`);
    }
    if (hydrated.parentCategory && hydrated.parentCategory !== hydrated.canonicalCategory) {
      integrity.push(`parent category (${hydrated.parentCategory}) differs from child category (${hydrated.canonicalCategory})`);
    }

    const authoritativeCategory = isCategory(hydrated.canonicalCategory) ? hydrated.canonicalCategory : null;
    const candidateSet = authoritativeCategory ? candidateSetForCategory(authoritativeCategory) : [];
    const scopedContext: ScopedContext = {
      stem: hydrated.stem,
      correctAnswerText: hydrated.correctAnswerText,
      rationale: hydrated.rationale,
      ...(hydrated.parentTitle ? { parentTitle: hydrated.parentTitle } : {}),
    };
    const scopedContextHash = hashJson(scopedContext);

    const base = {
      id: row.id,
      category: residualCategory,
      oldTopic: row.oldTopic,
      candidateSet,
      scopedContextHash,
      itemType: hydrated.itemType,
      canonicalCategory: hydrated.canonicalCategory,
      parentId: hydrated.parentId,
      sourceBank: hydrated.sourceBank,
      categoryIntegrity: integrity,
      scopedContext,
    };

    if (integrity.length > 0 || !authoritativeCategory) {
      return {
        ...base,
        decision: "skip",
        proposedTopic: null,
        status: "category-untrusted",
        reason: integrity.join("; ") || "canonical category is invalid",
      };
    }

    const canonical = canonicalForNormalized(row.oldTopic);
    if (canonical) {
      return {
        ...base,
        decision: "propose",
        proposedTopic: canonical,
        status: "already-canonical",
        reason: canonical === row.oldTopic ? "oldTopic is already canonical" : "oldTopic differs only by canonical casing/spacing",
      };
    }

    return {
      ...base,
      decision: "skip",
      proposedTopic: null,
      status: "queued",
      reason: "queued for external non-Gemini classification",
    };
  });

  return { records, banksSourceHash, hydrationByType };
};

const manifestRecord = (record: CoreRecord, override?: Partial<ManifestRecord>): ManifestRecord => {
  const { scopedContext: _scopedContext, ...rest } = record;
  return { ...rest, ...override } as ManifestRecord;
};

const writeQueue = async (
  outputPath: string,
  generatedAt: string,
  inputFile: string,
  residualRows: ResidualRow[],
  coreRecords: CoreRecord[],
  hashes: { topicsSourceHash: string; banksSourceHash: string },
): Promise<QueueArtifact> => {
  const artifact: QueueArtifact = {
    DO_NOT_CLASSIFY_WITH_GEMINI:
      "DO NOT CLASSIFY THIS QUEUE WITH GEMINI. Use only a non-Gemini classifier; Gemini is excluded because it may be in the topic-authoring path.",
    meta: {
      generatedAt,
      inputFile,
      inputCount: residualRows.length,
      topicsSourceHash: hashes.topicsSourceHash,
      banksSourceHash: hashes.banksSourceHash,
      temperature: 0,
      schemaVersion: "topic-residual-proposal-queue-v1",
    },
    instructions: [
      "For each record, choose only from candidateSet when decision is propose.",
      "Use out_of_category only when a fullCanonicalTopics value genuinely fits and no candidateSet value does.",
      "Do not choose the least-bad topic. If no candidate genuinely fits, abstain.",
      "Return records as JSON objects with exactly: id, decision, topic, reason.",
      "decision must be propose, abstain, or out_of_category. topic is null for abstain.",
      "The old noncanonical topic is intentionally omitted to prevent anchoring.",
    ],
    fullCanonicalTopics: [...CANONICAL_TOPIC_LIST],
    records: coreRecords
      .filter((record) => record.status === "queued")
      .map((record) => ({
        id: record.id,
        category: record.category,
        canonicalCategory: record.canonicalCategory ?? "",
        candidateSet: record.candidateSet,
        scopedContext: record.scopedContext!,
        scopedContextHash: record.scopedContextHash!,
        expectedOutput: {
          decision: "propose | abstain | out_of_category",
          topic: "canonical topic or null",
          reason: "one short sentence",
        },
      })),
  };

  await mkdir("audit", { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
  return artifact;
};

const assertNonGeminiClassifier = (classifier: string): void => {
  if (!classifier.trim()) throw new Error("Results meta.classifier is required.");
  if (/gemini/i.test(classifier)) {
    throw new Error(`Classifier must be non-Gemini; received ${classifier}.`);
  }
};

const parseClassifierResults = (raw: unknown): { classifier: string; temperature: number; records: ClassifierResult[] } => {
  const artifact = (isObject(raw) ? raw : { records: raw }) as ResultsArtifact;
  const classifier = artifact.meta?.classifier;
  if (typeof classifier !== "string") throw new Error("Classifier results require meta.classifier.");
  assertNonGeminiClassifier(classifier);
  const temperature = artifact.meta?.temperature;
  if (temperature !== 0) throw new Error("Classifier results require meta.temperature: 0.");
  const rawRecords = Array.isArray(artifact.records) ? artifact.records : [];
  const records = rawRecords.map((entry, index): ClassifierResult => {
    if (!isObject(entry)) throw new Error(`Classifier result ${index + 1} must be an object.`);
    const { id, decision, topic, reason } = entry;
    if (typeof id !== "string" || id.trim() === "") throw new Error(`Classifier result ${index + 1} requires id.`);
    const invalid = (message: string): ClassifierResult => ({
      id,
      decision: "abstain",
      topic: null,
      reason: `classifier-output-invalid: ${message}`,
    });
    if (decision !== "propose" && decision !== "abstain" && decision !== "out_of_category") {
      return invalid("decision must be propose, abstain, or out_of_category");
    }
    if (typeof reason !== "string" || reason.trim() === "") return invalid("reason is required");
    if (decision === "abstain" && topic !== null) return invalid("abstain requires topic null");
    if ((decision === "propose" || decision === "out_of_category") && typeof topic !== "string") {
      return invalid(`${decision} requires topic string`);
    }
    return { id, decision, topic: topic as string | null, reason: oneLine(reason, 220) };
  });
  return { classifier, temperature, records };
};

const applyClassifierResults = (coreRecords: CoreRecord[], results: ClassifierResult[]): ManifestRecord[] => {
  const queued = new Map(coreRecords.filter((record) => record.status === "queued").map((record) => [record.id, record]));
  const seen = new Set<string>();
  for (const result of results) {
    if (seen.has(result.id)) throw new Error(`Duplicate classifier result for ${result.id}.`);
    seen.add(result.id);
    if (!queued.has(result.id)) throw new Error(`Classifier result id was not queued: ${result.id}.`);
  }
  const missing = [...queued.keys()].filter((id) => !seen.has(id));
  if (missing.length > 0) throw new Error(`Classifier results are missing ${missing.length} queued record(s). First missing: ${missing.slice(0, 10).join(", ")}`);

  const resultById = new Map(results.map((result) => [result.id, result]));
  return coreRecords.map((record) => {
    if (record.status !== "queued") return manifestRecord(record);
    const result = resultById.get(record.id)!;
    if (result.decision === "abstain") {
      return manifestRecord(record, {
        decision: "abstain",
        proposedTopic: null,
        status: "unresolved",
        reason: result.reason,
      });
    }
    if (result.decision === "propose") {
      if (!result.topic || !record.candidateSet.includes(result.topic)) {
        return manifestRecord(record, {
          decision: "abstain",
          proposedTopic: null,
          status: "unresolved",
          reason: "classifier-output-invalid: proposed topic is not in candidateSet",
        });
      }
      return manifestRecord(record, {
        decision: "propose",
        proposedTopic: result.topic,
        status: "proposed",
        reason: result.reason,
      });
    }
    if (!result.topic || !CANONICAL_TOPICS.has(result.topic) || record.candidateSet.includes(result.topic)) {
      return manifestRecord(record, {
        decision: "abstain",
        proposedTopic: null,
        status: "unresolved",
        reason: "classifier-output-invalid: out_of_category topic must be canonical and outside candidateSet",
      });
    }
    return manifestRecord(record, {
      decision: "out_of_category",
      proposedTopic: result.topic,
      status: "blocked-cross-category",
      reason: result.reason,
    });
  });
};

const countBy = <T>(items: T[], keyFn: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(keyFn(item), (counts.get(keyFn(item)) ?? 0) + 1);
  return counts;
};

const formatCounts = (counts: Map<string, number>): string[] =>
  [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0])).map(([key, count]) => `- ${key}: ${count}`);

const formatReport = (
  manifest: Manifest,
  hydrationByType: Map<string, { found: number; missing: number }>,
): string => {
  const records = manifest.records;
  const statusCounts = countBy(records, (record) => record.status);
  const proposed = records.filter((record) => record.status === "proposed" && record.proposedTopic);
  const proposedCounts = countBy(proposed, (record) => record.proposedTopic!);
  const lines = [
    "# 835-Residual Topic Classification Proposal Report",
    "",
    `Generated: ${manifest.meta.generatedAt}`,
    `Input: ${manifest.meta.inputFile}`,
    `Classifier: ${manifest.meta.classifier}`,
    "Canonical bank writes: none",
    "",
    "## Status Counts",
    "",
    ...formatCounts(statusCounts),
    "",
  ];

  if ((statusCounts.get("unresolved") ?? 0) === 0) {
    lines.push("## Overmatch Check", "", "**FAILURE: unresolved == 0 before human curation. Treat this run as overmatched.**", "");
  } else {
    lines.push("## Overmatch Check", "", `Unresolved before human curation: ${statusCounts.get("unresolved") ?? 0}`, "");
  }

  lines.push("## Hydration Summary by Item Type", "", "| Item type | Found | Missing |", "|---|---:|---:|");
  for (const [itemType, counts] of [...hydrationByType.entries()].sort()) {
    lines.push(`| ${escapeCell(itemType)} | ${counts.found} | ${counts.missing} |`);
  }
  lines.push("");

  lines.push("## Proposed-Topic Distribution", "", "| Proposed topic | Count | Flags |", "|---|---:|---|");
  const totalProposed = proposed.length;
  for (const [topic, count] of [...proposedCounts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))) {
    const flags: string[] = [];
    if (totalProposed > 0 && count / totalProposed >= 0.2) flags.push("global >=20%");
    for (const category of TOPIC_CATEGORY_ORDER) {
      const categoryProposed = proposed.filter((record) => record.canonicalCategory === category);
      const categoryTopicCount = categoryProposed.filter((record) => record.proposedTopic === topic).length;
      if (categoryProposed.length > 0 && categoryTopicCount / categoryProposed.length >= 0.35) {
        flags.push(`${category} >=35%`);
      }
    }
    lines.push(`| ${escapeCell(topic)} | ${count} | ${flags.join("; ")} |`);
  }
  if (proposedCounts.size === 0) lines.push("| none | 0 | |");
  lines.push("");

  const integrityRows = records.filter((record) => record.categoryIntegrity.length > 0);
  lines.push("## Category Integrity", "", `Rows with deterministic category integrity flags: ${integrityRows.length}`, "");
  if (integrityRows.length > 0) {
    lines.push("| ID | Residual category | Canonical category | Notes |", "|---|---|---|---|");
    for (const record of integrityRows.sort((left, right) => left.id.localeCompare(right.id))) {
      lines.push(`| \`${escapeCell(record.id)}\` | ${escapeCell(record.category)} | ${escapeCell(record.canonicalCategory)} | ${escapeCell(record.categoryIntegrity.join("; "))} |`);
    }
    lines.push("");
  }

  lines.push("## Per-Category Adjudication Tables", "");
  for (const category of TOPIC_CATEGORY_ORDER) {
    const categoryRows = records
      .filter((record) => (record.canonicalCategory ?? record.category) === category)
      .sort((left, right) =>
        STATUS_ORDER[left.status] - STATUS_ORDER[right.status] ||
        (left.proposedTopic ?? "").localeCompare(right.proposedTopic ?? "") ||
        left.oldTopic.localeCompare(right.oldTopic) ||
        left.id.localeCompare(right.id),
      );
    lines.push(`### ${category}`, "", `Rows: ${categoryRows.length}`, "");
    lines.push("| Status | Proposed topic | Old topic | ID | Type | Reason |");
    lines.push("|---|---|---|---|---|---|");
    for (const record of categoryRows) {
      lines.push(
        `| ${record.status} | ${escapeCell(record.proposedTopic ?? "")} | ${escapeCell(record.oldTopic)} | \`${escapeCell(record.id)}\` | ${escapeCell(record.itemType)} | ${escapeCell(record.reason)} |`,
      );
    }
    lines.push("");
  }

  return `${lines.join("\n")}\n`;
};

export const emitQueue = async (options: {
  inputFile: string;
  geminiManifestFile: string;
  banksDir: string;
  outputPath: string;
  generatedAt: string;
}) => {
  const residualRows = validateResidualRows(await readJson(options.inputFile));
  assertScope(residualRows, extractGeminiIds(await readJson(options.geminiManifestFile)));
  const [topicHash, core] = await Promise.all([
    topicsSourceHash(),
    buildCoreRecords(residualRows, options.banksDir),
  ]);
  return writeQueue(options.outputPath, options.generatedAt, options.inputFile, residualRows, core.records, {
    topicsSourceHash: topicHash,
    banksSourceHash: core.banksSourceHash,
  });
};

export const ingestResults = async (options: {
  inputFile: string;
  geminiManifestFile: string;
  banksDir: string;
  resultsFile: string;
  manifestPath: string;
  reportPath: string;
  generatedAt: string;
}) => {
  const residualRows = validateResidualRows(await readJson(options.inputFile));
  assertScope(residualRows, extractGeminiIds(await readJson(options.geminiManifestFile)));
  const [topicHash, core, parsedResults] = await Promise.all([
    topicsSourceHash(),
    buildCoreRecords(residualRows, options.banksDir),
    readJson(options.resultsFile).then(parseClassifierResults),
  ]);
  const records = applyClassifierResults(core.records, parsedResults.records);
  const manifest: Manifest = {
    meta: {
      generatedAt: options.generatedAt,
      inputFile: options.inputFile,
      inputCount: residualRows.length,
      topicsSourceHash: topicHash,
      banksSourceHash: core.banksSourceHash,
      classifier: parsedResults.classifier,
      temperature: 0,
      schemaVersion: "topic-residual-proposal-v1",
    },
    records,
  };
  await mkdir("audit", { recursive: true });
  await writeFile(options.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(options.reportPath, formatReport(manifest, core.hydrationByType));
  return manifest;
};

const main = async () => {
  const { command, args } = parseArgs();
  const date = runDate(args);
  const generatedAt = new Date().toISOString();
  const inputFile = stringArg(args, "input", DEFAULT_INPUT);
  const geminiManifestFile = stringArg(args, "gemini-manifest", DEFAULT_GEMINI_MANIFEST);
  const banksDir = stringArg(args, "banks-dir", "banks");

  if (command === "emit-queue") {
    const outputPath = stringArg(args, "out", defaultPath(date, "queue.json"));
    const queue = await emitQueue({ inputFile, geminiManifestFile, banksDir, outputPath, generatedAt });
    console.log(`Wrote ${outputPath} with ${queue.records.length} queued record(s).`);
    return;
  }

  if (command === "ingest") {
    const resultsFile = stringArg(args, "results", DEFAULT_RESULTS);
    const manifestPath = stringArg(args, "manifest-out", defaultPath(date, "manifest.json"));
    const reportPath = stringArg(args, "report-out", defaultPath(date, "report.md"));
    const manifest = await ingestResults({
      inputFile,
      geminiManifestFile,
      banksDir,
      resultsFile,
      manifestPath,
      reportPath,
      generatedAt,
    });
    console.log(`Wrote ${manifestPath} and ${reportPath} with ${manifest.records.length} record(s).`);
    return;
  }

  const scriptName = basename(process.argv[1] ?? "topic-residual-proposals.ts");
  throw new Error(
    `Usage:
  tsx scripts/${scriptName} emit-queue [--date YYYY-MM-DD] [--out audit/topic-residual-proposals-YYYY-MM-DD.queue.json]
  tsx scripts/${scriptName} ingest --results audit/topic-residual-proposals-results.json [--date YYYY-MM-DD]`,
  );
};

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
