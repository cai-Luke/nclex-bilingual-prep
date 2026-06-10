/**
 * scripts/patch-raw.ts
 *
 * Reusable engine for deterministic, raw-scoped bank patching.
 * See PATCH-RAW-SPEC.md for the full specification.
 *
 * Usage: one-off patch files import this module and call runPatch(ops).
 * The engine reads --in / --out from process.argv and handles all I/O,
 * scope-guarding, validation, and reporting.
 */

import * as fs from "fs";
import * as path from "path";
import { parseBankText, getRawQuestions } from "../src/bankImport";
import { validateBankObject } from "../src/schema";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PathSegment = string | number | { id: string };
export type JsonPath = PathSegment[];

export interface ReplaceTextOp {
  kind: "replaceText";
  id: string;
  path: JsonPath;
  before: string;
  after: string;
  note?: string;
}

export interface SetValueOp {
  kind: "setValue";
  id: string;
  path: JsonPath;
  before: unknown;
  after: unknown;
  note?: string;
}

export interface RemoveQuestionOp {
  kind: "removeQuestion";
  id: string;
  reason: string;
}

export interface RemoveArrayItemOp {
  kind: "removeArrayItem";
  id: string;
  path: JsonPath;
  match: { id: string } | { index: number };
  before: unknown;
  reason?: string;
  note?: string;
}

export type PatchOp = ReplaceTextOp | SetValueOp | RemoveQuestionOp | RemoveArrayItemOp;

// ---------------------------------------------------------------------------
// Primitive constructors
// ---------------------------------------------------------------------------

export function replaceText(params: Omit<ReplaceTextOp, "kind">): ReplaceTextOp {
  return { kind: "replaceText", ...params };
}

export function setValue(params: Omit<SetValueOp, "kind">): SetValueOp {
  return { kind: "setValue", ...params };
}

export function removeQuestion(params: Omit<RemoveQuestionOp, "kind">): RemoveQuestionOp {
  return { kind: "removeQuestion", ...params };
}

export function removeArrayItem(params: Omit<RemoveArrayItemOp, "kind">): RemoveArrayItemOp {
  return { kind: "removeArrayItem", ...params };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Deep equality check. Uses JSON round-trip for simplicity (handles all JSON
 * value types; sufficient for precondition checks).
 */
function deepEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Render a JsonPath for display in reports and errors.
 * { id } selectors are rendered as [id].
 */
function renderPath(pathSegments: JsonPath): string {
  if (pathSegments.length === 0) return "(root)";
  return pathSegments
    .map((seg, i) => {
      if (typeof seg === "string") return i === 0 ? seg : `.${seg}`;
      if (typeof seg === "number") return `[${seg}]`;
      return `[${seg.id}]`;
    })
    .join("");
}

/**
 * Walk a single segment from `current`. Returns the resolved value.
 * Throws a descriptive string on failure.
 */
function walkSegment(current: unknown, seg: PathSegment, pathSoFar: JsonPath): unknown {
  if (typeof seg === "string") {
    if (!isRecord(current)) {
      throw `path segment ${JSON.stringify(seg)} requires an object at ${renderPath(pathSoFar.slice(0, -1))}`;
    }
    const val = (current as Record<string, unknown>)[seg];
    if (val === undefined) {
      throw `path segment ${JSON.stringify(seg)} not found at ${renderPath(pathSoFar)}`;
    }
    return val;
  } else if (typeof seg === "number") {
    if (!Array.isArray(current)) {
      throw `path segment ${seg} requires an array at ${renderPath(pathSoFar.slice(0, -1))}`;
    }
    if (seg < 0 || seg >= (current as unknown[]).length) {
      throw `path segment index ${seg} out of bounds at ${renderPath(pathSoFar)}`;
    }
    return (current as unknown[])[seg];
  } else {
    // { id } selector
    if (!Array.isArray(current)) {
      throw `{ id: "${seg.id}" } selector requires an array at ${renderPath(pathSoFar.slice(0, -1))}`;
    }
    const arr = current as unknown[];
    const matches = arr.filter((el) => isRecord(el) && el.id === seg.id);
    if (matches.length === 0) {
      throw `{ id: "${seg.id}" } selector matched 0 elements at ${renderPath(pathSoFar)}`;
    }
    if (matches.length > 1) {
      throw `{ id: "${seg.id}" } selector matched ${matches.length} elements at ${renderPath(pathSoFar)} (expected exactly 1)`;
    }
    return matches[0];
  }
}

/**
 * Resolve a JsonPath starting from `root`. Returns the parent container
 * and the final key/index so the caller can read or write the leaf.
 * Throws a descriptive string on any failure.
 */
function resolvePath(
  root: unknown,
  pathSegments: JsonPath,
): { parent: Record<string, unknown> | unknown[]; key: string | number } {
  if (pathSegments.length === 0) throw "path must have at least one segment";

  let current: unknown = root;

  // Walk all segments except the last
  for (let i = 0; i < pathSegments.length - 1; i++) {
    current = walkSegment(current, pathSegments[i], pathSegments.slice(0, i + 1));
  }

  // Resolve the final segment to (parent, key)
  const lastSeg = pathSegments[pathSegments.length - 1];
  const parentPath = pathSegments.slice(0, -1);

  if (typeof lastSeg === "string") {
    if (!isRecord(current)) {
      throw `path segment ${JSON.stringify(lastSeg)} requires an object at ${renderPath(parentPath)}`;
    }
    return { parent: current as Record<string, unknown>, key: lastSeg };
  } else if (typeof lastSeg === "number") {
    if (!Array.isArray(current)) {
      throw `path segment ${lastSeg} requires an array at ${renderPath(parentPath)}`;
    }
    return { parent: current as unknown[], key: lastSeg };
  } else {
    // { id } selector
    if (!Array.isArray(current)) {
      throw `{ id: "${lastSeg.id}" } selector requires an array at ${renderPath(parentPath)}`;
    }
    const arr = current as unknown[];
    const matches = arr
      .map((el, idx) => ({ el, idx }))
      .filter(({ el }) => isRecord(el) && el.id === lastSeg.id);
    if (matches.length === 0) {
      throw `{ id: "${lastSeg.id}" } selector matched 0 elements at ${renderPath(parentPath)}`;
    }
    if (matches.length > 1) {
      throw `{ id: "${lastSeg.id}" } selector matched ${matches.length} elements at ${renderPath(parentPath)} (expected exactly 1)`;
    }
    return { parent: current as unknown[], key: matches[0].idx };
  }
}

/** Find a top-level question by id. Returns { question, index } or throws. */
function findQuestion(
  questions: unknown[],
  id: string,
): { question: Record<string, unknown>; index: number } {
  const matches = questions
    .map((q, idx) => ({ q, idx }))
    .filter(({ q }) => isRecord(q) && q.id === id);

  if (matches.length === 0) throw `no question with id "${id}" found`;
  if (matches.length > 1) throw `duplicate top-level question id "${id}" (${matches.length} occurrences)`;

  return { question: matches[0].q as Record<string, unknown>, index: matches[0].idx };
}

function countOccurrences(haystack: string, needle: string): number {
  if (needle.length === 0) return 0;
  let count = 0;
  let pos = 0;
  while (true) {
    const idx = haystack.indexOf(needle, pos);
    if (idx === -1) break;
    count++;
    pos = idx + needle.length;
  }
  return count;
}

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

interface ParsedArgs {
  inPath: string;
  outPath: string;
  outExplicit: boolean;
  allowCanonical: boolean;
  reason: string;
  strictParity: boolean;
  help: boolean;
}

function parseArgs(): ParsedArgs {
  const argv = process.argv.slice(2);

  if (argv.includes("--help") || argv.includes("-h") || argv.length === 0) {
    return {
      inPath: "",
      outPath: "",
      outExplicit: false,
      allowCanonical: false,
      reason: "",
      strictParity: false,
      help: true,
    };
  }

  const get = (flag: string): string | undefined => {
    const idx = argv.indexOf(flag);
    if (idx === -1 || idx + 1 >= argv.length) return undefined;
    return argv[idx + 1];
  };

  const has = (flag: string): boolean => argv.includes(flag);

  const inRaw = get("--in");
  const outRaw = get("--out");
  const allowCanonical = has("--allow-canonical");
  const reason = get("--reason") ?? "";
  const strictParity = has("--strict-parity");

  if (!inRaw) {
    printHelp();
    process.exit(1);
  }

  const inPath = path.resolve(inRaw);
  const outExplicit = outRaw !== undefined;
  const outPath = outExplicit
    ? path.resolve(outRaw!)
    : deriveOutPath(inPath);

  return { inPath, outPath, outExplicit, allowCanonical, reason, strictParity, help: false };
}

function deriveOutPath(inPath: string): string {
  const ext = path.extname(inPath);
  const base = inPath.slice(0, inPath.length - ext.length);
  return base + ".reviewed" + ext;
}

function printHelp(): void {
  process.stdout.write(`
patch-raw.ts — Deterministic, raw-scoped bank patch engine

USAGE (one-off patch script):
  npx tsx scripts/patches/<date>-<slug>.ts \\
    --in  banks/banks-raw/<file>.json \\
    --out banks/banks-raw/<file>.reviewed.json [options]

OPTIONS:
  --in <path>           Input bank file (required)
  --out <path>          Output bank file (default: <in>.reviewed.json)
  --allow-canonical     Allow writing outside banks/banks-raw/ (canonical mode)
  --reason "<text>"     Required alongside --allow-canonical; non-empty
  --strict-parity       Promote parity warnings to fail-fast errors
  --help, -h            Show this help

In canonical mode, --in and --out must be the same path (in-place correction).
--out must be supplied explicitly in canonical mode.

PRIMITIVES (imported by one-off scripts):
  replaceText({ id, path, before, after, note })
  setValue({ id, path, before, after, note })
  removeQuestion({ id, reason })
  removeArrayItem({ id, path, match, before, reason })
`.trimStart());
}

// ---------------------------------------------------------------------------
// Scope guard
// ---------------------------------------------------------------------------

const RAW_DIR_NAME = path.join("banks", "banks-raw");

function repoRoot(): string {
  // Walk up from the script's directory until package.json is found
  const scriptFile = process.argv[1] ?? __filename;
  let dir = path.dirname(path.resolve(scriptFile));
  for (let i = 0; i < 12; i++) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

function checkScopeGuard(args: ParsedArgs, root: string): void {
  const rawDirAbs = path.resolve(root, RAW_DIR_NAME);

  const outNormalized = path.normalize(args.outPath);
  const rawNormalized = path.normalize(rawDirAbs);

  const outIsRaw =
    outNormalized.startsWith(rawNormalized + path.sep) ||
    outNormalized === rawNormalized;

  if (outIsRaw) return; // Happy path

  // Outside banks-raw: require --allow-canonical AND --reason
  if (!args.allowCanonical || !args.reason.trim()) {
    console.error(
      "\nScope guard: refusing to write outside banks/banks-raw/.\n" +
      `  out: ${args.outPath}\n\n` +
      "To write a canonical bank, supply BOTH:\n" +
      "  --allow-canonical\n" +
      '  --reason "<non-empty text>"\n'
    );
    process.exit(1);
  }

  // Canonical mode: --out must be explicit (not derived)
  if (!args.outExplicit) {
    console.error(
      "\nScope guard (canonical mode): --out must be supplied explicitly.\n" +
      "The --in-derived default is suppressed in canonical mode.\n"
    );
    process.exit(1);
  }

  // Canonical mode: --in and --out must match (in-place only)
  if (path.resolve(args.inPath) !== path.resolve(args.outPath)) {
    console.error(
      "\nScope guard (canonical mode): --in and --out must be the same path (in-place correction only).\n" +
      `  --in:  ${args.inPath}\n` +
      `  --out: ${args.outPath}\n`
    );
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Canonical mode banner
// ---------------------------------------------------------------------------

function printCanonicalBanner(args: ParsedArgs, ops: PatchOp[]): void {
  console.log("\n" + "=".repeat(72));
  console.log("CANONICAL MODE — writing in-place to a canonical bank file");
  console.log(`File:   ${args.outPath}`);
  console.log(`Reason: ${args.reason}`);
  console.log("\nOps to apply:");
  for (const op of ops) {
    if (op.kind === "removeQuestion") {
      console.log(`  DROP  ${op.id}  ${op.reason}`);
    } else if (op.kind === "removeArrayItem") {
      console.log(`  DROP  ${op.id}  path=${renderPath(op.path)}`);
    } else {
      console.log(`  FIX   ${op.id}  path=${renderPath(op.path)}`);
    }
  }
  console.log("\nLEDGER ENTRY REQUIRED");
  console.log("  Add an entry to BANK-REVIEW-LEDGER.md recording this correction.");
  console.log(`  Reason: ${args.reason}`);
  console.log("=".repeat(72) + "\n");
}

// ---------------------------------------------------------------------------
// Parity check
// ---------------------------------------------------------------------------

interface ParityWarning {
  questionId: string;
  field: string;
  edited: "en" | "zh";
  untouched: "en" | "zh";
}

function checkParity(ops: PatchOp[]): ParityWarning[] {
  const warnings: ParityWarning[] = [];

  // Collect (questionId -> Set<serialized path>) for text-mutating ops
  const editedPaths = new Map<string, Set<string>>();

  for (const op of ops) {
    if (op.kind !== "replaceText" && op.kind !== "setValue") continue;
    const lastSeg = op.path[op.path.length - 1];
    if (typeof lastSeg !== "string") continue;
    if (lastSeg !== "en" && lastSeg !== "zh") continue;

    const key = JSON.stringify(op.path);
    if (!editedPaths.has(op.id)) editedPaths.set(op.id, new Set());
    editedPaths.get(op.id)!.add(key);
  }

  // For each single-language edit, check sibling coverage
  for (const op of ops) {
    if (op.kind !== "replaceText" && op.kind !== "setValue") continue;
    const lastSeg = op.path[op.path.length - 1];
    if (typeof lastSeg !== "string") continue;
    if (lastSeg !== "en" && lastSeg !== "zh") continue;

    const sibling: "en" | "zh" = lastSeg === "en" ? "zh" : "en";
    const siblingPath: JsonPath = [...op.path.slice(0, -1), sibling];
    const siblingKey = JSON.stringify(siblingPath);

    const editedForQ = editedPaths.get(op.id) ?? new Set();
    if (!editedForQ.has(siblingKey)) {
      const fieldPath = renderPath(op.path.slice(0, -1));
      const duplicate = warnings.find(
        (w) => w.questionId === op.id && w.field === fieldPath
      );
      if (!duplicate) {
        warnings.push({
          questionId: op.id,
          field: fieldPath,
          edited: lastSeg as "en" | "zh",
          untouched: sibling,
        });
      }
    }
  }

  return warnings;
}

// ---------------------------------------------------------------------------
// Metadata recomputation
// ---------------------------------------------------------------------------

function recomputeMeta(bank: Record<string, unknown>): void {
  const meta = bank.meta;
  if (isRecord(meta) && "count" in meta) {
    const questions = bank.questions;
    if (Array.isArray(questions)) {
      (meta as Record<string, unknown>).count = questions.length;
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

interface AppliedEntry {
  kind: "FIX" | "DROP";
  id: string;
  detail: string;
  note?: string;
}

function renderReport(
  args: ParsedArgs,
  root: string,
  beforeCount: number,
  afterCount: number,
  applied: AppliedEntry[],
  parityWarnings: ParityWarning[],
): void {
  const relIn = path.relative(root, args.inPath);
  const relOut = path.relative(root, args.outPath);

  console.log("\nPatch report");
  console.log(`Input:  ${relIn}`);
  console.log(`Output: ${relOut}`);
  console.log(`Questions before: ${beforeCount}`);
  console.log(`Questions after:  ${afterCount}`);
  console.log();

  console.log("Applied:");
  if (applied.length === 0) {
    console.log("  (none)");
  } else {
    for (const entry of applied) {
      const notePart = entry.note ? `   ${entry.note}` : "";
      console.log(`- ${entry.kind}  ${entry.id}  ${entry.detail}${notePart}`);
    }
  }
  console.log();

  console.log("Parity warnings:");
  if (parityWarnings.length === 0) {
    console.log("  none");
  } else {
    for (const w of parityWarnings) {
      console.log(
        `- ${w.questionId} ${w.field}: ${w.edited} edited, ${w.untouched} untouched — confirm in review`
      );
    }
  }
  console.log();

  console.log("Validation:");
  console.log(`- validateBankObject (post-write): PASS (${afterCount} questions)`);
  console.log();
}

// ---------------------------------------------------------------------------
// Op application
// ---------------------------------------------------------------------------

function applyOp(
  op: PatchOp,
  questions: unknown[],
  applied: AppliedEntry[],
): void {
  if (op.kind === "removeQuestion") {
    const { index } = findQuestion(questions, op.id);
    questions.splice(index, 1);
    applied.push({ kind: "DROP", id: op.id, detail: op.reason });
    return;
  }

  const { question } = findQuestion(questions, op.id);

  if (op.kind === "replaceText") {
    const { parent, key } = resolvePath(question, op.path);
    const current = (parent as Record<string | number, unknown>)[key];
    if (typeof current !== "string") {
      throw `replaceText: resolved value at ${renderPath(op.path)} is not a string (got ${typeof current})`;
    }
    const occurrences = countOccurrences(current, op.before);
    if (occurrences === 0) {
      throw `replaceText: before string not found in field at ${renderPath(op.path)}`;
    }
    if (occurrences > 1) {
      throw (
        `replaceText: before string occurs ${occurrences} times at ${renderPath(op.path)} ` +
        "(must occur exactly once)"
      );
    }
    (parent as Record<string | number, unknown>)[key] = current.replace(op.before, op.after);
    applied.push({
      kind: "FIX",
      id: op.id,
      detail: renderPath(op.path),
      note: op.note,
    });
    return;
  }

  if (op.kind === "setValue") {
    const { parent, key } = resolvePath(question, op.path);
    const current = (parent as Record<string | number, unknown>)[key];
    if (!deepEqual(current, op.before)) {
      throw (
        `setValue: current value at ${renderPath(op.path)} does not deep-equal before.\n` +
        `  expected: ${JSON.stringify(op.before)}\n` +
        `  actual:   ${JSON.stringify(current)}`
      );
    }
    (parent as Record<string | number, unknown>)[key] = op.after;
    applied.push({
      kind: "FIX",
      id: op.id,
      detail: renderPath(op.path),
      note: op.note,
    });
    return;
  }

  if (op.kind === "removeArrayItem") {
    const { parent, key } = resolvePath(question, op.path);
    const arr = (parent as Record<string | number, unknown>)[key];
    if (!Array.isArray(arr)) {
      throw `removeArrayItem: resolved value at ${renderPath(op.path)} is not an array`;
    }

    let targetIdx: number;
    if ("id" in op.match) {
      const matches = arr
        .map((el, idx) => ({ el, idx }))
        .filter(({ el }) => isRecord(el) && el.id === (op.match as { id: string }).id);
      if (matches.length === 0) {
        throw `removeArrayItem: no element with id "${(op.match as { id: string }).id}" at ${renderPath(op.path)}`;
      }
      if (matches.length > 1) {
        throw `removeArrayItem: ${matches.length} elements with id "${(op.match as { id: string }).id}" at ${renderPath(op.path)}`;
      }
      targetIdx = matches[0].idx;
    } else {
      targetIdx = (op.match as { index: number }).index;
      if (targetIdx < 0 || targetIdx >= arr.length) {
        throw `removeArrayItem: index ${targetIdx} out of bounds (length ${arr.length}) at ${renderPath(op.path)}`;
      }
    }

    if (!deepEqual(arr[targetIdx], op.before)) {
      throw (
        `removeArrayItem: element at index ${targetIdx} does not deep-equal before.\n` +
        `  expected: ${JSON.stringify(op.before)}\n` +
        `  actual:   ${JSON.stringify(arr[targetIdx])}`
      );
    }

    arr.splice(targetIdx, 1);
    const matchLabel =
      "id" in op.match
        ? (op.match as { id: string }).id
        : String((op.match as { index: number }).index);
    applied.push({
      kind: "DROP",
      id: op.id,
      detail: `${renderPath(op.path)}[${matchLabel}]`,
      note: op.reason,
    });
    return;
  }

  // TypeScript exhaustiveness
  const _never: never = op;
  throw `unknown op kind: ${(_never as PatchOp).kind}`;
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

export function runPatch(ops: PatchOp[]): void {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  const root = repoRoot();

  // Scope guard (before reading anything)
  checkScopeGuard(args, root);

  // Canonical mode check and banner
  const rawDirAbs = path.resolve(root, RAW_DIR_NAME);
  const outNormalized = path.normalize(args.outPath);
  const rawNormalized = path.normalize(rawDirAbs);
  const isCanonical = !(
    outNormalized.startsWith(rawNormalized + path.sep) ||
    outNormalized === rawNormalized
  );

  if (isCanonical) {
    printCanonicalBanner(args, ops);
  }

  // Read and parse input
  let rawText: string;
  try {
    rawText = fs.readFileSync(args.inPath, "utf8");
  } catch (e) {
    console.error(`Failed to read --in file: ${args.inPath}\n${e}`);
    process.exit(1);
  }

  let parsed: unknown;
  try {
    parsed = parseBankText(rawText);
  } catch (e) {
    console.error(`Failed to parse bank text: ${e}`);
    process.exit(1);
  }

  // Normalize to an envelope object
  let bank: Record<string, unknown>;
  if (Array.isArray(parsed)) {
    bank = { questions: parsed as unknown[] };
  } else if (isRecord(parsed)) {
    bank = parsed as Record<string, unknown>;
  } else {
    console.error("Bank must be an object or array.");
    process.exit(1);
  }

  // Get top-level questions reference
  let questions: unknown[];
  try {
    questions = getRawQuestions(parsed);
  } catch (e) {
    console.error(`Failed to extract questions: ${e}`);
    process.exit(1);
  }

  // Keep bank.questions aligned with the questions array
  if (!Array.isArray(bank.questions)) {
    bank.questions = questions;
  }

  // Assert no duplicate top-level ids before any mutation
  const idSeen = new Map<string, number>();
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (!isRecord(q) || typeof q.id !== "string") {
      console.error(`questions[${i}] is missing a string id`);
      process.exit(1);
    }
    const prev = idSeen.get(q.id);
    if (prev !== undefined) {
      console.error(`Duplicate top-level question id "${q.id}" at indices ${prev} and ${i}`);
      process.exit(1);
    }
    idSeen.set(q.id, i);
  }

  const beforeCount = questions.length;

  // Deep-clone the bank for safe mutation (abort leaves nothing on disk)
  let patched: Record<string, unknown>;
  try {
    patched = JSON.parse(JSON.stringify(bank)) as Record<string, unknown>;
  } catch (e) {
    console.error(`Failed to clone bank: ${e}`);
    process.exit(1);
  }

  const patchedQuestions = patched.questions as unknown[];

  // Apply ops in declaration order — first failure aborts entirely
  const applied: AppliedEntry[] = [];
  for (const op of ops) {
    try {
      applyOp(op, patchedQuestions, applied);
    } catch (err) {
      console.error(
        `\nPatch aborted — nothing written.\n` +
        `Error applying op [${op.kind}, id=${op.id}]: ${err}`
      );
      process.exit(1);
    }
  }

  // Recompute meta.count (never a precondition; always overwritten)
  recomputeMeta(patched);

  const afterCount = (patched.questions as unknown[]).length;

  // Parity check
  const parityWarnings = checkParity(ops);

  if (args.strictParity && parityWarnings.length > 0) {
    console.error("\nPatch aborted — nothing written (--strict-parity).");
    console.error("Parity warnings promoted to errors:");
    for (const w of parityWarnings) {
      console.error(
        `  ${w.questionId} ${w.field}: ${w.edited} edited, ${w.untouched} untouched`
      );
    }
    process.exit(1);
  }

  // In-process validation on the patched object itself (not on .value)
  const inProcessValidation = validateBankObject(patched);
  if (!inProcessValidation.ok) {
    console.error("\nPatch aborted — nothing written.");
    console.error("Post-patch validation failed:");
    for (const r of inProcessValidation.reasons) {
      console.error(`  • ${r}`);
    }
    process.exit(1);
  }

  // Atomic write: serialize → write .tmp → re-validate from .tmp → rename
  const serialized = JSON.stringify(patched, null, 2) + "\n";
  const tmpPath = args.outPath + ".tmp";

  try {
    fs.mkdirSync(path.dirname(args.outPath), { recursive: true });
    fs.writeFileSync(tmpPath, serialized, "utf8");
  } catch (e) {
    console.error(`Failed to write temp file ${tmpPath}: ${e}`);
    process.exit(1);
  }

  // Read back and re-validate from disk
  let diskText: string;
  try {
    diskText = fs.readFileSync(tmpPath, "utf8");
  } catch (e) {
    console.error(`Failed to read back temp file ${tmpPath}: ${e}`);
    safeUnlink(tmpPath);
    process.exit(1);
  }

  let diskParsed: unknown;
  try {
    diskParsed = parseBankText(diskText);
  } catch (e) {
    console.error(`Failed to parse temp file (disk round-trip): ${e}`);
    safeUnlink(tmpPath);
    process.exit(1);
  }

  const diskValidation = validateBankObject(diskParsed);
  if (!diskValidation.ok) {
    console.error("\nPatch aborted — disk round-trip validation failed (temp file removed).");
    for (const r of diskValidation.reasons) {
      console.error(`  • ${r}`);
    }
    safeUnlink(tmpPath);
    process.exit(1);
  }

  // Atomic rename
  try {
    fs.renameSync(tmpPath, args.outPath);
  } catch (e) {
    console.error(`Failed to rename ${tmpPath} → ${args.outPath}: ${e}`);
    safeUnlink(tmpPath);
    process.exit(1);
  }

  // Print the report
  renderReport(args, root, beforeCount, afterCount, applied, parityWarnings);
}

function safeUnlink(filePath: string): void {
  try {
    fs.unlinkSync(filePath);
  } catch {
    // ignore cleanup errors
  }
}
