/**
 * Advisory — case-study stage reference integrity.
 *
 * Finds embedded case-study parts whose `stageId` or `answerableAfterStageId`
 * does not resolve to a declared `caseStudy.stages[].id` in the parent case.
 *
 * Can be run standalone:  tsx scripts/audit/audit-stage-refs.ts
 */

import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";
import type { AuditResult } from "./types";
import type { BankEnvelope, CaseStudyQuestion } from "../../src/types";

const PROMOTED_DIR = "banks";

export type StageReferenceFinding = {
  file: string;
  parentId: string;
  partId: string;
  field: "stageId" | "answerableAfterStageId";
  value: string;
  validStageIds: string[];
};

function collectCaseStudyStageReferenceFindings(
  question: CaseStudyQuestion,
  file: string,
): StageReferenceFinding[] {
  const validStageIds = (question.caseStudy.stages ?? []).map((stage) => stage.id);
  const validStageIdSet = new Set(validStageIds);
  const findings: StageReferenceFinding[] = [];

  for (const part of question.caseStudy.questions) {
    if (part.stageId !== undefined && !validStageIdSet.has(part.stageId)) {
      findings.push({
        file,
        parentId: question.id,
        partId: part.id,
        field: "stageId",
        value: part.stageId,
        validStageIds,
      });
    }
    if (part.answerableAfterStageId !== undefined && !validStageIdSet.has(part.answerableAfterStageId)) {
      findings.push({
        file,
        parentId: question.id,
        partId: part.id,
        field: "answerableAfterStageId",
        value: part.answerableAfterStageId,
        validStageIds,
      });
    }
  }

  return findings;
}

export function findStageReferenceFindings(
  banks: Array<{ bank: BankEnvelope; file: string }>,
): StageReferenceFinding[] {
  return banks.flatMap(({ bank, file }) =>
    bank.questions.flatMap((question) =>
      question.itemType === "case_study"
        ? collectCaseStudyStageReferenceFindings(question, file)
        : [],
    ),
  ).sort((left, right) =>
    left.file.localeCompare(right.file) ||
    left.parentId.localeCompare(right.parentId) ||
    left.partId.localeCompare(right.partId) ||
    left.field.localeCompare(right.field)
  );
}

export async function runAuditStageRefs(): Promise<AuditResult> {
  let files: string[];
  try {
    files = (await readdir(PROMOTED_DIR)).filter((file) => file.endsWith(".json")).sort();
  } catch {
    return {
      name: "audit:stage-refs",
      status: "INSUFFICIENT",
      failures: [],
      detail: `Bank directory ${PROMOTED_DIR} not found or not readable.`,
    };
  }

  const banks: Array<{ bank: BankEnvelope; file: string }> = [];
  for (const filename of files) {
    try {
      const text = await readFile(join(PROMOTED_DIR, filename), "utf8");
      const raw = parseBankText(text);
      const result = validateBankObject(raw, { rejectUnknownKeys: true });
      if (!result.ok) continue; // Tier 0 owns structural failures.
      banks.push({ bank: result.value, file: basename(filename) });
    } catch {
      // Tier 0 owns unreadable or unparseable bank files.
    }
  }

  const findings = findStageReferenceFindings(banks);
  if (findings.length === 0) {
    return {
      name: "audit:stage-refs",
      status: "PASS",
      failures: [],
      detail: `All embedded case-study stage references resolve across ${files.length} bank file(s).`,
    };
  }

  const failures = [...new Set(findings.map((finding) => finding.parentId))];
  const detail = [
    `${findings.length} unresolved embedded case-study stage reference(s) found.`,
    ...findings.map((finding) => {
      const valid = finding.validStageIds.length > 0 ? finding.validStageIds.join(",") : "(none declared)";
      return [
        `${finding.file}: ${finding.parentId} > ${finding.partId}`,
        `  ${finding.field}="${finding.value}" does not match any declared stage id.`,
        `  valid stage ids: ${valid}`,
      ].join("\n");
    }),
  ].join("\n");

  return {
    name: "audit:stage-refs",
    status: "WARN",
    failures,
    detail,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = await runAuditStageRefs();
  console.log(`[${result.status}] ${result.name}`);
  console.log(result.detail);
  if (result.failures.length > 0) {
    console.log(`Related IDs: ${result.failures.join(", ")}`);
  }
}
