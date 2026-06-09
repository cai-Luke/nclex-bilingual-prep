/**
 * Tier 1 — positional-reference staleness and hazard inventory.
 *
 * Two sub-checks, both run over every rationale field (en + zh):
 *
 * 1. Stale-key detection: explicit "Option X is correct / X is the answer"
 *    assertions are extracted; the named letter is cross-checked against the
 *    item's live `correct` array. Any mismatch → FAIL.
 *
 * 2. Hazard inventory: any rationale text containing position/ordinal/spatial
 *    language (Option A–D, first/second/last option, above/below, 选项A–D,
 *    第一个/最后一个, 以上/上述) → FAIL.
 *    Rationale: once the position-agnostic generation rule (§3) is in effect,
 *    a hazard count > 0 is itself a failure.
 *
 * Can be run standalone:  tsx scripts/audit/audit-references.ts
 */

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { AuditResult } from "./types";
import type { Question, OptionQuestion } from "../../src/types";

const PROMOTED_DIR = "banks";

// ---------------------------------------------------------------------------
// Regex patterns
// ---------------------------------------------------------------------------

// English: explicit correctness assertions referencing a letter
const EN_ASSERTION_PATTERNS = [
  // "Option A is (the) correct/right/best answer" | "Option A is correct"
  /\boption\s+([A-D])\s+is\s+(?:the\s+)?(?:correct|right|best)\b/gi,
  // "The correct/right answer is (option) A"
  /\b(?:the\s+)?(?:correct|right|best)\s+answer\s+is\s+(?:option\s+)?([A-D])\b/gi,
  // "The answer is (option) A"
  /\bthe\s+answer\s+is\s+(?:option\s+)?([A-D])\b/gi,
  // "Answer: A" or "Answer is A"
  /\banswer[:\s]+(?:option\s+)?([A-D])\b/gi,
  // "A is correct/right/best" (bare letter at start or after punctuation)
  /(?:^|[.!?;]\s+)([A-D])\s+is\s+(?:the\s+)?(?:correct|right|best)\b/gm,
];

// English: positional/ordinal/spatial hazard patterns (non-capturing — any match is a hazard)
const EN_HAZARD_PATTERNS = [
  // "Option A" / "option B" — bare letter reference
  /\boption\s+[A-D]\b/gi,
  // "(A)" / "(B)" — parenthetical option letter
  /\([A-D]\)/g,
  // ordinal references to options
  /\b(?:first|second|third|fourth|last)\s+(?:option|answer|choice)\b/gi,
  // "the above/below option" or "option listed above/below" — option-specific spatial refs
  /\b(?:the\s+)?(?:above|below)\s+(?:option|answer|choice)\b/gi,
  /\boption(?:s)?\s+(?:listed\s+)?(?:above|below)\b/gi,
  /\blisted\s+(?:above|below)\b/gi,
];

// Chinese: explicit correctness assertions
const ZH_ASSERTION_PATTERNS = [
  // 选项A是正确的 / 选项A是答案 / 选项A最佳
  /选项\s*([A-Da-d])\s*是(?:正确的|最佳|最佳答案|答案)/g,
  // A是正确的答案 / A是答案
  /^([A-Da-d])\s*是(?:正确的|最佳|最佳答案|答案)/gm,
  // 正确答案是A / 答案是A / 答案是选项A
  /(?:正确答案|答案)\s*是\s*(?:选项\s*)?([A-Da-d])/g,
];

// Chinese: positional/spatial hazard patterns
// Patterns require clear option-referencing context; measurement uses of 以上/以下
// (e.g., "升至0 mmHg以上", "损伤水平以上") are excluded.
const ZH_HAZARD_PATTERNS = [
  // 选项A/B/C/D — direct option letter reference
  /选项\s*[A-Da-d]/g,
  // Parenthetical option letter (A)/(B) in Chinese text
  /\([A-Da-d]\)/g,
  // 第一个/第二个/最后一个选项
  /第[一二三四两]个选项/g,
  /最后(?:一个)?选项/g,
  // 以上所述 / 以上选项 / 以上答案 — option-referencing "above" constructs only
  /以上(?:所述|选项|答案|的选项|的答案)/g,
  // 上述 — always an option/text reference
  /上述(?:选项|答案|内容|情况)?/g,
  // 如上所述 / 如上所示
  /如上(?:所述|所示)/g,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract all letter references from assertion patterns in a text. */
function extractAssertions(text: string, patterns: RegExp[]): string[] {
  const letters: string[] = [];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = pattern.exec(text)) !== null) {
      // The first capture group holds the letter
      const letter = m[1]?.toUpperCase();
      if (letter) letters.push(letter);
    }
  }
  return letters;
}

/** Returns true if any hazard pattern matches anywhere in text. */
function hasHazard(text: string, patterns: RegExp[]): boolean {
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) return true;
  }
  return false;
}

/** All rationale text strings for a question (bilingual, all fields). */
function rationaleTexts(q: Question): Array<{ locale: "en" | "zh"; text: string; field: string }> {
  const out: Array<{ locale: "en" | "zh"; text: string; field: string }> = [];

  const push = (locale: "en" | "zh", text: string, field: string) => {
    if (text) out.push({ locale, text, field });
  };

  if (q.itemType === "case_study") {
    for (const nested of q.caseStudy.questions) {
      for (const item of rationaleTexts(nested)) out.push(item);
    }
    return out;
  }

  push("en", q.rationale.correct.en, "rationale.correct.en");
  push("zh", q.rationale.correct.zh, "rationale.correct.zh");

  if (q.rationale.byChoice) {
    q.rationale.byChoice.forEach((c, i) => {
      push("en", c.en, `rationale.byChoice[${i}].en`);
      push("zh", c.zh, `rationale.byChoice[${i}].zh`);
    });
  }

  return out;
}

/** The set of correct option IDs (uppercased) for an option-type question. */
function correctSet(q: Question): Set<string> {
  if (
    q.itemType === "multiple_choice" ||
    q.itemType === "select_all" ||
    q.itemType === "ordered_response"
  ) {
    return new Set((q as OptionQuestion).correct.map((id) => id.toUpperCase()));
  }
  return new Set();
}

// ---------------------------------------------------------------------------
// Core check
// ---------------------------------------------------------------------------

type ItemFailure = {
  id: string;
  staleKeys: string[];   // "field: asserted=X live=Y"
  hazards: string[];     // "field (en|zh)"
};

function checkQuestion(q: Question): ItemFailure | null {
  const live = correctSet(q);
  const staleKeys: string[] = [];
  const hazards: string[] = [];

  // For case_study, recurse and collect from nested questions
  if (q.itemType === "case_study") {
    const nested = q.caseStudy.questions.flatMap((nq) => {
      const r = checkQuestion(nq);
      return r ? [r] : [];
    });
    if (nested.length === 0) return null;
    return {
      id: q.id,
      staleKeys: nested.flatMap((n) => n.staleKeys.map((s) => `[${n.id}] ${s}`)),
      hazards: nested.flatMap((n) => n.hazards.map((h) => `[${n.id}] ${h}`)),
    };
  }

  for (const { locale, text, field } of rationaleTexts(q)) {
    // Stale-key check
    const assertionPatterns = locale === "en" ? EN_ASSERTION_PATTERNS : ZH_ASSERTION_PATTERNS;
    const asserted = extractAssertions(text, assertionPatterns);
    for (const letter of asserted) {
      if (live.size > 0 && !live.has(letter)) {
        staleKeys.push(`${field}: asserted="${letter}" live=[${[...live].join(",")}]`);
      }
    }

    // Hazard check
    const hazardPatterns = locale === "en" ? EN_HAZARD_PATTERNS : ZH_HAZARD_PATTERNS;
    if (hasHazard(text, hazardPatterns)) {
      hazards.push(field);
    }
  }

  if (staleKeys.length === 0 && hazards.length === 0) return null;
  return { id: q.id, staleKeys, hazards };
}

// ---------------------------------------------------------------------------
// Public runner
// ---------------------------------------------------------------------------

export async function runAuditReferences(): Promise<AuditResult> {
  const files = (await readdir(PROMOTED_DIR)).filter((f) => f.endsWith(".json")).sort();

  const itemFailures: ItemFailure[] = [];

  for (const filename of files) {
    try {
      const text = await readFile(join(PROMOTED_DIR, filename), "utf8");
      const raw = parseBankText(text);
      const result = validateBankObject(raw);
      if (!result.ok) continue; // structural failures handled by Tier 0

      for (const q of result.value.questions) {
        const f = checkQuestion(q);
        if (f) itemFailures.push(f);
      }
    } catch {
      // Unreadable files are caught by Tier 0; skip here
    }
  }

  const staleCount = itemFailures.filter((f) => f.staleKeys.length > 0).length;
  const hazardCount = itemFailures.filter((f) => f.hazards.length > 0).length;
  const failures = itemFailures.map((f) => f.id);

  const lines: string[] = [];
  for (const f of itemFailures) {
    lines.push(`${f.id}:`);
    for (const s of f.staleKeys) lines.push(`  [stale-key] ${s}`);
    for (const h of f.hazards) lines.push(`  [hazard]    ${h}`);
  }

  const detail =
    failures.length === 0
      ? "No stale key references or positional-language hazards found."
      : [
          `${staleCount} item(s) with stale key references, ${hazardCount} item(s) with positional-language hazards.`,
          ...lines,
        ].join("\n");

  return {
    name: "audit:references",
    status: failures.length === 0 ? "PASS" : "FAIL",
    failures,
    detail,
  };
}

// Standalone entry point
if (process.argv[1]?.includes("audit-references")) {
  const result = await runAuditReferences();
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.status === "FAIL") process.exit(1);
}
