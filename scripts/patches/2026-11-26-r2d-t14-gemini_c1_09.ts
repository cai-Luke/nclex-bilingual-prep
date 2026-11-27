/**
 * R2 D-2 tranche 14, unit 11: zh-only meaning repair for gemini_c1_09 (banks/gemini-canonical.json questions[282]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T14/producer/11/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_c1_09";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["testTakingStrategy","zh"],
    before: "将“de-CORE-ticate”与向身体核心 (CORE) 的屈曲联系起来。",
    after: "将英文“de-CORE-ticate”（去皮质强直）与向身体核心 (CORE) 的屈曲联系起来。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
