import { validateBankObject } from "./schema";
import type { QuestionRecord } from "./types";

const modules = import.meta.glob("../banks/*.json", { eager: true, import: "default" });

export const loadBundledRecords = (): { records: QuestionRecord[]; errors: string[] } => {
  const records: QuestionRecord[] = [];
  const errors: string[] = [];
  for (const [path, raw] of Object.entries(modules)) {
    const result = validateBankObject(raw);
    if (!result.ok) {
      errors.push(`${path}: ${result.reasons.join("; ")}`);
      continue;
    }
    result.value.questions.forEach((question) => {
      records.push({
        question,
        sourceKind: "bundled",
        sourceLabel: path.split("/").pop()?.replace(/\.json$/i, "") || "Bundled",
      });
    });
  }
  return { records, errors };
};
