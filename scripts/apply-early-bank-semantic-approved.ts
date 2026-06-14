import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type Fix = {
  field: string;
  before: unknown;
  after: unknown;
};

type ManifestRow = {
  id: string;
  bank: string;
  verdict: string;
  fix: Fix[];
};

const root = resolve(import.meta.dirname, "..");
const manifestNames = [
  "01-immunization-screening",
  "02-isolation-precautions",
  "03-anticoagulation-dka-insulin",
  "04-remaining-high-harm",
  "05-medium-claude-high-harm",
  "10-claude-return-adjudication",
];
const apply = process.argv.includes("--apply");

const manifestPaths = manifestNames.map((name) =>
  resolve(
    root,
    "audit/early-bank-semantic/currency",
    `${name}.manifest.jsonl`,
  ),
);

const rows: ManifestRow[] = [];
for (const manifestPath of manifestPaths) {
  const text = await readFile(manifestPath, "utf8");
  for (const line of text.split(/\n/).filter(Boolean)) {
    const row = JSON.parse(line) as ManifestRow;
    if (row.verdict !== "FIX") {
      throw new Error(`${row.id}: approved manifest includes ${row.verdict}`);
    }
    rows.push(row);
  }
}

if (rows.length !== 32) {
  throw new Error(`Expected 32 approved rows, found ${rows.length}`);
}

const duplicateIds = rows
  .map((row) => row.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index);
if (duplicateIds.length > 0) {
  throw new Error(`Duplicate approved IDs: ${duplicateIds.join(", ")}`);
}

type Selector = { property: string; key?: string; value?: string };

function parseField(field: string): Selector[] {
  return field.split(".").map((segment) => {
    const match = segment.match(/^([^\[]+)(?:\[([^=\]]+)=([^\]]+)\])?$/);
    if (!match) throw new Error(`Unsupported selector segment: ${segment}`);
    return {
      property: match[1],
      key: match[2],
      value: match[3],
    };
  });
}

function resolveLeaf(rootValue: unknown, field: string) {
  const selectors = parseField(field);
  let current = rootValue;

  for (let index = 0; index < selectors.length - 1; index += 1) {
    const selector = selectors[index];
    if (
      typeof current !== "object" ||
      current === null ||
      !(selector.property in current)
    ) {
      throw new Error(`${field}: missing property ${selector.property}`);
    }
    current = (current as Record<string, unknown>)[selector.property];
    if (selector.key) {
      if (!Array.isArray(current)) {
        throw new Error(`${field}: ${selector.property} is not an array`);
      }
      const matches = current.filter(
        (entry) =>
          typeof entry === "object" &&
          entry !== null &&
          String((entry as Record<string, unknown>)[selector.key!]) ===
            selector.value,
      );
      if (matches.length !== 1) {
        throw new Error(
          `${field}: selector ${selector.key}=${selector.value} matched ${matches.length}`,
        );
      }
      current = matches[0];
    }
  }

  const leaf = selectors.at(-1)!;
  if (typeof current !== "object" || current === null) {
    throw new Error(`${field}: leaf parent is not an object`);
  }

  if (!leaf.key) {
    return {
      parent: current as Record<string, unknown>,
      key: leaf.property,
    };
  }

  const array = (current as Record<string, unknown>)[leaf.property];
  if (!Array.isArray(array)) {
    throw new Error(`${field}: ${leaf.property} is not an array`);
  }
  const matches = array
    .map((entry, index) => ({ entry, index }))
    .filter(
      ({ entry }) =>
        typeof entry === "object" &&
        entry !== null &&
        String((entry as Record<string, unknown>)[leaf.key!]) === leaf.value,
    );
  if (matches.length !== 1) {
    throw new Error(
      `${field}: selector ${leaf.key}=${leaf.value} matched ${matches.length}`,
    );
  }
  return { parent: array, key: matches[0].index };
}

const bankRows = new Map<string, ManifestRow[]>();
for (const row of rows) {
  const existing = bankRows.get(row.bank) ?? [];
  existing.push(row);
  bankRows.set(row.bank, existing);
}

let editCount = 0;
for (const [bankName, approvedRows] of bankRows) {
  const bankPath = resolve(root, "banks", bankName);
  const bank = JSON.parse(await readFile(bankPath, "utf8")) as {
    questions: Array<Record<string, unknown>>;
  };

  for (const row of approvedRows) {
    const matches = bank.questions.filter((question) => question.id === row.id);
    if (matches.length !== 1) {
      throw new Error(
        `${bankName}/${row.id}: expected one question, found ${matches.length}`,
      );
    }
    const question = matches[0];
    const resolvedFixes: Array<{
      fix: Fix;
      parent: Record<string | number, unknown> | unknown[];
      key: string | number;
    }> = [];

    for (const fix of row.fix) {
      const { parent, key } = resolveLeaf(question, fix.field);
      const current = parent[key as keyof typeof parent];
      if (JSON.stringify(current) !== JSON.stringify(fix.before)) {
        throw new Error(
          `${bankName}/${row.id}/${fix.field}: before-state mismatch\n` +
            `expected ${JSON.stringify(fix.before)}\n` +
            `actual   ${JSON.stringify(current)}`,
        );
      }
      resolvedFixes.push({ fix, parent, key });
      editCount += 1;
    }

    if (apply) {
      for (const { fix, parent, key } of resolvedFixes) {
        (parent as Record<string | number, unknown>)[key] = fix.after;
      }
    }
  }

  if (apply) {
    await writeFile(bankPath, `${JSON.stringify(bank, null, 2)}\n`);
  }
}

if (apply) {
  const approvedPath = resolve(
    root,
    "audit/early-bank-semantic/currency/12-approved-execution.manifest.jsonl",
  );
  await writeFile(
    approvedPath,
    `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`,
  );
}

console.log(
  `${apply ? "Applied" : "Validated"} ${rows.length} approved fixes ` +
    `(${editCount} exact field edits) across ${bankRows.size} banks.`,
);
