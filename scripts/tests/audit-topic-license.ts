import assert from "node:assert/strict";
import { analyzeTopicLicenses, renderTopicLicenseReport } from "../audit/audit-topic-license";
import type { BankEnvelope } from "../../src/types";

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

console.log("topic-license audit tests passed");
