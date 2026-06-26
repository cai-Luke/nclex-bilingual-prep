import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { validateSweep, type ValidatorReport } from "../validate-sweep-lib";

type Row = Record<string, unknown>;
type Summary = Record<string, unknown>;

const archivedFixtureRoot = "Archive/Fixtures";
const fixtureDir = resolve(archivedFixtureRoot, "validate-sweep");
const goodManifestPath = join(fixtureDir, "good_min.jsonl");
const goodSummaryPath = join(fixtureDir, "good_min.summary.json");
const baseRows = (await readFile(goodManifestPath, "utf8"))
  .trim()
  .split(/\r?\n/)
  .map((line) => JSON.parse(line) as Row);
const baseSummary = JSON.parse(await readFile(goodSummaryPath, "utf8")) as Summary;
const tempDir = await mkdtemp(join(tmpdir(), "validate-sweep-"));

const clone = <T>(value: T): T => structuredClone(value);

const writeCase = async (
  name: string,
  rows: Row[],
  summary: Summary,
  manifestOverride?: string,
) => {
  const manifestPath = join(tempDir, `${name}.jsonl`);
  const summaryPath = join(tempDir, `${name}.summary.json`);
  await writeFile(
    manifestPath,
    manifestOverride ?? `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`,
    "utf8",
  );
  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
  return { manifestPath, summaryPath };
};

const runCase = async (
  name: string,
  mutate: (rows: Row[], summary: Summary) => void,
  options: { manifestOverride?: string; bankPaths?: string[]; strict?: boolean } = {},
) => {
  const rows = clone(baseRows);
  const summary = clone(baseSummary);
  mutate(rows, summary);
  const paths = await writeCase(name, rows, summary, options.manifestOverride);
  return validateSweep({
    ...paths,
    bankPaths: options.bankPaths,
    strict: options.strict,
    writeReport: false,
  });
};

const assertCheck = (report: ValidatorReport, check: string) => {
  assert(
    report.hard_failures.some((issue) => issue.check === check),
    `expected ${check}, got ${JSON.stringify(report.hard_failures, null, 2)}`,
  );
};

try {
  const good = await validateSweep({
    manifestPath: goodManifestPath,
    summaryPath: goodSummaryPath,
    writeReport: false,
  });
  assert.equal(good.status, "usable");
  assert.equal(good.hard_failures.length, 0);
  assert.equal(good.warnings.length, 0);

  assertCheck(await runCase("f1", () => {}, { manifestOverride: '{"qid":\n' }), "F1");

  assertCheck(await runCase("f2", (rows) => {
    delete rows[0].risk_tier;
  }), "F2");

  assertCheck(await runCase("f3", (rows) => {
    rows[0].target_renderer = "ecg_rhythm_strip";
  }), "F3");

  assertCheck(await runCase("f4", (rows) => {
    rows[0].needs_human_review = false;
  }), "F4");

  assertCheck(await runCase("f5", (rows) => {
    rows[0].quoted_evidence = [];
  }), "F5");

  assertCheck(await runCase("f6-summary", (_rows, summary) => {
    summary.gate_notes = ["Random sample for review"];
  }), "F6");

  const quotedSourcePhrase = await runCase("f6-quote-exclusion", (rows) => {
    rows[1].quoted_evidence = [{ location: "stem", quote: "Random sample for review appears in the source item." }];
  });
  assert(!quotedSourcePhrase.hard_failures.some((issue) => issue.check === "F6"));

  assertCheck(await runCase("f7", (rows) => {
    rows[0].answer_key_trust = "medium";
  }), "F7");

  assertCheck(await runCase("f7-tell", (rows) => {
    rows[0].the_tell = "absent source phrase";
  }), "F7");

  assertCheck(await runCase("f7-blocked", (rows) => {
    rows[0].content_lane_status = "blocked";
  }), "F7");

  assertCheck(await runCase("f8", (_rows, summary) => {
    summary.rows_emitted = 99;
  }), "F8");

  assertCheck(await runCase("f9", (rows) => {
    rows[1].renderer_justification = "This would be helpful for the learner.";
  }), "F9");

  const staleDialect = await runCase("stale-dialect", () => {}, {
    manifestOverride: `${JSON.stringify({
      question_id: "old",
      current_item_type: "multiple_choice",
      candidate_visual_kind: null,
      recommendation: "needs_human_review",
    })}\n`,
  });
  assertCheck(staleDialect, "F2");

  const bankPath = join(tempDir, "bank.json");
  await writeFile(bankPath, `${JSON.stringify({
    meta: { schemaVersion: "1.2" },
    questions: baseRows.slice(0, 3).map((row) => ({
      id: row.qid,
      itemType: row.item_type,
      stem: { en: "Adult client source text." },
    })),
  })}\n`, "utf8");
  const dangling = await runCase("w5", () => {}, { bankPaths: [bankPath] });
  assert(dangling.warnings.some((issue) => issue.check === "W5"));
  assert.equal(dangling.status, "usable_with_warnings");

  const pediatricBankPath = join(tempDir, "pediatric-bank.json");
  await writeFile(pediatricBankPath, `${JSON.stringify({
    questions: [
      { id: "fixture_replace", itemType: "multiple_choice", stem: { en: "A 7-year-old child has burns." } },
      ...baseRows.slice(1).map((row) => ({ id: row.qid, stem: { en: "Adult client source text." } })),
    ],
  })}\n`, "utf8");
  const pediatric = await runCase("pediatric", (rows) => {
    rows[0].target_renderer = "burn_map";
  }, { bankPaths: [pediatricBankPath] });
  assertCheck(pediatric, "F7");
  assert(pediatric.warnings.some((issue) => issue.check === "W9_POSSIBLE_PEDIATRIC_BURN_MAP"));

  const strict = await runCase("strict", (rows) => {
    rows[0].risk_tier = "low";
  }, { strict: true });
  assert.equal(strict.status, "rejected");
  assert.equal(strict.hard_failures.length, 0);
  assert(strict.warnings.some((issue) => issue.check === "W7_RISK_TIER_SUSPICIOUS"));

  const divergence = await runCase("w6-divergence", (_rows, summary) => {
    const gates = summary.global_gate_results as Record<string, boolean>;
    gates.enum_valid = false;
  });
  assert(divergence.warnings.some((issue) => issue.check === "W6"));
  assert.equal(divergence.summary_divergences.length, 1);

  for (const version of ["v1", "v2"]) {
    const historical = await validateSweep({
      manifestPath: resolve(`${archivedFixtureRoot}/${version}manifest.jsonl`),
      summaryPath: resolve(`${archivedFixtureRoot}/${version}summary.json`),
      writeReport: false,
    });
    assert.equal(historical.status, "rejected", `${version} historical fixture must be rejected`);
  }

  console.log("validate-sweep tests passed");
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
