import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { prepareRawPromotionPreview } from "../../lib/raw-promotion-preview";
import { stripCompileManifests } from "../../lib/case-completeness";
import { normalizeBankPresentations, serializeBank } from "../../lib/presentation-normalization";
import { shuffle } from "../../lib/shuffle";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { BankEnvelope } from "../../src/types";
import { integrityForFile } from "../audit/audit-integrity";
import { runAuditPositions } from "../audit/audit-positions";
import { renderRawGate, runRawGate } from "../raw-gate";

const repoRoot = resolve(import.meta.dirname, "../..");
const tsx = resolve(repoRoot, "node_modules/.bin/tsx");
const rawGateScript = resolve(repoRoot, "scripts/raw-gate.ts");
const promoteScript = resolve(repoRoot, "scripts/promote.ts");
const pair = (value: string) => ({ en: value, zh: value });

const fill = (
  id: string,
  overrides: Record<string, unknown> = {},
) => ({
  id,
  itemType: "fill_in_blank",
  category: "Management of Care",
  topic: "Prioritization & Delegation",
  difficulty: "medium",
  stem: pair("Fixture stem."),
  blanks: [{ id: "b1", prompt: pair("Enter one."), acceptable: ["1"] }],
  rationale: { correct: pair("Fixture rationale.") },
  testTakingStrategy: pair("Use the clinical facts."),
  glossary: [],
  ...overrides,
});

const mc = (id: string, correct = "a") => ({
  id,
  itemType: "multiple_choice",
  category: "Management of Care",
  topic: "Prioritization & Delegation",
  difficulty: "medium",
  stem: pair("Fixture stem."),
  options: [
    { id: "a", ...pair("A") },
    { id: "b", ...pair("B") },
    { id: "c", ...pair("C") },
    { id: "d", ...pair("D") },
  ],
  correct: [correct],
  rationale: {
    correct: pair("Content rationale."),
    byChoice: ["a", "b", "c", "d"].map((refId) => ({
      refId,
      ...pair(`Rationale for ${refId}.`),
    })),
  },
  testTakingStrategy: pair("Use the clinical facts."),
  glossary: [],
});

const dropdown = (id: string) => ({
  id,
  itemType: "dropdown_cloze",
  category: "Management of Care",
  topic: "Prioritization & Delegation",
  difficulty: "medium",
  stem: pair("Fixture stem."),
  clozeStem: pair("Choose {{blank}}."),
  dropdowns: [{
    id: "blank",
    options: [
      { id: "a", ...pair("A") },
      { id: "b", ...pair("B") },
      { id: "c", ...pair("C") },
      { id: "d", ...pair("D") },
    ],
    correct: "a",
  }],
  rationale: { correct: pair("Content rationale.") },
  testTakingStrategy: pair("Use the clinical facts."),
  glossary: [],
});

const sata = (id: string, correctIds: string[]) => ({
  id,
  itemType: "select_all",
  category: "Management of Care",
  topic: "Prioritization & Delegation",
  difficulty: "medium",
  stem: pair("Fixture stem."),
  options: ["a", "b", "c", "d", "e"].map((optionId) => ({
    id: optionId,
    ...pair(optionId.toUpperCase()),
  })),
  correct: correctIds,
  rationale: {
    correct: pair("Content rationale."),
    byChoice: ["a", "b", "c", "d", "e"].map((refId) => ({
      refId,
      ...pair(`Rationale for ${refId}.`),
    })),
  },
  testTakingStrategy: pair("Use the clinical facts."),
  glossary: [],
});

const bank = (
  questions: unknown[],
  schemaVersion = "1.6",
  metaOverrides: Record<string, unknown> = {},
) => ({
  meta: { schemaVersion, count: questions.length, ...metaOverrides },
  questions,
});

const caseQuestion = (
  id: string,
  refs: Array<Partial<{ stageId: string; answerableAfterStageId: string }>>,
  staged = true,
) => ({
  id,
  itemType: "case_study",
  category: "Management of Care",
  topic: "Prioritization & Delegation",
  difficulty: "medium",
  stem: pair("Case."),
  rationale: { correct: pair("Case rationale.") },
  testTakingStrategy: pair("Use facts."),
  glossary: [],
  caseStudy: {
    title: pair("Case"),
    exhibits: [{ id: "ex", title: pair("Exhibit"), content: pair("Content") }],
    ...(staged ? {
      stages: [
        { id: "stage_1", title: pair("Stage 1"), exhibits: [{ id: "s1", title: pair("One"), content: pair("One") }] },
        { id: "stage_2", title: pair("Stage 2"), exhibits: [{ id: "s2", title: pair("Two"), content: pair("Two") }] },
      ],
    } : {}),
    questions: refs.map((ref, index) => ({
      ...fill(`${id}_part_${index + 1}`),
      ...ref,
    })),
  },
});

const withRoot = async (run: (root: string) => Promise<void>) => {
  const root = await mkdtemp(join(tmpdir(), "shrimp-raw-gate-test-"));
  const previous = process.cwd();
  await mkdir(join(root, "banks/banks-raw"), { recursive: true });
  process.chdir(root);
  try {
    await run(root);
  } finally {
    process.chdir(previous);
    await rm(root, { recursive: true, force: true });
  }
};

await withRoot(async (root) => {
  const source = join(root, "banks/banks-raw/gemini-clean.json");
  await writeFile(source, JSON.stringify(bank([mc("clean_mc"), fill("clean_fill")])), "utf8");
  const before = await readFile(source, "utf8");

  const first = await prepareRawPromotionPreview({ displayPath: "first-spelling", resolvedPath: source });
  const second = await prepareRawPromotionPreview({ displayPath: "first-spelling", resolvedPath: source });
  assert(first.ok && second.ok);
  assert.equal(first.prepared.serialized, second.prepared.serialized);
  assert.equal(await readFile(source, "utf8"), before);

  const result = await runRawGate({
    files: ["banks/banks-raw/gemini-clean.json", "./banks/banks-raw/gemini-clean.json"],
    comparisonFiles: [],
  });
  assert.equal(result.exitCode, 0, renderRawGate(result));
  assert.equal(result.prepared.length, 1);
  assert.equal(result.prepared[0].displayPath, "banks/banks-raw/gemini-clean.json");
  assert.equal(await readFile(source, "utf8"), before);
  assert(!renderRawGate(result).includes("shrimp-raw-gate-"));
  const repeated = await runRawGate({
    files: ["banks/banks-raw/gemini-clean.json", "./banks/banks-raw/gemini-clean.json"],
    comparisonFiles: [],
  });
  assert.equal(renderRawGate(repeated), renderRawGate(result));
});

await withRoot(async (root) => {
  const validManifestCase = {
    ...caseQuestion(
      "manifest_case",
      Array.from({ length: 6 }, () => ({})),
      false,
    ),
    _compileManifest: {
      skeletonDpCount: 6,
      skeletonHasBowtie: false,
      emittedItemCount: 6,
      emittedBowtie: false,
      omittedDps: [],
    },
  };
  const valid = join(root, "banks/banks-raw/gemini-manifest.json");
  await writeFile(valid, JSON.stringify(bank([validManifestCase])), "utf8");
  const prepared = await prepareRawPromotionPreview({ displayPath: valid, resolvedPath: valid });
  assert(prepared.ok);
  assert.doesNotMatch(prepared.prepared.serialized, /_compileManifest/);

  const invalid = join(root, "banks/banks-raw/gemini-bad-manifest.json");
  const invalidCase = {
    ...validManifestCase,
    id: "bad_manifest_case",
    _compileManifest: { ...validManifestCase._compileManifest, emittedItemCount: 5 },
  };
  await writeFile(invalid, JSON.stringify(bank([invalidCase])), "utf8");
  const rejected = await runRawGate({ files: [invalid], comparisonFiles: [] });
  assert.equal(rejected.exitCode, 1);
  assert.match(renderRawGate(rejected), /emittedItemCount 5 does not match/);
});

await withRoot(async (root) => {
  const fixtures = [
    {
      name: "conformant",
      value: caseQuestion("conformant", [
        { answerableAfterStageId: "stage_1" },
        { answerableAfterStageId: "stage_2" },
      ]),
      expected: 0,
    },
    {
      name: "legacy-only",
      value: caseQuestion("legacy_only", [
        { stageId: "stage_1" },
        { answerableAfterStageId: "stage_2" },
      ]),
      expected: 1,
    },
    {
      name: "unresolved-primary",
      value: caseQuestion("unresolved_primary", [
        { answerableAfterStageId: "missing", stageId: "stage_1" },
        { answerableAfterStageId: "stage_2" },
      ]),
      expected: 1,
    },
    {
      name: "neither",
      value: caseQuestion("neither", [
        {},
        { answerableAfterStageId: "stage_2" },
      ]),
      expected: 1,
    },
    {
      name: "unstaged",
      value: caseQuestion("unstaged", [{}, {}], false),
      expected: 0,
    },
  ];
  for (const fixture of fixtures) {
    const path = join(root, `banks/banks-raw/gemini-${fixture.name}.json`);
    await writeFile(path, JSON.stringify(bank([fixture.value])), "utf8");
    const result = await runRawGate({ files: [path], comparisonFiles: [] });
    assert.equal(result.exitCode, fixture.expected, `${fixture.name}\n${renderRawGate(result)}`);
  }
});

await withRoot(async (root) => {
  const shared = join(root, "banks/banks-raw/gemini-shared.json");
  await writeFile(
    shared,
    JSON.stringify(bank([
      fill("shared_ok", {
        category: "Management of Care",
        topic: "Caregiver Role Strain & Family Coping",
      }),
    ])),
    "utf8",
  );
  const result = await runRawGate({ files: [shared], comparisonFiles: [] });
  assert.equal(result.exitCode, 0, renderRawGate(result));
});

await withRoot(async (root) => {
  const drift = join(root, "banks/banks-raw/gemini-drift.json");
  const raw = JSON.stringify(bank([fill("drift")], "1.6", { count: 99 }));
  await writeFile(drift, raw, "utf8");
  const result = await runRawGate({ files: [drift], comparisonFiles: [] });
  assert.equal(result.exitCode, 1);
  assert.match(renderRawGate(result), /meta\.count/);
  assert.match(renderRawGate(result), /normalize-raw-bank/);
  assert.equal(await readFile(drift, "utf8"), raw);
  assert.equal(existsSync(join(root, "banks/_promoted")), false);
  const promoted = spawnSync(tsx, [promoteScript], { cwd: root, encoding: "utf8" });
  assert.notEqual(promoted.status, 0);
  assert.equal(existsSync(join(root, "banks/_promoted")), false);
});

await withRoot(async (root) => {
  const malformed = join(root, "banks/banks-raw/gemini-malformed.json");
  const bare = join(root, "banks/banks-raw/gemini-bare.json");
  const unknown = join(root, "banks/banks-raw/unknown-candidate.json");
  await writeFile(malformed, "{ nope", "utf8");
  await writeFile(bare, JSON.stringify([fill("bare")]), "utf8");
  await writeFile(unknown, JSON.stringify(bank([fill("unknown")])), "utf8");
  const schemaInvalid = join(root, "banks/banks-raw/gemini-schema-invalid.json");
  const unreadable = join(root, "banks/banks-raw/gemini-unreadable.json");
  await writeFile(
    schemaInvalid,
    JSON.stringify({ meta: { schemaVersion: "1.6", count: 1 }, questions: [{ id: "invalid" }] }),
    "utf8",
  );
  await mkdir(unreadable);
  for (const path of [malformed, bare, unknown, schemaInvalid, unreadable, join(root, "missing.json")]) {
    const result = await runRawGate({ files: [path], comparisonFiles: [] });
    assert.equal(result.exitCode, 1, path);
    assert.equal(result.prepared.length, 0);
  }
});

await withRoot(async (root) => {
  const candidate = join(root, "banks/banks-raw/gemini-high.json");
  const canonical = join(root, "banks/gemini-canonical.json");
  await writeFile(candidate, JSON.stringify(bank([fill("high")], "2.0")), "utf8");
  await writeFile(canonical, JSON.stringify(bank([fill("canonical")], "1.6")), "utf8");
  const result = await runRawGate({ files: [candidate], comparisonFiles: [canonical] });
  assert.equal(result.exitCode, 1);
  assert.match(renderRawGate(result), /schemaVersion 2\.0 is higher/);
});

await withRoot(async (root) => {
  const candidate = join(root, "banks/banks-raw/gemini-explicit-empty.json");
  const canonical = join(root, "banks/gemini-canonical.json");
  await writeFile(candidate, JSON.stringify(bank([fill("explicit_empty")], "2.0")), "utf8");
  await writeFile(canonical, JSON.stringify(bank([fill("real_cwd_canonical")], "1.6")), "utf8");

  const injectedEmpty = await runRawGate({ files: [candidate], comparisonFiles: [] });
  assert.equal(injectedEmpty.exitCode, 0, renderRawGate(injectedEmpty));
  assert.match(renderRawGate(injectedEmpty), /absent from the resolved comparison population/);

  const defaultPopulation = await runRawGate({ files: [candidate] });
  assert.equal(defaultPopulation.exitCode, 1);
  assert.match(renderRawGate(defaultPopulation), /schemaVersion 2\.0 is higher/);
});

await withRoot(async (root) => {
  const candidate = join(root, "banks/banks-raw/gemini-topic.json");
  await writeFile(
    candidate,
    JSON.stringify(bank([
      fill("topic_bad", {
        category: "Management of Care",
        topic: "Electrolyte Imbalances",
      }),
    ])),
    "utf8",
  );
  const result = await runRawGate({ files: [candidate], comparisonFiles: [] });
  assert.equal(result.exitCode, 1);
  const output = renderRawGate(result);
  assert.match(output, /audit:topic-license:raw-policy/);
  assert.match(output, /topic_bad/);
  assert.match(output, /license_mismatch/);
  assert.match(output, /licensedCategories/);
  assert.match(output, /SHARED-topic clinical boundaries remain semantic-review work/);
});

await withRoot(async (root) => {
  const candidate = join(root, "banks/banks-raw/gemini-topic-multiple.json");
  await writeFile(
    candidate,
    JSON.stringify(bank([
      fill("topic_noncanonical", { topic: "Not Canonical" }),
      fill("topic_mismatch", { topic: "Electrolyte Imbalances" }),
    ])),
    "utf8",
  );
  const result = await runRawGate({ files: [candidate], comparisonFiles: [] });
  const topic = result.candidates[0].results.find(
    (entry) => entry.name === "audit:topic-license:raw-policy",
  );
  assert.equal(topic?.status, "FAIL");
  assert.deepEqual(topic?.failures, ["topic_noncanonical", "topic_mismatch"]);
  assert.match(topic?.detail ?? "", /noncanonical_topic/);
  assert.match(topic?.detail ?? "", /license_mismatch/);
  assert.match(topic?.detail ?? "", /SHARED-topic clinical boundaries remain semantic-review work/);
});

await withRoot(async (root) => {
  const fixtures = [
    {
      name: "reference",
      question: {
        ...mc("reference_bad"),
        rationale: {
          ...mc("reference_bad").rationale,
          correct: pair("Option A is correct."),
        },
      },
      check: "audit:references",
    },
    {
      name: "producer",
      question: fill("producer_bad", { stem: pair("Use the source-pinned facts.") }),
      check: "audit:producer-vocabulary",
    },
    {
      name: "authorial",
      question: fill("authorial_bad", {
        testTakingStrategy: pair("Do not independently prescribe medication."),
      }),
      check: "audit:authorial-constraint-leakage",
    },
  ];
  for (const fixture of fixtures) {
    const path = join(root, `banks/banks-raw/gemini-${fixture.name}.json`);
    await writeFile(path, JSON.stringify(bank([fixture.question])), "utf8");
    const result = await runRawGate({ files: [path], comparisonFiles: [] });
    assert.equal(result.exitCode, 1);
    assert.equal(
      result.candidates[0].results.find((entry) => entry.name === fixture.check)?.status,
      "FAIL",
    );
  }
});

await withRoot(async (root) => {
  const first = join(root, "banks/banks-raw/gemini-one.json");
  const second = join(root, "banks/banks-raw/gpt-two.json");
  await writeFile(first, JSON.stringify(bank([fill("collision")])), "utf8");
  await writeFile(second, JSON.stringify(bank([fill("collision")])), "utf8");
  const result = await runRawGate({ files: [first, second], comparisonFiles: [] });
  assert.equal(result.exitCode, 1);
  const ids = result.candidateSetResults.find((entry) => entry.name === "audit:ids");
  assert.equal(ids?.status, "FAIL");
  assert.match(ids?.detail ?? "", /gemini-one\.json/);
  assert.match(ids?.detail ?? "", /gpt-two\.json/);
});

await withRoot(async (root) => {
  const candidate = join(root, "banks/banks-raw/gemini-canonical-collision.json");
  const canonical = join(root, "banks/gemini-canonical.json");
  await writeFile(candidate, JSON.stringify(bank([fill("canonical_collision")])), "utf8");
  await writeFile(canonical, JSON.stringify(bank([fill("canonical_collision")])), "utf8");
  const result = await runRawGate({ files: [candidate], comparisonFiles: [canonical] });
  assert.equal(result.exitCode, 1);
  const ids = result.candidateSetResults.find((entry) => entry.name === "audit:ids");
  assert.equal(ids?.status, "FAIL");
  assert.match(ids?.detail ?? "", /canonical_collision/);
  assert.match(ids?.detail ?? "", /gemini-canonical\.json/);
});

await withRoot(async (root) => {
  const candidate = join(root, "banks/banks-raw/gemini-comparison-only.json");
  const comparisonA = join(root, "banks/gemini-canonical.json");
  const comparisonB = join(root, "banks/gpt-canonical.json");
  await writeFile(candidate, JSON.stringify(bank([fill("candidate_unique")])), "utf8");
  await writeFile(comparisonA, JSON.stringify(bank([fill("comparison_duplicate")])), "utf8");
  await writeFile(comparisonB, JSON.stringify(bank([fill("comparison_duplicate")])), "utf8");
  const result = await runRawGate({
    files: [candidate],
    comparisonFiles: [comparisonA, comparisonB],
  });
  assert.equal(result.exitCode, 0, renderRawGate(result));
  const ids = result.candidateSetResults.find((entry) => entry.name === "audit:ids");
  assert.equal(ids?.status, "PASS");
});

await withRoot(async (root) => {
  const embeddedId = "embedded_collision";
  const candidate = join(root, "banks/banks-raw/gemini-embedded-collision.json");
  const canonical = join(root, "banks/gemini-canonical.json");
  const embeddedCase = caseQuestion("embedded_collision_case", [
    { answerableAfterStageId: "stage_1" },
    { answerableAfterStageId: "stage_2" },
  ]);
  embeddedCase.caseStudy.questions[0].id = embeddedId;
  await writeFile(candidate, JSON.stringify(bank([embeddedCase])), "utf8");
  await writeFile(canonical, JSON.stringify(bank([fill(embeddedId)])), "utf8");
  const result = await runRawGate({ files: [candidate], comparisonFiles: [canonical] });
  assert.equal(result.exitCode, 1);
  const ids = result.candidateSetResults.find((entry) => entry.name === "audit:ids");
  assert.equal(ids?.status, "FAIL");
  assert.match(ids?.detail ?? "", /caseStudy\.questions/);
});

await withRoot(async (root) => {
  const nested = mc("embedded_mc");
  const embeddedCase = {
    id: "case",
    itemType: "case_study",
    category: "Management of Care",
    topic: "Prioritization & Delegation",
    difficulty: "medium",
    stem: pair("Case."),
    rationale: { correct: pair("Case rationale.") },
    testTakingStrategy: pair("Use facts."),
    glossary: [],
    caseStudy: {
      title: pair("Case"),
      exhibits: [{ id: "ex", title: pair("Exhibit"), content: pair("Content") }],
      questions: [nested, fill("embedded_fill")],
    },
  };
  const path = join(root, "banks/banks-raw/gemini-case.json");
  await writeFile(path, JSON.stringify(bank([embeddedCase])), "utf8");
  const topOnly = await runAuditPositions({ files: [path] });
  const scoredLeaves = await runAuditPositions({ files: [path], includeEmbeddedScoredLeaves: true });
  assert.match(topOnly.detail, /No multiple_choice items/);
  assert.match(scoredLeaves.detail, /4-option MC \(n=1\)/);
});

await withRoot(async (root) => {
  const path = join(root, "banks/banks-raw/gemini-position-preview.json");
  let rawQuestion = mc("post_shuffle_position_0", "a");
  for (let index = 0; index < 100; index += 1) {
    const candidate = mc(`post_shuffle_position_${index}`, "a");
    const normalized = normalizeBankPresentations(
      bank([candidate]) as unknown as BankEnvelope,
    ).bank.questions[0];
    if (
      normalized.itemType === "multiple_choice" &&
      normalized.options.findIndex((option) => option.id === "a") !== 0
    ) {
      rawQuestion = candidate;
      break;
    }
  }
  await writeFile(path, JSON.stringify(bank([rawQuestion])), "utf8");
  const result = await runRawGate({ files: [path], comparisonFiles: [] });
  assert.equal(result.exitCode, 0, renderRawGate(result));
  const preparedQuestion = result.prepared[0].bank.questions[0];
  assert.equal(preparedQuestion.itemType, "multiple_choice");
  if (preparedQuestion.itemType !== "multiple_choice") throw new Error("expected MC fixture");
  const preparedPosition = preparedQuestion.options.findIndex((option) => option.id === "a");
  assert.notEqual(preparedPosition, 0, "fixture must prove the prepared order differs from producer order");
  const positions = result.candidateSetResults.find((entry) => entry.name === "audit:positions");
  const histogram = [0, 1, 2, 3]
    .map((index) => `slot${index}=${index === preparedPosition ? 1 : 0}`)
    .join(", ");
  assert.match(positions?.detail ?? "", new RegExp(histogram.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

await withRoot(async (root) => {
  const biasedPath = join(root, "banks/banks-raw/gemini-mechanical-bias.json");
  const selected: ReturnType<typeof dropdown>[] = [];
  for (let index = 0; selected.length < 20 && index < 10000; index += 1) {
    const question = dropdown(`mechanical_${index}`);
    const normalized = normalizeBankPresentations(
      bank([question]) as unknown as BankEnvelope,
    ).bank.questions[0];
    if (
      normalized.itemType === "dropdown_cloze" &&
      normalized.dropdowns[0].options[0].id === normalized.dropdowns[0].correct
    ) {
      selected.push(question);
    }
  }
  assert.equal(selected.length, 20);
  await writeFile(biasedPath, JSON.stringify(bank(selected)), "utf8");

  const enforced = await runRawGate({ files: [biasedPath], comparisonFiles: [] });
  const mechanical = enforced.candidateSetResults.find(
    (entry) => entry.name === "audit:non-mcq-bias:mechanical",
  );
  assert.equal(mechanical?.status, "FAIL");
  assert.equal(enforced.exitCode, 1);

  const previous = process.env.BIAS_GATE_ENFORCE_MECHANICAL;
  process.env.BIAS_GATE_ENFORCE_MECHANICAL = "0";
  try {
    const observeOnly = await runRawGate({ files: [biasedPath], comparisonFiles: [] });
    assert.equal(
      observeOnly.candidateSetResults.find(
        (entry) => entry.name === "audit:non-mcq-bias:mechanical",
      )?.status,
      "FAIL",
    );
    assert.equal(observeOnly.exitCode, 0, renderRawGate(observeOnly));
  } finally {
    if (previous === undefined) delete process.env.BIAS_GATE_ENFORCE_MECHANICAL;
    else process.env.BIAS_GATE_ENFORCE_MECHANICAL = previous;
  }
});

await withRoot(async (root) => {
  const distributionPath = join(root, "banks/banks-raw/gemini-distribution-only.json");
  const questions = Array.from({ length: 8 }, (_, index) =>
    sata(
      `distribution_${index}`,
      index < 6 ? ["a", "b"] : ["a", "b", "c"],
    ));
  await writeFile(distributionPath, JSON.stringify(bank(questions)), "utf8");
  const result = await runRawGate({ files: [distributionPath], comparisonFiles: [] });
  assert.equal(result.preparationFailures.length, 0, renderRawGate(result));
  const distributional = result.candidateSetResults.find(
    (entry) => entry.name === "audit:non-mcq-bias:distributional",
  );
  const mechanical = result.candidateSetResults.find(
    (entry) => entry.name === "audit:non-mcq-bias:mechanical",
  );
  assert.equal(distributional?.status, "WARN");
  assert.notEqual(mechanical?.status, "FAIL");
  assert.equal(result.exitCode, 0, renderRawGate(result));
});

await withRoot(async (root) => {
  const good = join(root, "banks/banks-raw/gemini-good.json");
  const bad = join(root, "banks/banks-raw/gpt-bad.json");
  const staged = join(root, "banks/_promoted/existing.json");
  await mkdir(join(root, "banks/_promoted"));
  await writeFile(good, JSON.stringify(bank([fill("good")])), "utf8");
  await writeFile(bad, JSON.stringify(bank([fill("bad")], "1.6", { count: 2 })), "utf8");
  await writeFile(staged, "preserve-me", "utf8");
  const promoted = spawnSync(tsx, [promoteScript], { cwd: root, encoding: "utf8" });
  assert.notEqual(promoted.status, 0);
  assert.equal(await readFile(staged, "utf8"), "preserve-me");
  assert.deepEqual((await readdir(join(root, "banks/_promoted"))).sort(), ["existing.json"]);
});

await withRoot(async (root) => {
  const source = join(root, "banks/banks-raw/gemini-pass.json");
  await writeFile(source, JSON.stringify(bank([mc("promoted_mc"), fill("promoted_fill")])), "utf8");
  const gate = await runRawGate({ files: [source], comparisonFiles: [] });
  assert.equal(gate.exitCode, 0, renderRawGate(gate));
  const promoted = spawnSync(tsx, [promoteScript], { cwd: root, encoding: "utf8" });
  assert.equal(promoted.status, 0, `${promoted.stdout}\n${promoted.stderr}`);
  const staged = await readFile(join(root, "banks/_promoted/gemini-pass.json"), "utf8");
  assert.equal(staged, gate.prepared[0].serialized);
  const legacyValidated = validateBankObject(
    stripCompileManifests(parseBankText(await readFile(source, "utf8"))),
    { rejectUnknownKeys: true, requireMeta: true },
  );
  assert(legacyValidated.ok);
  const legacyShuffled = {
    ...legacyValidated.value,
    questions: legacyValidated.value.questions.map(shuffle),
  };
  const legacyBytes = serializeBank(normalizeBankPresentations(legacyShuffled).bank);
  assert.equal(staged, legacyBytes, "new gate output must remain byte-identical to the old promoter transform");
  const integrity = integrityForFile(await readFile(source, "utf8"), staged);
  assert.equal(integrity.kind, "checked");
  if (integrity.kind === "checked") assert.deepEqual(integrity.failures, []);
});

await withRoot(async (root) => {
  const source = join(root, "banks/banks-raw/gemini-cli.json");
  await writeFile(source, JSON.stringify(bank([fill("cli")])), "utf8");
  const ok = spawnSync(tsx, [rawGateScript, "--file", source], { cwd: root, encoding: "utf8" });
  assert.equal(ok.status, 0, `${ok.stdout}\n${ok.stderr}`);
  const malformed = join(root, "banks/banks-raw/gemini-cli-malformed.json");
  await writeFile(malformed, "{ malformed", "utf8");
  const malformedResult = spawnSync(
    tsx,
    [rawGateScript, "--file", malformed],
    { cwd: root, encoding: "utf8" },
  );
  assert.notEqual(malformedResult.status, 0);
  assert.match(`${malformedResult.stdout}\n${malformedResult.stderr}`, /JSON|truncated/i);
  for (const args of [[], ["--unknown"], ["--file"], ["--file", "   "]]) {
    const invalid = spawnSync(tsx, [rawGateScript, ...args], { cwd: root, encoding: "utf8" });
    assert.notEqual(invalid.status, 0, args.join(" "));
  }
});

console.log("raw-gate tests passed");
