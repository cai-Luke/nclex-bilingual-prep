import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  checkDecisionsFormat,
  countStatementSentences,
  parseArchiveDocument,
  parseArchiveIndexLines,
  parseDecisionsDocument,
  parseEntryIndex,
  parseRetiredIdentifierRegister,
  type ConformanceReasonCode,
  type EntryForce,
  type EntryStatus,
  type LiveKind,
  type ParserReasonCode,
} from "../../lib/decisions-format";
import {
  renderDecisionsFormatResult,
  runDecisionsFormatConformance,
} from "../decisions-format-conform";

const trackedFixturePaths = new Set([
  "EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md",
  "src/schema.ts",
  "src/visuals/kinds/vitals_trend/index.ts",
  "Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md",
  "src/measurementAllowlist.ts",
  "src/audio/normalizeForTts.ts",
  "audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md",
  "tracked-owner.ts",
]);

const f1 = `### P25 — Necessity is a property of the artifact

A visual, exhibit, or measurement block is included when the item cannot be answered without it,
not when it would be realistic to include. Realism is not necessity.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-03
- **Authorized:** Redundant elements inside a value-complete artifact.
- **Not authorized:** An artifact whose values the stem already states.
- **Evidence:** \`EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md\`
- **Owner:** \`src/schema.ts\`
- **Execution:** EXECUTED`;

const f2 = `### P7 — Precision over volume

In any audit, five fully-evidenced findings beat thirty probable ones.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** ADVISORY
- **Date:** 2026-06-18`;

const f3 = `#### P25 — Application: composite trend artifacts

A deterministic trend artifact may present the same typed source data through both charts and a
renderer-derived table when the views provide distinct reading affordances.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-18
- **Owner:** \`src/visuals/kinds/vitals_trend/index.ts\`
- **Execution:** PENDING`;

const f4 = `### R3 — Temperature sanity ceiling 46.5 °C

The flowsheet gate's sanity ceiling for \`temp\` is independently authored at 46.5 °C, decoupled from
the renderer's legacy range.

- **Kind:** R
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-15
- **Evidence:** \`Archive/root-cleanup-2026-07-19/r9-temperature-sanity-decoupling-codex-spec.md\`
- **Owner:** \`src/measurementAllowlist.ts\`
- **Execution:** EXECUTED`;

const f5 = `### Runtime audio carries no client-embedded secret

Runtime audio must not require a client-embedded secret or a live API call, and an absent
pre-generated asset fails safely to \`speechSynthesis\`.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-06-22
- **Owner:** \`src/audio/normalizeForTts.ts\``;

const f6 = `### DBP and MAP ceiling sourcing

Whether DBP and MAP carry authored sanity ceilings is unresolved; a bounded sourcing pass is
authorized with no number selected.

- **Kind:** T
- **Status:** REVISIT
- **Force:** ADVISORY
- **Date:** 2026-07-24
- **Evidence:** \`audit/vital-sanity-bounds-p3-stage-3-source-packet-2026-07-23.md\``;

const f7 = `### P22 — CONDITIONAL conditional-principle prose

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** P
- **Original Status:** CONDITIONAL
- **Retired ID:** P22
- **Origin:** \`DECISIONS.md\` §5 at \`MIGRATION_BASELINE\`

**22. CONDITIONAL — Opus skeleton cases are GPT-provenance for review-conflict purposes.**
The producer principle 2 protects against self-review is the compiler, not the prose author.`;

const f8 = `- **P22 CONDITIONAL conditional-principle prose** — lapsed lane contract, retired 2026-07-28.
  \`Archive/DECISIONS-ARCHIVE-<date>.md#p22-conditional-conditional-principle-prose\``;

const f9 = `| ID | disposition | date | pointer |
|---|---|---|---|
| P22 | RETIRED        | 2026-07-28 | \`Archive/DECISIONS-ARCHIVE-<date>.md#p22-...\` |
| P13 | NEVER ASSIGNED | —          | —                                             |`;

const f10 = `### P2 — Independent review is scoped to judgment

A source may name Dr. Smith without creating a second sentence.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-14`;

const f11 = `| ID | kind | status | force | summary |
|---|---|---|---|---|
| P25 | P | ACTIVE | BINDING | Necessity is a property of the artifact |
| P25 | P | ACTIVE | BINDING | Application: composite trend artifacts |
| — | I | ACTIVE | BINDING | Runtime audio carries no client-embedded secret |

**Declared total:** 3 entry blocks.`;

const f12 = `### Runtime audio carries no client-embedded secret

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** I
- **Original Status:** ACTIVE
- **Origin:** \`DECISIONS.md\` §6 at \`MIGRATION_BASELINE\`

**Runtime audio must not require a client-embedded secret.**
The original invariant body remains byte-for-byte unchanged.`;

const f13 = `- **Runtime audio carries no client-embedded secret** — archived invariant, retired 2026-07-28.
  \`Archive/DECISIONS-ARCHIVE-<date>.md#runtime-audio-carries-no-client-embedded-secret\``;

function inSection(section: number, body: string): string {
  return `# Candidate decisions

## ${section}. Section

${body}
`;
}

function expectParserCode(
  id: string,
  actual: readonly { code: string }[],
  expected: ParserReasonCode,
): void {
  assert.ok(actual.some((finding) => finding.code === expected), `${id}: expected ${expected}, got ${
    actual.map((finding) => finding.code).join(", ") || "no issues"
  }`);
}

function expectConformanceCode(
  id: string,
  result: ReturnType<typeof checkDecisionsFormat>,
  expected: ConformanceReasonCode,
): void {
  assert.equal(result.ok, false, `${id}: candidate should fail`);
  assert.ok(result.issues.some((finding) => finding.code === expected), `${id}: expected ${expected}, got ${
    result.issues.map((finding) => finding.code).join(", ")
  }`);
}

function liveBlock(options: {
  kind: LiveKind;
  number?: number;
  title?: string;
  status?: EntryStatus;
  force?: EntryForce;
  owner?: string;
  heading?: string;
}): string {
  const {
    kind,
    number = 1,
    title = `${kind} entry ${number}`,
    status = "ACTIVE",
    force = "BINDING",
    owner,
  } = options;
  const heading = options.heading ?? (kind === "P" || kind === "R"
    ? `### ${kind}${number} — ${title}`
    : `### ${title}`);
  return `${heading}

This is a governed statement.

- **Kind:** ${kind}
- **Status:** ${status}
- **Force:** ${force}
- **Date:** 2026-07-28${owner === undefined ? "" : `\n- **Owner:** \`${owner}\``}`;
}

interface IndexRowInput {
  id?: string;
  kind: LiveKind;
  status?: EntryStatus;
  force?: EntryForce;
  summary: string;
}

function buildDecisions(options: {
  rows: IndexRowInput[];
  p?: string[];
  r?: string[];
  i?: string[];
  t?: string[];
  section8?: string;
  declaredTotal?: number | null;
}): string {
  const tableRows = options.rows.map((row) =>
    `| ${row.id ?? "—"} | ${row.kind} | ${row.status ?? "ACTIVE"} | ${row.force ?? "BINDING"} | ${row.summary} |`
  ).join("\n");
  const total = options.declaredTotal === null
    ? ""
    : `\n\n**Declared total:** ${options.declaredTotal ?? options.rows.length} entry blocks.`;
  return `# Candidate decisions

## 3. Entry index

| ID | kind | status | force | summary |
|---|---|---|---|---|
${tableRows}${total}

## 4. Governing principles

${(options.p ?? []).join("\n\n")}

## 5. Concrete rulings

${(options.r ?? []).join("\n\n")}

## 6. Standing invariants

${(options.i ?? []).join("\n\n")}

## 7. Open threads

${(options.t ?? []).join("\n\n")}

## 8. Archive index

${options.section8 ?? ""}
`;
}

function archiveWrapper(options: {
  id?: string;
  title: string;
  originalKind: LiveKind;
  originalStatus?: EntryStatus;
  includeOriginalStatus?: boolean;
  body?: string;
}): string {
  const heading = options.id === undefined
    ? `### ${options.title}`
    : `### ${options.id} — ${options.title}`;
  return `${heading}

- **Kind:** X
- **Status:** SUPERSEDED
- **Force:** HISTORICAL
- **Date:** 2026-07-28
- **Original Kind:** ${options.originalKind}${
  options.includeOriginalStatus === false ? "" : `\n- **Original Status:** ${options.originalStatus ?? "ACTIVE"}`
}${options.id === undefined ? "" : `\n- **Retired ID:** ${options.id}`}
- **Origin:** \`DECISIONS.md\` §4 at \`MIGRATION_BASELINE\`

${options.body ?? "Opaque historical body."}`;
}

const fixtureMatrix: string[] = [];
function fixturePassed(id: string, result: string): void {
  fixtureMatrix.push(`${id}: ${result}`);
}

// F1 and F3 share a core/attachment context.
{
  const parsed = parseDecisionsDocument(inSection(4, `${f1}\n\n${f3}`));
  assert.deepEqual(parsed.issues, []);
  const core = parsed.entries[0];
  const attachment = parsed.entries[1];
  assert.equal(core.addressing, "id");
  assert.equal(core.id, "P25");
  assert.equal(core.ordinal, 0);
  assert.equal(core.blockKey, "P25#0");
  assert.equal(core.section, 4);
  assert.equal(core.kind, "P");
  assert.equal(core.status, "ACTIVE");
  assert.equal(core.force, "BINDING");
  assert.equal(core.date, "2026-07-03");
  assert.equal(core.authorized, "Redundant elements inside a value-complete artifact.");
  assert.equal(core.notAuthorized, "An artifact whose values the stem already states.");
  assert.equal(core.evidence, "EXHIBIT-FLOWSHEET-EXTRACTION-PROPOSAL-2026-07-03.md");
  assert.equal(core.owner, "src/schema.ts");
  assert.equal(core.execution, "EXECUTED");
  assert.equal(core.title, "Necessity is a property of the artifact");
  assert.equal(core.statementSentences, 2);
  assert.equal(attachment.ordinal, 1);
  assert.equal(attachment.blockKey, "P25#1");
  assert.equal(attachment.attachedTo, "P25#0");
  assert.equal(attachment.owner, "src/visuals/kinds/vitals_trend/index.ts");
  assert.equal(attachment.execution, "PENDING");
  fixturePassed("F1", "PASS");
  fixturePassed("F3", "PASS");
}

{
  const parsed = parseDecisionsDocument(inSection(4, f2));
  assert.deepEqual(parsed.issues, []);
  assert.equal(parsed.entries[0].blockKey, "P7#0");
  assert.equal(parsed.entries[0].force, "ADVISORY");
  assert.equal(parsed.entries[0].statementSentences, 1);
  assert.equal(parsed.entries[0].owner, undefined);
  fixturePassed("F2", "PASS");
}

{
  const parsed = parseDecisionsDocument(inSection(5, f4));
  assert.deepEqual(parsed.issues, []);
  assert.equal(parsed.entries[0].blockKey, "R3#0");
  assert.equal(parsed.entries[0].statementSentences, 1);
  assert.equal(countStatementSentences("Temperature is 46.5 °C."), 1);
  fixturePassed("F4", "PASS");
}

{
  const parsed = parseDecisionsDocument(inSection(6, f5));
  assert.deepEqual(parsed.issues, []);
  assert.equal(parsed.entries[0].addressing, "name");
  assert.equal(parsed.entries[0].id, undefined);
  assert.equal(parsed.entries[0].blockKey, "Runtime audio carries no client-embedded secret");
  assert.equal(parsed.entries[0].kind, "I");
  assert.equal(parsed.entries[0].owner, "src/audio/normalizeForTts.ts");
  fixturePassed("F5", "PASS");
}

{
  const parsed = parseDecisionsDocument(inSection(7, f6));
  assert.deepEqual(parsed.issues, []);
  assert.equal(parsed.entries[0].kind, "T");
  assert.equal(parsed.entries[0].status, "REVISIT");
  assert.equal(parsed.entries[0].force, "ADVISORY");
  fixturePassed("F6", "PASS");
}

{
  const parsed = parseArchiveDocument(f7);
  assert.deepEqual(parsed.issues, []);
  const wrapper = parsed.wrappers[0];
  assert.equal(wrapper.addressing, "id");
  assert.equal(wrapper.id, "P22");
  assert.equal(wrapper.blockKey, "P22#0");
  assert.equal(wrapper.kind, "X");
  assert.equal(wrapper.status, "SUPERSEDED");
  assert.equal(wrapper.force, "HISTORICAL");
  assert.equal(wrapper.date, "2026-07-28");
  assert.equal(wrapper.originalKind, "P");
  assert.equal(wrapper.originalStatus, "CONDITIONAL");
  assert.equal(wrapper.retiredId, "P22");
  assert.deepEqual(wrapper.origin, { section: "DECISIONS.md §5", token: "MIGRATION_BASELINE" });
  assert.equal(
    wrapper.body,
    "**22. CONDITIONAL — Opus skeleton cases are GPT-provenance for review-conflict purposes.**\n" +
      "The producer principle 2 protects against self-review is the compiler, not the prose author.",
  );
  fixturePassed("F7", "PASS");
}

{
  const parsed = parseArchiveIndexLines(inSection(8, f8));
  assert.deepEqual(parsed.issues, []);
  assert.deepEqual(parsed.lines[0], {
    addressing: "id",
    label: "P22 CONDITIONAL conditional-principle prose",
    id: "P22",
    blockKey: "P22#0",
    pointer: {
      file: "Archive/DECISIONS-ARCHIVE-<date>.md",
      anchor: "p22-conditional-conditional-principle-prose",
    },
    line: 5,
  });
  fixturePassed("F8", "PASS");
}

{
  const parsed = parseRetiredIdentifierRegister(inSection(8, f9));
  assert.deepEqual(parsed.issues, []);
  assert.equal(parsed.rows[0].id, "P22");
  assert.equal(parsed.rows[0].disposition, "RETIRED");
  assert.equal(parsed.rows[0].graphState, "RETIRED");
  assert.equal(parsed.rows[1].id, "P13");
  assert.equal(parsed.rows[1].disposition, "NEVER_ASSIGNED");
  assert.equal(parsed.rows[1].date, undefined);
  assert.equal(parsed.rows[1].pointer, undefined);
  assert.equal(parsed.rows[1].graphState, "MISSING");
  fixturePassed("F9", "PASS");
}

{
  const parsed = parseDecisionsDocument(inSection(4, f10));
  assert.deepEqual(parsed.issues, []);
  assert.equal(parsed.entries[0].statementSentences, 1);
  fixturePassed("F10", "PASS");
}

assert.equal(
  parseDecisionsDocument(`${inSection(4, f10)}\nSee [status vocabulary](#status-vocabulary).\n`).issues
    .some((finding) => finding.code === "ANCHOR_CITATION"),
  false,
);

assert.equal(countStatementSentences("Is this one sentence?! Another follows."), 2);
assert.equal(countStatementSentences("A source may say e.g. Examples remain in one sentence."), 1);
assert.equal(countStatementSentences("Prof. Smith starts after a non-listed abbreviation."), 2);
assert.equal(countStatementSentences('The first ends here.” Another follows.'), 2);
assert.equal(countStatementSentences("The first ends here. `lowercase` is conservatively undercounted."), 1);

{
  const parsed = parseEntryIndex(inSection(3, f11));
  assert.deepEqual(parsed.issues, []);
  assert.equal(parsed.index.rows.length, 3);
  assert.deepEqual(parsed.index.rows.map((row) => row.blockKey), [
    "P25#0",
    "P25#1",
    "Runtime audio carries no client-embedded secret",
  ]);
  assert.equal(parsed.index.declaredTotal, 3);
  fixturePassed("F11", "PASS");
}

{
  const parsed = parseArchiveDocument(f12);
  assert.deepEqual(parsed.issues, []);
  const wrapper = parsed.wrappers[0];
  assert.equal(wrapper.addressing, "name");
  assert.equal(wrapper.id, undefined);
  assert.equal(wrapper.blockKey, "Runtime audio carries no client-embedded secret");
  assert.equal(wrapper.originalKind, "I");
  assert.equal(wrapper.originalStatus, "ACTIVE");
  assert.equal(wrapper.retiredId, undefined);
  assert.equal(
    wrapper.body,
    "**Runtime audio must not require a client-embedded secret.**\n" +
      "The original invariant body remains byte-for-byte unchanged.",
  );
  fixturePassed("F12", "PASS");
}

{
  const parsed = parseArchiveIndexLines(inSection(8, f13));
  assert.deepEqual(parsed.issues, []);
  assert.equal(parsed.lines[0].addressing, "name");
  assert.equal(parsed.lines[0].blockKey, "Runtime audio carries no client-embedded secret");
  fixturePassed("F13", "PASS");
}

function validMalformedBase(heading: string, overrides: string[] = []): string {
  const fields = [
    "- **Kind:** P",
    "- **Status:** ACTIVE",
    "- **Force:** BINDING",
    "- **Date:** 2026-07-28",
    ...overrides,
  ];
  return `${heading}

This is a governed statement.

${fields.join("\n")}`;
}

const malformedCases: Array<{
  id: string;
  code: ParserReasonCode;
  issues: () => readonly { code: string }[];
}> = [
  {
    id: "M1",
    code: "HEADING_SHAPE",
    issues: () => parseDecisionsDocument(inSection(4, validMalformedBase("### P25 - Bad separator"))).issues,
  },
  {
    id: "M2",
    code: "DERIVED_ID",
    issues: () => parseDecisionsDocument(inSection(4, validMalformedBase("### P25.1 — Derived"))).issues,
  },
  {
    id: "M3",
    code: "DUPLICATE_CORE",
    issues: () => parseDecisionsDocument(inSection(
      4,
      `${liveBlock({ kind: "P", number: 25 })}\n\n${liveBlock({ kind: "P", number: 25, title: "Duplicate" })}`,
    )).issues,
  },
  {
    id: "M4",
    code: "ORPHAN_ATTACHMENT",
    issues: () => parseDecisionsDocument(inSection(
      4,
      `${liveBlock({ kind: "P", number: 25 })}\n\n${validMalformedBase("#### P26 — Wrong core")}`,
    )).issues,
  },
  {
    id: "M5",
    code: "EMPTY_FIELD",
    issues: () => parseDecisionsDocument(inSection(
      4,
      `${liveBlock({ kind: "P", number: 1 })}\n- **Owner:**`,
    )).issues,
  },
  {
    id: "M6",
    code: "FIELD_ORDER",
    issues: () => parseDecisionsDocument(inSection(4, `### P1 — Bad order

This is a governed statement.

- **Kind:** P
- **Force:** BINDING
- **Status:** ACTIVE
- **Date:** 2026-07-28`)).issues,
  },
  {
    id: "M7",
    code: "UNKNOWN_FIELD",
    issues: () => parseDecisionsDocument(inSection(
      4,
      `${liveBlock({ kind: "P", number: 1 })}\n- **Origin:** value`,
    )).issues,
  },
  {
    id: "M8",
    code: "STATEMENT_LENGTH",
    issues: () => parseDecisionsDocument(inSection(4, `### P1 — Too long

One sentence. Two sentence. Three sentence. Four sentence.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-28`)).issues,
  },
  {
    id: "M9",
    code: "STATEMENT_SHAPE",
    issues: () => parseDecisionsDocument(inSection(4, `### P1 — Bullet statement

- This is not prose.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-28`)).issues,
  },
  {
    id: "M10",
    code: "KIND_SECTION",
    issues: () => parseDecisionsDocument(inSection(4, liveBlock({ kind: "R", number: 1 }))).issues,
  },
  {
    id: "M11",
    code: "ANCHOR_CITATION",
    issues: () => parseDecisionsDocument(
      `${inSection(4, liveBlock({ kind: "P", number: 1 }))}\nsee [P1](#p1--p-entry-1)\n`,
    ).issues,
  },
  {
    id: "M12",
    code: "ID_ON_NAME_ADDRESSED",
    issues: () => parseDecisionsDocument(inSection(6, `### I4 — Runtime audio

This is a governed statement.

- **Kind:** I
- **Status:** ACTIVE
- **Force:** BINDING
- **Date:** 2026-07-28`)).issues,
  },
  {
    id: "M13",
    code: "ARCHIVE_BLOCK_IN_DECISIONS",
    issues: () => parseDecisionsDocument(inSection(8, archiveWrapper({
      id: "P1",
      title: "Archived",
      originalKind: "P",
    }))).issues,
  },
  {
    id: "M14",
    code: "TITLE_COLLISION",
    issues: () => parseDecisionsDocument(inSection(6, `${
      liveBlock({ kind: "I", title: "Schema changes are rare and deliberate" })
    }\n\n${liveBlock({ kind: "I", title: "Schema changes are rare and deliberate" })}`)).issues,
  },
  {
    id: "M15",
    code: "MISSING_FIELD",
    issues: () => parseDecisionsDocument(inSection(4, `### P1 — Missing date

This is a governed statement.

- **Kind:** P
- **Status:** ACTIVE
- **Force:** BINDING`)).issues,
  },
  {
    id: "M16",
    code: "INVALID_FIELD_VALUE",
    issues: () => parseDecisionsDocument(inSection(4, `### P1 — Invalid status

This is a governed statement.

- **Kind:** P
- **Status:** CURRENT
- **Force:** BINDING
- **Date:** 2026-07-28`)).issues,
  },
  {
    id: "M17",
    code: "STATUS_KIND",
    issues: () => parseDecisionsDocument(inSection(
      4,
      liveBlock({ kind: "P", number: 1, status: "REVISIT" }),
    )).issues,
  },
  {
    id: "M18",
    code: "DECLARED_TOTAL_SHAPE",
    issues: () => parseEntryIndex(inSection(3, `${f11.replace(
      "**Declared total:** 3 entry blocks.",
      "**Declared total:** three entry blocks.",
    )}`)).issues,
  },
  {
    id: "M19",
    code: "MISSING_FIELD",
    issues: () => parseArchiveDocument(archiveWrapper({
      id: "P1",
      title: "Missing original status",
      originalKind: "P",
      includeOriginalStatus: false,
    })).issues,
  },
];

for (const malformed of malformedCases) {
  expectParserCode(malformed.id, malformed.issues(), malformed.code);
  fixturePassed(malformed.id, `REJECT ${malformed.code}`);
}

expectParserCode(
  "nearest preceding core",
  parseDecisionsDocument(inSection(
    4,
    `${liveBlock({ kind: "P", number: 1 })}\n\n${liveBlock({ kind: "P", number: 2 })}\n\n${
      validMalformedBase("#### P1 — Not attached to the nearest core")
    }`,
  )).issues,
  "ORPHAN_ATTACHMENT",
);

function conformance(options: Parameters<typeof buildDecisions>[0], archiveText = "") {
  return checkDecisionsFormat({
    decisionsText: buildDecisions(options),
    decisionsSource: "candidate-DECISIONS.md",
    archiveText,
    archiveSource: "candidate-archive.md",
    trackedPaths: trackedFixturePaths,
  });
}

const p1 = liveBlock({ kind: "P", number: 1 });
const p2 = liveBlock({ kind: "P", number: 2 });
const p3 = liveBlock({ kind: "P", number: 3 });
const p4 = liveBlock({ kind: "P", number: 4 });

{
  const result = conformance({
    rows: [{ id: "P1", kind: "P", summary: "P entry 1" }],
    p: [p1],
    declaredTotal: null,
  });
  expectConformanceCode("C1", result, "MISSING_DECLARED_TOTAL");
  fixturePassed("C1", "FINDING MISSING_DECLARED_TOTAL");
}

{
  const result = conformance({
    rows: [
      { id: "P1", kind: "P", summary: "P entry 1" },
      { id: "P2", kind: "P", summary: "P entry 2" },
    ],
    p: [p1, p3],
    section8: `| ID | disposition | date | pointer |
|---|---|---|---|
| P2 | NEVER ASSIGNED | — | — |`,
  });
  expectConformanceCode("C2", result, "INDEX_BODY_MISMATCH");
  fixturePassed("C2", "FINDING INDEX_BODY_MISMATCH");
}

{
  const result = conformance({
    rows: [
      { id: "P2", kind: "P", summary: "P entry 2" },
      { id: "P1", kind: "P", summary: "P entry 1" },
    ],
    p: [p1, p2],
  });
  expectConformanceCode("C3", result, "INDEX_ORDER_MISMATCH");
  fixturePassed("C3", "FINDING INDEX_ORDER_MISMATCH");
}

{
  const result = conformance({
    rows: [
      { id: "P1", kind: "P", summary: "P entry 1" },
      { id: "P2", kind: "P", summary: "P entry 2" },
      { id: "P3", kind: "P", summary: "P entry 3" },
    ],
    p: [p1, p2, p3],
    declaredTotal: 4,
  });
  expectConformanceCode("C4", result, "DECLARED_TOTAL_MISMATCH");
  fixturePassed("C4", "FINDING DECLARED_TOTAL_MISMATCH");
}

{
  const result = conformance({
    rows: [{ id: "P1", kind: "P", summary: "P entry 1" }],
    p: [liveBlock({ kind: "P", number: 1, owner: "not-a-real-owner.ts" })],
  });
  expectConformanceCode("C5", result, "UNTRACKED_PATH");
  fixturePassed("C5", "FINDING UNTRACKED_PATH");
}

{
  const result = conformance({
    rows: [
      { id: "P1", kind: "P", summary: "P entry 1" },
      { id: "P2", kind: "P", summary: "P entry 2" },
      { id: "P4", kind: "P", summary: "P entry 4" },
    ],
    p: [p1, p2, p4],
  });
  expectConformanceCode("C6", result, "ALLOCATION_GAP");
  fixturePassed("C6", "FINDING ALLOCATION_GAP");
}

{
  const result = conformance({
    rows: [{ id: "P1", kind: "P", summary: "P entry 1" }],
    p: [p1],
    section8: `- **Missing archive wrapper** — retired 2026-07-28.
  \`candidate-archive.md#missing-archive-wrapper\``,
  });
  expectConformanceCode("C7", result, "ARCHIVE_INDEX_MISMATCH");
  fixturePassed("C7", "FINDING ARCHIVE_INDEX_MISMATCH");
}

{
  const result = conformance({
    rows: [{ id: "P1", kind: "P", summary: "P entry 1" }],
    p: [p1],
    section8: `| ID | disposition | date | pointer |
|---|---|---|---|
| P1 | RETIRED | 2026-07-28 | \`candidate-archive.md#p1\` |`,
  });
  expectConformanceCode("C8", result, "RETIRED_ID_CONFLICT");
  fixturePassed("C8", "FINDING RETIRED_ID_CONFLICT");
}

// Assertion 10 covers both append-only register dispositions.
{
  const result = conformance({
    rows: [{ id: "P1", kind: "P", summary: "P entry 1" }],
    p: [p1],
    section8: `| ID | disposition | date | pointer |
|---|---|---|---|
| P1 | NEVER ASSIGNED | — | — |`,
  });
  expectConformanceCode("never-assigned-live-reuse", result, "RETIRED_ID_CONFLICT");
}

// Archive pointer file and anchor resolution fail independently.
{
  const correctArchive = archiveWrapper({
    id: "P22",
    title: "Correct title",
    originalKind: "P",
  });
  const archiveLine = (file: string, anchor: string) => `- **P22 Correct title** — retired 2026-07-28.
  \`${file}#${anchor}\``;
  const archiveCandidate = (file: string, anchor: string) => checkDecisionsFormat({
    decisionsText: buildDecisions({
      rows: [{ id: "P1", kind: "P", summary: "P entry 1" }],
      p: [p1],
      section8: archiveLine(file, anchor),
    }),
    decisionsSource: "candidate-DECISIONS.md",
    archiveText: correctArchive,
    archiveSource: "candidate-archive.md",
    trackedPaths: trackedFixturePaths,
  });

  const correct = archiveCandidate("candidate-archive.md", "p22-correct-title");
  assert.equal(correct.ok, true, renderDecisionsFormatResult(correct));

  const wrongFile = archiveCandidate("completely-wrong-file.md", "p22-correct-title");
  expectConformanceCode("wrong-archive-pointer-file", wrongFile, "ARCHIVE_INDEX_MISMATCH");
  assert.match(renderDecisionsFormatResult(wrongFile), /pointer file/);
  assert.doesNotMatch(renderDecisionsFormatResult(wrongFile), /pointer anchor/);

  const wrongAnchor = archiveCandidate("candidate-archive.md", "nonexistent-anchor");
  expectConformanceCode("wrong-archive-pointer-anchor", wrongAnchor, "ARCHIVE_INDEX_MISMATCH");
  assert.match(renderDecisionsFormatResult(wrongAnchor), /pointer anchor/);
  assert.doesNotMatch(renderDecisionsFormatResult(wrongAnchor), /pointer file/);
}

// Live and archive field vocabularies remain separate.
expectParserCode(
  "live/archive vocabulary separation",
  parseDecisionsDocument(inSection(4, `${p1}\n- **Original Kind:** P`)).issues,
  "UNKNOWN_FIELD",
);
expectParserCode(
  "archive/live vocabulary separation",
  parseArchiveDocument(f7.replace("- **Origin:**", "- **Owner:** `src/schema.ts`\n- **Origin:**")).issues,
  "UNKNOWN_FIELD",
);

// Every allowed and excluded live kind/status pairing is pinned.
const statusValues: EntryStatus[] = ["ACTIVE", "CONDITIONAL", "PARKED", "REVISIT", "SUPERSEDED"];
const allowedStatuses: Record<LiveKind, readonly EntryStatus[]> = {
  P: ["ACTIVE", "CONDITIONAL", "PARKED"],
  R: ["ACTIVE", "PARKED"],
  I: ["ACTIVE"],
  T: ["ACTIVE", "PARKED", "REVISIT"],
};
for (const kind of ["P", "R", "I", "T"] as const) {
  const section = kind === "P" ? 4 : kind === "R" ? 5 : kind === "I" ? 6 : 7;
  for (const status of statusValues) {
    const parsed = parseDecisionsDocument(inSection(section, liveBlock({ kind, status })));
    const hasStatusKind = parsed.issues.some((finding) => finding.code === "STATUS_KIND");
    assert.equal(
      hasStatusKind,
      !allowedStatuses[kind].includes(status),
      `${kind} + ${status} compatibility`,
    );
  }
}

// Both archive addressing modes join and opaque bodies preserve bytes.
{
  const decisionsText = buildDecisions({
    rows: [{ id: "P1", kind: "P", summary: "P entry 1" }],
    p: [p1],
    section8: `- **P22 Conditional rule** — retired 2026-07-28.
  \`candidate-archive.md#p22-conditional-rule\`
- **Archived invariant** — retired 2026-07-28.
  \`candidate-archive.md#archived-invariant\``,
  });
  const archiveText = `${archiveWrapper({
    id: "P22",
    title: "Conditional rule",
    originalKind: "P",
    originalStatus: "CONDITIONAL",
    body: "First body byte.\nSecond body byte.",
  })}

${archiveWrapper({
    title: "Archived invariant",
    originalKind: "I",
    body: "Invariant body byte.",
  })}`;
  const result = checkDecisionsFormat({
    decisionsText,
    archiveText,
    archiveSource: "candidate-archive.md",
    trackedPaths: trackedFixturePaths,
  });
  // P2-P21 are intentionally absent here, so ignore the allocation finding for this join-focused assertion.
  assert.deepEqual(
    result.issues.filter((finding) => finding.code !== "ALLOCATION_GAP"),
    [],
  );
  assert.equal(result.archive?.wrappers[0].originalStatus, "CONDITIONAL");
  assert.equal(result.archive?.wrappers[0].body, "First body byte.\nSecond body byte.\n\n");
  assert.equal(result.archive?.wrappers[1].originalKind, "I");
  assert.equal(result.archive?.wrappers[1].body, "Invariant body byte.");
}

// Allocation succeeds over the union even when the live set is gappy.
{
  const result = conformance({
    rows: [
      { id: "P1", kind: "P", summary: "P entry 1" },
      { id: "P3", kind: "P", summary: "P entry 3" },
    ],
    p: [p1, p3],
    section8: `| ID | disposition | date | pointer |
|---|---|---|---|
| P2 | NEVER ASSIGNED | — | — |`,
  });
  assert.equal(result.issues.some((finding) => finding.code === "ALLOCATION_GAP"), false);
  assert.equal(result.ok, true, renderDecisionsFormatResult(result));
}

// Tracked path acceptance and rejection are distinct.
{
  const accepted = conformance({
    rows: [{ id: "P1", kind: "P", summary: "P entry 1" }],
    p: [liveBlock({ kind: "P", number: 1, owner: "tracked-owner.ts" })],
  });
  assert.equal(accepted.ok, true, renderDecisionsFormatResult(accepted));
  const rejected = conformance({
    rows: [{ id: "P1", kind: "P", summary: "P entry 1" }],
    p: [liveBlock({ kind: "P", number: 1, owner: "untracked-owner.ts" })],
  });
  expectConformanceCode("untracked-path", rejected, "UNTRACKED_PATH");
}

async function createCliControls(): Promise<{
  root: string;
  negativeDecisions: string;
  repairedDecisions: string;
  archive: string;
}> {
  const root = await mkdtemp(join(tmpdir(), "shrimp-decisions-format-"));
  const negativeDecisions = join(root, "negative-DECISIONS.md");
  const repairedDecisions = join(root, "repaired-DECISIONS.md");
  const archive = join(root, "candidate-archive.md");
  const malformed = liveBlock({
    kind: "P",
    number: 4,
    heading: "### P4 - Malformed heading",
  });
  const negative = buildDecisions({
    rows: [
      { id: "P1", kind: "P", summary: "P entry 1" },
      { id: "P2", kind: "P", summary: "P entry 2" },
    ],
    p: [
      liveBlock({ kind: "P", number: 1, owner: "not-a-real-owner.ts" }),
      p3,
      malformed,
    ],
    section8: `- **Missing archive wrapper** — retired 2026-07-28.
  \`candidate-archive.md#missing-archive-wrapper\`

| ID | disposition | date | pointer |
|---|---|---|---|
| P2 | NEVER ASSIGNED | — | — |`,
  });
  const repaired = buildDecisions({
    rows: [
      { id: "P1", kind: "P", summary: "P entry 1" },
      { id: "P2", kind: "P", summary: "P entry 2" },
    ],
    p: [
      liveBlock({ kind: "P", number: 1, owner: "tracked-owner.ts" }),
      p2,
    ],
  });
  await writeFile(join(root, "tracked-owner.ts"), "export {};\n");
  await writeFile(negativeDecisions, negative);
  await writeFile(repairedDecisions, repaired);
  await writeFile(archive, "");
  const init = spawnSync("git", ["init", "-q"], { cwd: root, encoding: "utf8" });
  assert.equal(init.status, 0, init.stderr);
  const add = spawnSync("git", ["add", "--", "tracked-owner.ts"], { cwd: root, encoding: "utf8" });
  assert.equal(add.status, 0, add.stderr);
  return { root, negativeDecisions, repairedDecisions, archive };
}

const controls = await createCliControls();
try {
  const negative = await runDecisionsFormatConformance({
    root: controls.root,
    decisions: controls.negativeDecisions,
    archive: controls.archive,
  });
  assert.equal(negative.exitCode, 1);
  for (const code of [
    "HEADING_SHAPE",
    "INDEX_BODY_MISMATCH",
    "UNTRACKED_PATH",
    "ARCHIVE_INDEX_MISMATCH",
  ] as const) {
    assert.match(negative.output, new RegExp(`\\b${code}\\b`), `negative control must name ${code}`);
  }

  const repaired = await runDecisionsFormatConformance({
    root: controls.root,
    decisions: controls.repairedDecisions,
    archive: controls.archive,
  });
  assert.equal(repaired.exitCode, 0, repaired.output);
  assert.match(repaired.output, /^\[PASS\]/);

  const tsxCli = resolve("node_modules/tsx/dist/cli.mjs");
  const cliScript = resolve("scripts/decisions-format-conform.ts");
  const child = spawnSync(process.execPath, [
    tsxCli,
    cliScript,
    "--root",
    controls.root,
    "--decisions",
    controls.negativeDecisions,
    "--archive",
    controls.archive,
  ], { encoding: "utf8" });
  assert.equal(child.status, 1, `${child.stdout}\n${child.stderr}`);
  const cliOutput = `${child.stdout}\n${child.stderr}`;
  for (const code of [
    "HEADING_SHAPE",
    "INDEX_BODY_MISMATCH",
    "UNTRACKED_PATH",
    "ARCHIVE_INDEX_MISMATCH",
  ]) {
    assert.match(cliOutput, new RegExp(`\\b${code}\\b`));
  }

  console.log("Fixture matrix");
  const fixtureOrder = (row: string) => {
    const match = /^([FMC])(\d+)/.exec(row);
    const group = match?.[1] === "F" ? 0 : match?.[1] === "M" ? 1 : 2;
    return group * 100 + Number(match?.[2] ?? 0);
  };
  for (const row of [...fixtureMatrix].sort((left, right) => fixtureOrder(left) - fixtureOrder(right))) {
    console.log(row);
  }
  console.log("Negative control output");
  console.log(negative.output);
  console.log("Repaired control output");
  console.log(repaired.output);
  if (process.env.DECISIONS_FORMAT_KEEP_FIXTURES === "1") {
    console.log(`CONTROL_ROOT=${controls.root}`);
    console.log(`NEGATIVE_DECISIONS=${controls.negativeDecisions}`);
    console.log(`REPAIRED_DECISIONS=${controls.repairedDecisions}`);
    console.log(`CONTROL_ARCHIVE=${controls.archive}`);
  }
  console.log("decisions-format tests passed");
} finally {
  if (process.env.DECISIONS_FORMAT_KEEP_FIXTURES !== "1") {
    await rm(controls.root, { recursive: true, force: true });
  }
}
