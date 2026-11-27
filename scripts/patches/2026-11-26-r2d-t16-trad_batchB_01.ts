/**
 * R2 D-2 tranche 16, unit 17: zh-only meaning repair for trad_batchB_01 (banks/gemini-canonical.json questions[497]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T16/producer/17/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "trad_batchB_01";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["testTakingStrategy","zh"],
    before: "使用首字母缩略词 EAT（评估 Evaluate、评估 Assess、教学 Teach）来记住不能委派给 UAP 的任务。",
    after: "使用首字母缩略词 EAT（评价 Evaluate、评估 Assess、教学 Teach）来记住不能委派给 UAP 的任务。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
