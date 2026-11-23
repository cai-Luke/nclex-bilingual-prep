/**
 * R2 D-2 tranche 8, unit 15: zh-only meaning repair for ekg_b1_sata_07 (banks/visual-canonical.json questions[9]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T08/producer/15/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "ekg_b1_sata_07";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["testTakingStrategy","zh"],
    before: "应用心输出量原理：$CO = 心率 \times 搏出量$。在心动过速期间，舒张期缩短，从而降低了搏出量和心输出量。选择代表心输出量减少的全身性评估发现（肺、脑、血压、心肌），排除正常的外周参数。",
    after: "应用心输出量原理：心输出量（CO）= 心率（HR）× 搏出量（SV）。在心动过速期间，舒张期缩短，从而降低了搏出量和心输出量。选择代表心输出量减少的全身性评估发现（肺、脑、血压、心肌），排除正常的外周参数。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
