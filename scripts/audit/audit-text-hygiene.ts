/**
 * Tier 2 (advisory) — text hygiene of parsed bank string values.
 *
 * Bank text mixes ASCII and full-width punctuation systems. This check walks
 * the parsed JSON (before schema validation, so it works on raw drafts as well
 * as canonicals), classifies every string value by its nearest object key, and
 * reports codepoint-level findings against the TH1–TH11 rule catalog.
 *
 * Findings are advisory: a rule finding yields WARN, never FAIL. FAIL is
 * reserved for an explicitly selected file that cannot be read or parsed.
 * Outer-file syntax (BOM, fences, surrounding text) is owned by
 * `extractJsonCandidate`; U+FFFD is owned by `src/schema.ts`. Neither is
 * re-checked here.
 *
 * Codepoint sets are exact. Do not substitute Unicode normalization: NFKC
 * would also rewrite legitimate characters such as ℃, ㎎, and ①.
 *
 * Can be run standalone:  tsx scripts/audit/audit-text-hygiene.ts
 */

import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { dedupeSelectedFilePaths } from "../../lib/selected-file-paths";
import { parseBankText } from "../../src/bankImport";
import type { Question } from "../../src/types";
import { checkQuestionReferences } from "./audit-references";
import type { AuditResult } from "./types";

const PROMOTED_DIR = "banks";

// ---------------------------------------------------------------------------
// Location classes
// ---------------------------------------------------------------------------

export type LocationClass = "L-EN" | "L-ZH" | "L-ID" | "L-OTHER";

export const LOCATION_CLASSES: readonly LocationClass[] = ["L-EN", "L-ZH", "L-ID", "L-OTHER"];

const EN_KEYS = new Set(["en", "termEn"]);
const ZH_KEYS = new Set(["zh", "termZh", "defZh"]);
// `correct` holds option/row/segment/token IDs wherever its value is a string
// or string array; `rationale.correct` is an object whose strings sit under
// `en`/`zh` and so never reach this key.
const ID_KEYS = new Set(["id", "refId", "correct"]);

/** Classify a string by the nearest enclosing object key (array elements inherit it). */
export const classifyKey = (key: string | null): LocationClass => {
  if (key === null) return "L-OTHER";
  if (EN_KEYS.has(key)) return "L-EN";
  if (ZH_KEYS.has(key)) return "L-ZH";
  if (ID_KEYS.has(key) || /Ids?$/.test(key)) return "L-ID";
  return "L-OTHER";
};

// ---------------------------------------------------------------------------
// Codepoint sets
// ---------------------------------------------------------------------------

type Ranges = ReadonlyArray<readonly [number, number]>;

const inRanges = (cp: number, ranges: Ranges): boolean =>
  ranges.some(([low, high]) => cp >= low && cp <= high);

const CJK_PUNCT: Ranges = [
  [0x3001, 0x303f], [0xfe10, 0xfe1f], [0xfe30, 0xfe4f], [0xfe50, 0xfe6f],
  [0xff01, 0xff0f], [0xff1a, 0xff20], [0xff3b, 0xff40], [0xff5b, 0xff65],
];
const FW_ALNUM: Ranges = [[0xff10, 0xff19], [0xff21, 0xff3a], [0xff41, 0xff5a]];
// U+0009 tab and U+000A newline are allowed; U+000D is flagged.
const INVISIBLE: Ranges = [
  [0x0000, 0x0008], [0x000b, 0x001f], [0x007f, 0x009f], [0x00ad, 0x00ad],
  [0x200b, 0x200f], [0x202a, 0x202e], [0x2028, 0x2029], [0x2060, 0x2064],
  [0x2066, 0x2069], [0xfeff, 0xfeff],
];
const ODD_SPACE: Ranges = [[0x00a0, 0x00a0], [0x2000, 0x200a], [0x202f, 0x202f], [0x3000, 0x3000]];

const HAN_CHAR = /^\p{Script=Han}$/u;
const isHan = (char: string | undefined): boolean => char !== undefined && HAN_CHAR.test(char);

// ---------------------------------------------------------------------------
// Rule catalog
// ---------------------------------------------------------------------------

export const TEXT_HYGIENE_RULES = [
  { id: "TH1", name: "invisible-char", appliesTo: LOCATION_CLASSES },
  { id: "TH2", name: "nonstandard-space", appliesTo: LOCATION_CLASSES },
  { id: "TH3", name: "id-non-ascii", appliesTo: ["L-ID"] },
  { id: "TH4", name: "fullwidth-alnum", appliesTo: LOCATION_CLASSES },
  { id: "TH5", name: "en-cjk-punct", appliesTo: ["L-EN"] },
  { id: "TH6", name: "en-han", appliesTo: ["L-EN"] },
  { id: "TH7", name: "en-curly-double-quote", appliesTo: ["L-EN"] },
  { id: "TH8", name: "zh-ascii-punct", appliesTo: ["L-ZH"] },
  { id: "TH9", name: "zh-ascii-quote", appliesTo: ["L-ZH"] },
  { id: "TH10", name: "zh-ascii-paren", appliesTo: ["L-ZH"] },
  { id: "TH11", name: "zh-untranslated", appliesTo: ["L-ZH"] },
] as const satisfies ReadonlyArray<{ id: string; name: string; appliesTo: readonly LocationClass[] }>;

export type TextHygieneRuleId = (typeof TEXT_HYGIENE_RULES)[number]["id"];

export type TextHygieneFinding = {
  /** Caller-supplied file label; the survey passes a repo-relative POSIX path. */
  file: string;
  /** `id` of the enclosing top-level question; null when absent or not a string. */
  topLevelId: string | null;
  /** `id` of the scored leaf: the case sub-question, or the standalone item itself. */
  leafId: string | null;
  jsonPath: string;
  locationClass: LocationClass;
  rule: TextHygieneRuleId;
  /** Offending codepoints as `U+XXXX`; empty for the whole-value rule TH11. */
  codepoints: string[];
  /** Unicode code-point index into the string value (not a UTF-16 index). */
  offset: number;
  /** ±16 code points of context, unescaped. Never print this outside an escaped artifact. */
  excerpt: string;
};

type Hit = { rule: TextHygieneRuleId; offset: number; span: number; cps: number[] };

const EXCERPT_CONTEXT = 16;
const ZH_ASCII_PUNCT = new Set([",", ";", ":", "?", "!"]);
const ZH_UNTRANSLATED = /[A-Za-z]{3,}\s+[A-Za-z]{3,}/;
const ZH_UNTRANSLATED_HAN = /\p{Script=Han}/u;
const CLEAN_ASCII = /^[\x20-\x7E\t\n]*$/;
const CLEAN_ASCII_ID = /^[\x21-\x7E]*$/;

export const formatCodepoint = (cp: number): string =>
  `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;

/** All rule hits for one string value. Pure; offsets are code-point indexes. */
const scanString = (value: string, locationClass: LocationClass): Hit[] => {
  if (locationClass === "L-ID" ? CLEAN_ASCII_ID.test(value) : locationClass !== "L-ZH" && CLEAN_ASCII.test(value)) {
    return [];
  }

  const chars = Array.from(value);
  const hits: Hit[] = [];
  const single = (rule: TextHygieneRuleId, offset: number, cp: number) =>
    hits.push({ rule, offset, span: 1, cps: [cp] });
  const openParens: number[] = [];

  chars.forEach((char, index) => {
    const cp = char.codePointAt(0)!;

    if (inRanges(cp, INVISIBLE)) single("TH1", index, cp);
    if (inRanges(cp, ODD_SPACE)) single("TH2", index, cp);
    if (inRanges(cp, FW_ALNUM)) single("TH4", index, cp);

    if (locationClass === "L-ID") {
      if (cp < 0x21 || cp > 0x7e) single("TH3", index, cp);
      return;
    }

    if (locationClass === "L-EN") {
      if (inRanges(cp, CJK_PUNCT)) single("TH5", index, cp);
      if (HAN_CHAR.test(char)) single("TH6", index, cp);
      if (cp === 0x201c || cp === 0x201d) single("TH7", index, cp);
      return;
    }

    if (locationClass !== "L-ZH") return;

    const previous = chars[index - 1];
    const next = chars[index + 1];
    if (ZH_ASCII_PUNCT.has(char)) {
      if (isHan(previous) || isHan(next) || (next === " " && isHan(chars[index + 2]))) single("TH8", index, cp);
    } else if (char === ".") {
      if (isHan(previous) && (next === undefined || /\s/.test(next) || isHan(next))) single("TH8", index, cp);
    } else if (char === "\"") {
      single("TH9", index, cp);
    } else if (char === "'") {
      if (isHan(previous) || isHan(next)) single("TH9", index, cp);
    } else if (char === "(") {
      openParens.push(index);
    } else if (char === ")") {
      const open = openParens.pop();
      if (open !== undefined && chars.slice(open + 1, index).some((inner) => HAN_CHAR.test(inner))) {
        hits.push({ rule: "TH10", offset: open, span: index - open + 1, cps: [0x28, 0x29] });
      }
    }
  });

  if (locationClass === "L-ZH" && !ZH_UNTRANSLATED_HAN.test(value)) {
    const match = ZH_UNTRANSLATED.exec(value);
    if (match) {
      hits.push({
        rule: "TH11",
        offset: Array.from(value.slice(0, match.index)).length,
        span: Array.from(match[0]).length,
        cps: [],
      });
    }
  }

  return hits;
};

// ---------------------------------------------------------------------------
// Pure core
// ---------------------------------------------------------------------------

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const stringId = (value: unknown): string | null =>
  isRecord(value) && typeof value.id === "string" ? value.id : null;

const property = (key: string): string =>
  /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;

const compareStrings = (left: string, right: string): number => (left < right ? -1 : left > right ? 1 : 0);

const ruleOrder = new Map<string, number>(TEXT_HYGIENE_RULES.map((rule, index) => [rule.id, index]));

export const compareFindings = (left: TextHygieneFinding, right: TextHygieneFinding): number =>
  compareStrings(left.file, right.file) ||
  compareStrings(left.jsonPath, right.jsonPath) ||
  left.offset - right.offset ||
  ruleOrder.get(left.rule)! - ruleOrder.get(right.rule)!;

/**
 * Find every text-hygiene finding in a parsed bank value. Object keys are not
 * scanned. Works on a bank envelope, a bare question array, or any other
 * parsed JSON; strings outside a question carry null IDs.
 */
export function findTextHygieneFindings(raw: unknown, file: string): TextHygieneFinding[] {
  const findings: TextHygieneFinding[] = [];
  type Owner = { topLevelId: string | null; leafId: string | null };
  const unowned: Owner = { topLevelId: null, leafId: null };

  const scanValue = (value: unknown, path: string, key: string | null, owner: Owner): void => {
    if (typeof value === "string") {
      const locationClass = classifyKey(key);
      const hits = scanString(value, locationClass);
      if (hits.length === 0) return;
      const chars = Array.from(value);
      for (const hit of hits) {
        findings.push({
          file,
          topLevelId: owner.topLevelId,
          leafId: owner.leafId,
          jsonPath: path,
          locationClass,
          rule: hit.rule,
          codepoints: hit.cps.map(formatCodepoint),
          offset: hit.offset,
          excerpt: chars
            .slice(Math.max(0, hit.offset - EXCERPT_CONTEXT), hit.offset + hit.span + EXCERPT_CONTEXT)
            .join(""),
        });
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => scanValue(item, `${path}[${index}]`, key, owner));
      return;
    }
    if (isRecord(value)) {
      for (const [childKey, child] of Object.entries(value)) {
        scanValue(child, `${path}${property(childKey)}`, childKey, owner);
      }
    }
  };

  const scanQuestion = (question: unknown, path: string): void => {
    if (!isRecord(question)) {
      scanValue(question, path, null, unowned);
      return;
    }
    const topLevelId = stringId(question);
    const caseStudy = question.caseStudy;
    const isCase = isRecord(caseStudy);
    for (const [key, child] of Object.entries(question)) {
      if (key !== "caseStudy" || !isRecord(child)) {
        scanValue(child, `${path}${property(key)}`, key, { topLevelId, leafId: isCase ? null : topLevelId });
        continue;
      }
      for (const [caseKey, caseChild] of Object.entries(child)) {
        const casePath = `${path}.caseStudy${property(caseKey)}`;
        if (caseKey === "questions" && Array.isArray(caseChild)) {
          caseChild.forEach((nested, index) =>
            scanValue(nested, `${casePath}[${index}]`, caseKey, { topLevelId, leafId: stringId(nested) }));
        } else {
          scanValue(caseChild, casePath, caseKey, { topLevelId, leafId: null });
        }
      }
    }
  };

  if (Array.isArray(raw)) {
    raw.forEach((question, index) => scanQuestion(question, `$[${index}]`));
  } else if (isRecord(raw)) {
    for (const [key, child] of Object.entries(raw)) {
      if (key === "questions" && Array.isArray(child)) {
        child.forEach((question, index) => scanQuestion(question, `$.questions[${index}]`));
      } else {
        scanValue(child, `$${property(key)}`, key, unowned);
      }
    }
  } else {
    scanValue(raw, "$", null, unowned);
  }

  return findings.sort(compareFindings);
}

// ---------------------------------------------------------------------------
// ASCII-only output escaping
// ---------------------------------------------------------------------------

/**
 * Escape a string to printable ASCII. Every code point above U+007E, every
 * control character, and the backslash itself (so the mapping stays
 * injective) is written as `\u{XXXX}`.
 */
export const escapeNonAscii = (value: string): string =>
  Array.from(value, (char) => {
    const cp = char.codePointAt(0)!;
    return cp < 0x20 || cp > 0x7e || cp === 0x5c
      ? `\\u{${cp.toString(16).toUpperCase().padStart(4, "0")}}`
      : char;
  }).join("");

// ---------------------------------------------------------------------------
// Shadow measurement S1 — references blind spot (not a rule)
// ---------------------------------------------------------------------------

/** Map U+FF01–U+FF5E to U+0021–U+007E and U+3000 to U+0020; nothing else changes. */
export const foldFullWidth = (value: string): string =>
  Array.from(value, (char) => {
    const cp = char.codePointAt(0)!;
    if (cp >= 0xff01 && cp <= 0xff5e) return String.fromCodePoint(cp - 0xfee0);
    return cp === 0x3000 ? " " : char;
  }).join("");

const foldRationales = (question: Question): void => {
  const { rationale } = question;
  rationale.correct.en = foldFullWidth(rationale.correct.en);
  rationale.correct.zh = foldFullWidth(rationale.correct.zh);
  for (const choice of rationale.byChoice ?? []) {
    choice.en = foldFullWidth(choice.en);
    choice.zh = foldFullWidth(choice.zh);
  }
  if (question.itemType === "case_study") question.caseStudy.questions.forEach(foldRationales);
};

export type ReferencesShadowDelta = {
  topLevelId: string;
  addedStaleKeys: string[];
  addedHazards: string[];
  removedStaleKeys: string[];
  removedHazards: string[];
};

/**
 * Run the Tier 1 references check on a question and on a copy whose rationale
 * strings are full-width-folded. Returns the difference, or null when the
 * two results agree. The input question is not mutated.
 */
export function referencesShadowDelta(question: Question): ReferencesShadowDelta | null {
  const folded = structuredClone(question);
  foldRationales(folded);
  const before = checkQuestionReferences(question);
  const after = checkQuestionReferences(folded);
  const difference = (from: string[], against: string[]) => from.filter((entry) => !against.includes(entry));
  const delta: ReferencesShadowDelta = {
    topLevelId: question.id,
    addedStaleKeys: difference(after?.staleKeys ?? [], before?.staleKeys ?? []),
    addedHazards: difference(after?.hazards ?? [], before?.hazards ?? []),
    removedStaleKeys: difference(before?.staleKeys ?? [], after?.staleKeys ?? []),
    removedHazards: difference(before?.hazards ?? [], after?.hazards ?? []),
  };
  return delta.addedStaleKeys.length + delta.addedHazards.length +
    delta.removedStaleKeys.length + delta.removedHazards.length === 0
    ? null
    : delta;
}

// ---------------------------------------------------------------------------
// Public runner
// ---------------------------------------------------------------------------

const NAME = "audit:text-hygiene";
const NO_ID = "(no id)";

export type RunAuditTextHygieneOptions = {
  /** Audit exactly these file paths instead of sweeping the default directory.
   *  Fails loud: a missing, unreadable, or unparseable selected file is never
   *  silently skipped. Schema validity is not required. */
  files?: string[];
};

function buildResult(findings: TextHygieneFinding[], fileCount: number): AuditResult {
  if (findings.length === 0) {
    return {
      name: NAME,
      status: "PASS",
      failures: [],
      detail: `No text-hygiene findings in ${fileCount} file(s).`,
    };
  }

  const cells = new Map<string, { findings: number; items: Set<string> }>();
  const idsByFile = new Map<string, Set<string>>();
  for (const finding of findings) {
    const id = finding.topLevelId ?? NO_ID;
    const cellKey = `${finding.rule}|${finding.locationClass}`;
    const cell = cells.get(cellKey) ?? { findings: 0, items: new Set<string>() };
    cell.findings += 1;
    cell.items.add(`${finding.file}|${id}`);
    cells.set(cellKey, cell);
    const ids = idsByFile.get(finding.file) ?? new Set<string>();
    ids.add(id);
    idsByFile.set(finding.file, ids);
  }

  const lines: string[] = [];
  for (const rule of TEXT_HYGIENE_RULES) {
    for (const locationClass of LOCATION_CLASSES) {
      const cell = cells.get(`${rule.id}|${locationClass}`);
      if (cell) {
        lines.push(`  ${rule.id} ${rule.name} ${locationClass}: ${cell.findings} finding(s) in ${cell.items.size} item(s)`);
      }
    }
  }
  const files = [...idsByFile.keys()].sort(compareStrings);
  for (const file of files) {
    const ids = [...idsByFile.get(file)!].sort(compareStrings);
    lines.push(`  ${file} (${ids.length} item(s)): ${ids.join(", ")}`);
  }
  const failures = [...new Set(files.flatMap((file) => [...idsByFile.get(file)!]))].sort(compareStrings);

  return {
    name: NAME,
    status: "WARN",
    failures,
    detail: [
      `${findings.length} advisory text-hygiene finding(s) in ${failures.length} top-level item(s) across ${files.length} of ${fileCount} file(s). Not blocking.`,
      ...lines,
    ].join("\n"),
  };
}

async function runDefaultSweep(): Promise<AuditResult> {
  const files = (await readdir(PROMOTED_DIR)).filter((file) => file.endsWith(".json")).sort();
  const findings: TextHygieneFinding[] = [];
  let scanned = 0;

  for (const filename of files) {
    let raw: unknown;
    try {
      raw = parseBankText(await readFile(join(PROMOTED_DIR, filename), "utf8"));
    } catch {
      continue; // unreadable or unparseable banks are caught by Tier 0; skip here
    }
    scanned += 1;
    findings.push(...findTextHygieneFindings(raw, `${PROMOTED_DIR}/${filename}`));
  }

  return buildResult(findings, scanned);
}

async function runSelectedFiles(files: string[]): Promise<AuditResult> {
  const selected = dedupeSelectedFilePaths(files);
  const findings: TextHygieneFinding[] = [];
  const loadFailures: string[] = [];

  for (const { resolvedPath, displayPath } of selected) {
    let raw: unknown;
    try {
      raw = parseBankText(await readFile(resolvedPath, "utf8"));
    } catch (error) {
      loadFailures.push(`${displayPath}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }
    findings.push(...findTextHygieneFindings(raw, displayPath));
  }

  if (loadFailures.length > 0) {
    return {
      name: NAME,
      status: "FAIL",
      failures: selected.map(({ displayPath }) => displayPath),
      detail: [
        `${loadFailures.length} explicitly selected file(s) could not be read or parsed.`,
        ...loadFailures,
      ].join("\n"),
    };
  }
  return buildResult(findings, selected.length);
}

export async function runAuditTextHygiene(options: RunAuditTextHygieneOptions = {}): Promise<AuditResult> {
  if (options.files === undefined) return runDefaultSweep();
  if (options.files.length === 0) {
    return {
      name: NAME,
      status: "FAIL",
      failures: [],
      detail: "Explicit file selection is empty.",
    };
  }
  return runSelectedFiles(options.files);
}

function parseCliArgs(argv: string[]): RunAuditTextHygieneOptions {
  const files: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] !== "--file") throw new Error(`Unknown argument: ${argv[index]}`);
    const value = argv[index + 1];
    if (value === undefined) throw new Error("--file requires a path argument");
    if (value.trim() === "") throw new Error("--file requires a non-empty path argument");
    files.push(value);
    index += 1;
  }
  return { files: files.length > 0 ? files : undefined };
}

async function runCli(): Promise<void> {
  let options: RunAuditTextHygieneOptions;
  try {
    options = parseCliArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
    return;
  }
  const result = await runAuditTextHygiene(options);
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.status === "FAIL") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await runCli();
