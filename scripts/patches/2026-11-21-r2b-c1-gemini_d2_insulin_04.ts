/**
 * R2 B-2 tranche C1 (B-2R, Claude route): gemini_d2_insulin_04 (banks/gemini-canonical.json questions[402]).
 * P4 positional-reference / internal-token rewrite. Declared surface: rationale.correct.en, rationale.correct.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) fec3219d44f3d7df5cb0e9d6b595b4e65644d59f6dd10b8b4c961c059b0eed46. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "gemini_d2_insulin_04";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["rationale","correct","en"],
    before: "Correct practices include refrigerating unopened insulin, keeping opened vials at room temperature for about a month to reduce injection site irritation, carrying glucose sources for hypoglycemia, and adjusting for exercise (E). Rotating injection sites within one anatomical area is necessary, but injecting into the 'same spot' every day causes lipodystrophy.",
    after: "Correct practices include refrigerating unopened insulin, keeping opened vials at room temperature for about a month to reduce injection site irritation, carrying glucose sources for hypoglycemia, and adjusting for exercise. Rotating injection sites within one anatomical area is necessary, but injecting into the 'same spot' every day causes lipodystrophy.",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
  setValue({ id: ID, path: ["rationale","correct","zh"],
    before: "正确的做法包括：冷藏未开封的胰岛素；已开封的药瓶可在室温下保存约一个月以减少注射部位刺激；随身携带葡萄糖源以备低血糖；以及根据运动情况进行调整 (E)。在同一个解剖区域内轮换注射部位是必要的，但每天在“同一个点”注射 会导致脂肪营养不良。",
    after: "正确的做法包括：冷藏未开封的胰岛素；已开封的药瓶可在室温下保存约一个月以减少注射部位刺激；随身携带葡萄糖源以备低血糖；以及根据运动情况进行调整。在同一个解剖区域内轮换注射部位是必要的，但每天在“同一个点”注射 会导致脂肪营养不良。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 1 occurrence(s); kinds DELETE_TOKEN_PAREN." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
