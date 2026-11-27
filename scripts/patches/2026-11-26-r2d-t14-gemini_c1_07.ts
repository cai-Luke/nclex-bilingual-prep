/**
 * R2 D-2 tranche 14, unit 10: zh-only meaning repair for gemini_c1_07 (banks/gemini-canonical.json questions[280]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T14/producer/10/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_c1_07";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["testTakingStrategy","zh"],
    before: "记住：decerebrate（去大脑强直）中的“e”代表 extension（伸展）。伸展通常比屈曲（decorticate）更严重。",
    after: "记住：decerebrate（去大脑强直）中的“e”代表 extension（伸展）。伸展通常比屈曲（去皮质强直，decorticate）更严重。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
