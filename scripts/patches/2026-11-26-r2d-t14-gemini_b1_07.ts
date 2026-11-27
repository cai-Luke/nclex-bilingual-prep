/**
 * R2 D-2 tranche 14, unit 03: zh-only meaning repair for gemini_b1_07 (banks/gemini-canonical.json questions[182]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T14/producer/03/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_b1_07";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["testTakingStrategy","zh"],
    before: "思考 MONA-B 各个组成部分的主要作用机制。",
    after: "思考 MONA-B（吗啡、氧气、硝酸甘油、阿司匹林、β受体阻滞剂的英文首字母缩写）各个组成部分的主要作用机制。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
