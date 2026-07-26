/**
 * DECISIONS.md cleanup — Phase 1 reference-graph generator (correction pass).
 *
 * Deterministic citation-graph extractor over the governance Markdown corpus.
 * This is the mechanical null the phase-3 checker re-derives against; it carries
 * NO classification judgment. It applies the targeting rules in
 * DECISIONS-CLEANUP-PHASE-1-SURVEY-CODEX-SPEC-2026-07-24.md §6 exactly and
 * extends none of them, except the principle-list grammar Amendment 3 promotes
 * into the contract (comma/and/&//-joined integer lists after the literal word
 * "principle"/"principles", including the Oxford-comma form "a, b, and c").
 *
 * Targeting (what a reference points at) and resolution (whether that target
 * exists, and — for principles only — whether it is live) are kept as separate
 * facts per Amendment 1/2. `resolves` is never a constant per kind; it is a
 * lookup against one of four indexes built from the frozen root:
 *   1. principle numbers defined in DECISIONS.md, tagged LIVE or LAPSED
 *   2. numbered sections (`## N. ...`-style headings) present per source file
 *   3. Markdown heading anchors (GitHub-slug) present per source file
 *   4. tracked repository paths
 *
 * A bare repository path is recognized structurally (path-shaped segments
 * joined by "/", the final one carrying a dot-extension) and resolved only
 * against index 4. There is no hand-maintained extension allowlist — per
 * correction-pass work order §3.2/3.3, that list was a second, silently
 * diverging authority on what counts as a path, and it truncated `.tsx` to
 * `.ts` (leftmost-first alternation) and dropped `.css` entirely. The tracked
 * index is the only authority; overbroad structural matches (decimal numbers,
 * abbreviations) simply fail resolution and are labelled by class (below)
 * rather than silently suppressed.
 *
 * Every unresolved (`MISSING`) record is additionally assigned exactly one
 * deterministic class (correction-pass work order, spec §10 item 9):
 * `absent-tracked-path`, `unqualified-basename`, `glob-or-pattern`,
 * `external-law-section`, `decimal-subsection`, `line-wrap-grammar`, or
 * `other`. This sub-classifies the MISSING population without touching
 * targeting or resolution semantics — see `classifyMissing` below for the
 * exact, documented triggers.
 *
 * Run only against a frozen worktree:
 *   tsx scripts/decisions-reference-graph.ts --root <frozen worktree path>
 *
 * The only field that may vary between two runs against the same frozen root is
 * `generatedAt`.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep, posix } from "node:path";
import { fileURLToPath } from "node:url";

const OUTPUT_PATH = "audit/decisions-cleanup-2026-07-24/reference-graph.json";
const PRINCIPLE_HOME = "DECISIONS.md";

type ReferenceKind =
  | "principle" // `principle n` (incl. list grammar) -> DECISIONS.md principle n
  | "path-section" // `<repository path> §n` -> named file section n
  | "section" // bare `§n` -> section n of the source file
  | "link" // Markdown link, resolved relative to source file
  | "link-external" // Markdown link whose target is a URI scheme (not a repo path)
  | "path" // bare repository path
  | "ambiguous"; // anything requiring semantic inference — never guessed

type TargetState = "LIVE" | "LAPSED" | "MISSING" | "NOT_APPLICABLE";

type MissingClass =
  | "absent-tracked-path"
  | "unqualified-basename"
  | "glob-or-pattern"
  | "external-law-section"
  | "decimal-subsection"
  | "line-wrap-grammar"
  | "other";

type ReferenceRecord = {
  from: string;
  fromLine: number;
  rawText: string;
  kind: ReferenceKind;
  target: string | null;
  resolves: boolean;
  targetState: TargetState;
  class: MissingClass | null;
  // sort key only — not emitted
  _col: number;
};

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function git(root: string, ...args: string[]): string {
  return execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
}

/** Mirror of ci-coverage-survey.ts: HEAD sha when clean, sentinel when dirty. */
function generatorGitSha(generatorPath: string): string {
  const generatorRoot = git(dirname(generatorPath), "rev-parse", "--show-toplevel");
  const generatorRelativePath = relative(generatorRoot, generatorPath).split(sep).join("/");
  const status = git(generatorRoot, "status", "--porcelain=v1", "--", generatorRelativePath);
  return status === "" ? git(generatorRoot, "rev-parse", "HEAD") : "uncommitted-implementation-tree";
}

function parseRootArg(args: string[]): string {
  if (args.length === 2 && args[0] === "--root" && args[1]) return args[1];
  throw new Error("Usage: tsx scripts/decisions-reference-graph.ts --root <path>");
}

/** All tracked *.md sources in scope (spec §3): root-level, docs/, Archive/. */
function markdownSources(root: string): string[] {
  const tracked = git(root, "ls-files", "-z").split("\0").filter(Boolean);
  const inScope = tracked.filter((path) => {
    if (!path.endsWith(".md")) return false;
    const depth = path.split("/").length;
    if (depth === 1) return true; // repository root
    return path.startsWith("docs/") || path.startsWith("Archive/");
  });
  return [...new Set(inScope)].sort((a, b) => a.localeCompare(b));
}

function trackedSet(root: string): ReadonlySet<string> {
  return new Set(git(root, "ls-files", "-z").split("\0").filter(Boolean));
}

/** Normalise a repo-relative link/path target: strip anchor, ./, trailing junk. */
function normalizeRepoPath(fromFile: string, rawTarget: string): { path: string; anchor: string } {
  const hashIndex = rawTarget.indexOf("#");
  const anchor = hashIndex >= 0 ? rawTarget.slice(hashIndex) : "";
  let pathPart = hashIndex >= 0 ? rawTarget.slice(0, hashIndex) : rawTarget;
  pathPart = pathPart.trim();
  if (pathPart === "") return { path: fromFile, anchor };
  const fromDir = posix.dirname(fromFile);
  const joined = pathPart.startsWith("/")
    ? pathPart.slice(1)
    : posix.normalize(posix.join(fromDir, pathPart));
  return { path: joined, anchor };
}

// ---------------------------------------------------------------------------
// Structural path token (correction-pass §3.2/3.3 — no extension allowlist).
//
// A path segment is alnum/underscore/dot/dash/asterisk (the asterisk admits
// globs, e.g. `banks/*-canonical.json`, as one token rather than the bug-3.4
// fragment `-canonical.json`). A token is zero-or-more `segment/` directory
// parts followed by a final `segment.ext` — the dot-extension shape is what
// makes something look like a *file*, structurally, with no fixed list of
// which extensions count. Resolution (tracked-index membership) is the only
// authority on whether the token is a real repository path; overbroad matches
// (a decimal number, an abbreviation) simply fail resolution and are labelled
// by class rather than excluded at the token level.
// ---------------------------------------------------------------------------
const PATH_SEGMENT = String.raw`[A-Za-z0-9_.*-]+`;
// The extension must start with an alphanumeric character — `**` (Markdown's
// bold-close delimiter) would otherwise itself qualify as a glob-shaped
// "extension" once `*` is admitted for `banks/*-canonical.json`, and every
// `**Status: TAG.**`-style bold sentence in DECISIONS.md would spuriously
// extract as a bare path.
const PATH_EXT = String.raw`[A-Za-z0-9][A-Za-z0-9*]*`;
const PATH_TOKEN = new RegExp(
  String.raw`(?:${PATH_SEGMENT}/)*${PATH_SEGMENT}\.${PATH_EXT}`,
);

/**
 * A second, minimal structural gate on top of PATH_TOKEN, applied only to
 * bare-token candidates (never to explicit Markdown link syntax, where the
 * author's own `[text](target)` is already the signal). Measured on the real
 * corpus, the raw PATH_TOKEN shape alone — any "segment.segment" — matched
 * thousands of decimal numbers ("100.9", "2.1") and short prose abbreviations
 * ("e.g") as pseudo-paths, none of which is a repository path under any
 * reading, which would have made the `unqualified-basename` MISSING class
 * (item 9) uninterpretable noise rather than the reconciliation it exists to
 * be. Two structural facts distinguish an implausible token, both about
 * *shape*, not content:
 *   - a file's final extension is conventionally 2+ characters — this repo's
 *     own tracked extensions are all 2+ chars (`md`, `ts`, `tsx`, `json`,
 *     `css`, `py`, ...); "e.g" (ext "g") and "i.e" (ext "e") fail this;
 *   - a file's stem is not a bare integer — "100.9", "2.1", "38.3" all fail
 *     this, since their final segment before the dot is digits-only.
 * This is not a reintroduced extension allowlist: it accepts any extension of
 * plausible length, not a specific enumerated set, and a decimal number or a
 * bare abbreviation is excluded from being *treated as a path candidate at
 * all* rather than being silently resolved differently. Residual noise from
 * code-identifier chains ("question.id", "series.length") is not excluded —
 * no purely structural rule distinguishes those from a real relative path —
 * and is reported honestly in findings.md rather than filtered further.
 *
 * This heuristic is advisory, never authoritative: at both call sites, a
 * token that fails it is still accepted if it is a literal member of the
 * tracked-path index. A genuinely tracked but oddly-shaped file (a
 * single-character extension, a numeric-only stem) must never become
 * invisible to the one index the generator is supposed to defer to —
 * otherwise the index would no longer be the sole authority the module
 * comment above claims it is.
 */
function isPlausiblePathToken(token: string): boolean {
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 0) return false;
  const ext = token.slice(lastDot + 1);
  if (ext.length < 2) return false;
  const stem = token.slice(0, lastDot).split("/").pop() ?? "";
  return /[A-Za-z]/.test(stem);
}

type Span = { start: number; end: number };

function overlaps(spans: Span[], start: number, end: number): boolean {
  return spans.some((s) => start < s.end && end > s.start);
}

// ---------------------------------------------------------------------------
// Index 1 — principle liveness, parsed from DECISIONS.md at the frozen root.
// ---------------------------------------------------------------------------

/**
 * A principle header is a bold line `**N. <body>**`. Two written forms exist
 * at the frozen root: `**N. <text>. Status: TAG(...).**` (§4 principles) and
 * `**N. CONDITIONAL — <text>.**` (§5 conditional-lane principles, which carry
 * no separate "Status:" token — the leading word after the number *is* the
 * status). Liveness for a CONDITIONAL principle is read from whether its
 * nearest enclosing `## N. Title` section heading contains the word "LAPSED" —
 * measured from the heading text itself, never asserted from outside it, so a
 * future non-lapsed conditional lane is not mis-tagged by this rule.
 */
function buildPrincipleIndex(decisionsText: string): ReadonlyMap<number, "LIVE" | "LAPSED"> {
  const index = new Map<number, "LIVE" | "LAPSED">();
  const lines = decisionsText.split(/\r?\n/);
  let currentSectionHeading = "";
  // A principle header opens `**N. <text>` and closes with a trailing `**` —
  // usually on the same line, but principle 30's header wraps across three
  // lines in the source. Accumulate forward (bounded, stopping at a blank
  // line or the next header) until the closing `**` is found, rather than
  // requiring it on the opening line.
  const openRe = /^\*\*(\d+)\.\s(.*)$/;
  const MAX_LOOKAHEAD = 6;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const sectionMatch = line.match(/^##\s+(.*)$/);
    if (sectionMatch) {
      currentSectionHeading = sectionMatch[1];
      continue;
    }
    const m = line.match(openRe);
    if (!m) continue;
    const num = Number(m[1]);
    let body = m[2];
    let j = i;
    while (!/\*\*\s*$/.test(body) && j - i < MAX_LOOKAHEAD && j + 1 < lines.length) {
      const next = lines[j + 1];
      if (next.trim() === "" || openRe.test(next)) break;
      j += 1;
      body += ` ${next}`;
    }
    body = body.replace(/\*\*\s*$/, "").trim();
    let status: string | null = null;
    const statusMatch = body.match(/Status:\s*([A-Z]+)/);
    if (statusMatch) status = statusMatch[1];
    else if (/^CONDITIONAL\b/.test(body)) status = "CONDITIONAL";
    if (!status) continue;
    let state: "LIVE" | "LAPSED";
    if (status === "SUPERSEDED") state = "LAPSED";
    else if (status === "CONDITIONAL") state = /LAPSED/i.test(currentSectionHeading) ? "LAPSED" : "LIVE";
    else state = "LIVE"; // ACTIVE, PARKED, REVISIT
    index.set(num, state);
  }
  return index;
}

// ---------------------------------------------------------------------------
// Index 2 — numbered sections, and Index 3 — heading anchors, per file.
// ---------------------------------------------------------------------------

const SECTION_HEADING_RE = /^(#{1,6})\s+(\d+)\.\s/;
const HEADING_RE = /^(#{1,6})\s+(.*)$/;

function slugify(headingText: string): string {
  let s = headingText.toLowerCase();
  s = s.replace(/[`*_~]/g, "");
  s = s.replace(/[^\p{L}\p{N}\- ]+/gu, "");
  s = s.trim().replace(/\s+/g, "-");
  return s;
}

function buildSectionAndAnchorIndexes(
  sourceTexts: ReadonlyMap<string, string>,
): { sections: ReadonlyMap<string, ReadonlySet<number>>; anchors: ReadonlyMap<string, ReadonlySet<string>> } {
  const sections = new Map<string, Set<number>>();
  const anchors = new Map<string, Set<string>>();
  for (const [file, text] of sourceTexts) {
    const sectionSet = new Set<number>();
    const anchorSet = new Set<string>();
    const seenSlugs = new Map<string, number>();
    for (const line of text.split(/\r?\n/)) {
      const sm = line.match(SECTION_HEADING_RE);
      if (sm) sectionSet.add(Number(sm[2]));
      const hm = line.match(HEADING_RE);
      if (hm) {
        const base = slugify(hm[2]);
        const n = seenSlugs.get(base) ?? 0;
        seenSlugs.set(base, n + 1);
        anchorSet.add(n === 0 ? base : `${base}-${n}`);
      }
    }
    sections.set(file, sectionSet);
    anchors.set(file, anchorSet);
  }
  return { sections, anchors };
}

// ---------------------------------------------------------------------------
// Targeting extraction — what a reference points at (no resolution here).
// ---------------------------------------------------------------------------

type RawRef = {
  col: number;
  end: number;
  rawText: string;
  kind: ReferenceKind;
  // fields needed for resolution, kind-dependent
  principleNum?: number;
  sectionFile?: string;
  sectionNum?: number;
  linkPath?: string;
  linkAnchor?: string;
  linkIsSelf?: boolean;
  path?: string;
};

function extractFromLine(from: string, line: string, tracked: ReadonlySet<string>): RawRef[] {
  const refs: RawRef[] = [];
  const consumed: Span[] = [];
  const push = (r: RawRef): void => {
    consumed.push({ start: r.col, end: r.end });
    refs.push(r);
  };

  // Markdown links — highest priority so their inner path is not double-counted.
  const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  for (let m = linkRe.exec(line); m; m = linkRe.exec(line)) {
    const rawTarget = m[1];
    const start = m.index;
    const end = start + m[0].length;
    if (/^[a-z][a-z0-9+.-]*:/i.test(rawTarget)) {
      push({ col: start, end, rawText: m[0], kind: "link-external" });
      continue;
    }
    const { path, anchor } = normalizeRepoPath(from, rawTarget);
    push({
      col: start,
      end,
      rawText: m[0],
      kind: "link",
      linkPath: path,
      linkAnchor: anchor,
      linkIsSelf: rawTarget.startsWith("#"),
    });
  }

  // `<repository path> §n` (path may be backtick-wrapped).
  const pathSecRe = new RegExp(String.raw`\`?(${PATH_TOKEN.source})\`?\s*§\s*(\d+)`, "g");
  for (let m = pathSecRe.exec(line); m; m = pathSecRe.exec(line)) {
    const start = m.index;
    const end = start + m[0].length;
    if (overlaps(consumed, start, end)) continue;
    // The tracked index is the sole authority on what is a repository path: a token that is
    // literally tracked always qualifies, regardless of the plausibility heuristic below, so a
    // genuinely tracked oddly-named file (e.g. a single-letter extension) is never invisible to it.
    if (!isPlausiblePathToken(m[1]) && !tracked.has(m[1])) continue;
    push({
      col: start,
      end,
      rawText: m[0],
      kind: "path-section",
      sectionFile: m[1],
      sectionNum: Number(m[2]),
    });
  }

  // Reversed cross-file form `§n of/in [the] <path>` needs semantic inference.
  const revSecRe = new RegExp(
    String.raw`§\s*(\d+)\s+(?:of|in)(?:\s+the)?\s+\`?(${PATH_TOKEN.source})\`?`,
    "g",
  );
  for (let m = revSecRe.exec(line); m; m = revSecRe.exec(line)) {
    const start = m.index;
    const end = start + m[0].length;
    if (overlaps(consumed, start, end)) continue;
    push({ col: start, end, rawText: m[0], kind: "ambiguous" });
  }

  // Bare `§n` — section n of the source file itself.
  const secRe = /§\s*(\d+)/g;
  for (let m = secRe.exec(line); m; m = secRe.exec(line)) {
    const start = m.index;
    const end = start + m[0].length;
    if (overlaps(consumed, start, end)) continue;
    push({ col: start, end, rawText: m[0], kind: "section", sectionFile: from, sectionNum: Number(m[1]) });
  }

  // `principle n` (and comma/and/&//-joined lists, incl. Oxford comma), any
  // casing — Amendment 3 grammar, corrected per correction-pass §3.1.
  //
  // The separator between successive numbers is one-OR-MORE of `,`, `and`,
  // `&`, `/` in sequence (not exactly one) — an Oxford-comma list like
  // "8, 9, 12, 18, and 22" writes its last separator as *two* tokens, a comma
  // followed by "and", and a separator alternation that permits only one
  // token per gap cannot match that gap at all, silently truncating the list.
  const prinRe = /\bprinciples?\s+(\d+(?:\s*(?:,(?:\s*(?:and|&|\/))?|and|&|\/)\s*\d+)*)/gi;
  for (let m = prinRe.exec(line); m; m = prinRe.exec(line)) {
    const start = m.index;
    const end = start + m[0].length;
    const numbers = m[1].match(/\d+/g) ?? [];
    for (const n of numbers) {
      push({ col: start, end, rawText: m[0], kind: "principle", principleNum: Number(n) });
    }
  }

  // Bare repository path (structural — no extension allowlist), not already consumed above.
  const pathRe = new RegExp(String.raw`\`?(${PATH_TOKEN.source})\`?`, "g");
  for (let m = pathRe.exec(line); m; m = pathRe.exec(line)) {
    const path = m[1];
    const start = m.index + (m[0].startsWith("`") ? 1 : 0);
    const end = start + path.length;
    if (overlaps(consumed, start, end)) continue;
    if (!isPlausiblePathToken(path) && !tracked.has(path)) continue;
    push({ col: start, end, rawText: path, kind: "path", path });
  }

  return refs;
}

// ---------------------------------------------------------------------------
// MISSING classification (correction-pass work order §3, spec §10 item 9).
//
// Deterministic, one class per unresolved record. This sub-classifies the
// MISSING population — it changes no targeting rule and no resolution
// semantic, and it never reclassifies a LIVE, LAPSED, or NOT_APPLICABLE
// record. Every trigger below is checked against literal, local text
// (the matched span, its own line, and — for the CFR lookback only, because
// the one real corpus occurrence splits "45 CFR" and "§ 46.116(b)(8)" across
// a hard paragraph wrap — the immediately preceding line). None of it guesses
// at a reference's target; it only labels *why* an already-failed resolution
// failed.
// ---------------------------------------------------------------------------

function classifyPathLike(rawPathText: string): MissingClass {
  if (rawPathText.includes("*")) return "glob-or-pattern";
  if (!rawPathText.includes("/")) return "unqualified-basename";
  return "absent-tracked-path";
}

/**
 * A dangling `§n` inside a tracked file. Three real, corpus-observed causes,
 * checked in order:
 *  1. `external-law-section` — the citation names an external statute
 *     section (e.g. "45 CFR § 46.116(b)(8)"), not a DECISIONS.md-style
 *     numbered heading. Detected by an `\bCFR\b` marker in the matched
 *     line up to the match, OR — because the one real occurrence in this
 *     corpus hard-wraps "45 CFR" onto the line before "§ 46.116(b)(8)," —
 *     in the tail of the immediately preceding line.
 *  2. `decimal-subsection` — the digits the bare-`§n` rule captured are
 *     immediately followed by `.` + a digit in the source (e.g. "§6.1"),
 *     meaning the true citation is a decimal subsection the integer-only
 *     section index (`## N. Title`) cannot represent, not a broken citation.
 *  3. `line-wrap-grammar` — the match sits at the very start of its
 *     (trimmed) line while the previous line does not end in terminal
 *     punctuation: the reference is a hard-wrap continuation of the prior
 *     line's sentence, so its disambiguating context (case 1's kind of
 *     marker, or otherwise) may be split across the wrap in a way this
 *     generator's per-line extraction cannot see. Flagged rather than
 *     guessed at.
 *  4. `other` — a plain dangling section number with none of the above
 *     shape: a genuine candidate for human review, not an extraction
 *     artifact.
 */
function classifyDanglingSection(
  matchStart: number,
  matchEnd: number,
  lineText: string,
  prevLineText: string | undefined,
): MissingClass {
  const after = lineText.slice(matchEnd);
  const decimalContinuation = /^\.\d/.test(after);
  const lookback = `${prevLineText ? prevLineText.slice(-60) : ""} ${lineText.slice(0, matchEnd)}`;
  if (/\bCFR\b/i.test(lookback)) return "external-law-section";
  if (decimalContinuation) return "decimal-subsection";
  const leadingWhitespace = lineText.match(/^\s*/)![0].length;
  const matchStartsLine = matchStart <= leadingWhitespace + 2;
  const prevEndsSentence = prevLineText === undefined || /[.?!:]\s*$/.test(prevLineText);
  if (matchStartsLine && !prevEndsSentence) return "line-wrap-grammar";
  return "other";
}

// ---------------------------------------------------------------------------
// Resolution — whether the target exists, and (principles only) its liveness.
// ---------------------------------------------------------------------------

function resolve_(
  raw: RawRef,
  from: string,
  tracked: ReadonlySet<string>,
  principles: ReadonlyMap<number, "LIVE" | "LAPSED">,
  sections: ReadonlyMap<string, ReadonlySet<number>>,
  anchors: ReadonlyMap<string, ReadonlySet<string>>,
  lineText: string,
  prevLineText: string | undefined,
): { target: string | null; resolves: boolean; targetState: TargetState; klass: MissingClass | null } {
  switch (raw.kind) {
    case "principle": {
      const n = raw.principleNum!;
      const state = principles.get(n);
      const target = `${PRINCIPLE_HOME}#principle-${n}`;
      if (state === undefined) return { target, resolves: false, targetState: "MISSING", klass: "other" };
      return { target, resolves: true, targetState: state, klass: null };
    }
    case "section": {
      const file = raw.sectionFile!;
      const n = raw.sectionNum!;
      const target = `${file}#section-${n}`;
      const exists = sections.get(file)?.has(n) ?? false;
      if (exists) return { target, resolves: true, targetState: "LIVE", klass: null };
      const klass = classifyDanglingSection(raw.col, raw.end, lineText, prevLineText);
      return { target, resolves: false, targetState: "MISSING", klass };
    }
    case "path-section": {
      const file = raw.sectionFile!;
      const n = raw.sectionNum!;
      const target = `${file}#section-${n}`;
      const pathTracked = tracked.has(file);
      if (!pathTracked) {
        return { target, resolves: false, targetState: "MISSING", klass: classifyPathLike(file) };
      }
      const exists = sections.get(file)?.has(n) ?? false;
      if (exists) return { target, resolves: true, targetState: "LIVE", klass: null };
      const klass = classifyDanglingSection(raw.col, raw.end, lineText, prevLineText);
      return { target, resolves: false, targetState: "MISSING", klass };
    }
    case "link": {
      const { linkPath, linkAnchor, linkIsSelf } = raw;
      const file = linkIsSelf ? from : linkPath!;
      const target = `${linkPath}${linkAnchor}`;
      const pathTracked = tracked.has(file);
      if (!pathTracked) {
        return { target, resolves: false, targetState: "MISSING", klass: classifyPathLike(linkPath!) };
      }
      if (!linkAnchor) return { target, resolves: true, targetState: "LIVE", klass: null };
      const slug = linkAnchor.startsWith("#") ? linkAnchor.slice(1) : linkAnchor;
      const anchorExists = anchors.get(file)?.has(slug) ?? false;
      if (anchorExists) return { target, resolves: true, targetState: "LIVE", klass: null };
      return { target, resolves: false, targetState: "MISSING", klass: "other" };
    }
    case "path": {
      const exists = tracked.has(raw.path!);
      if (exists) return { target: raw.path!, resolves: true, targetState: "LIVE", klass: null };
      return { target: raw.path!, resolves: false, targetState: "MISSING", klass: classifyPathLike(raw.path!) };
    }
    case "link-external":
      return { target: null, resolves: false, targetState: "NOT_APPLICABLE", klass: null };
    case "ambiguous":
      return { target: null, resolves: false, targetState: "NOT_APPLICABLE", klass: null };
  }
}

function main(): void {
  const root = resolve(parseRootArg(process.argv.slice(2)));
  const generatorPath = fileURLToPath(import.meta.url);
  const tracked = trackedSet(root);
  const sources = markdownSources(root);

  const inputs: { path: string; sha256: string }[] = [];
  const sourceTexts = new Map<string, string>();

  for (const source of sources) {
    const absolute = resolve(root, source);
    const rel = relative(root, absolute);
    if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
      throw new Error(`Input escaped --root: ${source}`);
    }
    const text = readFileSync(absolute, "utf8");
    inputs.push({ path: source, sha256: sha256(text) });
    sourceTexts.set(source, text);
  }

  if (!sourceTexts.has(PRINCIPLE_HOME)) {
    throw new Error(`${PRINCIPLE_HOME} not found under --root; cannot build principle index`);
  }
  const principles = buildPrincipleIndex(sourceTexts.get(PRINCIPLE_HOME)!);
  const { sections, anchors } = buildSectionAndAnchorIndexes(sourceTexts);

  const references: ReferenceRecord[] = [];
  for (const source of sources) {
    const lines = sourceTexts.get(source)!.split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 1) {
      for (const raw of extractFromLine(source, lines[i], tracked)) {
        const { target, resolves, targetState, klass } = resolve_(
          raw, source, tracked, principles, sections, anchors, lines[i], i > 0 ? lines[i - 1] : undefined,
        );
        references.push({
          from: source,
          fromLine: i + 1,
          rawText: raw.rawText,
          kind: raw.kind,
          target,
          resolves,
          targetState,
          class: klass,
          _col: raw.col,
        });
      }
    }
  }

  references.sort((a, b) =>
    a.from.localeCompare(b.from)
    || a.fromLine - b.fromLine
    || a._col - b._col
    || a.kind.localeCompare(b.kind)
    || (a.target ?? "").localeCompare(b.target ?? "")
    || a.rawText.localeCompare(b.rawText));

  const emitted = references.map(({ _col, ...rest }) => rest);
  const unresolved = emitted.filter((r) => r.targetState === "MISSING");
  const ambiguous = emitted.filter((r) => r.kind === "ambiguous");
  const externalLinks = emitted.filter((r) => r.kind === "link-external");
  const lapsed = emitted.filter((r) => r.targetState === "LAPSED");

  const missingByClass: Record<string, number> = {
    "absent-tracked-path": 0,
    "unqualified-basename": 0,
    "glob-or-pattern": 0,
    "external-law-section": 0,
    "decimal-subsection": 0,
    "line-wrap-grammar": 0,
    other: 0,
  };
  for (const r of unresolved) {
    const key = r.class ?? "other";
    missingByClass[key] = (missingByClass[key] ?? 0) + 1;
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    inputGitSha: git(root, "rev-parse", "HEAD"),
    measurementRootKind: "throwaway_git_worktree",
    generatorGitSha: generatorGitSha(generatorPath),
    generatorSha256: sha256(readFileSync(generatorPath, "utf8")),
    inputs,
    principleIndex: [...principles.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([num, state]) => ({ principle: num, state })),
    counts: {
      sources: sources.length,
      references: emitted.length,
      resolved: emitted.filter((r) => r.resolves).length,
      live: emitted.filter((r) => r.targetState === "LIVE").length,
      lapsed: lapsed.length,
      missing: unresolved.length,
      notApplicable: emitted.filter((r) => r.targetState === "NOT_APPLICABLE").length,
      external: externalLinks.length,
      ambiguous: ambiguous.length,
      byKind: emitted.reduce<Record<string, number>>((acc, r) => {
        acc[r.kind] = (acc[r.kind] ?? 0) + 1;
        return acc;
      }, {}),
      missingByClass,
    },
    references: emitted,
    unresolved,
    ambiguous,
    lapsed,
  };

  mkdirSync(dirname(resolve(OUTPUT_PATH)), { recursive: true });
  writeFileSync(resolve(OUTPUT_PATH), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${OUTPUT_PATH} — ${emitted.length} references from ${sources.length} sources `
      + `(${manifest.counts.live} live, ${lapsed.length} lapsed [review queue], `
      + `${unresolved.length} missing, ${manifest.counts.notApplicable} not-applicable)`,
  );
}

main();
