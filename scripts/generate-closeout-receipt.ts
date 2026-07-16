import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const inputSha = process.argv.find((argument) => argument.startsWith("--input-sha="))?.slice("--input-sha=".length);
if (!inputSha) throw new Error("Usage: npm run closeout:receipt -- --input-sha=<clean-input-commit>");

const head = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
if (head !== inputSha) {
  throw new Error(`Receipt input SHA ${inputSha} does not match HEAD ${head}. Regenerate from the named clean input commit.`);
}

const generations = [
  {
    command: "npm run census",
    artifacts: ["census.json", "BANK-CENSUS.md"],
  },
  {
    command: "npm run coverage-report -- --output=audit/coverage-report-current-head.md",
    artifacts: ["audit/coverage-report-current-head.md"],
  },
  {
    command: "npm run topic-vocabulary:dry-run -- --report-label current-head",
    artifacts: [
      "audit/topic-vocabulary-migration-2026-06-16.current-head.report.md",
      "audit/unresolved_gemini.current-head.json",
      "audit/unresolved_gpt_claude.current-head.json",
    ],
  },
  {
    command: "npm run audit:topic-license -- --output=audit/topic-license.current-head.report.md",
    artifacts: ["audit/topic-license.current-head.report.md"],
  },
  {
    command: "npm run export-topic-vocab",
    artifacts: ["docs/topic-vocabulary.md"],
  },
] as const;

const lines = [
  "# PR #52 Closeout Generation Receipt",
  "",
  "Generated after all coupled outputs were regenerated from the clean implementation commit named below.",
  "",
  `INPUT_SHA: \`${inputSha}\``,
  "",
  "## Commands and SHA-256 Checksums",
  "",
];

for (const generation of generations) {
  lines.push(`### \`${generation.command}\``, "", "| Artifact | SHA-256 |", "|---|---|");
  for (const artifact of generation.artifacts) {
    const checksum = createHash("sha256").update(await readFile(artifact)).digest("hex");
    lines.push(`| \`${artifact}\` | \`${checksum}\` |`);
  }
  lines.push("");
}

lines.push(
  "The receipt is not self-hashed. Generated files identify `INPUT_SHA` directly where their formats permit; residual JSON arrays and generated vocabulary documentation are bound to the same input through this receipt.",
  "",
);

const outputPath = "audit/PR-52-CLOSEOUT-GENERATION-RECEIPT-2026-07-16.md";
await writeFile(outputPath, lines.join("\n"), "utf8");
console.log(`Closeout generation receipt written: ${outputPath}`);
