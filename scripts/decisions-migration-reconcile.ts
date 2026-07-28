import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const AUDIT_DIR = resolve(ROOT, "audit/decisions-cleanup-2026-07-24");
const INVENTORY_FILE = "inventory.md";
const MIGRATION_FILE = "migration-table.md";
const OUTLINE_FILE = "outline-before-after.md";

const PINNED = {
  inventoryRows: 80,
  independentRows: 79,
  destinations: { STAY: 65, ARCHIVE: 14, MERGE_INTO: 1 },
  sections: { 4: 37, 5: 6, 6: 19, 7: 3, 8: 14 },
  principleNumbers: 25,
} as const;

type Section = 4 | 5 | 6 | 7 | 8;
type Destination = "STAY" | "ARCHIVE" | "MERGE_INTO";
type MigrationRow = {
  id: string;
  kind: string;
  forceBefore: string;
  forceAfter: string;
  destination: Destination | null;
  targets: string[];
  permanentId: string;
};
type OutlineRow = { id: string; section: Section; permanentId: string };

const failures: string[] = [];

function fail(message: string): void {
  failures.push(`FAIL: ${message}`);
}

function read(name: string): string {
  return readFileSync(resolve(AUDIT_DIR, name), "utf8");
}

function clean(cell: string): string {
  return cell
    .trim()
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .trim();
}

function tableAfterHeading(text: string, heading: string): string[][] | null {
  const lines = text.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => line.trim() === heading);
  if (headingIndex < 0) return null;
  const headerIndex = lines.findIndex(
    (line, index) => index > headingIndex && line.trim().startsWith("|"),
  );
  if (headerIndex < 0) return null;
  const rows: string[][] = [];
  for (let index = headerIndex; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line.startsWith("|")) break;
    const cells = line
      .slice(1, -1)
      .split("|")
      .map(clean);
    if (cells.every((cell) => /^:?-{3,}:?$/.test(cell))) continue;
    rows.push(cells);
  }
  return rows;
}

function requireTable(text: string, heading: string, file: string): string[][] {
  const table = tableAfterHeading(text, heading);
  if (!table) {
    fail(`${file} is missing required bounded table "${heading}"`);
    return [];
  }
  return table;
}

function entryId(cell: string): string | null {
  return clean(cell).match(/^E\d{3}[a-z]?$/)?.[0] ?? null;
}

function expectedPopulation(): Set<string> {
  const ids: string[] = [];
  for (let value = 1; value <= 35; value += 1) {
    ids.push(`E${String(value).padStart(3, "0")}`);
  }
  ids.push("E036", "E037", "E038", "E039a", "E039b");
  ids.push("E040", "E041", "E042", "E043b", "E043a");
  for (let value = 44; value <= 46; value += 1) {
    ids.push(`E${String(value).padStart(3, "0")}`);
  }
  ids.push("E047a", "E047b", "E047c");
  for (let value = 48; value <= 76; value += 1) {
    ids.push(`E${String(value).padStart(3, "0")}`);
  }
  return new Set(ids);
}

function duplicateIds(ids: string[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return [...duplicates].sort();
}

function compareSets(
  left: ReadonlySet<string>,
  leftName: string,
  right: ReadonlySet<string>,
  rightName: string,
): void {
  for (const id of [...left].sort()) {
    if (!right.has(id)) fail(`${id} present in ${leftName} but absent from ${rightName}`);
  }
  for (const id of [...right].sort()) {
    if (!left.has(id)) fail(`${id} present in ${rightName} but absent from ${leftName}`);
  }
}

function parseInventory(text: string): string[] {
  const table = requireTable(text, "## Classification table", INVENTORY_FILE);
  return table.slice(1).map((row) => entryId(row[0])).filter((id): id is string => id !== null);
}

function parseMigration(text: string): MigrationRow[] {
  const table = tableAfterHeading(text, "# DECISIONS.md Cleanup — Phase 1 (Correction Pass) — Migration Table");
  if (!table) {
    fail(`${MIGRATION_FILE} is missing its migration row table`);
    return [];
  }
  const rows: MigrationRow[] = [];
  for (const cells of table.slice(1)) {
    const id = entryId(cells[0] ?? "");
    if (!id) continue;
    const destinationCell = clean(cells[6] ?? "");
    const exactDestinationMatches = [
      destinationCell === "STAY" ? "STAY" : null,
      destinationCell === "ARCHIVE" ? "ARCHIVE" : null,
      /^MERGE_INTO\s+E\d{3}[a-z]?(?:,\s*E\d{3}[a-z]?)*$/.test(destinationCell)
        ? "MERGE_INTO"
        : null,
    ].filter((value): value is Destination => value !== null);
    if (exactDestinationMatches.length !== 1) {
      fail(
        `${MIGRATION_FILE} ${id} has invalid destination "${destinationCell}" (expected exactly one of STAY, ARCHIVE, or MERGE_INTO <target ids>)`,
      );
    }
    const destination = exactDestinationMatches[0] ?? null;
    const targets =
      destination === "MERGE_INTO"
        ? [...destinationCell.matchAll(/E\d{3}[a-z]?/g)].map((match) => match[0])
        : [];
    rows.push({
      id,
      kind: clean(cells[2] ?? "").match(/^[PRITX]/)?.[0] ?? clean(cells[2] ?? ""),
      forceBefore: clean(cells[4] ?? ""),
      forceAfter: clean(cells[5] ?? ""),
      destination,
      targets,
      permanentId: clean(cells[7] ?? ""),
    });
  }
  return rows;
}

function parseOutline(text: string): { destinations: OutlineRow[]; merges: Map<string, string[]> } {
  const destinationTable = requireTable(
    text,
    "### Authoritative destination table",
    OUTLINE_FILE,
  );
  const mergeTable = requireTable(text, "### Authoritative merge table", OUTLINE_FILE);
  const destinations: OutlineRow[] = [];
  for (const cells of destinationTable.slice(1)) {
    const id = entryId(cells[0] ?? "");
    const sectionMatch = clean(cells[1] ?? "").match(/^§([4-8])$/);
    if (!id || !sectionMatch) {
      fail(`${OUTLINE_FILE} has malformed authoritative destination row: ${cells.join(" | ")}`);
      continue;
    }
    destinations.push({
      id,
      section: Number(sectionMatch[1]) as Section,
      permanentId: clean(cells[2] ?? ""),
    });
  }
  const merges = new Map<string, string[]>();
  for (const cells of mergeTable.slice(1)) {
    const id = entryId(cells[0] ?? "");
    const targets = [...clean(cells[1] ?? "").matchAll(/E\d{3}[a-z]?/g)].map(
      (match) => match[0],
    );
    if (!id || targets.length === 0) {
      fail(`${OUTLINE_FILE} has malformed authoritative merge row: ${cells.join(" | ")}`);
      continue;
    }
    if (merges.has(id)) fail(`${OUTLINE_FILE} authoritative merge table duplicates ${id}`);
    merges.set(id, targets);
  }
  return { destinations, merges };
}

function sectionFor(row: MigrationRow): Section | null {
  if (row.destination === "ARCHIVE") return 8;
  if (row.destination !== "STAY") return null;
  const sectionByKind: Record<string, Section> = { P: 4, R: 5, I: 6, T: 7 };
  return sectionByKind[row.kind] ?? null;
}

function assertCount(label: string, actual: number, expected: number): void {
  if (actual !== expected) fail(`${label}: declared/derived ${actual}, pinned ${expected}`);
}

function captureNumber(text: string, pattern: RegExp, label: string): number | null {
  const match = text.match(pattern);
  if (!match) {
    fail(`could not parse declared ${label}`);
    return null;
  }
  return Number(match[1]);
}

function checkDeclaredTotals(
  inventoryText: string,
  migrationText: string,
  outlineText: string,
  derivedDestinations: Record<Destination, number>,
  sectionCounts: Record<Section, number>,
): void {
  const inventoryDeclared = captureNumber(
    inventoryText,
    /^\*\*(\d+) rows\*\*(?:[.:]|\s)/m,
    `${INVENTORY_FILE} classification row total`,
  );
  if (inventoryDeclared !== null) {
    if (inventoryDeclared !== PINNED.inventoryRows) {
      fail(
        `${INVENTORY_FILE} declares ${inventoryDeclared} rows but its table derives ${PINNED.inventoryRows}; pinned value is ${PINNED.inventoryRows} (declared ${inventoryDeclared}-vs-derived-${PINNED.inventoryRows} mismatch)`,
      );
    }
  }

  const migrationOpening = captureNumber(
    migrationText,
    /^(\d+) rows(?:[.:]|\s)/m,
    `${MIGRATION_FILE} opening population`,
  );
  if (migrationOpening !== null && migrationOpening !== PINNED.inventoryRows) {
    fail(
      `${MIGRATION_FILE} opening declares ${migrationOpening} rows but its table derives ${PINNED.inventoryRows}; pinned value is ${PINNED.inventoryRows} (declared ${migrationOpening}-vs-derived-${PINNED.inventoryRows} mismatch)`,
    );
  }
  const migrationSummary = tableAfterHeading(migrationText, "## Summary");
  if (!migrationSummary) {
    fail(`${MIGRATION_FILE} is missing its summary table`);
  } else {
    const values = new Map(migrationSummary.slice(1).map((row) => [clean(row[0]), row[1]]));
    for (const destination of ["STAY", "ARCHIVE", "MERGE_INTO"] as const) {
      const raw = values.get(destination);
      const declared = raw?.match(/\d+/)?.[0];
      if (!declared) fail(`${MIGRATION_FILE} summary is missing ${destination}`);
      else {
        const value = Number(declared);
        if (
          value !== derivedDestinations[destination] ||
          value !== PINNED.destinations[destination]
        ) {
          fail(
            `${MIGRATION_FILE} summary ${destination} declares ${value}, derives ${derivedDestinations[destination]}, pinned ${PINNED.destinations[destination]}`,
          );
        }
      }
    }
    const rawTotal = values.get("Total");
    const declaredTotal = rawTotal?.match(/\d+/)?.[0];
    if (!declaredTotal) fail(`${MIGRATION_FILE} summary is missing Total`);
    else if (Number(declaredTotal) !== PINNED.inventoryRows) {
      fail(
        `${MIGRATION_FILE} summary Total declares ${declaredTotal}, derives ${PINNED.inventoryRows}, pinned ${PINNED.inventoryRows}`,
      );
    }
  }

  const proposedBlock = outlineText.match(
    /## Proposed structure[\s\S]*?```([\s\S]*?)```/,
  )?.[1];
  if (!proposedBlock) {
    fail(`${OUTLINE_FILE} is missing its proposed-structure count block`);
  } else {
    for (const section of [4, 5, 6, 7, 8] as const) {
      const line = proposedBlock
        .split(/\r?\n/)
        .find((candidate) => candidate.trim().startsWith(`${section}.`));
      const declared = line?.match(/←\s+(\d+)\s+(?:entry rows|entries)/)?.[1];
      if (!declared) fail(`${OUTLINE_FILE} proposed structure is missing §${section} count`);
      else if (
        Number(declared) !== sectionCounts[section] ||
        Number(declared) !== PINNED.sections[section]
      ) {
        fail(
          `${OUTLINE_FILE} proposed §${section} declares ${declared}, derives ${sectionCounts[section]}, pinned ${PINNED.sections[section]}`,
        );
      }
    }
    const principleNumbers = proposedBlock.match(
      /^4\..*\/\s*(\d+)\s+permanent numbers/m,
    )?.[1];
    if (!principleNumbers) {
      fail(`${OUTLINE_FILE} proposed structure is missing §4 permanent-number count`);
    } else if (Number(principleNumbers) !== PINNED.principleNumbers) {
      fail(
        `${OUTLINE_FILE} proposed §4 declares ${principleNumbers} permanent numbers, pinned ${PINNED.principleNumbers}`,
      );
    }
  }

  const reconciliation = tableAfterHeading(outlineText, "## Reconciliation");
  if (!reconciliation) {
    fail(`${OUTLINE_FILE} is missing its reconciliation table`);
  } else {
    const values = new Map(reconciliation.slice(1).map((row) => [clean(row[0]), row[1]]));
    for (const section of [4, 5, 6, 7, 8] as const) {
      const key = [...values.keys()].find((value) => value.startsWith(`§${section} `));
      const declared = key ? values.get(key)?.match(/\d+/)?.[0] : null;
      if (!declared) fail(`${OUTLINE_FILE} reconciliation is missing §${section}`);
      else if (
        Number(declared) !== sectionCounts[section] ||
        Number(declared) !== PINNED.sections[section]
      ) {
        fail(
          `${OUTLINE_FILE} reconciliation §${section} declares ${declared}, derives ${sectionCounts[section]}, pinned ${PINNED.sections[section]}`,
        );
      }
    }
    const independent = values.get("Total destination rows")?.match(/\d+/)?.[0];
    if (!independent) fail(`${OUTLINE_FILE} reconciliation is missing Total destination rows`);
    else if (Number(independent) !== PINNED.independentRows) {
      fail(
        `${OUTLINE_FILE} reconciliation declares ${independent} destination rows, derives ${PINNED.independentRows}, pinned ${PINNED.independentRows}`,
      );
    }
    const inventory = values.get("Total inventory rows accounted for")?.match(/\d+/)?.[0];
    if (!inventory) fail(`${OUTLINE_FILE} reconciliation is missing inventory total`);
    else if (Number(inventory) !== PINNED.inventoryRows) {
      fail(
        `${OUTLINE_FILE} reconciliation declares ${inventory} inventory rows, derives ${PINNED.inventoryRows}, pinned ${PINNED.inventoryRows}`,
      );
    }
  }
}

const inventoryText = read(INVENTORY_FILE);
const migrationText = read(MIGRATION_FILE);
const outlineText = read(OUTLINE_FILE);
const inventoryIds = parseInventory(inventoryText);
const migrationRows = parseMigration(migrationText);
const outline = parseOutline(outlineText);

const migrationIds = migrationRows.map((row) => row.id);
const outlineIds = [
  ...outline.destinations.map((row) => row.id),
  ...outline.merges.keys(),
];
for (const [file, ids] of [
  [INVENTORY_FILE, inventoryIds],
  [MIGRATION_FILE, migrationIds],
  [OUTLINE_FILE, outlineIds],
] as const) {
  for (const id of duplicateIds(ids)) fail(`${file} duplicates ${id}`);
}

const expectedIds = expectedPopulation();
assertCount(`${MIGRATION_FILE} unique migration rows`, new Set(migrationIds).size, PINNED.inventoryRows);
compareSets(new Set(migrationIds), MIGRATION_FILE, expectedIds, "pinned 80-row population");
compareSets(new Set(inventoryIds), INVENTORY_FILE, new Set(migrationIds), MIGRATION_FILE);
compareSets(new Set(inventoryIds), INVENTORY_FILE, new Set(outlineIds), OUTLINE_FILE);
compareSets(new Set(migrationIds), MIGRATION_FILE, new Set(outlineIds), OUTLINE_FILE);

const destinationCounts: Record<Destination, number> = {
  STAY: 0,
  ARCHIVE: 0,
  MERGE_INTO: 0,
};
for (const row of migrationRows) {
  if (row.destination) destinationCounts[row.destination] += 1;
}
for (const destination of ["STAY", "ARCHIVE", "MERGE_INTO"] as const) {
  assertCount(
    `derived ${destination} rows`,
    destinationCounts[destination],
    PINNED.destinations[destination],
  );
}

const sectionCounts: Record<Section, number> = { 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
for (const row of migrationRows) {
  const section = sectionFor(row);
  if (section) sectionCounts[section] += 1;
  else if (row.destination === "STAY") {
    fail(`${MIGRATION_FILE} ${row.id} has STAY destination but kind ${row.kind} has no target section`);
  }
}
for (const section of [4, 5, 6, 7, 8] as const) {
  assertCount(`derived §${section} rows`, sectionCounts[section], PINNED.sections[section]);
}
const principleNumbers = new Set(
  migrationRows
    .filter((row) => row.destination === "STAY" && row.kind === "P")
    .map((row) => row.permanentId.match(/\bP(\d+)\b/)?.[1])
    .filter((id): id is string => id !== undefined),
);
assertCount(
  "derived distinct live permanent principle numbers",
  principleNumbers.size,
  PINNED.principleNumbers,
);

const outlineOccurrences = new Map<string, OutlineRow[]>();
for (const row of outline.destinations) {
  const occurrences = outlineOccurrences.get(row.id) ?? [];
  occurrences.push(row);
  outlineOccurrences.set(row.id, occurrences);
}
for (const migrationRow of migrationRows) {
  const expectedSection = sectionFor(migrationRow);
  const occurrences = outlineOccurrences.get(migrationRow.id) ?? [];
  if (migrationRow.destination === "MERGE_INTO") {
    if (occurrences.length !== 0) {
      fail(`${migrationRow.id} is MERGE_INTO but has an independent outline destination row`);
    }
    continue;
  }
  if (occurrences.length !== 1 || occurrences[0]?.section !== expectedSection) {
    const found =
      occurrences.length === 0
        ? "none"
        : occurrences.map((row) => `§${row.section}`).join(", ");
    fail(
      `${migrationRow.id} missing from outline §${expectedSection} authoritative destination membership (found ${found})`,
    );
  }
}

const mergeRows = migrationRows.filter((row) => row.destination === "MERGE_INTO");
if (mergeRows.length !== 1 || mergeRows[0]?.id !== "E037") {
  fail(`E037 must be the sole MERGE_INTO row; found ${mergeRows.map((row) => row.id).join(", ") || "none"}`);
}
const migrationById = new Map(migrationRows.map((row) => [row.id, row]));
const e037 = migrationById.get("E037");
const pinnedMergeTargets = ["E039a", "E002", "E006"];
if (
  !e037 ||
  e037.targets.join(",") !== pinnedMergeTargets.join(",") ||
  (outline.merges.get("E037") ?? []).join(",") !== pinnedMergeTargets.join(",")
) {
  fail(`E037 must be the sole merge with ordered targets E039a, E002, E006 in both migration and outline`);
}
for (const target of pinnedMergeTargets) {
  if (migrationById.get(target)?.destination !== "STAY") {
    fail(`E037 merge target ${target} must exist with destination STAY`);
  }
}

function assertIdentity(condition: boolean, message: string): void {
  if (!condition) fail(message);
}
assertIdentity(
  outlineOccurrences.get("E003")?.length === 1 &&
    outlineOccurrences.get("E003")?.[0]?.section === 4 &&
    outlineOccurrences.get("E003")?.[0]?.permanentId === "P2",
  "pinned identity E003 missing from outline §4 under P2",
);
assertIdentity(
  outlineOccurrences.get("E074")?.length === 1 &&
    outlineOccurrences.get("E074")?.[0]?.section === 4 &&
    outlineOccurrences.get("E074")?.[0]?.permanentId === "P31",
  "pinned identity E074 missing from outline §4 under P31",
);
assertIdentity(
  outlineOccurrences.get("E063")?.length === 1 &&
    outlineOccurrences.get("E063")?.[0]?.section === 6,
  "pinned identity E063 missing from outline §6",
);
assertIdentity(
  migrationById.get("E047c")?.kind === "R" &&
    migrationById.get("E047c")?.destination === "STAY" &&
    migrationById.get("E047c")?.permanentId.match(/\bR3\b/) !== null &&
    outlineOccurrences.get("E047c")?.length === 1 &&
    outlineOccurrences.get("E047c")?.[0]?.section === 5,
  "pinned identity E047c missing from outline §5 as R3 or incorrectly present in §8",
);
assertIdentity(
  migrationById.get("E043a")?.kind === "I" &&
    migrationById.get("E043a")?.destination === "STAY" &&
    outlineOccurrences.get("E043a")?.[0]?.section === 6 &&
    migrationById.get("E043b")?.destination === "ARCHIVE",
  "pinned identity E043a must remain live in §6 and must not share E043b's archive destination",
);

const expectedRSeries = new Map([
  ["R1", "E070"],
  ["R2", "E049"],
  ["R3", "E047c"],
  ["R4", "E072"],
  ["R5", "E047a"],
  ["R6", "E073"],
]);
const actualRSeries = new Map<string, string[]>();
for (const row of migrationRows.filter((candidate) => candidate.kind === "R")) {
  const id = row.permanentId.match(/\bR\d+\b/)?.[0];
  if (!id) {
    fail(`${row.id} is kind R but has no permanent R-series ID`);
    continue;
  }
  const entries = actualRSeries.get(id) ?? [];
  entries.push(row.id);
  actualRSeries.set(id, entries);
}
for (const [id, entry] of expectedRSeries) {
  const actual = actualRSeries.get(id) ?? [];
  if (actual.length !== 1 || actual[0] !== entry) {
    fail(`R-series ${id} must map exactly to ${entry}; found ${actual.join(", ") || "none"}`);
  }
}
for (const id of actualRSeries.keys()) {
  if (!expectedRSeries.has(id)) fail(`R-series contains unexpected identifier ${id}`);
}

checkDeclaredTotals(
  inventoryText,
  migrationText,
  outlineText,
  destinationCounts,
  sectionCounts,
);

if (failures.length > 0) {
  console.error(`DECISIONS migration reconciliation failed with ${failures.length} issue(s):`);
  for (const message of failures) console.error(message);
  process.exitCode = 1;
} else {
  console.log("DECISIONS migration reconciliation passed.");
  console.log(
    `inventory=${PINNED.inventoryRows}; independent=${PINNED.independentRows}; STAY=${destinationCounts.STAY}; ARCHIVE=${destinationCounts.ARCHIVE}; MERGE_INTO=${destinationCounts.MERGE_INTO}`,
  );
  console.log(
    `sections: §4=${sectionCounts[4]} (${principleNumbers.size} permanent numbers), §5=${sectionCounts[5]}, §6=${sectionCounts[6]}, §7=${sectionCounts[7]}, §8=${sectionCounts[8]}`,
  );
}
