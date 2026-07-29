export const PARSER_REASON_CODES = [
  "HEADING_SHAPE",
  "DERIVED_ID",
  "DUPLICATE_CORE",
  "ORPHAN_ATTACHMENT",
  "EMPTY_FIELD",
  "FIELD_ORDER",
  "UNKNOWN_FIELD",
  "MISSING_FIELD",
  "INVALID_FIELD_VALUE",
  "STATEMENT_LENGTH",
  "STATEMENT_SHAPE",
  "KIND_SECTION",
  "STATUS_KIND",
  "ANCHOR_CITATION",
  "ID_ON_NAME_ADDRESSED",
  "ARCHIVE_BLOCK_IN_DECISIONS",
  "TITLE_COLLISION",
  "DECLARED_TOTAL_SHAPE",
] as const;

export const CONFORMANCE_REASON_CODES = [
  "MISSING_DECLARED_TOTAL",
  "INDEX_BODY_MISMATCH",
  "INDEX_ORDER_MISMATCH",
  "DECLARED_TOTAL_MISMATCH",
  "UNTRACKED_PATH",
  "ALLOCATION_GAP",
  "ARCHIVE_INDEX_MISMATCH",
  "RETIRED_ID_CONFLICT",
] as const;

export type ParserReasonCode = (typeof PARSER_REASON_CODES)[number];
export type ConformanceReasonCode = (typeof CONFORMANCE_REASON_CODES)[number];
export type DecisionsFormatReasonCode = ParserReasonCode | ConformanceReasonCode;

export type LiveKind = "P" | "R" | "I" | "T";
export type OriginalKind = LiveKind;
export type ArchiveKind = "X";
export type EntryStatus = "ACTIVE" | "CONDITIONAL" | "PARKED" | "REVISIT" | "SUPERSEDED";
export type EntryForce = "BINDING" | "AUTHORIZING" | "ADVISORY" | "HISTORICAL";
export type ExecutionState = "EXECUTED" | "PENDING" | "INACTIVE";
export type AddressingMode = "id" | "name";

export interface FormatIssue {
  code: DecisionsFormatReasonCode;
  message: string;
  assertion?: number;
  source?: string;
  line?: number;
  blockKey?: string;
}

export interface LiveEntry {
  addressing: AddressingMode;
  id?: string;
  ordinal?: number;
  blockKey: string;
  title: string;
  headingLevel: 3 | 4;
  section: number;
  line: number;
  statement: string;
  statementSentences: number;
  kind?: LiveKind;
  status?: EntryStatus;
  force?: EntryForce;
  date?: string;
  authorized?: string;
  notAuthorized?: string;
  evidence?: string;
  owner?: string;
  execution?: ExecutionState;
  attachedTo?: string;
}

export interface EntryIndexRow {
  id?: string;
  kind: LiveKind;
  status: EntryStatus;
  force: EntryForce;
  summary: string;
  ordinal?: number;
  blockKey: string;
  line: number;
}

export interface EntryIndex {
  rows: EntryIndexRow[];
  declaredTotal?: number;
  declaredTotalLine?: number;
  present: boolean;
}

export interface ArchiveWrapper {
  addressing: AddressingMode;
  id?: string;
  blockKey: string;
  title: string;
  line: number;
  kind?: ArchiveKind;
  status?: EntryStatus;
  force?: EntryForce;
  date?: string;
  originalKind?: OriginalKind;
  originalStatus?: EntryStatus;
  retiredId?: string;
  origin?: {
    section: string;
    token: string;
  };
  body: string;
}

export interface ArchiveIndexLine {
  addressing: AddressingMode;
  label: string;
  id?: string;
  blockKey: string;
  pointer: {
    file: string;
    anchor: string;
  };
  line: number;
}

export interface RetiredIdentifierRow {
  id: string;
  disposition: "RETIRED" | "NEVER_ASSIGNED";
  date?: string;
  pointer?: string;
  graphState: "RETIRED" | "MISSING";
  line: number;
}

export interface ParsedDecisionsDocument {
  entries: LiveEntry[];
  index: EntryIndex;
  archiveIndex: ArchiveIndexLine[];
  retiredIdentifiers: RetiredIdentifierRow[];
  issues: FormatIssue[];
}

export interface ParsedArchiveDocument {
  wrappers: ArchiveWrapper[];
  issues: FormatIssue[];
}

export interface ConformanceInput {
  decisionsText: string;
  decisionsSource?: string;
  archiveText?: string;
  archiveSource?: string;
  trackedPaths?: ReadonlySet<string>;
}

export interface ConformanceResult {
  ok: boolean;
  issues: FormatIssue[];
  decisions: ParsedDecisionsDocument;
  archive?: ParsedArchiveDocument;
}

const LIVE_FIELD_ORDER = [
  "Kind",
  "Status",
  "Force",
  "Date",
  "Authorized",
  "Not authorized",
  "Evidence",
  "Owner",
  "Execution",
] as const;

const ARCHIVE_FIELD_ORDER = [
  "Kind",
  "Status",
  "Force",
  "Date",
  "Original Kind",
  "Original Status",
  "Retired ID",
  "Origin",
] as const;

const LIVE_KINDS = new Set<string>(["P", "R", "I", "T"]);
const STATUSES = new Set<string>(["ACTIVE", "CONDITIONAL", "PARKED", "REVISIT", "SUPERSEDED"]);
const FORCES = new Set<string>(["BINDING", "AUTHORIZING", "ADVISORY", "HISTORICAL"]);
const EXECUTIONS = new Set<string>(["EXECUTED", "PENDING", "INACTIVE"]);
const LIVE_STATUS_COMPATIBILITY: Readonly<Record<LiveKind, ReadonlySet<EntryStatus>>> = {
  P: new Set(["ACTIVE", "CONDITIONAL", "PARKED"]),
  R: new Set(["ACTIVE", "PARKED"]),
  I: new Set(["ACTIVE"]),
  T: new Set(["ACTIVE", "PARKED", "REVISIT"]),
};
const EXPECTED_SECTION: Readonly<Record<LiveKind, number>> = { P: 4, R: 5, I: 6, T: 7 };
const ABBREVIATIONS = ["e.g.", "i.e.", "etc.", "mr.", "mrs.", "ms.", "dr.", "no.", "vs."];
const FIELD_LINE = /^- \*\*([^*]+):\*\*(?: (.*))?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const REPOSITORY_PATH = /^`([^`\r\n]+)`$/;

interface SourceLine {
  text: string;
  start: number;
  end: number;
  number: number;
}

interface FieldParse {
  values: Map<string, string>;
  endIndex: number;
  issues: FormatIssue[];
}

function sourceLines(text: string): SourceLine[] {
  const lines: SourceLine[] = [];
  let start = 0;
  let number = 1;
  while (start < text.length) {
    const newline = text.indexOf("\n", start);
    const end = newline === -1 ? text.length : newline;
    const raw = text.slice(start, end);
    lines.push({
      text: raw.endsWith("\r") ? raw.slice(0, -1) : raw,
      start,
      end: newline === -1 ? end : end + 1,
      number,
    });
    if (newline === -1) break;
    start = newline + 1;
    number += 1;
  }
  if (text.length === 0 || text.endsWith("\n")) {
    lines.push({ text: "", start: text.length, end: text.length, number });
  }
  return lines;
}

function issue(
  code: DecisionsFormatReasonCode,
  message: string,
  options: Partial<Omit<FormatIssue, "code" | "message">> = {},
): FormatIssue {
  return { code, message, ...options };
}

function isUnicodeUppercase(character: string): boolean {
  return /\p{Lu}/u.test(character);
}

function abbreviationEndsAt(text: string, punctuationIndex: number): boolean {
  const lower = text.slice(0, punctuationIndex + 1).toLocaleLowerCase();
  return ABBREVIATIONS.some((abbreviation) => lower.endsWith(abbreviation));
}

export function countStatementSentences(statement: string): number {
  let count = 0;
  for (let index = 0; index < statement.length; index += 1) {
    const character = statement[index];
    if (character !== "." && character !== "?" && character !== "!") continue;

    const runStart = index;
    while (index + 1 < statement.length && /[.?!]/.test(statement[index + 1])) index += 1;
    const runEnd = index;

    if (
      character === "." &&
      runStart > 0 &&
      runEnd + 1 < statement.length &&
      /\d/.test(statement[runStart - 1]) &&
      /\d/.test(statement[runEnd + 1])
    ) {
      continue;
    }
    if (character === "." && abbreviationEndsAt(statement, runEnd)) continue;

    let next = runEnd + 1;
    while (next < statement.length && /["'”’`\)\]]/.test(statement[next])) next += 1;
    if (next === statement.length) {
      count += 1;
      continue;
    }
    if (!/\s/u.test(statement[next])) continue;
    while (next < statement.length && /\s/u.test(statement[next])) next += 1;
    if (next === statement.length || isUnicodeUppercase(statement[next])) count += 1;
  }
  return count;
}

function parseFields(
  lines: SourceLine[],
  startIndex: number,
  allowedOrder: readonly string[],
  source: string,
  blockKey?: string,
): FieldParse {
  const values = new Map<string, string>();
  const issues: FormatIssue[] = [];
  let index = startIndex;
  let lastOrder = -1;

  while (index < lines.length) {
    const line = lines[index];
    if (line.text.trim() === "" || /^#{2,4} /.test(line.text)) break;
    if (!line.text.startsWith("- **")) break;

    const match = FIELD_LINE.exec(line.text);
    if (!match) {
      issues.push(issue("UNKNOWN_FIELD", `Malformed or unknown field line: ${line.text}`, {
        source,
        line: line.number,
        blockKey,
      }));
      index += 1;
      continue;
    }

    const [, name, rawValue] = match;
    const order = allowedOrder.indexOf(name);
    if (order === -1) {
      issues.push(issue("UNKNOWN_FIELD", `Unknown field ${name}`, {
        source,
        line: line.number,
        blockKey,
      }));
    } else if (order < lastOrder) {
      issues.push(issue("FIELD_ORDER", `Field ${name} is out of order`, {
        source,
        line: line.number,
        blockKey,
      }));
    } else {
      lastOrder = order;
    }

    const value = rawValue ?? "";
    if (value.length === 0) {
      issues.push(issue("EMPTY_FIELD", `Field ${name} has an empty value`, {
        source,
        line: line.number,
        blockKey,
      }));
    }
    if (!values.has(name)) values.set(name, value);
    index += 1;
  }

  return { values, endIndex: index, issues };
}

function requireFields(
  fields: ReadonlyMap<string, string>,
  required: readonly string[],
  source: string,
  line: number,
  blockKey: string | undefined,
): FormatIssue[] {
  return required
    .filter((name) => !fields.has(name))
    .map((name) => issue("MISSING_FIELD", `Missing required field ${name}`, {
      source,
      line,
      blockKey,
    }));
}

function parseRepositoryPath(
  fields: ReadonlyMap<string, string>,
  name: "Evidence" | "Owner",
  source: string,
  line: number,
  blockKey: string,
  issues: FormatIssue[],
): string | undefined {
  const value = fields.get(name);
  if (value === undefined) return undefined;
  if (value.length === 0) return undefined;
  const match = REPOSITORY_PATH.exec(value);
  if (!match) {
    issues.push(issue("INVALID_FIELD_VALUE", `${name} must be one backticked repository path`, {
      source,
      line,
      blockKey,
    }));
    return undefined;
  }
  return match[1];
}

function validateVocabulary(
  fields: ReadonlyMap<string, string>,
  source: string,
  line: number,
  blockKey: string,
  issues: FormatIssue[],
): {
  kind?: LiveKind;
  status?: EntryStatus;
  force?: EntryForce;
  date?: string;
  execution?: ExecutionState;
} {
  const rawKind = fields.get("Kind");
  const rawStatus = fields.get("Status");
  const rawForce = fields.get("Force");
  const rawDate = fields.get("Date");
  const rawExecution = fields.get("Execution");
  const invalid = (field: string, value: string | undefined) => {
    issues.push(issue("INVALID_FIELD_VALUE", `Invalid ${field} value ${value ?? "<missing>"}`, {
      source,
      line,
      blockKey,
    }));
  };

  const kind = rawKind !== undefined && LIVE_KINDS.has(rawKind) ? rawKind as LiveKind : undefined;
  const status = rawStatus !== undefined && STATUSES.has(rawStatus) ? rawStatus as EntryStatus : undefined;
  const force = rawForce !== undefined && FORCES.has(rawForce) ? rawForce as EntryForce : undefined;
  const date = rawDate !== undefined && DATE.test(rawDate) ? rawDate : undefined;
  const execution = rawExecution !== undefined && EXECUTIONS.has(rawExecution)
    ? rawExecution as ExecutionState
    : undefined;

  if (rawKind !== undefined && kind === undefined) invalid("Kind", rawKind);
  if (rawStatus !== undefined && status === undefined) invalid("Status", rawStatus);
  if (rawForce !== undefined && force === undefined) invalid("Force", rawForce);
  if (rawDate !== undefined && date === undefined) invalid("Date", rawDate);
  if (rawExecution !== undefined && execution === undefined) invalid("Execution", rawExecution);

  return { kind, status, force, date, execution };
}

function sectionByLine(lines: SourceLine[]): number[] {
  const sections: number[] = [];
  let section = 0;
  for (const line of lines) {
    const match = /^## (\d+)(?:\.|\s|$)/.exec(line.text);
    if (match) section = Number(match[1]);
    sections.push(section);
  }
  return sections;
}

function markdownHeadingAnchor(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizedDocumentPath(path: string): string {
  return path.replaceAll("\\", "/").replace(/^\.\//, "");
}

function nextHeadingIndex(lines: SourceLine[], start: number, maximumLevel = 4): number {
  for (let index = start; index < lines.length; index += 1) {
    const match = /^(#{2,4}) /.exec(lines[index].text);
    if (match && match[1].length <= maximumLevel) return index;
  }
  return lines.length;
}

function statementAndFieldStart(
  lines: SourceLine[],
  headingIndex: number,
  blockEnd: number,
  source: string,
  blockKey: string | undefined,
): { statement: string; fieldStart: number; issues: FormatIssue[] } {
  const issues: FormatIssue[] = [];
  let index = headingIndex + 1;
  while (index < blockEnd && lines[index].text.trim() === "") index += 1;
  const statementStart = index;
  while (index < blockEnd && lines[index].text.trim() !== "") index += 1;
  const statementLines = lines.slice(statementStart, index);
  const statement = statementLines.map((line) => line.text.trim()).join(" ");

  if (
    statementLines.length === 0 ||
    statementLines.some((line) => /^[-*+] |^```|^#{1,6} /.test(line.text.trim()))
  ) {
    issues.push(issue("STATEMENT_SHAPE", "Statement must be one prose paragraph", {
      source,
      line: lines[headingIndex].number,
      blockKey,
    }));
  }

  const sentences = countStatementSentences(statement);
  if (sentences < 1 || sentences > 3) {
    issues.push(issue("STATEMENT_LENGTH", `Statement has ${sentences} sentence boundaries; expected 1–3`, {
      source,
      line: lines[headingIndex].number,
      blockKey,
    }));
  }

  while (index < blockEnd && lines[index].text.trim() === "") index += 1;
  return { statement, fieldStart: index, issues };
}

export function parseEntryIndex(text: string, source = "DECISIONS.md"): {
  index: EntryIndex;
  issues: FormatIssue[];
} {
  const lines = sourceLines(text);
  const sections = sectionByLine(lines);
  const issues: FormatIssue[] = [];
  const rows: EntryIndexRow[] = [];
  const ordinals = new Map<string, number>();
  let present = false;
  let declaredTotal: number | undefined;
  let declaredTotalLine: number | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    if (sections[index] !== 3 || lines[index].text !== "| ID | kind | status | force | summary |") continue;
    present = true;
    index += 1;
    if (lines[index]?.text !== "|---|---|---|---|---|") {
      issues.push(issue("INVALID_FIELD_VALUE", "Entry-index separator row is malformed", {
        source,
        line: lines[index]?.number ?? lines[index - 1].number,
      }));
      continue;
    }

    for (index += 1; index < lines.length; index += 1) {
      const line = lines[index];
      if (line.text.trim() === "") break;
      const match = /^\| ([^|]+?) \| ([^|]+?) \| ([^|]+?) \| ([^|]+?) \| (.+?) \|$/.exec(line.text);
      if (!match) {
        issues.push(issue("INVALID_FIELD_VALUE", "Malformed entry-index row", {
          source,
          line: line.number,
        }));
        continue;
      }
      const [, rawId, rawKind, rawStatus, rawForce, summary] = match;
      if (!LIVE_KINDS.has(rawKind) || !STATUSES.has(rawStatus) || !FORCES.has(rawForce)) {
        issues.push(issue("INVALID_FIELD_VALUE", "Entry-index row contains an invalid closed-vocabulary value", {
          source,
          line: line.number,
        }));
        continue;
      }

      if (rawId === "—") {
        rows.push({
          kind: rawKind as LiveKind,
          status: rawStatus as EntryStatus,
          force: rawForce as EntryForce,
          summary,
          blockKey: summary,
          line: line.number,
        });
      } else if (/^(P|R)\d+$/.test(rawId)) {
        const ordinal = ordinals.get(rawId) ?? 0;
        ordinals.set(rawId, ordinal + 1);
        rows.push({
          id: rawId,
          kind: rawKind as LiveKind,
          status: rawStatus as EntryStatus,
          force: rawForce as EntryForce,
          summary,
          ordinal,
          blockKey: `${rawId}#${ordinal}`,
          line: line.number,
        });
      } else {
        issues.push(issue("INVALID_FIELD_VALUE", `Invalid entry-index ID ${rawId}`, {
          source,
          line: line.number,
        }));
      }
    }

    let declaredIndex = index;
    if (lines[declaredIndex]?.text.trim() === "") declaredIndex += 1;
    const declaredLine = lines[declaredIndex];
    if (declaredLine?.text.startsWith("**Declared total:**")) {
      const match = /^\*\*Declared total:\*\* (\d+) entry blocks\.$/.exec(declaredLine.text);
      if (match) {
        declaredTotal = Number(match[1]);
        declaredTotalLine = declaredLine.number;
      } else {
        issues.push(issue("DECLARED_TOTAL_SHAPE", "Malformed declared-total line", {
          source,
          line: declaredLine.number,
        }));
      }
    }
    break;
  }

  return {
    index: { rows, declaredTotal, declaredTotalLine, present },
    issues,
  };
}

export function parseArchiveIndexLines(text: string, source = "DECISIONS.md"): {
  lines: ArchiveIndexLine[];
  issues: FormatIssue[];
} {
  const input = sourceLines(text);
  const sections = sectionByLine(input);
  const result: ArchiveIndexLine[] = [];
  const issues: FormatIssue[] = [];

  for (let index = 0; index < input.length; index += 1) {
    if (sections[index] !== 8) continue;
    const labelMatch = /^- \*\*(.+)\*\* — .+$/.exec(input[index].text);
    if (!labelMatch) continue;
    const pointerMatch = /^  `([^`#]+)#([^`]+)`$/.exec(input[index + 1]?.text ?? "");
    if (!pointerMatch) {
      issues.push(issue("INVALID_FIELD_VALUE", "Archive-index line requires an indented backticked pointer", {
        source,
        line: input[index].number,
      }));
      continue;
    }
    const label = labelMatch[1];
    const idMatch = /^((?:P|R)\d+) (.+)$/.exec(label);
    result.push({
      addressing: idMatch ? "id" : "name",
      label,
      id: idMatch?.[1],
      blockKey: idMatch ? `${idMatch[1]}#0` : label,
      pointer: { file: pointerMatch[1], anchor: pointerMatch[2] },
      line: input[index].number,
    });
    index += 1;
  }
  return { lines: result, issues };
}

export function parseRetiredIdentifierRegister(text: string, source = "DECISIONS.md"): {
  rows: RetiredIdentifierRow[];
  issues: FormatIssue[];
} {
  const input = sourceLines(text);
  const sections = sectionByLine(input);
  const rows: RetiredIdentifierRow[] = [];
  const issues: FormatIssue[] = [];

  for (let index = 0; index < input.length; index += 1) {
    if (sections[index] !== 8 || input[index].text !== "| ID | disposition | date | pointer |") continue;
    index += 2;
    while (index < input.length && input[index].text.startsWith("|")) {
      const cells = input[index].text.split("|").slice(1, -1).map((cell) => cell.trim());
      if (cells.length !== 4 || !/^(P|R)\d+$/.test(cells[0])) {
        issues.push(issue("INVALID_FIELD_VALUE", "Malformed retired-identifier row", {
          source,
          line: input[index].number,
        }));
        index += 1;
        continue;
      }
      const [id, rawDisposition, rawDate, rawPointer] = cells;
      if (rawDisposition !== "RETIRED" && rawDisposition !== "NEVER ASSIGNED") {
        issues.push(issue("INVALID_FIELD_VALUE", `Invalid retired disposition ${rawDisposition}`, {
          source,
          line: input[index].number,
        }));
        index += 1;
        continue;
      }
      const disposition: RetiredIdentifierRow["disposition"] = rawDisposition === "RETIRED"
        ? "RETIRED"
        : "NEVER_ASSIGNED";
      const date = rawDate === "—" ? undefined : rawDate;
      const pointerMatch = rawPointer === "—" ? undefined : REPOSITORY_PATH.exec(rawPointer)?.[1];
      if (
        (date !== undefined && !DATE.test(date)) ||
        (rawPointer !== "—" && pointerMatch === undefined) ||
        (disposition === "RETIRED" && (date === undefined || pointerMatch === undefined)) ||
        (disposition === "NEVER_ASSIGNED" && (date !== undefined || rawPointer !== "—"))
      ) {
        issues.push(issue("INVALID_FIELD_VALUE", `Invalid retired-register values for ${id}`, {
          source,
          line: input[index].number,
        }));
      }
      rows.push({
        id,
        disposition,
        date,
        pointer: pointerMatch,
        graphState: disposition === "RETIRED" ? "RETIRED" : "MISSING",
        line: input[index].number,
      });
      index += 1;
    }
    break;
  }
  return { rows, issues };
}

export function parseDecisionsDocument(text: string, source = "DECISIONS.md"): ParsedDecisionsDocument {
  const lines = sourceLines(text);
  const sections = sectionByLine(lines);
  const entries: LiveEntry[] = [];
  const issues: FormatIssue[] = [];
  const coreIds = new Map<string, LiveEntry>();
  const attachmentCounts = new Map<string, number>();
  const nameTitles = new Map<string, LiveEntry>();
  let nearestCoreId: string | undefined;

  const indexResult = parseEntryIndex(text, source);
  const archiveIndexResult = parseArchiveIndexLines(text, source);
  const registerResult = parseRetiredIdentifierRegister(text, source);
  issues.push(...indexResult.issues, ...archiveIndexResult.issues, ...registerResult.issues);

  const entryAnchorTargets = new Set<string>();
  for (let index = 0; index < lines.length; index += 1) {
    if (sections[index] < 4 || sections[index] > 7) continue;
    const match = /^### (.+)$/.exec(lines[index].text);
    if (!match) continue;
    entryAnchorTargets.add(markdownHeadingAnchor(match[1]));
    const id = /^((?:P|R)\d+) — /.exec(match[1])?.[1];
    if (id) entryAnchorTargets.add(id.toLowerCase());
  }
  for (const match of text.matchAll(/\]\(#([^)]+)\)/g)) {
    if (!entryAnchorTargets.has(match[1].toLowerCase())) continue;
    const before = text.slice(0, match.index);
    issues.push(issue("ANCHOR_CITATION", "Markdown anchor citation into DECISIONS.md is forbidden", {
      source,
      line: before.split("\n").length,
    }));
  }

  for (let headingIndex = 0; headingIndex < lines.length; headingIndex += 1) {
    const headingMatch = /^(#{3,4}) (.+)$/.exec(lines[headingIndex].text);
    if (!headingMatch || sections[headingIndex] < 4 || sections[headingIndex] > 8) continue;
    const level = headingMatch[1].length as 3 | 4;
    const rawHeading = headingMatch[2];
    const section = sections[headingIndex];
    const blockEnd = nextHeadingIndex(lines, headingIndex + 1);

    if (section === 8) {
      let scan = headingIndex + 1;
      while (scan < blockEnd && lines[scan].text.trim() === "") scan += 1;
      const fieldResult = parseFields(lines, scan, ARCHIVE_FIELD_ORDER, source);
      if (fieldResult.values.get("Kind") === "X" || fieldResult.values.has("Retired ID")) {
        issues.push(issue("ARCHIVE_BLOCK_IN_DECISIONS", "Archive wrapper appears inside DECISIONS.md", {
          source,
          line: lines[headingIndex].number,
        }));
      }
      continue;
    }
    if (level === 3) nearestCoreId = undefined;

    let id: string | undefined;
    let title = rawHeading;
    let addressing: AddressingMode = "name";
    let malformedCode: ParserReasonCode | undefined;
    const validIdHeading = /^((?:P|R)\d+) — ([^—`]+)$/.exec(rawHeading);
    const derivedHeading = /^((?:P|R)\d+(?:\.\d+|[A-Za-z]+)) — /.exec(rawHeading);
    const idLikeMalformed = /^(?:P|R)\d+\s+-\s+/.test(rawHeading) || /^(?:P|R)\d+\s+—/.test(rawHeading);

    if (validIdHeading) {
      addressing = "id";
      id = validIdHeading[1];
      title = validIdHeading[2];
    } else if (derivedHeading) {
      malformedCode = "DERIVED_ID";
    } else if (idLikeMalformed || (level === 4 && /^(?:P|R)/.test(rawHeading)) || rawHeading.includes(" — ")) {
      malformedCode = "HEADING_SHAPE";
    }

    const provisionalKey = id ? `${id}#${level === 3 ? 0 : (attachmentCounts.get(id) ?? 0) + 1}` : title;
    const content = statementAndFieldStart(lines, headingIndex, blockEnd, source, provisionalKey);
    issues.push(...content.issues);
    const fieldResult = parseFields(lines, content.fieldStart, LIVE_FIELD_ORDER, source, provisionalKey);
    issues.push(...fieldResult.issues);
    for (let trailing = fieldResult.endIndex; trailing < blockEnd; trailing += 1) {
      if (lines[trailing].text.trim() !== "") {
        issues.push(issue("UNKNOWN_FIELD", `Unexpected line after field list: ${lines[trailing].text}`, {
          source,
          line: lines[trailing].number,
          blockKey: provisionalKey,
        }));
      }
    }
    issues.push(...requireFields(
      fieldResult.values,
      ["Kind", "Status", "Force", "Date"],
      source,
      lines[headingIndex].number,
      provisionalKey,
    ));

    if (
      (/^[IT]\d+ — /.test(rawHeading) || validIdHeading !== null) &&
      ["I", "T"].includes(fieldResult.values.get("Kind") ?? "")
    ) {
      malformedCode = "ID_ON_NAME_ADDRESSED";
    }
    if (malformedCode) {
      issues.push(issue(malformedCode, `Invalid entry heading: ${rawHeading}`, {
        source,
        line: lines[headingIndex].number,
        blockKey: provisionalKey,
      }));
      continue;
    }

    const vocabulary = validateVocabulary(
      fieldResult.values,
      source,
      lines[headingIndex].number,
      provisionalKey,
      issues,
    );
    const kind = vocabulary.kind;
    if (kind && vocabulary.status && !LIVE_STATUS_COMPATIBILITY[kind].has(vocabulary.status)) {
      issues.push(issue("STATUS_KIND", `${kind} may not carry status ${vocabulary.status}`, {
        source,
        line: lines[headingIndex].number,
        blockKey: provisionalKey,
      }));
    }
    if (kind && EXPECTED_SECTION[kind] !== section) {
      issues.push(issue("KIND_SECTION", `${kind} entry appears in section ${section}`, {
        source,
        line: lines[headingIndex].number,
        blockKey: provisionalKey,
      }));
    }
    if (fieldResult.values.get("Kind") === "X") {
      issues.push(issue("ARCHIVE_BLOCK_IN_DECISIONS", "Archive wrapper appears inside DECISIONS.md", {
        source,
        line: lines[headingIndex].number,
        blockKey: provisionalKey,
      }));
      continue;
    }

    if (addressing === "id" && kind && kind !== id?.[0]) {
      issues.push(issue("INVALID_FIELD_VALUE", `Heading identifier ${id} disagrees with Kind ${kind}`, {
        source,
        line: lines[headingIndex].number,
        blockKey: provisionalKey,
      }));
    }
    if (addressing === "name" && kind && (kind === "P" || kind === "R")) {
      issues.push(issue("HEADING_SHAPE", `${kind} entry requires an identifier heading`, {
        source,
        line: lines[headingIndex].number,
        blockKey: provisionalKey,
      }));
    }
    if (level === 4 && (kind === "I" || kind === "T" || addressing === "name")) {
      issues.push(issue("ORPHAN_ATTACHMENT", "Only ID-addressed P/R entries may have attachments", {
        source,
        line: lines[headingIndex].number,
        blockKey: provisionalKey,
      }));
      continue;
    }

    let ordinal: number | undefined;
    let attachedTo: string | undefined;
    let blockKey = provisionalKey;
    if (id) {
      if (level === 3) {
        ordinal = 0;
        blockKey = `${id}#0`;
        if (coreIds.has(id)) {
          issues.push(issue("DUPLICATE_CORE", `Duplicate core for ${id}`, {
            source,
            line: lines[headingIndex].number,
            blockKey,
          }));
        }
      } else {
        const core = coreIds.get(id);
        if (!core || nearestCoreId !== id) {
          issues.push(issue("ORPHAN_ATTACHMENT", `Attachment ${id} has no preceding matching core`, {
            source,
            line: lines[headingIndex].number,
            blockKey,
          }));
          continue;
        }
        ordinal = (attachmentCounts.get(id) ?? 0) + 1;
        attachmentCounts.set(id, ordinal);
        blockKey = `${id}#${ordinal}`;
        attachedTo = `${id}#0`;
      }
    } else if (nameTitles.has(title)) {
      issues.push(issue("TITLE_COLLISION", `Duplicate name-addressed title ${title}`, {
        source,
        line: lines[headingIndex].number,
        blockKey,
      }));
    }

    const entry: LiveEntry = {
      addressing,
      id,
      ordinal,
      blockKey,
      title,
      headingLevel: level,
      section,
      line: lines[headingIndex].number,
      statement: content.statement,
      statementSentences: countStatementSentences(content.statement),
      kind,
      status: vocabulary.status,
      force: vocabulary.force,
      date: vocabulary.date,
      authorized: fieldResult.values.get("Authorized"),
      notAuthorized: fieldResult.values.get("Not authorized"),
      evidence: parseRepositoryPath(
        fieldResult.values,
        "Evidence",
        source,
        lines[headingIndex].number,
        blockKey,
        issues,
      ),
      owner: parseRepositoryPath(
        fieldResult.values,
        "Owner",
        source,
        lines[headingIndex].number,
        blockKey,
        issues,
      ),
      execution: vocabulary.execution,
      attachedTo,
    };
    entries.push(entry);
    if (id && level === 3) {
      nearestCoreId = id;
      if (!coreIds.has(id)) coreIds.set(id, entry);
    }
    if (!id && !nameTitles.has(title)) nameTitles.set(title, entry);
  }

  return {
    entries,
    index: indexResult.index,
    archiveIndex: archiveIndexResult.lines,
    retiredIdentifiers: registerResult.rows,
    issues,
  };
}

export function parseArchiveDocument(text: string, source = "archive.md"): ParsedArchiveDocument {
  const lines = sourceLines(text);
  const wrappers: ArchiveWrapper[] = [];
  const issues: FormatIssue[] = [];
  const keys = new Set<string>();

  const headingIndices = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /^### /.test(line.text))
    .map(({ index }) => index);

  for (let headingPosition = 0; headingPosition < headingIndices.length; headingPosition += 1) {
    const headingIndex = headingIndices[headingPosition];
    const nextHeading = headingIndices[headingPosition + 1] ?? lines.length;
    const rawHeading = lines[headingIndex].text.slice(4);
    const idMatch = /^((?:P|R)\d+) — ([^—`]+)$/.exec(rawHeading);
    const derived = /^(?:P|R)\d+(?:\.\d+|[A-Za-z]+) — /.test(rawHeading);
    const malformedId = /^(?:P|R)\d+\s+-\s+/.test(rawHeading);
    if (derived || malformedId || (/^(?:P|R)\d+/.test(rawHeading) && !idMatch)) {
      issues.push(issue(derived ? "DERIVED_ID" : "HEADING_SHAPE", `Invalid archive heading: ${rawHeading}`, {
        source,
        line: lines[headingIndex].number,
      }));
      continue;
    }

    const addressing: AddressingMode = idMatch ? "id" : "name";
    const id = idMatch?.[1];
    const title = idMatch?.[2] ?? rawHeading;
    const blockKey = id ? `${id}#0` : title;
    if (keys.has(blockKey)) {
      issues.push(issue(id ? "DUPLICATE_CORE" : "TITLE_COLLISION", `Duplicate archive wrapper ${blockKey}`, {
        source,
        line: lines[headingIndex].number,
        blockKey,
      }));
    }
    keys.add(blockKey);

    let fieldStart = headingIndex + 1;
    while (fieldStart < nextHeading && lines[fieldStart].text.trim() === "") fieldStart += 1;
    const fieldResult = parseFields(lines, fieldStart, ARCHIVE_FIELD_ORDER, source, blockKey);
    issues.push(...fieldResult.issues);
    issues.push(...requireFields(
      fieldResult.values,
      ["Kind", "Status", "Force", "Date", "Original Kind", "Original Status", "Origin"],
      source,
      lines[headingIndex].number,
      blockKey,
    ));

    const invalid = (message: string) => issues.push(issue("INVALID_FIELD_VALUE", message, {
      source,
      line: lines[headingIndex].number,
      blockKey,
    }));
    const kind = fieldResult.values.get("Kind") === "X" ? "X" : undefined;
    const status = fieldResult.values.get("Status") === "SUPERSEDED" ? "SUPERSEDED" : undefined;
    const force = fieldResult.values.get("Force") === "HISTORICAL" ? "HISTORICAL" : undefined;
    const rawDate = fieldResult.values.get("Date");
    const date = rawDate && DATE.test(rawDate) ? rawDate : undefined;
    const rawOriginalKind = fieldResult.values.get("Original Kind");
    const originalKind = rawOriginalKind && LIVE_KINDS.has(rawOriginalKind)
      ? rawOriginalKind as OriginalKind
      : undefined;
    const rawOriginalStatus = fieldResult.values.get("Original Status");
    const originalStatus = rawOriginalStatus && STATUSES.has(rawOriginalStatus)
      ? rawOriginalStatus as EntryStatus
      : undefined;
    const retiredId = fieldResult.values.get("Retired ID");

    if (fieldResult.values.has("Kind") && kind === undefined) invalid("Archive Kind must be X");
    if (fieldResult.values.has("Status") && status === undefined) invalid("Archive Status must be SUPERSEDED");
    if (fieldResult.values.has("Force") && force === undefined) invalid("Archive Force must be HISTORICAL");
    if (rawDate !== undefined && date === undefined) invalid(`Invalid archive Date ${rawDate}`);
    if (rawOriginalKind !== undefined && originalKind === undefined) invalid(`Invalid Original Kind ${rawOriginalKind}`);
    if (rawOriginalStatus !== undefined && originalStatus === undefined) {
      invalid(`Invalid Original Status ${rawOriginalStatus}`);
    }
    if (addressing === "id") {
      if (!fieldResult.values.has("Retired ID")) {
        issues.push(issue("MISSING_FIELD", "ID-addressed archive wrapper requires Retired ID", {
          source,
          line: lines[headingIndex].number,
          blockKey,
        }));
      } else if (retiredId !== id) {
        invalid(`Retired ID ${retiredId} does not match heading ${id}`);
      }
      if (originalKind && originalKind !== id?.[0]) invalid(`Original Kind ${originalKind} disagrees with ${id}`);
    } else {
      if (fieldResult.values.has("Retired ID")) invalid("Name-addressed archive wrapper forbids Retired ID");
      if (originalKind && originalKind !== "I" && originalKind !== "T") {
        invalid(`Name-addressed archive wrapper cannot have Original Kind ${originalKind}`);
      }
    }

    const rawOrigin = fieldResult.values.get("Origin");
    const originMatch = rawOrigin
      ? /^`([^`]+)` (.+) at `MIGRATION_BASELINE`$/.exec(rawOrigin)
      : undefined;
    if (rawOrigin !== undefined && !originMatch) invalid(`Invalid Origin ${rawOrigin}`);

    let bodyStartIndex = fieldResult.endIndex;
    if (bodyStartIndex < nextHeading && lines[bodyStartIndex].text.trim() === "") bodyStartIndex += 1;
    const bodyStart = lines[bodyStartIndex]?.start ?? lines[nextHeading]?.start ?? text.length;
    const bodyEnd = lines[nextHeading]?.start ?? text.length;
    const body = text.slice(bodyStart, bodyEnd);

    wrappers.push({
      addressing,
      id,
      blockKey,
      title,
      line: lines[headingIndex].number,
      kind,
      status,
      force,
      date,
      originalKind,
      originalStatus,
      retiredId,
      origin: originMatch ? { section: `${originMatch[1]} ${originMatch[2]}`, token: "MIGRATION_BASELINE" } : undefined,
      body,
    });
  }

  return { wrappers, issues };
}

function compareKeys(
  indexKeys: string[],
  bodyKeys: string[],
  source: string,
  issues: FormatIssue[],
): void {
  const indexSet = new Set(indexKeys);
  const bodySet = new Set(bodyKeys);
  const missingBody = indexKeys.filter((key) => !bodySet.has(key));
  const missingIndex = bodyKeys.filter((key) => !indexSet.has(key));
  if (missingBody.length > 0 || missingIndex.length > 0) {
    issues.push(issue(
      "INDEX_BODY_MISMATCH",
      `Index-only keys: ${missingBody.join(", ") || "none"}; body-only keys: ${missingIndex.join(", ") || "none"}`,
      { source, assertion: 12 },
    ));
    return;
  }
  if (indexKeys.length === bodyKeys.length && indexKeys.some((key, index) => key !== bodyKeys[index])) {
    issues.push(issue(
      "INDEX_ORDER_MISMATCH",
      `Index order ${indexKeys.join(", ")} differs from body order ${bodyKeys.join(", ")}`,
      { source, assertion: 12 },
    ));
  }
}

function allocationIssues(
  entries: readonly LiveEntry[],
  register: readonly RetiredIdentifierRow[],
  source: string,
): FormatIssue[] {
  const issues: FormatIssue[] = [];
  for (const prefix of ["P", "R"] as const) {
    const numbers = new Set<number>();
    for (const entry of entries) {
      if (entry.headingLevel === 3 && entry.id?.startsWith(prefix)) numbers.add(Number(entry.id.slice(1)));
    }
    for (const row of register) {
      if (row.id.startsWith(prefix)) numbers.add(Number(row.id.slice(1)));
    }
    if (numbers.size === 0) continue;
    const maximum = Math.max(...numbers);
    const missing: string[] = [];
    for (let value = 1; value <= maximum; value += 1) {
      if (!numbers.has(value)) missing.push(`${prefix}${value}`);
    }
    if (missing.length > 0) {
      issues.push(issue("ALLOCATION_GAP", `${prefix} allocation union is missing ${missing.join(", ")}`, {
        source,
        assertion: 11,
      }));
    }
  }
  return issues;
}

export function checkDecisionsFormat(input: ConformanceInput): ConformanceResult {
  const decisionsSource = input.decisionsSource ?? "DECISIONS.md";
  const archiveSource = input.archiveSource ?? "archive.md";
  const decisions = parseDecisionsDocument(input.decisionsText, decisionsSource);
  const archive = input.archiveText === undefined
    ? undefined
    : parseArchiveDocument(input.archiveText, archiveSource);
  const issues = [...decisions.issues, ...(archive?.issues ?? [])];

  const indexKeys = decisions.index.rows.map((row) => row.blockKey);
  const bodyKeys = decisions.entries.map((entry) => entry.blockKey);
  compareKeys(indexKeys, bodyKeys, decisionsSource, issues);
  const entriesByKey = new Map(decisions.entries.map((entry) => [entry.blockKey, entry]));
  const metadataMismatches: string[] = [];
  for (const row of decisions.index.rows) {
    const entry = entriesByKey.get(row.blockKey);
    if (
      entry !== undefined &&
      (row.kind !== entry.kind ||
        row.status !== entry.status ||
        row.force !== entry.force ||
        row.summary !== entry.title)
    ) {
      metadataMismatches.push(row.blockKey);
    }
  }
  if (metadataMismatches.length > 0) {
    issues.push(issue(
      "INDEX_BODY_MISMATCH",
      `Index metadata disagrees with body for ${metadataMismatches.join(", ")}`,
      { source: decisionsSource, assertion: 12 },
    ));
  }

  const declaredTotalMalformed = decisions.issues.some((finding) => finding.code === "DECLARED_TOTAL_SHAPE");
  if (decisions.index.present && decisions.index.declaredTotal === undefined && !declaredTotalMalformed) {
    issues.push(issue("MISSING_DECLARED_TOTAL", "Entry index has no valid declared-total line", {
      source: decisionsSource,
      assertion: 13,
    }));
  } else if (
    decisions.index.declaredTotal !== undefined &&
    (decisions.index.declaredTotal !== decisions.index.rows.length ||
      decisions.index.declaredTotal !== decisions.entries.length)
  ) {
    issues.push(issue(
      "DECLARED_TOTAL_MISMATCH",
      `Declared ${decisions.index.declaredTotal}; index has ${decisions.index.rows.length}; body has ${decisions.entries.length}`,
      { source: decisionsSource, line: decisions.index.declaredTotalLine, assertion: 13 },
    ));
  }

  if (input.trackedPaths) {
    for (const entry of decisions.entries) {
      for (const [field, path] of [["Evidence", entry.evidence], ["Owner", entry.owner]] as const) {
        if (path !== undefined && !input.trackedPaths.has(path)) {
          issues.push(issue("UNTRACKED_PATH", `${field} path is not tracked: ${path}`, {
            source: decisionsSource,
            line: entry.line,
            blockKey: entry.blockKey,
            assertion: 15,
          }));
        }
      }
    }
  }

  issues.push(...allocationIssues(decisions.entries, decisions.retiredIdentifiers, decisionsSource));

  const registeredIds = new Set(decisions.retiredIdentifiers.map((row) => row.id));
  for (const entry of decisions.entries) {
    if (entry.headingLevel === 3 && entry.id && registeredIds.has(entry.id)) {
      issues.push(issue("RETIRED_ID_CONFLICT", `Live entry reuses registered identifier ${entry.id}`, {
        source: decisionsSource,
        line: entry.line,
        blockKey: entry.blockKey,
        assertion: 10,
      }));
    }
  }

  const archiveIndexKeys = decisions.archiveIndex.map((line) => line.blockKey);
  const wrapperKeys = archive?.wrappers.map((wrapper) => wrapper.blockKey) ?? [];
  const archiveIndexCounts = new Map<string, number>();
  const wrapperCounts = new Map<string, number>();
  const wrappersByKey = new Map(archive?.wrappers.map((wrapper) => [wrapper.blockKey, wrapper]) ?? []);
  for (const key of archiveIndexKeys) archiveIndexCounts.set(key, (archiveIndexCounts.get(key) ?? 0) + 1);
  for (const key of wrapperKeys) wrapperCounts.set(key, (wrapperCounts.get(key) ?? 0) + 1);
  const archiveKeys = new Set([...archiveIndexCounts.keys(), ...wrapperCounts.keys()]);
  const archiveMismatch = [...archiveKeys].filter(
    (key) => archiveIndexCounts.get(key) !== wrapperCounts.get(key),
  );
  for (const line of decisions.archiveIndex) {
    const wrapper = wrappersByKey.get(line.blockKey);
    const expectedLabel = wrapper === undefined
      ? undefined
      : wrapper.id === undefined
        ? wrapper.title
        : `${wrapper.id} ${wrapper.title}`;
    if (expectedLabel !== undefined && line.label !== expectedLabel) archiveMismatch.push(line.blockKey);
    if (wrapper === undefined || archive === undefined) continue;
    if (normalizedDocumentPath(line.pointer.file) !== normalizedDocumentPath(archiveSource)) {
      issues.push(issue(
        "ARCHIVE_INDEX_MISMATCH",
        `Archive pointer file ${line.pointer.file} does not identify ${archiveSource}`,
        { source: decisionsSource, line: line.line, assertion: 14 },
      ));
    }
    const expectedAnchor = markdownHeadingAnchor(
      wrapper.id === undefined ? wrapper.title : `${wrapper.id} — ${wrapper.title}`,
    );
    if (line.pointer.anchor !== expectedAnchor) {
      issues.push(issue(
        "ARCHIVE_INDEX_MISMATCH",
        `Archive pointer anchor ${line.pointer.anchor} does not match ${expectedAnchor}`,
        { source: decisionsSource, line: line.line, assertion: 14 },
      ));
    }
  }
  if (archiveMismatch.length > 0) {
    issues.push(issue(
      "ARCHIVE_INDEX_MISMATCH",
      `Archive index/wrapper mismatch for ${[...new Set(archiveMismatch)].join(", ")}`,
      { source: decisionsSource, assertion: 14 },
    ));
  }

  return { ok: issues.length === 0, issues, decisions, archive };
}
