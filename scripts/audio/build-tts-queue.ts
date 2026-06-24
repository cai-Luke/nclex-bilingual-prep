// TTS Generation Queue Builder — implements the queue half of DECISIONS
// principle 20. Deterministic, no-API. Produces the work list for the (separate)
// generation pass and the size projection that answers "how big is the job".
// Run this and read its summary BEFORE spending any Gemini credits.
//
// Spec: Archive/root-cleanup-2026-06-24/tts-queue-builder-codex-spec.md.

import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { getBankFiles, loadBank } from "../census";
import { normalizeForTts } from "../../src/audio/normalizeForTts";
import type {
  CaseStudyExhibit,
  Question,
  StandaloneQuestion,
  TextPair,
} from "../../src/types";

// ---- Estimation constants (projection-only; never gate anything) ----
//
// Average synthesized characters per second of audio. English is whitespace-
// delimited and less information-dense per character; Mandarin packs more
// meaning per glyph and is read more slowly per character, hence a separate,
// lower constant. Both are rough projections — the real duration comes from the
// generation run, not from these numbers.
const CHARS_PER_SECOND_EN = 14; // projection-only
const CHARS_PER_SECOND_ZH = 5; // projection-only (zh is denser per character)

// Opus byte rates (projection-only): 24 kbps ≈ 3 KB/s, 32 kbps ≈ 4 KB/s.
const KB_PER_SECOND_24K = 3;
const KB_PER_SECOND_32K = 4;

const NORMALIZATION_VERSION = "v1"; // bump ⇒ deliberately invalidates every hash

// ---- Row + output types ----

type Lang = "en" | "zh";

type ClipRow = {
  itemId: string;
  fieldPath: string;
  lang: Lang;
  text: string; // normalized
};

type Clip = {
  contentHash: string;
  lang: Lang;
  text: string;
  chars: number;
};

type KeyEntry = {
  key: string;
  itemId: string;
  fieldPath: string;
  lang: Lang;
  contentHash: string;
};

// ---- Hash / key / filename ----

const contentHashFor = (lang: Lang, normalizedText: string): string =>
  createHash("sha256")
    .update(`${lang}\u0000${normalizedText}`)
    .digest("hex")
    .slice(0, 10);

// Keep dotted path segments but make every component filename-safe.
const sanitize = (value: string): string => value.replace(/[^A-Za-z0-9._-]/g, "_");

const keyFor = (itemId: string, fieldPath: string, lang: Lang): string =>
  `${sanitize(itemId)}.${sanitize(fieldPath)}.${lang}`;

// ---- Field walk ----

const charCount = (text: string): number => [...text].length;

// Push one row per non-empty language of a TextPair.
const emitPair = (rows: ClipRow[], itemId: string, fieldPath: string, pair: TextPair | undefined): void => {
  if (!pair) return;
  (["en", "zh"] as const).forEach((lang) => {
    const text = normalizeForTts(pair[lang] ?? "");
    if (text.length === 0) return; // skip empties (case parents often carry empty stem/rationale)
    rows.push({ itemId, fieldPath, lang, text });
  });
};

// Push a single-language row (glossary term sides have no en/zh pairing).
const emitSingle = (rows: ClipRow[], itemId: string, fieldPath: string, lang: Lang, raw: string | undefined): void => {
  const text = normalizeForTts(raw ?? "");
  if (text.length === 0) return;
  rows.push({ itemId, fieldPath, lang, text });
};

// The CommonQuestion + per-itemType field map, applied with a given itemId.
// Used for top-level standalone items and for embedded case sub-questions
// (whose own id is the itemId, per spec).
const walkStandalone = (rows: ClipRow[], itemId: string, q: StandaloneQuestion): void => {
  walkCommon(rows, itemId, q);

  switch (q.itemType) {
    case "multiple_choice":
    case "select_all":
    case "ordered_response":
      q.options.forEach((opt) => emitPair(rows, itemId, `opt.${opt.id}`, opt));
      break;
    case "fill_in_blank":
      q.blanks.forEach((blank) => emitPair(rows, itemId, `blank.${blank.id}`, blank.prompt));
      break;
    case "matrix":
      q.matrix.rows.forEach((row) => emitPair(rows, itemId, `matrix.row.${row.id}`, row));
      q.matrix.columns.forEach((col) => emitPair(rows, itemId, `matrix.col.${col.id}`, col));
      break;
    case "dropdown_cloze":
      emitPair(rows, itemId, "cloze.stem", q.clozeStem);
      q.dropdowns.forEach((dd) =>
        dd.options.forEach((opt) => emitPair(rows, itemId, `dd.${dd.id}.${opt.id}`, opt)),
      );
      break;
    case "highlight":
      q.highlight.segments.forEach((seg) =>
        emitPair(rows, itemId, `hl.${seg.id}`, { en: seg.en, zh: seg.zh }),
      );
      break;
    case "bowtie": {
      const zones = [
        ["condition", q.bowtie.condition],
        ["actions", q.bowtie.actions],
        ["parameters", q.bowtie.parameters],
      ] as const;
      zones.forEach(([zone, data]) => {
        emitPair(rows, itemId, `bowtie.${zone}.prompt`, data.prompt);
        data.tokens.forEach((token) =>
          emitPair(rows, itemId, `bowtie.${zone}.${token.id}`, { en: token.en, zh: token.zh }),
        );
      });
      break;
    }
  }
};

// CommonQuestion fields shared by every item (standalone and case parent).
const walkCommon = (rows: ClipRow[], itemId: string, q: Question): void => {
  emitPair(rows, itemId, "stem", q.stem);
  emitPair(rows, itemId, "rat.correct", q.rationale?.correct);
  q.rationale?.byChoice?.forEach((choice) =>
    emitPair(rows, itemId, `rat.byChoice.${choice.refId}`, { en: choice.en, zh: choice.zh }),
  );
  emitPair(rows, itemId, "strategy", q.testTakingStrategy);
  q.glossary?.forEach((term, idx) => {
    // defZh is out for v1 (definition-reading is a separate feature).
    emitSingle(rows, itemId, `term.${idx}`, "en", term.termEn);
    emitSingle(rows, itemId, `term.${idx}`, "zh", term.termZh);
  });
};

const walkExhibit = (rows: ClipRow[], itemId: string, prefix: string, exhibit: CaseStudyExhibit): void => {
  emitPair(rows, itemId, `${prefix}.${exhibit.id}.title`, exhibit.title);
  emitPair(rows, itemId, `${prefix}.${exhibit.id}.content`, exhibit.content);
};

const walkQuestion = (rows: ClipRow[], q: Question): void => {
  if (q.itemType !== "case_study") {
    walkStandalone(rows, q.id, q);
    return;
  }

  const parentId = q.id;
  const cs = q.caseStudy;

  // Parent's own CommonQuestion fields — only the non-empty ones (emitPair
  // already drops empties), since case parents frequently carry empty
  // stem/rationale/strategy/glossary.
  walkCommon(rows, parentId, q);

  // Case shell.
  emitPair(rows, parentId, "case.title", cs.title);
  emitPair(rows, parentId, "case.summary", cs.summary);
  cs.exhibits.forEach((exhibit) => walkExhibit(rows, parentId, "case.exhibit", exhibit));
  cs.stages?.forEach((stage) => {
    emitPair(rows, parentId, `case.stage.${stage.id}.title`, stage.title);
    emitPair(rows, parentId, `case.stage.${stage.id}.trigger`, stage.trigger);
    emitPair(rows, parentId, `case.stage.${stage.id}.narrative`, stage.narrative);
    stage.exhibits.forEach((exhibit) =>
      walkExhibit(rows, parentId, `case.stage.${stage.id}.exhibit`, exhibit),
    );
  });

  // Embedded sub-questions: each is a StandaloneQuestion whose own (globally
  // unique) id is its itemId.
  cs.questions.forEach((sub) => walkStandalone(rows, sub.id, sub));
};

// ---- Census provenance + cross-check ----

const getGitSha = (): string => {
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
};

type CensusTotals = {
  topLevel: number;
  embeddedParts: number;
  gradedTotal: number;
};

const readCensusTotals = async (): Promise<CensusTotals> => {
  let text: string;
  try {
    text = await readFile("census.json", "utf8");
  } catch {
    throw new Error("census.json not found — run `npm run census` first (the queue cross-checks against it).");
  }
  const parsed = JSON.parse(text) as { totals?: Partial<CensusTotals> };
  const totals = parsed.totals;
  if (
    !totals ||
    typeof totals.topLevel !== "number" ||
    typeof totals.embeddedParts !== "number" ||
    typeof totals.gradedTotal !== "number"
  ) {
    throw new Error("census.json is missing totals.{topLevel,embeddedParts,gradedTotal}.");
  }
  return { topLevel: totals.topLevel, embeddedParts: totals.embeddedParts, gradedTotal: totals.gradedTotal };
};

// ---- Main ----

const main = async (): Promise<void> => {
  const files = await getBankFiles();
  const rows: ClipRow[] = [];

  let topLevel = 0;
  let embedded = 0;

  for (const file of files) {
    const envelope = await loadBank(file);
    for (const q of envelope.questions) {
      topLevel += 1;
      if (q.itemType === "case_study") embedded += q.caseStudy.questions.length;
      walkQuestion(rows, q);
    }
  }
  const graded = topLevel + embedded;

  // Cross-check the traversal against census.json — this is the built-in proof
  // the item set is identical. Fail loud on any mismatch.
  const census = await readCensusTotals();
  const mismatches: string[] = [];
  if (topLevel !== census.topLevel) mismatches.push(`topLevel: queue ${topLevel} vs census ${census.topLevel}`);
  if (embedded !== census.embeddedParts) mismatches.push(`embedded: queue ${embedded} vs census ${census.embeddedParts}`);
  if (graded !== census.gradedTotal) mismatches.push(`graded: queue ${graded} vs census ${census.gradedTotal}`);
  if (mismatches.length > 0) {
    throw new Error(
      `Item-count mismatch with census.json (traversal drift):\n  ${mismatches.join("\n  ")}\n` +
        "Regenerate census (`npm run census`) or reconcile the field walk.",
    );
  }

  // Build keys + deduped clips.
  const keys: KeyEntry[] = [];
  const clipByHash = new Map<string, Clip>();
  for (const row of rows) {
    const contentHash = contentHashFor(row.lang, row.text);
    keys.push({
      key: keyFor(row.itemId, row.fieldPath, row.lang),
      itemId: row.itemId,
      fieldPath: row.fieldPath,
      lang: row.lang,
      contentHash,
    });
    if (!clipByHash.has(contentHash)) {
      clipByHash.set(contentHash, {
        contentHash,
        lang: row.lang,
        text: row.text,
        chars: charCount(row.text),
      });
    }
  }

  // Deterministic ordering (independent of bank/traversal order).
  const clips = [...clipByHash.values()].sort(
    (a, b) => a.lang.localeCompare(b.lang) || a.contentHash.localeCompare(b.contentHash),
  );
  keys.sort((a, b) => a.key.localeCompare(b.key));

  // Projections (over distinct clips — that is the actual generation workload).
  const distinctClipsByLang = { en: 0, zh: 0 };
  let charsTotal = 0;
  let estSecondsTotal = 0;
  for (const clip of clips) {
    distinctClipsByLang[clip.lang] += 1;
    charsTotal += clip.chars;
    estSecondsTotal += clip.chars / (clip.lang === "en" ? CHARS_PER_SECOND_EN : CHARS_PER_SECOND_ZH);
  }
  const estSeconds = Math.round(estSecondsTotal);
  const round1 = (n: number) => Math.round(n * 10) / 10;
  const estMB = {
    opus_24k: round1((estSeconds * KB_PER_SECOND_24K) / 1024),
    opus_32k: round1((estSeconds * KB_PER_SECOND_32K) / 1024),
  };

  const summary = {
    items: { topLevel, embedded, graded },
    keysTotal: keys.length,
    distinctClips: clips.length,
    distinctClipsByLang,
    charsTotal,
    estSecondsTotal: estSeconds,
    estMB,
  };

  const manifest = {
    generatedAt: new Date().toISOString(),
    gitSha: getGitSha(),
    normalization: NORMALIZATION_VERSION,
    clips,
    keys,
    summary,
  };

  await mkdir("audio", { recursive: true });
  await writeFile("audio/manifest.queue.json", JSON.stringify(manifest, null, 2) + "\n", "utf8");

  const minutes = Math.round(estSeconds / 60);
  console.log(`TTS queue written to audio/manifest.queue.json`);
  console.log(
    `${summary.distinctClips} clips · ~${minutes} min audio · ~${estMB.opus_24k}–${estMB.opus_32k} MB Opus`,
  );
  console.log(
    `  items: ${topLevel} top-level / ${embedded} embedded / ${graded} graded (matches census)` +
      ` · keys: ${summary.keysTotal} · distinct: en ${distinctClipsByLang.en} / zh ${distinctClipsByLang.zh}`,
  );
};

await main();
