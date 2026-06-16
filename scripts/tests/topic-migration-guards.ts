import { readFileSync } from "node:fs";

const reportPath = "audit/topic-vocabulary-migration-2026-06-16.exact-only.report.md";
const report = readFileSync(reportPath, "utf8");

const assert = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

const numberAfter = (label: string) => {
  const match = report.match(new RegExp(`${label}: (\\d+)`));
  assert(match, `missing report metric: ${label}`);
  return Number(match![1]);
};

const exactUpdates = numberAfter("Exact topic updates");
const suggestions = numberAfter("Suggestions requiring review");
const unresolved = numberAfter("Unresolved noncanonical topics");

assert(exactUpdates > 0, "expected at least one exact casing/alias update in the dry-run report");
assert(
  suggestions + unresolved > 0,
  "pre-review migration reported no suggestions or unresolved topics; this is a classifier-overmatch failure signal",
);

const updatesSection = report.split("## Updates by File")[1]?.split("## Unresolved Human Decisions")[0] ?? "";
const updateRows = updatesSection
  .split("\n")
  .filter((line) => line.startsWith("| `") && !line.includes("|---|"));

assert(updateRows.length === exactUpdates, `expected ${exactUpdates} update rows, found ${updateRows.length}`);
for (const row of updateRows) {
  assert(
    row.endsWith("| exact topic normalization |"),
    `write-path row is not an exact normalization: ${row}`,
  );
}

const forbiddenWriteReasons = ["content rule", "curated ID", "curated content review"];
for (const reason of forbiddenWriteReasons) {
  assert(!updatesSection.includes(reason), `write-path section contains forbidden semantic reason: ${reason}`);
}

const suggestionSection = report.split("## Suggestions Requiring Review")[1]?.split("## Broad-Topic Review Suggestions")[0] ?? "";
const suggestionRows = suggestionSection
  .split("\n")
  .filter((line) => line.startsWith("| `") && !line.includes("|---|"));

assert(suggestionRows.length === suggestions, `expected ${suggestions} suggestion rows, found ${suggestionRows.length}`);
assert(
  suggestionRows.some((row) => !row.endsWith("| exact topic normalization |")),
  "expected semantic/ID matches to appear in the suggestion section",
);

console.log(
  `Topic migration guards OK (${exactUpdates} exact updates, ${suggestions} suggestions, ${unresolved} unresolved)`,
);
