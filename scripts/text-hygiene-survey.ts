/**
 * npm run survey:text-hygiene — one-shot baseline of text-hygiene findings.
 *
 * Runs the audit:text-hygiene core plus shadow measurement S1 over top-level
 * `banks/*.json` (never `banks/banks-raw/`) and writes four artifacts to a
 * fixed directory. Read-only with respect to banks.
 *
 * Every emitted string passes through `escapeNonAscii`, and the script asserts
 * after writing that every byte of every artifact is <= 0x7F.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";
import {
  LOCATION_CLASSES,
  TEXT_HYGIENE_RULES,
  escapeNonAscii,
  findTextHygieneFindings,
  referencesShadowDelta,
  type LocationClass,
  type TextHygieneFinding,
} from "./audit/audit-text-hygiene";

const BANKS_DIR = "banks";
const OUTPUT_DIR = "audit/text-hygiene-baseline-2026-10-11";
const NO_ID = "(no id)";

const esc = escapeNonAscii;
const escId = (id: string | null): string | null => (id === null ? null : esc(id));
const cell = (value: string): string => esc(value).replaceAll("|", "\\u{007C}");
const git = (...args: string[]): string => execFileSync("git", args, { encoding: "utf8" }).trimEnd();

type BankScan = {
  file: string;
  bytes: number;
  sha256: string;
  questions: number;
  findings: TextHygieneFinding[];
  shadow: Array<NonNullable<ReturnType<typeof referencesShadowDelta>>>;
};

async function scanBank(filename: string): Promise<BankScan> {
  const file = `${BANKS_DIR}/${filename}`;
  const buffer = await readFile(join(BANKS_DIR, filename));
  const raw = parseBankText(buffer.toString("utf8"));
  const validated = validateBankObject(raw, { rejectUnknownKeys: true });
  if (!validated.ok) {
    throw new Error(`${file}: schema validation failed — ${validated.reasons.join("; ")}`);
  }
  return {
    file,
    bytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex"),
    questions: validated.value.questions.length,
    findings: findTextHygieneFindings(raw, file),
    shadow: validated.value.questions.flatMap((question) => {
      const delta = referencesShadowDelta(question);
      return delta ? [delta] : [];
    }),
  };
}

const findingsJson = (banks: BankScan[]): string =>
  `${JSON.stringify(
    banks.flatMap((bank) => bank.findings).map((finding) => ({
      file: esc(finding.file),
      topLevelId: escId(finding.topLevelId),
      leafId: escId(finding.leafId),
      jsonPath: esc(finding.jsonPath),
      locationClass: finding.locationClass,
      rule: finding.rule,
      codepoints: finding.codepoints,
      offset: finding.offset,
      excerpt: esc(finding.excerpt),
    })),
    null,
    2,
  )}\n`;

const shadowJson = (banks: BankScan[]): string =>
  `${JSON.stringify(
    {
      measurement: "S1 references blind spot",
      fold: "U+FF01-U+FF5E -> U+0021-U+007E; U+3000 -> U+0020",
      scope: "rationale.correct and rationale.byChoice en/zh strings, including case sub-questions",
      check: "checkQuestionReferences from scripts/audit/audit-references.ts, original versus folded copy",
      perFile: banks.map((bank) => ({
        file: esc(bank.file),
        questionsChecked: bank.questions,
        itemsDiffering: bank.shadow.length,
      })),
      deltas: banks.flatMap((bank) =>
        bank.shadow.map((delta) => ({
          file: esc(bank.file),
          topLevelId: esc(delta.topLevelId),
          addedStaleKeys: delta.addedStaleKeys.map(esc),
          addedHazards: delta.addedHazards.map(esc),
          removedStaleKeys: delta.removedStaleKeys.map(esc),
          removedHazards: delta.removedHazards.map(esc),
        }))),
    },
    null,
    2,
  )}\n`;

function summaryMd(banks: BankScan[]): string {
  const lines: string[] = [
    "# Text-hygiene baseline summary",
    "",
    "Advisory baseline. Counts are per rule x location class x bank file and are never pooled across banks or classes.",
    "Each cell is `findings / distinct top-level items`. `n/a` marks a class the rule does not apply to.",
    `A top-level item with no string \`id\` is counted as \`${NO_ID}\`.`,
    "",
    "## Rules",
    "",
    "| ID | Name | Applies to |",
    "|---|---|---|",
    ...TEXT_HYGIENE_RULES.map((rule) => `| ${rule.id} | \`${rule.name}\` | ${rule.appliesTo.join(", ")} |`),
  ];

  for (const bank of banks) {
    lines.push(
      "",
      `## ${cell(bank.file)}`,
      "",
      `Top-level questions: ${bank.questions}. S1 items differing: ${bank.shadow.length}.`,
      "",
      `| Rule | ${LOCATION_CLASSES.join(" | ")} |`,
      `|---|${LOCATION_CLASSES.map(() => "---:").join("|")}|`,
    );
    for (const rule of TEXT_HYGIENE_RULES) {
      const applies: readonly LocationClass[] = rule.appliesTo;
      const cells = LOCATION_CLASSES.map((locationClass) => {
        if (!applies.includes(locationClass)) return "n/a";
        const matching = bank.findings.filter(
          (finding) => finding.rule === rule.id && finding.locationClass === locationClass,
        );
        const items = new Set(matching.map((finding) => finding.topLevelId ?? NO_ID));
        return `${matching.length} / ${items.size}`;
      });
      lines.push(`| ${rule.id} \`${rule.name}\` | ${cells.join(" | ")} |`);
    }
  }

  lines.push(
    "",
    "## S1 references shadow, per bank",
    "",
    "Items whose Tier 1 references result changes when rationale strings are full-width-folded. Detail is in `s1-references-shadow.json`.",
    "",
    "| Bank | Questions checked | Items differing | Added hazard entries | Added stale-key entries | Removed entries |",
    "|---|---:|---:|---:|---:|---:|",
    ...banks.map((bank) => {
      const sum = (pick: (delta: BankScan["shadow"][number]) => number) =>
        bank.shadow.reduce((total, delta) => total + pick(delta), 0);
      return `| ${cell(bank.file)} | ${bank.questions} | ${bank.shadow.length} | ${sum((d) => d.addedHazards.length)} | ${sum((d) => d.addedStaleKeys.length)} | ${sum((d) => d.removedHazards.length + d.removedStaleKeys.length)} |`;
    }),
  );
  return `${lines.join("\n")}\n`;
}

function verificationMd(banks: BankScan[]): string {
  // The survey's own output directory is excluded so a rerun reports the same state.
  const dirty = git("status", "--porcelain=v1", "--untracked-files=all")
    .split("\n")
    .filter((line) => line !== "" && !line.slice(3).startsWith(`${OUTPUT_DIR}/`));
  return `${[
    "# Text-hygiene baseline verification",
    "",
    `- Branch: \`${cell(git("rev-parse", "--abbrev-ref", "HEAD"))}\``,
    `- HEAD: \`${cell(git("rev-parse", "HEAD"))}\``,
    `- Dirty paths (excluding \`${OUTPUT_DIR}/\`): ${dirty.length === 0 ? "none" : ""}`,
    ...dirty.map((line) => `  - \`${cell(line)}\``),
    "- Scope: top-level `banks/*.json` only; `banks/banks-raw/` is not scanned.",
    "",
    "## Per-bank file-byte SHA-256",
    "",
    "SHA-256 of the raw file bytes on disk. This is neither the campaign hash convention nor the bank/archive hash convention.",
    "",
    "| Bank | Bytes | File-byte SHA-256 |",
    "|---|---:|---|",
    ...banks.map((bank) => `| ${cell(bank.file)} | ${bank.bytes} | \`${bank.sha256}\` |`),
  ].join("\n")}\n`;
}

async function main(): Promise<number> {
  const filenames = (await readdir(BANKS_DIR, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();
  if (filenames.length === 0) throw new Error(`No top-level ${BANKS_DIR}/*.json files found.`);

  const banks: BankScan[] = [];
  for (const filename of filenames) banks.push(await scanBank(filename));

  const artifacts: Array<[string, string]> = [
    ["findings.json", findingsJson(banks)],
    ["s1-references-shadow.json", shadowJson(banks)],
    ["summary.md", summaryMd(banks)],
    ["verification.md", verificationMd(banks)],
  ];
  await mkdir(OUTPUT_DIR, { recursive: true });
  for (const [name, content] of artifacts) await writeFile(join(OUTPUT_DIR, name), content, "utf8");

  for (const [name] of artifacts) {
    const written = await readFile(join(OUTPUT_DIR, name));
    const offset = written.findIndex((byte) => byte > 0x7f);
    if (offset !== -1) {
      console.error(`ASCII assertion failed: ${OUTPUT_DIR}/${name} has a byte above 0x7F at offset ${offset}.`);
      return 1;
    }
  }

  const findings = banks.reduce((total, bank) => total + bank.findings.length, 0);
  const shadow = banks.reduce((total, bank) => total + bank.shadow.length, 0);
  console.log(`text-hygiene survey: ${banks.length} bank file(s), ${findings} finding(s), ${shadow} S1 item(s) differing.`);
  console.log(`ASCII assertion passed for ${artifacts.length} artifact(s) in ${OUTPUT_DIR}/`);
  return 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
