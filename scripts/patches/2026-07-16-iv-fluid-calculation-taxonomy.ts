import { readFile, readdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { parseBankText } from "../../src/bankImport";
import { validateBankObject } from "../../src/schema";

type Expected = { category: string; topic: string };
type MigrationRow = {
  id: string;
  before: Expected;
  after: Expected;
  note: string;
};

const PHARM = "Pharmacological and Parenteral Therapies";
const IV_FLUID = "IV Fluid Calculations";

export const IV_FLUID_TAXONOMY_MANIFEST: readonly MigrationRow[] = [
  {
    id: "claude_a_fib_iv_drip_rate_25",
    before: { category: PHARM, topic: "Dosage Calculations" },
    after: { category: PHARM, topic: IV_FLUID },
    note: "Non-medication LR manual drip-rate arithmetic.",
  },
  {
    id: "dev_infusion_duration_vtbi_01",
    before: { category: PHARM, topic: "Dosage Calculations" },
    after: { category: PHARM, topic: IV_FLUID },
    note: "Generic IV-fluid pump completion-time arithmetic.",
  },
  {
    id: "gap_50_ppt_10",
    before: { category: PHARM, topic: "Dosage Calculations" },
    after: { category: PHARM, topic: IV_FLUID },
    note: "Non-medication saline manual drip-rate arithmetic.",
  },
  {
    id: "gemini_p6_iv_01",
    before: { category: PHARM, topic: "Dosage Calculations" },
    after: { category: PHARM, topic: IV_FLUID },
    note: "Non-medication saline pump-rate arithmetic.",
  },
  {
    id: "gemini_p6_iv_02",
    before: { category: PHARM, topic: "Dosage Calculations" },
    after: { category: PHARM, topic: IV_FLUID },
    note: "Non-medication LR manual drip-rate arithmetic.",
  },
  {
    id: "gemini_p6_iv_03",
    before: { category: PHARM, topic: "Dosage Calculations" },
    after: { category: PHARM, topic: IV_FLUID },
    note: "Remaining-volume arithmetic for a generic IV-fluid infusion.",
  },
  {
    id: "gemini_jun05_b_fib_pediatric_04",
    before: { category: "Reduction of Risk Potential", topic: "Pediatric & Adolescent Health" },
    after: { category: PHARM, topic: IV_FLUID },
    note: "Prescribed pediatric maintenance-IV-fluid arithmetic.",
  },
  {
    id: "gpt_2026_07_03_2114_t1_06_dka_fluid_fib",
    before: { category: "Physiological Adaptation", topic: "Diabetic Ketoacidosis (DKA)" },
    after: { category: PHARM, topic: IV_FLUID },
    note: "Supplied DKA order-set coefficient used only to calculate prescribed first-hour fluid.",
  },
  {
    id: "sepsis_pneumonia_fluid_calc",
    before: { category: "Physiological Adaptation", topic: "Sepsis & Septic Shock" },
    after: { category: PHARM, topic: IV_FLUID },
    note: "Embedded leaf calculates a prescribed non-medication LR bolus from a supplied coefficient.",
  },
  {
    id: "gemini_jun05_b_fib_fluid_03",
    before: { category: "Physiological Adaptation", topic: "Dosage Calculations" },
    after: { category: "Basic Care and Comfort", topic: "Nutritional & Fluid Support" },
    note: "Separate residual: keyed intake/output net-balance arithmetic, not prescribed IV-fluid therapy.",
  },
] as const;

type JsonRecord = Record<string, any>;

const collectQuestions = (questions: JsonRecord[]): JsonRecord[] =>
  questions.flatMap((question) => [
    question,
    ...(question.itemType === "case_study" && Array.isArray(question.caseStudy?.questions)
      ? collectQuestions(question.caseStudy.questions)
      : []),
  ]);

const write = process.argv.includes("--write");
const files = (await readdir("banks"))
  .filter((file) => file.endsWith("-canonical.json"))
  .sort()
  .map((file) => join("banks", file));

const seen = new Map<string, string[]>();
let changedFiles = 0;

for (const file of files) {
  const raw = parseBankText(await readFile(file, "utf8")) as JsonRecord;
  const beforeValidation = validateBankObject(raw, { rejectUnknownKeys: true });
  if (!beforeValidation.ok) throw new Error(`${basename(file)} failed before migration:\n${beforeValidation.reasons.join("\n")}`);

  let fileChanged = false;
  for (const question of collectQuestions(raw.questions ?? [])) {
    const row = IV_FLUID_TAXONOMY_MANIFEST.find((candidate) => candidate.id === question.id);
    if (!row) continue;
    seen.set(row.id, [...(seen.get(row.id) ?? []), basename(file)]);
    if (question.category !== row.before.category || question.topic !== row.before.topic) {
      throw new Error(
        `${row.id} precondition failed: expected ${row.before.category} / ${row.before.topic}; ` +
        `found ${question.category} / ${question.topic}`,
      );
    }
    question.category = row.after.category;
    question.topic = row.after.topic;
    fileChanged = true;
  }

  const afterValidation = validateBankObject(raw, { rejectUnknownKeys: true });
  if (!afterValidation.ok) throw new Error(`${basename(file)} failed after migration:\n${afterValidation.reasons.join("\n")}`);
  if (fileChanged) {
    changedFiles += 1;
    if (write) await writeFile(file, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
  }
}

for (const row of IV_FLUID_TAXONOMY_MANIFEST) {
  const locations = seen.get(row.id) ?? [];
  if (locations.length !== 1) throw new Error(`${row.id} resolved to ${locations.length} records; expected exactly 1.`);
}

console.log(`${write ? "Applied" : "Would apply"} ${IV_FLUID_TAXONOMY_MANIFEST.length} IV-fluid taxonomy rows across ${changedFiles} files.`);
