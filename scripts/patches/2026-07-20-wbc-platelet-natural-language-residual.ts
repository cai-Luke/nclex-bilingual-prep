import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { replaceText, runPatch } from "../patch-raw";

const id = "opus_agvd_case_agvhd_01";
const bankPath = "banks/gemini-canonical.json";
const reason = "owner-adjudicated exact bilingual normalization of the sole WBC/platelet natural-language residual pair";
const replacements = [
  {
    language: "en" as const,
    before: "platelet transfusion threshold of ten thousand per microliter",
    after: "platelet transfusion threshold of 10 ×10³/µL",
  },
  {
    language: "zh" as const,
    before: "血小板输注阈值为1万/微升",
    after: "血小板输注阈值为 10 ×10³/µL",
  },
];

if (process.argv.includes("--dry-run")) {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const bank = JSON.parse(fs.readFileSync(path.join(repoRoot, bankPath), "utf8")) as {
    questions: Array<{ id: string; caseStudy?: { summary?: { en?: string; zh?: string } } }>;
  };
  const matches = bank.questions.filter((question) => question.id === id);
  if (matches.length !== 1) throw new Error(`${id} matched ${matches.length} questions`);
  const summary = matches[0].caseStudy?.summary;
  if (!summary) throw new Error(`${id} is missing caseStudy.summary`);
  const states = replacements.map(({ language, before, after }) => {
    const value = summary[language];
    if (value?.includes(before)) return "before" as const;
    if (value?.includes(after)) return "after" as const;
    throw new Error(`Stale precondition at caseStudy.summary.${language}`);
  });
  if (new Set(states).size !== 1) throw new Error("Residual pair is partially applied");
  console.log(JSON.stringify({ bankPath, id, changedPaths: 2, bankWritesRequired: states[0] === "before" ? 1 : 0 }, null, 2));
} else {
  runPatch(replacements.map(({ language, before, after }) => replaceText({
    id,
    path: ["caseStudy", "summary", language],
    before,
    after,
    note: "Owner-adjudicated exact bilingual residual closure; platelet threshold magnitude and surrounding prose preserved.",
  })));
}

