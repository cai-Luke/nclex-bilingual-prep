/**
 * R2 B-2 tranche C1 (B-2R, Claude route): ekg_b2_sata_06 (banks/visual-canonical.json questions[18]).
 * P4 positional-reference / internal-token rewrite. Declared surface: testTakingStrategy.en, testTakingStrategy.zh.
 * Generated from DECLARED-SURFACE.json sha256 75573a9284b88ed993fb04fe64a0abb6024f75d99e2ed1c801c50ab3155c8f87. Key, options and every other field unchanged.
 * Base item hash (json2) 0c084ab3479b247fb3f489c12f8ed524db39ce55fd53b0f0cede1caeacdcdc7c. Candidate only; integration belongs to a later INT-R2 order.
 */
import { pathToFileURL } from "node:url";
import { runPatch, setValue, type PatchOp } from "../patch-raw";

const ID = "ekg_b2_sata_06";

export const ops: PatchOp[] = [
  setValue({ id: ID, path: ["testTakingStrategy","en"],
    before: "Recall the classic patient-education points before administering adenosine: 'You will feel a flush, chest pressure, short of breath, and your heart may pause.' Use these common, transient effects to select options A, B, C, and E. Eliminate major dangerous non-side-effects (seizures, severe hypertension).",
    after: "Recall the classic patient-education points before administering adenosine: 'You will feel a flush, chest pressure, short of breath, and your heart may pause.' Use these common, transient effects to select facial flushing, chest pressure, shortness of breath, and a brief cardiac pause. Eliminate major dangerous non-side-effects (seizures, severe hypertension).",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 4 occurrence(s); kinds RESTATE_CONTENT." }),
  setValue({ id: ID, path: ["testTakingStrategy","zh"],
    before: "回忆使用腺苷前经典的患者宣教要点：“你会感到发热潮红、胸闷压迫感、呼吸急促，且你的心脏可能会停跳。” 利用这些常见、短暂的效应来选择选项 A、B、C 和 E。排除重大危险的非副作用（抽搐、严重高血压）。",
    after: "回忆使用腺苷前经典的患者宣教要点：“你会感到发热潮红、胸闷压迫感、呼吸急促，且你的心脏可能会停跳。” 利用这些常见、短暂的效应来选择面部潮红、胸骨后压迫感、呼吸急促和短暂的心脏停搏。排除重大危险的非副作用（抽搐、严重高血压）。",
    note: "R2 B-2R P4 reference rewrite: 1 edit(s) covering 4 occurrence(s); kinds RESTATE_CONTENT." }),
];

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) runPatch(ops);
