/**
 * Build the deterministic work-queue manifest for staged exhibit-flowsheet migration.
 *
 * This is intentionally a structural classifier, not a clinical adjudicator. The
 * clean_kv and serial buckets are conservative; prose_embedded vs scattered only
 * affects sequencing and sample intensity because every extracted batch still runs
 * through the gate and adjudication loop.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText, getRawQuestions } from "../src/bankImport";
import type { CaseStudyExhibit, Question, TextPair } from "../src/types";
import { LABEL_PATTERNS, serialParams } from "./exhibit-flowsheet-gate";

type Bucket = "clean_kv" | "prose_embedded" | "scattered" | "serial";

interface ManifestPanel {
  exhibitRef: string;
  bucket: Bucket;
  measurementCount: number;
  measurementKeys: string[];
  bankFile: string;
  serialParams?: string[];
}

interface Manifest {
  generatedAt: string;
  bankFiles: string[];
  summary: Record<Bucket, number> & { total: number };
  panels: ManifestPanel[];
}

const DEFAULT_BANKS = [
  "banks/hard-cases-canonical.json",
  "banks/claude-canonical.json",
  "banks/gpt-canonical.json",
  "banks/gemini-canonical.json",
];

const BUCKETS: Bucket[] = ["clean_kv", "prose_embedded", "scattered", "serial"];

const nfc = (s: string): string => s.normalize("NFC");
const en = (t: TextPair | undefined): string => t?.en ?? "";

const allExhibits = (q: Question): CaseStudyExhibit[] => {
  if (q.itemType !== "case_study") return [];
  const out: CaseStudyExhibit[] = [...(q.caseStudy.exhibits ?? [])];
  for (const stage of q.caseStudy.stages ?? []) out.push(...(stage.exhibits ?? []));
  return out;
};

const countMatches = (source: string, re: RegExp): number => {
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`;
  return source.match(new RegExp(re.source, flags))?.length ?? 0;
};

const measurementKeys = (source: string): string[] => {
  const keys = new Set<string>();
  for (const { key, re } of LABEL_PATTERNS) {
    if (countMatches(source, re) === 0) continue;
    if (key === "bp") {
      keys.add("sbp");
      keys.add("dbp");
    } else {
      keys.add(key);
    }
  }
  return [...keys].sort();
};

const hasMeasurement = (source: string): boolean => measurementKeys(source).length > 0;

const CLEAN_LINE_START = /^(?:[-*•]\s*)?(?:temp(?:erature)?|t\b|hr\b|heart rate|rr\b|respiratory rate|bp\b|blood pressure|spo2\b|spO₂\b|mean arterial pressure|\(?map\)?\b|vital signs|vitals|labs?|laboratory|serum labs|stat labs|repeat labs|cbc|bmp|fingerstick|blood glucose|sodium|na\b|potassium|k\b|chloride|cl\b|bicarbonate|bun\b|creatinine|glucose|ionized calcium|iCal\b|iCa\b|calcium|magnesium|phosphate|phosphorus|lactate|wbc\b|hemoglobin|hgb\b|hematocrit|hct\b|platelets?|plt\b|inr\b|ptt\b|aptt\b|ast\b|alt\b|total bilirubin|ammonia)\b/i;

const looksMeasurementLine = (line: string): boolean => {
  const trimmed = line.trim().replace(/^[-*•]\s*/, "");
  if (!/\d/.test(trimmed)) return false;
  if (!CLEAN_LINE_START.test(trimmed)) return false;
  if (!/[:=]/.test(trimmed) && !/^(?:temp|t|hr|rr|bp|spo2|spO₂|map)\b/i.test(trimmed)) return false;
  return LABEL_PATTERNS.some(({ re }) => countMatches(trimmed, re) > 0);
};

const looksCleanKv = (source: string): boolean => {
  const lines = source.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return false;
  const measurementLines = lines.filter(looksMeasurementLine);
  if (measurementLines.length < 2) return false;
  return measurementLines.length === lines.length;
};

const sentenceParts = (source: string): string[] =>
  source
    .split(/(?<=[.!?])\s+|\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

const looksProseEmbedded = (source: string): boolean => {
  const sentences = sentenceParts(source);
  const measurementIdxs = sentences
    .map((sentence, index) => hasMeasurement(sentence) ? index : -1)
    .filter((index) => index !== -1);
  if (measurementIdxs.length === 0 || measurementIdxs.length > 2) return false;
  return Math.max(...measurementIdxs) - Math.min(...measurementIdxs) + 1 === measurementIdxs.length;
};

const classify = (source: string): { bucket: Bucket; serialHits: string[] } => {
  const serialHits = serialParams(source);
  if (serialHits.length > 0) return { bucket: "serial", serialHits };
  if (looksCleanKv(source)) return { bucket: "clean_kv", serialHits };
  if (looksProseEmbedded(source)) return { bucket: "prose_embedded", serialHits };
  return { bucket: "scattered", serialHits };
};

const flagValues = (args: string[], name: string): string[] => {
  const values: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] !== name) continue;
    const value = args[i + 1];
    if (!value || value.startsWith("--")) {
      console.error(`${name} requires a value`);
      process.exit(2);
    }
    values.push(value);
    i++;
  }
  return values;
};

const flagValue = (args: string[], name: string, fallback: string): string => {
  const values = flagValues(args, name);
  return values.at(-1) ?? fallback;
};

const today = (): string => new Date().toISOString().slice(0, 10);

const buildManifest = async (bankFiles: string[], generatedAt: string): Promise<Manifest> => {
  const panels: ManifestPanel[] = [];
  const seenRefs = new Set<string>();
  for (const bankFile of bankFiles) {
    const raw = await readFile(bankFile, "utf8");
    const questions = getRawQuestions(parseBankText(raw)) as Question[];
    for (const question of questions) {
      for (const exhibit of allExhibits(question)) {
        const exhibitRef = `${question.id}/${exhibit.id}`;
        if (seenRefs.has(exhibitRef)) continue;
        seenRefs.add(exhibitRef);
        const source = nfc(en(exhibit.content));
        const keys = measurementKeys(source);
        if (keys.length === 0) continue;
        const { bucket, serialHits } = classify(source);
        panels.push({
          exhibitRef,
          bucket,
          measurementCount: keys.length,
          measurementKeys: keys,
          bankFile,
          ...(serialHits.length > 0 ? { serialParams: serialHits } : {}),
        });
      }
    }
  }

  panels.sort((a, b) => a.exhibitRef.localeCompare(b.exhibitRef));
  const summary = { clean_kv: 0, prose_embedded: 0, scattered: 0, serial: 0, total: panels.length };
  for (const panel of panels) summary[panel.bucket]++;

  return {
    generatedAt,
    bankFiles,
    summary,
    panels,
  };
};

const main = async () => {
  const args = process.argv.slice(2);
  const date = flagValue(args, "--date", today());
  const bankFiles = flagValues(args, "--bank");
  const banks = bankFiles.length > 0 ? bankFiles : DEFAULT_BANKS;
  const out = flagValue(args, "--out", `EXHIBIT-FLOWSHEET-MANIFEST-${date}.json`);

  const manifest = await buildManifest(banks, date);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  console.log(`${out}: ${manifest.summary.total} panels`);
  for (const bucket of BUCKETS) console.log(`  ${bucket}: ${manifest.summary[bucket]}`);
};

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.stack : String(err));
    process.exit(2);
  });
}

export { buildManifest, classify, looksCleanKv, looksProseEmbedded, measurementKeys };
export type { Manifest, ManifestPanel, Bucket };
