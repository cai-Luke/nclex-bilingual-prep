/**
 * R2 D-2 tranche 8, unit 03: zh-only meaning repair for gemini_p7_10 (banks/gemini-canonical.json questions[130]).
 * Producer: Claude Opus 5.5 (claude-opus-5-5), Claude route per CT-5(f). Checker: Codex gpt-6.2-astra high.
 * Declared surface (CT-8): scratch/dogfood-r2-2026-11-20/D-2/T08/producer/03/declared-surface.json.
 * Only zh leaves change. No English, key, option ID or clinical fact changes. Single-language by design,
 * so this patch runs WITHOUT --strict-parity.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_p7_10";

export const ops: PatchOp[] = [
  setValue({
    id: ID, path: ["dropdowns",{"id":"1"},"options",{"id":"o1"},"zh"],
    before: "低渗（如 0.45% NaCl）",
    after: "低渗（如 0.45% 氯化钠）",
  }),
  setValue({
    id: ID, path: ["dropdowns",{"id":"1"},"options",{"id":"o2"},"zh"],
    before: "等渗（如 0.9% NaCl）",
    after: "等渗（如 0.9% 氯化钠）",
  }),
  setValue({
    id: ID, path: ["dropdowns",{"id":"1"},"options",{"id":"o3"},"zh"],
    before: "高渗（如 3% NaCl）",
    after: "高渗（如 3% 氯化钠）",
  }),
  setValue({
    id: ID, path: ["rationale","correct","zh"],
    before: "低渗溶液（如 0.45% NaCl）会导致细胞肿胀，从而加重脑水肿。高渗溶液（如 3% NaCl 或甘露醇）会将液体从细胞内拉出进入血管间隙，从而减轻肿胀。",
    after: "低渗溶液（如 0.45% 氯化钠）会导致细胞肿胀，从而加重脑水肿。高渗溶液（如 3% 氯化钠 或甘露醇）会将液体从细胞内拉出进入血管间隙，从而减轻肿胀。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
