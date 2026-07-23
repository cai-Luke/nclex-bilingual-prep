import assert from "node:assert/strict";
import { chmod, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {
  analyzeTopicLicenses,
  renderTopicLicenseReport,
  runAuditTopicLicense,
} from "../audit/audit-topic-license";
import type { BankEnvelope } from "../../src/types";
import {
  createAuditScopeFixtures,
  makeBank,
  makeQuestion,
  withUnreadableFile,
} from "../test-utils/audit-scope-fixtures";

const common = {
  difficulty: "medium" as const,
  stem: { en: "fixture", zh: "fixture" },
  rationale: { correct: { en: "fixture", zh: "fixture" } },
  testTakingStrategy: { en: "fixture", zh: "fixture" },
  glossary: [],
};

const leaf = (id: string, category: BankEnvelope["questions"][number]["category"], topic: string) => ({
  ...common,
  id,
  itemType: "multiple_choice" as const,
  category,
  topic,
  options: [
    { id: "a", en: "a", zh: "a" },
    { id: "b", en: "b", zh: "b" },
  ],
  correct: ["a"],
});

const bank = {
  schemaVersion: "2.0",
  bankName: "fixture",
  questions: [
    leaf("standalone", "Pharmacological and Parenteral Therapies", "IV Fluid Calculations"),
    {
      ...common,
      id: "case",
      itemType: "case_study",
      category: "Physiological Adaptation",
      topic: "Unmapped case topic",
      caseStudy: {
        title: { en: "fixture", zh: "fixture" },
        exhibits: [],
        questions: [
          leaf("embedded_mismatch", "Physiological Adaptation", "IV Fluid Calculations"),
          leaf("embedded_shared", "Safety and Infection Prevention and Control", "Medication Safety & Admin"),
        ],
      },
    },
  ],
} as unknown as BankEnvelope;

const analysis = analyzeTopicLicenses([{ bank, file: "fixture.json" }]);
assert.deepEqual(analysis.metrics, {
  topLevelRecords: 2,
  caseContainers: 1,
  standaloneTopLevel: 1,
  embeddedParts: 2,
  scoredLeaves: 3,
  topLevelFindings: 1,
  caseContainerFindings: 1,
  standaloneTopLevelFindings: 0,
  embeddedPartFindings: 1,
  scoredLeafFindings: 1,
});
assert.deepEqual(
  analysis.findings.map(({ id, kind, issue }) => ({ id, kind, issue })),
  [
    { id: "case", kind: "top_level_case_container", issue: "noncanonical_topic" },
    { id: "embedded_mismatch", kind: "embedded_scored_leaf", issue: "license_mismatch" },
  ],
);
const report = renderTopicLicenseReport(analysis);
assert.match(report, /Case-study containers are inspected as records but are not counted as scored leaves/);
assert.match(report, /cannot enforce the clinical boundary among categories licensed for a SHARED topic/);

const fixture = await createAuditScopeFixtures();
try {
  let result = await runAuditTopicLicense({ files: [fixture.validA] });
  assert.equal(result.status, "PASS");

  result = await runAuditTopicLicense({ files: [fixture.validA, fixture.validB] });
  assert.equal(result.status, "PASS");
  assert.match(result.detail, /Inspected 2 top-level records/);

  for (const path of [fixture.missing, fixture.malformed, fixture.schemaInvalid]) {
    result = await runAuditTopicLicense({ files: [path] });
    assert.equal(result.status, "FAIL");
    assert.match(result.detail, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  result = await runAuditTopicLicense({ files: [fixture.validA, fixture.aliasForValidA] });
  assert.match(result.detail, /Inspected 1 top-level records/);
  assert.equal((await runAuditTopicLicense({ files: [] })).status, "FAIL");

  const findingPath = join(fixture.directory, "topic-finding.json");
  await writeFile(
    findingPath,
    JSON.stringify(makeBank(makeQuestion("topic_finding", { topic: "Unmapped fixture topic" }))),
  );
  result = await runAuditTopicLicense({ files: [findingPath] });
  assert.equal(result.status, "WARN");
  assert.doesNotMatch(result.detail, /current canonical banks|canonical items|promoted bank|bundled banks/);

  const selectedAnalysis = analyzeTopicLicenses([{
    bank: makeBank(makeQuestion("topic_finding", { topic: "Unmapped fixture topic" })),
    file: findingPath,
  }]);
  assert.equal(selectedAnalysis.findings[0].file, findingPath);
  const selectedReport = renderTopicLicenseReport(selectedAnalysis, {
    inputGitSha: "fixture-sha",
    scopeDescription: "explicitly selected files",
  });
  assert.match(selectedReport, /Status: explicitly selected files/);
  assert.match(selectedReport, new RegExp(findingPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(selectedReport, /current canonical banks/);

  const unreadable = await withUnreadableFile(
    fixture.unreadable,
    () => runAuditTopicLicense({ files: [fixture.unreadable] }),
  );
  if (unreadable.unreadableWasEnforced) assert.equal(unreadable.value.status, "FAIL");
} finally {
  await fixture.cleanup();
}

console.log("topic-license audit tests passed");
