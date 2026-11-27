/**
 * R2 D-2 tranche 14, unit 06: zh-only meaning repair for gemini_b2_08 (banks/gemini-canonical.json questions[201]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T14/producer/06/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_b2_08";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["rationale","byChoice",{"refId":"D"},"zh"],
    before: "与抗凝剂合用时，阿司匹林和 NSAIDs 会增加胃肠道出血风险。",
    after: "与抗凝剂合用时，阿司匹林和非甾体抗炎药 (NSAIDs) 会增加胃肠道出血风险。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
