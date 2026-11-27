/**
 * R2 D-2 tranche 14, unit 04: zh-only meaning repair for gemini_b10_06 (banks/gemini-canonical.json questions[189]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T14/producer/04/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_b10_06";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["testTakingStrategy","zh"],
    before: "记住 'decerebrate' 有很多个 'e'，代表 'extension'（伸展）。",
    after: "记住英文 'decerebrate'（去大脑强直）中有很多个 'e'，代表 'extension'（伸展）。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
