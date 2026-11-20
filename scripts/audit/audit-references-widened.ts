// Opt-in scanner. The standing references gate has its own entry point.
import { readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { dedupeSelectedFilePaths } from "../../lib/selected-file-paths";
import { validateBankObject } from "../../src/schema";
import type { ItemType, Question, QuestionVisual } from "../../src/types";
import type { CensusData } from "../census";

type Locale = "en" | "zh";
type Rule = "DISPLAY_LETTER" | "STORED_ID" | "POSITIONAL_CUE" | "INTERNAL_TOKEN" | "DROPDOWN_INDEX";
type Classification = "OPTION_REFERENCE" | "NON_OPTION_TOKEN" | "UNCLEAR";
type KeyCheck = "MATCH" | "MISMATCH" | "NOT_APPLICABLE";

export type ReferenceOccurrence = {
  bankFile: string;
  topLevelId: string;
  nestedId?: string;
  itemType: ItemType;
  field: string;
  locale: Locale;
  /** Zero-based UTF-16 offsets in the original field, end exclusive. */
  start: number;
  end: number;
  matchedToken: string;
  rules: Rule[];
  classification: Classification;
  assertedKey?: Partial<Record<"DISPLAY_LETTER" | "STORED_ID", KeyCheck>>;
  excerpt?: string;
  containment?: "HELD_OUT_REDACTED";
};

type Field = { path: string; locale: Locale; text: string };
type Labels = { en?: string; zh?: string };

function* labelFields(path: string, labels?: Labels): Generator<Field> {
  for (const locale of ["en", "zh"] as const) {
    const text = labels?.[locale];
    if (text) yield { path: `${path}.${locale}`, locale, text };
  }
}

function* visualFields(visual: QuestionVisual, path: string): Generator<Field> {
  yield* labelFields(`${path}.caption`, visual.caption);
  // The caption also supplies the accessibility label. These figure kinds
  // have additional authored display strings.
  switch (visual.kind) {
    case "device_screen":
      yield* labelFields(`${path}.title`, visual.title);
      for (const [index, { text, unit }] of visual.settings.entries()) {
        if (text) yield { path: `${path}.settings[${index}].text`, locale: "en", text };
        if (unit) yield { path: `${path}.settings[${index}].unit`, locale: "en", text: unit };
      }
      break;
    case "io_record":
    case "io_trend":
      yield* labelFields(`${path}.periodLabel`, visual.periodLabel);
      if (visual.kind === "io_record") {
        for (const direction of ["intake", "output"] as const) {
          for (const [index, { label }] of visual[direction].entries()) {
            yield { path: `${path}.${direction}[${index}].label`, locale: "en", text: label };
          }
        }
      } else {
        for (const [index, label] of (visual.binLabels ?? []).entries()) {
          yield* labelFields(`${path}.binLabels[${index}]`, label);
        }
      }
      break;
    case "lab_trend":
      for (const [index, { unit }] of visual.series.entries()) {
        if (unit) yield { path: `${path}.series[${index}].unit`, locale: "en", text: unit };
      }
      break;
    case "mar":
      for (const [index, text] of visual.timeGrid.entries()) {
        yield { path: `${path}.timeGrid[${index}]`, locale: "en", text };
      }
      for (const [index, medication] of visual.medications.entries()) {
        for (const key of ["name", "dose", "frequency"] as const) {
          yield { path: `${path}.medications[${index}].${key}`, locale: "en", text: medication[key] };
        }
      }
      break;
    case "medication_label":
      yield { path: `${path}.drugName`, locale: "en", text: visual.drugName };
      for (const [index, { label, value }] of (visual.fields ?? []).entries()) {
        yield { path: `${path}.fields[${index}].label`, locale: "en", text: label };
        yield { path: `${path}.fields[${index}].value`, locale: "en", text: value };
      }
      break;
  }
}

function* explanatoryFields(question: Question): Generator<Field> {
  yield* labelFields("rationale.correct", question.rationale.correct);
  for (const [index, choice] of (question.rationale.byChoice ?? []).entries()) {
    yield* labelFields(`rationale.byChoice[${index}]`, choice);
  }
  for (const [index, visual] of (question.rationale.visuals ?? []).entries()) {
    yield* visualFields(visual, `rationale.visuals[${index}]`);
  }
  yield* labelFields("testTakingStrategy", question.testTakingStrategy);
  for (const [index, { termEn, termZh, defZh }] of question.glossary.entries()) {
    yield { path: `glossary[${index}].termEn`, locale: "en", text: termEn };
    yield { path: `glossary[${index}].termZh`, locale: "zh", text: termZh };
    yield { path: `glossary[${index}].defZh`, locale: "zh", text: defZh };
  }
  if (question.itemType === "case_study") {
    yield* labelFields("caseStudy.summary", question.caseStudy.summary);
  }
}

// Fold full-width ASCII and ideographic space. Each replacement is one UTF-16
// code unit, so indices continue to address the original, including after emoji.
const foldWidth = (text: string) => text.replace(/[\u3000\uFF01-\uFF5E]/g, (char) => char.normalize("NFKC"));
const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function choiceIds(question: Question): string[] {
  switch (question.itemType) {
    case "multiple_choice":
    case "select_all":
    case "ordered_response":
      return question.options.map(({ id }) => id);
    case "dropdown_cloze":
      return question.dropdowns.flatMap(({ options }) => options.map(({ id }) => id));
    case "matrix":
      return [...question.matrix.rows, ...question.matrix.columns].map(({ id }) => id);
    case "bowtie":
      return Object.values(question.bowtie).flatMap(({ tokens }) => tokens.map(({ id }) => id));
    default:
      return [];
  }
}

function liveKey(question: Question) {
  if (question.itemType !== "multiple_choice" && question.itemType !== "select_all" &&
      question.itemType !== "ordered_response") return;
  const ids = new Set(question.correct);
  return {
    letters: new Set(question.options.flatMap(({ id }, index) =>
      ids.has(id) ? ["ABCDEF"[index]] : [])),
    ids: new Set(question.correct.map(foldWidth)),
  };
}

type Context = "assertion" | "explicit" | "parenthetical" | "position" | "spatial";
type Pattern = { regex: RegExp; context: Context };

function tokenPatterns(locale: Locale, token: string, stored: boolean): Pattern[] {
  const capture = `(${token})`;
  // Keep the legacy display-letter boundaries. For exact stored IDs avoid
  // consuming the beginning of a longer word, including in Chinese prose.
  const end = stored ? idBoundary[locale] : locale === "en" ? "\\b" : "";
  const paren = String.raw`\([ \t]*${capture}[ \t]*\)`;
  if (locale === "en") {
    const verdict = String.raw`\s+is\s+(?:the\s+)?(?:correct|right|best)\b`;
    return [
      { regex: new RegExp(String.raw`\b(?:options?|choices?)(?:\s*:\s*|\s+)${capture}${end}`, "dgiu"), context: "explicit" },
      { regex: new RegExp(String.raw`\b(?:option|choice)\s+${capture}${verdict}`, "dgiu"), context: "assertion" },
      { regex: new RegExp(String.raw`\b(?:answer\s+is\s+|answer[:\s]+)(?:(?:option|choice)\s+)?${capture}${end}`, "dgiu"), context: "assertion" },
      { regex: new RegExp(String.raw`(?:^|[.!?;]\s+)${capture}${verdict}`, "dgmu"), context: "assertion" },
      { regex: new RegExp(paren, "dgu"), context: "parenthetical" },
    ];
  }

  const verdict = String.raw`\s*是(?:正确的|最佳|答案)`;
  return [
    { regex: new RegExp(String.raw`(?:选项|選項)\s*:?\s*${capture}${end}`, "dgu"), context: "explicit" },
    { regex: new RegExp(String.raw`(?:选项|選項)\s*${capture}${verdict}`, "dgu"), context: "assertion" },
    { regex: new RegExp(String.raw`^${capture}${verdict}`, "dgmu"), context: "assertion" },
    { regex: new RegExp(String.raw`答案\s*是\s*(?:(?:选项|選項)\s*)?${capture}${end}`, "dgu"), context: "assertion" },
    { regex: new RegExp(paren, "dgu"), context: "parenthetical" },
  ];
}

const idBoundary = {
  en: String.raw`(?![\p{L}\p{N}\p{M}_])`,
  zh: String.raw`(?!(?!\p{Script=Han})[\p{L}\p{N}\p{M}_])`,
};
const displayToken = { en: "[A-F]", zh: "[A-Fa-f]" };
const displayLiteral = { en: /^[A-F]$/, zh: /^[A-Fa-f]$/ };
const displayPatterns = {
  en: tokenPatterns("en", displayToken.en, false),
  zh: tokenPatterns("zh", displayToken.zh, false),
};
const listSeparator = {
  en: String.raw`(?:\s*,\s*(?:[Aa][Nn][Dd]\s+|[Oo][Rr]\s+)?|\s+(?:[Aa][Nn][Dd]|[Oo][Rr])\s+|\s*[/–—]\s*)`,
  zh: String.raw`\s*(?:[,、/]|和|或|及|与)\s*`,
};
const positionPatterns = {
  en: [
    /\b(?:first|second|third|fourth|fifth|sixth|last)\s+(?:option|answer|choice)\b/gi,
    /\b(?:the\s+)?(?:above|below)\s+(?:option|answer|choice)\b/gi,
    /\boption(?:s)?\s+(?:listed\s+)?(?:above|below)\b/gi,
    /\b(?:top|bottom)\s+(?:option|answer|choice)\b/gi,
    /\b(?:option|answer|choice)\s+(?:at|on)\s+the\s+(?:top|bottom)\b/gi,
  ],
  zh: [
    /第[一二三四五六两]个选项/g,
    /最后(?:一个)?选项/g,
    /以上(?:选项|答案|的选项|的答案)/g,
    /上述(?:选项|答案)/g,
  ],
};
const spatialPatterns = {
  en: [/\blisted\s+(?:above|below)\b/gi],
  zh: [/以上所述/g, /上述(?:选项|答案|内容|情况)?/g, /如上(?:所述|所示)/g],
};
const internalTokenPattern = /\bo\d+\b/g;
const dropdownIndexPattern = /\b[Dd]ropdown\s*\d+\b|下拉(?:菜单|框)\s*\d+|第[一二三四五六]个下拉(?:菜单|框)/g;

type Cue = { start: number; end: number; rules: Rule[]; context: Context; classification: Classification; assertedKey?: ReferenceOccurrence["assertedKey"] };
const contextRank: Record<Context, number> = { spatial: 0, parenthetical: 1, position: 2, explicit: 2, assertion: 3 };
const wordSegmenters = { en: new Intl.Segmenter("en", { granularity: "word" }), zh: new Intl.Segmenter("zh", { granularity: "word" }) };

function classifyToken(context: Context, locale: Locale, before: string): Classification {
  if (context !== "parenthetical") return "OPTION_REFERENCE";
  const optionPrefix = locale === "en" ? /\b(?:options?|choices?)\s*:?\s*$/i : /(?:选项|選項)\s*:?\s*$/;
  if (optionPrefix.test(before)) return "OPTION_REFERENCE";
  const otherPrefix = locale === "en" ? /\b(?:vitamin|table|figure|appendix|section)\s*$/i : /(?:维生素|附录|图表|表格)\s*$/;
  return otherPrefix.test(before) ? "NON_OPTION_TOKEN" : "UNCLEAR";
}

function excerpt(field: Field, start: number): string {
  const words = [...wordSegmenters[field.locale].segment(field.text)].filter((part) => part.isWordLike);
  if (words.length <= 20) return field.text;
  const first = words.findIndex((word) => word.index + word.segment.length > start);
  const from = Math.min(Math.max(0, (first < 0 ? words.length : first) - 9), words.length - 20);
  const previous = words[from - 1];
  return field.text.slice(previous ? previous.index + previous.segment.length : 0, words[from + 20]?.index).trim();
}

function cuesInField(
  field: Field,
  ids: Set<string>,
  patterns: Pattern[],
  list: RegExp,
  key: ReturnType<typeof liveKey>,
  itemType: ItemType,
): Cue[] {
  const folded = foldWidth(field.text);
  const occurrences = new Map<string, Cue>();

  function add(cue: Cue) {
    const id = `${cue.start}:${cue.end}`;
    const previous = occurrences.get(id);
    if (!previous) {
      occurrences.set(id, cue);
      return;
    }
    previous.rules = [...new Set([...previous.rules, ...cue.rules])];
    if (cue.assertedKey) previous.assertedKey = { ...previous.assertedKey, ...cue.assertedKey };
    if (contextRank[cue.context] > contextRank[previous.context]) {
      previous.context = cue.context;
      previous.classification = cue.classification;
    }
  }

  function tokens(text: string, rule: "DISPLAY_LETTER" | "STORED_ID", patterns: Pattern[]) {
    for (const { regex, context } of patterns) {
      for (const match of text.matchAll(regex)) {
        const [start, end] = match.indices![1];
        const token = match[1];
        if (rule === "STORED_ID" && !ids.has(token)) continue;
        const before = text.slice(0, match.index);
        const after = text.slice(match.index + match[0].length);
        if (context === "parenthetical" && field.locale === "en" && (
          (/^[a-z]$/.test(token) && (/^\s*\([a-z0-9]+\)/i.test(after) || /\([a-z0-9]+\)\s*$/i.test(before))) ||
          (/^\d+$/.test(token) && /\([a-z]\)\s*$/.test(before))
        )) continue;
        const classification = classifyToken(context, field.locale, before);
        const cue: Cue = { start, end, rules: [rule], context, classification };
        if (context === "assertion") {
          const agrees = rule === "DISPLAY_LETTER" ? key?.letters.has(token.toUpperCase()) : key?.ids.has(token);
          cue.assertedKey = { [rule]: agrees === undefined ? "NOT_APPLICABLE" : agrees ? "MATCH" : "MISMATCH" };
        }
        add(cue);
      }
    }
  }

  tokens(folded, "DISPLAY_LETTER", displayPatterns[field.locale]);
  tokens(folded, "STORED_ID", patterns);
  for (const first of [...occurrences.values()]) {
    if (first.context !== "explicit") continue;
    list.lastIndex = first.end;
    for (let match = list.exec(folded); match !== null; match = list.exec(folded)) {
      const [start, end] = match.indices![1];
      const token = match[1];
      const rules: Rule[] = [];
      if (displayLiteral[field.locale].test(token)) rules.push("DISPLAY_LETTER");
      if (ids.has(token)) rules.push("STORED_ID");
      add({ start, end, rules, context: "explicit", classification: "OPTION_REFERENCE" });
    }
  }
  // Folding adjacent characters can remove an ASCII word boundary used by the
  // old gate. Keep the original-width display and position matches as well.
  if (folded !== field.text) tokens(field.text, "DISPLAY_LETTER", displayPatterns[field.locale]);

  for (const text of new Set([folded, field.text])) {
    for (const [patterns, context, classification] of [
      [positionPatterns[field.locale], "position", "OPTION_REFERENCE"],
      [spatialPatterns[field.locale], "spatial", "UNCLEAR"],
    ] as const) {
      for (const pattern of patterns) {
        for (const match of text.matchAll(pattern)) {
          add({ start: match.index, end: match.index + match[0].length, rules: ["POSITIONAL_CUE"], context, classification });
        }
      }
    }
  }

  if (itemType === "multiple_choice" || itemType === "select_all" ||
      itemType === "ordered_response" || itemType === "dropdown_cloze") {
    for (const match of folded.matchAll(internalTokenPattern)) {
      if (!ids.has(match[0])) continue;
      add({
        start: match.index, end: match.index + match[0].length,
        rules: ["INTERNAL_TOKEN"], context: "explicit", classification: "OPTION_REFERENCE",
      });
    }
  }
  if (itemType === "dropdown_cloze") {
    for (const match of folded.matchAll(dropdownIndexPattern)) {
      add({
        start: match.index, end: match.index + match[0].length,
        rules: ["DROPDOWN_INDEX"], context: "position", classification: "OPTION_REFERENCE",
      });
    }
  }

  const cues = [...occurrences.values()];
  // A generic cue inside a more specific match refers to the same occurrence.
  return cues.filter((cue) => !cues.some((other) =>
    other.start <= cue.start && other.end >= cue.end &&
    ((cue.context === "spatial" && other.context === "position") ||
     (other.start === cue.start && other.end > cue.end &&
      other.rules.includes("STORED_ID") && cue.rules.includes("DISPLAY_LETTER"))),
  )).sort((a, b) => a.start - b.start || a.end - b.end);
}

export function scanQuestionReferences(
  bankFile: string,
  topLevel: Question,
  heldOutIds: ReadonlySet<string>,
): ReferenceOccurrence[] {
  const found: ReferenceOccurrence[] = [];
  const scan = (question: Question, prefix: string, nestedId?: string) => {
    const heldOut = heldOutIds.has(topLevel.id) || (nestedId !== undefined && heldOutIds.has(nestedId));
    const ids = new Set(choiceIds(question).map(foldWidth));
    const token = [...ids].sort((a, b) => b.length - a.length).map(escapeRegex).join("|");
    const patterns = token ? { en: tokenPatterns("en", token, true), zh: tokenPatterns("zh", token, true) } : null;
    const lists = Object.fromEntries((["en", "zh"] as const).map((locale) => {
      const candidates = token ? `${token}|${displayToken[locale]}` : displayToken[locale];
      return [locale, new RegExp(`${listSeparator[locale]}(${candidates})${idBoundary[locale]}`, "duy")];
    })) as Record<Locale, RegExp>;
    const key = liveKey(question);

    for (const field of explanatoryFields(question)) {
      const cues = cuesInField(field, ids, patterns?.[field.locale] ?? [], lists[field.locale], key, question.itemType);
      for (const { start, end, rules, classification, assertedKey } of cues) {
        found.push({
          bankFile,
          topLevelId: topLevel.id,
          ...(nestedId === undefined ? {} : { nestedId }),
          itemType: question.itemType,
          field: prefix + field.path,
          locale: field.locale,
          start,
          end,
          matchedToken: field.text.slice(start, end),
          rules,
          classification,
          ...(assertedKey && !heldOut ? { assertedKey } : {}),
          ...(heldOut ? { containment: "HELD_OUT_REDACTED" as const } : { excerpt: excerpt(field, start) }),
        });
      }
    }
  };

  scan(topLevel, "");
  if (topLevel.itemType === "case_study") {
    topLevel.caseStudy.questions.forEach((question, index) => {
      scan(question, `caseStudy.questions[${index}].`, question.id);
    });
  }
  return found;
}

export type SelectedBank = { file: string; questions: Question[] };
export type BankLoadFailure = { file: string; reason: "UNREADABLE" | "INVALID_JSON" | "INVALID_SCHEMA" | "EMPTY_SELECTION" };

export async function runWidenedReferences(files: readonly string[], heldOutIds: ReadonlySet<string>) {
  const banks: SelectedBank[] = [];
  const loadFailures: BankLoadFailure[] = [];
  if (files.length === 0) loadFailures.push({ file: "", reason: "EMPTY_SELECTION" });

  for (const { resolvedPath, displayPath } of dedupeSelectedFilePaths(files)) {
    let text: string;
    try {
      text = await readFile(resolvedPath, "utf8");
    } catch {
      loadFailures.push({ file: displayPath, reason: "UNREADABLE" });
      continue;
    }
    let payload: unknown;
    try {
      payload = JSON.parse(text.replace(/^\uFEFF/, ""));
    } catch {
      loadFailures.push({ file: displayPath, reason: "INVALID_JSON" });
      continue;
    }
    try {
      const result = validateBankObject(payload, { requireMeta: true, rejectUnknownKeys: true });
      if (result.ok) {
        banks.push({ file: displayPath, questions: result.value.questions });
        continue;
      }
    } catch {
      // Malformed nested shapes can throw during validation. Still fail closed.
    }
    loadFailures.push({ file: displayPath, reason: "INVALID_SCHEMA" });
  }

  const occurrences = banks.flatMap(({ file, questions }) =>
    questions.flatMap((question) => scanQuestionReferences(file, question, heldOutIds)));
  return {
    status: loadFailures.length || occurrences.length ? "FAIL" as const : "PASS" as const,
    banks,
    loadFailures,
    occurrences,
  };
}

export async function runBundledWidenedReferences(heldOutIds: ReadonlySet<string>) {
  const files = (await readdir("banks")).filter((name) => name.endsWith(".json")).sort();
  const { sessionUnits }: CensusData = JSON.parse(await readFile("census.json", "utf8"));
  const expectedFiles = sessionUnits.perFile.map(({ file }) => file).sort();
  if (files.length !== expectedFiles.length || files.some((file, index) => file !== expectedFiles[index])) {
    throw new Error("Bundled file selection differs from census.json");
  }

  const result = await runWidenedReferences(files.map((file) => join("banks", file)), heldOutIds);
  for (const { file, reason } of result.loadFailures) {
    throw new Error(`${file || "banks"}: ${reason}`);
  }

  const population = result.banks.map(({ file, questions }) => {
    const name = basename(file);
    const censusTopLevel = sessionUnits.perFile.find((entry) => entry.file === name)!.questionsLength;
    const censusCases = sessionUnits.caseStudies.filter((entry) => entry.bank === name);
    const cases = questions.filter((question) => question.itemType === "case_study");
    const nested = cases.reduce((count, question) => count + question.caseStudy.questions.length, 0);
    const censusNested = censusCases.reduce((count, entry) => count + entry.parts, 0);
    if (questions.length !== censusTopLevel || nested !== censusNested || cases.length !== censusCases.length ||
        cases.some((question) => !censusCases.some(({ id, parts }) =>
          id === question.id && parts === question.caseStudy.questions.length))) {
      throw new Error(`${file}: item population differs from census.json`);
    }
    return { file, topLevel: questions.length, nested, censusTopLevel, censusNested };
  });
  const topLevel = population.reduce((count, bank) => count + bank.topLevel, 0);
  const nested = population.reduce((count, bank) => count + bank.nested, 0);
  if (topLevel !== sessionUnits.total || nested !== sessionUnits.embeddedParts ||
      topLevel + nested !== sessionUnits.inventoryRecords) {
    throw new Error("Bundled item totals differ from census.json");
  }
  return { ...result, population, populationTotals: { files: files.length, topLevel, nested } };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    if (process.argv.length !== 2) throw new Error("This command takes no arguments");
    const { status, occurrences, populationTotals } = await runBundledWidenedReferences(new Set());
    const items = new Set(occurrences.map(({ topLevelId }) => topLevelId));
    console.log(`[${status}] audit:references:widened — ${occurrences.length} occurrences in ${items.size} items across ${populationTotals.files} scanned banks`);
    if (status === "FAIL") process.exitCode = 1;
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Bundled reference scan failed");
    process.exitCode = 1;
  }
}
