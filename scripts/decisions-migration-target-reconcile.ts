/**
 * Stage 2b Phase 5 target reconciliation checker.
 *
 * The zero-argument invocation is permanently bound to the canonical target,
 * normalized archive, and preservation snapshot. Negative controls may redirect
 * only those three inputs with test-only CLI flags:
 *
 *   --target <path> --archive <path> --snapshot <path>
 *
 * All authority documents, frozen phase-1 artifacts, and MIGRATION_BASELINE are
 * always read from their canonical repository or Git-object locations.
 */

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  parseArchiveDocument,
  parseDecisionsDocument,
  type LiveEntry,
} from "../lib/decisions-format";

const ROOT = resolve(import.meta.dirname, "..");
const MIGRATION_BASELINE = "d499cc1d0916e03830489ec9cd0324cd1a203a73";

const PATHS = {
  inventory: resolve(ROOT, "audit/decisions-cleanup-2026-07-24/inventory.md"),
  migration: resolve(ROOT, "audit/decisions-cleanup-2026-07-24/migration-table.md"),
  outline: resolve(ROOT, "audit/decisions-cleanup-2026-07-24/outline-before-after.md"),
  manifest: resolve(ROOT, "audit/decisions-migration-2026-07-29/target-text-manifest.md"),
  amendment2: resolve(
    ROOT,
    "DECISIONS-MIGRATION-COMMISSION-AMENDMENT-2-STRUCTURAL-SURFACES-2026-08-08.md",
  ),
  amendment3: resolve(
    ROOT,
    "DECISIONS-MIGRATION-COMMISSION-AMENDMENT-3-ASSEMBLY-JOINS-2026-08-08.md",
  ),
  amendment4: resolve(
    ROOT,
    "DECISIONS-ARCHIVE-PRESERVATION-AND-WRAPPER-ADDRESSING-AMENDMENT-2026-07-29.md",
  ),
  target: resolve(ROOT, "DECISIONS.md"),
  archive: resolve(ROOT, "Archive/DECISIONS-ARCHIVE-2026-08-18.md"),
  snapshot: resolve(ROOT, "Archive/DECISIONS-PRE-MIGRATION-2026-07-29.md"),
} as const;

const PINNED = {
  sourceRows: { live: 65, wrappers: 13, structuralE053: 1, mergeE037: 1, total: 80 },
  sections: { P: 37, R: 6, I: 19, T: 3 },
  archiveIndexLines: 13,
  archiveWrappers: 13,
  retired: new Map([
    ["P9", "RETIRED"],
    ["P12", "RETIRED"],
    ["P13", "NEVER_ASSIGNED"],
    ["P14", "NEVER_ASSIGNED"],
    ["P18", "RETIRED"],
    ["P22", "RETIRED"],
  ]),
  allocationMax: { P: 31, R: 6 },
  identities: {
    manifest: {
      bytes: 332579,
      sha256: "818be99ae9574cb3cf76015516561db601ab5e471daeb36ce81be93c09160fe2",
    },
    amendment2: {
      bytes: 24202,
      sha256: "4cb16995cf8810bcf3ee65ffb07dc32a14a4fb5b0c4adc8ba5bbb2a2a535e9f4",
    },
    amendment3: {
      bytes: 26963,
      sha256: "9a1a3a898bf847d8dbe760c7aba702f3a3c3c3381c760bba989ffa5b8542944e",
    },
    amendment4Bytes: 22665,
    baselineBytes: 76314,
    baselineSha256: "b22b3fffc058a5e84931ca1b14b08a1b7f1206d1ccd5154a7a7f1de8ad0f0d6e",
  },
} as const;

type Destination = "STAY" | "ARCHIVE" | "MERGE_INTO";
type MigrationRow = { id: string; destination: Destination; targets: string[] };
type LiveManifestRecord = {
  key: string;
  sourceIds: string[];
  heading: string;
  statement: string;
  fields: string;
  indexRow: string;
};
type WrapperManifestRecord = {
  sourceId: string;
  blockKey: string;
  spanStart: number;
  spanEnd: number;
  byteLength: number;
  sha256: string;
  separator: Buffer;
};
type TargetComponents = {
  heading: string;
  statement: string;
  fields: string;
  indexRow?: string;
};
type Report = { number: number; title: string; detail: string; failures: string[] };
type PhysicalLines = { values: string[] };

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

function strictUtf8(value: Buffer, source: string): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(value);
  } catch {
    throw new Error(`${source} is not valid UTF-8`);
  }
}

function physicalLines(text: string): PhysicalLines {
  return { values: text.split("\n") };
}

function lineAt(
  lines: PhysicalLines,
  lineNumber: number,
  label: string,
  failures: string[],
): string | null {
  if (!Number.isInteger(lineNumber) || lineNumber < 1 || lineNumber > lines.values.length) {
    failures.push(`${label}: line ${lineNumber} is outside 1..${lines.values.length}`);
    return null;
  }
  return lines.values[lineNumber - 1];
}

function sliceLines(
  lines: PhysicalLines,
  startLine: number,
  endLine: number,
  label: string,
  failures: string[],
): string | null {
  if (
    !Number.isInteger(startLine) ||
    !Number.isInteger(endLine) ||
    startLine < 1 ||
    endLine > lines.values.length ||
    endLine < startLine
  ) {
    failures.push(
      `${label}: invalid line range ${startLine}..${endLine} for 1..${lines.values.length}`,
    );
    return null;
  }
  return lines.values.slice(startLine - 1, endLine).join("\n");
}

function lastNonBlankBefore(
  lines: PhysicalLines,
  beforeLine: number,
  floorLine: number,
  label: string,
  failures: string[],
): number | null {
  if (
    !Number.isInteger(beforeLine) ||
    !Number.isInteger(floorLine) ||
    floorLine < 1 ||
    beforeLine > lines.values.length + 1 ||
    beforeLine <= floorLine
  ) {
    failures.push(
      `${label}: invalid backward boundary before ${beforeLine} with floor ${floorLine}`,
    );
    return null;
  }
  for (let lineNumber = beforeLine - 1; lineNumber >= floorLine; lineNumber -= 1) {
    const value = lineAt(lines, lineNumber, label, failures);
    if (value === null) return null;
    if (!/^\s*$/.test(value)) return lineNumber;
  }
  failures.push(`${label}: no nonblank line exists before ${beforeLine} at or after ${floorLine}`);
  return null;
}

function compareLocatedSurface(
  name: string,
  actual: string | null,
  expected: string | undefined,
  authority: string,
  failures: string[],
): void {
  if (expected === undefined) {
    failures.push(`${name}: expected payload is absent from ${authority}`);
  } else if (actual !== null && actual !== expected) {
    failures.push(`${name}: location-bound target bytes differ from ${authority}`);
  }
}

function parseOverrides(argv: string[]): { target: string; archive: string; snapshot: string } {
  const result = { target: PATHS.target, archive: PATHS.archive, snapshot: PATHS.snapshot };
  const seen = new Set<string>();
  const allowed = new Map([
    ["--target", "target"],
    ["--archive", "archive"],
    ["--snapshot", "snapshot"],
  ] as const);
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const key = allowed.get(flag as "--target" | "--archive" | "--snapshot");
    const value = argv[index + 1];
    if (!key || !value || value.startsWith("--") || seen.has(flag)) {
      throw new Error(
        "usage: decisions-migration-target-reconcile.ts [--target <path>] [--archive <path>] [--snapshot <path>]",
      );
    }
    seen.add(flag);
    result[key] = resolve(process.cwd(), value);
  }
  return result;
}

function cleanCell(cell: string): string {
  return cell.trim().replace(/\*\*/g, "").replace(/`/g, "").trim();
}

function tableAfterHeading(text: string, heading: string): string[][] {
  const lines = text.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => line.trim() === heading);
  if (headingIndex < 0) return [];
  const headerIndex = lines.findIndex(
    (line, index) => index > headingIndex && line.trim().startsWith("|"),
  );
  if (headerIndex < 0) return [];
  const rows: string[][] = [];
  for (let index = headerIndex; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line.startsWith("|")) break;
    const cells = line.slice(1, -1).split("|").map(cleanCell);
    if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) continue;
    rows.push(cells);
  }
  return rows;
}

function entryId(cell: string): string | null {
  return cleanCell(cell).match(/^E\d{3}[a-z]?$/)?.[0] ?? null;
}

function expectedPopulation(): Set<string> {
  const ids: string[] = [];
  for (let value = 1; value <= 35; value += 1) ids.push(`E${String(value).padStart(3, "0")}`);
  ids.push("E036", "E037", "E038", "E039a", "E039b");
  ids.push("E040", "E041", "E042", "E043b", "E043a");
  for (let value = 44; value <= 46; value += 1) ids.push(`E${String(value).padStart(3, "0")}`);
  ids.push("E047a", "E047b", "E047c");
  for (let value = 48; value <= 76; value += 1) ids.push(`E${String(value).padStart(3, "0")}`);
  return new Set(ids);
}

function parseMigration(text: string): MigrationRow[] {
  const heading = [
    "# DECISIONS.md Cleanup — Phase 1 (Closure Repair) — Migration Table",
    "# DECISIONS.md Cleanup — Phase 1 (Correction Pass) — Migration Table",
  ].find((candidate) => text.includes(candidate));
  const rows = heading ? tableAfterHeading(text, heading) : [];
  const result: MigrationRow[] = [];
  for (const cells of rows.slice(1)) {
    const id = entryId(cells[0] ?? "");
    if (!id) continue;
    const destinationCell = cleanCell(cells[6] ?? "");
    const destination = destinationCell === "STAY"
      ? "STAY"
      : destinationCell === "ARCHIVE"
        ? "ARCHIVE"
        : /^MERGE_INTO\s+E\d{3}[a-z]?(?:,\s*E\d{3}[a-z]?)*$/.test(destinationCell)
          ? "MERGE_INTO"
          : null;
    if (!destination) continue;
    result.push({
      id,
      destination,
      targets: destination === "MERGE_INTO"
        ? [...destinationCell.matchAll(/E\d{3}[a-z]?/g)].map((match) => match[0])
        : [],
    });
  }
  return result;
}

function fencedAfter(text: string, marker: string, language = "text"): string | null {
  const markerIndex = text.indexOf(marker);
  if (markerIndex < 0) return null;
  const opening = `\n\n\`\`\`${language}\n`;
  const openingIndex = text.indexOf(opening, markerIndex + marker.length);
  if (openingIndex < 0) return null;
  const payloadStart = openingIndex + opening.length;
  const payloadEnd = text.indexOf("\n```", payloadStart);
  return payloadEnd < 0 ? null : text.slice(payloadStart, payloadEnd);
}

function parseLiveManifestRecords(text: string, failures: string[]): LiveManifestRecord[] {
  const headings = [...text.matchAll(/^### M4\.(\d+) `([^`]+)`$/gm)]
    .filter((match) => Number(match[1]) >= 2 && Number(match[1]) <= 66);
  const records: LiveManifestRecord[] = [];
  for (let index = 0; index < headings.length; index += 1) {
    const match = headings[index];
    const start = match.index ?? 0;
    const end = headings[index + 1]?.index ?? text.indexOf("\n---\n\n## M5.", start);
    const section = text.slice(start, end < 0 ? text.length : end);
    const sourceLine = section.match(/^1\. \*\*Source entry ID\(s\):\*\* (.+)$/m)?.[1] ?? "";
    const primarySourceId = sourceLine.match(/E\d{3}[a-z]?/)?.[0];
    const sourceIds = primarySourceId && primarySourceId !== "E037" ? [primarySourceId] : [];
    const heading = fencedAfter(section, "7. **Exact heading bytes:**");
    const statement = fencedAfter(section, "8. **Exact statement bytes:**");
    const fields = fencedAfter(section, "9. **Exact field lines, final order:**");
    const indexRow = fencedAfter(section, "11. **Exact entry-index row:**");
    if (sourceIds.length !== 1 || heading === null || statement === null || fields === null || indexRow === null) {
      failures.push(`manifest live record ${match[2]} is missing a required item or primary source ID`);
      continue;
    }
    records.push({ key: match[2], sourceIds, heading, statement, fields, indexRow });
  }
  return records;
}

function parseWrapperManifestRecords(text: string, failures: string[]): WrapperManifestRecord[] {
  const headings = [...text.matchAll(/^#### M5\.5\.(\d+) Wrapper \d+ — .+$/gm)];
  const records: WrapperManifestRecord[] = [];
  for (let index = 0; index < headings.length; index += 1) {
    const match = headings[index];
    const start = match.index ?? 0;
    const end = headings[index + 1]?.index ?? text.indexOf("\n### M5.6 ", start);
    const section = text.slice(start, end < 0 ? text.length : end);
    const sourceId = section.match(/^1\. \*\*Source entry ID:\*\* `(E\d{3}[a-z]?)`$/m)?.[1];
    const heading = fencedAfter(section, "3. **Exact unique heading / archive label:**");
    const span = section.match(/^9\. \*\*Source byte offsets:\*\* `\[(\d+),(\d+)\)`$/m);
    const hash = section.match(/^10\. \*\*SHA-256 of the exact body bytes:\*\* `([0-9a-f]{64})`$/m)?.[1];
    const byteLength = Number(section.match(/^11\. \*\*Byte length:\*\* `(\d+)`$/m)?.[1]);
    const separatorLine = section.match(/^13\. \*\*Separator after body:\*\* (.+)$/m)?.[1] ?? "";
    const separator = separatorLine.startsWith("one LF")
      ? Buffer.from("\n")
      : separatorLine.startsWith("two LFs")
        ? Buffer.from("\n\n")
        : separatorLine.startsWith("none")
          ? Buffer.alloc(0)
          : null;
    if (!sourceId || heading === null || !span || !hash || !Number.isFinite(byteLength) || separator === null) {
      failures.push(`manifest wrapper ${match[1]} is missing a required preservation pin`);
      continue;
    }
    const rawHeading = heading.replace(/^### /, "");
    const idMatch = /^((?:P|R)\d+) — /.exec(rawHeading);
    records.push({
      sourceId,
      blockKey: idMatch ? `${idMatch[1]}#0` : rawHeading,
      spanStart: Number(span[1]),
      spanEnd: Number(span[2]),
      byteLength,
      sha256: hash,
      separator,
    });
  }
  return records;
}

function extractTargetComponents(
  text: string,
  entry: LiveEntry,
  indexRowLine: number | undefined,
): TargetComponents {
  const lines = text.split("\n");
  const headingIndex = entry.line - 1;
  let blockEnd = headingIndex + 1;
  while (blockEnd < lines.length && !/^#{1,6} /.test(lines[blockEnd])) blockEnd += 1;
  let statementStart = headingIndex + 1;
  while (statementStart < blockEnd && lines[statementStart] === "") statementStart += 1;
  let fieldStart = statementStart;
  while (fieldStart < blockEnd && !/^- \*\*[^*]+:\*\* /.test(lines[fieldStart])) fieldStart += 1;
  let statementEnd = fieldStart;
  while (statementEnd > statementStart && lines[statementEnd - 1] === "") statementEnd -= 1;
  let fieldEnd = fieldStart;
  while (fieldEnd < blockEnd && /^- \*\*[^*]+:\*\* /.test(lines[fieldEnd])) fieldEnd += 1;
  return {
    heading: lines[headingIndex] ?? "",
    statement: lines.slice(statementStart, statementEnd).join("\n"),
    fields: lines.slice(fieldStart, fieldEnd).join("\n"),
    indexRow: indexRowLine === undefined ? undefined : lines[indexRowLine - 1],
  };
}

function duplicateValues(values: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].sort();
}

function compareSet(
  actual: ReadonlySet<string>,
  expected: ReadonlySet<string>,
  actualName: string,
  expectedName: string,
): string[] {
  const failures: string[] = [];
  for (const value of [...actual].sort()) {
    if (!expected.has(value)) failures.push(`${value} is in ${actualName} but not ${expectedName}`);
  }
  for (const value of [...expected].sort()) {
    if (!actual.has(value)) failures.push(`${value} is in ${expectedName} but not ${actualName}`);
  }
  return failures;
}

function countOccurrences(text: string, needle: string): number {
  if (needle.length === 0) return 0;
  let count = 0;
  let offset = 0;
  while ((offset = text.indexOf(needle, offset)) >= 0) {
    count += 1;
    offset += needle.length;
  }
  return count;
}

function amendment2Surfaces(text: string, failures: string[]): Array<{ name: string; payload: string }> {
  const section21 = text.slice(text.indexOf("### 2.1 "), text.indexOf("### 2.2 "));
  const section22 = text.slice(text.indexOf("### 2.2 "), text.indexOf("### 2.3 "));
  const section23 = text.slice(text.indexOf("### 2.3 "), text.indexOf("\n---\n\n## 3."));
  const intro = fencedAfter(section21, "### 2.1 Target §3 introduction", "markdown");
  const framing = fencedAfter(section22, "### 2.2 Target §3 table framing", "markdown");
  const firstFenceEnd = framing === null ? -1 : section22.indexOf("\n```", section22.indexOf("```markdown\n") + 12);
  const total = firstFenceEnd < 0
    ? null
    : fencedAfter(section22.slice(firstFenceEnd + 4), "The 65 body rows", "markdown");
  const transitions: string[] = [];
  let offset = 0;
  while (offset < section23.length) {
    const opening = section23.indexOf("```markdown\n", offset);
    if (opening < 0) break;
    const start = opening + "```markdown\n".length;
    const end = section23.indexOf("\n```", start);
    if (end < 0) break;
    transitions.push(section23.slice(start, end));
    offset = end + 4;
  }
  if (intro === null || framing === null || total === null || framing.split("\n").length !== 2 || transitions.length !== 4) {
    failures.push("ratified Amendment 2 did not yield the expected eight structural surfaces");
    return [];
  }
  return [
    { name: "§3 introduction", payload: intro },
    { name: "§3 table header", payload: framing.split("\n")[0] },
    { name: "§3 table separator", payload: framing.split("\n")[1] },
    { name: "§3 declared total", payload: total },
    ...transitions.map((payload, index) => ({ name: `§${index + 4} heading/transition`, payload })),
  ];
}

function formatIssue(issue: { code: string; message: string; line?: number; blockKey?: string }): string {
  const location = [issue.blockKey, issue.line === undefined ? undefined : `line ${issue.line}`]
    .filter((value): value is string => value !== undefined)
    .join(", ");
  return `${issue.code}${location ? ` (${location})` : ""}: ${issue.message}`;
}

function pushCountFailure(failures: string[], label: string, actual: number, expected: number): void {
  if (actual !== expected) failures.push(`${label}: found ${actual}, pinned ${expected}`);
}

function reportLine(report: Report): string {
  const verdict = report.failures.length === 0 ? "PASS" : "FAIL";
  return `Report ${report.number} [${verdict}] — ${report.title}: ${report.detail}`;
}

function main(): void {
  const overrideArguments = process.argv.slice(2);
  const overrides = parseOverrides(overrideArguments);
  const testOverrideActive = overrideArguments.length > 0;
  const globalFailures: string[] = [];

  const manifestBuffer = readFileSync(PATHS.manifest);
  const amendment2Buffer = readFileSync(PATHS.amendment2);
  const amendment3Buffer = readFileSync(PATHS.amendment3);
  const amendment4Buffer = readFileSync(PATHS.amendment4);
  const baselineBuffer = execFileSync(
    "git",
    ["show", `${MIGRATION_BASELINE}:DECISIONS.md`],
    { cwd: ROOT, maxBuffer: 2 * 1024 * 1024 },
  );

  for (const [label, buffer, identity] of [
    ["ratified manifest", manifestBuffer, PINNED.identities.manifest],
    ["ratified Amendment 2", amendment2Buffer, PINNED.identities.amendment2],
    ["ratified Amendment 3", amendment3Buffer, PINNED.identities.amendment3],
  ] as const) {
    if (buffer.length !== identity.bytes || sha256(buffer) !== identity.sha256) {
      globalFailures.push(`${label} identity differs from its ratified byte length/SHA-256`);
    }
  }
  if (amendment4Buffer.length !== PINNED.identities.amendment4Bytes) {
    globalFailures.push("ratified Amendment 4 byte length differs from its authorized identity");
  }
  if (
    baselineBuffer.length !== PINNED.identities.baselineBytes ||
    sha256(baselineBuffer) !== PINNED.identities.baselineSha256
  ) {
    globalFailures.push("MIGRATION_BASELINE DECISIONS.md differs from its pinned byte length/SHA-256");
  }

  const manifestText = strictUtf8(manifestBuffer, "ratified manifest");
  const amendment2Text = strictUtf8(amendment2Buffer, "ratified Amendment 2");
  const amendment3Text = strictUtf8(amendment3Buffer, "ratified Amendment 3");
  const amendment4Text = strictUtf8(amendment4Buffer, "ratified Amendment 4");
  const targetText = strictUtf8(readFileSync(overrides.target), overrides.target);
  const archiveText = strictUtf8(readFileSync(overrides.archive), overrides.archive);
  const snapshotBuffer = readFileSync(overrides.snapshot);
  const inventoryText = readFileSync(PATHS.inventory, "utf8");
  const migrationText = readFileSync(PATHS.migration, "utf8");
  const outlineText = readFileSync(PATHS.outline, "utf8");

  const manifestFailures: string[] = [];
  const liveRecords = parseLiveManifestRecords(manifestText, manifestFailures);
  const wrapperRecords = parseWrapperManifestRecords(manifestText, manifestFailures);
  globalFailures.push(...manifestFailures);

  const migrationRows = parseMigration(migrationText);
  const migrationById = new Map(migrationRows.map((row) => [row.id, row]));
  const inventoryRows = tableAfterHeading(inventoryText, "## Classification table");
  const inventoryIds = inventoryRows.slice(1)
    .map((row) => entryId(row[0] ?? ""))
    .filter((id): id is string => id !== null);
  const outlineDestinations = tableAfterHeading(outlineText, "### Authoritative destination table")
    .slice(1)
    .map((row) => entryId(row[0] ?? ""))
    .filter((id): id is string => id !== null);
  const outlineMerges = tableAfterHeading(outlineText, "### Authoritative merge table")
    .slice(1)
    .map((row) => entryId(row[0] ?? ""))
    .filter((id): id is string => id !== null);

  const parsedTarget = parseDecisionsDocument(targetText, overrides.target);
  const parsedArchive = parseArchiveDocument(archiveText, overrides.archive);
  const targetLines = physicalLines(targetText);
  const targetEntryGroups = new Map<string, LiveEntry[]>();
  for (const entry of parsedTarget.entries) {
    const group = targetEntryGroups.get(entry.blockKey) ?? [];
    group.push(entry);
    targetEntryGroups.set(entry.blockKey, group);
  }
  const targetIndexGroups = new Map<string, number[]>();
  for (const row of parsedTarget.index.rows) {
    const group = targetIndexGroups.get(row.blockKey) ?? [];
    group.push(row.line);
    targetIndexGroups.set(row.blockKey, group);
  }

  const report1: Report = {
    number: 1,
    title: "source-row accounting",
    detail: "65 live / 13 wrappers / 1 structural E053 / 1 MERGE_INTO E037 = 80",
    failures: [],
  };
  pushCountFailure(report1.failures, "manifest live records", liveRecords.length, PINNED.sourceRows.live);
  pushCountFailure(report1.failures, "target live blocks", parsedTarget.entries.length, PINNED.sourceRows.live);
  pushCountFailure(report1.failures, "manifest wrapper records", wrapperRecords.length, PINNED.sourceRows.wrappers);
  pushCountFailure(report1.failures, "archive wrappers", parsedArchive.wrappers.length, PINNED.archiveWrappers);
  pushCountFailure(report1.failures, "target archive-index lines", parsedTarget.archiveIndex.length, PINNED.archiveIndexLines);
  pushCountFailure(report1.failures, "historical migration rows", migrationRows.length, PINNED.sourceRows.total);
  pushCountFailure(
    report1.failures,
    "historical STAY rows",
    migrationRows.filter((row) => row.destination === "STAY").length,
    PINNED.sourceRows.live,
  );
  pushCountFailure(
    report1.failures,
    "historical ARCHIVE rows",
    migrationRows.filter((row) => row.destination === "ARCHIVE").length,
    PINNED.sourceRows.wrappers + PINNED.sourceRows.structuralE053,
  );
  pushCountFailure(
    report1.failures,
    "historical MERGE_INTO rows",
    migrationRows.filter((row) => row.destination === "MERGE_INTO").length,
    PINNED.sourceRows.mergeE037,
  );

  const report2: Report = {
    number: 2,
    title: "section totals and identifier allocation",
    detail: "P=37 / R=6 / I=19 / T=3; allocation unions P1–P31 and R1–R6",
    failures: [],
  };
  for (const kind of ["P", "R", "I", "T"] as const) {
    pushCountFailure(
      report2.failures,
      `${kind} blocks`,
      parsedTarget.entries.filter((entry) => entry.kind === kind).length,
      PINNED.sections[kind],
    );
  }
  const actualRetired = new Map(
    parsedTarget.retiredIdentifiers.map((row) => [row.id, row.disposition] as const),
  );
  pushCountFailure(report2.failures, "retired-register rows", actualRetired.size, PINNED.retired.size);
  for (const [id, disposition] of PINNED.retired) {
    if (actualRetired.get(id) !== disposition) {
      report2.failures.push(`${id} register disposition is ${actualRetired.get(id) ?? "absent"}, pinned ${disposition}`);
    }
  }
  for (const prefix of ["P", "R"] as const) {
    const allocations = new Set<number>();
    for (const entry of parsedTarget.entries) {
      if (entry.headingLevel === 3 && entry.id?.startsWith(prefix)) allocations.add(Number(entry.id.slice(1)));
    }
    for (const id of actualRetired.keys()) {
      if (id.startsWith(prefix)) allocations.add(Number(id.slice(1)));
    }
    const expected = new Set(Array.from({ length: PINNED.allocationMax[prefix] }, (_, index) => index + 1));
    report2.failures.push(...compareSet(
      new Set([...allocations].map(String)),
      new Set([...expected].map(String)),
      `${prefix} allocation union`,
      `pinned ${prefix}1–${prefix}${PINNED.allocationMax[prefix]}`,
    ));
  }

  const report3: Report = {
    number: 3,
    title: "wrapper source-span and hash preservation",
    detail: "13 baseline Buffer spans verified and matched to the corresponding parsed wrapper body",
    failures: parsedArchive.issues.map(formatIssue),
  };
  const archiveWrapperGroups = new Map<string, typeof parsedArchive.wrappers>();
  for (const wrapper of parsedArchive.wrappers) {
    const group = archiveWrapperGroups.get(wrapper.blockKey) ?? [];
    group.push(wrapper);
    archiveWrapperGroups.set(wrapper.blockKey, group);
  }
  for (const record of wrapperRecords) {
    const wrappers = archiveWrapperGroups.get(record.blockKey) ?? [];
    if (wrappers.length !== 1) {
      report3.failures.push(`${record.sourceId}/${record.blockKey}: found ${wrappers.length} corresponding archive wrappers`);
      continue;
    }
    const slice = baselineBuffer.subarray(record.spanStart, record.spanEnd);
    if (slice.length !== record.byteLength) {
      report3.failures.push(`${record.sourceId}/${record.blockKey}: baseline span length ${slice.length}, pinned ${record.byteLength}`);
    }
    if (sha256(slice) !== record.sha256) {
      report3.failures.push(`${record.sourceId}/${record.blockKey}: baseline span SHA-256 differs from manifest pin`);
    }
    const body = Buffer.from(wrappers[0].body, "utf8");
    if (body.length !== record.byteLength + record.separator.length) {
      report3.failures.push(
        `${record.sourceId}/${record.blockKey}: parsed wrapper body length ${body.length}, expected ${record.byteLength + record.separator.length}`,
      );
      continue;
    }
    const preserved = body.subarray(0, record.byteLength);
    const separator = body.subarray(record.byteLength);
    if (sha256(preserved) !== record.sha256 || !preserved.equals(slice)) {
      report3.failures.push(`${record.sourceId}/${record.blockKey}: corresponding wrapper body does not preserve its pinned baseline span`);
    }
    if (!separator.equals(record.separator)) {
      report3.failures.push(`${record.sourceId}/${record.blockKey}: wrapper separator bytes differ from the manifest pin`);
    }
  }

  const report4: Report = {
    number: 4,
    title: "preservation snapshot exact equality",
    detail: "snapshot bytes compared directly to git-show MIGRATION_BASELINE:DECISIONS.md",
    failures: snapshotBuffer.equals(baselineBuffer)
      ? []
      : [
          `preservation snapshot differs from MIGRATION_BASELINE (snapshot ${snapshotBuffer.length} bytes/${sha256(snapshotBuffer)}, baseline ${baselineBuffer.length} bytes/${sha256(baselineBuffer)})`,
        ],
  };

  const expectedIds = expectedPopulation();
  const liveSourceIds = liveRecords.flatMap((record) => record.sourceIds);
  const wrapperSourceIds = wrapperRecords.map((record) => record.sourceId);
  const accountedIds = [...liveSourceIds, ...wrapperSourceIds, "E053", "E037"];
  const report5: Report = {
    number: 5,
    title: "no unaccounted source entry",
    detail: "the independently pinned 80-row population is fully covered by target dispositions",
    failures: [],
  };
  report5.failures.push(...compareSet(new Set(accountedIds), expectedIds, "target disposition accounting", "pinned source population"));
  report5.failures.push(...compareSet(new Set(inventoryIds), expectedIds, "frozen inventory", "pinned source population"));
  report5.failures.push(...compareSet(new Set(migrationRows.map((row) => row.id)), expectedIds, "frozen migration table", "pinned source population"));
  report5.failures.push(...compareSet(new Set([...outlineDestinations, ...outlineMerges]), expectedIds, "frozen outline", "pinned source population"));
  report5.failures.push(...compareSet(
    new Set(liveSourceIds),
    new Set(migrationRows.filter((row) => row.destination === "STAY").map((row) => row.id)),
    "manifest live-source classification",
    "frozen STAY classification",
  ));
  report5.failures.push(...compareSet(
    new Set(wrapperSourceIds),
    new Set(
      migrationRows
        .filter((row) => row.destination === "ARCHIVE" && row.id !== "E053")
        .map((row) => row.id),
    ),
    "manifest wrapper-source classification",
    "Amendment-4-corrected frozen ARCHIVE classification",
  ));

  const report6: Report = {
    number: 6,
    title: "no duplicate destination accounting",
    detail: "each of the 80 source rows occupies exactly one of the four target disposition classes",
    failures: [],
  };
  for (const [label, values] of [
    ["live source", liveSourceIds],
    ["wrapper source", wrapperSourceIds],
    ["combined destination", accountedIds],
  ] as const) {
    for (const duplicate of duplicateValues([...values])) {
      report6.failures.push(`${duplicate} is duplicated in ${label} accounting`);
    }
  }
  const e037 = migrationById.get("E037");
  if (e037?.destination !== "MERGE_INTO" || e037.targets.join(",") !== "E039a,E002,E006") {
    report6.failures.push("E037 is not the sole ordered MERGE_INTO E039a, E002, E006 source row");
  }

  const report7: Report = {
    number: 7,
    title: "no target block absent from the manifest",
    detail: "65 live blocks checked by identity and exact manifest-owned heading/statement/field/index bytes",
    failures: [],
  };
  const report8: Report = {
    number: 8,
    title: "no manifest block absent from target output",
    detail: "65 manifest records checked by identity and exact manifest-owned heading/statement/field/index bytes",
    failures: [],
  };
  if (parsedTarget.entries.length !== liveRecords.length) {
    const message = `live-block bijection cardinality differs: target ${parsedTarget.entries.length}, manifest ${liveRecords.length}`;
    report7.failures.push(message);
    report8.failures.push(message);
  }
  const manifestByKey = new Map(liveRecords.map((record) => [record.key, record]));
  for (const [key, entries] of targetEntryGroups) {
    const record = manifestByKey.get(key);
    if (!record || entries.length !== 1) {
      report7.failures.push(`${key}: target occurrence count ${entries.length}, manifest occurrence count ${record ? 1 : 0}`);
      continue;
    }
    const indexLines = targetIndexGroups.get(key) ?? [];
    const components = extractTargetComponents(targetText, entries[0], indexLines.length === 1 ? indexLines[0] : undefined);
    for (const [component, actual, expected] of [
      ["heading", components.heading, record.heading],
      ["statement", components.statement, record.statement],
      ["field list", components.fields, record.fields],
      ["entry-index row", components.indexRow, record.indexRow],
    ] as const) {
      if (actual !== expected) report7.failures.push(`${key}: exact ${component} bytes differ from manifest`);
    }
  }
  for (const record of liveRecords) {
    const entries = targetEntryGroups.get(record.key) ?? [];
    const indexLines = targetIndexGroups.get(record.key) ?? [];
    if (entries.length !== 1 || indexLines.length !== 1) {
      report8.failures.push(`${record.key}: target block occurrences ${entries.length}, target index-row occurrences ${indexLines.length}`);
      continue;
    }
    const components = extractTargetComponents(targetText, entries[0], indexLines[0]);
    for (const [component, actual, expected] of [
      ["heading", components.heading, record.heading],
      ["statement", components.statement, record.statement],
      ["field list", components.fields, record.fields],
      ["entry-index row", components.indexRow, record.indexRow],
    ] as const) {
      if (actual !== expected) report8.failures.push(`${record.key}: exact ${component} bytes differ from manifest`);
    }
  }
  for (const issue of parsedTarget.issues) {
    const formatted = formatIssue(issue);
    report7.failures.push(`target parse issue: ${formatted}`);
    report8.failures.push(`target parse issue: ${formatted}`);
  }

  const amendment2AuthorityFailures: string[] = [];
  const amendment2LocationFailures: string[] = [];
  const amendment2UniquenessFailures: string[] = [];
  const e053LocationFailures: string[] = [];
  const e053UniquenessFailures: string[] = [];
  const archiveIndexLocationFailures: string[] = [];
  const archiveIndexUniquenessFailures: string[] = [];
  const requiredSectionUniquenessFailures: string[] = [];
  const amendment4BaseFailures: string[] = [];

  const surfaces = amendment2Surfaces(amendment2Text, amendment2AuthorityFailures);
  const surfaceByName = new Map(surfaces.map((surface) => [surface.name, surface.payload]));

  const sectionOccurrences = new Map<number, number[]>();
  for (let index = 0; index < targetLines.values.length; index += 1) {
    const match = /^## (\d+)(?:\.|\s|$)/.exec(targetLines.values[index]);
    if (!match) continue;
    const section = Number(match[1]);
    if (section < 3 || section > 8) continue;
    const occurrences = sectionOccurrences.get(section) ?? [];
    occurrences.push(index + 1);
    sectionOccurrences.set(section, occurrences);
  }
  const sectionLines = new Map<number, number>();
  for (let section = 3; section <= 8; section += 1) {
    const occurrences = sectionOccurrences.get(section) ?? [];
    if (occurrences.length === 1) {
      sectionLines.set(section, occurrences[0]);
      continue;
    }
    const message = `§${section} top-level section locator found ${occurrences.length} headings; expected exactly 1`;
    requiredSectionUniquenessFailures.push(message);
    if (section === 8) {
      e053LocationFailures.push(message);
      archiveIndexLocationFailures.push(message);
    } else {
      amendment2LocationFailures.push(message);
    }
  }

  const section3Line = sectionLines.get(3);
  if (parsedTarget.index.rows.length === 0) {
    amendment2LocationFailures.push("§3 surfaces: parsed entry index has no rows");
  } else if (section3Line !== undefined) {
    const firstIndexRowLine = parsedTarget.index.rows[0].line;
    const headerLine = firstIndexRowLine - 2;
    const separatorLine = firstIndexRowLine - 1;
    if (headerLine <= section3Line) {
      amendment2LocationFailures.push(
        `§3 surfaces: derived header line ${headerLine} is not strictly after section heading line ${section3Line}`,
      );
    } else {
      const introductionEnd = lastNonBlankBefore(
        targetLines,
        headerLine,
        section3Line,
        "§3 introduction",
        amendment2LocationFailures,
      );
      const introduction = introductionEnd === null
        ? null
        : sliceLines(
            targetLines,
            section3Line,
            introductionEnd,
            "§3 introduction",
            amendment2LocationFailures,
          );
      compareLocatedSurface(
        "§3 introduction",
        introduction,
        surfaceByName.get("§3 introduction"),
        "ratified Amendment 2 §2.1",
        amendment2LocationFailures,
      );
    }
    compareLocatedSurface(
      "§3 table header",
      lineAt(targetLines, headerLine, "§3 table header", amendment2LocationFailures),
      surfaceByName.get("§3 table header"),
      "ratified Amendment 2 §2.2",
      amendment2LocationFailures,
    );
    compareLocatedSurface(
      "§3 table separator",
      lineAt(targetLines, separatorLine, "§3 table separator", amendment2LocationFailures),
      surfaceByName.get("§3 table separator"),
      "ratified Amendment 2 §2.2",
      amendment2LocationFailures,
    );

    const declaredTotalLine = parsedTarget.index.declaredTotalLine;
    const lastIndexRowLine = parsedTarget.index.rows.at(-1)?.line ?? firstIndexRowLine;
    if (declaredTotalLine === undefined) {
      amendment2LocationFailures.push("§3 declared total: parser exposed no declared-total line");
    } else if (declaredTotalLine <= lastIndexRowLine) {
      amendment2LocationFailures.push(
        `§3 declared total: line ${declaredTotalLine} is not after last index row line ${lastIndexRowLine}`,
      );
    } else {
      compareLocatedSurface(
        "§3 declared total",
        lineAt(
          targetLines,
          declaredTotalLine,
          "§3 declared total",
          amendment2LocationFailures,
        ),
        surfaceByName.get("§3 declared total"),
        "ratified Amendment 2 §2.2",
        amendment2LocationFailures,
      );
    }
  }

  for (const section of [4, 5, 6, 7] as const) {
    const entries = parsedTarget.entries.filter((entry) => entry.section === section);
    const sectionLine = sectionLines.get(section);
    const name = `§${section} heading/transition`;
    if (entries.length === 0) {
      amendment2LocationFailures.push(`${name}: parser exposed no entries in section ${section}`);
      continue;
    }
    if (entries.some((entry) => entry.section !== section)) {
      amendment2LocationFailures.push(`${name}: an entry used for the boundary reports another section`);
      continue;
    }
    if (sectionLine === undefined) continue;
    const firstEntryLine = Math.min(...entries.map((entry) => entry.line));
    if (firstEntryLine <= sectionLine) {
      amendment2LocationFailures.push(
        `${name}: first entry line ${firstEntryLine} is not after section heading line ${sectionLine}`,
      );
      continue;
    }
    const endLine = lastNonBlankBefore(
      targetLines,
      firstEntryLine,
      sectionLine,
      name,
      amendment2LocationFailures,
    );
    const actual = endLine === null
      ? null
      : sliceLines(targetLines, sectionLine, endLine, name, amendment2LocationFailures);
    compareLocatedSurface(
      name,
      actual,
      surfaceByName.get(name),
      "ratified Amendment 2 §2.3",
      amendment2LocationFailures,
    );
  }

  for (const surface of surfaces) {
    const occurrences = countOccurrences(targetText, surface.payload);
    if (occurrences !== 1) {
      amendment2UniquenessFailures.push(
        `${surface.name}: global exact-payload uniqueness found ${occurrences} occurrences; expected 1`,
      );
    }
  }

  const amendment4Section = amendment4Text.slice(
    amendment4Text.indexOf("## 6. E053 correction"),
    amendment4Text.indexOf("\n---", amendment4Text.indexOf("## 6. E053 correction")),
  );
  for (const required of [
    "1. **`E053` becomes structural target-§8 introduction prose.**",
    "2. **It receives no wrapper and no archive-index line.**",
    "3. **The normalized migration archive therefore carries exactly 13 wrappers and 13 archive-index lines.**",
    "4. **Reconciliation:** 65 live blocks + 13 archive wrappers + 1 structural `E053` row + 1 `MERGE_INTO` row (`E037` → `E039a`, `E002`, `E006`) = **80** original inventory rows accounted for.",
  ]) {
    if (!amendment4Section.includes(required)) amendment4BaseFailures.push(`ratified Amendment 4 §6 is missing: ${required}`);
  }
  const historicalArchiveIds = migrationRows
    .filter((row) => row.destination === "ARCHIVE")
    .map((row) => row.id);
  if (historicalArchiveIds.length !== 14 || !historicalArchiveIds.includes("E053")) {
    amendment4BaseFailures.push(`frozen migration table historical ARCHIVE population is ${historicalArchiveIds.length} and E053 membership=${historicalArchiveIds.includes("E053")}; expected 14 and true`);
  }
  if (!outlineDestinations.includes("E053") || tableAfterHeading(outlineText, "### Authoritative destination table").filter((row) => cleanCell(row[1] ?? "") === "§8").length !== 14) {
    amendment4BaseFailures.push("frozen outline does not classify E053 within exactly 14 historical §8 destinations");
  }
  if (!inventoryIds.includes("E053")) amendment4BaseFailures.push("frozen inventory is missing E053");
  if (wrapperSourceIds.includes("E053")) amendment4BaseFailures.push("E053 incorrectly has an archive wrapper record");
  const e053Payload = fencedAfter(
    manifestText.slice(manifestText.indexOf("### M5.4 "), manifestText.indexOf("### M5.5 ")),
    "### M5.4 Target §8 structural introduction — `E053`",
    "markdown",
  );
  const archiveIndexPayload = fencedAfter(
    manifestText.slice(manifestText.indexOf("### M5.6 "), manifestText.indexOf("### M5.7 ")),
    "### M5.6 The thirteen archive-index lines, assembled",
    "markdown",
  );

  let targetE053Surface: string | null = null;
  const section8Line = sectionLines.get(8);
  if (parsedTarget.archiveIndex.length !== PINNED.archiveIndexLines) {
    const message = `§8 structural extraction requires ${PINNED.archiveIndexLines} parsed archive-index entries; found ${parsedTarget.archiveIndex.length}`;
    e053LocationFailures.push(message);
    archiveIndexLocationFailures.push(message);
  } else if (section8Line !== undefined) {
    const firstArchiveLine = parsedTarget.archiveIndex[0].line;
    if (firstArchiveLine <= section8Line) {
      e053LocationFailures.push(
        `§8 structural introduction: first archive-index line ${firstArchiveLine} is not after section heading line ${section8Line}`,
      );
    } else {
      const e053EndLine = lastNonBlankBefore(
        targetLines,
        firstArchiveLine,
        section8Line,
        "§8 structural introduction / E053",
        e053LocationFailures,
      );
      targetE053Surface = e053EndLine === null
        ? null
        : sliceLines(
            targetLines,
            section8Line,
            e053EndLine,
            "§8 structural introduction / E053",
            e053LocationFailures,
          );
      compareLocatedSurface(
        "§8 structural introduction / E053",
        targetE053Surface,
        e053Payload ?? undefined,
        "manifest M5.4",
        e053LocationFailures,
      );
    }

    const thirteenthLabelLine = parsedTarget.archiveIndex[12].line;
    const pointerLine = thirteenthLabelLine + 1;
    if (lineAt(targetLines, pointerLine, "§8 archive-index final pointer", archiveIndexLocationFailures) !== null) {
      const actualArchiveIndex = sliceLines(
        targetLines,
        firstArchiveLine,
        pointerLine,
        "§8 archive-index block",
        archiveIndexLocationFailures,
      );
      compareLocatedSurface(
        "§8 archive-index block",
        actualArchiveIndex,
        archiveIndexPayload ?? undefined,
        "manifest M5.6",
        archiveIndexLocationFailures,
      );
    }
  }

  if (targetE053Surface !== null && targetE053Surface.split("\n").some((line) => line.startsWith("- **"))) {
    e053LocationFailures.push("target §8 structural introduction contains an archive-index-shaped line beginning `- **`");
  }

  if (e053Payload === null) {
    e053UniquenessFailures.push("manifest M5.4 expected payload is missing");
  } else {
    const occurrences = countOccurrences(targetText, e053Payload);
    if (occurrences !== 1) {
      e053UniquenessFailures.push(
        `manifest M5.4 global exact-payload uniqueness found ${occurrences} occurrences; expected 1`,
      );
    }
  }
  if (archiveIndexPayload === null) {
    archiveIndexUniquenessFailures.push("manifest M5.6 expected payload is missing");
  } else {
    const occurrences = countOccurrences(targetText, archiveIndexPayload);
    if (occurrences !== 1) {
      archiveIndexUniquenessFailures.push(
        `manifest M5.6 global exact-payload uniqueness found ${occurrences} occurrences; expected 1`,
      );
    }
  }
  if (parsedArchive.wrappers.length !== 13 || parsedTarget.archiveIndex.length !== 13) {
    amendment4BaseFailures.push(`corrected E053 reconciliation found ${parsedArchive.wrappers.length} wrappers and ${parsedTarget.archiveIndex.length} archive-index lines; expected 13 and 13`);
  }

  const amendment2Failures = [
    ...amendment2AuthorityFailures,
    ...amendment2LocationFailures,
    ...amendment2UniquenessFailures,
  ];
  const amendment4Failures = [
    ...amendment4BaseFailures,
    ...e053LocationFailures,
    ...e053UniquenessFailures,
    ...archiveIndexLocationFailures,
    ...archiveIndexUniquenessFailures,
  ];

  const reports = [report1, report2, report3, report4, report5, report6, report7, report8];
  for (const report of reports) console.log(reportLine(report));
  console.log(
    `Amendment 2 surfaces [${amendment2Failures.length === 0 ? "PASS" : "FAIL"}] — eight ratified structural surfaces checked byte-for-byte in target DECISIONS.md.`,
  );
  console.log(
    "Amendment 3 joins [SCOPE] — join bytes and the end-of-document byte are outside this Phase 5 checker's byte-verification scope; authority is ratified Amendment 3, covered by Phase 4's 272-entry join ledger, independent whole-document reconstruction, and pre/post-write checkDecisionsFormat runs accepted at Phase 4 closeout.",
  );
  console.log(
    `Amendment 4 E053 [${amendment4Failures.length === 0 ? "PASS" : "FAIL"}] — historical 14-entry ARCHIVE classification reconciled to 13 wrappers + 13 index lines + one structural E053 row, with no E053 wrapper or index-line shape.`,
  );
  if (testOverrideActive) {
    const verdict = (failures: readonly string[]) => failures.length === 0 ? "PASS" : "FAIL";
    console.log(
      `Structural diagnostics [TEST] — required sections unique [${verdict(requiredSectionUniquenessFailures)}]; Amendment 2 location-bound [${verdict(amendment2LocationFailures)}]; Amendment 2 global uniqueness [${verdict(amendment2UniquenessFailures)}]; M5.4 location-bound [${verdict(e053LocationFailures)}]; M5.4 global uniqueness [${verdict(e053UniquenessFailures)}]; M5.6 location-bound [${verdict(archiveIndexLocationFailures)}]; M5.6 global uniqueness [${verdict(archiveIndexUniquenessFailures)}]; parsed §8 archive-index count [${parsedTarget.archiveIndex.length === PINNED.archiveIndexLines ? "PASS" : "FAIL"}] (${parsedTarget.archiveIndex.length}).`,
    );
  }
  const allFailures = [
    ...globalFailures.map((message) => `Authority/input: ${message}`),
    ...reports.flatMap((report) => report.failures.map((message) => `Report ${report.number}: ${message}`)),
    ...amendment2Failures.map((message) => `Amendment 2 surfaces: ${message}`),
    ...amendment4Failures.map((message) => `Amendment 4 E053: ${message}`),
  ];
  if (allFailures.length > 0) {
    console.error(`DECISIONS target reconciliation failed with ${allFailures.length} issue(s):`);
    for (const failure of allFailures) console.error(`FAIL: ${failure}`);
    process.exitCode = 1;
  } else {
    console.log("DECISIONS target reconciliation passed.");
  }
}

try {
  main();
} catch (error) {
  console.error(`DECISIONS target reconciliation could not run: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
