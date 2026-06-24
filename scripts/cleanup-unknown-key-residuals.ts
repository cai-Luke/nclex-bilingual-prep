import { readFile, writeFile } from "node:fs/promises";
import { parseBankText } from "../src/bankImport";
import { validateBankObject } from "../src/schema";
import { serializeBank } from "../lib/presentation-normalization";
import type { BankEnvelope, CaseStudyQuestion, Question } from "../src/types";

type CleanupChange = {
  file: string;
  id: string;
  path: string;
  action: string;
};

const write = process.argv.includes("--write");

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function deepEqual(left: unknown, right: unknown): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function requireBank(raw: unknown, file: string): BankEnvelope {
  const result = validateBankObject(raw);
  if (!result.ok) {
    throw new Error(`${file} failed pre-cleanup validation:\n${result.reasons.join("\n")}`);
  }
  return result.value;
}

function questionById(bank: BankEnvelope, id: string): Question {
  const question = bank.questions.find((candidate) => candidate.id === id);
  if (!question) throw new Error(`Expected question ${id} not found`);
  return question;
}

function embeddedById(parent: Question, id: string): Question {
  if (parent.itemType !== "case_study") {
    throw new Error(`${parent.id} is not a case_study`);
  }
  const question = parent.caseStudy.questions.find((candidate) => candidate.id === id);
  if (!question) throw new Error(`Expected embedded question ${id} not found in ${parent.id}`);
  return question;
}

function removeKey(
  target: Record<string, unknown>,
  key: string,
  changes: CleanupChange[],
  change: Omit<CleanupChange, "action">,
): void {
  if (!(key in target)) throw new Error(`Expected key ${key} at ${change.path}`);
  delete target[key];
  changes.push({ ...change, action: `removed ${key}` });
}

function cleanupGpt(bank: BankEnvelope): CleanupChange[] {
  const file = "banks/gpt-canonical.json";
  const changes: CleanupChange[] = [];

  const unsafe = questionById(bank, "gpt_case_unsafe_assignment_01");
  if (unsafe.itemType !== "case_study") throw new Error(`${unsafe.id} is not a case_study`);
  const caseStudy = unsafe.caseStudy as unknown as Record<string, unknown>;
  for (const key of ["rationale", "testTakingStrategy", "glossary"] as const) {
    if (!deepEqual(caseStudy[key], unsafe[key])) {
      throw new Error(`${unsafe.id}.caseStudy.${key} is not a duplicate of the question-level ${key}`);
    }
    removeKey(caseStudy, key, changes, {
      file,
      id: unsafe.id,
      path: `caseStudy.${key}`,
    });
  }

  const visual = questionById(bank, "gpt_fresh_2026_06_22_vis_07") as unknown as {
    meta?: Record<string, unknown>;
  };
  if (!isRecord(visual.meta) || !isRecord(visual.meta.custom) || Object.keys(visual.meta.custom).length !== 0) {
    throw new Error("gpt_fresh_2026_06_22_vis_07.meta.custom is not the expected empty object");
  }
  removeKey(visual.meta, "custom", changes, {
    file,
    id: "gpt_fresh_2026_06_22_vis_07",
    path: "meta.custom",
  });

  return changes;
}

function cleanupHardCases(bank: BankEnvelope): CleanupChange[] {
  const file = "banks/hard-cases-canonical.json";
  const changes: CleanupChange[] = [];

  const copd = questionById(bank, "cs_copd_01");
  const copdQ1 = embeddedById(copd, "cs_copd_01_q1");
  const byChoice = copdQ1.rationale.byChoice;
  if (!Array.isArray(byChoice) || byChoice.length !== 6) {
    throw new Error("cs_copd_01_q1.rationale.byChoice is not the expected six-entry array");
  }
  byChoice.forEach((choice, index) => {
    const record = choice as unknown as Record<string, unknown>;
    if (record.id !== choice.refId) {
      throw new Error(`cs_copd_01_q1.rationale.byChoice[${index}].id does not duplicate refId`);
    }
    removeKey(record, "id", changes, {
      file,
      id: "cs_copd_01_q1",
      path: `rationale.byChoice[${index}].id`,
    });
  });

  const tpn = questionById(bank, "opus_tpn_case_mucositis_01");
  const tpnQ3 = embeddedById(tpn, "opus_tpn_case_mucositis_01_q3");
  const glossaryTerm = tpnQ3.glossary[0] as unknown as Record<string, unknown>;
  if (typeof glossaryTerm.en !== "string" || !glossaryTerm.en.includes("Growth of the same organism")) {
    throw new Error("opus_tpn_case_mucositis_01_q3.glossary[0].en is not the expected stray definition");
  }
  removeKey(glossaryTerm, "en", changes, {
    file,
    id: "opus_tpn_case_mucositis_01_q3",
    path: "glossary[0].en",
  });

  const pph = questionById(bank, "gpt_pph_2026_06_16_case_01");
  const pphQ5 = embeddedById(pph, "gpt_pph_2026_06_16_case_01_q5");
  if (pphQ5.itemType !== "matrix") throw new Error(`${pphQ5.id} is not a matrix`);
  const matrix = pphQ5.matrix as unknown as Record<string, unknown>;
  if (!isRecord(matrix.correct)) {
    throw new Error("gpt_pph_2026_06_16_case_01_q5.matrix.correct is not the expected legacy object");
  }
  removeKey(matrix, "correct", changes, {
    file,
    id: pphQ5.id,
    path: "matrix.correct",
  });

  const suicide = questionById(bank, "opus12_case_inpatient_suicide_risk_01");
  if (suicide.itemType !== "case_study") throw new Error(`${suicide.id} is not a case_study`);
  const suicideCase = suicide.caseStudy as CaseStudyQuestion["caseStudy"] & {
    overview?: unknown;
  };
  if (suicideCase.summary !== undefined) {
    throw new Error(`${suicide.id}.caseStudy.summary already exists; refusing overview rename`);
  }
  if (!isRecord(suicideCase.overview)) {
    throw new Error(`${suicide.id}.caseStudy.overview is not the expected TextPair`);
  }
  suicideCase.summary = suicideCase.overview as { en: string; zh: string };
  delete suicideCase.overview;
  changes.push({
    file,
    id: suicide.id,
    path: "caseStudy.overview",
    action: "renamed overview to summary",
  });

  return changes;
}

function cleanupIo(bank: BankEnvelope): CleanupChange[] {
  const file = "banks/io-canonical.json";
  const changes: CleanupChange[] = [];
  if (!isRecord(bank.meta)) throw new Error("io-canonical meta is missing");
  for (const key of ["generatedAt", "lane", "bankIdPrefix"]) {
    removeKey(bank.meta, key, changes, {
      file,
      id: "(bank)",
      path: `meta.${key}`,
    });
  }
  return changes;
}

async function cleanupFile(
  file: string,
  cleaner: (bank: BankEnvelope) => CleanupChange[],
): Promise<CleanupChange[]> {
  const raw = parseBankText(await readFile(file, "utf8"));
  const bank = requireBank(raw, file);
  const changes = cleaner(bank);
  const result = validateBankObject(bank);
  if (!result.ok) {
    throw new Error(`${file} failed post-cleanup validation:\n${result.reasons.join("\n")}`);
  }
  if (write) await writeFile(file, serializeBank(result.value), "utf8");
  return changes;
}

const changes = [
  ...(await cleanupFile("banks/gpt-canonical.json", cleanupGpt)),
  ...(await cleanupFile("banks/hard-cases-canonical.json", cleanupHardCases)),
  ...(await cleanupFile("banks/io-canonical.json", cleanupIo)),
];

console.log(`Mode: ${write ? "write" : "dry-run"}`);
console.log(`Changes: ${changes.length}`);
for (const change of changes) {
  console.log(`- ${change.file} ${change.id} ${change.path}: ${change.action}`);
}
