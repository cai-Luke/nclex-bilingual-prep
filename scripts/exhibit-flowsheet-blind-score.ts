/**
 * exhibit-flowsheet-blind-score.ts — semantic scorer for a blind-batch extraction.
 *
 * The deterministic gate (exhibit-flowsheet-gate.ts) checks the STRUCTURAL layer:
 * containment, sourceUnit recognition, serial shape, dimensional sanity. It cannot
 * check SELECTION — whether the extractor keyed the current value vs a prior one,
 * stayed silent on out-of-scope analytes, tagged post-intervention rather than
 * excluded, and chose the serial lane. That is what this scorer does: it compares an
 * extraction against a held-back answer key and reports per-record discrepancies.
 *
 * This is the committed, reproducible form of the blind adjudication (see
 * EXHIBIT-FLOWSHEET-BLIND-ADJUDICATION-2026-07-04.md). It reads the on-disk artifacts
 * so the go/iterate signal rests on disk truth, not on a transcript reconstruction.
 *
 * It is NOT a substitute for human adjudication of the answer key itself — the key is
 * authored by the blind-case generator and encodes the intended ground truth; this
 * scorer only measures the extractor against that key. Producer≠checker is preserved:
 * generator ≠ extractor ≠ (this) checker.
 *
 * USAGE:
 *   npx tsx scripts/exhibit-flowsheet-blind-score.ts \
 *     --extraction Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json \
 *     --key        Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-BLIND-ANSWERKEY-2026-07-04.json \
 *     --cases      Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json
 *
 * Defaults point at the archived 2026-07-04 blind artifacts when flags are omitted.
 *
 * EXIT: 0 iff every record matches the key exactly; 1 on any discrepancy; 2 on usage error.
 * A non-zero exit is the "iterate" signal; exit 0 is the "GO" signal for the scored set.
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildBlindIndex } from "./exhibit-flowsheet-gate";

// ----------------------------------------------------------------------------
// Answer-key + extraction shapes (mirror the blind-batch spec)
// ----------------------------------------------------------------------------

type KeyedExpect = { label: string; value: string; sourceUnit?: string };
type ExcludedExpect = { label: string; value: string; reason: string };
type ContextExpect = { label: string; value: string; context: string };

type KeyRecord = {
  exhibitRef: string;
  bucket: string;
  expectedKeyed: KeyedExpect[];
  expectedExcluded: ExcludedExpect[];
  expectedContext: ContextExpect[];
  expectedSkipSerial: boolean;
  expectedOutOfScope: string[]; // e.g. "lithium 1.4" — label + verbatim numeric token
};

type PanelEntry = { label: string; value: string; sourceUnit?: string; context?: string };
type ExcludedEntry = { label: string; value: string; reason: string };
type AliasEntry = { aliasOf: string; value: string };
type ExtractionRecord = {
  exhibitRef: string;
  lane: "extract" | "skip_serial";
  panel?: PanelEntry[];
  excludedValues?: ExcludedEntry[];
  unitAliases?: AliasEntry[];
};

const nfc = (s: string): string => s.normalize("NFC");

// A stable key for set comparison of tuples.
const tup = (...parts: (string | undefined)[]): string => parts.map((p) => p ?? "∅").join("|");

// ----------------------------------------------------------------------------
// Per-record scoring. Returns a list of human-readable discrepancy strings
// (empty = exact match).
// ----------------------------------------------------------------------------

const scoreRecord = (
  k: KeyRecord,
  e: ExtractionRecord | undefined,
  source: string | undefined,
): string[] => {
  const issues: string[] = [];
  if (!e) return ["MISSING extraction record for this exhibitRef"];
  if (source === undefined) return ["source content not found for this exhibitRef (cases file mismatch)"];
  const src = nfc(source);

  // --- lane / serial selection ---
  if (k.expectedSkipSerial) {
    if (e.lane !== "skip_serial") issues.push(`expected skip_serial, got lane=${e.lane}`);
    for (const arr of ["panel", "excludedValues", "unitAliases"] as const) {
      const v = e[arr];
      if (v && v.length) issues.push(`skip_serial carries non-empty ${arr}`);
    }
  } else if (e.lane !== "extract") {
    issues.push(`expected extract, got lane=${e.lane}`);
  }

  // --- keyed panel: label+value set equality ---
  const expKeyed = new Set(k.expectedKeyed.map((x) => tup(x.label, x.value)));
  const gotKeyed = new Set((e.panel ?? []).map((x) => tup(x.label, x.value)));
  for (const m of [...expKeyed].filter((x) => !gotKeyed.has(x))) issues.push(`keyed MISSING: ${m}`);
  for (const m of [...gotKeyed].filter((x) => !expKeyed.has(x))) issues.push(`keyed EXTRA: ${m}`);

  // --- keyed sourceUnit equality (only where the key pins a unit) ---
  const expUnit = new Map(k.expectedKeyed.filter((x) => x.sourceUnit != null).map((x) => [tup(x.label, x.value), x.sourceUnit!]));
  for (const pe of e.panel ?? []) {
    const key = tup(pe.label, pe.value);
    const want = expUnit.get(key);
    if (want != null && pe.sourceUnit !== want) {
      issues.push(`sourceUnit mismatch ${key}: key=${JSON.stringify(want)} ext=${JSON.stringify(pe.sourceUnit)}`);
    }
  }

  // --- excluded: label+value+reason set equality ---
  const expExc = new Set(k.expectedExcluded.map((x) => tup(x.label, x.value, x.reason)));
  const gotExc = new Set((e.excludedValues ?? []).map((x) => tup(x.label, x.value, x.reason)));
  for (const m of [...expExc].filter((x) => !gotExc.has(x))) issues.push(`excluded MISSING: ${m}`);
  for (const m of [...gotExc].filter((x) => !expExc.has(x))) issues.push(`excluded EXTRA: ${m}`);

  // --- post-intervention context tags: label+value+context set equality ---
  const expCtx = new Set(k.expectedContext.map((x) => tup(x.label, x.value, x.context)));
  const gotCtx = new Set((e.panel ?? []).filter((x) => x.context).map((x) => tup(x.label, x.value, x.context)));
  for (const m of [...expCtx].filter((x) => !gotCtx.has(x))) issues.push(`context MISSING: ${m}`);
  for (const m of [...gotCtx].filter((x) => !expCtx.has(x))) issues.push(`context EXTRA: ${m}`);

  // --- out-of-scope silence ---
  // Each OOS entry must (a) appear verbatim in the source prose (its numeric token),
  // proving the extractor stayed silent on a PRESENT value, and (b) NOT be keyed or
  // excluded (no leak). A key that names an OOS value absent from source is itself a
  // flag — the key would be wrong — so we surface that too.
  const keyedExclVals = new Set<string>();
  for (const pe of e.panel ?? []) keyedExclVals.add(pe.value);
  for (const xe of e.excludedValues ?? []) keyedExclVals.add(xe.value);
  for (const oos of k.expectedOutOfScope) {
    const num = oos.trim().split(/\s+/).pop()!;
    if (!src.includes(nfc(num))) issues.push(`OOS '${oos}': numeric token not found in source (answer key may be wrong)`);
    if (keyedExclVals.has(num)) issues.push(`OOS '${oos}': LEAKED into panel/excluded`);
  }

  return issues;
};

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

const DEFAULTS = {
  extraction: "Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-BLIND-EXTRACTION-2026-07-04.json",
  key: "Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-BLIND-ANSWERKEY-2026-07-04.json",
  cases: "Archive/root-cleanup-2026-07-05/EXHIBIT-FLOWSHEET-BLIND-CASES-2026-07-04.json",
};

const flagValue = (args: string[], name: string, fallback: string): string => {
  const i = args.indexOf(name);
  if (i === -1) return fallback;
  const v = args[i + 1];
  if (!v || v.startsWith("--")) {
    console.error(`${name} requires a path`);
    process.exit(2);
  }
  return v;
};

const main = async () => {
  const args = process.argv.slice(2);
  const extractionPath = flagValue(args, "--extraction", DEFAULTS.extraction);
  const keyPath = flagValue(args, "--key", DEFAULTS.key);
  const casesPath = flagValue(args, "--cases", DEFAULTS.cases);

  const key = JSON.parse(await readFile(keyPath, "utf8")) as KeyRecord[];
  const extraction = JSON.parse(await readFile(extractionPath, "utf8")) as ExtractionRecord[];
  const sourceIndex = await buildBlindIndex(casesPath); // exhibitRef → NFC content.en

  const extByRef = new Map(extraction.map((r) => [r.exhibitRef, r]));

  let discrepant = 0;
  const bucketCounts: Record<string, number> = {};
  console.log("=".repeat(72));
  for (const k of key) {
    bucketCounts[k.bucket] = (bucketCounts[k.bucket] ?? 0) + 1;
    const issues = scoreRecord(k, extByRef.get(k.exhibitRef), sourceIndex.get(k.exhibitRef)?.contentEn);
    if (issues.length === 0) {
      console.log(`OK  ${k.exhibitRef.padEnd(40)} [${k.bucket}]`);
    } else {
      discrepant++;
      console.log(`!!  ${k.exhibitRef.padEnd(40)} [${k.bucket}]`);
      for (const i of issues) console.log(`      - ${i}`);
    }
  }
  console.log("=".repeat(72));
  console.log(`${key.length} records, ${key.length - discrepant} match, ${discrepant} discrepant`);
  console.log(`buckets: ${JSON.stringify(bucketCounts)}`);
  console.log(discrepant === 0 ? "VERDICT: ALL MATCH KEY (GO signal for scored set)" : "VERDICT: DISCREPANCIES FOUND (iterate)");

  if (discrepant > 0) process.exit(1);
};

const isMain = process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.stack : String(err));
    process.exit(2);
  });
}

export { scoreRecord };
export type { KeyRecord, ExtractionRecord };
