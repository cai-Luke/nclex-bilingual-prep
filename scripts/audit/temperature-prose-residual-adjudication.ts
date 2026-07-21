import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

type Residual = {
  occurrenceId: string;
  bankPath: string;
  topLevelQuestionId: string;
  embeddedQuestionId: string | null;
  jsonPath: string;
  occurrenceIndex: number;
  matchedExpression: string;
  verbatimText: string;
};

type Replacement = {
  occurrenceId: string;
  resultingExpression: string;
};

type TargetSpec = {
  jsonPath: string;
  replacements?: Replacement[];
  completeResultingFieldText?: string;
};

type DecisionSpec = {
  adjudicationId: string;
  summary: string;
  rationale: string;
  sourceBasis: Array<{ title: string; url: string }>;
  occurrenceIds: string[];
  targets: TargetSpec[];
};

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "../..");
const auditDir = resolve(repoRoot, "audit/temperature-prose-unit-survey-2026-07-21");
const residualPath = resolve(auditDir, "review-residuals.jsonl");
const outputPath = resolve(auditDir, "residual-adjudication.jsonl");
const reportPath = resolve(auditDir, "residual-adjudication-report.md");

const sourceFiles = new Map<string, unknown>();

function readJson(path: string): unknown {
  const cached = sourceFiles.get(path);
  if (cached !== undefined) return cached;
  const parsed = JSON.parse(readFileSync(resolve(repoRoot, path), "utf8"));
  sourceFiles.set(path, parsed);
  return parsed;
}

function readJsonPath(root: unknown, jsonPath: string): unknown {
  const parts: Array<string | number> = [];
  const tokenPattern = /([A-Za-z_][A-Za-z0-9_]*)|\[(\d+)\]/g;
  for (const match of jsonPath.matchAll(tokenPattern)) {
    parts.push(match[1] ?? Number(match[2]));
  }
  let current = root;
  for (const part of parts) {
    if (current === null || typeof current !== "object") {
      throw new Error(`Cannot traverse ${jsonPath} at ${String(part)}`);
    }
    current = (current as Record<string | number, unknown>)[part];
  }
  return current;
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function replaceOnce(value: string, from: string, to: string, label: string): string {
  const first = value.indexOf(from);
  if (first < 0) throw new Error(`${label}: expected expression not found: ${from}`);
  if (value.indexOf(from, first + from.length) >= 0) {
    throw new Error(`${label}: expression is not unique: ${from}`);
  }
  return `${value.slice(0, first)}${to}${value.slice(first + from.length)}`;
}

const residuals = readFileSync(residualPath, "utf8")
  .trim()
  .split("\n")
  .map((line) => JSON.parse(line) as Residual);
const residualById = new Map(residuals.map((row) => [row.occurrenceId, row]));

const decisions: DecisionSpec[] = [
  {
    adjudicationId: "temperature-residual-01-tb-measured-vital",
    summary: "Normalize the Chinese-only TB measured vital from the Celsius-authored value.",
    rationale:
      "This is an ordinary measured vital. Direct one-decimal conversion of 38.3 °C is 100.9 °F; no counterpart fact is added.",
    sourceBasis: [],
    occurrenceIds: ["temp-00036"],
    targets: [
      {
        jsonPath: "questions[64].caseStudy.exhibits[1].content.zh",
        replacements: [
          { occurrenceId: "temp-00036", resultingExpression: "100.9 °F (38.3 °C)" },
        ],
      },
    ],
  },
  {
    adjudicationId: "temperature-residual-02-delirium-measured-vital",
    summary: "Normalize the bilingual delirium/UTI measured vital from the Celsius-authored value.",
    rationale:
      "The structured measurement fixes the authored value at 38.3 °C. Direct one-decimal conversion is 100.9 °F.",
    sourceBasis: [],
    occurrenceIds: ["temp-00123", "temp-00124"],
    targets: [
      {
        jsonPath: "questions[265].caseStudy.exhibits[1].content.en",
        replacements: [
          { occurrenceId: "temp-00123", resultingExpression: "100.9 °F (38.3 °C)" },
        ],
      },
      {
        jsonPath: "questions[265].caseStudy.exhibits[1].content.zh",
        replacements: [
          { occurrenceId: "temp-00124", resultingExpression: "100.9 °F (38.3 °C)" },
        ],
      },
    ],
  },
  {
    adjudicationId: "temperature-residual-03-neutropenic-fever-threshold",
    summary: "Preserve the published neutropenic-fever threshold pairing while reordering it.",
    rationale:
      "ASCO/IDSA publishes the single-reading threshold as ≥38.3 °C (101 °F). This is a source-pinned clinical threshold, not an ordinary measured vital, so the published pairing is retained with Fahrenheit first.",
    sourceBasis: [
      {
        title:
          "ASCO/IDSA Clinical Practice Guideline Update for Outpatient Management of Fever and Neutropenia in Adults Treated for Malignancy",
        url: "https://www.idsociety.org/globalassets/idsa/practice-guidelines/outpatient-management-of-fever-and-neutropenia.pdf",
      },
    ],
    occurrenceIds: ["temp-00231", "temp-00234", "temp-00256", "temp-00257"],
    targets: [
      {
        jsonPath: "questions[286].caseStudy.exhibits[0].content.en",
        replacements: [
          { occurrenceId: "temp-00231", resultingExpression: "≥ 101 °F (38.3 °C)" },
        ],
      },
      {
        jsonPath: "questions[286].caseStudy.exhibits[0].content.zh",
        replacements: [
          { occurrenceId: "temp-00234", resultingExpression: "≥ 101 °F (38.3 °C)" },
        ],
      },
      {
        jsonPath: "questions[286].caseStudy.questions[5].options[4].en",
        replacements: [
          { occurrenceId: "temp-00256", resultingExpression: "101 °F (38.3 °C)" },
        ],
      },
      {
        jsonPath: "questions[286].caseStudy.questions[5].options[4].zh",
        replacements: [
          { occurrenceId: "temp-00257", resultingExpression: "超过 101 °F (38.3 °C)" },
        ],
      },
    ],
  },
  {
    adjudicationId: "temperature-residual-04-tpn-measured-vital",
    summary: "Correct the erroneous Fahrenheit counterpart for the bilingual TPN measured vital.",
    rationale:
      "The structured measurement and surrounding progression establish 39.2 °C. Direct one-decimal conversion is 102.6 °F, not 103.6 °F.",
    sourceBasis: [],
    occurrenceIds: ["temp-00457", "temp-00459"],
    targets: [
      {
        jsonPath: "questions[40].caseStudy.stages[0].exhibits[0].content.en",
        replacements: [
          { occurrenceId: "temp-00457", resultingExpression: "102.6 °F (39.2 °C)" },
        ],
      },
      {
        jsonPath: "questions[40].caseStudy.stages[0].exhibits[0].content.zh",
        replacements: [
          { occurrenceId: "temp-00459", resultingExpression: "102.6 °F (39.2 °C)" },
        ],
      },
    ],
  },
  {
    adjudicationId: "temperature-residual-05-transfusion-delta-rewrite",
    summary: "Rewrite the bilingual transfusion rationale with explicit paired temperature deltas.",
    rationale:
      "Temperature deltas use multiplicative conversion only: 0.5 °F is 0.3 °C at compact precision, and 1 °C is exactly 1.8 °F. AABB's NHSN quick reference states the threshold as a change of at least 1 °C/1.8 °F, so the comparator is normalized to ≥.",
    sourceBasis: [
      {
        title: "AABB Quick Reference Guide: NHSN Hemovigilance Module",
        url: "https://www.aabb.org/docs/default-source/default-document-library/resources/aabb-quick-reference-guide-nhsn-hemovigilance-module.pdf",
      },
    ],
    occurrenceIds: [
      "temp-00094",
      "temp-00095",
      "temp-00096",
      "temp-00097",
      "temp-00098",
      "temp-00099",
    ],
    targets: [
      {
        jsonPath: "questions[782].rationale.byChoice[0].en",
        completeResultingFieldText:
          "A 0.5 °F (0.3 °C) rise does not meet the typical febrile-reaction threshold of ≥1.8 °F (1 °C).",
      },
      {
        jsonPath: "questions[782].rationale.byChoice[0].zh",
        completeResultingFieldText:
          "体温升高 0.5 °F (0.3 °C) 未达到典型发热反应阈值 ≥1.8 °F (1 °C)。",
      },
    ],
  },
];

const consumed = new Set<string>();
const output = decisions.map((decision) => {
  const decisionRows = decision.occurrenceIds.map((id) => {
    const row = residualById.get(id);
    if (!row) throw new Error(`${decision.adjudicationId}: missing residual ${id}`);
    if (consumed.has(id)) throw new Error(`${decision.adjudicationId}: duplicate residual ${id}`);
    consumed.add(id);
    return row;
  });

  const bankPaths = [...new Set(decisionRows.map((row) => row.bankPath))];
  const targets = decision.targets.map((targetSpec) => {
    const targetRows = decisionRows.filter((row) => row.jsonPath === targetSpec.jsonPath);
    if (targetRows.length === 0) {
      throw new Error(`${decision.adjudicationId}: no residuals for ${targetSpec.jsonPath}`);
    }
    const [first] = targetRows;
    if (targetRows.some((row) => row.verbatimText !== first.verbatimText)) {
      throw new Error(`${decision.adjudicationId}: inconsistent field preimages`);
    }
    const current = readJsonPath(readJson(first.bankPath), targetSpec.jsonPath);
    if (current !== first.verbatimText) {
      throw new Error(`${decision.adjudicationId}: bank field no longer matches survey preimage`);
    }

    let result = first.verbatimText;
    const replacementOperations = (targetSpec.replacements ?? []).map((replacement) => {
      const row = residualById.get(replacement.occurrenceId);
      if (!row || row.jsonPath !== targetSpec.jsonPath) {
        throw new Error(`${decision.adjudicationId}: invalid replacement ${replacement.occurrenceId}`);
      }
      result = replaceOnce(
        result,
        row.matchedExpression,
        replacement.resultingExpression,
        replacement.occurrenceId,
      );
      return {
        occurrenceId: row.occurrenceId,
        occurrenceIndex: row.occurrenceIndex,
        surveyMatchedExpression: row.matchedExpression,
        exactResultingExpression: replacement.resultingExpression,
      };
    });
    if (targetSpec.completeResultingFieldText !== undefined) {
      if (targetSpec.replacements !== undefined) {
        throw new Error(`${decision.adjudicationId}: mixed replacement modes`);
      }
      result = targetSpec.completeResultingFieldText;
    }

    return {
      bankPath: first.bankPath,
      topLevelQuestionId: first.topLevelQuestionId,
      embeddedQuestionId: first.embeddedQuestionId,
      jsonPath: targetSpec.jsonPath,
      surveyOccurrenceIds: targetRows.map((row) => row.occurrenceId),
      applicationMode:
        targetSpec.completeResultingFieldText === undefined
          ? "EXACT_EXPRESSION_REPLACEMENT"
          : "COMPLETE_FIELD_REWRITE",
      resultingFieldScope:
        "RESIDUAL_ADJUDICATION_ONLY; combine with independently authorized safe-subset operations on the same verified preimage",
      replacementOperations,
      completeOriginalFieldText: first.verbatimText,
      completeOriginalFieldSha256: sha256(first.verbatimText),
      completeResultingFieldText: result,
      completeResultingFieldSha256: sha256(result),
    };
  });

  return {
    adjudicationId: decision.adjudicationId,
    status: "APPROVED_FOR_CLOSED_MIGRATION",
    summary: decision.summary,
    rationale: decision.rationale,
    sourceBasis: decision.sourceBasis,
    inputResidualOccurrenceIds: decision.occurrenceIds,
    bankPaths,
    targets,
  };
});

const unconsumed = residuals.filter((row) => !consumed.has(row.occurrenceId));
if (unconsumed.length > 0 || consumed.size !== residuals.length) {
  throw new Error(
    `Residual coverage mismatch: consumed=${consumed.size}, total=${residuals.length}, unconsumed=${unconsumed.map((row) => row.occurrenceId).join(",")}`,
  );
}

const jsonl = `${output.map((row) => JSON.stringify(row)).join("\n")}\n`;
writeFileSync(outputPath, jsonl);

const targetCount = output.reduce((sum, decision) => sum + decision.targets.length, 0);
const report = `# Temperature Prose Residual Adjudication\n\n` +
  `Generated from the accepted survey residuals without mutating canonical bank content.\n\n` +
  `- Decisions: ${output.length}\n` +
  `- Residual occurrences consumed exactly once: ${consumed.size}\n` +
  `- Authorized target fields: ${targetCount}\n` +
  `- Canonical bank writes in this pass: 0\n` +
  `- Input: \`review-residuals.jsonl\`\n` +
  `- Output: \`residual-adjudication.jsonl\`\n` +
  `- Output SHA-256: \`${sha256(jsonl)}\`\n\n` +
  `## Decisions\n\n` +
  output
    .map(
      (decision, index) =>
        `${index + 1}. **${decision.adjudicationId}** — ${decision.summary} (${decision.inputResidualOccurrenceIds.length} residual row${decision.inputResidualOccurrenceIds.length === 1 ? "" : "s"}, ${decision.targets.length} field${decision.targets.length === 1 ? "" : "s"})`,
    )
    .join("\n") +
  `\n\n## Closed-migration contract\n\n` +
  `Every target records its bank path, owner IDs, JSON path, survey occurrence IDs and indexes, complete original field text and hash, exact resulting expression or complete rewrite, and complete resulting field text and hash. A later applicator must reject any preimage mismatch.\n\n` +
  `The 16 survey rows classified as \`COUNTERPART_MISSING_TEMPERATURE\` remain known pre-existing parity debt. They are not residual adjudications and do not authorize adding or removing counterpart clinical facts.\n`;
writeFileSync(reportPath, report);

console.log(
  `temperature residual adjudication: decisions=${output.length} residuals=${consumed.size} fields=${targetCount}`,
);
