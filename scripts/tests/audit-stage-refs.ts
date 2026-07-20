import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  findStageReferenceFindings,
  runAuditStageRefs,
  type StageReferenceFinding,
} from "../audit/audit-stage-refs";
import type {
  BankEnvelope,
  CaseStudyQuestion,
  Question,
  SchemaVersion,
  StandaloneQuestion,
  TextPair,
} from "../../src/types";

const text: TextPair = { en: "Fixture.", zh: "测试。" };

const question = (
  id: string,
  refs: Partial<{ stageId: string; answerableAfterStageId: string }> = {},
): StandaloneQuestion => ({
  id,
  itemType: "fill_in_blank",
  category: "Management of Care",
  topic: "fixture",
  difficulty: "medium",
  stem: text,
  blanks: [{ id: "b1", prompt: text, acceptable: ["1"] }],
  rationale: { correct: text },
  testTakingStrategy: text,
  glossary: [],
  ...refs,
});

const defaultStages: CaseStudyQuestion["caseStudy"]["stages"] = [
  { id: "stage_1", title: text, exhibits: [{ id: "stage_ex1", title: text, content: text }] },
  { id: "stage_2", title: text, exhibits: [{ id: "stage_ex2", title: text, content: text }] },
];

const caseStudy = (
  id: string,
  parts: StandaloneQuestion[],
  stages: CaseStudyQuestion["caseStudy"]["stages"] | null = defaultStages,
): CaseStudyQuestion => ({
  id,
  itemType: "case_study",
  category: "Management of Care",
  topic: "fixture",
  difficulty: "medium",
  stem: text,
  rationale: { correct: text },
  testTakingStrategy: text,
  glossary: [],
  caseStudy: {
    title: text,
    exhibits: [{ id: "ex1", title: text, content: text }],
    stages: stages ?? undefined,
    questions: parts,
  },
});

const bank = (questions: Question[], schemaVersion: SchemaVersion = "1.6"): BankEnvelope => ({
  meta: { schemaVersion, exam: "NCLEX-RN", topic: "fixture", count: questions.length },
  questions,
});

const banksOf = (
  id: string,
  parts: StandaloneQuestion[],
  stages: CaseStudyQuestion["caseStudy"]["stages"] | null = defaultStages,
) => [
  { file: `${id}.json`, bank: bank([caseStudy(id, parts, stages)]) },
];

const leaks = (findings: StageReferenceFinding[]) =>
  findings.filter((f): f is Extract<StageReferenceFinding, { kind: "revealsAllStages" }> => f.kind === "revealsAllStages");
const unresolved = (findings: StageReferenceFinding[]) =>
  findings.filter((f): f is Extract<StageReferenceFinding, { kind: "unresolved" }> => f.kind === "unresolved");
const missingRequired = (findings: StageReferenceFinding[]) =>
  findings.filter((f): f is Extract<StageReferenceFinding, { kind: "missingRequiredAnchor" }> => f.kind === "missingRequiredAnchor");

// ---------------------------------------------------------------------------
// 1. Staged case, part with NEITHER anchor -> one revealsAllStages finding.
// ---------------------------------------------------------------------------
{
  const findings = findStageReferenceFindings(banksOf("case_no_anchor", [question("no_anchor")]));
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, "revealsAllStages");
  const leak = leaks(findings)[0];
  assert.deepEqual(leak.anchorState.answerableAfterStageId, { status: "absent" });
  assert.deepEqual(leak.anchorState.stageId, { status: "absent" });
  assert.deepEqual(leak.validStageIds, ["stage_1", "stage_2"]);
}

// ---------------------------------------------------------------------------
// 2. answerableAfterStageId typo'd, no stageId -> revealsAllStages AND unresolved.
// ---------------------------------------------------------------------------
{
  const findings = findStageReferenceFindings(
    banksOf("case_bad_after_only", [question("bad_after_only", { answerableAfterStageId: "missing_stage" })]),
  );
  assert.equal(findings.length, 2);
  assert.equal(unresolved(findings).length, 1);
  assert.equal(unresolved(findings)[0].field, "answerableAfterStageId");
  assert.equal(unresolved(findings)[0].value, "missing_stage");
  assert.equal(leaks(findings).length, 1);
  assert.deepEqual(leaks(findings)[0].anchorState.answerableAfterStageId, {
    status: "unresolved",
    value: "missing_stage",
  });
  assert.deepEqual(leaks(findings)[0].anchorState.stageId, { status: "absent" });
}

// ---------------------------------------------------------------------------
// 3. answerableAfterStageId typo'd but stageId resolves -> unresolved only, no leak.
//    (Renderer gates via stageId, so this is not a leak.)
// ---------------------------------------------------------------------------
{
  const findings = findStageReferenceFindings(
    banksOf("case_bad_after_good_stage", [
      question("bad_after_good_stage", { answerableAfterStageId: "missing_stage", stageId: "stage_1" }),
    ]),
  );
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, "unresolved");
  assert.equal(leaks(findings).length, 0);
}

// ---------------------------------------------------------------------------
// 4. Closing part anchored to the FINAL stage -> no finding.
//    Guards against a length-based (rather than resolution-path-based) leak check.
// ---------------------------------------------------------------------------
{
  const findings = findStageReferenceFindings(
    banksOf("case_final_stage_anchor", [question("closing_part", { answerableAfterStageId: "stage_2" })]),
  );
  assert.deepEqual(findings, []);
}

// ---------------------------------------------------------------------------
// 5. Unstaged case (stages empty/absent), part with no anchor -> no finding.
// ---------------------------------------------------------------------------
{
  const findings = findStageReferenceFindings(banksOf("case_unstaged", [question("no_anchor_no_stages")], null));
  assert.deepEqual(findings, []);
}

// ---------------------------------------------------------------------------
// 6. --strict: staged part with resolving stageId, missing answerableAfterStageId
//    -> missingRequiredAnchor. Same fixture in default mode -> no such finding.
// ---------------------------------------------------------------------------
{
  const banks = banksOf("case_legacy_stage_only", [question("legacy_stage_only", { stageId: "stage_1" })]);

  const defaultFindings = findStageReferenceFindings(banks);
  assert.deepEqual(defaultFindings, []);

  const strictFindings = findStageReferenceFindings(banks, { strict: true });
  assert.equal(strictFindings.length, 1);
  assert.equal(strictFindings[0].kind, "missingRequiredAnchor");
  assert.equal(missingRequired(strictFindings)[0].resolvedStageId, "stage_1");
  assert.equal(leaks(strictFindings).length, 0, "a resolving legacy stageId is never a leak");
}

// ---------------------------------------------------------------------------
// Existing coverage retained: multiple resolved refs across parts, multiple
// unresolved refs across parts, and an unresolved ref alongside a null stages
// array all still behave as before the leak extension.
// ---------------------------------------------------------------------------
{
  const findings = findStageReferenceFindings(
    banksOf("case_valid", [
      question("valid_stage", { stageId: "stage_1" }),
      question("valid_after", { answerableAfterStageId: "stage_2" }),
    ]),
  );
  assert.deepEqual(findings, []);
}

{
  const findings = findStageReferenceFindings(
    banksOf("case_invalid", [
      question("bad_stage", { stageId: "missing_stage" }),
      question("bad_after", { answerableAfterStageId: "later_missing_stage" }),
    ]),
  );
  const unresolvedFindings = unresolved(findings);
  assert.equal(unresolvedFindings.length, 2);
  assert.deepEqual(
    unresolvedFindings.map((f) => f.field).sort(),
    ["answerableAfterStageId", "stageId"],
  );
  assert.equal(leaks(findings).length, 2, "each part also fails to resolve either anchor");
}

{
  const findings = findStageReferenceFindings(
    banksOf("case_no_stages_declared", [question("bad_without_stages", { stageId: "stage_1" }), question("no_ref_without_stages")], null),
  );
  assert.equal(findings.length, 1);
  assert.equal(findings[0].kind, "unresolved");
  assert.deepEqual(findings[0].validStageIds, []);
}

console.log("audit-stage-refs in-memory fixture tests passed");

// ---------------------------------------------------------------------------
// 7, 8, 9, 10: --file / --strict pathway, exercised against real temp files
// through both the pure `runAuditStageRefs` entry point and the standalone
// CLI subprocess (to prove the exit-code behavior the wrapper is responsible for).
// ---------------------------------------------------------------------------

const repoRoot = resolve(import.meta.dirname, "../..");
const tsx = resolve(repoRoot, "node_modules/.bin/tsx");
const auditScript = resolve(repoRoot, "scripts/audit/audit-stage-refs.ts");

const conformantBank = (): BankEnvelope =>
  bank([
    caseStudy("case_conformant", [
      question("part_1", { answerableAfterStageId: "stage_1" }),
      question("part_2", { answerableAfterStageId: "stage_2" }),
    ]),
  ]);

const leakBank = (): BankEnvelope =>
  bank([
    caseStudy("case_leaky", [
      question("part_leaks"),
      question("part_ok", { answerableAfterStageId: "stage_2" }),
    ]),
  ]);

const runCli = (args: string[]) => spawnSync(tsx, [auditScript, ...args], { encoding: "utf8" });

await (async () => {
  const root = await mkdtemp(join(tmpdir(), "shrimp-stage-refs-"));
  try {
    const conformantPath = join(root, "conformant.json");
    const leakPath = join(root, "leaky.json");
    const invalidJsonPath = join(root, "invalid.json");
    const schemaInvalidPath = join(root, "schema-invalid.json");
    const missingPath = join(root, "does-not-exist.json");

    await writeFile(conformantPath, JSON.stringify(conformantBank()), "utf8");
    await writeFile(leakPath, JSON.stringify(leakBank()), "utf8");
    await writeFile(invalidJsonPath, "{ not json", "utf8");
    await writeFile(schemaInvalidPath, JSON.stringify({ meta: { schemaVersion: "1.6" }, questions: "not-an-array" }), "utf8");

    // 8. Fully conformant staged case -> PASS, no findings.
    const conformantResult = await runAuditStageRefs({ files: [conformantPath] });
    assert.equal(conformantResult.status, "PASS");
    assert.equal(conformantResult.failures.length, 0);

    // 7. --strict + leak fixture -> FAIL; default mode same fixture -> WARN, and
    //    the argument-free (aggregate) call shape can never see FAIL.
    const leakStrict = await runAuditStageRefs({ files: [leakPath], strict: true });
    assert.equal(leakStrict.status, "FAIL");

    const leakDefault = await runAuditStageRefs({ files: [leakPath] });
    assert.equal(leakDefault.status, "WARN");

    const leakCliStrict = runCli(["--file", leakPath, "--strict"]);
    assert.notEqual(leakCliStrict.status, 0, "strict + leak must exit non-zero");

    const leakCliDefault = runCli(["--file", leakPath]);
    assert.equal(leakCliDefault.status, 0, "default mode must never be fatal, even with a leak present");

    // 9. --file with two temp files -> both inspected; findings attributed correctly.
    const twoFileResult = await runAuditStageRefs({ files: [conformantPath, leakPath] });
    assert.equal(twoFileResult.status, "WARN");
    assert.ok(twoFileResult.detail.includes("leaky.json"));
    assert.ok(!twoFileResult.detail.includes("conformant.json: case_conformant"));

    // 10. --file at a missing file, and separately a schema-invalid file -> FAIL,
    //     non-zero exit, never a stage-reference PASS.
    const missingResult = await runAuditStageRefs({ files: [missingPath] });
    assert.equal(missingResult.status, "FAIL");

    const invalidJsonResult = await runAuditStageRefs({ files: [invalidJsonPath] });
    assert.equal(invalidJsonResult.status, "FAIL");

    const schemaInvalidResult = await runAuditStageRefs({ files: [schemaInvalidPath] });
    assert.equal(schemaInvalidResult.status, "FAIL");

    const missingCli = runCli(["--file", missingPath]);
    assert.notEqual(missingCli.status, 0, "a missing --file target must exit non-zero even without --strict");

    // CLI argument hygiene: unknown flag, empty --file value, and --file with no path.
    const unknownFlag = runCli(["--nope"]);
    assert.notEqual(unknownFlag.status, 0);

    const emptyFileValue = runCli(["--file", ""]);
    assert.notEqual(emptyFileValue.status, 0);

    const danglingFileFlag = runCli(["--file"]);
    assert.notEqual(danglingFileFlag.status, 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
})();

console.log("audit-stage-refs --file/--strict pathway tests passed");
