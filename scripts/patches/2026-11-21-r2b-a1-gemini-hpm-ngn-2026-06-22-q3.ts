import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const id = "gemini_hpm_ngn_2026_06_22_q3";
export const ops: PatchOp[] = [
  setValue({
    id,
    path: ["testTakingStrategy", "en"],
    before: "Use the guidelines from major pediatric associations. Match seat type (rear-facing) with appropriate strap positioning rules (at or below shoulders) and standard chest clip placement (armpits).",
    after: "Use the guidelines from major pediatric associations. Match seat type (rear-facing) with appropriate strap positioning rules (at or below shoulders) and the chest clip positioned at underarm level.",
  }),
  setValue({
    id,
    path: ["testTakingStrategy", "zh"],
    before: "利用主要儿科协会的指南。将安全座椅类型（后向式）与相应的安全带定位规则（肩膀水平或下方）及标准的胸夹位置（腋窝）进行匹配。",
    after: "利用主要儿科协会的指南。将安全座椅类型（后向式）与相应的安全带定位规则（肩膀水平或下方）及胸夹与腋窝齐平的位置进行匹配。",
  }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
