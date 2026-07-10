import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { parseBankText } from "../src/bankImport";
import { MEASUREMENT_ALLOWLIST } from "../src/measurementAllowlist";
import { normalizeUnit } from "../src/measurementUnitPolicy";
import { validateBankObject } from "../src/schema";
import type {
  BankEnvelope,
  CaseStudyExhibit,
  Question,
  StructuredMeasurementPanel,
  StructuredMeasurements,
  StructuredMeasurementPopulation,
  TextPair,
} from "../src/types";
import { serializeBank } from "../lib/presentation-normalization";

type StagedEntry = {
  label: string;
  value: string;
  sourceUnit?: string;
  sourceSpan?: string;
  context?: string;
};

type StagedRecord = {
  exhibitRef: string;
  lane: string;
  population?: StructuredMeasurementPopulation;
  panel?: StagedEntry[];
};

type LoadedBank = {
  filename: string;
  path: string;
  bank: BankEnvelope;
  dirty: boolean;
};

type LocatedExhibit = {
  bank: LoadedBank;
  exhibit: CaseStudyExhibit;
};

const root = resolve(import.meta.dirname, "..");
const banksDir = resolve(root, "banks");
const args = process.argv.slice(2);
const writeMode = args.includes("--write");
const proofMode = args.includes("--proof");
const artifactArgs: string[] = [];
const explicitRefs: string[] = [];

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === "--write" || arg === "--proof") continue;
  if (arg === "--refs") {
    const rawRefs = args[index + 1];
    if (!rawRefs || rawRefs.startsWith("--")) throw new Error("--refs requires a comma-separated ref list");
    explicitRefs.push(...rawRefs.split(",").map((ref) => ref.trim()).filter(Boolean));
    index += 1;
    continue;
  }
  if (arg.startsWith("--")) throw new Error(`Unknown option: ${arg}`);
  artifactArgs.push(arg);
}

const PROOF_REFS = new Set([
  "case_dka_01/ex_vitals_0800",
  "opus24_case_elder_neglect_med_mismanagement_01/home_visit_labs_returned",
  "case_ami_01/ex_vitals_new",
  "case_sepsis_pneumonia_01/triage",
  "claude_cs_jun06_chest_tube_rrp_01/drainage_obs",
  "claude_cs_jun06_chest_tube_rrp_01/incident",
  "cs_ckd_01/assessment",
]);

// Empty until a clean-KV record is verified to have every learner-facing fact
// represented by v1 structured fields. The first proof clean-KV records include
// out-of-scope details such as respiratory character, oxygen delivery, eGFR, and
// non-allowlisted nutrition labs, so they intentionally supplement prose.
const REPLACE_REFS = new Set<string>();

const POINTER_CONTENT: TextPair = {
  en: "See structured measurements table below.",
  zh: "见下方结构化测量表。",
};

const LABELS: Record<string, TextPair> = {
  temp: { en: "Temperature", zh: "体温" },
  hr: { en: "Heart rate", zh: "心率" },
  rr: { en: "Respiratory rate", zh: "呼吸频率" },
  sbp: { en: "Systolic BP", zh: "收缩压" },
  dbp: { en: "Diastolic BP", zh: "舒张压" },
  map: { en: "MAP", zh: "平均动脉压" },
  spo2: { en: "SpO2", zh: "脉搏血氧饱和度" },
  sao2: { en: "SaO2", zh: "动脉血氧饱和度" },
  glucose: { en: "Glucose", zh: "血糖" },
  sodium: { en: "Sodium", zh: "血钠" },
  potassium: { en: "Potassium", zh: "血钾" },
  chloride: { en: "Chloride", zh: "血氯" },
  bicarbonate: { en: "Bicarbonate", zh: "碳酸氢盐" },
  bun: { en: "BUN", zh: "尿素氮" },
  creatinine: { en: "Creatinine", zh: "肌酐" },
  magnesium: { en: "Magnesium", zh: "血镁" },
  phosphate: { en: "Phosphate", zh: "血磷" },
  calcium: { en: "Calcium", zh: "总钙" },
  ionized_calcium: { en: "Ionized calcium", zh: "离子钙" },
  anion_gap: { en: "Anion gap", zh: "阴离子间隙" },
  lactate: { en: "Lactate", zh: "乳酸" },
  wbc: { en: "WBC", zh: "白细胞" },
  hemoglobin: { en: "Hemoglobin", zh: "血红蛋白" },
  hematocrit: { en: "Hematocrit", zh: "血细胞比容" },
  platelets: { en: "Platelets", zh: "血小板" },
  inr: { en: "INR", zh: "国际标准化比值" },
  ptt: { en: "PTT", zh: "部分凝血活酶时间" },
  ph: { en: "pH", zh: "酸碱度" },
  paco2: { en: "PaCO2", zh: "动脉二氧化碳分压" },
  pao2: { en: "PaO2", zh: "动脉氧分压" },
  hco3_abg: { en: "HCO3 (ABG)", zh: "碳酸氢盐（动脉血气）" },
  ast: { en: "AST", zh: "谷草转氨酶" },
  alt: { en: "ALT", zh: "谷丙转氨酶" },
  total_bilirubin: { en: "Total bilirubin", zh: "总胆红素" },
  ammonia: { en: "Ammonia", zh: "血氨" },
  uric_acid: { en: "Uric acid", zh: "尿酸" },
  troponin_i: { en: "Troponin I", zh: "肌钙蛋白I" },
  troponin_t: { en: "Troponin T", zh: "肌钙蛋白T" },
  bnp: { en: "BNP", zh: "脑钠肽" },
};

const readJson = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(path, "utf8")) as T;

const ensureUsage = () => {
  if (proofMode && explicitRefs.length > 0) {
    throw new Error("Use either --proof or --refs, not both.");
  }
  if (!proofMode && explicitRefs.length === 0) {
    throw new Error("Pass --proof or an explicit --refs comma-separated list; blind promotion is not allowed.");
  }
  if (artifactArgs.length === 0) {
    throw new Error("Pass one or more explicit staged artifact paths; blind globbing is not allowed.");
  }
  const failedBatch = artifactArgs.find((arg) => basename(arg).includes("BATCH-19"));
  if (failedBatch) {
    throw new Error(`Refusing failed Batch 19 artifact: ${failedBatch}`);
  }
};

const findCaseExhibit = (question: Question, exhibitId: string): CaseStudyExhibit[] => {
  if (question.itemType !== "case_study") return [];
  const direct = question.caseStudy.exhibits.filter((exhibit) => exhibit.id === exhibitId);
  const staged = question.caseStudy.stages?.flatMap((stage) =>
    stage.exhibits.filter((exhibit) => exhibit.id === exhibitId),
  ) ?? [];
  return [...direct, ...staged];
};

const loadBanks = async (): Promise<LoadedBank[]> => {
  const filenames = (await readdir(banksDir))
    .filter((entry) => entry.endsWith(".json"))
    .sort();
  return Promise.all(filenames.map(async (filename) => {
    const path = join(banksDir, filename);
    const bank = parseBankText(await readFile(path, "utf8"));
    const result = validateBankObject(bank, { rejectUnknownKeys: true });
    if (!result.ok) {
      throw new Error(`${filename} failed pre-apply validation:\n${result.reasons.join("\n")}`);
    }
    return { filename, path, bank: result.value, dirty: false };
  }));
};

const locateExhibit = (banks: LoadedBank[], exhibitRef: string): LocatedExhibit => {
  const [caseId, exhibitId] = exhibitRef.split("/");
  if (!caseId || !exhibitId) throw new Error(`${exhibitRef}: malformed exhibitRef`);

  const matches: LocatedExhibit[] = [];
  for (const bank of banks) {
    for (const question of bank.bank.questions) {
      if (question.id !== caseId) continue;
      for (const exhibit of findCaseExhibit(question, exhibitId)) {
        matches.push({ bank, exhibit });
      }
    }
  }
  if (matches.length !== 1) {
    throw new Error(`${exhibitRef}: expected one canonical exhibit match, found ${matches.length}`);
  }
  return matches[0];
};

const relativeTimeLabel = (raw: string): TextPair => {
  const hour = raw.match(/\bhour\s+(\d+)\b/i);
  if (hour) return { en: `Hour ${hour[1]}`, zh: `${hour[1]}小时` };
  const day = raw.match(/\bday\s+(\d+)\b/i);
  if (day) return { en: `Day ${day[1]}`, zh: `第${day[1]}天` };
  return { en: raw, zh: raw };
};

const inferColumnLabel = (exhibit: CaseStudyExhibit, entries: StagedEntry[] = []): TextPair => {
  const sourceSpanHaystack = entries.map((entry) => entry.sourceSpan ?? "").join("\n");
  const relativeFromSpan = sourceSpanHaystack.match(/\b(?:hour|day)\s+\d+\b/i)?.[0];
  if (relativeFromSpan) return relativeTimeLabel(relativeFromSpan);

  const haystack = `${exhibit.title.en}\n${exhibit.content.en}\n${exhibit.id}`;
  const clock = haystack.match(/\b(?:[01]?\d|2[0-3]):[0-5]\d\b/)?.[0];
  if (clock) return { en: clock, zh: clock };
  const military = haystack.match(/\b(?:[01]\d|2[0-3])[0-5]\d\b/)?.[0];
  if (military) return { en: military, zh: military };
  const relative = haystack.match(/\b(?:hour|day)\s+\d+\b/i)?.[0];
  if (relative) return relativeTimeLabel(relative);
  return { en: "Current", zh: "当前" };
};

const labelFor = (key: string): TextPair => {
  const label = LABELS[key];
  if (!label) throw new Error(`No bilingual label registered for measurement key '${key}'`);
  return label;
};

const storedUnitFor = (key: string, sourceUnit: string): string => {
  if (key === "temp") {
    if (normalizeUnit(sourceUnit) === "f") return "°F";
    if (normalizeUnit(sourceUnit) === "c") return "°C";
  }
  const def = MEASUREMENT_ALLOWLIST[key];
  const matched = def?.acceptedSourceUnits.find((unit) => normalizeUnit(unit) === normalizeUnit(sourceUnit));
  return matched ?? sourceUnit;
};

const toPanels = (record: StagedRecord, exhibit: CaseStudyExhibit): StructuredMeasurementPanel[] => {
  if (record.lane !== "extract") {
    throw new Error(`${record.exhibitRef}: proof promotion only accepts extract records, found ${record.lane}`);
  }
  if (!record.panel?.length) {
    throw new Error(`${record.exhibitRef}: proof promotion requires a non-empty staged panel`);
  }

  const grouped: Record<"labs" | "vitals", StagedEntry[]> = { labs: [], vitals: [] };
  for (const entry of record.panel) {
    const def = MEASUREMENT_ALLOWLIST[entry.label];
    if (!def) throw new Error(`${record.exhibitRef}: unknown measurement key ${entry.label}`);
    if (!entry.sourceUnit) throw new Error(`${record.exhibitRef}/${entry.label}: missing sourceUnit`);
    grouped[def.kind === "lab" ? "labs" : "vitals"].push(entry);
  }

  const panels: StructuredMeasurementPanel[] = [];
  for (const kind of ["vitals", "labs"] as const) {
    const entries = grouped[kind];
    if (entries.length === 0) continue;
    const column = { id: "current", label: inferColumnLabel(exhibit, entries) };
    panels.push({
      kind,
      columns: [column],
      rows: entries.map((entry) => ({
        key: entry.label,
        label: labelFor(entry.label),
        values: [{
          columnId: column.id,
          value: entry.value,
          unit: storedUnitFor(entry.label, entry.sourceUnit!),
          ...(entry.context === "post_intervention" ? { context: "post_intervention" as const } : {}),
        }],
      })),
    });
  }
  return panels;
};

ensureUsage();

const targetRefs = proofMode ? PROOF_REFS : new Set(explicitRefs);
const stagedRecords: Array<StagedRecord & { bucket: string }> = [];
for (const artifactArg of artifactArgs) {
  const artifactPath = resolve(root, artifactArg);
  const bucket = basename(artifactPath).includes("clean_kv") ? "clean_kv" : "supplement";
  const records = await readJson<StagedRecord[]>(artifactPath);
  for (const record of records) {
    if (targetRefs.has(record.exhibitRef)) stagedRecords.push({ ...record, bucket });
  }
}

const foundRefs = new Set(stagedRecords.map((record) => record.exhibitRef));
const missingRefs = [...targetRefs].filter((ref) => !foundRefs.has(ref));
if (missingRefs.length > 0) {
  throw new Error(`Artifact set is missing ${missingRefs.length} ref(s): ${missingRefs.join(", ")}`);
}
if (stagedRecords.length !== targetRefs.size) {
  throw new Error(`Expected ${targetRefs.size} selected records, found ${stagedRecords.length}`);
}

const banks = await loadBanks();
const touchedBanks = new Set<LoadedBank>();
const touchedCounts = new Map<string, number>();
for (const record of stagedRecords) {
  const location = locateExhibit(banks, record.exhibitRef);
  if (location.exhibit.structuredMeasurements) {
    throw new Error(`${record.exhibitRef}: exhibit already has structuredMeasurements`);
  }
  const structuredMeasurements: StructuredMeasurements = {
    ...(record.population ? { population: record.population } : {}),
    panels: toPanels(record, location.exhibit),
  };
  location.exhibit.structuredMeasurements = structuredMeasurements;
  if (record.bucket === "clean_kv" && REPLACE_REFS.has(record.exhibitRef)) {
    location.exhibit.content = POINTER_CONTENT;
  }
  location.bank.bank.meta = {
    ...location.bank.bank.meta,
    schemaVersion: "1.8",
    count: location.bank.bank.questions.length,
  };
  location.bank.dirty = true;
  touchedBanks.add(location.bank);
  touchedCounts.set(location.bank.filename, (touchedCounts.get(location.bank.filename) ?? 0) + 1);
}

for (const bank of touchedBanks) {
  const result = validateBankObject(bank.bank, { rejectUnknownKeys: true });
  if (!result.ok) {
    throw new Error(`${bank.filename} failed post-apply validation:\n${result.reasons.join("\n")}`);
  }
}

if (writeMode) {
  for (const bank of touchedBanks) {
    await writeFile(bank.path, serializeBank(bank.bank), "utf8");
  }
}

const summary = [...touchedBanks]
  .sort((left, right) => left.filename.localeCompare(right.filename))
  .map((bank) => `${bank.filename} (${touchedCounts.get(bank.filename) ?? 0} exhibit refs)`);

console.log(`${writeMode ? "Applied" : "Dry-run validated"} ${stagedRecords.length} structured-measurements ${proofMode ? "proof" : "selected"} records.`);
console.log(`Touched banks: ${summary.join(", ")}`);
console.log(`${proofMode ? "Proof" : "Selected"} refs:`);
for (const record of stagedRecords.sort((left, right) => left.exhibitRef.localeCompare(right.exhibitRef))) {
  console.log(`- ${record.exhibitRef} [${record.bucket}]`);
}
